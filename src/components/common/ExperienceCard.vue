<script setup lang="ts">
import { Check } from '@lucide/vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import TagChip from '@/components/ui/TagChip.vue'
import type { ExperienceItem } from '@/types'

defineProps<{ item: ExperienceItem }>()
</script>

<template>
  <li class="relative pl-8 md:pl-12">
    <!-- Timeline marker -->
    <span
      class="absolute top-8 left-0 grid size-4 -translate-x-1/2 place-items-center rounded-full border-2 border-primary bg-bg md:left-0"
      aria-hidden="true"
    />
    <article class="card p-6 md:p-8" :aria-labelledby="`${item.id}-role`">
      <div class="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
        <div>
          <h3 :id="`${item.id}-role`" class="text-xl font-semibold tracking-tight">
            {{ item.role }}
          </h3>
          <p class="mt-1 font-medium text-muted">
            <a
              v-if="item.companyUrl"
              :href="item.companyUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="underline decoration-line-strong underline-offset-4 hover:text-fg"
            >
              {{ item.company }}<span class="sr-only"> (opens in a new tab)</span>
            </a>
            <template v-else>{{ item.company }}</template>
            <template v-if="item.location"> · {{ item.location }}</template>
          </p>
        </div>
        <div class="flex flex-col items-start gap-2 sm:items-end">
          <p class="font-mono text-sm text-muted">{{ item.period }}</p>
          <StatusBadge v-if="item.placeholder" status="sample" />
        </div>
      </div>

      <p class="mt-5 text-muted">{{ item.summary }}</p>

      <h4 class="mt-6 font-mono text-xs font-medium tracking-wide text-accent uppercase">
        Responsibilities
      </h4>
      <ul class="mt-3 space-y-2.5">
        <li v-for="line in item.responsibilities" :key="line" class="flex gap-3">
          <Check class="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" />
          <span>{{ line }}</span>
        </li>
      </ul>

      <template v-if="item.achievements && item.achievements.length > 0">
        <h4 class="mt-6 font-mono text-xs font-medium tracking-wide text-accent uppercase">
          Key achievements
        </h4>
        <ul class="mt-3 space-y-2.5">
          <li v-for="line in item.achievements" :key="line" class="flex gap-3">
            <Check class="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" />
            <span>{{ line }}</span>
          </li>
        </ul>
      </template>

      <template v-if="item.impact">
        <h4 class="mt-6 font-mono text-xs font-medium tracking-wide text-accent uppercase">
          Business impact
        </h4>
        <p class="mt-3">{{ item.impact }}</p>
      </template>

      <h4 class="sr-only">Technologies</h4>
      <ul class="mt-6 flex flex-wrap gap-2" aria-label="Technologies">
        <li v-for="tech in item.technologies" :key="tech">
          <TagChip>{{ tech }}</TagChip>
        </li>
      </ul>
    </article>
  </li>
</template>
