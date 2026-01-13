/**
 * Random number generation utilities for Monte Carlo simulations
 */

/**
 * Creates a seeded random number generator using LCG algorithm
 * @param seed - Initial seed value
 * @returns A function that returns random numbers between 0 and 1
 */
export function seededRandom(seed: number): () => number {
  let t = seed >>> 0
  return function () {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Box-Muller transform for generating normally distributed random numbers
 * @param randomFn - A random number generator function (0-1)
 * @returns A normally distributed random number
 */
export function boxMuller(randomFn: () => number): number {
  let u = 0
  let v = 0
  while (u === 0) u = randomFn()
  while (v === 0) v = randomFn()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}
