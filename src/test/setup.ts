import { afterEach, beforeEach } from 'vitest'
import { installMatchMedia } from './matchMedia'

// GSAP's ScrollTrigger reads matchMedia while its module is imported, before any hook runs.
installMatchMedia()

beforeEach(() => {
  // jsdom implements neither matchMedia nor scrollTo.
  installMatchMedia()
  window.scrollTo = () => {}
})

afterEach(() => {
  window.localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
  document.documentElement.style.removeProperty('color-scheme')
  document.body.innerHTML = ''
})
