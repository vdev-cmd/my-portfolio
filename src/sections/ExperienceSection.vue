<script setup lang="ts">
import ExperienceCard from '@/components/common/ExperienceCard.vue'
import AppSection from '@/components/layout/AppSection.vue'
import { experience } from '@/data/experience'
import { vReveal } from '@/directives/reveal'
</script>

<template>
  <AppSection
    id="experience"
    eyebrow="02 / experience"
    title="Professional experience"
    description="Enterprise Flutter development, from business workflows to the APIs behind them."
  >
    <!-- The gradient rail sits on the list's left edge (newest = strongest); each marker is centred on it. -->
    <ol
      class="relative ml-2 space-y-8 md:ml-3 md:space-y-10 before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:-translate-x-1/2 before:rounded-full before:bg-linear-to-b before:from-primary before:via-line-strong before:to-transparent before:content-['']"
    >
      <ExperienceCard v-for="item in experience" :key="item.id" v-reveal :item="item" />
    </ol>
  </AppSection>
</template>
