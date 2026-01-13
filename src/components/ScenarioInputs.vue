<script setup lang="ts">
import { useCalculatorStore } from '../stores/calculatorStore'
import RangeInput from './ui/RangeInput.vue'

const store = useCalculatorStore()
</script>

<template>
  <div class="panel" data-animate>
    <h2>Scenario inputs</h2>
    <p class="subhead">Pick the scenario you want to explore right now.</p>
    <div class="control-grid">
      <RangeInput
        v-model="store.selected.target"
        :min="store.ranges.targetMin"
        :max="store.ranges.targetMax"
        :step="store.ranges.targetStep"
        :label="`Monthly withdrawal target (${store.currency})`"
      />

      <RangeInput
        v-model="store.selected.years"
        :min="store.ranges.yearsMin"
        :max="store.ranges.yearsMax"
        :step="store.ranges.yearsStep"
        label="Headroom years"
      />

      <RangeInput
        v-model="store.selected.cagr"
        :min="store.ranges.cagrMin"
        :max="store.ranges.cagrMax"
        :step="store.ranges.cagrStep"
        label="CAGR target (%)"
      />
    </div>
  </div>
</template>
