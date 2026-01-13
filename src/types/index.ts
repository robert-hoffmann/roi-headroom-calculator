// Range configuration for parameter bounds
export interface RangeConfig {
  targetMin: number
  targetMax: number
  targetStep: number
  yearsMin: number
  yearsMax: number
  yearsStep: number
  cagrMin: number
  cagrMax: number
  cagrStep: number
}

// Currently selected scenario parameters
export interface SelectedScenario {
  target: number
  years: number
  cagr: number
}

// Monte Carlo simulation configuration
export interface MonteCarloConfig {
  enabled: boolean
  volatility: number
  runs: number
  seed: number
}

// Contribution settings
export interface ContributionConfig {
  startCapital: number
  amount: number
  frequency: 'monthly' | 'yearly'
  mode: 'auto' | 'fixed'
  years: number
}

// Simulation result data
export interface SimulationResult {
  labels: string[]
  accLine: (number | null)[]
  withdrawLine: (number | null)[]
  p10: (number | null)[]
  p50: (number | null)[]
  p90: (number | null)[]
  monthsAccum: number
  monthsTotal: number
  endBalance: number
  ruinMonth: number | null
  autoStatus: 'reachable' | 'unreachable' | 'overfunded'
}

// CAGR solver result
export interface CagrResult {
  cagr: number
  status: 'normal' | 'overfunded' | 'insufficient'
}

// Tour step configuration
export interface TourStep {
  element: string
  popover: {
    title: string
    description: string
  }
  tts: string
}

// Tour state
export interface TourState {
  isSpeaking: boolean
  isPaused: boolean
  currentUtterance: SpeechSynthesisUtterance | null
  ttsSupported: boolean
}

// Chart color palette
export interface ChartPalette {
  primary: string
  secondary: string
  tertiary: string
  quaternary: string
  grid: string
  text: string
}

// Matrix cell data
export interface MatrixCell {
  target: number
  years: number
  requiredCapital: number
}

// Matrix bounds for color scaling
export interface MatrixBounds {
  min: number
  max: number
}
