import { getSheetsClient } from './sheets';
import { config } from './config';
import { nanoid } from 'nanoid';

export type SyncAction = 'INSERT' | 'UPDATE' | 'SKIP' | 'FULL_SYNC';
export type SyncStatus = 'SUCCESS' | 'PARTIAL_SUCCESS' | 'ERROR';

export interface SyncLogEntry {
  timestamp: string;
  action: string;
  rows_affected: number;
  status: SyncStatus;
  error_details: string;
}

/**
 * Append one or more rows to the Sync Log tab (Sheet2).
 * Returns the generated sync log ID (UUID).
 */
export async function appendSyncLog(entries: SyncLogEntry[]): Promise<string> {
  const sheets = await getSheetsClient();
  const syncLogId = nanoid();

  const rows = entries.map((entry) => [
    entry.timestamp,
    entry.action,
    String(entry.rows_affected),
    entry.status,
    entry.error_details,
  ]);

  await sheets.spreadsheets.values.append({
    spreadsheetId: config.googleSheetId,
    range: `${config.syncLogTab}!A:E`,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values: rows,
    },
  });

  return syncLogId;
}

/**
 * Build a summary sync log entry from the sync result data.
 */
export function buildSyncLogEntry(params: {
  rowsInserted: number;
  rowsUpdated: number;
  rowsSkipped: number;
  errors: string[];
  overallStatus: SyncStatus;
}): SyncLogEntry {
  const { rowsInserted, rowsUpdated, rowsSkipped, errors, overallStatus } = params;

  const actionParts: string[] = [];
  if (rowsInserted > 0) actionParts.push(`INSERT(${rowsInserted})`);
  if (rowsUpdated > 0) actionParts.push(`UPDATE(${rowsUpdated})`);
  if (rowsSkipped > 0) actionParts.push(`SKIP(${rowsSkipped})`);
  const action = actionParts.length > 0 ? actionParts.join('|') : 'FULL_SYNC';

  const totalAffected = rowsInserted + rowsUpdated;

  // Truncate error details to avoid exceeding cell limits (50,000 chars)
  let errorDetails = errors.join('; ');
  if (errorDetails.length > 10_000) {
    errorDetails = errorDetails.slice(0, 10_000) + '... [truncated]';
  }

  return {
    timestamp: new Date().toISOString(),
    action,
    rows_affected: totalAffected,
    status: overallStatus,
    error_details: errorDetails || '',
  };
}
