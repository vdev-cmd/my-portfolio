import { describe, expect, it } from 'vitest'
import { profile } from '../../src/data/profile.ts'
import { site } from '../../src/data/site.ts'
import {
  build404Html,
  buildHeadTags,
  buildPersonJsonLd,
  buildRobotsTxt,
  buildSitemapXml,
  escapeHtml,
  safeJson,
} from '../headTags.ts'

const withUrl = { url: 'https://user.github.io/my-portfolio', base: '/my-portfolio/' }
const withoutUrl = { url: undefined, base: '/' }

function jsonLdFrom(html: string): Record<string, unknown> {
  const match = /<script type="application\/ld\+json">\n([\s\S]*?)\n<\/script>/.exec(html)
  expect(match).not.toBeNull()
  return JSON.parse(match![1]!) as Record<string, unknown>
}

describe('buildHeadTags', () => {
  it('emits title, description and absolute URLs when a site URL is configured', () => {
    const html = buildHeadTags({ profile, site, resolved: withUrl, hasOgImage: true })

    expect(html).toContain(`<title>${escapeHtml(site.title)}</title>`)
    expect(html).toContain('<meta name="description"')
    expect(html).toContain('<link rel="canonical" href="https://user.github.io/my-portfolio/" />')
    expect(html).toContain(
      '<meta property="og:url" content="https://user.github.io/my-portfolio/" />',
    )
    expect(html).toContain(
      '<meta property="og:image" content="https://user.github.io/my-portfolio/images/og-cover.png" />',
    )
    expect(html).toContain('<meta name="twitter:card" content="summary_large_image" />')
    expect(html).toContain('<meta name="twitter:image"')
  })

  it('omits every absolute-URL tag when no site URL is configured', () => {
    const html = buildHeadTags({ profile, site, resolved: withoutUrl, hasOgImage: true })

    expect(html).not.toContain('rel="canonical"')
    expect(html).not.toContain('og:url')
    expect(html).not.toContain('og:image')
    expect(html).not.toContain('twitter:image')
    expect(html).toContain('<meta name="twitter:card" content="summary" />')
    expect(html).not.toMatch(/example\.(com|org)/)
  })

  it('does not reference an OG image that does not exist', () => {
    const html = buildHeadTags({ profile, site, resolved: withUrl, hasOgImage: false })
    expect(html).not.toContain('og:image')
    expect(html).toContain('<meta name="twitter:card" content="summary" />')
  })
})

describe('JSON-LD', () => {
  it('describes a Person using only real profile data', () => {
    const ld = jsonLdFrom(buildHeadTags({ profile, site, resolved: withUrl, hasOgImage: true }))

    expect(ld).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: profile.name,
      url: 'https://user.github.io/my-portfolio/',
      address: { addressLocality: 'Phnom Penh', addressCountry: 'KH' },
    })
  })

  it('does not list topics that are still being learned as expertise', () => {
    const ld = buildPersonJsonLd(profile, site, undefined)
    const knows = (ld.knowsAbout as string[]).join(' ').toLowerCase()
    for (const learning of ['python', 'fastapi', 'llm', 'rag', 'agent', 'vector']) {
      expect(knows).not.toContain(learning)
    }
  })

  it('leaves out url, email and sameAs entries that are not configured', () => {
    const ld = buildPersonJsonLd(
      { ...profile, email: undefined, github: undefined, linkedin: undefined },
      site,
      undefined,
    )
    expect(ld).not.toHaveProperty('url')
    expect(ld).not.toHaveProperty('email')
    expect(ld).not.toHaveProperty('sameAs')
  })

  it('includes sameAs and email only when configured', () => {
    const ld = buildPersonJsonLd(
      {
        ...profile,
        email: 'hello@example.test',
        github: 'https://github.com/a',
        linkedin: 'https://linkedin.com/in/a',
      },
      site,
      undefined,
    )
    expect(ld).toMatchObject({
      email: 'hello@example.test',
      sameAs: ['https://github.com/a', 'https://linkedin.com/in/a'],
    })
  })

  it('cannot break out of the script element', () => {
    expect(safeJson({ a: '</script><script>alert(1)</script>' })).not.toContain('</script>')
  })
})

describe('escapeHtml', () => {
  it('escapes attribute-breaking characters', () => {
    expect(escapeHtml(`"<a href='x'>&`)).toBe('&quot;&lt;a href=&#39;x&#39;&gt;&amp;')
  })
})

describe('robots, sitemap and 404', () => {
  it('lists the sitemap in robots.txt only when the URL is known', () => {
    expect(buildRobotsTxt('https://user.github.io/my-portfolio')).toContain(
      'Sitemap: https://user.github.io/my-portfolio/sitemap.xml',
    )
    expect(buildRobotsTxt(undefined)).not.toContain('Sitemap')
    expect(buildRobotsTxt(undefined)).toContain('Allow: /')
  })

  it('builds a one-page sitemap', () => {
    const xml = buildSitemapXml('https://user.github.io/my-portfolio', '2026-01-02')
    expect(xml).toContain('<loc>https://user.github.io/my-portfolio/</loc>')
    expect(xml).toContain('<lastmod>2026-01-02</lastmod>')
  })

  it('links the 404 page back to the deployment base', () => {
    const html = build404Html('/my-portfolio/', site, profile)
    expect(html).toContain('href="/my-portfolio/"')
    expect(html).toContain('href="/my-portfolio/favicon.svg"')
    expect(html).toContain('noindex')
  })
})
