import type { JourneyData } from '../types/journey.ts'

/**
 * The AI engineering journey. Everything here is a learning goal or a plan.
 * Do not set a status to `completed` (or add repositories) until it is true and public.
 */
export const journey: JourneyData = {
  why: [
    'After years of building enterprise mobile apps, I keep seeing the same pattern: the valuable data and workflows live in business systems, and people reach them through apps. LLMs, retrieval and tool calling make it possible to put a far more capable interface in front of those systems.',
    'I am learning Applied AI Engineering to build that bridge: staying strong on the mobile and API side while growing into the Python, model and retrieval side. This section is a transparent learning log. Items are goals or work in progress, not shipped production AI experience.',
  ],

  focusAreas: ['Python', 'FastAPI', 'LLM APIs', 'RAG', 'AI agents', 'Vector databases'],

  roadmap: [
    {
      id: 'python-fastapi',
      title: 'Python and FastAPI',
      description:
        'Python fundamentals and building typed REST services with FastAPI, a natural step from API integration on the client side.',
      topics: ['Python', 'FastAPI', 'REST design'],
      status: 'learning',
    },
    {
      id: 'llm-apis',
      title: 'LLM API Integration',
      description:
        'Calling hosted LLM APIs, designing prompts, and streaming structured responses through a backend service.',
      topics: ['LLM APIs', 'Prompting', 'Streaming'],
      status: 'learning',
    },
    {
      id: 'rag',
      title: 'RAG and Embeddings',
      description:
        'Embeddings, chunking, vector databases and retrieval pipelines that ground answers in business documents.',
      topics: ['Embeddings', 'Vector databases', 'Retrieval'],
      status: 'learning',
    },
    {
      id: 'agents',
      title: 'AI Agents and Tool Calling',
      description:
        'Letting models call well-defined tools and APIs, with guardrails, to complete multi-step tasks.',
      topics: ['Tool calling', 'AI agents', 'Guardrails'],
      status: 'learning',
    },
    {
      id: 'enterprise-ai',
      title: 'Enterprise AI Integration',
      description:
        'Connecting AI services to ERP-style systems securely: authentication, permissions, auditability and data boundaries.',
      topics: ['Authentication', 'Permissions', 'System integration'],
      status: 'goal',
    },
    {
      id: 'production-ai',
      title: 'Production AI Deployment',
      description:
        'Deploying, monitoring and evaluating AI services, with attention to cost, latency and reliability.',
      topics: ['Deployment', 'Monitoring', 'Evaluation'],
      status: 'goal',
    },
  ],

  experiments: [
    {
      id: 'fastapi-llm-wrapper',
      title: 'FastAPI service around an LLM API',
      description:
        'A small typed service that exposes a chat endpoint, as the base for later experiments.',
      status: 'planned',
    },
    {
      id: 'document-qa',
      title: 'Document Q&A with RAG',
      description: 'Embed a set of public documents and answer questions with cited sources.',
      status: 'planned',
    },
    {
      id: 'tool-calling-assistant',
      title: 'Tool-calling assistant for a REST API',
      description: 'Let a model call a documented REST API through validated tool definitions.',
      status: 'planned',
    },
    {
      id: 'flutter-ai-client',
      title: 'Flutter client for an AI backend',
      description: 'Connect a Flutter app to the FastAPI service and explore streaming on mobile.',
      status: 'planned',
    },
  ],

  milestones: [
    {
      id: 'ms-fundamentals',
      title: 'Finish Python and FastAPI fundamentals',
      description: 'Comfortable building and testing small typed services.',
      status: 'planned',
    },
    {
      id: 'ms-first-experiment',
      title: 'Publish a first LLM API experiment',
      description: 'A public repository with a README that explains what was learned.',
      status: 'planned',
    },
    {
      id: 'ms-rag',
      title: 'Build and evaluate a basic RAG pipeline',
      description: 'Measure retrieval quality instead of relying on impressions.',
      status: 'planned',
    },
    {
      id: 'ms-end-to-end',
      title: 'Ship an end-to-end AI feature',
      description: 'A Flutter client talking to a Python backend that uses an LLM.',
      status: 'planned',
    },
  ],

  // Add public repositories here as experiments are published:
  // { name: 'fastapi-llm-starter', description: '…', url: 'https://github.com/<user>/<repo>' }
  repositories: [],
}
