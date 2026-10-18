import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { gsap, mediaConditions } from '@/animations/gsap'
import { useGsap } from '@/composables/useGsap'
import { installMatchMedia } from '@/test/matchMedia'

function mountWith(setup: Parameters<typeof useGsap>[1]) {
  const Probe = defineComponent({
    setup() {
      const root = ref<HTMLElement>()
      useGsap(root, setup)
      return () => h('div', { ref: root }, [h('p', { class: 'target' }, 'Hello')])
    },
  })
  return mount(Probe, { attachTo: document.body })
}

describe('useGsap', () => {
  it('does nothing when the visitor prefers reduced motion', () => {
    installMatchMedia({ [mediaConditions.motion]: false })
    const setup = vi.fn()
    const wrapper = mountWith(setup)
    expect(setup).not.toHaveBeenCalled()
    wrapper.unmount()
  })

  it('runs with the current conditions, scoped to the component root', () => {
    installMatchMedia({ [mediaConditions.motion]: true, [mediaConditions.desktop]: true })
    let conditions: Record<string, boolean> | undefined
    let matched = 0
    const wrapper = mountWith((c, root) => {
      conditions = c
      matched = gsap.utils.toArray('.target', root).length
    })
    expect(conditions).toMatchObject({ motion: true, desktop: true, finePointer: false })
    expect(matched).toBe(1)
    wrapper.unmount()
  })

  it('restores start states and runs cleanup when the component unmounts', () => {
    installMatchMedia({ [mediaConditions.motion]: true })
    const cleanup = vi.fn()
    let target: HTMLElement | undefined
    const wrapper = mountWith((_c, root) => {
      target = root.querySelector<HTMLElement>('.target')!
      gsap.from(target, { opacity: 0, duration: 10 })
      return cleanup
    })
    expect(target!.style.opacity).toBe('0')

    wrapper.unmount()

    expect(cleanup).toHaveBeenCalledOnce()
    expect(target!.style.opacity).toBe('')
  })
})
