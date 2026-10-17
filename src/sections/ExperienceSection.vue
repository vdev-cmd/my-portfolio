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
    <!-- The vertical rule sits on the list's left edge; each marker is centred on it. -->
    <ol class="relative ml-2 border-l border-line-strong md:ml-3">
      <ExperienceCard v-for="item in experience" :key="item.id" v-reveal :item="item" />
    </ol>
  </AppSection>
</template>
