/**
 * handleSync — Core sync workflow.
 *
 * Adapted from the Phase 4 Next.js API route into a standalone async function
 * that can be called from a tRPC procedure.
 */
import { config, type SyncResult } from './config';
import { fetchAllProductRows, parseSheetRows } from './sheets';
import { validateRows } from './validate';
import { batchUpsert, getConnection } from './db';
import { appendSyncLog, buildSyncLogEntry, type SyncStatus } from './logger';
import {
  getSyncState,
  updateSyncState,
  markSyncStarted,
  markSyncCompleted,
  markSyncFailed,
} from './sync-state';
import type { PoolConnection } from 'mysql2/promise';

interface SyncOperationState {
  conn: PoolConnection | null;
  transactionStarted: boolean;
  timedOut: boolean;
}

/**
 * Execute a full Google Sheet → MySQL sync.
 * Returns the SyncResult. Throws on catastrophic failure.
 */
export async function handleSync(): Promise<SyncResult> {
  // Prevent concurrent syncs
  const currentState = getSyncState();
  if (currentState.isSyncing) {
    return {
      success: false,
      rowsProcessed: 0,
      rowsUpdated: 0,
      rowsInserted: 0,
      errors: ['A sync operation is already in progress'],
      syncLogId: null,
    };
  }

  // Mark sync as started
  markSyncStarted();

  const state: SyncOperationState = {
    conn: null,
    transactionStarted: false,
    timedOut: false,
  };

  const startTime = Date.now();

  // Set up hard timeout
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      state.timedOut = true;
      reject(new Error('SYNC_TIMEOUT: operation exceeded 60 seconds'));
    }, config.syncTimeoutMs);
  });

  try {
    const result = await Promise.race([
      executeSyncWorkflow(state, startTime),
      timeoutPromise,
    ]);

    return result;
  } catch (error: any) {
    // Handle timeout or catastrophic errors
    if (state.transactionStarted && state.conn) {
      try {
        await state.conn.rollback();
        console.error('[sync] Transaction rolled back due to error');
      } catch (rollbackErr) {
        console.error('[sync] Rollback failed:', rollbackErr);
      }
    }

    const errorMessage = state.timedOut
      ? 'Sync timed out after 60 seconds. Transaction rolled back.'
      : `Sync failed: ${error.message}`;

    // Update in-memory state
    markSyncFailed(errorMessage);

    // Attempt to log the error to the Sync Log sheet
    try {
      await appendSyncLog([
        buildSyncLogEntry({
          rowsInserted: 0,
          rowsUpdated: 0,
          rowsSkipped: 0,
          errors: [errorMessage],
          overallStatus: 'ERROR',
        }),
      ]);
    } catch (logErr) {
      console.error('[sync] Failed to write error to Sync Log:', logErr);
    }

    return {
      success: false,
      rowsProcessed: 0,
      rowsUpdated: 0,
      rowsInserted: 0,
      errors: [errorMessage],
      syncLogId: null,
    };
  } finally {
    if (state.conn) {
      try {
        state.conn.release();
      } catch (_) {
        // ignore
      }
    }
  }
}

/**
 * Core sync workflow with in-memory state updates.
 */
async function executeSyncWorkflow(
  state: SyncOperationState,
  startTime: number
): Promise<SyncResult> {
  console.log('[sync] Starting sync workflow...');

  // ── Step 1: Fetch all products from Google Sheet ──
  updateSyncState({ currentStep: 'Fetching products from Google Sheet...' });
  console.log('[sync] Fetching products from Google Sheet...');
  const rawRows = await fetchAllProductRows();
  const totalDataRows = rawRows.length - 1;
  console.log(`[sync] Fetched ${totalDataRows} data rows from sheet`);
  updateSyncState({
    currentStep: `Fetched ${totalDataRows} rows from sheet`,
    rowsProcessed: totalDataRows,
  });

  if (state.timedOut) throw new Error('SYNC_TIMEOUT');

  // ── Step 2: Parse and validate ──
  updateSyncState({ currentStep: 'Parsing and validating rows...' });
  console.log('[sync] Parsing and validating rows...');
  const parsed = parseSheetRows(rawRows);
  const { valid, errors } = validateRows(parsed);
  console.log(
    `[sync] Validation complete: ${valid.length} valid, ${errors.length} errors`
  );
  updateSyncState({
    currentStep: `Validated: ${valid.length} valid, ${errors.length} errors`,
  });

  if (state.timedOut) throw new Error('SYNC_TIMEOUT');

  // ── Step 3: Database transaction ──
  updateSyncState({ currentStep: 'Upserting to database...' });
  console.log('[sync] Starting database transaction...');
  state.conn = await getConnection();
  await state.conn.beginTransaction();
  state.transactionStarted = true;

  const upsertResult = await batchUpsert(state.conn, valid);
  console.log(
    `[sync] Upsert complete: ${upsertResult.rowsInserted} inserted, ${upsertResult.rowsUpdated} updated`
  );
  updateSyncState({
    rowsInserted: upsertResult.rowsInserted,
    rowsUpdated: upsertResult.rowsUpdated,
    currentStep: `Upserted: ${upsertResult.rowsInserted} inserted, ${upsertResult.rowsUpdated} updated`,
  });

  if (state.timedOut) throw new Error('SYNC_TIMEOUT');

  // ── Step 4: Commit ──
  updateSyncState({ currentStep: 'Committing transaction...' });
  await state.conn.commit();
  state.transactionStarted = false;
  console.log('[sync] Transaction committed');

  // ── Step 5: Determine status ──
  const rowsSkipped = errors.length;
  let overallStatus: SyncStatus;
  if (rowsSkipped === 0) {
    overallStatus = 'SUCCESS';
  } else if (valid.length > 0) {
    overallStatus = 'PARTIAL_SUCCESS';
  } else {
    overallStatus = 'ERROR';
  }

  // ── Step 6: Log to Sync Log tab ──
  updateSyncState({ currentStep: 'Writing sync log...' });
  console.log('[sync] Writing to Sync Log sheet...');
  let syncLogId: string | null = null;
  try {
    syncLogId = await appendSyncLog([
      buildSyncLogEntry({
        rowsInserted: upsertResult.rowsInserted,
        rowsUpdated: upsertResult.rowsUpdated,
        rowsSkipped,
        errors,
        overallStatus,
      }),
    ]);
  } catch (logErr: any) {
    console.error('[sync] Failed to write Sync Log:', logErr.message);
    errors.push(`Failed to write sync log: ${logErr.message}`);
  }

  const elapsed = Date.now() - startTime;
  console.log(`[sync] Sync completed in ${elapsed}ms`);

  // ── Step 7: Update in-memory state and return ──
  markSyncCompleted({
    rowsProcessed: totalDataRows,
    rowsInserted: upsertResult.rowsInserted,
    rowsUpdated: upsertResult.rowsUpdated,
    errors,
  });

  return {
    success: overallStatus !== 'ERROR',
    rowsProcessed: totalDataRows,
    rowsUpdated: upsertResult.rowsUpdated,
    rowsInserted: upsertResult.rowsInserted,
    errors,
    syncLogId,
  };
}
