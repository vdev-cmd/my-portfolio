<script setup lang="ts">
import { computed, onMounted, onScopeDispose, ref, useTemplateRef, watch } from 'vue'
import ThemeToggle from '@/components/common/ThemeToggle.vue'
import { useMediaQuery } from '@/composables/useMediaQuery'
import { useScrollSpy } from '@/composables/useScrollSpy'
import { navItems, sectionIds } from '@/data/navigation'
import { profile } from '@/data/profile'

const MENU_ID = 'primary-menu'

const { activeId } = useScrollSpy(sectionIds)
const isDesktop = useMediaQuery('(min-width: 48rem)')

const menuOpen = ref(false)
const headerEl = useTemplateRef<HTMLElement>('header')
const toggleEl = useTemplateRef<HTMLButtonElement>('toggle')
const listEl = useTemplateRef<HTMLUListElement>('list')

function closeMenu(restoreFocus = false) {
  if (!menuOpen.value) return
  menuOpen.value = false
  if (restoreFocus) toggleEl.value?.focus()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') closeMenu(true)
}

function onDocumentPointerDown(event: PointerEvent) {
  if (event.target instanceof Node && !headerEl.value?.contains(event.target)) closeMenu()
}

// The outside-click listener only exists while the menu is open.
watch(menuOpen, (open) => {
  if (open) document.addEventListener('pointerdown', onDocumentPointerDown)
  else document.removeEventListener('pointerdown', onDocumentPointerDown)
})
onScopeDispose(() => document.removeEventListener('pointerdown', onDocumentPointerDown))

// A menu left "open" while resizing to desktop would reappear when resizing back.
watch(isDesktop, (desktop) => {
  if (desktop) menuOpen.value = false
})

/* ---------- Scroll state: frosted glass + reading progress ---------- */

/** Scroll distance (px) over which the glass goes from clear to fully frosted. */
const GLASS_DISTANCE = 120
let scrollFrame = 0

// Both values are written straight to CSS variables so scrolling never re-renders the component.
function updateScroll() {
  scrollFrame = 0
  const el = headerEl.value
  if (!el) return
  const y = Math.max(window.scrollY, 0)
  const max = document.documentElement.scrollHeight - window.innerHeight
  el.style.setProperty('--scroll-glass', Math.min(y / GLASS_DISTANCE, 1).toFixed(3))
  el.style.setProperty('--progress', max > 0 ? Math.min(y / max, 1).toFixed(4) : '0')
}

function scheduleScroll() {
  scrollFrame ||= window.requestAnimationFrame(updateScroll)
}

/* ---------- Sliding indicator: follows hover, rests on the active section ---------- */

const hoveredId = ref<string>()
const indicatorId = computed(() => hoveredId.value ?? activeId.value)
const indicator = ref({ x: 0, width: 0, visible: false })

function measureIndicator() {
  const link = listEl.value?.querySelector<HTMLElement>(`a[href="#${indicatorId.value}"]`)
  if (!link || !isDesktop.value) {
    indicator.value = { ...indicator.value, visible: false }
    return
  }
  indicator.value = { x: link.offsetLeft, width: link.offsetWidth, visible: true }
}

watch([indicatorId, isDesktop], measureIndicator, { flush: 'post' })

let resizeObserver: ResizeObserver | undefined

onMounted(() => {
  updateScroll()
  measureIndicator()
  window.addEventListener('scroll', scheduleScroll, { passive: true })
  window.addEventListener('resize', scheduleScroll, { passive: true })
  if (typeof ResizeObserver !== 'undefined' && listEl.value) {
    resizeObserver = new ResizeObserver(measureIndicator)
    resizeObserver.observe(listEl.value)
  }
  // Web fonts can change link widths after first paint.
  void document.fonts?.ready.then(measureIndicator)
})

onScopeDispose(() => {
  window.removeEventListener('scroll', scheduleScroll)
  window.removeEventListener('resize', scheduleScroll)
  if (scrollFrame) window.cancelAnimationFrame(scrollFrame)
  resizeObserver?.disconnect()
})
</script>

