const ABSOLUTE_URL = /^(?:[a-z][a-z\d+.-]*:)?\/\//i

/**
 * Resolves a file in `public/` against the deployment base, so the same code works on
 * `https://user.github.io/` (base "/") and `https://user.github.io/repo/` (base "/repo/").
 * Absolute URLs are returned unchanged.
 */
export function assetUrl(path: string): string {
  if (ABSOLUTE_URL.test(path)) return path
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`
}
