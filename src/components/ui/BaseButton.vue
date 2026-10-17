<script setup lang="ts">
import { computed } from 'vue'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'md' | 'sm'

const props = withDefaults(
  defineProps<{
    /** Renders an <a> when set, otherwise a <button>. */
    href?: string
    variant?: Variant
    size?: Size
    /** Opens in a new tab with a safe `rel` and an accessible hint. */
    external?: boolean
    /** Suggested file name; turns the link into a download. */
    download?: string
    type?: 'button' | 'submit'
  }>(),
  { variant: 'primary', size: 'md', type: 'button' },
)

const variants: Record<Variant, string> = {
  primary:
    'bg-primary-solid text-on-primary hover:bg-primary-solid-hover border border-transparent shadow-sm',
  secondary: 'bg-raised text-fg border border-control hover:border-primary hover:text-primary-ink',
  ghost: 'text-muted border border-transparent hover:text-fg hover:bg-surface',
}

const sizes: Record<Size, string> = {
  md: 'h-11 px-5 text-sm gap-2',
  sm: 'h-9 px-3.5 text-sm gap-1.5',
}

const classes = computed(() => [
  'inline-flex items-center justify-center rounded-lg font-semibold whitespace-nowrap',
  'transition-colors duration-150 select-none [&_svg]:size-4 [&_svg]:shrink-0',
  variants[props.variant],
  sizes[props.size],
])
</script>

<template>
  <a
    v-if="href"
    :href="href"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener noreferrer' : undefined"
    :download="download"
    :class="classes"
  >
    <slot />
    <span v-if="external" class="sr-only">(opens in a new tab)</span>
  </a>
  <button v-else :type="type" :class="classes">
    <slot />
  </button>
</template>
