import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from '@/App.vue'
import { navItems, sectionIds } from '@/data/navigation'
import { profile } from '@/data/profile'

function mountApp() {
  return mount(App, { attachTo: document.body })
}

describe('App', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders every section in navigation order inside <main>', () => {
    const wrapper = mountApp()
    const ids = wrapper.findAll('main > section').map((s) => s.attributes('id'))
    expect(ids).toEqual([...sectionIds])
    wrapper.unmount()
  })

  it('has a navigation target for every link and no orphan sections', () => {
    const wrapper = mountApp()
    for (const item of navItems) {
      expect(document.getElementById(item.id), `#${item.id}`).not.toBeNull()
      expect(wrapper.find(`nav a[href="#${item.id}"]`).exists()).toBe(true)
    }
    wrapper.unmount()
  })

  it('uses unique ids across the whole document', () => {
    const wrapper = mountApp()
    const ids = [...document.querySelectorAll('[id]')].map((el) => el.id)
    expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([])
    wrapper.unmount()
  })

  it('has exactly one h1 and every section labelled by an existing heading', () => {
    const wrapper = mountApp()
    expect(wrapper.findAll('h1')).toHaveLength(1)
    for (const section of wrapper.findAll('main > section')) {
      const heading = document.getElementById(section.attributes('aria-labelledby')!)
      expect(heading, section.attributes('id')).not.toBeNull()
      expect(heading!.textContent!.trim().length).toBeGreaterThan(0)
    }
    wrapper.unmount()
  })

  it('lets keyboard users skip the navigation', () => {
    const wrapper = mountApp()
    const skip = wrapper.get('a[href="#main"]')
    expect(skip.text()).toContain('Skip to main content')
    expect(document.getElementById('main')).not.toBeNull()
    wrapper.unmount()
  })

  it('only links to real destinations: no placeholder hosts, no empty hrefs', () => {
    const wrapper = mountApp()
    for (const a of wrapper.findAll('a')) {
      const href = a.attributes('href')
      expect(href, a.html()).toBeTruthy()
      expect(href).not.toBe('#')
      expect(href).not.toMatch(/example\.(com|org|net)|your-|username|localhost/i)
    }
    wrapper.unmount()
  })

  it('opens every new-tab link with rel="noopener"', () => {
    const wrapper = mountApp()
    for (const a of wrapper.findAll('a[target="_blank"]')) {
      expect(a.attributes('rel')).toContain('noopener')
    }
    wrapper.unmount()
  })

  it('keeps images lazy by default', () => {
    const wrapper = mountApp()
    for (const img of wrapper.findAll('img')) {
      const priority = img.attributes('fetchpriority') === 'high'
      expect(priority || img.attributes('loading') === 'lazy').toBe(true)
      expect(img.attributes('alt')).toBeDefined()
    }
    wrapper.unmount()
  })

  it('labels every icon-only control', () => {
    const wrapper = mountApp()
    for (const control of wrapper.findAll('a, button')) {
      const name = control.attributes('aria-label') ?? control.text()
      expect(name.trim().length, control.html()).toBeGreaterThan(0)
    }
    wrapper.unmount()
  })

  it('renders the footer with copyright, credits and a working back-to-top button', async () => {
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    const wrapper = mountApp()
    const footer = wrapper.get('footer')

    expect(footer.text()).toContain(`© ${new Date().getFullYear()} ${profile.name}`)
    expect(footer.text()).toContain('Built with Vue.js and TypeScript.')

    const back = footer.findAll('button').find((b) => b.text().includes('Back to top'))!
    await back.trigger('click')

    expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ top: 0 }))
    expect(document.activeElement?.id).toBe('home')
    wrapper.unmount()
  })

  it('applies a theme to the document on startup', () => {
    const wrapper = mountApp()
    expect(['light', 'dark']).toContain(document.documentElement.dataset.theme)
    wrapper.unmount()
  })
})
