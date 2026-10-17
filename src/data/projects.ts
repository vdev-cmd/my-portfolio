import type { Project, ProjectCategory } from '../types/projects.ts'

export const projectCategories: ProjectCategory[] = [
  { id: 'enterprise', label: 'Enterprise ERP', icon: 'building' },
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
 * Every entry is SAMPLE CONTENT (`status: 'sample' | 'planned'`) and says so on the card. Replace
 * the text with real project information, add `repoUrl` / `demoUrl` for PUBLIC work only, and
 * change `status` when it is accurate.
 *
 * Never publish proprietary source code, confidential business data, internal screenshots,
 * credentials or private repository URLs. For employer work, describe architecture and
 * engineering decisions only. Screenshots go in `public/images/projects/`.
 */
export const projects: Project[] = [
  {
    id: 'enterprise-erp-mobile',
    title: 'Enterprise ERP Mobile Application',
    category: 'enterprise',
    status: 'sample',
    description:
      'Case-study placeholder for a Flutter client of an ERP system. Source code and screenshots are private, so this entry covers architecture and engineering decisions only.',
    technologies: ['Flutter', 'Dart', 'REST APIs', 'Riverpod', 'Clean Architecture'],
    features: [
      'Workflow-driven screens for business processes',
      'Token-based authentication against enterprise APIs',
      'Role-aware navigation and permissions',
    ],
    challenges: [
      'Modelling complex, multi-step business workflows in the UI layer',
      'Keeping a large codebase maintainable as requirements change',
    ],
    architecture:
      'Layered presentation, domain and data modules with repositories in front of the REST API, and dependency injection to keep features independently testable.',
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
