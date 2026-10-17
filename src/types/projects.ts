import type { IconName, ProgressStatus } from './common.ts'

export type ProjectCategoryId = 'enterprise' | 'architecture' | 'api' | 'ai' | 'open-source'

export interface ProjectCategory {
  id: ProjectCategoryId
  label: string
  icon: IconName
}

export interface ProjectImage {
  /** Path relative to `public/` (e.g. `images/projects/app.webp`) or an absolute URL. */
  src: string
  alt: string
  /** Intrinsic size; reserves space so the layout does not shift while the image loads. */
  width: number
  height: number
}

export interface Project {
  id: string
  title: string
  category: ProjectCategoryId
  status: ProgressStatus
  description: string
  technologies: string[]
  features: string[]
  challenges: string[]
  architecture: string
  screenshot?: ProjectImage
  /** Public repositories only — never link private or proprietary code. */
  repoUrl?: string
  demoUrl?: string
}
