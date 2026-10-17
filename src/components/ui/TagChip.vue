<script setup lang="ts">
withDefaults(defineProps<{ tone?: 'default' | 'accent' }>(), { tone: 'default' })
</script>

<template>
  <span
    class="inline-flex items-center rounded-md border px-2.5 py-1 font-mono text-xs leading-none"
    :class="
      tone === 'accent'
        ? 'border-primary/40 bg-primary/10 text-primary-ink'
        : 'border-line bg-raised text-muted'
    "
  >
    <slot />
  </span>
</template>
