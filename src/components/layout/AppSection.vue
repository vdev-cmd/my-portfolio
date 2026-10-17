<script setup lang="ts">
import { computed } from 'vue'
import { vReveal } from '@/directives/reveal'

const props = defineProps<{
  id: string
  /** Small mono label above the title, e.g. "02 / experience". */
  eyebrow: string
  title: string
  description?: string
}>()

const titleId = computed(() => `${props.id}-title`)
</script>

<template>
  <section
    :id="id"
    :aria-labelledby="titleId"
    tabindex="-1"
    class="border-t border-line py-20 md:py-28"
  >
    <div class="page-container">
      <header v-reveal class="mb-12 max-w-2xl md:mb-14">
        <p class="eyebrow">{{ eyebrow }}</p>
        <h2
          :id="titleId"
          class="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
        >
          {{ title }}
        </h2>
        <p v-if="description" class="mt-4 text-lg text-muted">{{ description }}</p>
      </header>
      <slot />
    </div>
  </section>
</template>
