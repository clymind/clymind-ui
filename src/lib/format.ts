/**
 * Numeric formatting utilities for consistent display of metrics across the application.
 * Ensures that all numeric values (hours, metrics) are displayed with the same rules.
 */

/**
 * formatNumber: Formats a number with up to 2 decimal places, intelligently omitting trailing zeros
 *
 * Formatting rules:
 * - If both decimals are zero, display as integer (3.00 → "3")
 * - If only second decimal is zero, display one decimal (3.10 → "3.1")
 * - Otherwise display two decimals (3.12 → "3.12")
 *
 * @param n - Number to format
 * @returns Formatted string representation
 *
 * @example
 * formatNumber(3) // "3"
 * formatNumber(3.1) // "3.1"
 * formatNumber(3.12) // "3.12"
 * formatNumber(3.10) // "3.1"
 * formatNumber(3.00) // "3"
 */
export function formatNumber(n: number): string {
  const s = n.toFixed(2);
  if (s.endsWith(".00")) return s.slice(0, s.indexOf('.'));
  if (s.endsWith("0")) return s.slice(0, s.length - 1);
  return s;
}

/**
 * formatCompact: Abbreviates large numbers using k (thousands) and M (millions)
 *
 * Rules:
 * - >= 1,000,000 → divide by 1,000,000 and append 'M'
 * - >= 1,000 → divide by 1,000 and append 'k'
 * - otherwise → use formatNumber
 */
export function formatCompact(n: number): string {
  const sign = n < 0 ? -1 : 1;
  const abs = Math.abs(n);
  if (abs >= 1_000_000) {
    return `${formatNumber((abs / 1_000_000) * sign)}M`;
  }
  if (abs >= 1_000) {
    return `${formatNumber((abs / 1_000) * sign)}k`;
  }
  return formatNumber(n);
}

/**
 * formatHoursWithSuffix: Convenience wrapper that appends " h" (hours) to a formatted number
 *
 * This is a specialized version of formatNumber() for metrics representing hours.
 * It ensures consistent presentation of hour-based metrics throughout the application.
 *
 * @param n - Number of hours to format
 * @returns Formatted string with " h" suffix
 *
 * @example
 * formatHoursWithSuffix(7.5) // "7.5 h"
 * formatHoursWithSuffix(2) // "2 h"
 * formatHoursWithSuffix(2.30) // "2.3 h"
 */
export function formatHoursWithSuffix(n: number): string {
  return `${formatCompact(n)} h`;
}
