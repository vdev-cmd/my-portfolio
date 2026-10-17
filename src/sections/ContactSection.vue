<script setup lang="ts">
import { MapPin } from '@lucide/vue'
import CopyEmailButton from '@/components/common/CopyEmailButton.vue'
import AppSection from '@/components/layout/AppSection.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { profile } from '@/data/profile'
import { vReveal } from '@/directives/reveal'
import { getContactChannels, isExternalHref } from '@/utils/links'

const channels = getContactChannels(profile)
const email = profile.email
const showSetupHint = import.meta.env.DEV && !email
</script>

<template>
  <AppSection id="contact" eyebrow="06 / contact" title="Let's talk">
    <div class="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
      <div>
        <p class="max-w-xl text-lg text-muted">{{ profile.contactIntro }}</p>
        <p class="mt-6 flex items-center gap-2 text-muted">
          <MapPin class="size-5 text-accent" aria-hidden="true" />
          <span class="sr-only">Location:</span>
          {{ profile.location }}
        </p>
      </div>

      <div>
        <ul class="space-y-4">
          <li
            v-for="channel in channels"
            :key="channel.id"
            v-reveal
            class="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div class="flex min-w-0 items-center gap-4">
              <span
                class="grid size-11 shrink-0 place-items-center rounded-lg border border-line bg-raised text-primary"
              >
                <AppIcon :name="channel.icon" class="size-5" />
              </span>
              <div class="min-w-0">
                <p class="font-semibold">{{ channel.label }}</p>
                <p class="truncate text-sm text-muted select-all">{{ channel.display }}</p>
              </div>
            </div>

            <div class="flex shrink-0 flex-wrap items-start gap-2">
              <BaseButton
                :href="channel.href"
                :external="isExternalHref(channel.href)"
                :variant="channel.id === 'email' ? 'primary' : 'secondary'"
                size="sm"
              >
                {{ channel.id === 'email' ? 'Send email' : 'Open' }}
                <span class="sr-only"> {{ channel.label }}</span>
              </BaseButton>
              <CopyEmailButton v-if="channel.id === 'email' && email" :email="email" />
            </div>
          </li>
        </ul>

        <!-- Development-only reminder; never rendered in the production build. -->
        <p
          v-if="showSetupHint"
          class="mt-4 rounded-lg border border-dashed border-line-strong p-4 text-sm text-muted"
        >
          Dev note: no email is configured. Set <code class="font-mono">email</code> in
          <code class="font-mono">src/data/profile.ts</code> to show the mailto link and the
          copy-email button.
        </p>
      </div>
    </div>
  </AppSection>
</template>
