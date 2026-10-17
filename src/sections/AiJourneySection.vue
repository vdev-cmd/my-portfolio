<script setup lang="ts">
import { Info } from '@lucide/vue'
import RoadmapStepCard from '@/components/common/RoadmapStepCard.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import AppSection from '@/components/layout/AppSection.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import TagChip from '@/components/ui/TagChip.vue'
import { journey } from '@/data/journey'
import { profile } from '@/data/profile'
import { vReveal } from '@/directives/reveal'
</script>

<template>
  <AppSection
    id="ai-journey"
    eyebrow="05 / ai journey"
    title="Moving into Applied AI Engineering"
    description="A transparent learning log: what I am studying, what I plan to build, and where each item stands."
  >
    <div class="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-14">
      <div>
        <h3 class="text-xl font-semibold tracking-tight">Why I am learning AI engineering</h3>
        <div class="mt-4 space-y-4 text-muted">
          <p v-for="(paragraph, index) in journey.why" :key="index">{{ paragraph }}</p>
        </div>
      </div>

      <div v-reveal class="card h-fit p-6">
        <h3 class="text-xl font-semibold tracking-tight">Current learning focus</h3>
        <ul class="mt-4 flex flex-wrap gap-2">
          <li v-for="area in journey.focusAreas" :key="area">
            <TagChip tone="accent">{{ area }}</TagChip>
          </li>
        </ul>
        <p class="mt-5 flex gap-2 text-sm text-muted">
          <Info class="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
          <span>
            Everything on this page is a goal or a plan unless it is marked otherwise. I do not
            claim production AI experience.
          </span>
        </p>
      </div>
    </div>

    <h3 class="mt-16 text-xl font-semibold tracking-tight">Learning roadmap</h3>
    <ol class="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      <RoadmapStepCard
        v-for="(step, index) in journey.roadmap"
        :key="step.id"
        v-reveal="(index % 3) * 70"
        :step="step"
        :index="index"
      />
    </ol>

    <div class="mt-16 grid gap-10 lg:grid-cols-2 lg:gap-14">
      <div>
        <h3 class="text-xl font-semibold tracking-tight">Hands-on experiments</h3>
        <ul class="mt-6 space-y-4">
          <li v-for="item in journey.experiments" :key="item.id" v-reveal class="card p-5">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <h4 class="font-semibold tracking-tight">{{ item.title }}</h4>
              <StatusBadge :status="item.status" />
            </div>
            <p class="mt-2 text-sm text-muted">{{ item.description }}</p>
          </li>
        </ul>
      </div>

      <div>
        <h3 class="text-xl font-semibold tracking-tight">AI project milestones</h3>
        <ol class="mt-6 space-y-4 border-l border-dashed border-line-strong pl-6">
          <li v-for="item in journey.milestones" :key="item.id" v-reveal class="relative">
            <span
              class="absolute top-1.5 -left-[1.9rem] size-3 rounded-full border-2 border-line-strong bg-bg"
              aria-hidden="true"
            />
            <div class="flex flex-wrap items-center justify-between gap-2">
              <h4 class="font-semibold tracking-tight">{{ item.title }}</h4>
              <StatusBadge :status="item.status" />
            </div>
            <p class="mt-1 text-sm text-muted">{{ item.description }}</p>
          </li>
        </ol>
      </div>
    </div>

    <div class="mt-16">
      <h3 class="text-xl font-semibold tracking-tight">Relevant GitHub repositories</h3>
      <ul v-if="journey.repositories.length > 0" class="mt-6 grid gap-4 md:grid-cols-2">
        <li v-for="repo in journey.repositories" :key="repo.url" v-reveal class="card p-5">
          <a
            :href="repo.url"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-2 font-semibold hover:text-primary-ink"
          >
            <AppIcon name="github" class="size-5" />
            {{ repo.name }}
            <span class="sr-only">(opens in a new tab)</span>
          </a>
          <p class="mt-2 text-sm text-muted">{{ repo.description }}</p>
        </li>
      </ul>
      <div v-else v-reveal class="card mt-6 flex flex-col items-start gap-4 border-dashed! p-6">
        <p class="text-muted">
          No AI repositories are published yet. They will be listed here as soon as the first
          experiments are public.
        </p>
        <BaseButton
          v-if="profile.github"
          :href="profile.github"
          external
          variant="secondary"
          size="sm"
        >
          <AppIcon name="github" />
          Follow on GitHub
        </BaseButton>
      </div>
    </div>
  </AppSection>
</template>
