<script setup lang="ts">
import { useTemplateRef } from 'vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import TagChip from '@/components/ui/TagChip.vue'
import { useTilt } from '@/composables/useTilt'
import type { SkillCategory } from '@/types'

/** `index` offsets the floating icon's rhythm so neighbouring cards never bob in sync. */
withDefaults(defineProps<{ category: SkillCategory; index?: number }>(), { index: 0 })

const card = useTemplateRef<HTMLElement>('card')
useTilt(card, { max: 6 })
</script>

<template>
  <article
    ref="card"
    class="card tilt-surface glow-border group h-full p-6"
    :class="category.learning ? 'border-dashed! border-line-strong!' : ''"
    :aria-labelledby="`skills-${category.id}-title`"
  >
    <div class="flex items-center gap-3">
      <span
        class="skill-icon grid size-10 shrink-0 place-items-center rounded-lg border border-line bg-raised"
        :class="category.learning ? 'text-accent' : 'text-primary'"
        :style="{ '--float-delay': `${index * -0.7}s` }"
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

<style scoped>
/* Technology icons bob gently; on hover they pop forward. */
.skill-icon {
  animation: icon-float 4.5s ease-in-out infinite;
  animation-delay: var(--float-delay, 0s);
  transition:
    scale 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
    border-color 0.3s ease;
}

.group:hover .skill-icon {
  scale: 1.12;
  border-color: color-mix(in oklab, var(--primary) 50%, transparent);
}

@keyframes icon-float {
  0%,
  100% {
    translate: 0 0;
  }
  50% {
    translate: 0 -4px;
  }
}
</style>
