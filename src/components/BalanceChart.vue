<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, markRaw } from 'vue'
import { Chart, registerables, type ChartConfiguration } from 'chart.js'
import { useCalculatorStore } from '../stores/calculatorStore'
import { useChartConfig } from '../composables/useChartConfig'
import MonteCarloSettings from './ui/MonteCarloSettings.vue'

Chart.register(...registerables)

const store = useCalculatorStore()
const { getChartColors, getBaseChartOptions, initializeChartDefaults } = useChartConfig()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

function updateChart() {
  if (!chartInstance) return

  const colors = getChartColors()
  const sim = store.simulation

  chartInstance.data.labels = sim.labels

  if (store.monteCarlo.enabled && sim.p50.length) {
    chartInstance.data.datasets = [
      {
        label: 'p10',
        data: sim.p10,
        borderColor: `rgba(${colors.interactiveRgb}, 0.35)`,
        backgroundColor: colors.interactiveSurface,
        borderWidth: 1,
        pointRadius: 0,
        fill: false
      },
      {
        label: 'p90',
        data: sim.p90,
        borderColor: `rgba(${colors.interactiveRgb}, 0.35)`,
        backgroundColor: colors.interactiveSelected,
        borderWidth: 1,
        pointRadius: 0,
        fill: '-1'
      },
      {
        label: 'Median',
        data: sim.p50,
        borderColor: colors.interactiveBase,
        backgroundColor: colors.interactiveBase,
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.3
      }
    ]
  } else {
    chartInstance.data.datasets = [
      {
        label: 'Accumulation',
        data: sim.accLine,
        borderColor: colors.accent1,
        backgroundColor: colors.accent1,
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.3,
        spanGaps: true
      },
      {
        label: 'Withdrawal',
        data: sim.withdrawLine,
        borderColor: colors.accent2,
        backgroundColor: colors.accent2,
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.3,
        spanGaps: true
      }
    ]
  }

  // Update scales (avoid spreading Chart.js internal objects)
  if (chartInstance.options.scales?.x) {
    chartInstance.options.scales.x.grid = { color: colors.gridColor }
    chartInstance.options.scales.x.ticks = { color: colors.tickColor }
  }
  if (chartInstance.options.scales?.y) {
    chartInstance.options.scales.y.grid = { color: colors.gridColor }
    chartInstance.options.scales.y.ticks = {
      color: colors.tickColor,
      callback: (value) => store.format.short(value as number)
    }
  }

  chartInstance.update()
}

function setupChart() {
  if (!canvasRef.value) return

  initializeChartDefaults()

  const config: ChartConfiguration = {
    type: 'line',
    data: { labels: [], datasets: [] },
    options: {
      ...getBaseChartOptions(),
      scales: {
        x: { title: { display: true, text: 'Accumulation/Withdrawal over time (years from start)' } },
        y: { title: { display: true, text: 'Balance (EUR)' } }
      }
    }
  }

  chartInstance = markRaw(new Chart(canvasRef.value, config))
  updateChart()
}

// Watch for changes that require chart update
watch(
  () => [
    store.simulation,
    store.monteCarlo.enabled,
    store.currentTheme
  ],
  () => {
    updateChart()
  },
  { deep: true }
)

onMounted(() => {
  setupChart()
})

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
})

// Expose update method for parent components
defineExpose({ updateChart })
</script>

<template>
  <div class="panel" data-animate>
    <div class="chart-header">
      <div>
        <h2>Balance path</h2>
      </div>
      <MonteCarloSettings />
    </div>
    <div class="chart-wrap">
      <canvas ref="canvasRef"></canvas>
    </div>
  </div>
</template>

<style scoped>
.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 8px;
}

.chart-header h2 {
  margin-bottom: 4px;
}

.chart-header .subhead {
  margin-bottom: 0;
}
</style>
