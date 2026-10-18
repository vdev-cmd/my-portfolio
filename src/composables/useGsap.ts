import { onMounted, onScopeDispose, type Ref } from 'vue'
import { gsap, mediaConditions, ScrollTrigger, type MediaConditions } from '@/animations/gsap'

type GsapSetup = (conditions: MediaConditions, root: HTMLElement) => void | (() => void)

function canAnimate(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
}

/**
 * Runs GSAP code for one component. `setup` is called inside `gsap.matchMedia()`, scoped to
 * `root`, so selector strings only match inside the component, and only when the visitor allows
 * motion. Everything it creates (tweens, timelines, ScrollTriggers, SplitTexts) is reverted when a
 * media condition changes, after which setup runs again with the new conditions, and when the
 * component unmounts. A returned function runs on revert, for listeners added by hand.
 *
 * Content is visible by default: start states are only applied when setup runs, which happens in
 * `onMounted`, before the first paint, so there is no flash and no layout shift.
 */
export function useGsap(root: Ref<HTMLElement | null | undefined>, setup: GsapSetup) {
  let mm: gsap.MatchMedia | undefined

  onMounted(() => {
    const el = root.value
    if (!el || !canAnimate()) return
    mm = gsap.matchMedia(el)
    mm.add(mediaConditions, (context) => {
      const conditions = context.conditions as MediaConditions
      if (!conditions.motion) return
      return setup(conditions, el)
    })
  })

  onScopeDispose(() => {
    mm?.revert()
    mm = undefined
  })
}

/**
 * Keeps ScrollTrigger positions correct when the page height changes without a window resize
 * (filtering projects, "Show more", opening details, images or fonts arriving). Call once, in App.
 */
export function useScrollTriggerRefresh(target: Ref<HTMLElement | null | undefined>) {
  let observer: ResizeObserver | undefined
  let timer: ReturnType<typeof setTimeout> | undefined
  let lastHeight = 0

  onMounted(() => {
    const el = target.value
    if (!el || typeof ResizeObserver === 'undefined') return
    observer = new ResizeObserver(([entry]) => {
      const height = Math.round(entry?.contentRect.height ?? 0)
      if (height === lastHeight) return
      lastHeight = height
      clearTimeout(timer)
      timer = setTimeout(() => ScrollTrigger.refresh(), 150)
    })
    observer.observe(el)
  })

  onScopeDispose(() => {
    observer?.disconnect()
    clearTimeout(timer)
  })
}
