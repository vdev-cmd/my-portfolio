<script setup lang="ts">
import { Check, Copy, TriangleAlert } from '@lucide/vue'
import { computed } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useClipboard } from '@/composables/useClipboard'

const props = defineProps<{ email: string }>()

const { status, copy } = useClipboard()

const label = computed(() => {
  if (status.value === 'copied') return 'Copied'
  if (status.value === 'error') return 'Copy failed'
  return 'Copy email'
})

const message = computed(() => {
  if (status.value === 'copied') return 'Email address copied to clipboard.'
  if (status.value === 'error') {
    return 'Could not copy automatically. Please select the address and copy it manually.'
  }
  return ''
})
</script>

<template>
  <span class="inline-flex flex-col items-start gap-2">
    <BaseButton variant="secondary" size="sm" @click="copy(props.email)">
      <Check v-if="status === 'copied'" aria-hidden="true" />
      <TriangleAlert v-else-if="status === 'error'" aria-hidden="true" />
      <Copy v-else aria-hidden="true" />
      {{ label }}
    </BaseButton>
    <!-- Always mounted so screen readers announce changes; only visible for the error case. -->
    <span
      role="status"
      aria-live="polite"
      :class="status === 'error' ? 'text-sm text-muted' : 'sr-only'"
    >
      {{ message }}
    </span>
  </span>
</template>
