<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { gsap, ScrollTrigger } from '@/animations/gsap'
import { useGsap } from '@/composables/useGsap'
import { sectionIds } from '@/data/navigation'

interface Scene {
  /** Orb centres in viewport units. */
  a: [x: number, y: number]
  b: [x: number, y: number]
  /** Orb strengths: a = primary blue, b = cyan glow. */
  strength: [a: number, b: number]
}

/*
 * One lighting "scene" per section. As a section takes over the screen the two light orbs glide to
 * new positions and strengths, so the page tone shifts between chapters, like the cuts in the reel.
 * The hero has its own lighting, so the backdrop stays dark there.
 */
const scenes: Record<string, Scene> = {
  home: { a: [80, 0], b: [10, 20], strength: [0, 0] },
  about: { a: [90, 30], b: [5, 85], strength: [0.7, 0.5] },
  experience: { a: [10, 20], b: [85, 80], strength: [0.8, 0.35] },
  skills: { a: [85, 75], b: [15, 15], strength: [0.45, 0.85] },
  projects: { a: [50, 10], b: [90, 90], strength: [1, 0.55] },
  'ai-journey': { a: [15, 80], b: [80, 15], strength: [0.5, 1] },
  contact: { a: [50, 95], b: [15, 30], strength: [0.85, 0.6] },
}

const root = useTemplateRef<HTMLElement>('root')

useGsap(root, (_conditions, el) => {
  const [orbA, orbB] = gsap.utils.toArray<HTMLElement>('[data-orb]', el)

  function show(id: string) {
    const scene = scenes[id]
    if (!scene) return
    const vars = { duration: 1.6, ease: 'power2.inOut', overwrite: 'auto' as const }
    gsap.to(orbA!, {
      x: `${scene.a[0]}vw`,
      y: `${scene.a[1]}vh`,
      opacity: scene.strength[0],
      ...vars,
    })
    gsap.to(orbB!, {
      x: `${scene.b[0]}vw`,
      y: `${scene.b[1]}vh`,
      opacity: scene.strength[1],
      ...vars,
    })
  }

  gsap.set(orbA!, { xPercent: -50, yPercent: -50, x: '80vw', y: '0vh', opacity: 0 })
  gsap.set(orbB!, { xPercent: -50, yPercent: -50, x: '10vw', y: '20vh', opacity: 0 })

  for (const id of sectionIds) {
    const section = document.getElementById(id)
    if (!section) continue
    ScrollTrigger.create({
      trigger: section,
      start: 'top 55%',
      end: 'bottom 55%',
      onToggle: (self) => self.isActive && show(id),
    })
  }
})
</script>

<template>
  <!-- Decorative light behind the page; invisible unless motion is allowed. -->
  <div
    ref="root"
    class="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    aria-hidden="true"
  >
    <span data-orb class="orb orb--a" />
    <span data-orb class="orb orb--b" />
  </div>
</template>

<style scoped>
.orb {
  position: absolute;
  top: 0;
  left: 0;
  width: 70vmax;
  height: 70vmax;
  border-radius: 9999px;
  opacity: 0;
}

.orb--a {
  background: radial-gradient(
    closest-side,
    color-mix(in oklab, var(--primary) 14%, transparent),
    transparent
  );
}

.orb--b {
  background: radial-gradient(
    closest-side,
    color-mix(in oklab, var(--accent-glow) 11%, transparent),
    transparent
  );
}
</style>
