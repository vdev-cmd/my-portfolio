<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { gsap, motion } from '@/animations/gsap'
import ExperienceCard from '@/components/common/ExperienceCard.vue'
import AppSection from '@/components/layout/AppSection.vue'
import { useGsap } from '@/composables/useGsap'
import { experience } from '@/data/experience'

const timeline = useTemplateRef<HTMLElement>('timeline')

useGsap(timeline, ({ desktop }, el) => {
  const q = gsap.utils.selector(el)

  // The rail fills in step with scrolling, so the reader's position in the career is always visible.
  gsap.fromTo(
    q('[data-xp-progress]'),
    { scaleY: 0 },
    {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 70%', end: 'bottom 70%', scrub: 0.4 },
    },
  )

  for (const item of q('[data-xp-item]')) {
    const [marker] = gsap.utils.toArray<HTMLElement>('[data-xp-marker]', item)
    const [card] = gsap.utils.toArray<HTMLElement>('article', item)

    gsap
      .timeline({
        defaults: { ease: motion.ease.out },
        // Starts when the filling rail reaches this milestone.
        scrollTrigger: { trigger: item, start: 'top 70%', once: true },
      })
      .from(marker!, { scale: 0, duration: 0.6, ease: 'back.out(3)' })
      .from(
        card!,
        desktop
          ? { x: 90, rotateY: -12, opacity: 0, transformPerspective: 1400, duration: 1.2 }
          : { x: 32, opacity: 0, duration: motion.duration.base },
        0.05,
      )
      // The card lifts on hover with a CSS transform; hand transform back once it has landed.
      .set(card!, { clearProps: 'transform' })
  }
})
</script>

<template>
  <AppSection
    id="experience"
    eyebrow="02 / experience"
    title="Professional experience"
    description="Enterprise Flutter development, from business workflows to the APIs behind them."
  >
    <div ref="timeline" class="relative ml-2 md:ml-3">
      <!-- The gradient rail sits on the list's left edge (newest = strongest); each marker is centred on it. -->
      <ol
        class="relative space-y-8 md:space-y-10 before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:-translate-x-1/2 before:rounded-full before:bg-linear-to-b before:from-primary before:via-line-strong before:to-transparent before:content-['']"
      >
        <ExperienceCard v-for="item in experience" :key="item.id" data-xp-item :item="item" />
      </ol>
      <!-- Scroll progress along the rail; hidden unless motion is allowed. -->
      <span
        data-xp-progress
        class="xp-progress pointer-events-none absolute inset-y-0 left-0 w-0.5 -translate-x-1/2 rounded-full"
        aria-hidden="true"
      />
    </div>
  </AppSection>
</template>

<style scoped>
.xp-progress {
  transform: scaleY(0);
  transform-origin: top;
  background: linear-gradient(to bottom, var(--primary), var(--accent-glow));
  box-shadow: 0 0 12px color-mix(in oklab, var(--accent-glow) 60%, transparent);
}
</style>
