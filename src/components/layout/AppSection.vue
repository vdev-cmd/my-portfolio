<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { gsap, motion, SplitText } from '@/animations/gsap'
import { useGsap } from '@/composables/useGsap'

const props = defineProps<{
  id: string
  /** Small mono label above the title, e.g. "02 / experience". */
  eyebrow: string
  title: string
  description?: string
}>()

const titleId = computed(() => `${props.id}-title`)

const header = useTemplateRef<HTMLElement>('header')

// Every section heading enters the same way: the eyebrow wipes in, the title rises word by word
// out of a mask, then the description follows.
useGsap(header, (_conditions, el) => {
  const q = gsap.utils.selector(el)
  const split = SplitText.create(q('h2'), { type: 'words', mask: 'words' })

  const tl = gsap
    .timeline({
      defaults: { ease: motion.ease.out, duration: motion.duration.base },
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      // Hand back clean, unsplit markup once the heading has landed.
      onComplete: () => split.revert(),
    })
    .from(q('.eyebrow'), { clipPath: 'inset(0 100% 0 0)', x: -12, duration: 0.7 })
    .from(split.words, { yPercent: 110, stagger: motion.stagger.tight, duration: 1 }, 0.1)

  const description = q('[data-section-description]')
  if (description.length) tl.from(description, { y: 20, opacity: 0 }, 0.35)
})
</script>

<template>
  <section
    :id="id"
    :aria-labelledby="titleId"
    tabindex="-1"
    class="border-t border-line py-20 md:py-28"
  >
    <div class="page-container">
      <header ref="header" class="mb-12 max-w-2xl md:mb-14">
        <p class="eyebrow">{{ eyebrow }}</p>
        <h2
          :id="titleId"
          class="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
        >
          {{ title }}
        </h2>
        <p v-if="description" data-section-description class="mt-4 text-lg text-muted">
          {{ description }}
        </p>
      </header>
      <slot />
    </div>
  </section>
</template>
