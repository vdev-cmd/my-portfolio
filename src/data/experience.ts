import type { ExperienceItem } from '../types/experience.ts'

/**
 * Professional experience, newest first, taken from the resume.
 *
 * Company names are kept generic on purpose. Replace `period` with real dates when you want them
 * shown.
 *
 * Add `achievements` and `impact` only with verified facts. Both are optional and are not
 * rendered when omitted, so nothing is invented.
 */
export const experience: ExperienceItem[] = [
  {
    id: 'erp-flutter-developer',
    company: 'Enterprise software company',
    role: 'Flutter Mobile Application Developer',
    period: 'Current role',
    summary:
      'Developing and maintaining an enterprise ERP mobile application for Android and iOS that supports Finance, Human Resources, Sales, CRM and other business operations.',
    responsibilities: [
      'Built Finance features: travel requests and allowances, employee advances, expense receipts with tax and vendor details, and settlements.',
      'Built HRM features: employee profiles, leave and attendance, performance appraisal, recruitment and payroll information.',
      'Built Sales and CRM features: customers, orders, quotations, support cases and dynamic API-driven forms.',
      'Structured the app with MVVM, Riverpod, Clean Architecture and the Repository Pattern, with reusable widgets and modular features.',
      'Integrated RESTful APIs with JWT authentication, including async state, loading and error handling.',
      'Monitored stability with Firebase Crashlytics, shared test builds through Firebase App Distribution and sent push notifications with OneSignal.',
      'Investigated and resolved complex bugs and production issues, and supported testing and release preparation.',
      'Worked in an Agile team with Jira, Git, GitLab and Bitbucket alongside backend, QA, UI/UX and business stakeholders.',
      'Used Claude Code and Gemini for code analysis, refactoring and productivity.',
    ],
    technologies: [
      'Flutter',
      'Dart',
      'Riverpod',
      'MVVM',
      'Clean Architecture',
      'Repository Pattern',
      'REST APIs',
      'JWT',
      'Firebase Crashlytics',
      'Firebase App Distribution',
      'OneSignal',
      'Git',
      'GitLab',
      'Bitbucket',
      'Jira',
    ],
  },
  {
    id: 'ecommerce-flutter-developer',
    company: 'E-commerce company',
    role: 'Flutter Mobile Application Developer',
    period: 'Previous role',
    summary:
      'Developed and maintained a cross-platform B2C e-commerce app for Android and iOS, focusing on performance, user experience, secure authentication and backend integration.',
    responsibilities: [
      'Built the Android and iOS app in Flutter and Dart with an MVC architecture and GetX state management.',
      'Integrated RESTful APIs with a Laravel Lumen backend and MySQL database.',
      'Implemented phone number verification and social sign-in with Firebase Authentication.',
      'Added push notifications for customer engagement with Firebase Cloud Messaging.',
      'Developed reusable UI components and responsive screens, and optimized navigation.',
      'Debugged, tested and optimized performance for stable releases, working closely with backend developers.',
    ],
    technologies: [
      'Flutter',
      'Dart',
      'GetX',
      'MVC',
      'Laravel Lumen',
      'MySQL',
      'Firebase Authentication',
      'Firebase Cloud Messaging',
    ],
  },
]
