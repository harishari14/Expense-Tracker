# AetherSpend — 2026 Glassmorphic Expense Tracker

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

An ultra-modern, standalone financial management application designed with **2026 glassmorphic aesthetics**, real-time reactive SVG financial visualizations, and a clean **$0.00 initial baseline**. Enter income and expenses to watch graphs, budget capacity bars, and financial KPIs calculate and animate in real time.

---

## ✨ Features

- **💎 2026 Glassmorphism Design System**: Frosted crystal glass acrylics (`backdrop-blur-2xl`), luminous specular highlights, subtle mesh glow, and strict zero-pill typographic discipline.
- **📈 Live Reactive Cash Flow Trajectory**:
  - Interactive SVG financial trend wave and side-by-side monthly comparison bars.
  - Starts at a pure **$0.00 clean slate** and reactively plots curves as you input transactions.
  - Hover tooltips detailing exact inflow, outflow, and net cash reserve.
- **🍩 Interactive Expense Allocation Doughnut**:
  - Dynamic SVG doughnut visualizer that slices categories by spend percentage.
  - Central readout with active slice hover inspection and dollar amounts.
- **💳 High-Density Transaction Ledger**:
  - Full-text search for merchants, categories, or tax notes.
  - Multi-facet filtering by transaction type (All, Expense, Income) and category.
  - Sorting by date and amount with tabular numerical figures (`tabular-nums font-mono`).
  - Full CRUD capabilities (Add, Edit, Delete).
- **🎯 Category Budget Allocation Manager**:
  - Configurable category caps (Housing, Food & Dining, Cloud & Tech, Transit, Health, etc.).
  - Real-time visual progress bars with capacity warnings (Safe, Approaching Cap, Over-Budget).
  - Inline cap adjustments with instant recalculation.
- **🔮 Analytics & Forecasting Engine**:
  - Month-end outflow projections and daily capital burn velocity (`$/day`).
  - Structural budget breakdown: Essential fixed outflows vs. Discretionary lifestyle spending.
  - Merchant ranking ordered by cumulative expenditure.
- **⚡ Standalone In-Memory Architecture**:
  - Zero external database setup or configuration required.
  - Instant local persistence (`localStorage`) — fast, private, and runs entirely in your browser.
  - One-click **Reset to $0** control to wipe and restart with a clean slate at any time.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [React 19](https://react.dev/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Build Tool** | [Vite](https://vitejs.dev/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Typography** | Plus Jakarta Sans & JetBrains Mono (Tabular Numerals) |

---

## 📂 Project Structure

```text
├── index.html                   # HTML entry point with fonts & metadata
├── package.json                 # Project dependencies & scripts
├── tsconfig.json                # TypeScript compiler configuration
├── vite.config.ts               # Vite configuration with Tailwind CSS plugin
├── metadata.json                # Application metadata
└── src/
    ├── main.tsx                 # React DOM mount point
    ├── App.tsx                  # Core application shell & state orchestration
    ├── index.css                # Tailwind CSS v4 & glassmorphism theme utilities
    ├── types/
    │   └── expense.ts           # TypeScript models (Transaction, Category, Budget)
    ├── data/
    │   └── defaultData.ts       # $0.00 baseline categories & empty state seeds
    └── components/
        ├── TopBar.tsx           # 3-zone glassmorphic header with + New Transaction CTA
        ├── MetricCards.tsx      # KPI cards (Net Balance, Inflow, Outflow, Savings Rate)
        ├── CashFlowChart.tsx    # Interactive SVG Trend Wave & Monthly Bar visualizer
        ├── CategoryDoughnut.tsx # Interactive Category Allocation Doughnut chart
        ├── TransactionLedger.tsx# High-density data grid with search, filter, and pagination
        ├── TransactionModal.tsx # Glassmorphic modal form for Add/Edit transaction
        ├── BudgetManager.tsx    # Category spending limits & capacity progress bars
        └── AnalyticsView.tsx    # Predictive forecasting & spending velocity breakdown
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- `npm` or `pnpm` or `yarn`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/aetherspend-expense-tracker.git
   cd aetherspend-expense-tracker
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:3000` (or the URL displayed in your terminal).

---

## 📖 How to Use

1. **Start with Clean Slate**:
   - The app opens with **all values initialized to $0.00**.
2. **Log Transactions**:
   - Click **`+ New Transaction`** in the top navigation or use the quick test buttons.
   - Choose **Income** (e.g. Salary, Freelance) or **Expense** (e.g. Dining, Rent, Cloud).
   - Enter an amount, date, and payment method.
3. **Observe the Live Graphs**:
   - Watch the **Cash Flow Wave** immediately plot inflows and outflows.
   - Hover over points to view exact dates, net amounts, and deltas.
   - Check the **Category Doughnut** to see proportional percentages auto-calculate.
4. **Manage Budgets**:
   - Go to the **Budgets** tab, click **Set Limit** on any category, and set a monthly cap.
   - The capacity bar will dynamically reflect your current utilization.
5. **Reset Anytime**:
   - Click **Reset all to $0** in the dashboard or footer to clear all data and start fresh.

---

## 📦 Production Build

To create an optimized production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## 📄 License

This project is open-source and licensed under the [MIT License](LICENSE).
