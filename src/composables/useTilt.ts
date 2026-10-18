import { onScopeDispose, watch, type Ref } from 'vue'
import { useMediaQuery } from './useMediaQuery'

interface TiltOptions {
  /** Maximum rotation in degrees on each axis. */
  max?: number
  /** Fraction of the remaining distance covered per frame; lower is smoother and slower. */
  smoothing?: number
}

/**
 * Pointer-driven 3D tilt. Writes `--rx`, `--ry` (degrees), `--gx`, `--gy` (glare position, %)
 * and `--glare` (0–1) on the element; the CSS decides what to do with them.
 *
 * Values ease toward the pointer every animation frame, so motion stays smooth even with sparse
 * pointer events. Disabled for reduced motion and touch-only devices, where the card stays flat.
 */
export function useTilt(target: Ref<HTMLElement | null | undefined>, options: TiltOptions = {}) {
  const max = options.max ?? 10
  const smoothing = options.smoothing ?? 0.1
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)')

  const current = { rx: 0, ry: 0, gx: 50, gy: 50, glare: 0 }
  const goal = { ...current }
  let frame = 0

  function write(el: HTMLElement) {
    el.style.setProperty('--rx', `${current.rx.toFixed(3)}deg`)
    el.style.setProperty('--ry', `${current.ry.toFixed(3)}deg`)
    el.style.setProperty('--gx', `${current.gx.toFixed(2)}%`)
    el.style.setProperty('--gy', `${current.gy.toFixed(2)}%`)
    el.style.setProperty('--glare', current.glare.toFixed(3))
  }

  function step() {
    frame = 0
    const el = target.value
    if (!el) return

    let moving = false
    for (const key of Object.keys(goal) as (keyof typeof goal)[]) {
      const delta = goal[key] - current[key]
      if (Math.abs(delta) > 0.01) {
        current[key] += delta * smoothing
        moving = true
      } else {
        current[key] = goal[key]
      }
    }
    write(el)
    if (moving) frame = requestAnimationFrame(step)
  }

  function kick() {
    frame ||= requestAnimationFrame(step)
  }

  function onMove(event: PointerEvent) {
    const el = target.value
    if (!el || event.pointerType !== 'mouse') return
    const rect = el.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width // 0 → 1
    const y = (event.clientY - rect.top) / rect.height
    goal.ry = (x - 0.5) * 2 * max
    goal.rx = (0.5 - y) * 2 * max
    goal.gx = x * 100
    goal.gy = y * 100
    goal.glare = 1
    kick()
  }

  function onLeave() {
    Object.assign(goal, { rx: 0, ry: 0, gx: 50, gy: 50, glare: 0 })
    kick()
  }

  function detach(el: HTMLElement) {
    el.removeEventListener('pointermove', onMove)
    el.removeEventListener('pointerleave', onLeave)
    cancelAnimationFrame(frame)
    frame = 0
    Object.assign(current, { rx: 0, ry: 0, gx: 50, gy: 50, glare: 0 })
    Object.assign(goal, current)
    write(el)
  }

  watch(
    [target, () => reducedMotion.value || !finePointer.value],
    ([el, disabled], _old, onCleanup) => {
      if (!el || disabled) return
      el.addEventListener('pointermove', onMove)
      el.addEventListener('pointerleave', onLeave)
      onCleanup(() => detach(el))
    },
    { immediate: true },
  )

  onScopeDispose(() => cancelAnimationFrame(frame))
}
