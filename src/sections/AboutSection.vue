<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { gsap, motion } from '@/animations/gsap'
import AppIcon from '@/components/ui/AppIcon.vue'
import AppSection from '@/components/layout/AppSection.vue'
import { useGsap } from '@/composables/useGsap'
import { profile } from '@/data/profile'

const content = useTemplateRef<HTMLElement>('content')

/** Vertical drift of each pillar while the row scrolls past (desktop), giving a staggered depth. */
const PILLAR_DEPTH = [0, -14, -28, -14]

useGsap(content, ({ desktop }, el) => {
  const q = gsap.utils.selector(el)

  // Storytelling: each paragraph brightens as it reaches the reading area. On desktop this is tied
  // to scroll position; on small screens a simple one-time fade keeps scrolling light.
  for (const paragraph of q('[data-about-paragraph]')) {
    if (desktop) {
      gsap.fromTo(
        paragraph,
        { opacity: 0.18, y: 36 },
        {
          opacity: 1,
          y: 0,
          ease: 'none',
          scrollTrigger: { trigger: paragraph, start: 'top 88%', end: 'top 58%', scrub: 0.5 },
        },
      )
    } else {
      gsap.from(paragraph, {
        opacity: 0,
        y: 24,
        duration: motion.duration.base,
        ease: motion.ease.soft,
        scrollTrigger: { trigger: paragraph, start: 'top 90%', once: true },
      })
    }
  }

  // Facts card floats up, then its rows tick in one after another.
  const [facts] = q('[data-about-facts]')
  gsap
    .timeline({
      defaults: { ease: motion.ease.out, duration: motion.duration.base },
      scrollTrigger: { trigger: facts, start: 'top 85%', once: true },
    })
    .from(facts!, { y: 50, opacity: 0, rotateX: 12, transformPerspective: 1000 })
    .from(q('[data-about-fact]'), { x: 24, opacity: 0, stagger: motion.stagger.base }, 0.2)

  // Pillars rise out of depth as a group…
  const pillars = q('[data-about-pillar]')
  gsap.from(pillars, {
    y: 70,
    opacity: 0,
    rotateX: -22,
    transformPerspective: 900,
    transformOrigin: '50% 100%',
    duration: motion.duration.slow,
    ease: motion.ease.out,
    stagger: motion.stagger.loose,
    scrollTrigger: { trigger: pillars[0], start: 'top 88%', once: true },
  })

  if (!desktop) return

  // …and drift at slightly different speeds while the row is on screen. yPercent stays separate
  // from the entrance's y, so the two never fight.
  pillars.forEach((pillar, index) => {
    gsap.fromTo(
      pillar,
      { yPercent: -(PILLAR_DEPTH[index % PILLAR_DEPTH.length] ?? 0) / 2 },
      {
        yPercent: (PILLAR_DEPTH[index % PILLAR_DEPTH.length] ?? 0) / 2,
        ease: 'none',
        scrollTrigger: { trigger: pillar, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
      },
    )
  })
})
</script>

<template>
  <AppSection
    id="about"
    eyebrow="01 / about"
    title="Enterprise mobile engineer, growing into Applied AI"
  >
    <div ref="content">
      <div class="grid gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] lg:gap-16">
        <div class="space-y-5 text-lg text-muted">
          <p
            v-for="(paragraph, index) in profile.about.paragraphs"
            :key="index"
            data-about-paragraph
          >
            {{ paragraph }}
          </p>
        </div>

        <!-- Stays beside the story while it is read (desktop). -->
        <dl
          data-about-facts
          class="card h-fit divide-y divide-line lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start"
        >
          <div
            v-for="fact in profile.about.facts"
            :key="fact.label"
            data-about-fact
            class="px-6 py-4"
          >
            <dt class="font-mono text-xs font-medium text-accent">{{ fact.label }}</dt>
            <dd class="mt-1 font-medium">{{ fact.value }}</dd>
          </div>
        </dl>
      </div>

      <ul class="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <li v-for="pillar in profile.about.pillars" :key="pillar.title" data-about-pillar>
          <div class="pillar card card-interactive group h-full p-6">
            <span
              class="grid size-10 place-items-center rounded-lg border border-line bg-raised text-primary transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:rotate-[-8deg] group-hover:scale-110"
            >
              <AppIcon :name="pillar.icon" class="size-5" />
            </span>
            <h3 class="mt-4 font-semibold tracking-tight">{{ pillar.title }}</h3>
            <p class="mt-2 text-sm text-muted">{{ pillar.body }}</p>
          </div>
        </li>
      </ul>
    </div>
  </AppSection>
</template>

<style scoped>
.pillar:hover {
  box-shadow:
    var(--shadow-card),
    0 22px 40px -26px color-mix(in oklab, var(--primary) 60%, transparent);
}
</style>
