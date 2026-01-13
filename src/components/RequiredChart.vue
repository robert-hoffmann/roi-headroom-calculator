<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, markRaw } from 'vue'
import { Chart, registerables, type ChartConfiguration } from 'chart.js'
import { useCalculatorStore } from '../stores/calculatorStore'
import { useChartConfig } from '../composables/useChartConfig'

Chart.register(...registerables)

const store = useCalculatorStore()
const { chartPalette, getChartColors, getBaseChartOptions, initializeChartDefaults } =
  useChartConfig()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

function updateChart() {
  if (!chartInstance) return

  const colors = getChartColors()
  const palette = chartPalette.value
  const labels = store.cagrList.map((cagr) => cagr + '%')

  const datasets = store.targets.map((target, index) => ({
    label: store.format.short(target) + ' / mo',
    data: store.cagrList.map((cagr) =>
      store.requiredCapital(target, store.selected.years, cagr)
    ),
    borderColor: palette[index % palette.length],
    backgroundColor: palette[index % palette.length],
    borderWidth: 2,
    tension: 0.35,
    pointRadius: 3,
    pointBackgroundColor: colors.pointBackground,
    pointBorderWidth: 1.5
  }))

  chartInstance.data.labels = labels
  chartInstance.data.datasets = datasets

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
        x: { title: { display: true, text: 'CAGR (%)' } },
        y: { title: { display: true, text: 'Required start (EUR)' } }
      }
    }
  }

  chartInstance = markRaw(new Chart(canvasRef.value, config))
  updateChart()
}

// Watch for changes that require chart update
watch(
  () => [
    store.targets,
    store.cagrList,
    store.selected.years,
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
    <h2>Required start vs CAGR</h2>
    <p class="subhead">
      Lines show how much starting capital you need as CAGR changes (for
      {{ store.selected.years }}y).
    </p>
    <div class="chart-wrap">
      <canvas ref="canvasRef"></canvas>
    </div>
  </div>
</template>
