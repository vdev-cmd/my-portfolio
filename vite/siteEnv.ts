export interface ResolvedSite {
  /**
   * Public site URL without a trailing slash, e.g. `https://user.github.io/repo`.
   * `undefined` when `VITE_SITE_URL` is not set — absolute-URL metadata is then omitted
   * instead of being filled with placeholders.
   */
  url: string | undefined
  /** Vite `base` option. Always starts and ends with "/". */
  base: string
}

type Env = Record<string, string | undefined>

export function normaliseBase(input: string): string {
  const trimmed = input.trim().replace(/^\/+|\/+$/g, '')
  return trimmed === '' ? '/' : `/${trimmed}/`
}

/**
 * Derives the deployment URL and Vite base path from environment variables so that the same
 * build works for user pages (`/`), project pages (`/repo/`) and custom domains (`/`).
 *
 * - `VITE_SITE_URL` – public URL of the site (preferred single source of truth).
 * - `VITE_BASE` – optional explicit base path that overrides the one inferred from the URL.
 */
export function resolveSite(env: Env): ResolvedSite {
  const rawUrl = env.VITE_SITE_URL?.trim()
  let parsed: URL | undefined

  if (rawUrl) {
    try {
      parsed = new URL(rawUrl)
    } catch {
      throw new Error(`VITE_SITE_URL must be an absolute URL, received "${rawUrl}".`)
    }
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      throw new Error(`VITE_SITE_URL must use http(s), received "${rawUrl}".`)
    }
  }

  const explicitBase = env.VITE_BASE?.trim()
  const base = normaliseBase(explicitBase ? explicitBase : (parsed?.pathname ?? '/'))
  const url = parsed ? `${parsed.origin}${parsed.pathname.replace(/\/+$/, '')}` : undefined

  return { url, base }
}
