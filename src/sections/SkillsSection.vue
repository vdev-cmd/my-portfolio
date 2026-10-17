<script setup lang="ts">
import SkillGroupCard from '@/components/common/SkillGroupCard.vue'
import AppSection from '@/components/layout/AppSection.vue'
import { skillCategories } from '@/data/skills'
import { vReveal } from '@/directives/reveal'

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
</script>

<template>
  <AppSection
    id="skills"
    eyebrow="03 / skills"
    title="Technical skills"
    description="What I use professionally, kept separate from what I am still learning."
  >
    <h3 class="sr-only">Professional skills</h3>
    <ul class="grid gap-5 md:grid-cols-2 lg:grid-cols-6">
      <li
        v-for="(category, index) in professional"
        :key="category.id"
        v-reveal="index * 60"
        :class="spanClasses(index)"
      >
        <SkillGroupCard :category="category" />
      </li>
    </ul>

    <h3 class="sr-only">Currently learning</h3>
    <ul class="mt-5 grid gap-5">
      <li v-for="category in learning" :key="category.id" v-reveal>
        <SkillGroupCard :category="category" />
      </li>
    </ul>
  </AppSection>
</template>
