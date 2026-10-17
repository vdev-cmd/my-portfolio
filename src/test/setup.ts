import { afterEach, beforeEach } from 'vitest'
import { installMatchMedia } from './matchMedia'

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
