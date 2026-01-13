<script setup lang="ts">
defineProps<{
  label: string
  value: string
  meta?: string
  warning?: boolean
}>()
</script>

<template>
  <div class="stat-card" :class="{ warning }">
    <div class="stat-label">{{ label }}</div>
    <div class="stat-value">{{ value }}</div>
    <div v-if="meta" class="stat-meta">{{ meta }}</div>
  </div>
</template>
