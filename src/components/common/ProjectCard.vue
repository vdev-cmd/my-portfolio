<script setup lang="ts">
import { ChevronDown, ExternalLink } from '@lucide/vue'
import { computed, ref } from 'vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import TagChip from '@/components/ui/TagChip.vue'
import type { Project, ProjectCategory } from '@/types'
import { assetUrl } from '@/utils/assets'

const props = defineProps<{ project: Project; category: ProjectCategory }>()

const imageFailed = ref(false)
const image = computed(() => (imageFailed.value ? undefined : props.project.screenshot))
const titleId = computed(() => `project-${props.project.id}-title`)
</script>

<template>
  <article
    class="card card-interactive flex h-full flex-col overflow-hidden"
    :aria-labelledby="titleId"
  >
    <div class="relative aspect-video overflow-hidden border-b border-line bg-raised">
      <img
        v-if="image"
        :src="assetUrl(image.src)"
        :alt="image.alt"
        :width="image.width"
        :height="image.height"
        loading="lazy"
        decoding="async"
        class="size-full object-cover"
        @error="imageFailed = true"
      />
      <div
        v-else
        class="flex size-full flex-col items-center justify-center gap-2 text-muted"
        :class="'project-art'"
      >
        <AppIcon :name="category.icon" class="size-10 text-primary opacity-80" />
        <span v-if="imageFailed" class="text-xs">Screenshot unavailable</span>
      </div>
    </div>

    <div class="flex flex-1 flex-col gap-4 p-6">
      <div class="flex flex-wrap items-center gap-2">
        <TagChip tone="accent">{{ category.label }}</TagChip>
        <StatusBadge :status="project.status" />
      </div>

      <h3 :id="titleId" class="text-xl font-semibold tracking-tight">{{ project.title }}</h3>
      <p class="text-muted">{{ project.description }}</p>

      <ul class="flex flex-wrap gap-2" aria-label="Technologies">
        <li v-for="tech in project.technologies" :key="tech">
          <TagChip>{{ tech }}</TagChip>
        </li>
      </ul>

      <details class="group mt-auto border-t border-line pt-4">
        <summary
          class="flex cursor-pointer list-none items-center justify-between gap-3 rounded-md text-sm font-semibold marker:hidden hover:text-primary-ink [&::-webkit-details-marker]:hidden"
        >
          Features, challenges &amp; architecture
          <ChevronDown
            class="size-4 shrink-0 transition-transform group-open:rotate-180"
            aria-hidden="true"
          />
        </summary>
        <div class="mt-4 space-y-5 text-sm">
          <section>
            <h4 class="font-mono text-xs font-medium tracking-wide text-accent uppercase">
              Key features
            </h4>
            <ul class="mt-2 list-disc space-y-1.5 pl-5 marker:text-primary">
              <li v-for="feature in project.features" :key="feature">{{ feature }}</li>
            </ul>
          </section>
          <section>
            <h4 class="font-mono text-xs font-medium tracking-wide text-accent uppercase">
              Technical challenges
            </h4>
            <ul class="mt-2 list-disc space-y-1.5 pl-5 marker:text-primary">
              <li v-for="challenge in project.challenges" :key="challenge">{{ challenge }}</li>
            </ul>
          </section>
          <section>
            <h4 class="font-mono text-xs font-medium tracking-wide text-accent uppercase">
              Architecture
            </h4>
            <p class="mt-2 text-muted">{{ project.architecture }}</p>
          </section>
        </div>
      </details>

      <div v-if="project.repoUrl || project.demoUrl" class="flex flex-wrap gap-2">
        <BaseButton
          v-if="project.repoUrl"
          :href="project.repoUrl"
          external
          variant="secondary"
          size="sm"
        >
          <AppIcon name="github" />
          Source code
        </BaseButton>
        <BaseButton
          v-if="project.demoUrl"
          :href="project.demoUrl"
          external
          variant="secondary"
          size="sm"
        >
          <ExternalLink aria-hidden="true" />
          Live demo
        </BaseButton>
      </div>
    </div>
  </article>
</template>

<style scoped>
.project-art {
  background-image:
    radial-gradient(
      18rem 10rem at 80% 0%,
      color-mix(in oklab, var(--primary) 16%, transparent),
      transparent 70%
    ),
    linear-gradient(var(--line) 1px, transparent 1px),
    linear-gradient(90deg, var(--line) 1px, transparent 1px);
  background-size:
    auto,
    28px 28px,
    28px 28px;
}
</style>
