/**
 * Financial calculation utilities for ROI headroom calculations
 */

import type { CagrResult } from '../types'

/**
 * Converts annual rate to monthly compounding rate
 * @param annualRate - Annual rate as decimal (e.g., 0.10 for 10%)
 * @returns Monthly rate as decimal
 */
export function annualToMonthlyRate(annualRate: number): number {
  const safe = Math.max(-0.95, annualRate)
  return Math.pow(1 + safe, 1 / 12) - 1
}

/**
 * Calculates required starting capital using present value of annuity formula
 * PV = PMT × (1 - (1 + r)^(-n)) / r
 *
 * @param monthlyWithdrawal - Monthly withdrawal amount
 * @param years - Number of years for withdrawals
 * @param cagrPercent - Annual growth rate as percentage (e.g., 10 for 10%)
 * @returns Required starting capital
 */
export function requiredCapital(
  monthlyWithdrawal: number,
  years: number,
  cagrPercent: number
): number {
  const months = Math.max(0, Math.round(years * 12))
  if (months === 0 || monthlyWithdrawal <= 0) {
    return 0
  }
  const monthlyRate = annualToMonthlyRate(cagrPercent / 100)
  if (Math.abs(monthlyRate) < 1e-9) {
    return monthlyWithdrawal * months
  }
  return (monthlyWithdrawal * (1 - Math.pow(1 + monthlyRate, -months))) / monthlyRate
}

/**
 * Binary search to find required CAGR for given starting capital
 *
 * @param startCapital - Available starting capital
 * @param monthlyWithdrawal - Monthly withdrawal amount
 * @param years - Number of years for withdrawals
 * @returns Object with CAGR value and status
 */
export function solveCagr(
  startCapital: number,
  monthlyWithdrawal: number,
  years: number
): CagrResult {
  if (startCapital <= 0 || monthlyWithdrawal <= 0 || years <= 0) {
    return { cagr: 0, status: 'insufficient' }
  }

  const pvAtZero = requiredCapital(monthlyWithdrawal, years, 0)
  if (startCapital >= pvAtZero) {
    return { cagr: 0, status: 'overfunded' }
  }

  const maxAnnual = 0.35 // 35% max CAGR
  const pvAtMax = requiredCapital(monthlyWithdrawal, years, maxAnnual * 100)
  if (startCapital < pvAtMax) {
    return { cagr: maxAnnual * 100, status: 'insufficient' }
  }

  // Binary search for the required CAGR
  let low = 0
  let high = maxAnnual
  for (let i = 0; i < 40; i++) {
    const mid = (low + high) / 2
    const pv = requiredCapital(monthlyWithdrawal, years, mid * 100)
    if (pv > startCapital) {
      low = mid
    } else {
      high = mid
    }
  }

  return { cagr: ((low + high) / 2) * 100, status: 'normal' }
}

/**
 * Calculates months needed to reach target capital with contributions
 *
 * @param startCapital - Starting capital
 * @param contributionMonthly - Monthly contribution amount
 * @param cagrPercent - Annual growth rate as percentage
 * @param targetCapital - Target capital to reach
 * @returns Number of months needed (can be Infinity)
 */
export function monthsToReach(
  startCapital: number,
  contributionMonthly: number,
  cagrPercent: number,
  targetCapital: number
): number {
  if (targetCapital <= startCapital) {
    return 0
  }

  const monthlyRate = annualToMonthlyRate(cagrPercent / 100)

  if (Math.abs(monthlyRate) < 1e-9) {
    if (contributionMonthly <= 0) {
      return Infinity
    }
    return (targetCapital - startCapital) / contributionMonthly
  }

  if (contributionMonthly <= 0 && startCapital <= 0) {
    return Infinity
  }

  const numerator = targetCapital * monthlyRate + contributionMonthly
  const denominator = startCapital * monthlyRate + contributionMonthly

  if (numerator <= 0 || denominator <= 0) {
    return Infinity
  }

  const months = Math.log(numerator / denominator) / Math.log(1 + monthlyRate)
  return months
}

/**
 * Creates a range of values from min to max with given step
 *
 * @param min - Minimum value
 * @param max - Maximum value
 * @param step - Step size
 * @returns Array of values
 */
export function makeRange(min: number, max: number, step: number): number[] {
  const cleanStep = step > 0 ? step : 1
  const start = Number.isFinite(min) ? min : 0
  const end = Number.isFinite(max) ? max : start
  const list: number[] = []
  const count = Math.floor((end - start) / cleanStep) + 1
  for (let i = 0; i < count; i++) {
    const value = start + cleanStep * i
    list.push(Number(value.toFixed(6)))
  }
  return list
}

/**
 * Snaps a value to the nearest step within bounds
 *
 * @param value - Value to snap
 * @param min - Minimum bound
 * @param max - Maximum bound
 * @param step - Step size
 * @returns Snapped value
 */
export function snap(value: number, min: number, max: number, step: number): number {
  const clamped = Math.min(max, Math.max(min, value))
  if (!step) {
    return clamped
  }
  const snapped = min + Math.round((clamped - min) / step) * step
  return Number(snapped.toFixed(6))
}
