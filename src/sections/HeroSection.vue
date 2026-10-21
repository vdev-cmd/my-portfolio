<script setup lang="ts">
import { ArrowRight, Download } from '@lucide/vue'
import { useTemplateRef } from 'vue'
import { gsap, motion, SplitText } from '@/animations/gsap'
import FloatingGlyphs from '@/components/common/FloatingGlyphs.vue'
import SocialLinks from '@/components/common/SocialLinks.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import TagChip from '@/components/ui/TagChip.vue'
import { profile } from '@/data/profile'
import { useGsap } from '@/composables/useGsap'
import { useTilt } from '@/composables/useTilt'
import { assetUrl } from '@/utils/assets'
import { getContactChannels } from '@/utils/links'
import { resumeAvailable } from '@/utils/resume'

const channels = getContactChannels(profile)
const resumeHref = assetUrl(profile.resume.path)

const card = useTemplateRef<HTMLElement>('card')
useTilt(card, { max: 9 })

const section = useTemplateRef<HTMLElement>('section')
// The intro plays once; a breakpoint change re-runs the setup without replaying it.
let introPlayed = false

useGsap(section, ({ desktop }, el) => {
  const q = gsap.utils.selector(el)
  const [title] = q('#hero-title')

  function playIntro() {
    /*
     * Intro, in the order of the reel: light comes up, the headline rises word by word, the profile
     * card scales and tilts into place, the copy slides in, then the calls to action.
     */
    const split = SplitText.create(title!, { type: 'words', mask: 'words' })
    // Each accent word paints its own gradient once the words become separate boxes.
    for (const word of split.words) {
      if (word.closest('.gradient-text')) word.classList.add('gradient-text')
    }

    const intro = gsap.timeline({
      defaults: { ease: motion.ease.out, duration: motion.duration.base },
      // Hand back clean, unsplit markup once the headline has landed.
      onComplete: () => split.revert(),
    })
    intro
      .from(q('[data-hero-bg]'), { opacity: 0, scale: 1.08, duration: motion.duration.slow }, 0)
      .from(q('[data-hero-orb]'), { opacity: 0, duration: 2, stagger: 0.2 }, 0)
      .from(q('[data-hero-kicker]'), { y: 20, opacity: 0, stagger: motion.stagger.base }, 0.15)
      .from(split.words, { yPercent: 110, duration: 1.1, stagger: 0.045 }, 0.3)
      .from(
        q('[data-hero-scene]'),
        {
          opacity: 0,
          scale: 0.82,
          y: 60,
          rotateX: 22,
          rotateY: -12,
          transformPerspective: 1200,
          duration: motion.duration.slow,
        },
        0.45,
      )
      .from(q('[data-hero-copy]'), { y: 26, opacity: 0, stagger: 0.1 }, 0.75)
      .from(
        q('[data-hero-cta] > a, [data-hero-cta] li'),
        { y: 18, scale: 0.94, opacity: 0, stagger: 0.07, duration: motion.duration.fast },
        0.95,
      )
  }

  if (!introPlayed) {
    introPlayed = true
    playIntro()
  }

  // Ambient light keeps breathing behind everything.
  q('[data-hero-orb]').forEach((orb, index) => {
    gsap.to(orb, {
      xPercent: index ? -12 : 14,
      yPercent: index ? 10 : -8,
      scale: index ? 1.12 : 0.9,
      duration: 9 + index * 3,
      ease: motion.ease.float,
      repeat: -1,
      yoyo: true,
    })
  })

  if (!desktop) return

  /*
   * Scrolling out: the copy drifts up, the card lifts away while its layers separate in depth
   * (like the stacked burger in the reel), and the background moves slower than the content.
   */
  const scrub = { trigger: el, start: 'top top', end: 'bottom top', scrub: 0.6 }
  const out = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: scrub })
  out
    .to(q('[data-hero-text]'), { y: -70, opacity: 0.4 }, 0)
    .to(
      q('[data-hero-visual]'),
      { y: -130, rotateX: 16, scale: 0.94, transformPerspective: 1200 },
      0,
    )
    .to(q('[data-hero-bg]'), { yPercent: 18 }, 0)
  q('.tilt-layer').forEach((layer) => {
    const z = parseFloat(getComputedStyle(layer).getPropertyValue('--z')) || 0
    out.to(layer, { '--z': `${z * 2.5 + 16}px` }, 0)
  })
})
</script>

<template>
  <section
    id="home"
    ref="section"
    aria-labelledby="hero-title"
    tabindex="-1"
    class="relative isolate overflow-hidden"
  >
    <div class="hero-bg" data-hero-bg aria-hidden="true">
      <span class="hero-orb hero-orb--primary" data-hero-orb />
      <span class="hero-orb hero-orb--accent" data-hero-orb />
    </div>
    <FloatingGlyphs />

    <div
      class="page-container grid gap-14 py-16 sm:py-20 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-center lg:gap-16 lg:py-28"
    >
      <div data-hero-text>
        <p data-hero-kicker class="text-lg font-semibold">{{ profile.name }}</p>
        <p data-hero-kicker class="eyebrow mt-1">{{ profile.role }}</p>

        <h1
          id="hero-title"
          class="mt-6 text-4xl leading-[1.08] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl"
        >
          {{ profile.headline.lead }}
          <span class="gradient-text">{{ profile.headline.accent }}</span>
        </h1>

        <p data-hero-copy class="mt-6 max-w-2xl text-lg text-muted">{{ profile.intro }}</p>

        <p data-hero-copy class="mt-4 font-mono text-sm text-muted">
          {{ profile.location }} <span aria-hidden="true">·</span>
          <span class="sr-only">Career direction:</span> {{ profile.careerDirection }}
        </p>

        <div data-hero-cta class="mt-9 flex flex-wrap items-center gap-3">
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

      <!--
        Three wrappers, three owners of `transform`: scroll parallax (visual), the intro (scene)
        and the pointer tilt (card), so no animation ever overwrites another.
      -->
      <div data-hero-visual>
        <div data-hero-scene class="tilt-scene">
          <aside ref="card" aria-label="Professional focus" class="tilt-card card p-6 md:p-8">
            <div class="tilt-glare" aria-hidden="true" />

            <div class="tilt-layer flex items-center gap-5" style="--z: 32px">
              <div class="portrait shrink-0">
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
                <dt class="font-mono text-xs font-medium text-accent">
                  // professional experience
                </dt>
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

.hero-orb {
  position: absolute;
  border-radius: 9999px;
  pointer-events: none;
}

.hero-orb--primary {
  top: -12rem;
  right: -6rem;
  width: 34rem;
  height: 34rem;
  background: radial-gradient(
    closest-side,
    color-mix(in oklab, var(--primary) 22%, transparent),
    transparent
  );
}

.hero-orb--accent {
  top: -6rem;
  left: -12rem;
  width: 30rem;
  height: 30rem;
  background: radial-gradient(
    closest-side,
    color-mix(in oklab, var(--accent-glow) 16%, transparent),
    transparent
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
  width: 7rem;
  height: 7rem;
}

/* A still, framed headshot: no float, halo or depth effects on the photo itself. */
.portrait-img {
  width: 100%;
  height: 100%;
  border-radius: 1.5rem;
  border: 3px solid var(--surface);
  outline: 1px solid var(--line-strong);
  box-shadow: 0 12px 28px -14px rgb(var(--shadow-color) / 0.45);
}
</style>
