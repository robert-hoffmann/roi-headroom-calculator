# ROI Headroom Calculator

A financial planning tool to calculate how much capital you need to sustain monthly withdrawals over a specified time horizon, given different growth rate assumptions.

**[Live Demo](https://robert-hoffmann.github.io/roi-headroom-calculator/)**

## Features

- **Required Capital Calculator** - Determine starting capital needed for your withdrawal targets using present value of annuity formulas
- **Accumulation Phase Planning** - Simulate contributions with fixed duration, target-based, or indefinite modes
- **Monte Carlo Simulations** - Visualize probability bands with configurable volatility and simulation runs
- **Interactive Charts** - Real-time Chart.js visualizations of balance paths and capital requirements
- **Scenario Matrix** - Compare capital requirements across different CAGR and time horizon combinations
- **Dark/Light Theme** - Full theme support with persistence
- **Guided Tour** - Interactive walkthrough with text-to-speech narration

## Tech Stack

- **Vue 3** - Composition API with `<script setup>`
- **TypeScript** - Full type safety
- **Vite** - Fast build tooling
- **Tailwind CSS** - Utility-first styling
- **Chart.js** - Interactive data visualization
- **Pinia** - State management with localStorage persistence
- **driver.js** - Interactive product tours

## Quick Start

```bash
# Clone the repository
git clone https://github.com/robert-hoffmann/roi-headroom-calculator.git
cd roi-headroom-calculator

# Install dependencies
npm install

# Start development server
npm run dev
```

## Build

```bash
# Production build
npm run build

# Preview production build
npm run preview
```

## Usage

1. **Set Your Ranges** - Configure the min/max values for monthly targets, time horizons, and expected CAGR
2. **Select a Scenario** - Choose specific values to analyze
3. **Add Contributions** (optional) - Set up an accumulation phase with recurring contributions
4. **Enable Monte Carlo** (optional) - Add volatility to see probability-weighted outcomes
5. **Analyze Results** - View required capital, time to target, and balance projections

## How It Works

The calculator uses the **present value of annuity formula** to determine how much capital is needed:

```
PV = PMT × (1 - (1 + r)^(-n)) / r
```

Where:
- `PV` = Present Value (required capital)
- `PMT` = Monthly withdrawal amount
- `r` = Monthly interest rate (derived from annual CAGR)
- `n` = Number of months

Monte Carlo simulations use a **log-normal return model** with seeded random number generation for reproducible results.

## License

[MIT](LICENSE)
