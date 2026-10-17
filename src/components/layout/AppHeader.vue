<script setup lang="ts">
import { Menu, X } from '@lucide/vue'
import { onScopeDispose, ref, useTemplateRef, watch } from 'vue'
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
</script>

<template>
  <header
    ref="header"
    class="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur-sm"
    @keydown="onKeydown"
  >
    <div class="page-container flex h-(--header-h) items-center gap-4">
      <a
        href="#home"
        class="flex items-center gap-2.5 rounded-lg font-semibold tracking-tight"
        @click="closeMenu()"
      >
        <!-- The monogram is generated content, so the link's name is just the visible site name. -->
        <span
          class="grid size-9 place-items-center rounded-lg bg-primary-solid font-mono text-sm font-bold text-on-primary before:content-[attr(data-initials)]"
          :data-initials="profile.initials"
          aria-hidden="true"
        />
        <span class="sr-only sm:not-sr-only">{{ profile.name }}</span>
      </a>

      <!-- DOM order: actions before the menu so the open menu follows its toggle button. -->
      <div class="ml-auto flex items-center gap-1 md:order-3 md:ml-0">
        <ThemeToggle />
        <button
          ref="toggle"
          type="button"
          class="inline-flex size-11 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-fg md:hidden"
          :aria-expanded="menuOpen"
          :aria-controls="MENU_ID"
          :aria-label="menuOpen ? 'Close navigation menu' : 'Open navigation menu'"
          @click="menuOpen = !menuOpen"
        >
          <X v-if="menuOpen" class="size-5" aria-hidden="true" />
          <Menu v-else class="size-5" aria-hidden="true" />
        </button>
      </div>

      <nav aria-label="Primary" class="md:order-2 md:ml-auto">
        <ul
          :id="MENU_ID"
          class="absolute inset-x-0 top-full flex-col gap-1 border-b border-line bg-bg p-4 shadow-lg md:static md:flex md:flex-row md:gap-1 md:border-0 md:bg-transparent md:p-0 md:shadow-none"
          :class="menuOpen ? 'menu-open flex' : 'hidden'"
        >
          <li v-for="item in navItems" :key="item.id">
            <a
              :href="`#${item.id}`"
              :aria-current="activeId === item.id ? 'location' : undefined"
              class="relative block rounded-md px-3 py-3 text-sm font-medium text-muted transition-colors hover:text-fg aria-[current=location]:bg-surface aria-[current=location]:text-fg md:py-2 md:aria-[current=location]:bg-transparent md:after:absolute md:after:inset-x-3 md:after:-bottom-0.5 md:after:h-0.5 md:after:origin-left md:after:scale-x-0 md:after:rounded-full md:after:bg-primary md:after:transition-transform md:aria-[current=location]:after:scale-x-100"
              @click="closeMenu()"
            >
              {{ item.label }}
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>