<template>
  <header
    ref="header"
    class="site-header sticky top-0 z-40 border-b"
    :class="{ 'is-solid': menuOpen }"
    @keydown="onKeydown"
  >
    <div class="page-container flex h-(--header-h) items-center gap-4">
      <a
        href="#home"
        class="group flex items-center gap-2.5 rounded-lg font-semibold tracking-tight"
        @click="closeMenu()"
      >
        <!-- The monogram is generated content, so the link's name is just the visible site name. -->
        <span
          class="logo-mark grid size-9 place-items-center rounded-lg bg-primary-solid font-mono text-sm font-bold text-on-primary group-hover:scale-110 group-hover:-rotate-6 before:content-[attr(data-initials)]"
          :data-initials="profile.initials"
          aria-hidden="true"
        />
        <span class="sr-only transition-colors group-hover:text-primary-ink sm:not-sr-only">{{
          profile.name
        }}</span>
      </a>

      <!-- DOM order: actions before the menu so the open menu follows its toggle button. -->
      <div class="ml-auto flex items-center gap-1 md:order-3 md:ml-0">
        <ThemeToggle />
        <button
          ref="toggle"
          type="button"
          class="burger inline-flex size-11 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-fg md:hidden"
          :class="{ 'is-open': menuOpen }"
          :aria-expanded="menuOpen"
          :aria-controls="MENU_ID"
          :aria-label="menuOpen ? 'Close navigation menu' : 'Open navigation menu'"
          @click="menuOpen = !menuOpen"
        >
          <!-- Three bars that morph into an X -->
          <span class="relative block h-3.5 w-5" aria-hidden="true">
            <span class="burger-bar top-0" />
            <span class="burger-bar top-1/2 -translate-y-1/2" />
            <span class="burger-bar bottom-0" />
          </span>
        </button>
      </div>

      <nav aria-label="Primary" class="md:order-2 md:ml-auto">
        <ul
          :id="MENU_ID"
          ref="list"
          class="absolute inset-x-0 top-full flex-col gap-1 border-b border-line bg-bg p-4 shadow-lg md:relative md:flex md:flex-row md:gap-1 md:border-0 md:bg-transparent md:p-0 md:shadow-none"
          :class="menuOpen ? 'menu-open flex' : 'hidden'"
          @pointerleave="hoveredId = undefined"
        >
          <!-- Desktop: one pill that glides to the hovered or active link -->
          <li
            class="nav-indicator pointer-events-none absolute inset-y-0 left-0 hidden rounded-full bg-surface ring-1 ring-line md:block"
            :style="{
              width: `${indicator.width}px`,
              transform: `translateX(${indicator.x}px)`,
              opacity: indicator.visible ? 1 : 0,
            }"
            aria-hidden="true"
          />
          <li
            v-for="(item, index) in navItems"
            :key="item.id"
            class="nav-item relative"
            :style="{ '--i': index }"
          >
            <a
              :href="`#${item.id}`"
              :aria-current="activeId === item.id ? 'location' : undefined"
              class="relative block rounded-md px-3 py-3 text-sm font-medium text-muted transition-colors duration-200 hover:text-fg aria-[current=location]:bg-surface aria-[current=location]:text-fg md:rounded-full md:py-2 md:aria-[current=location]:bg-transparent md:aria-[current=location]:text-primary-ink"
              @pointerenter="hoveredId = item.id"
              @focus="hoveredId = item.id"
              @blur="hoveredId = undefined"
              @click="closeMenu()"
            >
              {{ item.label }}
            </a>
          </li>
        </ul>
      </nav>
    </div>

    <!-- Reading progress -->
    <span class="scroll-progress" aria-hidden="true" />
  </header>
</template>

<style scoped>
/*
 * Frosted glass. Everything derives from one number, --glass (0 = clear, 1 = frosted), which
 * follows the scroll position continuously, so blur, tint, border and shadow fade in together.
 * --glass is a registered property, so jumps (anchor links, opening the menu) are eased too.
 */
@property --glass {
  syntax: '<number>';
  inherits: false;
  initial-value: 0;
}

.site-header {
  --glass: var(--scroll-glass, 0);
  background-color: color-mix(in oklab, var(--bg) calc(30% + 52% * var(--glass)), transparent);
  -webkit-backdrop-filter: blur(calc(var(--glass) * 14px)) saturate(calc(1 + var(--glass) * 0.6));
  backdrop-filter: blur(calc(var(--glass) * 14px)) saturate(calc(1 + var(--glass) * 0.6));
  border-bottom-color: color-mix(in oklab, var(--line) calc(var(--glass) * 100%), transparent);
  box-shadow: 0 10px 30px -14px rgb(var(--shadow-color) / calc(var(--glass) * 0.35));
  transition: --glass 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  /* Slides in once on load */
  animation: header-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.site-header.is-solid {
  --glass: 1;
}

@keyframes header-in {
  from {
    opacity: 0;
    transform: translateY(-100%);
  }
}

/* Desktop links fade up one after another */
@media (min-width: 48rem) {
  .nav-item {
    animation: item-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
    animation-delay: calc(0.15s + var(--i) * 45ms);
  }
}

/* Mobile menu items cascade in each time the menu opens */
.menu-open .nav-item {
  animation: item-in 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: calc(var(--i) * 35ms);
}

@keyframes item-in {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
}

.nav-indicator {
  transition:
    transform 0.45s cubic-bezier(0.22, 1, 0.36, 1),
    width 0.45s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.25s ease;
}

/* Gentle sheen across the monogram on hover */
.logo-mark {
  position: relative;
  overflow: hidden;
  background-image: linear-gradient(
    115deg,
    transparent 30%,
    rgb(255 255 255 / 0.35) 50%,
    transparent 70%
  );
  background-size: 250% 100%;
  background-position: 150% 0;
  background-repeat: no-repeat;
  transition:
    background-position 0.7s ease,
    scale 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
    rotate 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.group:hover .logo-mark {
  background-position: -50% 0;
}

/* Hamburger → X */
.burger-bar {
  position: absolute;
  left: 0;
  height: 2px;
  width: 100%;
  border-radius: 9999px;
  background-color: currentColor;
  transition:
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.2s ease,
    top 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    bottom 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.is-open .burger-bar:nth-child(1) {
  top: calc(50% - 1px);
  transform: rotate(45deg);
}

.is-open .burger-bar:nth-child(2) {
  opacity: 0;
  transform: translateY(-50%) scaleX(0.2);
}

.is-open .burger-bar:nth-child(3) {
  bottom: calc(50% - 1px);
  transform: rotate(-45deg);
}

/* Thin gradient bar along the bottom edge that fills as the page is read */
.scroll-progress {
  position: absolute;
  inset-inline: 0;
  bottom: -1px;
  height: 2px;
  transform-origin: left;
  transform: scaleX(var(--progress, 0));
  background: linear-gradient(90deg, var(--primary), var(--accent-glow));
  pointer-events: none;
}
</style>
