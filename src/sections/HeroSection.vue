<script setup lang="ts">
import { ArrowRight, Download } from '@lucide/vue'
import { useTemplateRef } from 'vue'
import SocialLinks from '@/components/common/SocialLinks.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import TagChip from '@/components/ui/TagChip.vue'
import { profile } from '@/data/profile'
import { useTilt } from '@/composables/useTilt'
import { vReveal } from '@/directives/reveal'
import { assetUrl } from '@/utils/assets'
import { getContactChannels } from '@/utils/links'
import { resumeAvailable } from '@/utils/resume'

const channels = getContactChannels(profile)
const resumeHref = assetUrl(profile.resume.path)

const card = useTemplateRef<HTMLElement>('card')
useTilt(card, { max: 9 })
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

      <!-- Reveal lives on the wrapper so its transform never fights the tilt transform. -->
      <div v-reveal="200" class="tilt-scene">
        <aside ref="card" aria-label="Professional focus" class="tilt-card card p-6 md:p-8">
          <div class="tilt-glare" aria-hidden="true" />

          <div class="tilt-layer flex items-center gap-5" style="--z: 32px">
            <div class="portrait shrink-0">
              <span class="portrait-ring" aria-hidden="true" />
              <img
                v-if="profile.photo"
                :src="assetUrl(profile.photo.src)"
                :alt="profile.photo.alt"
                :width="profile.photo.width"
                :height="profile.photo.height"
                fetchpriority="high"
                decoding="async"
                class="portrait-img object-cover"
              />
              <div
                v-else
                class="portrait-img grid place-items-center bg-linear-to-br from-primary-solid to-accent font-mono text-2xl font-bold text-white"
                aria-hidden="true"
              >
                {{ profile.initials }}
              </div>
            </div>
            <div>
              <p class="font-semibold">{{ profile.name }}</p>
              <p class="text-sm text-muted">{{ profile.location }}</p>
            </div>
          </div>

          <dl class="tilt-layer mt-8 space-y-6" style="--z: 12px">
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

/* ---------- 3D profile card ---------- */
.tilt-scene {
  perspective: 1400px;
}

.tilt-card {
  position: relative;
  transform-style: preserve-3d;
  transform: rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
  will-change: transform;
}

.tilt-layer {
  transform-style: preserve-3d;
  transform: translateZ(var(--z, 0px));
}

/* Soft highlight that follows the pointer */
.tilt-glare {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  opacity: var(--glare, 0);
  background: radial-gradient(
    28rem circle at var(--gx, 50%) var(--gy, 50%),
    color-mix(in oklab, var(--accent-glow) 16%, transparent),
    transparent 55%
  );
}

.portrait {
  position: relative;
  display: grid;
  place-items: center;
  width: 7rem;
  height: 7rem;
  transform-style: preserve-3d;
  animation: portrait-float 6s ease-in-out infinite;
}

/* Rotating gradient halo behind the photo */
.portrait-ring {
  position: absolute;
  inset: -5px;
  border-radius: 1.75rem;
  background: conic-gradient(
    from var(--ring-angle, 0deg),
    var(--primary),
    var(--accent-glow),
    transparent 40%,
    var(--primary)
  );
  filter: blur(0.5px);
  animation: portrait-spin 8s linear infinite;
}

.portrait-ring::after {
  content: '';
  position: absolute;
  inset: -10px;
  border-radius: inherit;
  background: inherit;
  filter: blur(18px);
  opacity: 0.45;
}

.portrait-img {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 1.5rem;
  border: 3px solid var(--surface);
  transform: translateZ(24px);
  box-shadow: 0 18px 40px -16px rgb(var(--shadow-color) / 0.55);
}

@property --ring-angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}

@keyframes portrait-spin {
  to {
    --ring-angle: 360deg;
  }
}

@keyframes portrait-float {
  0%,
  100% {
    translate: 0 0;
  }
  50% {
    translate: 0 -6px;
  }
}
</style>
