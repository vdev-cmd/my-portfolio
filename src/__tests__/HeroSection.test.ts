import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { profile } from '@/data/profile'
import HeroSection from '@/sections/HeroSection.vue'

// `resumeAvailable` is a build-time constant; make it switchable per test.
const resume = vi.hoisted(() => ({ available: true }))
vi.mock('@/utils/resume', () => ({
  get resumeAvailable() {
    return resume.available
  },
}))

describe('HeroSection', () => {
  beforeEach(() => {
    resume.available = true
  })

  it('shows the name, role and the two-part headline in a single h1', () => {
    const wrapper = mount(HeroSection)

    const h1 = wrapper.get('h1')
    expect(h1.text()).toContain(profile.headline.lead)
    expect(h1.text()).toContain(profile.headline.accent)
    expect(wrapper.text()).toContain(profile.name)
    expect(wrapper.text()).toContain(profile.role)
    expect(wrapper.text()).toContain('5+ years')
    expect(wrapper.text()).toContain('ERP and POS')
  })

  it('links "View Projects" to the projects section', () => {
    const wrapper = mount(HeroSection)
    const link = wrapper.findAll('a').find((a) => a.text().includes('View Projects'))!
    expect(link.attributes('href')).toBe('#projects')
  })

  it('offers the resume as a download when the file exists', () => {
    const wrapper = mount(HeroSection)
    const link = wrapper.findAll('a').find((a) => a.text().includes('Download Resume'))!

    expect(link.attributes('href')).toBe(`${import.meta.env.BASE_URL}${profile.resume.path}`)
    expect(link.attributes('download')).toBe(profile.resume.downloadName)
  })

  it('omits the resume button instead of linking to a missing file', () => {
    resume.available = false
    const wrapper = mount(HeroSection)
    expect(wrapper.text()).not.toContain('Download Resume')
    expect(wrapper.findAll('a').some((a) => /resume/i.test(a.attributes('href') ?? ''))).toBe(false)
  })

  it('links only the profiles that are configured', () => {
    const wrapper = mount(HeroSection)
    const social = wrapper.get('ul[aria-label="Profile links"]')
    const hrefs = social.findAll('a').map((a) => a.attributes('href'))

    expect(hrefs).toContain(profile.github)
    if (!profile.linkedin) expect(hrefs.some((h) => h?.includes('linkedin'))).toBe(false)
    if (!profile.email) expect(hrefs.some((h) => h?.startsWith('mailto:'))).toBe(false)
    for (const link of social.findAll('a')) {
      expect(link.attributes('rel')).toBe('noopener noreferrer')
      expect(link.attributes('aria-label')).toBeTruthy()
    }
  })

  it('keeps professional experience and learning topics in separate groups', () => {
    const wrapper = mount(HeroSection)
    const terms = wrapper.findAll('dt').map((dt) => dt.text())

    expect(terms).toEqual(['// professional experience', '// currently learning'])
    const [professional, learning] = wrapper.findAll('dd')
    for (const item of profile.focus.professional) expect(professional!.text()).toContain(item)
    for (const item of profile.focus.learning) expect(learning!.text()).toContain(item)
  })

  it('shows the profile photo with alt text and reserved dimensions', () => {
    const img = mount(HeroSection).get('aside img')
    expect(img.attributes('src')).toBe(`${import.meta.env.BASE_URL}${profile.photo!.src}`)
    expect(img.attributes('alt')).toBe(profile.photo!.alt)
    expect(img.attributes('width')).toBe(String(profile.photo!.width))
    expect(img.attributes('height')).toBe(String(profile.photo!.height))
  })

  it('shows initials when no photo is configured', () => {
    const photo = profile.photo
    profile.photo = undefined
    try {
      const wrapper = mount(HeroSection)
      expect(wrapper.find('aside img').exists()).toBe(false)
      expect(wrapper.get('aside').text()).toContain(profile.initials)
    } finally {
      profile.photo = photo
    }
  })
})
