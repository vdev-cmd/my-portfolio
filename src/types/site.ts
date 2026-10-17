export interface SiteConfig {
  title: string
  description: string
  locale: string
  /** Browser UI colours, kept in sync with the design tokens. */
  themeColors: { light: string; dark: string }
  /** Social preview image inside `public/`. Tags are only emitted if the file exists. */
  ogImage: { path: string; width: number; height: number; alt: string }
  address: { locality: string; countryCode: string }
  /** Professional expertise for JSON-LD. Do not list topics that are still being learned. */
  knowsAbout: string[]
}
