import { useSyncExternalStore } from 'react'

/**
 * Tiny external store for sync status. Mutations report in here so the
 * top bar can show Synced / Saving / Offline / Sync failed truthfully.
 */

export interface SyncState {
  pending: number
  lastSyncedAt: number | null
  lastError: string | null
}

let state: SyncState = { pending: 0, lastSyncedAt: null, lastError: null }
const listeners = new Set<() => void>()

function emit(next: Partial<SyncState>) {
  state = { ...state, ...next }
  listeners.forEach((l) => l())
}

export const syncState = {
  begin: () => emit({ pending: state.pending + 1 }),
  success: () =>
    emit({ pending: Math.max(0, state.pending - 1), lastSyncedAt: Date.now(), lastError: null }),
  failure: (message: string) =>
    emit({ pending: Math.max(0, state.pending - 1), lastError: message }),
  loaded: () => emit({ lastSyncedAt: Date.now() }),
  clearError: () => emit({ lastError: null }),
}

export function useSyncState(): SyncState {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    () => state,
  )
}

export function useOnline(): boolean {
  return useSyncExternalStore(
    (listener) => {
      window.addEventListener('online', listener)
      window.addEventListener('offline', listener)
      return () => {
        window.removeEventListener('online', listener)
        window.removeEventListener('offline', listener)
      }
    },
    () => navigator.onLine,
  )
}
