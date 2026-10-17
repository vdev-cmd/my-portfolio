<script setup lang="ts">
import type { IconName } from '../../types/common'
import { icons } from './icons'

defineProps<{ name: IconName }>()
</script>

<template>
  <component :is="icons[name]" aria-hidden="true" focusable="false" />
</template>
