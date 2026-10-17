<script setup lang="ts">
import { Building, Check, ChevronDown, MapPin } from '@lucide/vue'
import { computed, ref } from 'vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import TagChip from '@/components/ui/TagChip.vue'
import type { ExperienceItem } from '@/types'

const props = defineProps<{ item: ExperienceItem }>()

/** Long lists start collapsed to this many items; everything stays in the DOM for search engines. */
const VISIBLE_RESPONSIBILITIES = 5

const expanded = ref(false)
// Hiding a single line saves no space, so only collapse when two or more would be hidden.
const hiddenCount = computed(() => {
  const extra = props.item.responsibilities.length - VISIBLE_RESPONSIBILITIES
  return extra >= 2 ? extra : 0
})
const listId = computed(() => `${props.item.id}-responsibilities`)

/** "Built Finance features: travel requests…" → bold "Built Finance features" + the detail. */
function splitLabel(line: string): { label?: string; text: string } {
  const match = /^([^:]{3,40}):\s+(.+)$/.exec(line)
  return match ? { label: match[1], text: match[2]! } : { text: line }
}

const responsibilities = computed(() => props.item.responsibilities.map(splitLabel))
</script>

<template>
  <li class="relative pl-9 md:pl-14">
    <!-- Timeline marker, centred on the list's left rule -->
    <span
      class="absolute top-7 left-0 grid size-4 -translate-x-1/2 place-items-center rounded-full border-2"
      :class="
        item.current
          ? 'border-primary bg-primary shadow-[0_0_0_5px_color-mix(in_oklab,var(--primary)_18%,transparent)]'
          : 'border-line-strong bg-bg'
      "
      aria-hidden="true"
    />

    <article class="card overflow-hidden" :aria-labelledby="`${item.id}-role`">
      <header
        class="flex flex-col gap-3 border-b border-line px-6 py-5 sm:flex-row sm:items-start sm:justify-between md:px-8"
      >
        <div class="min-w-0">
          <h3 :id="`${item.id}-role`" class="text-xl font-semibold tracking-tight">
            {{ item.role }}
          </h3>
          <p class="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
            <span class="inline-flex items-center gap-1.5 font-medium">
              <Building class="size-4 shrink-0" aria-hidden="true" />
              <a
                v-if="item.companyUrl"
                :href="item.companyUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="underline decoration-line-strong underline-offset-4 hover:text-fg"
              >
                {{ item.company }}<span class="sr-only"> (opens in a new tab)</span>
              </a>
              <template v-else>{{ item.company }}</template>
            </span>
            <span v-if="item.location" class="inline-flex items-center gap-1.5">
              <MapPin class="size-4 shrink-0" aria-hidden="true" />
              {{ item.location }}
            </span>
          </p>
        </div>

        <div class="flex shrink-0 flex-wrap items-center gap-2 sm:flex-col sm:items-end">
          <span
            class="inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-xs font-medium"
            :class="
              item.current
                ? 'border-primary/40 bg-primary/10 text-primary-ink'
                : 'border-line bg-raised text-muted'
            "
          >
            <span v-if="item.current" class="size-1.5 rounded-full bg-primary" aria-hidden="true" />
            {{ item.period }}
          </span>
          <StatusBadge v-if="item.placeholder" status="sample" />
        </div>
      </header>

      <div class="grid gap-8 px-6 py-6 md:px-8 md:py-7 lg:grid-cols-[minmax(0,1fr)_15rem]">
        <div>
          <p class="text-muted">{{ item.summary }}</p>

          <h4 class="mt-6 font-mono text-xs font-medium tracking-wide text-accent uppercase">
            What I did
          </h4>
          <ul :id="listId" class="mt-3 space-y-3">
            <li
              v-for="(line, index) in responsibilities"
              v-show="expanded || hiddenCount === 0 || index < VISIBLE_RESPONSIBILITIES"
              :key="index"
              class="flex gap-3"
            >
              <Check class="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" />
              <span>
                <strong v-if="line.label" class="font-semibold">{{ line.label }}:</strong>
                {{ line.text }}
              </span>
            </li>
          </ul>
          <button
            v-if="hiddenCount > 0"
            type="button"
            class="mt-4 inline-flex items-center gap-1.5 rounded-md text-sm font-semibold text-primary-ink hover:underline hover:underline-offset-4"
            :aria-expanded="expanded"
            :aria-controls="listId"
            @click="expanded = !expanded"
          >
            {{ expanded ? 'Show less' : `Show ${hiddenCount} more` }}
            <ChevronDown
              class="size-4 transition-transform"
              :class="expanded ? 'rotate-180' : ''"
              aria-hidden="true"
            />
          </button>

          <template v-if="item.achievements && item.achievements.length > 0">
            <h4 class="mt-7 font-mono text-xs font-medium tracking-wide text-accent uppercase">
              Key achievements
            </h4>
            <ul class="mt-3 space-y-3">
              <li v-for="line in item.achievements" :key="line" class="flex gap-3">
                <Check class="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" />
                <span>{{ line }}</span>
              </li>
            </ul>
          </template>

          <template v-if="item.impact">
            <h4 class="mt-7 font-mono text-xs font-medium tracking-wide text-accent uppercase">
              Business impact
            </h4>
            <p class="mt-3 border-l-2 border-primary pl-4">{{ item.impact }}</p>
          </template>
        </div>

        <aside
          class="border-t border-line pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8"
          :aria-labelledby="`${item.id}-stack`"
        >
          <h4
            :id="`${item.id}-stack`"
            class="font-mono text-xs font-medium tracking-wide text-accent uppercase"
          >
            Tech stack
          </h4>
          <ul class="mt-3 flex flex-wrap gap-2" aria-label="Technologies">
            <li v-for="tech in item.technologies" :key="tech">
              <TagChip>{{ tech }}</TagChip>
            </li>
          </ul>
        </aside>
      </div>
    </article>
  </li>
</template>
