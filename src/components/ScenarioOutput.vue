<script setup lang="ts">
import { useCalculatorStore } from '../stores/calculatorStore'

const store = useCalculatorStore()
</script>

<template>
  <div class="panel" data-animate>
    <h2>Scenario output</h2>
    <p class="subhead">Quick numbers for the current scenario.</p>
    <ul class="metrics-list">
      <li>
        <span>Total withdrawals over horizon</span>
        <strong>{{ store.format.currency(store.totalWithdrawals) }}</strong>
      </li>
      <li>
        <span>Required start at {{ store.selected.cagr }}% CAGR</span>
        <strong>{{ store.format.currency(store.requiredStart) }}</strong>
      </li>
      <li>
        <span>Required CAGR for your start</span>
        <strong>{{ store.requiredCagrText }}</strong>
      </li>
      <li>
        <span>Auto time to required start</span>
        <strong>{{ store.autoTimeText }}</strong>
      </li>
      <li>
        <span>Deterministic runway</span>
        <strong>{{ store.runwayText }}</strong>
      </li>
    </ul>
  </div>
</template>
