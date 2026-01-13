<script setup lang="ts">
defineProps<{
  label: string
  value: string
  meta?: string
  warning?: boolean
  success?: boolean
  tooltip?: string
}>()
</script>

<template>
  <div class="stat-card" :class="{ warning, success }">
    <div class="stat-label">
      {{ label }}
      <span v-if="tooltip" class="info-icon" :title="tooltip">i</span>
    </div>
    <div class="stat-value">{{ value }}</div>
    <div v-if="meta" class="stat-meta">{{ meta }}</div>
  </div>
</template>

<style scoped>
.info-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  margin-left: 4px;
  font-size: 10px;
  font-style: italic;
  font-weight: 600;
  color: var(--text-tertiary);
  border: 1px solid var(--text-tertiary);
  border-radius: 50%;
  cursor: help;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.info-icon:hover {
  opacity: 1;
}
</style>
