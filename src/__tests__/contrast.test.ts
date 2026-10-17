import { describe, expect, it } from 'vitest'
import tokensCss from '@/assets/styles/tokens.css?raw'

/** WCAG 2.x relative luminance / contrast ratio. */
function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const channel = parseInt(hex.slice(i, i + 2), 16) / 255
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  }) as [number, number, number]
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number]
  return (hi + 0.05) / (lo + 0.05)
}

/** Colour of `fg` drawn at `alpha` over `bg` (how Tailwind's `bg-primary/10` composites). */
function tint(fg: string, bg: string, alpha: number): string {
  const channels = [1, 3, 5].map((i) => {
    const value =
      parseInt(fg.slice(i, i + 2), 16) * alpha + parseInt(bg.slice(i, i + 2), 16) * (1 - alpha)
    return Math.round(value).toString(16).padStart(2, '0')
  })
  return `#${channels.join('')}`
}

/** Reads `--name: #hex;` declarations from one CSS block of tokens.css. */
function readBlock(selectorStart: string): Record<string, string> {
  const start = tokensCss.indexOf(selectorStart)
  expect(start, `block ${selectorStart}`).toBeGreaterThanOrEqual(0)
  const end = tokensCss.indexOf('}', start)
  const tokens: Record<string, string> = {}
  for (const match of tokensCss
    .slice(start, end)
    .matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) {
    tokens[match[1]!] = match[2]!.toLowerCase()
  }
  return tokens
}

const themes = {
  light: readBlock(':root {'),
  dark: readBlock(":root[data-theme='dark'] {"),
}

describe.each(Object.entries(themes))('design tokens: %s theme contrast (WCAG AA)', (_name, t) => {
  const text: [string, string, string][] = [
    ['body text on page', t.fg!, t.bg!],
    ['body text on card', t.fg!, t.surface!],
    ['muted text on page', t.muted!, t.bg!],
    ['muted text on card', t.muted!, t.surface!],
    ['muted text on raised surfaces (chips, buttons)', t.muted!, t['surface-raised']!],
    ['primary text on page', t['primary-ink']!, t.bg!],
    ['primary text on card', t['primary-ink']!, t.surface!],
    ['accent text on page', t.accent!, t.bg!],
    ['accent text on card', t.accent!, t.surface!],
    ['button label on primary fill', t['on-primary']!, t['primary-solid']!],
    ['hovered button label on primary fill', t['on-primary']!, t['primary-solid-hover']!],
    ['primary chip text on 10% primary tint', t['primary-ink']!, tint(t.primary!, t.surface!, 0.1)],
    ['accent chip text on 10% accent tint', t.accent!, tint(t.accent!, t.surface!, 0.1)],
  ]

  it.each(text)('%s is at least 4.5:1', (_label, fg, bg) => {
    expect(contrast(fg, bg)).toBeGreaterThanOrEqual(4.5)
  })

  const nonText: [string, string, string][] = [
    ['focus ring on page', t.ring!, t.bg!],
    ['focus ring on card', t.ring!, t.surface!],
    ['control borders on page', t['control-border']!, t.bg!],
    ['control borders on card', t['control-border']!, t.surface!],
  ]

  it.each(nonText)('%s is at least 3:1', (_label, fg, bg) => {
    expect(contrast(fg, bg)).toBeGreaterThanOrEqual(3)
  })
})

describe('design tokens: palette', () => {
  it('uses the requested dark palette', () => {
    expect(themes.dark).toMatchObject({
      bg: '#0b1120',
      surface: '#111827',
      primary: '#3b82f6',
      accent: '#22d3ee',
      fg: '#f8fafc',
    })
  })

  it('uses the requested light palette', () => {
    expect(themes.light).toMatchObject({
      bg: '#ffffff',
      surface: '#f8fafc',
      primary: '#2563eb',
      fg: '#0f172a',
    })
  })
})
