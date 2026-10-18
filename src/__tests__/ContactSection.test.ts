import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import ContactSection from '@/sections/ContactSection.vue'

// The real profile publishes no email; use a configured one to exercise the email controls.
vi.mock('@/data/profile', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/data/profile')>()
  return {
    profile: {
      ...original.profile,
      email: 'hello@example.test',
      linkedin: 'https://www.linkedin.com/in/example',
    },
  }
})

function setClipboard(writeText: (text: string) => Promise<void>) {
  Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
}

describe('ContactSection (email configured)', () => {
  afterEach(() => {
    Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true })
    Reflect.deleteProperty(document, 'execCommand')
  })

  it('shows the location and an introduction', () => {
    const wrapper = mount(ContactSection)
    expect(wrapper.text()).toContain('Phnom Penh, Cambodia')
    expect(wrapper.get('h2').text()).toBe("Let's talk")
  })

  it('links email with mailto: instead of a non-functional form', () => {
    const wrapper = mount(ContactSection)

    expect(wrapper.find('form').exists()).toBe(false)
    const mail = wrapper.findAll('a').find((a) => a.attributes('href')?.startsWith('mailto:'))!
    expect(mail.attributes('href')).toBe('mailto:hello@example.test')
    expect(mail.attributes('target')).toBeUndefined()
  })

  it('links GitHub, LinkedIn and Telegram safely in a new tab', () => {
    const wrapper = mount(ContactSection)
    const external = wrapper.findAll('a[target="_blank"]')

    expect(external.map((a) => a.attributes('href'))).toEqual([
      'https://github.com/vdev-cmd',
      'https://www.linkedin.com/in/example',
      'https://t.me/mengvsl',
    ])
    for (const link of external) expect(link.attributes('rel')).toBe('noopener noreferrer')
  })

  it('copies the email address and confirms it', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    setClipboard(writeText)
    const wrapper = mount(ContactSection)
    const copy = wrapper.findAll('button').find((b) => b.text().includes('Copy email'))!

    await copy.trigger('click')
    await vi.waitFor(() => expect(copy.text()).toContain('Copied'))

    expect(writeText).toHaveBeenCalledWith('hello@example.test')
    expect(wrapper.get('[role="status"]').text()).toBe('Email address copied to clipboard.')
  })

  it('tells the visitor when copying is impossible', async () => {
    setClipboard(vi.fn().mockRejectedValue(new Error('denied')))
    Object.defineProperty(document, 'execCommand', {
      value: vi.fn().mockReturnValue(false),
      configurable: true,
    })
    const wrapper = mount(ContactSection)
    const copy = wrapper.findAll('button').find((b) => b.text().includes('Copy email'))!

    await copy.trigger('click')
    await vi.waitFor(() => expect(copy.text()).toContain('Copy failed'))

    const status = wrapper.get('[role="status"]')
    expect(status.text()).toContain('copy it manually')
    expect(status.classes()).not.toContain('sr-only')
  })
})
