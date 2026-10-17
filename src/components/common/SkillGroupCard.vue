<script setup lang="ts">
import AppIcon from '@/components/ui/AppIcon.vue'
import TagChip from '@/components/ui/TagChip.vue'
import type { SkillCategory } from '@/types'

defineProps<{ category: SkillCategory }>()
</script>

<template>
  <article
    class="card h-full p-6"
    :class="category.learning ? 'border-dashed! border-line-strong!' : ''"
    :aria-labelledby="`skills-${category.id}-title`"
  >
    <div class="flex items-center gap-3">
      <span
        class="grid size-10 shrink-0 place-items-center rounded-lg border border-line bg-raised"
        :class="category.learning ? 'text-accent' : 'text-primary'"
      >
        <AppIcon :name="category.icon" class="size-5" />
      </span>
      <h3 :id="`skills-${category.id}-title`" class="font-semibold tracking-tight">
        {{ category.title }}
      </h3>
    </div>

    <p v-if="category.learning" class="mt-4 text-sm text-muted">
      Learning in progress. These are not part of my professional experience yet.
    </p>

    <ul class="mt-5 flex flex-wrap gap-2" :aria-label="`${category.title} skills`">
      <li v-for="skill in category.skills" :key="skill">
        <TagChip :tone="category.learning ? 'accent' : 'default'">{{ skill }}</TagChip>
      </li>
    </ul>
  </article>
</template>
