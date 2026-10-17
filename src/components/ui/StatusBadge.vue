<script setup lang="ts">
import { computed } from 'vue'
import type { ProgressStatus } from '../../types/common'

const props = defineProps<{ status: ProgressStatus }>()

const labels: Record<ProgressStatus, string> = {
  sample: 'Sample content',
  goal: 'Learning goal',
  learning: 'Learning now',
  planned: 'Planned',
  'in-progress': 'In progress',
  completed: 'Completed',
}

const tones: Record<ProgressStatus, string> = {
  sample: 'border-dashed border-line-strong text-muted',
  goal: 'border-dashed border-line-strong text-muted',
  planned: 'border-dashed border-line-strong text-muted',
  learning: 'border-accent/50 bg-accent/10 text-accent',
  'in-progress': 'border-accent/50 bg-accent/10 text-accent',
  completed: 'border-primary/50 bg-primary/10 text-primary-ink',
}

const label = computed(() => labels[props.status])
</script>

<template>
  <span
    class="inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[0.6875rem] leading-none font-medium whitespace-nowrap"
    :class="tones[status]"
  >
    {{ label }}
  </span>
</template>
