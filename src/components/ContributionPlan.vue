<script setup lang="ts">
import { useCalculatorStore } from '../stores/calculatorStore'
import RangeInput from './ui/RangeInput.vue'

const store = useCalculatorStore()
</script>

<template>
  <div class="panel" data-animate>
    <h2>Contribution plan</h2>
    <p class="subhead">
      Start at any capital, then add recurring contributions to reach the required start
      faster.
    </p>
    <div class="control-grid">
      <!-- Starting capital -->
      <div class="control">
        <label>Starting capital (EUR)</label>
        <input type="number" v-model.number="store.contribution.startCapital" />
      </div>

      <!-- Contribution amount -->
      <RangeInput
        v-model="store.contribution.amount"
        :min="0"
        :max="5000"
        :step="50"
        label="Contribution amount (EUR)"
      />

      <!-- Contribution frequency -->
      <div class="control">
        <label>Contribution frequency</label>
        <select v-model="store.contribution.frequency">
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly (converted to monthly)</option>
        </select>
      </div>

      <!-- Contribution mode -->
      <div class="control">
        <label>Contribution mode</label>
        <div class="toggle-row">
          <label class="toggle">
            <input type="radio" value="fixed" v-model="store.contribution.mode" />
            Fixed years
          </label>
          <label class="toggle">
            <input type="radio" value="stop" v-model="store.contribution.mode" />
            Stop after start
          </label>
          <label class="toggle">
            <input type="radio" value="continue" v-model="store.contribution.mode" />
            Continue after start
          </label>
        </div>
      </div>

      <!-- Fixed contribution years (conditional) -->
      <RangeInput
        v-if="store.contribution.mode === 'fixed'"
        v-model="store.contribution.years"
        :min="0"
        :max="40"
        :step="1"
        label="Contribution years"
      />
    </div>
  </div>
</template>
