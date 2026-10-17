import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ExperienceCard from '@/components/common/ExperienceCard.vue'
import { icons } from '@/components/ui/icons'
import { experience } from '@/data/experience'
import { journey } from '@/data/journey'
import { profile } from '@/data/profile'
import { projectCategories, projects } from '@/data/projects'
import { site } from '@/data/site'
import { skillCategories } from '@/data/skills'
import type { ExperienceItem, IconName } from '@/types'

const unique = (values: string[]) => new Set(values).size === values.length

describe('content integrity', () => {
  it('has unique ids in every collection', () => {
    expect(unique(projects.map((p) => p.id))).toBe(true)
    expect(unique(experience.map((e) => e.id))).toBe(true)
    expect(unique(skillCategories.map((s) => s.id))).toBe(true)
    expect(unique(journey.roadmap.map((r) => r.id))).toBe(true)
    expect(unique([...journey.experiments, ...journey.milestones].map((i) => i.id))).toBe(true)
  })

  it('assigns every project to a known category', () => {
    const known = new Set(projectCategories.map((c) => c.id))
    for (const project of projects) expect(known.has(project.category), project.id).toBe(true)
  })

  it('covers the five requested project categories', () => {
    expect(projectCategories.map((c) => c.id)).toEqual([
      'enterprise',
      'architecture',
      'api',
      'ai',
      'open-source',
    ])
  })

  it('only references icons that exist', () => {
    const used: IconName[] = [
      ...skillCategories.map((s) => s.icon),
      ...projectCategories.map((c) => c.icon),
      ...profile.about.pillars.map((p) => p.icon),
    ]
    for (const name of used) expect(icons[name], name).toBeDefined()
  })

  it('separates professional skills from the single "currently learning" group', () => {
    const learning = skillCategories.filter((s) => s.learning)
    expect(learning).toHaveLength(1)
    expect(learning[0]!.title).toBe('Currently Learning')
    expect(learning[0]!.skills).toEqual([
      'Python',
      'FastAPI',
      'LLM APIs',
      'RAG',
      'AI Agents',
      'Vector Databases',
    ])
    // No proficiency percentages anywhere in the skills data.
    expect(JSON.stringify(skillCategories)).not.toMatch(/\d+\s?%/)
  })

  it('states the same years of experience everywhere', () => {
    const copy = [
      profile.intro,
      ...profile.about.paragraphs,
      ...profile.about.facts.map((fact) => fact.value),
      site.description,
    ].join('\n')

    expect(copy).toContain('5+ years')
    expect(copy).not.toMatch(/\b4\+/)
  })

  it('reflects the professional summary: ERP/POS, modules and tooling', () => {
    const professional = skillCategories.filter((s) => !s.learning).flatMap((s) => s.skills)
    for (const skill of [
      'ERP systems',
      'POS systems',
      'Finance',
      'HRM',
      'Sales',
      'CRM',
      'Riverpod',
      'MVVM',
      'Clean Architecture',
      'Firebase Crashlytics',
      'Firebase App Distribution',
      'OneSignal push notifications',
      'Git',
      'GitLab',
      'Bitbucket',
      'Jira',
    ]) {
      expect(professional, skill).toContain(skill)
    }
    expect(profile.about.paragraphs.join(' ')).toContain('Human Resource Management (HRM)')
  })

  it('lists Claude Code and Gemini as development tools in use, not as things being learned', () => {
    const assisted = skillCategories.find((s) => s.id === 'ai-assisted')!
    expect(assisted.learning).toBeUndefined()
    expect(assisted.skills).toEqual(['Claude Code', 'Gemini'])
    const learning = skillCategories.find((s) => s.learning)!
    expect(learning.skills).not.toContain('Claude Code')
  })

  it('never presents AI learning as completed or published work', () => {
    expect(journey.roadmap.every((step) => step.status !== 'completed')).toBe(true)
    expect(journey.experiments.every((item) => item.status === 'planned')).toBe(true)
    expect(journey.milestones.every((item) => item.status === 'planned')).toBe(true)
    expect(journey.repositories).toEqual([])
    expect(projects.find((p) => p.category === 'ai')!.status).not.toBe('completed')
  })

  it('has a six-step roadmap in the intended order', () => {
    expect(journey.roadmap.map((s) => s.title)).toEqual([
      'Python and FastAPI',
      'LLM API Integration',
      'RAG and Embeddings',
      'AI Agents and Tool Calling',
      'Enterprise AI Integration',
      'Production AI Deployment',
    ])
  })

  it('keeps unconfirmed experience and project content visibly flagged', () => {
    for (const item of experience) {
      if (item.company.startsWith('[')) expect(item.placeholder, item.id).toBe(true)
    }
    for (const project of projects) {
      expect(['sample', 'planned', 'in-progress', 'completed']).toContain(project.status)
      // Placeholder projects must not point at repositories or demos that cannot exist yet.
      if (project.status === 'sample') {
        expect(project.repoUrl, project.id).toBeUndefined()
        expect(project.demoUrl, project.id).toBeUndefined()
      }
    }
  })

  it('does not publish invented numbers in experience or project copy', () => {
    const text = JSON.stringify([experience, projects]).toLowerCase()
    expect(text).not.toMatch(/\d+\s?%|\d+x faster|reduced .* by \d|increased .* by \d/)
  })

  it('publishes only approved contact details', () => {
    expect(profile.email).toBeUndefined()
    expect(profile.linkedin).toBeUndefined()
    expect(profile.github).toMatch(/^https:\/\/github\.com\/[\w-]+$/)
    expect(profile.telegram).toBe('https://t.me/mengvsl')
    expect(profile.location).toBe('Phnom Penh, Cambodia')
  })

  it('has SEO copy of a sensible length', () => {
    expect(site.title.length).toBeLessThanOrEqual(70)
    expect(site.description.length).toBeGreaterThan(70)
    expect(site.description.length).toBeLessThanOrEqual(170)
  })
})

