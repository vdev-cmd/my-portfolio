import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { projectCategories, projects } from '@/data/projects'
import ProjectsSection from '@/sections/ProjectsSection.vue'

const cards = (wrapper: ReturnType<typeof mount>) => wrapper.findAll('article')
const filterButtons = (wrapper: ReturnType<typeof mount>) =>
  wrapper.findAll('[role="group"] button')

describe('ProjectsSection', () => {
  afterEach(() => {
    vi.doUnmock('@/data/projects')
    vi.resetModules()
  })

  it('renders one card per project, each with its own title', () => {
    const wrapper = mount(ProjectsSection)

    expect(cards(wrapper)).toHaveLength(projects.length)
    const titles = cards(wrapper).map((card) => card.get('h3').text())
    expect(titles).toEqual(projects.map((project) => project.title))
  })

  it('labels the section with its heading', () => {
    const wrapper = mount(ProjectsSection)
    const section = wrapper.get('section#projects')
    expect(wrapper.get(`#${section.attributes('aria-labelledby')}`).text()).toBe(
      'Featured projects',
    )
  })

  it('offers an "All" filter plus one per category in use, with counts', () => {
    const wrapper = mount(ProjectsSection)
    const labels = filterButtons(wrapper).map((button) => button.text())

    expect(labels[0]).toContain('All')
    expect(labels).toHaveLength(1 + new Set(projects.map((project) => project.category)).size)
    expect(wrapper.get('[role="status"]').text()).toBe(
      `Showing ${projects.length} of ${projects.length} projects`,
    )
  })

  it('filters by category and announces the result', async () => {
    const wrapper = mount(ProjectsSection)
    const target = projectCategories.find((category) => category.id === 'ai')!
    const button = filterButtons(wrapper).find((b) => b.text().includes(target.label))!

    await button.trigger('click')

    const expected = projects.filter((project) => project.category === 'ai')
    expect(cards(wrapper).map((card) => card.get('h3').text())).toEqual(
      expected.map((p) => p.title),
    )
    expect(button.attributes('aria-pressed')).toBe('true')
    expect(filterButtons(wrapper)[0]!.attributes('aria-pressed')).toBe('false')
    expect(wrapper.get('[role="status"]').text()).toBe(
      `Showing ${expected.length} of ${projects.length} projects`,
    )
  })

  it('restores every project when "All" is selected again', async () => {
    const wrapper = mount(ProjectsSection)
    await filterButtons(wrapper)[2]!.trigger('click')
    expect(cards(wrapper).length).toBeLessThan(projects.length)

    await filterButtons(wrapper)[0]!.trigger('click')

    expect(cards(wrapper)).toHaveLength(projects.length)
    expect(filterButtons(wrapper)[0]!.attributes('aria-pressed')).toBe('true')
  })

  it('hides the filter when there are too few projects for it to help', async () => {
    vi.resetModules()
    vi.doMock('@/data/projects', async (importOriginal) => {
      const original = await importOriginal<typeof import('@/data/projects')>()
      return { ...original, projects: original.projects.slice(0, 2) }
    })
    const { default: Section } = await import('@/sections/ProjectsSection.vue')

    const wrapper = mount(Section)

    expect(wrapper.find('[role="group"]').exists()).toBe(false)
    expect(wrapper.findAll('article')).toHaveLength(2)
  })
})
