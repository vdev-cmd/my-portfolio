import {
  Boxes,
  Brain,
  Building,
  Code,
  FlaskConical,
  GitPullRequest,
  GraduationCap,
  Layers,
  Mail,
  Plug,
  Search,
  Smartphone,
  Sparkles,
  Target,
  Workflow,
  Wrench,
} from '@lucide/vue'
import type { Component } from 'vue'
import type { IconName } from '../../../types/common'
import GithubIcon from './GithubIcon.vue'
import LinkedinIcon from './LinkedinIcon.vue'
import TelegramIcon from './TelegramIcon.vue'

/** Single registry of data-driven icons; only these are bundled. */
export const icons: Record<IconName, Component> = {
  smartphone: Smartphone,
  layers: Layers,
  workflow: Workflow,
  plug: Plug,
  wrench: Wrench,
  'graduation-cap': GraduationCap,
  building: Building,
  boxes: Boxes,
  'flask-conical': FlaskConical,
  'git-pull-request': GitPullRequest,
  code: Code,
  search: Search,
  brain: Brain,
  target: Target,
  sparkles: Sparkles,
  mail: Mail,
  github: GithubIcon,
  linkedin: LinkedinIcon,
  telegram: TelegramIcon,
}
