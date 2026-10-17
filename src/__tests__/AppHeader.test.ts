import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import AppHeader from '@/components/layout/AppHeader.vue'
import { navItems } from '@/data/navigation'
import { installMatchMedia } from '@/test/matchMedia'

const DESKTOP = '(min-width: 48rem)'

function mountHeader() {
  return mount(AppHeader, { attachTo: document.body })
}

function addSections(topFor: (id: string) => number) {
  for (const { id } of navItems) {
    const el = document.createElement('section')
    el.id = id
    el.getBoundingClientRect = () => ({ top: topFor(id) }) as DOMRect
    document.body.appendChild(el)
  }
}

describe('AppHeader', () => {
  afterEach(() => {
    for (const { id } of navItems) document.getElementById(id)?.remove()
  })

  it('renders a labelled primary navigation with one anchor per section', () => {
    const wrapper = mountHeader()

    expect(wrapper.find('nav').attributes('aria-label')).toBe('Primary')
    const links = wrapper.findAll('nav a')
    expect(links.map((a) => a.attributes('href'))).toEqual(navItems.map((item) => `#${item.id}`))
    expect(links.map((a) => a.text())).toEqual(navItems.map((item) => item.label))
    wrapper.unmount()
  })

  it('links the logo to the top of the page, named by its visible text', () => {
    const wrapper = mountHeader()
    // The logo is the first link in DOM order; the monogram is generated content, not text.
    const logo = wrapper.get('header a')
    expect(logo.attributes('href')).toBe('#home')
    expect(logo.attributes('aria-label')).toBeUndefined()
    expect(logo.text()).toBe('Meng Visal')
    expect(logo.get('[data-initials]').text()).toBe('')
    wrapper.unmount()
  })

  it('marks the section being read with aria-current', async () => {
    // Skills has crossed the reading line, Projects has not.
    addSections((id) => ({ home: -2000, about: -1500, experience: -900, skills: 10 })[id] ?? 2000)
    const wrapper = mountHeader()
    await wrapper.vm.$nextTick()

    const current = wrapper.findAll('nav a[aria-current="location"]')
    expect(current).toHaveLength(1)
    expect(current[0]!.text()).toBe('Skills')
    wrapper.unmount()
  })

  describe('mobile menu', () => {
    const toggle = (w: ReturnType<typeof mountHeader>) =>
      w.get('button[aria-controls="primary-menu"]')
    const menu = (w: ReturnType<typeof mountHeader>) => w.get('#primary-menu')

    it('starts closed and wires aria-expanded / aria-controls', () => {
      const wrapper = mountHeader()
      expect(toggle(wrapper).attributes('aria-expanded')).toBe('false')
      expect(toggle(wrapper).attributes('aria-label')).toBe('Open navigation menu')
      expect(menu(wrapper).classes()).toContain('hidden')
      wrapper.unmount()
    })

    it('opens and closes from the toggle button', async () => {
      const wrapper = mountHeader()

      await toggle(wrapper).trigger('click')
      expect(toggle(wrapper).attributes('aria-expanded')).toBe('true')
      expect(toggle(wrapper).attributes('aria-label')).toBe('Close navigation menu')
      expect(menu(wrapper).classes()).not.toContain('hidden')

      await toggle(wrapper).trigger('click')
      expect(toggle(wrapper).attributes('aria-expanded')).toBe('false')
      wrapper.unmount()
    })

    it('closes after a navigation link is chosen', async () => {
      const wrapper = mountHeader()
      await toggle(wrapper).trigger('click')

      await wrapper.get('nav a[href="#skills"]').trigger('click')

      expect(toggle(wrapper).attributes('aria-expanded')).toBe('false')
      wrapper.unmount()
    })

    it('closes on Escape and returns focus to the toggle', async () => {
      const wrapper = mountHeader()
      await toggle(wrapper).trigger('click')

      await wrapper.get('header').trigger('keydown', { key: 'Escape' })

      expect(toggle(wrapper).attributes('aria-expanded')).toBe('false')
      expect(document.activeElement).toBe(toggle(wrapper).element)
      wrapper.unmount()
    })

    it('closes when clicking outside the header', async () => {
      const wrapper = mountHeader()
      await toggle(wrapper).trigger('click')

      document.body.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }))
      await wrapper.vm.$nextTick()

      expect(toggle(wrapper).attributes('aria-expanded')).toBe('false')
      wrapper.unmount()
    })

    it('stays open when pressing inside the header', async () => {
      const wrapper = mountHeader()
      await toggle(wrapper).trigger('click')

      toggle(wrapper).element.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }))
      await wrapper.vm.$nextTick()

      expect(toggle(wrapper).attributes('aria-expanded')).toBe('true')
      wrapper.unmount()
    })

    it('closes when the viewport grows to desktop width', async () => {
      const media = installMatchMedia({ [DESKTOP]: false })
      const wrapper = mountHeader()
      await toggle(wrapper).trigger('click')

      media.set(DESKTOP, true)
      await wrapper.vm.$nextTick()

      expect(toggle(wrapper).attributes('aria-expanded')).toBe('false')
      wrapper.unmount()
    })

    it('removes the document listener when unmounted while open', async () => {
      const removeSpy = vi.spyOn(document, 'removeEventListener')
      const wrapper = mountHeader()
      await toggle(wrapper).trigger('click')

      wrapper.unmount()

      expect(removeSpy).toHaveBeenCalledWith('pointerdown', expect.any(Function))
    })
  })
})
