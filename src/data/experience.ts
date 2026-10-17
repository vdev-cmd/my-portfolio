import type { ExperienceItem } from '../types/experience.ts'

/**
 * Professional experience, newest first.
 *
 * The entry below is a PLACEHOLDER only because the company name and dates are not confirmed.
 * The responsibilities come from your own professional summary. Replace the bracketed values,
 * verify every line, then delete `placeholder: true`.
 *
 * Add `achievements` and `impact` only with verified facts. Both are optional and are not
 * rendered when omitted, so nothing is invented. Example shape:
 *   achievements: ['Led the migration of <module> to Clean Architecture'],
 *   impact: 'Reduced <metric> from <x> to <y> (only if you can substantiate it).',
 */
export const experience: ExperienceItem[] = [
  {
    id: 'flutter-engineer',
    company: '[Company name]',
    role: 'Mobile Application Developer / Flutter Engineer',
    period: '[Start date] – Present',
    summary:
      'Building cross-platform Android and iOS applications in Flutter for enterprise ERP and POS systems, covering Finance, HRM, Sales and CRM modules.',
    responsibilities: [
      'Build and maintain Flutter applications for Android and iOS in enterprise ERP and POS systems.',
      'Deliver Finance, Human Resource Management (HRM), Sales and CRM modules.',
      'Integrate RESTful APIs, including authentication flows, error handling and API debugging.',
      'Structure code with Riverpod, MVVM and Clean Architecture for scalable, maintainable apps.',
      'Monitor stability with Firebase Crashlytics, share builds through Firebase App Distribution and send push notifications with OneSignal.',
      'Work in Agile teams using Git, GitLab, Bitbucket and Jira.',
      'Use AI development tools such as Claude Code and Gemini to improve productivity and code quality.',
    ],
    technologies: [
      'Flutter',
      'Dart',
      'Riverpod',
      'MVVM',
      'Clean Architecture',
      'REST APIs',
      'Firebase Crashlytics',
      'Firebase App Distribution',
      'OneSignal',
      'Git',
      'GitLab',
      'Bitbucket',
      'Jira',
    ],
    placeholder: true,
  },
]
