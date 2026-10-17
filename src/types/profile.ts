import type { IconName } from './common.ts'

export interface ProfileImage {
  /** Path relative to `public/` (e.g. `images/profile.webp`) or an absolute URL. */
  src: string
  alt: string
  width: number
  height: number
}

export interface AboutPillar {
  title: string
  body: string
  icon: IconName
}

export interface Profile {
  name: string
  initials: string
  role: string
  careerDirection: string
  location: string
  headline: { lead: string; accent: string }
  intro: string
  contactIntro: string
  /** Leave undefined to hide every email control until you approve publishing an address. */
  email?: string
  /** Full profile URLs. Leave undefined to hide the link. */
  github?: string
  linkedin?: string
  photo?: ProfileImage
  resume: {
    /** File name inside `public/`. The button is only shown when the file exists at build time. */
    path: string
    downloadName: string
  }
  focus: {
    /** Technologies used professionally. */
    professional: string[]
    /** Technologies currently being learned — not professional experience. */
    learning: string[]
  }
  about: {
    paragraphs: string[]
    facts: { label: string; value: string }[]
    pillars: AboutPillar[]
  }
}

export type ChannelId = 'email' | 'github' | 'linkedin'

export interface ContactChannel {
  id: ChannelId
  label: string
  href: string
  /** Human-readable form of the destination (e.g. `github.com/user`). */
  display: string
  icon: IconName
}
