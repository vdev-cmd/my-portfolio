/// <reference types="vite/client" />

/**
 * Replaced at build time (see vite.config.ts): `true` when `public/resume.pdf` exists.
 * The "Download Resume" button is only rendered when this is true, so the site never
 * ships a link to a missing file.
 */
declare const __HAS_RESUME__: boolean

interface ImportMetaEnv {
  /** Production URL of the site, e.g. https://username.github.io/repo-name (no trailing slash needed). */
  readonly VITE_SITE_URL?: string
  /** Optional explicit Vite base path. Defaults to the pathname of VITE_SITE_URL, or "/". */
  readonly VITE_BASE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
