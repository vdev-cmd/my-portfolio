import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ProjectCard from '@/components/common/ProjectCard.vue'
import type { Project, ProjectCategory } from '@/types'

const category: ProjectCategory = { id: 'api', label: 'API Integration', icon: 'plug' }

const project: Project = {
  id: 'demo',
  title: 'Demo project',
  category: 'api',
  status: 'sample',
  description: 'A demo description.',
  technologies: ['Dart', 'REST APIs'],
  features: ['Feature one', 'Feature two'],
  challenges: ['Challenge one'],
  architecture: 'Layered architecture.',
}

const mountCard = (overrides: Partial<Project> = {}) =>
  mount(ProjectCard, { props: { project: { ...project, ...overrides }, category } })

describe('ProjectCard', () => {
  it('renders title, category, status, description and technologies', () => {
    const wrapper = mountCard()

    expect(wrapper.get('h3').text()).toBe('Demo project')
    expect(wrapper.text()).toContain('API Integration')
    expect(wrapper.text()).toContain('Sample content')
    expect(wrapper.text()).toContain('A demo description.')
    expect(wrapper.findAll('ul[aria-label="Technologies"] li').map((li) => li.text())).toEqual([
      'Dart',
      'REST APIs',
    ])
  })

  it('is labelled by its heading', () => {
    const wrapper = mountCard()
    const labelledBy = wrapper.get('article').attributes('aria-labelledby')!
    expect(wrapper.get(`#${labelledBy}`).text()).toBe('Demo project')
  })

  it('exposes features, challenges and architecture in a native disclosure', () => {
    const wrapper = mountCard()
    const details = wrapper.get('details')

    expect(details.attributes('open')).toBeUndefined()
    expect(details.get('summary').text()).toContain('Features, challenges')
    expect(details.text()).toContain('Feature two')
    expect(details.text()).toContain('Challenge one')
    expect(details.text()).toContain('Layered architecture.')
  })

  it('renders no links when no repository or demo is configured', () => {
    const wrapper = mountCard()
    expect(wrapper.findAll('a')).toHaveLength(0)
  })

  it('renders safe external links for the repository and live demo', () => {
    const wrapper = mountCard({
      repoUrl: 'https://github.com/someone/demo',
      demoUrl: 'https://demo.example.test',
    })

    const links = wrapper.findAll('a')
    expect(links.map((a) => a.attributes('href'))).toEqual([
      'https://github.com/someone/demo',
      'https://demo.example.test',
    ])
    for (const link of links) {
      expect(link.attributes('target')).toBe('_blank')
      expect(link.attributes('rel')).toBe('noopener noreferrer')
      expect(link.text()).toContain('(opens in a new tab)')
    }
  })

  it('shows a decorative placeholder when there is no screenshot', () => {
    const wrapper = mountCard()
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('Screenshot unavailable')
  })

  it('lazy-loads the screenshot with intrinsic size to avoid layout shift', () => {
    const wrapper = mountCard({
      screenshot: {
        src: 'images/projects/demo.webp',
        alt: 'Demo screen',
        width: 1280,
        height: 720,
      },
    })
    const img = wrapper.get('img')

    expect(img.attributes('src')).toBe(`${import.meta.env.BASE_URL}images/projects/demo.webp`)
    expect(img.attributes('alt')).toBe('Demo screen')
    expect(img.attributes('loading')).toBe('lazy')
    expect(img.attributes('decoding')).toBe('async')
    expect(img.attributes('width')).toBe('1280')
    expect(img.attributes('height')).toBe('720')
  })

  it('falls back gracefully when the screenshot fails to load', async () => {
    const wrapper = mountCard({
      screenshot: { src: 'images/missing.webp', alt: 'Missing', width: 10, height: 10 },
    })

    await wrapper.get('img').trigger('error')

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.text()).toContain('Screenshot unavailable')
  })
})
