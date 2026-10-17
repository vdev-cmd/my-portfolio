import type { SkillCategory } from '../types/skills.ts'

/**
 * Skills grouped by category. No proficiency percentages are shown on purpose.
 * The group flagged `learning` is rendered separately and labelled as in progress.
 *
 * Order matters for the layout: the last professional category is the longest one so a partly
 * filled final grid row stretches cleanly.
 */
export const skillCategories: SkillCategory[] = [
  {
    id: 'mobile',
    title: 'Mobile Development',
    icon: 'smartphone',
    skills: ['Flutter', 'Dart', 'Android and iOS development', 'Cross-platform apps'],
  },
  {
    id: 'enterprise',
    title: 'Enterprise Applications',
    icon: 'building',
    skills: ['ERP systems', 'POS systems', 'Finance', 'HRM', 'Sales', 'CRM'],
  },
  {
    id: 'architecture',
    title: 'Architecture',
    icon: 'layers',
    skills: ['OOP', 'MVVM', 'Clean Architecture', 'Repository Pattern', 'Dependency Injection'],
  },
  {
    id: 'state',
    title: 'State Management',
    icon: 'workflow',
    skills: ['Riverpod', 'BLoC', 'GetX'],
  },
  {
    id: 'backend',
    title: 'Backend and Integration',
    icon: 'plug',
    skills: [
      'REST APIs',
      'JSON',
      'Authentication',
      'API debugging',
      'Enterprise system integration',
    ],
  },
  {
    id: 'ai-assisted',
    title: 'AI-Assisted Development',
    icon: 'sparkles',
    skills: ['Claude Code', 'Gemini'],
  },
  {
    id: 'tools',
    title: 'Engineering Tools',
    icon: 'wrench',
    skills: [
      'Git',
      'GitHub',
      'GitLab',
      'Bitbucket',
      'Jira',
      'Agile methodologies',
      'Firebase Crashlytics',
      'Firebase App Distribution',
      'OneSignal push notifications',
      'Postman',
      'CI/CD fundamentals',
    ],
  },
  {
    id: 'learning',
    title: 'Currently Learning',
    icon: 'graduation-cap',
    learning: true,
    skills: ['Python', 'FastAPI', 'LLM APIs', 'RAG', 'AI Agents', 'Vector Databases'],
  },
]
