import type { Profile } from '../src/types/profile.ts'
import type { SiteConfig } from '../src/types/site.ts'
import type { ResolvedSite } from './siteEnv.ts'

export const SEO_MARKER = '<!-- SEO_TAGS -->'

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** JSON for embedding in an inline `<script>`; `<` is escaped so `</script>` cannot appear. */
export function safeJson(value: unknown): string {
  return JSON.stringify(value, null, 2).replace(/</g, '\\u003c')
}

function absolute(siteUrl: string, path: string): string {
  return `${siteUrl}/${path.replace(/^\/+/, '')}`
}

export function buildPersonJsonLd(profile: Profile, site: SiteConfig, siteUrl: string | undefined) {
  const sameAs = [profile.github, profile.linkedin].filter((u): u is string => Boolean(u))
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.role,
    description: site.description,
    ...(siteUrl ? { url: `${siteUrl}/` } : {}),
    ...(profile.email ? { email: profile.email } : {}),
    address: {
      '@type': 'PostalAddress',
      addressLocality: site.address.locality,
      addressCountry: site.address.countryCode,
    },
    // Professional expertise only — topics that are still being learned are not listed here.
    knowsAbout: site.knowsAbout,
    ...(sameAs.length > 0 ? { sameAs } : {}),
  }
}

interface HeadOptions {
  profile: Profile
  site: SiteConfig
  resolved: ResolvedSite
  /** Whether the social preview image exists in `public/`. */
  hasOgImage: boolean
}

/**
 * Builds the SEO block injected into `index.html`. Absolute-URL tags (canonical, og:url,
 * og:image, JSON-LD url) are only emitted when a production URL is configured.
 */
export function buildHeadTags({ profile, site, resolved, hasOgImage }: HeadOptions): string {
  const { url } = resolved
  const title = escapeHtml(site.title)
  const description = escapeHtml(site.description)
  const image = url && hasOgImage ? absolute(url, site.ogImage.path) : undefined

  const lines: string[] = [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    `<meta name="author" content="${escapeHtml(profile.name)}" />`,
    `<meta name="robots" content="index, follow" />`,
  ]

  if (url) lines.push(`<link rel="canonical" href="${escapeHtml(`${url}/`)}" />`)

  lines.push(
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${escapeHtml(profile.name)}" />`,
    `<meta property="og:locale" content="${site.locale}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
  )
  if (url) lines.push(`<meta property="og:url" content="${escapeHtml(`${url}/`)}" />`)
  if (image) {
    lines.push(
      `<meta property="og:image" content="${escapeHtml(image)}" />`,
      `<meta property="og:image:width" content="${site.ogImage.width}" />`,
      `<meta property="og:image:height" content="${site.ogImage.height}" />`,
      `<meta property="og:image:alt" content="${escapeHtml(site.ogImage.alt)}" />`,
    )
  }

  lines.push(
    `<meta name="twitter:card" content="${image ? 'summary_large_image' : 'summary'}" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
  )
  if (image) {
    lines.push(
      `<meta name="twitter:image" content="${escapeHtml(image)}" />`,
      `<meta name="twitter:image:alt" content="${escapeHtml(site.ogImage.alt)}" />`,
    )
  }

  lines.push(
    `<script type="application/ld+json">\n${safeJson(buildPersonJsonLd(profile, site, url))}\n</script>`,
  )

  return lines.join('\n    ')
}

export function buildRobotsTxt(siteUrl: string | undefined): string {
  const lines = ['User-agent: *', 'Allow: /']
  if (siteUrl) lines.push('', `Sitemap: ${siteUrl}/sitemap.xml`)
  return `${lines.join('\n')}\n`
}

export function buildSitemapXml(siteUrl: string, lastModified: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${escapeHtml(`${siteUrl}/`)}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`
}

/** Static 404 page for GitHub Pages: there are no server routes, so it links back to the root. */
export function build404Html(base: string, site: SiteConfig, profile: Profile): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex" />
    <meta name="color-scheme" content="light dark" />
    <title>Page not found · ${escapeHtml(profile.name)}</title>
    <link rel="icon" href="${base}favicon.svg" type="image/svg+xml" />
    <style>
      :root { color-scheme: light dark; --bg: #ffffff; --fg: #0f172a; --muted: #475569; --link: #2563eb; }
      @media (prefers-color-scheme: dark) { :root { --bg: ${site.themeColors.dark}; --fg: #f8fafc; --muted: #94a3b8; --link: #60a5fa; } }
      body { margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 1.5rem; background: var(--bg); color: var(--fg); font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif; }
      main { max-width: 32rem; }
      p.code { margin: 0 0 .5rem; font: 600 .875rem ui-monospace, SFMono-Regular, Menlo, monospace; color: var(--muted); }
      h1 { margin: 0 0 .75rem; font-size: 2rem; letter-spacing: -.02em; }
      p { margin: 0 0 1.5rem; line-height: 1.6; color: var(--muted); }
      a { color: var(--link); font-weight: 600; }
    </style>
  </head>
  <body>
    <main>
      <p class="code">404</p>
      <h1>Page not found</h1>
      <p>This portfolio is a single page, so there is nothing at this address.</p>
      <a href="${base}">Back to ${escapeHtml(profile.name)}'s portfolio</a>
    </main>
  </body>
</html>
`
}
