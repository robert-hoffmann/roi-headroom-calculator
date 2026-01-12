# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **single-file Vue.js application** for calculating ROI (Return on Investment) headroom scenarios. The application helps users determine how much capital they need to sustain monthly withdrawals over a specified time horizon given different CAGR (Compound Annual Growth Rate) assumptions.

**Key capabilities:**
- Calculate required starting capital for monthly withdrawal targets
- Simulate accumulation phases with recurring contributions
- Visualize balance paths with deterministic and Monte Carlo simulations
- Generate scenario matrices showing capital requirements across different parameters
- Interactive charts with Chart.js showing required capital vs CAGR and balance over time

## Architecture

### Single-File Application Structure

The entire application exists in `index.html` with three main sections:

1. **CSS Styles (lines 10-410)**: Custom CSS with design system variables, responsive grid layouts, and component styling
2. **HTML Template (lines 412-682)**: Vue.js template with data-binding using mustache syntax (`{{ }}`) and directives (`v-model`, `v-for`, `v-if`)
3. **JavaScript Application (lines 685-1268)**: Vue 3 application with Chart.js integration

### Core Components

**Data Model** (lines 692-738):
- `ranges`: Min/max/step values for monthly targets, years, and CAGR
- `selected`: Currently selected scenario parameters
- `startCapital`, `contributionAmount`, `contributionFrequency`, `contributionMode`: Contribution plan inputs
- `monteCarlo`: Volatility simulation settings
- `simulation`: Output data for balance paths and metrics
- `charts`: Chart.js instances

**Financial Calculations** (lines 808-926):
- `requiredCapital()`: Calculates starting capital needed using present value of annuity formula
- `solveCagr()`: Binary search to find required CAGR for given starting capital
- `monthsToReach()`: Calculates time to reach target capital with contributions
- `annualToMonthlyRate()`: Converts annual CAGR to monthly compounding rate

**Simulation Engine** (lines 943-1042):
- `buildSimulation()`: Runs deterministic simulation of accumulation and withdrawal phases
- Monte Carlo simulation (lines 994-1027): Generates probability bands using log-normal returns
- `seededRandom()` and `boxMuller()`: Seeded random number generation for reproducible simulations

**Chart Management** (lines 1096-1219):
- `setupCharts()`: Initializes two Chart.js instances
- `updateRequiredChart()`: Updates chart showing required capital across CAGR range
- `updateBalanceChart()`: Updates balance path chart with accumulation/withdrawal phases or Monte Carlo bands

### Key Formulas

**Present Value of Annuity** (line 877):
```javascript
PV = PMT × (1 - (1 + r)^(-n)) / r
```
Where PMT is monthly withdrawal, r is monthly rate, n is number of months.

**Monte Carlo Returns** (line 1007):
```javascript
growth = exp(meanLog + sigma × Z)
```
Where Z is a standard normal random variable (Box-Muller transform).

## Development Workflow

### Running the Application

This is a static HTML file with no build process required:

```bash
# Option 1: Open directly in browser
start index.html

# Option 2: Serve with a local HTTP server
npx serve .
# or
python -m http.server 8000
```

### Dependencies (CDN-loaded)

- **Vue.js 3.4.31**: `https://cdn.jsdelivr.net/npm/vue@3.4.31/dist/vue.global.prod.js`
- **Chart.js 4.4.1**: `https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js`
- **Google Fonts**: Space Grotesk (UI) and Fraunces (headings)

No package manager or build tools are used.

### Making Changes

**To modify calculations:**
1. Locate the relevant method in the `methods` object (lines 808-1226)
2. Test changes by opening in browser and using browser console
3. Use Vue DevTools browser extension to inspect reactive state

**To modify UI:**
1. Find the relevant section in the HTML template (lines 412-682)
2. Vue directives: `v-model` for two-way binding, `v-for` for loops, `v-if` for conditionals
3. Update computed properties if adding new derived values (lines 740-806)

**To modify styling:**
1. CSS custom properties are defined in `:root` (lines 11-24)
2. Component styles follow a utility-first approach with semantic class names
3. Responsive breakpoint at 980px (lines 397-409)

### Testing Calculations

Add test scenarios by modifying input values in the UI:

1. **Range Builder**: Adjust min/max/step for targets, years, and CAGR
2. **Scenario Inputs**: Select specific scenario to test
3. **Contribution Plan**: Test accumulation phase calculations
4. **Monte Carlo**: Enable to test probabilistic simulations

Verify calculations in browser console:
```javascript
// Access Vue instance
const app = document.getElementById('app').__vueParentComponent.ctx
app.requiredCapital(2000, 15, 10) // monthly target, years, CAGR%
```

## Important Implementation Details

### Reactive Data Flow

Vue's reactivity system automatically updates the UI when data changes. The `$watch` function (lines 1232-1256) triggers `refresh()` whenever any input changes, which:
1. Sanitizes inputs to valid ranges
2. Rebuilds simulation
3. Updates both charts

### Edge Cases Handled

- **Zero/negative inputs**: Sanitized in `sanitizeInputs()` (lines 821-855)
- **Infinite accumulation time**: Capped at 600 months with "unreachable" status (lines 958-965)
- **Division by zero**: Checked in `requiredCapital()` for zero CAGR (line 874)
- **Overfunded scenarios**: Detected in `solveCagr()` when starting capital exceeds requirements (line 884)

### Monte Carlo Simulation

Uses **seeded random number generator** (line 927) for reproducible results:
- Box-Muller transform generates normally distributed returns (line 936)
- Log-normal return model matches real-world asset behavior
- Percentiles (p10, p50, p90) calculated from 50-500 simulation runs

### Chart Configuration

Chart.js instances are wrapped with Vue's `markRaw()` (line 1098) to prevent Vue from making them reactive (performance optimization).

## Common Tasks

**Add new input parameter:**
1. Add property to `data()` return object
2. Add to template with `v-model` binding
3. Add to `$watch` array to trigger recalculation
4. Update relevant calculation methods

**Modify color scheme:**
Edit CSS custom properties in `:root` (lines 11-24):
```css
--accent: #e07a5f;      /* primary accent color */
--accent-2: #3d7ea6;    /* secondary accent */
--accent-3: #f2c14e;    /* tertiary accent */
```

**Add new chart:**
1. Add canvas ref in template: `<canvas ref="newChart"></canvas>`
2. Create Chart.js instance in `setupCharts()`
3. Add update method like `updateNewChart()`
4. Call in `refresh()` method

**Adjust calculation accuracy:**
Binary search iterations for CAGR solving: line 894 (`for (let i = 0; i < 40; i++)`)
Decimal precision for ranges: line 817 (`.toFixed(6)`)

## Design System

**Typography:**
- Headings: Fraunces (serif)
- Body: Space Grotesk (sans-serif)
- Size scale: 0.68rem to 3.1rem

**Color Palette:**
- Background: `--bg` (#f7f4ee) with gradient overlays
- Cards: `--card` (#ffffff) with shadow
- Accent colors: orange (#e07a5f), blue (#3d7ea6), yellow (#f2c14e)

**Spacing:**
- Card padding: 22-30px
- Gap spacing: 10-24px
- Border radius: 12-22px (--radius: 22px for main cards)

**Responsive Design:**
- Desktop: 2-column grid layout
- Mobile (<980px): Single column stack

## File Context

`session.txt` contains the original AI conversation that generated this application, including:
- Initial requirements for ROI headroom calculator
- Discussion of accumulation/decumulation phases
- Iterative refinement of UI and calculations
- Decision to use Vue.js + Chart.js with CDN approach
