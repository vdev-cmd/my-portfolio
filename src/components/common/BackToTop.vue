<script setup lang="ts">
import { ArrowUp } from '@lucide/vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { scrollToTop } from '@/utils/motion'

function goToTop() {
  scrollToTop()
  // Move focus along with the viewport so keyboard users do not stay at the bottom of the page.
  document.getElementById('home')?.focus({ preventScroll: true })
}
</script>

<template>
  <BaseButton variant="secondary" size="sm" @click="goToTop">
    <ArrowUp aria-hidden="true" />
    Back to top
  </BaseButton>
</template>
