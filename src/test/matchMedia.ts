type Listener = (event: MediaQueryListEvent) => void

/**
 * Installs a controllable `window.matchMedia` (jsdom does not implement it).
 * Call `controller.set(query, matches)` to flip a query and notify its listeners.
 */
export function installMatchMedia(initial: Record<string, boolean> = {}) {
  const state = new Map<string, boolean>(Object.entries(initial))
  const listeners = new Map<string, Set<Listener>>()

  const create = (query: string) => ({
    get matches() {
      return state.get(query) ?? false
    },
    media: query,
    onchange: null,
    addEventListener: (_type: string, listener: Listener) => {
      const set = listeners.get(query) ?? new Set<Listener>()
      set.add(listener)
      listeners.set(query, set)
    },
    removeEventListener: (_type: string, listener: Listener) => {
      listeners.get(query)?.delete(listener)
    },
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })

  window.matchMedia = ((query: string) => create(query)) as unknown as typeof window.matchMedia

  return {
    set(query: string, matches: boolean) {
      state.set(query, matches)
      listeners
        .get(query)
        ?.forEach((listener) => listener({ matches, media: query } as MediaQueryListEvent))
    },
    listenerCount(query: string) {
      return listeners.get(query)?.size ?? 0
    },
  }
}
