import type { SiteConfig } from '../types/site.ts'

/** Document-level metadata. Absolute URLs are derived at build time from VITE_SITE_URL. */
export const site: SiteConfig = {
  title: 'Meng Visal — Flutter Engineer exploring Applied AI',
  description:
    'Portfolio of Meng Visal, a Flutter developer in Phnom Penh with 5+ years building e-commerce, ERP and POS mobile apps, now expanding into Applied AI engineering.',
  locale: 'en_US',
  themeColors: { light: '#ffffff', dark: '#0b1120' },
  ogImage: {
    path: 'images/og-cover.png',
    width: 1200,
    height: 630,
    alt: 'Meng Visal — Flutter Engineer exploring Applied AI',
  },
  address: { locality: 'Phnom Penh', countryCode: 'KH' },
  knowsAbout: [
    'Flutter',
    'Dart',
    'Mobile application development',
    'E-commerce, ERP and POS mobile applications',
    'Riverpod',
    'REST API integration',
    'Clean Architecture',
    'MVVM',
  ],
}
