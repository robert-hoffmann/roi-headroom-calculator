/**
 * Simulation utilities for building balance path simulations
 */

import type { SimulationResult, MonteCarloConfig } from '../types'
import { annualToMonthlyRate, monthsToReach, requiredCapital } from './calculations'
import { seededRandom, boxMuller } from './random'

export interface SimulationParams {
  startCapital: number
  contributionMonthly: number
  contributionMode: 'auto' | 'fixed'
  contributionYears: number
  selectedTarget: number
  selectedYears: number
  selectedCagr: number
  monteCarlo: MonteCarloConfig
}

/**
 * Builds a complete simulation with accumulation and withdrawal phases
 *
 * @param params - Simulation parameters
 * @returns Simulation result with balance paths and metrics
 */
export function buildSimulation(params: SimulationParams): SimulationResult {
  const {
    startCapital,
    contributionMonthly,
    contributionMode,
    contributionYears,
    selectedTarget,
    selectedYears,
    selectedCagr,
    monteCarlo
  } = params

  const monthlyRate = annualToMonthlyRate(selectedCagr / 100)
  const withdrawalMonths = Math.round(selectedYears * 12)
  const requiredStart = requiredCapital(selectedTarget, selectedYears, selectedCagr)
  const capMonths = 600 // Max 50 years

  let monthsAccum = 0
  let autoStatus: 'reachable' | 'unreachable' | 'overfunded' = 'reachable'

  if (contributionMode === 'fixed') {
    monthsAccum = Math.round(contributionYears * 12)
  } else {
    const monthsNeeded = monthsToReach(
      startCapital,
      contributionMonthly,
      selectedCagr,
      requiredStart
    )
    if (!Number.isFinite(monthsNeeded)) {
      monthsAccum = capMonths
      autoStatus = 'unreachable'
    } else if (monthsNeeded > capMonths) {
      monthsAccum = capMonths
      autoStatus = 'unreachable'
    } else if (monthsNeeded <= 0) {
      monthsAccum = 0
      autoStatus = 'overfunded'
    } else {
      monthsAccum = Math.max(0, Math.ceil(monthsNeeded))
    }
  }

  const totalMonths = monthsAccum + withdrawalMonths
  let balance = startCapital
  const balances: number[] = [balance]
  let ruinMonth: number | null = null

  // Run deterministic simulation
  for (let month = 1; month <= totalMonths; month++) {
    balance = balance * (1 + monthlyRate)
    if (month <= monthsAccum) {
      balance += contributionMonthly
    } else {
      balance -= selectedTarget
    }
    balances.push(balance)
    if (ruinMonth === null && balance < 0) {
      ruinMonth = month
    }
  }

  const accLine = balances.map((value, index) => (index <= monthsAccum ? value : null))
  const withdrawLine = balances.map((value, index) => (index >= monthsAccum ? value : null))
  const labels = balances.map((_, index) => (index / 12).toFixed(1))

  let p10: (number | null)[] = []
  let p50: (number | null)[] = []
  let p90: (number | null)[] = []

  // Run Monte Carlo simulation if enabled
  if (monteCarlo.enabled) {
    const runs = monteCarlo.runs
    const seed = monteCarlo.seed
    const randomFn = seededRandom(seed)
    const meanLog = Math.log(1 + selectedCagr / 100) / 12
    const sigma = monteCarlo.volatility / 100 / Math.sqrt(12)
    const buckets: number[][] = Array.from({ length: totalMonths + 1 }, () => [])

    for (let run = 0; run < runs; run++) {
      let mcBalance = startCapital
      buckets[0]!.push(mcBalance)

      for (let month = 1; month <= totalMonths; month++) {
        const z = boxMuller(randomFn)
        const growth = Math.exp(meanLog + sigma * z)
        mcBalance = mcBalance * growth

        if (month <= monthsAccum) {
          mcBalance += contributionMonthly
        } else {
          mcBalance -= selectedTarget
        }
        buckets[month]!.push(mcBalance)
      }
    }

    const percentile = (arr: number[], q: number): number => {
      const sorted = arr.slice().sort((a, b) => a - b)
      const idx = Math.floor((sorted.length - 1) * q)
      return sorted[idx] ?? 0
    }

    p10 = buckets.map((arr) => percentile(arr, 0.1))
    p50 = buckets.map((arr) => percentile(arr, 0.5))
    p90 = buckets.map((arr) => percentile(arr, 0.9))
  }

  return {
    labels,
    accLine,
    withdrawLine,
    p10,
    p50,
    p90,
    monthsAccum,
    monthsTotal: totalMonths,
    endBalance: balances[balances.length - 1] ?? 0,
    ruinMonth,
    autoStatus
  }
}
