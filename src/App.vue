<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useCalculatorStore } from './stores/calculatorStore'
import { useTheme } from './composables/useTheme'

// Components
import ThemeToggle from './components/ui/ThemeToggle.vue'
import CurrencyToggle from './components/ui/CurrencyToggle.vue'
import GitHubRibbon from './components/ui/GitHubRibbon.vue'
import RangeBuilder from './components/RangeBuilder.vue'
import ScenarioInputs from './components/ScenarioInputs.vue'
import ContributionPlan from './components/ContributionPlan.vue'
import BalanceChart from './components/BalanceChart.vue'
import MetricsSection from './components/MetricsSection.vue'
import TourTrigger from './components/TourTrigger.vue'

const store = useCalculatorStore()
const { initializeTheme } = useTheme()

// Watch for changes and refresh simulation
watch(
  () => [
    store.ranges.targetMin,
    store.ranges.targetMax,
    store.ranges.targetStep,
    store.ranges.yearsMin,
    store.ranges.yearsMax,
    store.ranges.yearsStep,
    store.ranges.cagrMin,
    store.ranges.cagrMax,
    store.ranges.cagrStep,
    store.selected.target,
    store.selected.years,
    store.selected.cagr,
    store.contribution.startCapital,
    store.contribution.amount,
    store.contribution.frequency,
    store.contribution.mode,
    store.contribution.years,
    store.monteCarlo.enabled,
    store.monteCarlo.volatility,
    store.monteCarlo.runs
  ],
  () => {
    store.refresh()
  }
)

onMounted(() => {
  // Initialize theme
  initializeTheme()

  // Run initial simulation
  store.refresh()

  // Add loaded class for animations
  window.requestAnimationFrame(() => {
    document.body.classList.add('loaded')
  })
})
</script>

<template>
  <div class="app">
    <!-- GitHub ribbon -->
    <GitHubRibbon />

    <!-- Currency and theme toggles -->
    <CurrencyToggle />
    <ThemeToggle />

    <!-- Header -->
    <header class="app-header" data-animate>
      <div class="header-content">
        <span class="eyebrow">ROI Headroom Studio</span>
        <h1>Design your runway for monthly income</h1>
      </div>
    </header>

    <!-- Overview: Stats + Chart side by side (priority zone) -->
    <section class="grid two overview">
      <MetricsSection />
      <BalanceChart />
    </section>

    <!-- Range builder and Scenario inputs -->
    <section class="grid two">
      <RangeBuilder />
      <ScenarioInputs />
    </section>

    <!-- Contribution plan (full width) -->
    <section class="contribution-section">
      <ContributionPlan />
    </section>

    <!-- Footer -->
    <div class="footer-note" data-animate>
      This is a simplified model for exploration only. Real markets include volatility,
      taxes, fees, and sequence risk.
    </div>

    <!-- Tour trigger button -->
    <TourTrigger />
  </div>
</template>
