<script setup lang="ts">
import { useTemplateRef } from 'vue'
import AmbientBackdrop from '@/components/layout/AmbientBackdrop.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AboutSection from '@/sections/AboutSection.vue'
import AiJourneySection from '@/sections/AiJourneySection.vue'
import ContactSection from '@/sections/ContactSection.vue'
import ExperienceSection from '@/sections/ExperienceSection.vue'
import HeroSection from '@/sections/HeroSection.vue'
import ProjectsSection from '@/sections/ProjectsSection.vue'
import SkillsSection from '@/sections/SkillsSection.vue'
import { useScrollTriggerRefresh } from '@/composables/useGsap'

const main = useTemplateRef<HTMLElement>('main')
useScrollTriggerRefresh(main)
</script>

<template>
  <a
    href="#main"
    class="sr-only rounded-lg bg-primary-solid px-4 py-2 font-semibold text-on-primary focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50"
  >
    Skip to main content
  </a>
  <AmbientBackdrop />
  <AppHeader />
  <main id="main" ref="main" tabindex="-1">
    <HeroSection />
    <AboutSection />
    <ExperienceSection />
    <SkillsSection />
    <ProjectsSection />
    <AiJourneySection />
    <ContactSection />
  </main>
  <AppFooter />
</template>
