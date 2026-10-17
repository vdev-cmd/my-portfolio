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
    skills: ['E-commerce (B2C)', 'ERP systems', 'POS systems', 'Finance', 'HRM', 'Sales', 'CRM'],
  },
  {
    id: 'architecture',
    title: 'Architecture',
    icon: 'layers',
    skills: [
      'OOP',
      'MVC',
      'MVVM',
      'Clean Architecture',
      'Repository Pattern',
      'Dependency Injection',
    ],
  },
  {
    id: 'state',
    title: 'State Management',
    icon: 'workflow',
    skills: ['Riverpod', 'GetX'],
  },
  {
    id: 'backend',
    title: 'Backend and Integration',
    icon: 'plug',
    skills: [
      'REST APIs',
      'JSON',
      'JWT authentication',
      'Firebase Authentication',
      'Laravel Lumen',
      'MySQL',
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
      'Firebase Cloud Messaging',
      'Android Studio',
      'VS Code',
      'Cursor',
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
