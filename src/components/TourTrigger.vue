<script setup lang="ts">
import { useTour } from '../composables/useTour'

const { startTour } = useTour()
</script>

<template>
  <button
    class="tour-trigger"
    @click="startTour"
    title="Start guided tour"
    aria-label="Start guided tour"
  >?
  </button>
</template>
