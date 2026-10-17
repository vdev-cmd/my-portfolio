<script setup lang="ts">
import StatusBadge from '@/components/ui/StatusBadge.vue'
import TagChip from '@/components/ui/TagChip.vue'
import type { RoadmapStep } from '@/types'

defineProps<{ step: RoadmapStep; index: number }>()
</script>

<template>
  <li class="card flex h-full flex-col gap-4 p-6">
    <div class="flex items-center justify-between gap-3">
      <span class="font-mono text-sm font-medium text-accent" aria-hidden="true">
        {{ String(index + 1).padStart(2, '0') }}
      </span>
      <StatusBadge :status="step.status" />
    </div>
    <h4 class="text-lg font-semibold tracking-tight">
      <span class="sr-only">Step {{ index + 1 }}: </span>{{ step.title }}
    </h4>
    <p class="text-muted">{{ step.description }}</p>
    <ul class="mt-auto flex flex-wrap gap-2" :aria-label="`${step.title} topics`">
      <li v-for="topic in step.topics" :key="topic">
        <TagChip>{{ topic }}</TagChip>
      </li>
    </ul>
  </li>
</template>
