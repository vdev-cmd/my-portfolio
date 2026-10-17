import type { ProgressStatus } from './common.ts'

export interface RoadmapStep {
  id: string
  title: string
  description: string
  topics: string[]
  status: Extract<ProgressStatus, 'goal' | 'learning' | 'completed'>
}

export interface JourneyItem {
  id: string
  title: string
  description: string
  status: Extract<ProgressStatus, 'planned' | 'in-progress' | 'completed'>
  /** Only set for work that is public. */
  url?: string
}

export interface RepositoryLink {
  name: string
  description: string
  url: string
}

export interface JourneyData {
  why: string[]
  focusAreas: string[]
  roadmap: RoadmapStep[]
  experiments: JourneyItem[]
  milestones: JourneyItem[]
  repositories: RepositoryLink[]
}
