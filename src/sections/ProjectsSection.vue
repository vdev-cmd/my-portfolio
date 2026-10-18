<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { ScrollTrigger } from '@/animations/gsap'
import ProjectCard from '@/components/common/ProjectCard.vue'
import ProjectFilter, { type FilterOption } from '@/components/common/ProjectFilter.vue'
import AppSection from '@/components/layout/AppSection.vue'
import { FILTER_MIN_PROJECTS, projectCategories, projects } from '@/data/projects'

const ALL = 'all'
const selected = ref<string>(ALL)

const categoryById = new Map(projectCategories.map((category) => [category.id, category]))

const options = computed<FilterOption[]>(() => [
  { id: ALL, label: 'All', count: projects.length },
  ...projectCategories
    .map((category) => ({
      id: category.id,
      label: category.label,
      count: projects.filter((project) => project.category === category.id).length,
    }))
    .filter((option) => option.count > 0),
])

// Filtering only helps once there is enough to filter and more than one category in use.
const showFilter = projects.length >= FILTER_MIN_PROJECTS && options.value.length > 2

const visibleProjects = computed(() =>
  selected.value === ALL
    ? projects
    : projects.filter((project) => project.category === selected.value),
)

// Cards that stay put still move on the page when others disappear: re-measure scroll triggers.
watch(selected, () => nextTick(() => ScrollTrigger.refresh()))

// Pair each project with its category; a project with an unknown category is skipped.
const cards = computed(() =>
  visibleProjects.value.flatMap((project) => {
    const category = categoryById.get(project.category)
    return category ? [{ project, category }] : []
  }),
)
</script>

<template>
  <AppSection
    id="projects"
    eyebrow="04 / projects"
    title="Featured projects"
    description="Sample entries until real project details are added. Proprietary employer code and data are never published here."
  >
    <div v-if="showFilter" class="mb-8 flex flex-col gap-3">
      <ProjectFilter v-model="selected" :options="options" />
      <p class="text-sm text-muted" role="status" aria-live="polite">
        Showing {{ visibleProjects.length }} of {{ projects.length }} projects
      </p>
    </div>

    <!-- Cards that appear after a filter change glide in; removed ones leave at once. -->
    <TransitionGroup tag="ul" name="project" class="grid gap-6 md:grid-cols-2">
      <li v-for="card in cards" :key="card.project.id">
        <ProjectCard :project="card.project" :category="card.category" />
      </li>
    </TransitionGroup>
  </AppSection>
</template>

<style scoped>
.project-enter-active {
  transition:
    opacity 0.5s ease,
    transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

.project-enter-from {
  opacity: 0;
  transform: translateY(24px) scale(0.96);
}

.project-move {
  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}
</style>
