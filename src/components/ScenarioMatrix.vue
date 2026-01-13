<script setup lang="ts">
import { useCalculatorStore } from '../stores/calculatorStore'
import { useTheme } from '../composables/useTheme'

const store = useCalculatorStore()
const { currentTheme } = useTheme()

function cellStyle(target: number, year: number) {
  const value = store.requiredCapital(target, year, store.selected.cagr)
  const min = store.matrixBounds.min
  const max = store.matrixBounds.max
  const t = (value - min) / (max - min || 1)

  if (currentTheme.value === 'dark') {
    const hue = 130 - t * 90
    const light = 18 + t * 16
    const sat = 40 + t * 25
    return { background: `hsl(${hue}, ${sat}%, ${light}%)` }
  } else {
    const hue = 130 - t * 90
    const light = 92 - t * 30
    return { background: `hsl(${hue}, 65%, ${light}%)` }
  }
}
</script>

<template>
  <section class="panel" data-animate>
    <h2>Scenario matrix</h2>
    <p class="subhead">
      Required starting capital by monthly target and headroom years (selected CAGR:
      {{ store.selected.cagr }}%).
    </p>
    <div class="matrix-wrap">
      <table class="matrix-table">
        <thead>
          <tr>
            <th>Monthly target</th>
            <th v-for="year in store.yearsList" :key="'col-' + year">{{ year }}y</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="target in store.targets" :key="'row-' + target">
            <th>{{ store.format.short(target) }} / mo</th>
            <td
              v-for="year in store.yearsList"
              :key="'cell-' + target + '-' + year"
              :style="cellStyle(target, year)"
              :class="{
                'matrix-selected':
                  target === store.selected.target && year === store.selected.years
              }"
            >
              <div class="matrix-cell">
                <strong>{{
                  store.format.short(store.requiredCapital(target, year, store.selected.cagr))
                }}</strong>
                <span>start</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
