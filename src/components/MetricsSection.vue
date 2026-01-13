<script setup lang="ts">
import { useCalculatorStore } from '../stores/calculatorStore'
import StatCard from './ui/StatCard.vue'

const store = useCalculatorStore()
</script>

<template>
  <div class="panel hero-metrics" data-animate>
    <h2>Key metrics</h2>

    <div class="metrics-grid">
      <StatCard
        label="Required start"
        :value="store.format.currency(store.requiredStart)"
        :meta="`${store.format.currency(store.selected.target)} / mo, ${store.selected.years}y, ${store.selected.cagr}% CAGR`"
      />
      <StatCard
        label="CAGR needed"
        :value="store.requiredCagrText"
        :meta="`based on ${store.format.currency(store.contribution.startCapital)} starting capital`"
      />
      <StatCard
        label="Time to target"
        :value="store.autoTimeText"
        :meta="`with ${store.format.currency(store.contributionMonthly)} / mo contributions`"
      />
      <StatCard
        label="End balance"
        :value="store.format.currency(store.simulation.endBalance)"
        :meta="store.runwayText"
        :warning="store.simulation.endBalance < 0"
      />
    </div>
  </div>
</template>

<style scoped>
.hero-metrics {
  display: flex;
  flex-direction: column;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}
</style>
