<script setup lang="ts">
import { useCalculatorStore } from '../stores/calculatorStore'

const store = useCalculatorStore()
</script>

<template>
  <div class="panel" data-animate>
    <h2>Range builder</h2>
    <p class="subhead">Edit min, max, and step values to reshape the scenario grid.</p>
    <div class="control-grid">
      <!-- Monthly target range -->
      <div class="control">
        <label>Monthly target range (EUR)</label>
        <div class="inline-row">
          <input type="number" v-model.number="store.ranges.targetMin" />
          <input type="number" v-model.number="store.ranges.targetMax" />
          <input type="number" v-model.number="store.ranges.targetStep" />
        </div>
        <div class="range-preview">
          <span v-for="value in store.targets" :key="'t' + value" class="chip">
            {{ store.format.short(value) }}
          </span>
        </div>
        <div class="hint">Min, max, step</div>
      </div>

      <!-- Headroom years range -->
      <div class="control">
        <label>Headroom years range</label>
        <div class="inline-row">
          <input type="number" v-model.number="store.ranges.yearsMin" />
          <input type="number" v-model.number="store.ranges.yearsMax" />
          <input type="number" v-model.number="store.ranges.yearsStep" />
        </div>
        <div class="range-preview">
          <span v-for="value in store.yearsList" :key="'y' + value" class="chip">
            {{ value }}y
          </span>
        </div>
        <div class="hint">Min, max, step</div>
      </div>

      <!-- CAGR range -->
      <div class="control">
        <label>CAGR range (%)</label>
        <div class="inline-row">
          <input type="number" v-model.number="store.ranges.cagrMin" />
          <input type="number" v-model.number="store.ranges.cagrMax" />
          <input type="number" v-model.number="store.ranges.cagrStep" />
        </div>
        <div class="range-preview">
          <span v-for="value in store.cagrList" :key="'c' + value" class="chip">
            {{ value }}%
          </span>
        </div>
        <div class="hint">Min, max, step</div>
      </div>
    </div>
  </div>
</template>
