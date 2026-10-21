<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { gsap, motion, ScrollTrigger } from '@/animations/gsap'
import SkillGroupCard from '@/components/common/SkillGroupCard.vue'
import AppSection from '@/components/layout/AppSection.vue'
import { useGsap } from '@/composables/useGsap'
import { skillCategories } from '@/data/skills'

const professional = skillCategories.filter((category) => !category.learning)
const learning = skillCategories.filter((category) => category.learning)

/**
 * Cards sit on a 6-column grid at `lg` (3 per row). A partly filled last row is stretched so the
 * grid has no hole, whatever the number of categories. Class names are literal so Tailwind sees them.
 */
function spanClasses(index: number): string {
  const total = professional.length
  const leftover = total % 3
  const inLastRow = leftover > 0 && index >= total - leftover
  const lg = !inLastRow ? 'lg:col-span-2' : leftover === 2 ? 'lg:col-span-3' : 'lg:col-span-6'
  const md = total % 2 === 1 && index === total - 1 ? 'md:max-lg:col-span-2' : ''
  return `${lg} ${md}`
}

const grid = useTemplateRef<HTMLElement>('grid')

// Cards enter in batches as rows reach the viewport: rising, scaling and tipping forward in a
// stagger, so a row reads as one wave instead of one card at a time.
useGsap(grid, ({ desktop }, el) => {
  const cards = gsap.utils.toArray<HTMLElement>('[data-skill]', el)
  gsap.set(cards, {
    opacity: 0,
    y: desktop ? 60 : 32,
    scale: desktop ? 0.92 : 1,
    rotateX: desktop ? -18 : 0,
    transformPerspective: 900,
    transformOrigin: '50% 100%',
  })
  ScrollTrigger.batch(cards, {
    start: 'top 88%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotateX: 0,
        duration: motion.duration.slow,
        ease: motion.ease.out,
        stagger: motion.stagger.base,
        overwrite: true,
      }),
  })
})
</script>

<template>
  <AppSection
    id="skills"
    eyebrow="03 / skills"
    title="Technical skills"
    description="What I use professionally, kept separate from what I am still learning."
  >
    <div ref="grid">
      <h3 class="sr-only">Professional skills</h3>
      <ul class="grid gap-5 md:grid-cols-2 lg:grid-cols-6">
        <li
          v-for="(category, index) in professional"
          :key="category.id"
          data-skill
          :class="spanClasses(index)"
        >
          <SkillGroupCard :category="category" :index="index" />
        </li>
      </ul>

      <h3 class="sr-only">Currently learning</h3>
      <ul class="mt-5 grid gap-5">
        <li v-for="(category, index) in learning" :key="category.id" data-skill>
          <SkillGroupCard :category="category" :index="professional.length + index" />
        </li>
      </ul>
    </div>
  </AppSection>
</template>
