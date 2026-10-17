import { describe, expect, it, vi } from 'vitest'
import { assetUrl } from '@/utils/assets'
import { getContactChannels, isExternalHref, stripProtocol } from '@/utils/links'
import { prefersReducedMotion, scrollToTop } from '@/utils/motion'
import { installMatchMedia } from '@/test/matchMedia'
import type { Profile } from '@/types'
import { profile } from '@/data/profile'

describe('assetUrl', () => {
  it('prefixes files in public/ with the deployment base', () => {
    // Vite exposes the configured base as import.meta.env.BASE_URL ("/" in tests).
    expect(assetUrl('resume.pdf')).toBe(`${import.meta.env.BASE_URL}resume.pdf`)
    expect(assetUrl('/images/a.png')).toBe(`${import.meta.env.BASE_URL}images/a.png`)
  })

  it('honours a project-pages base', () => {
    vi.stubEnv('BASE_URL', '/my-portfolio/')
    expect(assetUrl('resume.pdf')).toBe('/my-portfolio/resume.pdf')
    vi.unstubAllEnvs()
  })

  it('leaves absolute URLs untouched', () => {
    expect(assetUrl('https://cdn.example.test/a.png')).toBe('https://cdn.example.test/a.png')
    expect(assetUrl('//cdn.example.test/a.png')).toBe('//cdn.example.test/a.png')
  })
})

describe('contact channels', () => {
  const base: Profile = {
    ...profile,
    email: undefined,
    github: undefined,
    linkedin: undefined,
    telegram: undefined,
  }

  it('returns nothing when no channel is configured', () => {
    expect(getContactChannels(base)).toEqual([])
  })

  it('only includes configured channels, email first', () => {
    const channels = getContactChannels({
      ...base,
      email: 'hello@example.test',
      github: 'https://github.com/someone',
    })
    expect(channels.map((c) => c.id)).toEqual(['email', 'github'])
    expect(channels[0]).toMatchObject({
      href: 'mailto:hello@example.test',
      display: 'hello@example.test',
    })
    expect(channels[1]).toMatchObject({ display: 'github.com/someone' })
  })

  it('builds LinkedIn from the profile URL', () => {
    const [channel] = getContactChannels({
      ...base,
      linkedin: 'https://www.linkedin.com/in/someone/',
    })
    expect(channel).toMatchObject({
      id: 'linkedin',
      href: 'https://www.linkedin.com/in/someone/',
      display: 'www.linkedin.com/in/someone',
    })
  })

  it('builds Telegram from the profile URL', () => {
    const [channel] = getContactChannels({ ...base, telegram: 'https://t.me/someone' })
    expect(channel).toMatchObject({
      id: 'telegram',
      href: 'https://t.me/someone',
      display: 't.me/someone',
    })
  })

  it('classifies external hrefs and strips protocols', () => {
    expect(isExternalHref('https://a.test')).toBe(true)
    expect(isExternalHref('mailto:a@b.test')).toBe(false)
    expect(isExternalHref('#about')).toBe(false)
    expect(stripProtocol('http://a.test/')).toBe('a.test')
  })
})

describe('motion helpers', () => {
  it('reads the reduced-motion preference', () => {
    expect(prefersReducedMotion()).toBe(false)
    installMatchMedia({ '(prefers-reduced-motion: reduce)': true })
    expect(prefersReducedMotion()).toBe(true)
  })

  it('scrolls smoothly by default and instantly with reduced motion', () => {
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    scrollToTop()
    expect(scrollTo).toHaveBeenLastCalledWith({ top: 0, behavior: 'smooth' })

    installMatchMedia({ '(prefers-reduced-motion: reduce)': true })
    scrollToTop()
    expect(scrollTo).toHaveBeenLastCalledWith({ top: 0, behavior: 'auto' })
  })
})
