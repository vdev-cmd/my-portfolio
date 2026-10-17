import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { profile } from '@/data/profile'
import ContactSection from '@/sections/ContactSection.vue'

describe('ContactSection (default profile)', () => {
  it('never renders email controls for an address that has not been published', () => {
    expect(profile.email).toBeUndefined()
    const wrapper = mount(ContactSection)

    expect(wrapper.findAll('a').some((a) => a.attributes('href')?.startsWith('mailto:'))).toBe(
      false,
    )
    expect(wrapper.findAll('button')).toHaveLength(0)
  })

  it('still offers the channels that are configured', () => {
    const wrapper = mount(ContactSection)
    expect(wrapper.findAll('a').map((a) => a.attributes('href'))).toContain(profile.github)
  })
})
