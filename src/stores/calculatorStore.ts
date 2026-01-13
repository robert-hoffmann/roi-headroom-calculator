import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  RangeConfig,
  SelectedScenario,
  MonteCarloConfig,
  ContributionConfig,
  SimulationResult,
  MatrixBounds
} from '../types'
import { requiredCapital, solveCagr, makeRange, snap } from '../utils/calculations'
import { buildSimulation } from '../utils/simulation'
import { formatCurrency, formatShort, formatPct, formatYears } from '../utils/formatting'

export const useCalculatorStore = defineStore('calculator', () => {
  // === STATE ===

  const ranges = ref<RangeConfig>({
    targetMin: 1000,
    targetMax: 3000,
    targetStep: 500,
    yearsMin: 10,
    yearsMax: 20,
    yearsStep: 5,
    cagrMin: 5,
    cagrMax: 20,
    cagrStep: 5
  })

  const selected = ref<SelectedScenario>({
    target: 2000,
    years: 15,
    cagr: 10
  })

  const contribution = ref<ContributionConfig>({
    startCapital: 0,
    amount: 500,
    frequency: 'monthly',
    mode: 'stop',
    years: 5
  })

  const monteCarlo = ref<MonteCarloConfig>({
    enabled: false,
    volatility: 12,
    runs: 200,
    seed: 42
  })

  const simulation = ref<SimulationResult>({
    labels: [],
    accLine: [],
    withdrawLine: [],
    p10: [],
    p50: [],
    p90: [],
    monthsAccum: 0,
    monthsTotal: 0,
    endBalance: 0,
    ruinMonth: null,
    autoStatus: 'reachable'
  })

  const currentTheme = ref<'light' | 'dark'>('dark')

  // === GETTERS ===

  const targets = computed(() =>
    makeRange(ranges.value.targetMin, ranges.value.targetMax, ranges.value.targetStep)
  )

  const yearsList = computed(() =>
    makeRange(ranges.value.yearsMin, ranges.value.yearsMax, ranges.value.yearsStep)
  )

  const cagrList = computed(() =>
    makeRange(ranges.value.cagrMin, ranges.value.cagrMax, ranges.value.cagrStep)
  )

  const contributionMonthly = computed(() => {
    if (contribution.value.frequency === 'yearly') {
      return contribution.value.amount / 12
    }
    return contribution.value.amount
  })

  const requiredStart = computed(() =>
    requiredCapital(selected.value.target, selected.value.years, selected.value.cagr)
  )

  const totalWithdrawals = computed(() => selected.value.target * selected.value.years * 12)

  const requiredCagrResult = computed(() =>
    solveCagr(contribution.value.startCapital, selected.value.target, selected.value.years)
  )

  const requiredCagrText = computed(() => {
    const result = requiredCagrResult.value
    if (result.status === 'insufficient' && contribution.value.startCapital <= 0) {
      return 'n/a'
    }
    if (result.status === 'overfunded') {
      return '0% (overfunded)'
    }
    if (result.status === 'insufficient') {
      return '> ' + formatPct(result.cagr)
    }
    return formatPct(result.cagr)
  })

  const requiredCagrMeta = computed(() => {
    const result = requiredCagrResult.value

    if (result.status === 'insufficient' && contribution.value.startCapital <= 0) {
      return 'enter starting capital'
    }
    if (result.status === 'overfunded') {
      return 'overfunded at 0% growth'
    }
    return 'if withdrawals started today'
  })

  const cagrStatus = computed<'success' | 'warning' | 'normal'>(() => {
    const result = requiredCagrResult.value
    if (result.status === 'overfunded') return 'success'
    if (result.status === 'insufficient') return 'warning'
    if (result.cagr <= selected.value.cagr) return 'success'
    return 'warning'
  })

  const autoTimeText = computed(() => {
    if (contribution.value.mode === 'fixed') {
      return contribution.value.years + 'y (fixed)'
    }
    // Both 'stop' and 'continue' use auto-calculation
    if (simulation.value.autoStatus === 'unreachable') {
      return '> 50y (not reached)'
    }
    return formatYears(simulation.value.monthsAccum)
  })

  const runwayText = computed(() => {
    if (simulation.value.ruinMonth === null) {
      return 'survives full horizon'
    }
    return 'runs out in ' + formatYears(simulation.value.ruinMonth)
  })

  const matrixBounds = computed<MatrixBounds>(() => {
    const values: number[] = []
    for (const target of targets.value) {
      for (const year of yearsList.value) {
        values.push(requiredCapital(target, year, selected.value.cagr))
      }
    }
    if (!values.length) {
      return { min: 0, max: 1 }
    }
    return {
      min: Math.min(...values),
      max: Math.max(...values)
    }
  })

  const chartPalette = computed(() => {
    if (currentTheme.value === 'dark') {
      return ['#5da4d4', '#72b3de', '#87c2e8', '#9cd0f0', '#b1ddf5', '#c6e9fa']
    }
    return ['#3d7ea6', '#5a92b5', '#7aabca', '#9ac4df', '#baddf4', '#d5ebf9']
  })

  // === ACTIONS ===

  function sanitizeInputs() {
    const r = ranges.value
    const sanitize = (value: number, fallback: number) =>
      Number.isFinite(value) ? value : fallback

    r.targetMin = sanitize(r.targetMin, 0)
    r.targetMax = sanitize(r.targetMax, r.targetMin)
    r.targetStep = Math.max(1, Math.abs(sanitize(r.targetStep, 1)))
    if (r.targetMin > r.targetMax) {
      ;[r.targetMin, r.targetMax] = [r.targetMax, r.targetMin]
    }

    r.yearsMin = sanitize(r.yearsMin, 1)
    r.yearsMax = sanitize(r.yearsMax, r.yearsMin)
    r.yearsStep = Math.max(1, Math.abs(sanitize(r.yearsStep, 1)))
    if (r.yearsMin > r.yearsMax) {
      ;[r.yearsMin, r.yearsMax] = [r.yearsMax, r.yearsMin]
    }

    r.cagrMin = sanitize(r.cagrMin, 0)
    r.cagrMax = sanitize(r.cagrMax, r.cagrMin)
    r.cagrStep = Math.max(0.5, Math.abs(sanitize(r.cagrStep, 1)))
    if (r.cagrMin > r.cagrMax) {
      ;[r.cagrMin, r.cagrMax] = [r.cagrMax, r.cagrMin]
    }

    selected.value.target = snap(
      selected.value.target,
      r.targetMin,
      r.targetMax,
      r.targetStep
    )
    selected.value.years = snap(selected.value.years, r.yearsMin, r.yearsMax, r.yearsStep)
    selected.value.cagr = snap(selected.value.cagr, r.cagrMin, r.cagrMax, r.cagrStep)

    contribution.value.startCapital = Math.max(
      0,
      sanitize(contribution.value.startCapital, 0)
    )
    contribution.value.amount = Math.max(0, sanitize(contribution.value.amount, 0))
    contribution.value.years = Math.max(0, sanitize(contribution.value.years, 0))

    monteCarlo.value.volatility = Math.max(0, sanitize(monteCarlo.value.volatility, 0))
    monteCarlo.value.runs = Math.min(
      500,
      Math.max(50, Math.round(sanitize(monteCarlo.value.runs, 200)))
    )
  }

  function runSimulation() {
    simulation.value = buildSimulation({
      startCapital: contribution.value.startCapital,
      contributionMonthly: contributionMonthly.value,
      contributionMode: contribution.value.mode,
      contributionYears: contribution.value.years,
      selectedTarget: selected.value.target,
      selectedYears: selected.value.years,
      selectedCagr: selected.value.cagr,
      monteCarlo: monteCarlo.value
    })
  }

  function refresh() {
    sanitizeInputs()
    runSimulation()
  }

  function setTheme(theme: 'light' | 'dark') {
    currentTheme.value = theme
    document.documentElement.setAttribute('data-theme', theme)
  }

  function toggleTheme() {
    setTheme(currentTheme.value === 'dark' ? 'light' : 'dark')
  }

  function initializeTheme() {
    // Theme value is restored by pinia-plugin-persistedstate
    // We just need to apply it to the DOM
    document.documentElement.setAttribute('data-theme', currentTheme.value)
  }

  // Expose formatting utilities
  const format = {
    currency: formatCurrency,
    short: formatShort,
    pct: formatPct,
    years: formatYears
  }

  return {
    // State
    ranges,
    selected,
    contribution,
    monteCarlo,
    simulation,
    currentTheme,

    // Getters
    targets,
    yearsList,
    cagrList,
    contributionMonthly,
    requiredStart,
    totalWithdrawals,
    requiredCagrResult,
    requiredCagrText,
    requiredCagrMeta,
    cagrStatus,
    autoTimeText,
    runwayText,
    matrixBounds,
    chartPalette,

    // Actions
    sanitizeInputs,
    runSimulation,
    refresh,
    setTheme,
    toggleTheme,
    initializeTheme,

    // Utilities
    format,
    requiredCapital
  }
}, {
  persist: {
    key: 'roi-calculator-state',
    pick: ['ranges', 'selected', 'contribution', 'monteCarlo', 'currentTheme']
  }
})
