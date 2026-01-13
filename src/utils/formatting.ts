/**
 * Formatting utilities for displaying values
 */

/**
 * Formats a value as currency with EUR suffix
 * Uses K/M abbreviations for large numbers
 *
 * @param value - Numeric value to format
 * @returns Formatted currency string
 */
export function formatCurrency(value: number): string {
  if (!Number.isFinite(value)) {
    return 'n/a'
  }
  const abs = Math.abs(value)
  const sign = value < 0 ? '-' : ''
  if (abs >= 1000000) {
    return sign + (abs / 1000000).toFixed(2) + 'M EUR'
  }
  if (abs >= 1000) {
    return sign + (abs / 1000).toFixed(1) + 'k EUR'
  }
  return sign + Math.round(abs) + ' EUR'
}

/**
 * Formats a value with K/M abbreviation
 *
 * @param value - Numeric value to format
 * @returns Abbreviated number string
 */
export function formatShort(value: number): string {
  if (!Number.isFinite(value)) {
    return 'n/a'
  }
  if (Math.abs(value) >= 1000000) {
    return (value / 1000000).toFixed(2) + 'M'
  }
  if (Math.abs(value) >= 1000) {
    return (value / 1000).toFixed(1) + 'k'
  }
  return Math.round(value).toString()
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
