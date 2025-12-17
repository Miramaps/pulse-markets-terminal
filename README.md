# Pulse Markets Terminal

A prediction markets trading terminal built with React, TypeScript, Vite, and TailwindCSS.

## What is it?

A web-based trading interface for prediction markets - markets where you bet on the outcome of real-world events (elections, crypto prices, sports, pop culture, etc).

### How Prediction Markets Work
- Each market asks a YES/NO question (e.g., "Will Bitcoin hit $150K before Feb 2025?")
- Prices range from $0.00 to $1.00 representing probability
- **YES at $0.65** means the market thinks there's a 65% chance it happens
- If you're right, you win $1 per share. If wrong, you lose your stake.

## Features

- **3-column layout** - New, Ending Soon, Resolved markets
- **YES/NO trading buttons** with circular progress rings or square style
- **Real-time price flashing** on updates
- **Fast buy** - Quick purchase with preset amounts
- **Watchlist** - Star markets & view in navbar popup
- **Market cards** showing: price change %, sentiment, volume, traders
- **Tooltips** on hover for all metrics
- **Display Settings** - Button size, shape, image shape, visibility
- **Filters & Sort** - By volume, time, category, verified

## Tech Stack

- React 18 + TypeScript
- Vite
- TailwindCSS + Radix UI
- Framer Motion
- Lucide icons

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
