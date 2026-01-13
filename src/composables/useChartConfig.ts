import { computed } from 'vue'
import { Chart } from 'chart.js'
import { useTheme } from './useTheme'
import { useCalculatorStore } from '../stores/calculatorStore'

/**
 * Composable for Chart.js configuration and theme-aware colors
 */
export function useChartConfig() {
  const { getCSSVariable, currentTheme } = useTheme()
  const store = useCalculatorStore()

  const chartPalette = computed(() => store.chartPalette)

  /**
   * Initialize Chart.js defaults
   */
  function initializeChartDefaults() {
    Chart.defaults.font.family = '"Space Grotesk", "Segoe UI", sans-serif'
    Chart.defaults.color = getCSSVariable('--text-secondary') || '#3f3f35'
  }

  /**
   * Update chart theme colors
   */
  function updateChartTheme() {
    Chart.defaults.color = getCSSVariable('--text-secondary')
    Chart.defaults.borderColor = getCSSVariable('--border-base')
  }

  /**
   * Get grid and tick colors for charts
   */
  function getChartColors() {
    return {
      gridColor: getCSSVariable('--border-subtle'),
      tickColor: getCSSVariable('--text-secondary'),
      interactiveBase: getCSSVariable('--interactive-base'),
      interactiveRgb: getCSSVariable('--interactive-rgb'),
      interactiveSurface: getCSSVariable('--interactive-surface'),
      interactiveSelected: getCSSVariable('--interactive-selected'),
      pointBackground: currentTheme.value === 'dark' ? '#1c1c19' : '#fff'
    }
  }

  /**
   * Apply theme to a chart instance
   */
  function applyThemeToChart(chart: Chart | null) {
    if (!chart) return

    const colors = getChartColors()

    chart.options.scales = chart.options.scales || {}

    if (chart.options.scales.x) {
      chart.options.scales.x.grid = { color: colors.gridColor }
      chart.options.scales.x.ticks = {
        ...chart.options.scales.x.ticks,
        color: colors.tickColor
      }
    }

    if (chart.options.scales.y) {
      chart.options.scales.y.grid = { color: colors.gridColor }
      chart.options.scales.y.ticks = {
        ...chart.options.scales.y.ticks,
        color: colors.tickColor
      }
    }
  }

  /**
   * Common chart options factory
   */
  function getBaseChartOptions() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index' as const,
        intersect: false
      },
      plugins: {
        legend: {
          position: 'bottom' as const
        }
      }
    }
  }

  return {
    chartPalette,
    initializeChartDefaults,
    updateChartTheme,
    getChartColors,
    applyThemeToChart,
    getBaseChartOptions
  }
}
