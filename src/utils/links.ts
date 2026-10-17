import type { ContactChannel, Profile } from '../types/profile'

export function stripProtocol(url: string): string {
  return url.replace(/^https?:\/\//i, '').replace(/\/+$/, '')
}

/**
 * Builds the list of contact channels from the profile. Channels without a configured value
 * are skipped, so the UI never renders a link that goes nowhere.
 */
export function getContactChannels(profile: Profile): ContactChannel[] {
  const channels: ContactChannel[] = []

  if (profile.email) {
    channels.push({
      id: 'email',
      label: 'Email',
      href: `mailto:${profile.email}`,
      display: profile.email,
      icon: 'mail',
    })
  }
  if (profile.github) {
    channels.push({
      id: 'github',
      label: 'GitHub',
      href: profile.github,
      display: stripProtocol(profile.github),
      icon: 'github',
    })
  }
  if (profile.linkedin) {
    channels.push({
      id: 'linkedin',
      label: 'LinkedIn',
      href: profile.linkedin,
      display: stripProtocol(profile.linkedin),
      icon: 'linkedin',
    })
  }
  if (profile.telegram) {
    channels.push({
      id: 'telegram',
      label: 'Telegram',
      href: profile.telegram,
      display: stripProtocol(profile.telegram),
      icon: 'telegram',
    })
  }

  return channels
}

export function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href)
}
