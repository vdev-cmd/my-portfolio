import type { IconName } from './common.ts'

export interface SkillCategory {
  id: string
  title: string
  icon: IconName
  skills: string[]
  /** Skills in this group are being learned, not professional experience. */
  learning?: boolean
}
