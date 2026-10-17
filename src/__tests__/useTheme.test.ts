import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { THEME_STORAGE_KEY, useTheme } from '@/composables/useTheme'
import { installMatchMedia } from '@/test/matchMedia'

const DARK_QUERY = '(prefers-color-scheme: dark)'

function mountTheme() {
  let api!: ReturnType<typeof useTheme>
  const wrapper = mount(
    defineComponent({
      setup() {
        api = useTheme()
        return () => null
      },
    }),
  )
  return { api, wrapper }
}

function addThemeColorMeta() {
  const meta = document.createElement('meta')
  meta.name = 'theme-color'
  meta.content = '#ffffff'
  document.head.appendChild(meta)
  return meta
}

describe('useTheme', () => {
  it('follows a dark system preference when nothing is stored', () => {
    installMatchMedia({ [DARK_QUERY]: true })
    const { api } = mountTheme()
    expect(api.theme.value).toBe('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('falls back to light when the system has no dark preference', () => {
    const { api } = mountTheme()
    expect(api.theme.value).toBe('light')
    expect(document.documentElement.dataset.theme).toBe('light')
  })

  it('prefers a stored choice over the system preference', () => {
    installMatchMedia({ [DARK_QUERY]: true })
    window.localStorage.setItem(THEME_STORAGE_KEY, 'light')
    const { api } = mountTheme()
    expect(api.theme.value).toBe('light')
  })

  it('ignores invalid stored values', () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'purple')
    const { api } = mountTheme()
    expect(api.theme.value).toBe('light')
  })

  it('toggles, persists the choice and updates the theme-color meta tag', () => {
    const meta = addThemeColorMeta()
    const { api } = mountTheme()

    api.toggleTheme()

    expect(api.theme.value).toBe('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')
    expect(meta.content).toBe('#0b1120')

    api.toggleTheme()
    expect(document.documentElement.dataset.theme).toBe('light')
    expect(meta.content).toBe('#ffffff')
    meta.remove()
  })

  it('tracks system changes until the visitor chooses explicitly', async () => {
    const media = installMatchMedia()
    const { api } = mountTheme()

    media.set(DARK_QUERY, true)
    await Promise.resolve()
    expect(api.theme.value).toBe('dark')

    api.setTheme('light')
    media.set(DARK_QUERY, true)
    await Promise.resolve()
    expect(api.theme.value).toBe('light')
  })

  it('still applies the theme when localStorage throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('denied')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('denied')
    })

    const { api } = mountTheme()
    expect(() => api.toggleTheme()).not.toThrow()
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('removes its listeners when the component unmounts', () => {
    const media = installMatchMedia()
    const removeSpy = vi.spyOn(window, 'removeEventListener')
    const { wrapper } = mountTheme()
    expect(media.listenerCount(DARK_QUERY)).toBe(1)

    wrapper.unmount()

    expect(media.listenerCount(DARK_QUERY)).toBe(0)
    expect(removeSpy).toHaveBeenCalledWith('storage', expect.any(Function))
  })
})
