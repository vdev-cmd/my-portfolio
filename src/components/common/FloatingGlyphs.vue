<script setup lang="ts">
import { Braces, GitBranch, Smartphone, Sparkles, SquareTerminal } from '@lucide/vue'
import { useTemplateRef, type Component } from 'vue'
import { gsap, motion } from '@/animations/gsap'
import { useGsap } from '@/composables/useGsap'

interface Glyph {
  /** Mono text, or an icon. */
  text?: string
  icon?: Component
  /** Position inside the hero, in %. */
  x: number
  y: number
  /** 1 = far (small, slow), 3 = near (large, fast). */
  depth: 1 | 2 | 3
}

/* Software-flavoured decorations, kept to the edges so they never sit behind the copy. */
const glyphs: Glyph[] = [
  { text: '{ }', x: 52, y: 8, depth: 1 },
  { icon: Smartphone, x: 94, y: 12, depth: 3 },
  { text: '</>', x: 56, y: 90, depth: 2 },
  { icon: GitBranch, x: 3, y: 86, depth: 2 },
  { text: '=>', x: 97, y: 56, depth: 1 },
  { icon: Braces, x: 2, y: 30, depth: 1 },
  { icon: SquareTerminal, x: 90, y: 93, depth: 2 },
  { icon: Sparkles, x: 66, y: 9, depth: 3 },
  { text: 'async', x: 30, y: 95, depth: 1 },
]

const layers = ([1, 2, 3] as const).map((depth) => ({
  depth,
  glyphs: glyphs.filter((glyph) => glyph.depth === depth),
}))

const root = useTemplateRef<HTMLElement>('root')
// The entrance plays once; a breakpoint change re-runs the setup without replaying it.
let entered = false

useGsap(root, ({ desktop, finePointer }, el) => {
  // The layer is hidden below the desktop breakpoint, so nothing to animate there.
  if (!desktop) return
  const items = gsap.utils.toArray<HTMLElement>('[data-glyph]', el)
  const random = gsap.utils.random

  // Arrive after the headline, then drift forever on independent, gentle loops.
  if (!entered) {
    entered = true
    gsap.from(items, {
      opacity: 0,
      scale: 0.4,
      y: 30,
      duration: motion.duration.slow,
      ease: motion.ease.out,
      stagger: { each: 0.06, from: 'random' },
      delay: 0.8,
    })
  }
  for (const item of items) {
    gsap.to(item.firstElementChild, {
      y: random(-16, 16),
      x: random(-8, 8),
      rotation: random(-10, 10),
      duration: random(3.5, 6.5),
      ease: motion.ease.float,
      repeat: -1,
      yoyo: true,
      delay: random(0, 2),
    })
  }

  const hero = el.parentElement ?? el
  const layerEls = gsap.utils.toArray<HTMLElement>('[data-depth]', el)

  // Nearer layers move further as the hero scrolls away, which reads as depth.
  for (const layer of layerEls) {
    const depth = Number(layer.dataset.depth)
    gsap.to(layer, {
      yPercent: -18 * depth,
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6 },
    })
  }

  if (!finePointer) return

  // Pointer parallax: quickTo reuses one tween per axis instead of creating one per event.
  const movers = layerEls.map((layer) => {
    const depth = Number(layer.dataset.depth)
    return {
      depth,
      x: gsap.quickTo(layer, 'x', { duration: 1.2, ease: motion.ease.soft }),
      y: gsap.quickTo(layer, 'y', { duration: 1.2, ease: motion.ease.soft }),
    }
  })

  function onMove(event: PointerEvent) {
    if (event.pointerType !== 'mouse') return
    const nx = event.clientX / window.innerWidth - 0.5
    const ny = event.clientY / window.innerHeight - 0.5
    for (const mover of movers) {
      mover.x(nx * -14 * mover.depth)
      mover.y(ny * -10 * mover.depth)
    }
  }

  hero.addEventListener('pointermove', onMove)
  return () => hero.removeEventListener('pointermove', onMove)
})
</script>

<template>
  <!-- Wide screens only: on phones the copy fills the width and glyphs would crowd it. -->
  <div
    ref="root"
    class="pointer-events-none absolute inset-0 -z-1 max-lg:hidden"
    aria-hidden="true"
  >
    <div
      v-for="layer in layers"
      :key="layer.depth"
      class="absolute inset-0"
      :data-depth="layer.depth"
    >
      <div
        v-for="(glyph, index) in layer.glyphs"
        :key="index"
        data-glyph
        class="glyph absolute"
        :style="{ left: `${glyph.x}%`, top: `${glyph.y}%`, '--depth': layer.depth }"
      >
        <span class="glyph-chip">
          <component :is="glyph.icon" v-if="glyph.icon" class="glyph-icon" />
          <template v-else>{{ glyph.text }}</template>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.glyph {
  translate: -50% -50%;
}

/* Far glyphs are smaller and fainter; near ones larger and crisper. */
.glyph-chip {
  display: grid;
  place-items: center;
  min-width: calc(1.75rem + var(--depth) * 0.6rem);
  height: calc(1.75rem + var(--depth) * 0.6rem);
  padding-inline: 0.5rem;
  border: 1px solid var(--line);
  border-radius: 0.75rem;
  background: color-mix(in oklab, var(--surface) 70%, transparent);
  box-shadow: 0 12px 30px -18px rgb(var(--shadow-color) / 0.5);
  color: var(--primary);
  font-family: var(--font-mono);
  font-size: calc(0.65rem + var(--depth) * 0.12rem);
  font-weight: 600;
  opacity: calc(0.35 + var(--depth) * 0.18);
}

.glyph-icon {
  width: calc(0.8rem + var(--depth) * 0.2rem);
  height: calc(0.8rem + var(--depth) * 0.2rem);
}
</style>
