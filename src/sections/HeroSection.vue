<script setup lang="ts">
import { ArrowRight, Download } from '@lucide/vue'
import SocialLinks from '@/components/common/SocialLinks.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import TagChip from '@/components/ui/TagChip.vue'
import { profile } from '@/data/profile'
import { vReveal } from '@/directives/reveal'
import { assetUrl } from '@/utils/assets'
import { getContactChannels } from '@/utils/links'
import { resumeAvailable } from '@/utils/resume'

const channels = getContactChannels(profile)
const resumeHref = assetUrl(profile.resume.path)
</script>

<template>
  <section
    id="home"
    aria-labelledby="hero-title"
    tabindex="-1"
    class="relative isolate overflow-hidden"
  >
    <div class="hero-bg" aria-hidden="true" />

    <div
      class="page-container grid gap-14 py-16 sm:py-20 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-center lg:gap-16 lg:py-28"
    >
      <div>
        <p v-reveal class="text-lg font-semibold">{{ profile.name }}</p>
        <p v-reveal="60" class="eyebrow mt-1">{{ profile.role }}</p>

        <h1
          id="hero-title"
          v-reveal="120"
          class="mt-6 text-4xl leading-[1.08] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl"
        >
          {{ profile.headline.lead }}
          <span class="gradient-text">{{ profile.headline.accent }}</span>
        </h1>

        <p v-reveal="180" class="mt-6 max-w-2xl text-lg text-muted">{{ profile.intro }}</p>

        <p v-reveal="220" class="mt-4 font-mono text-sm text-muted">
          {{ profile.location }} <span aria-hidden="true">·</span>
          <span class="sr-only">Career direction:</span> {{ profile.careerDirection }}
        </p>

        <div v-reveal="260" class="mt-9 flex flex-wrap items-center gap-3">
          <BaseButton href="#projects">
            View Projects
            <ArrowRight aria-hidden="true" />
          </BaseButton>
          <BaseButton
            v-if="resumeAvailable"
            :href="resumeHref"
            :download="profile.resume.downloadName"
            variant="secondary"
          >
            <Download aria-hidden="true" />
            Download Resume
          </BaseButton>
          <SocialLinks :channels="channels" label="Profile links" />
        </div>
      </div>

      <aside v-reveal="200" aria-label="Professional focus" class="card p-6 md:p-8">
        <div class="flex items-center gap-4">
          <img
            v-if="profile.photo"
            :src="assetUrl(profile.photo.src)"
            :alt="profile.photo.alt"
            :width="profile.photo.width"
            :height="profile.photo.height"
            fetchpriority="high"
            decoding="async"
            class="size-16 rounded-2xl object-cover"
          />
          <div
            v-else
            class="grid size-16 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-primary-solid to-accent font-mono text-xl font-bold text-white"
            aria-hidden="true"
          >
            {{ profile.initials }}
          </div>
          <div>
            <p class="font-semibold">{{ profile.name }}</p>
            <p class="text-sm text-muted">{{ profile.location }}</p>
          </div>
        </div>

        <dl class="mt-7 space-y-6">
          <div>
            <dt class="font-mono text-xs font-medium text-accent">// professional experience</dt>
            <dd>
              <ul class="mt-3 flex flex-wrap gap-2">
                <li v-for="item in profile.focus.professional" :key="item">
                  <TagChip>{{ item }}</TagChip>
                </li>
              </ul>
            </dd>
          </div>
          <div class="border-t border-dashed border-line-strong pt-6">
            <dt class="font-mono text-xs font-medium text-accent">// currently learning</dt>
            <dd>
              <ul class="mt-3 flex flex-wrap gap-2">
                <li v-for="item in profile.focus.learning" :key="item">
                  <TagChip tone="accent">{{ item }}</TagChip>
                </li>
              </ul>
            </dd>
          </div>
        </dl>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.hero-bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(
      50rem 28rem at 85% -10%,
      color-mix(in oklab, var(--primary) 20%, transparent),
      transparent 70%
    ),
    radial-gradient(
      36rem 24rem at 0% 10%,
      color-mix(in oklab, var(--accent-glow) 12%, transparent),
      transparent 70%
    );
}

.hero-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--line) 1px, transparent 1px),
    linear-gradient(90deg, var(--line) 1px, transparent 1px);
  background-size: 56px 56px;
  opacity: 0.55;
  mask-image: radial-gradient(ellipse 75% 65% at 50% 0%, #000 15%, transparent 75%);
}
</style>
