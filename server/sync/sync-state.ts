/**
 * In-memory sync state management.
 *
 * This module maintains a singleton object that tracks the current state
 * of the sync operation. It is updated by the sync trigger procedure and
 * read by the sync-status polling procedure.
 *
 * Note: This state lives in the Node.js process memory and will be lost
 * on server restart. This is acceptable because sync operations are
 * short-lived (< 60s) and the state is only used for real-time UI updates.
 */
export interface SyncState {
  isSyncing: boolean;
  lastSyncTime: string | null;
  lastSyncStatus: 'success' | 'error' | 'pending' | 'idle';
  rowsProcessed: number;
  rowsInserted: number;
  rowsUpdated: number;
  errors: string[];
  currentStep: string;
}

const initialState: SyncState = {
  isSyncing: false,
  lastSyncTime: null,
  lastSyncStatus: 'idle',
  rowsProcessed: 0,
  rowsInserted: 0,
  rowsUpdated: 0,
  errors: [],
  currentStep: '',
};

// Global singleton — survives across API route invocations within the same process
let syncState: SyncState = { ...initialState };

/**
 * Get the current sync state (read-only snapshot).
 */
export function getSyncState(): Readonly<SyncState> {
  return { ...syncState };
}

/**
 * Update the sync state with a partial update.
 */
export function updateSyncState(update: Partial<SyncState>): void {
  syncState = { ...syncState, ...update };
}

/**
 * Reset the sync state to initial values (except lastSyncTime and lastSyncStatus).
 */
export function resetSyncState(): void {
  syncState = {
    ...initialState,
    lastSyncTime: syncState.lastSyncTime,
    lastSyncStatus: syncState.lastSyncStatus,
  };
}

/**
 * Mark sync as started.
 */
export function markSyncStarted(): void {
  syncState = {
    isSyncing: true,
    lastSyncTime: syncState.lastSyncTime,
    lastSyncStatus: 'pending',
    rowsProcessed: 0,
    rowsInserted: 0,
    rowsUpdated: 0,
    errors: [],
    currentStep: 'Initializing sync...',
  };
}

/**
 * Mark sync as completed successfully.
 */
export function markSyncCompleted(result: {
  rowsProcessed: number;
  rowsInserted: number;
  rowsUpdated: number;
  errors: string[];
}): void {
  syncState = {
    isSyncing: false,
    lastSyncTime: new Date().toISOString(),
    lastSyncStatus: result.errors.length > 0 ? 'error' : 'success',
    rowsProcessed: result.rowsProcessed,
    rowsInserted: result.rowsInserted,
    rowsUpdated: result.rowsUpdated,
    errors: result.errors,
    currentStep: 'Sync complete',
  };
}

/**
 * Mark sync as failed.
 */
export function markSyncFailed(error: string): void {
  syncState = {
    isSyncing: false,
    lastSyncTime: new Date().toISOString(),
    lastSyncStatus: 'error',
    rowsProcessed: syncState.rowsProcessed,
    rowsInserted: syncState.rowsInserted,
    rowsUpdated: syncState.rowsUpdated,
    errors: [...syncState.errors, error],
    currentStep: 'Sync failed',
  };
}
