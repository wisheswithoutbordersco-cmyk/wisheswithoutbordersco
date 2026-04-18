/**
 * Sync Engine — barrel export.
 *
 * Re-exports the public API of the sync engine so consumers
 * can import from `./sync` instead of individual modules.
 */
export { config, type ProductRow, type SyncResult } from './config';
export { fetchAllProductRows, parseSheetRows, getSheetsClient, fetchSyncLogRows } from './sheets';
export { validateRows, type ValidationResult } from './validate';
export { getPool, closePool, getConnection, batchUpsert, type UpsertResult } from './db';
export { appendSyncLog, buildSyncLogEntry, type SyncLogEntry, type SyncStatus, type SyncAction } from './logger';
export { getSyncState, updateSyncState, resetSyncState, markSyncStarted, markSyncCompleted, markSyncFailed, type SyncState } from './sync-state';
export { handleSync } from './handleSync';
