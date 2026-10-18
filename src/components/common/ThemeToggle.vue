<script setup lang="ts">
import { Moon, Sun } from '@lucide/vue'
import { useTheme } from '@/composables/useTheme'

const { isDark, toggleTheme } = useTheme()
</script>

<template>
  <button
    type="button"
    class="relative inline-flex size-11 items-center justify-center overflow-hidden rounded-lg text-muted transition-colors hover:bg-surface hover:text-fg"
    :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
    :title="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
    @click="toggleTheme"
  >
    <!-- Both icons stay mounted so they can rotate past each other on every switch. -->
    <Sun class="theme-icon" :class="isDark ? 'is-shown' : 'is-hidden-down'" aria-hidden="true" />
    <Moon class="theme-icon" :class="isDark ? 'is-hidden-up' : 'is-shown'" aria-hidden="true" />
  </button>
</template>

<style scoped>
.theme-icon {
  position: absolute;
  width: 1.25rem;
  height: 1.25rem;
  transition:
    transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
    opacity 0.3s ease;
}

.is-shown {
  opacity: 1;
  transform: none;
}

.is-hidden-up {
  opacity: 0;
  transform: translateY(-120%) rotate(-90deg) scale(0.5);
}

.is-hidden-down {
  opacity: 0;
  transform: translateY(120%) rotate(90deg) scale(0.5);
}
</style>
