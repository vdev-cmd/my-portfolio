<script setup lang="ts">
import AppIcon from '@/components/ui/AppIcon.vue'
import AppSection from '@/components/layout/AppSection.vue'
import { profile } from '@/data/profile'
import { vReveal } from '@/directives/reveal'
</script>

<template>
  <AppSection
    id="about"
    eyebrow="01 / about"
    title="Enterprise mobile engineer, growing into Applied AI"
  >
    <div class="grid gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] lg:gap-16">
      <div class="space-y-5 text-lg text-muted">
        <p v-for="(paragraph, index) in profile.about.paragraphs" :key="index" v-reveal>
          {{ paragraph }}
        </p>
      </div>

      <dl v-reveal="100" class="card h-fit divide-y divide-line">
        <div v-for="fact in profile.about.facts" :key="fact.label" class="px-6 py-4">
          <dt class="font-mono text-xs font-medium text-accent">{{ fact.label }}</dt>
          <dd class="mt-1 font-medium">{{ fact.value }}</dd>
        </div>
      </dl>
    </div>

    <ul class="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <li
        v-for="(pillar, index) in profile.about.pillars"
        :key="pillar.title"
        v-reveal="index * 70"
        class="card p-6"
      >
        <span
          class="grid size-10 place-items-center rounded-lg border border-line bg-raised text-primary"
        >
          <AppIcon :name="pillar.icon" class="size-5" />
        </span>
        <h3 class="mt-4 font-semibold tracking-tight">{{ pillar.title }}</h3>
        <p class="mt-2 text-sm text-muted">{{ pillar.body }}</p>
      </li>
    </ul>
  </AppSection>
</template>
