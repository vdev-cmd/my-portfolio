import { describe, expect, it } from 'vitest'
import { normaliseBase, resolveSite } from '../siteEnv.ts'

describe('normaliseBase', () => {
  it.each([
    ['', '/'],
    ['/', '/'],
    ['repo', '/repo/'],
    ['/repo', '/repo/'],
    ['/repo/', '/repo/'],
    ['//nested//path//', '/nested//path/'],
  ])('%j -> %j', (input, expected) => {
    expect(normaliseBase(input)).toBe(expected)
  })
})

describe('resolveSite', () => {
  it('has no URL and a root base when nothing is configured', () => {
    expect(resolveSite({})).toEqual({ url: undefined, base: '/' })
    expect(resolveSite({ VITE_SITE_URL: '   ' })).toEqual({ url: undefined, base: '/' })
  })

  it('derives the base from a project-pages URL', () => {
    expect(resolveSite({ VITE_SITE_URL: 'https://user.github.io/my-portfolio' })).toEqual({
      url: 'https://user.github.io/my-portfolio',
      base: '/my-portfolio/',
    })
  })

  it('normalises trailing slashes', () => {
    expect(resolveSite({ VITE_SITE_URL: 'https://user.github.io/my-portfolio/' })).toEqual({
      url: 'https://user.github.io/my-portfolio',
      base: '/my-portfolio/',
    })
  })

  it('uses "/" for user pages and custom domains', () => {
    expect(resolveSite({ VITE_SITE_URL: 'https://user.github.io' })).toEqual({
      url: 'https://user.github.io',
      base: '/',
    })
    expect(resolveSite({ VITE_SITE_URL: 'https://visal.dev/' })).toEqual({
      url: 'https://visal.dev',
      base: '/',
    })
  })

  it('lets VITE_BASE override the inferred base', () => {
    expect(resolveSite({ VITE_SITE_URL: 'https://visal.dev', VITE_BASE: 'portfolio' })).toEqual({
      url: 'https://visal.dev',
      base: '/portfolio/',
    })
    expect(resolveSite({ VITE_BASE: '/app' })).toEqual({ url: undefined, base: '/app/' })
  })

  it('rejects invalid or non-http(s) URLs with a clear message', () => {
    expect(() => resolveSite({ VITE_SITE_URL: 'not a url' })).toThrow(/absolute URL/)
    expect(() => resolveSite({ VITE_SITE_URL: 'ftp://example.test' })).toThrow(/http\(s\)/)
  })
})
