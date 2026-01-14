<script setup lang="ts">
import { computed } from 'vue'
import { useCalculatorStore } from '../../stores/calculatorStore'

const store = useCalculatorStore()

const symbol = computed(() => store.currency === 'EUR' ? '\u20AC' : '$')
const tooltip = computed(() => `Switch to ${store.currency === 'EUR' ? 'USD' : 'EUR'}`)
</script>

<template>
  <button
    class="floating-button currency-toggle"
    :title="tooltip"
    @click="store.toggleCurrency()"
  >
    {{ symbol }}
  </button>
</template>
