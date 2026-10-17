import { computed, onScopeDispose, ref, watch } from 'vue'
import { site } from '../data/site'
import { useMediaQuery } from './useMediaQuery'

export type Theme = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'portfolio-theme'

function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark'
}

function readStoredTheme(): Theme | null {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY)
    return isTheme(value) ? value : null
  } catch {
    // Storage can be unavailable (private mode, blocked cookies); fall back to the system theme.
    return null
  }
}

function writeStoredTheme(theme: Theme): void {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // The choice still applies for this visit.
  }
}

function applyTheme(theme: Theme): void {
  const root = document.documentElement
  root.dataset.theme = theme
  root.style.colorScheme = theme
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', site.themeColors[theme])
}

/**
 * Light/dark theme. Until the visitor makes a choice the system preference is followed live;
 * an explicit choice is persisted in localStorage. The initial attribute is also set by an
 * inline script in index.html so the first paint already uses the right theme.
 */
export function useTheme() {
  const systemPrefersDark = useMediaQuery('(prefers-color-scheme: dark)')
  const stored = ref<Theme | null>(readStoredTheme())

  const theme = computed<Theme>(() => stored.value ?? (systemPrefersDark.value ? 'dark' : 'light'))
  const isDark = computed(() => theme.value === 'dark')

  // Keep several tabs in sync.
  const onStorage = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY || event.key === null) stored.value = readStoredTheme()
  }
  window.addEventListener('storage', onStorage)
  onScopeDispose(() => window.removeEventListener('storage', onStorage))

  // Synchronous so the attribute never lags behind the toggle's own state (one cheap DOM write).
  watch(theme, applyTheme, { immediate: true, flush: 'sync' })

  function setTheme(next: Theme) {
    stored.value = next
    writeStoredTheme(next)
  }

  function toggleTheme() {
    setTheme(isDark.value ? 'light' : 'dark')
  }

  return { theme, isDark, setTheme, toggleTheme }
}
