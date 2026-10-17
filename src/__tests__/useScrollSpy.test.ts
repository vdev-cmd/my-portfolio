import { mount, type VueWrapper } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { useScrollSpy } from '@/composables/useScrollSpy'

const IDS = ['home', 'about', 'skills'] as const

function setViewport({ scrollY, innerHeight, scrollHeight }: Record<string, number>) {
  Object.defineProperty(window, 'scrollY', { value: scrollY, configurable: true })
  Object.defineProperty(window, 'innerHeight', { value: innerHeight, configurable: true })
  Object.defineProperty(document.documentElement, 'scrollHeight', {
    value: scrollHeight,
    configurable: true,
  })
}

const setTop = (id: string, top: number) => {
  document.getElementById(id)!.getBoundingClientRect = () => ({ top }) as DOMRect
}

/** jsdom has no layout, so each section's `top` is supplied by the test. */
function addSections(tops: Record<string, number>) {
  for (const id of IDS) {
    const el = document.createElement('section')
    el.id = id
    document.body.appendChild(el)
    setTop(id, tops[id] ?? 0)
  }
}

describe('useScrollSpy', () => {
  // A controllable animation-frame queue: callbacks only run when the test flushes them.
  let frames: Map<number, FrameRequestCallback>
  let nextFrameId: number
  let mounted: VueWrapper[]

  function mountSpy() {
    let api!: ReturnType<typeof useScrollSpy>
    const wrapper = mount(
      defineComponent({
        setup() {
          api = useScrollSpy(IDS)
          return () => h('div')
        },
      }),
    )
    mounted.push(wrapper)
    return { api, wrapper }
  }

  beforeEach(() => {
    frames = new Map()
    nextFrameId = 0
    mounted = []
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      frames.set(++nextFrameId, cb)
      return nextFrameId
    })
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => {
      frames.delete(id)
    })
    setViewport({ scrollY: 0, innerHeight: 1000, scrollHeight: 4000 })
  })

  afterEach(() => {
    // Unmount first so no component keeps listening on `window` across tests.
    mounted.forEach((wrapper) => wrapper.unmount())
    for (const id of IDS) document.getElementById(id)?.remove()
  })

  const flush = () => {
    const pending = [...frames.values()]
    frames.clear()
    pending.forEach((cb) => cb(0))
  }
  const scrollTo = (y: number) => {
    setViewport({ scrollY: y, innerHeight: 1000, scrollHeight: 4000 })
    window.dispatchEvent(new Event('scroll'))
    flush()
  }

  it('starts on the first section', () => {
    addSections({ home: 0, about: 900, skills: 1800 })
    const { api } = mountSpy()
    expect(api.activeId.value).toBe('home')
  })

  it('activates the last section whose top has passed the reading line (35% of the viewport)', () => {
    addSections({ home: 0, about: 900, skills: 1800 })
    const { api } = mountSpy()

    // The reading line sits at 350px (35% of the 1000px viewport).
    setTop('home', -900)
    setTop('about', 351)
    scrollTo(900)
    expect(api.activeId.value).toBe('home')

    setTop('about', 350)
    scrollTo(901)
    expect(api.activeId.value).toBe('about')

    setTop('about', -500)
    setTop('skills', 100)
    scrollTo(1800)
    expect(api.activeId.value).toBe('skills')
  })

  it('pins the last section when scrolled to the bottom of the page', () => {
    addSections({ home: -3000, about: -2000, skills: 600 })
    const { api } = mountSpy()

    scrollTo(3000) // 3000 + 1000 viewport = 4000 = full document height

    expect(api.activeId.value).toBe('skills')
  })

  it('does not pin the last section on a page that is not scrolled', () => {
    addSections({ home: 0, about: 900, skills: 1800 })
    setViewport({ scrollY: 0, innerHeight: 1000, scrollHeight: 1000 })
    const { api } = mountSpy()

    expect(api.activeId.value).toBe('home')
  })

  it('coalesces bursts of scroll and resize events into one frame', () => {
    addSections({ home: 0, about: 900, skills: 1800 })
    mountSpy()
    vi.mocked(window.requestAnimationFrame).mockClear()

    window.dispatchEvent(new Event('scroll'))
    window.dispatchEvent(new Event('scroll'))
    window.dispatchEvent(new Event('resize'))

    expect(window.requestAnimationFrame).toHaveBeenCalledTimes(1)
    flush()
    window.dispatchEvent(new Event('scroll'))
    expect(window.requestAnimationFrame).toHaveBeenCalledTimes(2)
  })

  it('ignores ids that are missing from the document', () => {
    const { api } = mountSpy()
    expect(api.activeId.value).toBe('home')
  })

  it('removes its listeners and cancels a pending frame on unmount', () => {
    addSections({ home: 0, about: 900, skills: 1800 })
    const removeSpy = vi.spyOn(window, 'removeEventListener')
    const { api, wrapper } = mountSpy()

    window.dispatchEvent(new Event('scroll')) // leaves a frame pending
    expect(frames.size).toBe(1)
    wrapper.unmount()

    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function))
    expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function))
    expect(frames.size).toBe(0)

    setTop('about', 0)
    window.dispatchEvent(new Event('scroll'))
    flush()
    expect(api.activeId.value).toBe('home')
  })
})
