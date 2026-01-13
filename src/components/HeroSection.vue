<script setup lang="ts">
import { useCalculatorStore } from '../stores/calculatorStore'
import StatCard from './ui/StatCard.vue'

const store = useCalculatorStore()
</script>

<template>
  <header class="hero" data-animate>
    <div class="hero-text">
      <div class="eyebrow">ROI Headroom Studio</div>
      <h1>Design your runway for monthly income</h1>
      <p class="lede">
        Set a monthly withdrawal, headroom years, and target CAGR. Build the required start,
        then simulate how contributions and compounding move you across time.
      </p>
      <div class="hero-tags">
        <span class="tag">Range builder</span>
        <span class="tag">Scenario matrix</span>
        <span class="tag">Live charts</span>
      </div>
    </div>

    <div class="hero-metrics">
      <StatCard
        label="Required start"
        :value="store.format.currency(store.requiredStart)"
        :meta="`for ${store.format.currency(store.selected.target)} / mo, ${store.selected.years}y, ${store.selected.cagr}% CAGR`"
      />
      <StatCard
        label="CAGR needed for your start"
        :value="store.requiredCagrText"
        :meta="`based on ${store.format.currency(store.contribution.startCapital)} starting capital`"
      />
      <StatCard
        label="Auto time to required start"
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
  </header>
</template>
