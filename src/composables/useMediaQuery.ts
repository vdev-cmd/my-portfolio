import { onScopeDispose, readonly, ref } from 'vue'

/** Reactive `window.matchMedia`. The listener is removed when the calling scope is disposed. */
export function useMediaQuery(query: string) {
  const matches = ref(false)

  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return readonly(matches)
  }

  const mediaQuery = window.matchMedia(query)
  matches.value = mediaQuery.matches

  const onChange = (event: MediaQueryListEvent) => {
    matches.value = event.matches
  }
  mediaQuery.addEventListener('change', onChange)
  onScopeDispose(() => mediaQuery.removeEventListener('change', onChange))

  return readonly(matches)
}
