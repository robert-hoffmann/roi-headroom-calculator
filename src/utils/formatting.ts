/**
 * Formatting utilities for displaying values
 */

import type { Currency } from '../types'

/** Currency symbols map */
const CURRENCY_SYMBOLS: Record<Currency, string> = {
  EUR: '\u20AC',
  USD: '$'
}

/**
 * Formats a value as currency with symbol prefix
 * Uses K/M abbreviations for large numbers
 *
 * @param value - Numeric value to format
 * @param currency - Currency type (EUR or USD)
 * @returns Formatted currency string (e.g., "€1.5k", "$2.34M")
 */
export function formatCurrency(value: number, currency: Currency = 'EUR'): string {
  if (!Number.isFinite(value)) {
    return 'n/a'
  }
  const symbol = CURRENCY_SYMBOLS[currency]
  const abs = Math.abs(value)
  const sign = value < 0 ? '-' : ''
  if (abs >= 1000000) {
    return `${sign}${symbol}${(abs / 1000000).toFixed(2)}M`
  }
  if (abs >= 1000) {
    return `${sign}${symbol}${(abs / 1000).toFixed(1)}k`
  }
  return `${sign}${symbol}${Math.round(abs)}`
}

/**
 * Formats a value with K/M abbreviation and optional currency symbol
 *
 * @param value - Numeric value to format
 * @param currency - Optional currency type for symbol prefix
 * @returns Abbreviated number string (e.g., "€1.5k" or "1.5k")
 */
export function formatShort(value: number, currency?: Currency): string {
  if (!Number.isFinite(value)) {
    return 'n/a'
  }
  const symbol = currency ? CURRENCY_SYMBOLS[currency] : ''
  if (Math.abs(value) >= 1000000) {
    return `${symbol}${(value / 1000000).toFixed(2)}M`
  }
  if (Math.abs(value) >= 1000) {
    return `${symbol}${(value / 1000).toFixed(1)}k`
  }
  return `${symbol}${Math.round(value)}`
}

/**
 * Formats a value as percentage
 *
 * @param value - Numeric value (already in percentage form)
 * @returns Formatted percentage string
 */
export function formatPct(value: number): string {
  if (!Number.isFinite(value)) {
    return 'n/a'
  }
  return value.toFixed(1) + '%'
}

/**
 * Formats months as years/months string
 *
 * @param months - Number of months
 * @returns Formatted time string (e.g., "2.5y" or "8 mo")
 */
export function formatYears(months: number): string {
  if (!Number.isFinite(months)) {
    return 'n/a'
  }
  const years = months / 12
  if (years < 1) {
    return Math.round(months) + ' mo'
  }
  return years.toFixed(1) + 'y'
}
