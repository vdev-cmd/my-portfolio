import type { NavItem } from '../types/common.ts'

/** Order here is the order of the navigation and of the sections on the page. */
export const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'ai-journey', label: 'AI Journey' },
  { id: 'contact', label: 'Contact' },
] as const satisfies readonly NavItem[]

export const sectionIds: readonly string[] = navItems.map((item) => item.id)
