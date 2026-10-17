import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import type { Plugin } from 'vite'
import { profile } from '../src/data/profile.ts'
import { site } from '../src/data/site.ts'
import {
  SEO_MARKER,
  build404Html,
  buildHeadTags,
  buildRobotsTxt,
  buildSitemapXml,
} from './headTags.ts'
import type { ResolvedSite } from './siteEnv.ts'

/**
 * Injects SEO tags into index.html and emits robots.txt, sitemap.xml and 404.html.
 * All values come from `src/data` and the resolved deployment URL — nothing is hard-coded here.
 */
export function sitePlugin(resolved: ResolvedSite): Plugin {
  let publicDir: string | false = false

  const hasOgImage = () =>
    typeof publicDir === 'string' && existsSync(resolve(publicDir, site.ogImage.path))

  return {
    name: 'portfolio:site',
    configResolved(config) {
      publicDir = config.publicDir
    },
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        if (!html.includes(SEO_MARKER)) {
          throw new Error(`index.html is missing the ${SEO_MARKER} marker.`)
        }
        return html.replace(
          SEO_MARKER,
          buildHeadTags({ profile, site, resolved, hasOgImage: hasOgImage() }),
        )
      },
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: buildRobotsTxt(resolved.url) })
      this.emitFile({
        type: 'asset',
        fileName: '404.html',
        source: build404Html(resolved.base, site, profile),
      })
      if (resolved.url) {
        const today = new Date().toISOString().slice(0, 10)
        this.emitFile({
          type: 'asset',
          fileName: 'sitemap.xml',
          source: buildSitemapXml(resolved.url, today),
        })
      }
    },
  }
}
