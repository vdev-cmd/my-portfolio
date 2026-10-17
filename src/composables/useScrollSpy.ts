import { onMounted, onScopeDispose, ref } from 'vue'

interface ScrollSpyOptions {
  /**
   * Fraction of the viewport height (from the top) that acts as the "reading line".
   * The active section is the last one whose top edge has passed this line.
   */
  readingLine?: number
}

/**
 * Tracks which section is currently being read. Scroll work is throttled to one pass per
 * animation frame, and every listener is removed when the calling scope is disposed.
 */
export function useScrollSpy(ids: readonly string[], options: ScrollSpyOptions = {}) {
  const { readingLine = 0.35 } = options
  const activeId = ref<string>(ids[0] ?? '')
  let frame = 0

  function update() {
    frame = 0
    const lastId = ids[ids.length - 1]
    const scrolled = window.scrollY > 0
    const atBottom =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2

    // The last section can be too short to ever cross the reading line, so pin it at the bottom.
    if (scrolled && atBottom && lastId) {
      activeId.value = lastId
      return
    }

    const line = window.innerHeight * readingLine
    let current = ids[0] ?? ''
    for (const id of ids) {
      const element = document.getElementById(id)
      if (!element) continue
      if (element.getBoundingClientRect().top <= line) current = id
      else break
    }
    activeId.value = current
  }

  function schedule() {
    if (frame === 0) frame = window.requestAnimationFrame(update)
  }

  onMounted(() => {
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })
  })

  onScopeDispose(() => {
    window.removeEventListener('scroll', schedule)
    window.removeEventListener('resize', schedule)
    if (frame !== 0) window.cancelAnimationFrame(frame)
  })

  return { activeId }
}
