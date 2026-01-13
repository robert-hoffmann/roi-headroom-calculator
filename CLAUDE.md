# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A **Vue 3 + TypeScript** application for calculating ROI (Return on Investment) headroom scenarios. Built with Vite, Pinia state management, and Tailwind CSS v4.

**Key capabilities:**
- Calculate required starting capital for monthly withdrawal targets
- Simulate accumulation phases with recurring contributions
- Visualize balance paths with deterministic and Monte Carlo simulations
- Generate scenario matrices showing capital requirements across different parameters
- Interactive charts with Chart.js showing required capital vs CAGR and balance over time
- Dark/light theme with system preference detection
- Interactive onboarding tour with Text-to-Speech
- State persistence across sessions

## Architecture

### Directory Structure

```
roi-headroom-calculator/
├── src/
│   ├── main.ts                 # App entry, Pinia setup
│   ├── App.vue                 # Root layout + reactive watchers
│   ├── components/             # Vue SFCs (6 main + 4 UI helpers)
│   ├── stores/                 # Pinia state (calculatorStore.ts)
│   ├── composables/            # Reusable logic (theme, charts, tour)
│   ├── utils/                  # Pure functions (calculations, simulation)
│   ├── types/                  # TypeScript interfaces
│   └── assets/styles/          # Tailwind + design tokens
├── index.html                  # Vite entry template
├── vite.config.ts              # Build configuration
├── tsconfig.*.json             # TypeScript configs
└── package.json                # Dependencies & scripts
```

### Component Hierarchy

**Main components:**
- `RangeBuilder.vue` - Configure min/max/step for targets, years, CAGR
- `ScenarioInputs.vue` - Select specific scenario with sliders
- `ContributionPlan.vue` - Configure accumulation phase inputs
- `MetricsSection.vue` - Display calculated metrics (StatCard grid)
- `BalanceChart.vue` - Chart.js visualization of balance paths
- `TourTrigger.vue` - Launch interactive tour button

**UI components:**
- `RangeInput.vue` - Reusable range slider with label
- `StatCard.vue` - Metric display card
- `MonteCarloSettings.vue` - MC simulation controls
- `ThemeToggle.vue` - Dark/light mode switcher

### State Management (Pinia)

The central store (`src/stores/calculatorStore.ts`) manages:

**Core state:**
- `ranges` - Min/max/step for targets, years, CAGR
- `selected` - Current scenario parameters
- `contribution` - Start capital, amount, frequency, mode
- `monteCarlo` - Volatility simulation settings
- `simulation` - Output data for charts and metrics
- `currentTheme` - 'light' | 'dark'

**Computed getters:**
- `targets`, `yearsList`, `cagrList` - Generated arrays from ranges
- `requiredStart`, `totalWithdrawals` - Core calculations
- `requiredCagrText`, `cagrStatus` - CAGR solver results
- `chartPalette` - Theme-aware chart colors

**Actions:**
- `sanitizeInputs()` - Clamp values to valid ranges
- `runSimulation()` - Execute Monte Carlo or deterministic sim
- `refresh()` - Full recalculation pipeline
- `toggleTheme()` - Switch between light/dark

**Persistence:** State persisted to localStorage via `pinia-plugin-persistedstate`

### Composables

- `useTheme.ts` - Theme state management, system preference detection
- `useChartConfig.ts` - Chart.js theming and configuration
- `useTour.ts` - driver.js tour with TTS narration

### Utilities

- `calculations.ts` - Financial math (requiredCapital, solveCagr, monthsToReach)
- `simulation.ts` - Monte Carlo engine, accumulation/withdrawal phases
- `formatting.ts` - Number and currency formatters
- `random.ts` - Seeded RNG and Box-Muller transform

## Development Workflow

### Prerequisites

Node.js 18+

### Commands

```bash
npm install          # Install dependencies
npm run dev          # Vite dev server with HMR
npm run build        # Type-check + production build
npm run preview      # Preview production build
```

### Dependencies

**Runtime:** vue, pinia, pinia-plugin-persistedstate, chart.js, tailwindcss, @tailwindcss/vite, @vueuse/core, driver.js

**Dev:** vite, typescript, vue-tsc, @vitejs/plugin-vue, @vue/tsconfig

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/stores/calculatorStore.ts` | Centralized state, computed values, actions |
| `src/utils/calculations.ts` | Financial math (requiredCapital, solveCagr, monthsToReach) |
| `src/utils/simulation.ts` | Monte Carlo engine, accumulation/withdrawal phases |
| `src/composables/useTheme.ts` | Theme state, toggle, system preference detection |
| `src/composables/useTour.ts` | driver.js tour with TTS narration |
| `src/assets/styles/design-tokens.css` | CSS custom properties for light/dark themes |
| `src/types/index.ts` | TypeScript interfaces for all data structures |

## Financial Calculations

Core formulas in `src/utils/calculations.ts`:

**Present Value of Annuity:**
```javascript
PV = PMT × (1 - (1 + r)^(-n)) / r
```
Where PMT is monthly withdrawal, r is monthly rate, n is number of months.

**Monte Carlo Returns:**
```javascript
growth = exp(meanLog + sigma × Z)
```
Where Z is a standard normal random variable (Box-Muller transform).

**CAGR Solver:** Binary search (40 iterations) to find required CAGR for given starting capital.

**Monthly Rate Conversion:** `annualToMonthlyRate()` converts annual CAGR to monthly compounding rate.

## Design System

### Tailwind CSS v4

Uses CSS custom properties for theming. Configuration in `vite.config.ts` with `@tailwindcss/vite` plugin.

### Typography

- Headings: Fraunces (serif)
- Body: Space Grotesk (sans-serif)

### Color Tokens

Defined in `src/assets/styles/design-tokens.css`:

- `--color-surface-*` - Background layers (base, raised, sunken)
- `--color-text-*` - Text hierarchy (primary, secondary, tertiary)
- `--color-interactive-*` - Buttons and links (base, hover, active)
- `--color-accent-*` - Chart colors and highlights

### Theme Toggle

`[data-theme="dark"]` selector overrides all tokens. Theme preference stored in localStorage.

## Common Tasks

### Add new input parameter

1. Add to store state + interface in `src/types/index.ts`
2. Create/update component with `v-model` binding
3. Add to persistence paths array in store if needed
4. Update relevant calculations in `src/utils/`

### Add new component

1. Create SFC in `src/components/`
2. Import in parent component
3. Use store via `useCalculatorStore()`

### Modify calculations

1. Update `src/utils/calculations.ts` or `src/utils/simulation.ts`
2. TypeScript will catch interface mismatches

### Modify theme

1. Edit `src/assets/styles/design-tokens.css`
2. Add both light (`:root`) and dark (`[data-theme="dark"]`) variants

### Add new chart

1. Create component using `useChartConfig` composable
2. Use `chartPalette` from store for theme-aware colors
3. Wrap Chart.js instance with `markRaw()` for performance

## Edge Cases Handled

- **Zero/negative inputs:** Sanitized in store's `sanitizeInputs()`
- **Infinite accumulation time:** Capped at 600 months with "unreachable" status
- **Division by zero:** Handled in `requiredCapital()` for 0% CAGR
- **Overfunded scenarios:** Detected in `solveCagr()` when starting capital exceeds requirements
- **Monte Carlo reproducibility:** Seeded RNG ensures consistent results across runs
