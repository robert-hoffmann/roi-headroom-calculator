<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useCalculatorStore } from './stores/calculatorStore'
import { useTheme } from './composables/useTheme'

// Components
import ThemeToggle from './components/ui/ThemeToggle.vue'
import HeroSection from './components/HeroSection.vue'
import RangeBuilder from './components/RangeBuilder.vue'
import ScenarioInputs from './components/ScenarioInputs.vue'
import ContributionPlan from './components/ContributionPlan.vue'
import ScenarioOutput from './components/ScenarioOutput.vue'
import ScenarioMatrix from './components/ScenarioMatrix.vue'
import RequiredChart from './components/RequiredChart.vue'
import BalanceChart from './components/BalanceChart.vue'
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
    <!-- Theme toggle button -->
    <ThemeToggle />

    <!-- Hero section with stats -->
    <HeroSection />

    <!-- Range builder and Scenario inputs -->
    <section class="grid two">
      <RangeBuilder />
      <ScenarioInputs />
    </section>

    <!-- Contribution plan and Scenario output -->
    <section class="grid two">
      <ContributionPlan />
      <ScenarioOutput />
    </section>

    <!-- Scenario matrix -->
    <ScenarioMatrix />

    <!-- Charts -->
    <section class="grid two">
      <RequiredChart />
      <BalanceChart />
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
