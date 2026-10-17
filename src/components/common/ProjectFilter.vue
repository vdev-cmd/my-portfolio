<script setup lang="ts">
export interface FilterOption {
  id: string
  label: string
  count: number
}

const selected = defineModel<string>({ required: true })

defineProps<{ options: FilterOption[]; label?: string }>()
</script>

<template>
  <div
    role="group"
    :aria-label="label ?? 'Filter projects by category'"
    class="flex flex-wrap gap-2"
  >
    <button
      v-for="option in options"
      :key="option.id"
      type="button"
      class="inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors"
      :class="
        selected === option.id
          ? 'border-primary-solid bg-primary-solid text-on-primary'
          : 'border-control bg-raised text-muted hover:border-primary hover:text-fg'
      "
      :aria-pressed="selected === option.id"
      @click="selected = option.id"
    >
      {{ option.label }}
      <span class="font-mono text-xs opacity-80" aria-hidden="true">{{ option.count }}</span>
      <span class="sr-only">({{ option.count }})</span>
    </button>
  </div>
</template>
