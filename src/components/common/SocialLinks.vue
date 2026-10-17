<script setup lang="ts">
import AppIcon from '@/components/ui/AppIcon.vue'
import type { ContactChannel } from '@/types'
import { isExternalHref } from '@/utils/links'

defineProps<{
  channels: ContactChannel[]
  /** Accessible name of the list, e.g. "Social links". */
  label?: string
}>()
</script>

<template>
  <ul
    v-if="channels.length > 0"
    class="flex items-center gap-1"
    :aria-label="label ?? 'Social links'"
  >
    <li v-for="channel in channels" :key="channel.id">
      <a
        :href="channel.href"
        :target="isExternalHref(channel.href) ? '_blank' : undefined"
        :rel="isExternalHref(channel.href) ? 'noopener noreferrer' : undefined"
        :aria-label="
          isExternalHref(channel.href) ? `${channel.label} (opens in a new tab)` : channel.label
        "
        :title="channel.label"
        class="inline-flex size-11 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-fg"
      >
        <AppIcon :name="channel.icon" class="size-5" />
      </a>
    </li>
  </ul>
</template>
