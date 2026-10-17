import type { Project, ProjectCategory } from '../types/projects.ts'

export const projectCategories: ProjectCategory[] = [
  { id: 'enterprise', label: 'Professional Work', icon: 'building' },
  { id: 'architecture', label: 'Architecture & Components', icon: 'boxes' },
  { id: 'api', label: 'API Integration', icon: 'plug' },
  { id: 'ai', label: 'AI Learning', icon: 'flask-conical' },
  { id: 'open-source', label: 'Open Source', icon: 'git-pull-request' },
]

/** Filtering is only offered once there are at least this many projects to filter. */
export const FILTER_MIN_PROJECTS = 4

/**
 * Featured projects.
 *
 * The `enterprise` entries describe shipped employer work, taken from the resume. The other
 * entries are still SAMPLE CONTENT (`status: 'sample' | 'planned'`) and say so on the card. Add
 * `repoUrl` / `demoUrl` for PUBLIC work only, and change `status` when it is accurate.
 *
 * Never publish proprietary source code, confidential business data, internal screenshots,
 * credentials or private repository URLs. For employer work, describe architecture and
 * engineering decisions only. Screenshots go in `public/images/projects/`.
 */
export const projects: Project[] = [
  {
    id: 'erp-finance',
    title: 'ERP Finance Module',
    category: 'enterprise',
    status: 'completed',
    description:
      'Finance workflows in a Flutter ERP app for Android and iOS: employees raise financial requests and track them through approval from their phone. The source code is private, so this covers features and engineering decisions only.',
    technologies: ['Flutter', 'Dart', 'Riverpod', 'Clean Architecture', 'REST APIs', 'JWT'],
    features: [
      'Travel requests, travel completion and allowance management',
      'Employee advance requests with payment method selection',
      'Expense receipts with tax calculation, discounts and vendor details',
      'Settlement workflows and multi-step approvals',
    ],
    challenges: [
      'Keeping tax, discount and total calculations consistent with the ERP backend',
      'Validating financial data on submission and surfacing backend errors clearly',
    ],
    architecture:
      'Feature modules with Riverpod view models over use cases and repositories, so finance rules stay out of the UI and each request type reuses the same submission and approval flow.',
  },
  {
    id: 'erp-hrm',
    title: 'ERP Human Resource Management (HRM)',
    category: 'enterprise',
    status: 'completed',
    description:
      'Employee self-service for the ERP mobile app, covering profiles, leave, attendance, performance and recruitment, so everyday HR processes no longer need a desktop.',
    technologies: ['Flutter', 'Dart', 'Riverpod', 'MVVM', 'REST APIs', 'OneSignal'],
    features: [
      'Employee profile with personal details and company asset information',
      'Leave requests and planning with attachments, plus attendance requests',
      'Goal setting, performance appraisal and employee evaluation',
      'Recruitment workflows, applicant information and job offer approval',
      'Payroll-related information integrated with the HR system',
    ],
    challenges: [
      'Supporting many HR processes that share approval steps but differ in their data',
      'Handling sensitive employee information carefully on the device',
    ],
    architecture:
      'MVVM with Clean Architecture layers and shared approval and attachment components, so new HR request types reuse existing building blocks instead of duplicating them.',
  },
  {
    id: 'erp-sales-crm',
    title: 'ERP Sales and CRM',
    category: 'enterprise',
    status: 'completed',
    description:
      'Sales and customer management features for the ERP mobile app: customer records, orders, quotations and support cases.',
    technologies: ['Flutter', 'Dart', 'Riverpod', 'Clean Architecture', 'REST APIs'],
    features: [
      'Customer information management',
      'Sales processes, customer orders and quotations',
      'Support cases with details, status management and activity history',
      'Dynamic forms built from API-driven data sources',
    ],
    challenges: [
      'Rendering forms whose fields and options are defined by the backend',
      'Keeping case status and activity history in sync with the server',
    ],
    architecture:
      'Dynamic form fields are described by the API and rendered by reusable widgets, so many business forms need backend configuration rather than new screens.',
  },
  {
    id: 'b2c-ecommerce',
    title: 'B2C E-Commerce Mobile App',
    category: 'enterprise',
    status: 'completed',
    description:
      'A cross-platform shopping app for Android and iOS, focused on performance, a smooth user experience, secure sign-in and backend integration.',
    technologies: ['Flutter', 'Dart', 'GetX', 'MVC', 'Laravel Lumen', 'MySQL', 'Firebase'],
    features: [
      'Phone number verification and social sign-in with Firebase Authentication',
      'Push notifications for customer engagement with Firebase Cloud Messaging',
      'REST API integration with a Laravel Lumen backend',
      'Reusable UI components and responsive screens',
    ],
    challenges: [
      'Keeping navigation and interactions fast on a wide range of devices',
      'Troubleshooting API issues together with the backend team',
    ],
    architecture:
      'MVC with GetX for state management and reactive UI updates, and a shared component library for consistent screens.',
  },
  {
    id: 'flutter-architecture-kit',
    title: 'Flutter Architecture and Reusable Components',
    category: 'architecture',
    status: 'sample',
    description:
      'Placeholder for a public reference project showing MVVM and Clean Architecture in Flutter, together with a small set of reusable UI components.',
    technologies: ['Flutter', 'Dart', 'MVVM', 'Riverpod', 'Dependency Injection'],
    features: [
      'Feature-first folder structure',
      'Repository pattern with swappable data sources',
      'Reusable, themed UI components',
    ],
    challenges: [
      'Keeping layers decoupled without excessive boilerplate',
      'Making components flexible without bloating their APIs',
    ],
    architecture:
      'Feature modules split into presentation (view models), domain (use cases, entities) and data (repositories, DTOs), wired together through dependency injection.',
  },
  {
    id: 'rest-api-integration',
    title: 'REST API Integration Examples',
    category: 'api',
    status: 'sample',
    description:
      'Placeholder for examples of robust API clients in Dart: authentication, token refresh, error mapping and testing against mocked responses.',
    technologies: ['Dart', 'REST APIs', 'JSON', 'Authentication', 'Postman'],
    features: [
      'Typed request and response models',
      'Interceptor-based authentication and token refresh',
      'Consistent error handling surfaced to the UI',
    ],
    challenges: [
      'Handling expired tokens without interrupting the user',
      'Making failures observable and debuggable in production',
    ],
    architecture:
      'A thin HTTP layer behind repository interfaces, with DTO-to-domain mapping and a central error type, so UI code never depends on transport details.',
  },
  {
    id: 'ai-learning-projects',
    title: 'AI Integration Learning Projects',
    category: 'ai',
    status: 'planned',
    description:
      'Planned hands-on experiments from my Applied AI learning path: a FastAPI service around an LLM API, a small RAG pipeline, and a Flutter client for an AI backend. Nothing here is built yet.',
    technologies: ['Python', 'FastAPI', 'LLM APIs', 'RAG', 'Flutter'],
    features: [
      'Typed FastAPI endpoints in front of an LLM API',
      'Embedding-based retrieval over public documents',
      'Flutter client consuming the AI backend',
    ],
    challenges: [
      'Learning retrieval quality and evaluation basics',
      'Designing safe tool definitions for model-driven API calls',
    ],
    architecture:
      'Planned: a Python backend that owns prompts, retrieval and tool calling, exposed to clients through a small, versioned REST interface.',
  },
  {
    id: 'open-source-contributions',
    title: 'Open-Source Contributions',
    category: 'open-source',
    status: 'sample',
    description:
      'Placeholder for contributions to the Flutter and Dart ecosystem. Replace this entry with real, linkable pull requests or packages, or remove it.',
    technologies: ['Dart', 'Flutter', 'Git', 'GitHub'],
    features: ['Bug fixes and documentation improvements', 'Small, reviewable pull requests'],
    challenges: [
      'Understanding an unfamiliar codebase quickly',
      'Matching maintainers’ conventions and test expectations',
    ],
    architecture:
      'Not applicable until real contributions are listed. Link the repository and pull requests in repoUrl.',
  },
]
