<script setup lang="ts">
import { ChevronDown, ExternalLink } from '@lucide/vue'
import { computed, ref, useTemplateRef } from 'vue'
import { gsap, motion, ScrollTrigger } from '@/animations/gsap'
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import TagChip from '@/components/ui/TagChip.vue'
import { useGsap } from '@/composables/useGsap'
import { useTilt } from '@/composables/useTilt'
import type { Project, ProjectCategory } from '@/types'
import { assetUrl } from '@/utils/assets'

const props = defineProps<{ project: Project; category: ProjectCategory }>()

const imageFailed = ref(false)
const image = computed(() => (imageFailed.value ? undefined : props.project.screenshot))
const titleId = computed(() => `project-${props.project.id}-title`)

const scene = useTemplateRef<HTMLElement>('scene')
const card = useTemplateRef<HTMLElement>('card')
useTilt(card, { max: 5 })

/*
 * Showcase motion, after the product shots in the reel: each card tips up from a lowered 3D angle
 * and scales into place in step with scrolling, its artwork moves inside the frame at a different
 * speed than the card, and the card nearest the middle of the screen gets the spotlight.
 * Each card owns its animation, so filtering simply mounts and unmounts it.
 */
useGsap(scene, ({ desktop }, el) => {
  const q = gsap.utils.selector(el)

  if (!desktop) {
    gsap.from(el, {
      y: 40,
      opacity: 0,
      duration: motion.duration.base,
      ease: motion.ease.soft,
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    })
    return
  }

  gsap.fromTo(
    el,
    { y: 90, scale: 0.9, rotateX: 16, opacity: 0.25, transformPerspective: 1400 },
    {
      y: 0,
      scale: 1,
      rotateX: 0,
      opacity: 1,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 55%', scrub: 0.6 },
    },
  )

  // Layered depth inside the frame: background art and foreground mark move in opposite directions.
  const media = { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.8 }
  gsap.fromTo(
    q('[data-art-back]'),
    { yPercent: -8 },
    { yPercent: 8, ease: 'none', scrollTrigger: media },
  )
  gsap.fromTo(
    q('[data-art-front]'),
    { yPercent: 22, scale: 0.92 },
    { yPercent: -22, scale: 1.04, ease: 'none', scrollTrigger: media },
  )

  ScrollTrigger.create({
    trigger: el,
    start: 'top 60%',
    end: 'bottom 40%',
    toggleClass: { targets: card.value!, className: 'is-active' },
  })
})
</script>

<template>
  <!-- The scene owns the scroll transform; the article owns the pointer tilt. -->
  <div ref="scene" class="h-full">
    <article
      ref="card"
      class="card tilt-surface glow-border flex h-full flex-col overflow-hidden"
      :aria-labelledby="titleId"
    >
      <div class="relative aspect-video overflow-hidden border-b border-line bg-raised">
        <img
          v-if="image"
          data-art-back
          :src="assetUrl(image.src)"
          :alt="image.alt"
          :width="image.width"
          :height="image.height"
          loading="lazy"
          decoding="async"
          class="size-full scale-[1.18] object-cover"
          @error="imageFailed = true"
        />
        <div v-else class="relative size-full">
          <div
            data-art-back
            class="project-art absolute -inset-y-[12%] inset-x-0"
            aria-hidden="true"
          />
          <div
            data-art-front
            class="relative flex size-full flex-col items-center justify-center gap-2 text-muted"
          >
            <span class="art-mark grid size-20 place-items-center rounded-2xl border border-line">
              <AppIcon :name="category.icon" class="size-10 text-primary opacity-90" />
            </span>
            <span v-if="imageFailed" class="text-xs">Screenshot unavailable</span>
          </div>
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
  </div>
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

/* Foreground mark floats above the grid with its own soft shadow. */
.art-mark {
  background: color-mix(in oklab, var(--surface-raised) 80%, transparent);
  box-shadow: 0 20px 40px -20px color-mix(in oklab, var(--primary) 55%, transparent);
  transition:
    scale 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
    rotate 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

article:hover .art-mark {
  scale: 1.08;
  rotate: -4deg;
}
</style>
