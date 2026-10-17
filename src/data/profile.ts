import type { Profile } from '../types/profile.ts'

/**
 * Central personal information. Edit this file to update the Hero, About, Contact and Footer.
 *
 * Rules for this file:
 *  - Only publish facts that are true and approved for publication.
 *  - Leave `email`, `linkedin` and `photo` as `undefined` until you want them shown; every
 *    control that depends on them is hidden automatically, so no placeholder link ever ships.
 */
export const profile: Profile = {
  name: 'Meng Visal',
  initials: 'MV',
  role: 'Mobile Application Developer / Flutter Engineer',
  careerDirection: 'Applied AI Engineer / AI Integration Engineer',
  location: 'Phnom Penh, Cambodia',

  headline: {
    lead: 'Building Enterprise Mobile Experiences.',
    accent: 'Exploring the Future of Applied AI.',
  },
  intro:
    "I'm a Flutter Mobile Application Developer with 5+ years of experience building cross-platform Android and iOS applications, specializing in enterprise ERP and POS systems. I build scalable, maintainable, high-performance apps with Riverpod, MVVM and Clean Architecture, and I'm expanding into Applied AI Engineering to build intelligent, practical solutions for real business problems.",
  contactIntro:
    "Whether you're building enterprise mobile products, exploring how AI could fit into a business system, or just want to compare notes on Flutter architecture, I'd be glad to hear from you.",

  // TODO: add an email address you are happy to publish, e.g. 'name@example.com'.
  email: undefined,
  // Inferred from this repository's remote (vnotudev/my-portfolio) — change it if that is not your profile.
  github: 'https://github.com/vnotudev',
  // TODO: add your LinkedIn profile URL, e.g. 'https://www.linkedin.com/in/your-handle'.
  linkedin: undefined,
  // TODO (optional): add a photo in public/images and describe it, e.g.
  // { src: 'images/profile.webp', alt: 'Portrait of Meng Visal', width: 640, height: 640 }
  photo: undefined,

  resume: {
    path: 'resume.pdf',
    downloadName: 'Meng-Visal-Resume.pdf',
  },

  focus: {
    professional: [
      'Flutter & Dart',
      'ERP & POS apps',
      'Riverpod · MVVM · Clean Architecture',
      'REST API integration',
      'Firebase · OneSignal',
      'AI-assisted development',
    ],
    learning: ['Python & FastAPI', 'LLM APIs', 'RAG', 'AI agents & tool calling'],
  },

  about: {
    paragraphs: [
      "I'm a Flutter mobile application developer based in Phnom Penh with 5+ years of experience building cross-platform Android and iOS applications. I specialize in enterprise ERP and POS systems, delivering Finance, Human Resource Management (HRM), Sales and CRM modules.",
      'I focus on scalable, maintainable, high-performance applications with intuitive user experiences, built with Flutter, Dart, Riverpod, MVVM and Clean Architecture. Day to day that means RESTful API integration, Firebase Crashlytics for production stability, Firebase App Distribution for builds, OneSignal for push notifications, and Agile delivery with Git, GitLab, Bitbucket and Jira.',
      'I also use AI-powered development tools such as Claude Code and Gemini to improve productivity, raise code quality and work through complex technical problems. Building on that, I am now learning to build AI-powered systems themselves: Python, FastAPI, LLM APIs, RAG and agent tool calling, with the goal of integrating AI into enterprise software. I am early on that path, and the AI Journey section is explicit about what I am learning versus what I have shipped.',
    ],
    facts: [
      { label: 'Based in', value: 'Phnom Penh, Cambodia' },
      { label: 'Experience', value: '5+ years of professional Flutter development' },
      { label: 'Focus', value: 'Enterprise ERP and POS mobile apps' },
      { label: 'Modules', value: 'Finance, HRM, Sales and CRM' },
      { label: 'Direction', value: 'Applied AI / AI integration engineering' },
    ],
    pillars: [
      {
        title: 'Engineering philosophy',
        body: 'Readable, testable code with clear boundaries. MVVM and Clean Architecture keep business rules independent of UI and frameworks, which matters when enterprise requirements keep changing.',
        icon: 'code',
      },
      {
        title: 'Problem-solving approach',
        body: 'Reproduce first, then isolate. I check assumptions against logs, Firebase Crashlytics reports and real API responses, and fix root causes rather than symptoms.',
        icon: 'search',
      },
      {
        title: 'Interest in AI integration',
        body: 'I already use Claude Code and Gemini in my daily development work. Next I want to build with AI: exploring where LLMs, retrieval and tool calling make enterprise systems more useful, with proper authentication and data boundaries.',
        icon: 'brain',
      },
      {
        title: 'Long-term goal',
        body: 'Grow from mobile engineering into Applied AI and AI integration work: building reliable AI features that connect to real business systems, end to end.',
        icon: 'target',
      },
    ],
  },
}
