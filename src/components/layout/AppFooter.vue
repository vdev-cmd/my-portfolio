<script setup lang="ts">
import BackToTop from '@/components/common/BackToTop.vue'
import SocialLinks from '@/components/common/SocialLinks.vue'
import { profile } from '@/data/profile'
import { getContactChannels } from '@/utils/links'

const year = new Date().getFullYear()
const channels = getContactChannels(profile)
</script>

<template>
  <footer class="border-t border-line py-10">
    <div class="page-container flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      <div class="space-y-1 text-sm text-muted">
        <p>&copy; {{ year }} {{ profile.name }}. All rights reserved.</p>
        <p>Built with Vue.js and TypeScript.</p>
      </div>
      <SocialLinks :channels="channels" label="Footer social links" />
      <BackToTop />
    </div>
  </footer>
</template>
