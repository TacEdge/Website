/**
 * localStorage guarded for embedded/sandboxed contexts where storage access
 * may throw. Falls back to an in-memory map so the app still works for the
 * session (demo hosting, strict privacy modes).
 */

const memory = new Map<string, string>()

function available(): boolean {
  try {
    const probe = '__tacedge_probe__'
    window.localStorage.setItem(probe, '1')
    window.localStorage.removeItem(probe)
    return true
  } catch {
    return false
  }
}

const hasLocalStorage = typeof window !== 'undefined' && available()

export const safeStorage = {
  getItem(key: string): string | null {
    if (hasLocalStorage) return window.localStorage.getItem(key)
    return memory.get(key) ?? null
  },
  setItem(key: string, value: string): void {
    if (hasLocalStorage) window.localStorage.setItem(key, value)
    else memory.set(key, value)
  },
  removeItem(key: string): void {
    if (hasLocalStorage) window.localStorage.removeItem(key)
    else memory.delete(key)
  },
  /** True when data really persists across launches on this device. */
  persistent: hasLocalStorage,
}
