import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

/*
 * The one place GSAP plugins are registered. Components import from here (never from 'gsap'
 * directly) so the registration always happens before first use.
 */
gsap.registerPlugin(ScrollTrigger, SplitText)

/** Shared motion vocabulary, so every section moves with the same character. */
export const motion = {
  ease: {
    /** Long, soft landing for entrances. */
    out: 'expo.out',
    /** Gentle deceleration for smaller elements. */
    soft: 'power3.out',
    /** Ambient loops. */
    float: 'sine.inOut',
  },
  duration: {
    fast: 0.5,
    base: 0.9,
    slow: 1.4,
  },
  stagger: {
    tight: 0.04,
    base: 0.08,
    loose: 0.14,
  },
} as const

/** Media conditions passed to every `gsap.matchMedia()` block (see useGsap). */
export const mediaConditions = {
  /** Visitor has not asked for reduced motion: animations may run at all. */
  motion: '(prefers-reduced-motion: no-preference)',
  /** Wide screens with room for scrubbed parallax and 3D depth. */
  desktop: '(min-width: 64rem)',
  /** A mouse or trackpad, so pointer-driven effects make sense. */
  finePointer: '(hover: hover) and (pointer: fine)',
} as const

export type MediaConditions = Record<keyof typeof mediaConditions, boolean>

export { gsap, ScrollTrigger, SplitText }