describe('ExperienceCard', () => {
  const base: ExperienceItem = {
    id: 'x',
    company: 'Acme Ltd',
    role: 'Engineer',
    period: '2020 – 2022',
    summary: 'Summary text.',
    responsibilities: ['Did a thing'],
    technologies: ['Dart'],
  }

  it('renders the required fields', () => {
    const wrapper = mount(ExperienceCard, { props: { item: base } })

    expect(wrapper.get('h3').text()).toBe('Engineer')
    expect(wrapper.text()).toContain('Acme Ltd')
    expect(wrapper.text()).toContain('2020 – 2022')
    expect(wrapper.text()).toContain('Did a thing')
    expect(wrapper.text()).toContain('Dart')
  })

  it('renders no achievements or impact block when none are provided', () => {
    const text = mount(ExperienceCard, { props: { item: base } }).text()
    expect(text).not.toContain('Key achievements')
    expect(text).not.toContain('Business impact')
  })

  it('renders achievements and business impact when provided', () => {
    const wrapper = mount(ExperienceCard, {
      props: { item: { ...base, achievements: ['Shipped X'], impact: 'Helped Y' } },
    })
    expect(wrapper.text()).toContain('Key achievements')
    expect(wrapper.text()).toContain('Shipped X')
    expect(wrapper.text()).toContain('Business impact')
    expect(wrapper.text()).toContain('Helped Y')
  })

  it('flags placeholder content and links the company only when a URL exists', () => {
    const flagged = mount(ExperienceCard, { props: { item: { ...base, placeholder: true } } })
    expect(flagged.text()).toContain('Sample content')
    expect(flagged.find('a').exists()).toBe(false)

    const linked = mount(ExperienceCard, {
      props: { item: { ...base, companyUrl: 'https://acme.test' } },
    })
    expect(linked.get('a').attributes('href')).toBe('https://acme.test')
    expect(linked.get('a').attributes('rel')).toBe('noopener noreferrer')
  })

  const lines = (n: number) => Array.from({ length: n }, (_, i) => `Line ${i + 1}`)
  const visibleItems = (wrapper: ReturnType<typeof mount>) =>
    wrapper
      .findAll('ul[id$="-responsibilities"] > li')
      .filter((li) => (li.element as HTMLElement).style.display !== 'none')

  it('collapses long lists behind an accessible toggle, keeping every line in the DOM', async () => {
    const wrapper = mount(ExperienceCard, {
      props: { item: { ...base, responsibilities: lines(9) } },
    })
    const toggle = wrapper.get('button')

    expect(wrapper.findAll('ul[id$="-responsibilities"] > li')).toHaveLength(9)
    expect(visibleItems(wrapper)).toHaveLength(5)
    expect(toggle.text()).toContain('Show 4 more')
    expect(toggle.attributes('aria-expanded')).toBe('false')
    expect(wrapper.find(`#${toggle.attributes('aria-controls')}`).exists()).toBe(true)

    await toggle.trigger('click')
    expect(visibleItems(wrapper)).toHaveLength(9)
    expect(toggle.text()).toContain('Show less')
    expect(toggle.attributes('aria-expanded')).toBe('true')

    await toggle.trigger('click')
    expect(visibleItems(wrapper)).toHaveLength(5)
  })

  it('never hides a single line behind a toggle', () => {
    const wrapper = mount(ExperienceCard, {
      props: { item: { ...base, responsibilities: lines(6) } },
    })
    expect(wrapper.find('button').exists()).toBe(false)
    expect(visibleItems(wrapper)).toHaveLength(6)
  })

  it('emphasises the label of "Label: detail" lines', () => {
    const wrapper = mount(ExperienceCard, {
      props: {
        item: { ...base, responsibilities: ['Built Finance features: advances and receipts'] },
      },
    })
    expect(wrapper.get('ul[id$="-responsibilities"] strong').text()).toBe('Built Finance features:')
    expect(wrapper.get('ul[id$="-responsibilities"] li').text()).toContain('advances and receipts')
  })

  it('highlights the current role', () => {
    const current = mount(ExperienceCard, { props: { item: { ...base, current: true } } })
    const previous = mount(ExperienceCard, { props: { item: base } })
    expect(current.html()).toContain('bg-primary')
    expect(previous.html()).not.toContain('border-primary bg-primary')
  })

  it('lists the tech stack in a labelled side panel', () => {
    const wrapper = mount(ExperienceCard, { props: { item: base } })
    const aside = wrapper.get('aside')
    expect(wrapper.get(`#${aside.attributes('aria-labelledby')}`).text()).toBe('Tech stack')
    expect(aside.findAll('li').map((li) => li.text())).toEqual(['Dart'])
  })
})
