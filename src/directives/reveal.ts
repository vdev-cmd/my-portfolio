import type { Directive } from 'vue'

let observer: IntersectionObserver | undefined

function getObserver(): IntersectionObserver {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        ;(entry.target as HTMLElement).dataset.revealed = ''
        observer?.unobserve(entry.target)
      }
    },
    { rootMargin: '0px 0px -6% 0px', threshold: 0.05 },
  )
  return observer
}

/**
 * Fades an element in once it scrolls into view. Usage: `v-reveal` or `v-reveal="120"` (delay in ms).
 * Styles live in `base.css`; with reduced motion, or without IntersectionObserver, content is
 * simply visible from the start.
 */
export const vReveal: Directive<HTMLElement, number | undefined> = {
  mounted(el, binding) {
    if (typeof IntersectionObserver === 'undefined') return
    el.dataset.reveal = ''
    if (binding.value) el.style.setProperty('--reveal-delay', `${binding.value}ms`)
    getObserver().observe(el)
  },
  unmounted(el) {
    observer?.unobserve(el)
  },
}
