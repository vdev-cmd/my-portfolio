import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ThemeToggle from '@/components/common/ThemeToggle.vue'
import { THEME_STORAGE_KEY } from '@/composables/useTheme'
import { installMatchMedia } from '@/test/matchMedia'

describe('ThemeToggle', () => {
  it('describes the action it will perform', async () => {
    const wrapper = mount(ThemeToggle)
    const button = wrapper.get('button')

    expect(button.attributes('aria-label')).toBe('Switch to dark theme')
    await button.trigger('click')
    expect(button.attributes('aria-label')).toBe('Switch to light theme')
  })

  it('switches the document theme and persists the choice', async () => {
    const wrapper = mount(ThemeToggle)

    await wrapper.get('button').trigger('click')
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')

    await wrapper.get('button').trigger('click')
    expect(document.documentElement.dataset.theme).toBe('light')
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('light')
  })

  it('starts from the system preference', () => {
    installMatchMedia({ '(prefers-color-scheme: dark)': true })
    const wrapper = mount(ThemeToggle)

    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(wrapper.get('button').attributes('aria-label')).toBe('Switch to light theme')
  })

  it('has no decorative-only icons exposed to assistive tech', () => {
    const wrapper = mount(ThemeToggle)
    expect(wrapper.get('svg').attributes('aria-hidden')).toBe('true')
  })
})
