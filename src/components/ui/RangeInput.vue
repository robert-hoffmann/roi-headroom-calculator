<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: number
  min: number
  max: number
  step: number
  label?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const value = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>

<template>
  <div class="control">
    <label v-if="label">{{ label }}</label>
    <div class="input-row">
      <input
        type="range"
        v-model.number="value"
        :min="min"
        :max="max"
        :step="step"
      />
      <input type="number" v-model.number="value" />
    </div>
  </div>
</template>
