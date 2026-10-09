export const ROOT_README_CONTENT = `# AetherSpend — 2026 Glassmorphic Expense Tracker

![Java](https://img.shields.io/badge/Java-21-orange?logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.4-brightgreen?logo=springboot)
![React](https://img.shields.io/badge/React-19.0-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-38bdf8?logo=tailwindcss)
![Architecture](https://img.shields.io/badge/Database-Zero%20DB%20(In--Memory)-purple)
![License](https://img.shields.io/badge/License-Apache%202.0-lightgrey)

> **AetherSpend** is a modern, high-performance financial expense tracker application engineered with **2026 glassmorphic aesthetics** and powered by a standalone **Java Spring Boot 3.3 (Java 21) REST API** using an in-memory concurrent store (zero database setup required).

---

## 🌟 Key Features

- **2026 Glassmorphic Design System**:
  - Deep dark canvas (\`#080B11\`) with frosted crystal glass panels (\`backdrop-blur-2xl\`), subtle specular light borders, and ambient light spheres.
  - Zero-pill typographic metadata hierarchy using clean dividers (\`·\`, \`/\`).
  - Monospace tabular figures (\`tabular-nums font-mono\`) for all financial metrics, timestamps, and amounts.
- **$0.00 Clean-Slate Initial State**:
  - All accounts, categories, and metrics start at \`$0.00\`.
  - Enter custom income and expenses and watch the graphs scale and animate dynamically in real time.
- **Interactive Cash Flow Trajectory**:
  - Switch between **Trend Wave** (smooth SVG gradient curves) and **Monthly Bars** (side-by-side inflows vs. outflows).
  - Hover tooltips inspect precise income, expense, and net values for each billing cycle.
- **Category Allocation Doughnut**:
  - Interactive SVG doughnut chart breaking down spending categories with slice highlights, percentages, and dollar totals.
- **High-Density Transaction Ledger**:
  - Multi-facet filters (\`All\`, \`Expenses\`, \`Income\`, Category filter), real-time search, sorting by date or amount, pagination, and modal Add/Edit/Delete actions.
- **Monthly Budget Manager**:
  - Category spending caps, dynamic percentage progress bars, caution/over-budget warnings, and inline cap updates.
- **Predictive Analytics & Forecasting**:
  - Projected month-end spend, daily capital burn pace, essential vs. discretionary ratio, and top outflow merchants.
- **Zero-Database Architecture**:
  - Runs completely standalone with thread-safe \`ConcurrentHashMap\` storage and Java Stream aggregations. Zero database installation, zero connection strings, and zero configuration friction.

---

## 📐 Architecture Overview

\`\`\`
                        ┌───────────────────────────────────────────────┐
                        │      Client Browser (React 19 + Vite)         │
                        │   - 2026 Glassmorphic UI & SVG Wave Charts    │
                        │   - Dynamic Inflows, Outflows & Budgets       │
                        └───────────────────────┬───────────────────────┘
                                                │ REST API calls (/api/*)
                                                ▼
                        ┌───────────────────────────────────────────────┐
                        │   Java Spring Boot 3.3.4 (Java 21 REST API)   │
                        │   - Controllers: Transaction, Category, Budget│
                        │   - Service: In-Memory ConcurrentHashMap Store│
                        │   - Swagger OpenAPI 3.0 Documentation         │
                        └───────────────────────────────────────────────┘
\`\`\`

---

## 📁 Repository Structure

\`\`\`text
├── springboot-backend/                        # Standalone Java Spring Boot 3.3 Project
│   ├── pom.xml                                # Maven POM (Java 21, Spring Boot 3.3.4, Swagger)
│   ├── Dockerfile                             # Multi-stage production container
│   ├── README.md                              # Backend technical documentation
│   └── src/main/
│       ├── resources/
│       │   └── application.properties         # Server port, CORS, and Swagger configs
│       └── java/com/expensetracker/
│           ├── ExpenseTrackerApplication.java # Spring Boot main entry point
│           ├── model/
│           │   ├── Transaction.java           # Transaction domain entity with Bean Validation
│           │   └── Category.java              # Category & budget domain entity
│           ├── service/
│           │   ├── TransactionService.java    # Thread-safe in-memory store & Stream aggregations
│           │   └── CategoryService.java       # Category budget store
│           ├── controller/
│           │   ├── TransactionController.java # REST API (/api/transactions)
│           │   ├── CategoryController.java    # REST API (/api/categories)
│           │   └── AnalyticsController.java   # REST API (/api/analytics/summary, /api/reset)
│           └── config/
│               ├── CorsConfig.java            # Cross-Origin Resource Sharing configuration
│               └── OpenApiConfig.java         # Swagger OpenAPI 3.0 specification
│
├── src/                                       # 2026 Glassmorphic React 19 Frontend
│   ├── components/
│   │   ├── TopBar.tsx                         # 3-Zone top navigation bar with + New Transaction CTA
│   │   ├── MetricCards.tsx                    # Net Balance, Inflow, Outflow, Savings Rate, Burn Rate
│   │   ├── CashFlowChart.tsx                  # Interactive SVG Wave & Bar trajectory chart
│   │   ├── CategoryDoughnut.tsx               # Reactive category allocation doughnut
│   │   ├── TransactionLedger.tsx              # High-density data grid with search & filters
│   │   ├── TransactionModal.tsx               # Glassmorphic transaction add/edit modal
│   │   ├── BudgetManager.tsx                  # Category budget allocation & progress bars
│   │   └── AnalyticsView.tsx                  # Spend velocity, projections & merchant ranking
│   ├── services/
│   │   └── api.ts                             # Frontend HTTP client connected to REST backend
│   ├── types/
│   │   └── expense.ts                         # Shared TypeScript interfaces
│   ├── data/
│   │   └── defaultData.ts                     # $0.00 baseline initial state
│   ├── App.tsx                                # Main application viewport
│   ├── index.css                              # Tailwind CSS v4 & custom glassmorphism styles
│   └── main.tsx                               # React DOM entry point
│
├── server.ts                                  # Full-stack Node/Express runner & Vite dev middleware
├── package.json                               # Frontend dependencies & npm scripts
├── vite.config.ts                             # Vite build configuration
└── README.md                                  # Complete project documentation
\`\`\`

---

## 🚀 Quickstart Guide

### Prerequisites
- **Node.js**: \`v20.x\` or higher
- **Java Development Kit (JDK)**: \`Java 21\` (for running the Java Spring Boot service standalone)
- **Maven**: \`3.9.x\` or higher (optional, or use Maven wrapper)

---

### Option A: Run Full-Stack Development Server (React + Live REST API)

In this mode, \`server.ts\` mounts the REST API matching Spring Boot endpoints and serves the React frontend with hot reloading:

\`\`\`bash
# 1. Install dependencies
npm install

# 2. Start the full-stack server
npm run dev
\`\`\`

Open your browser to:
\`\`\`
http://localhost:3000
\`\`\`

---

### Option B: Run Standalone Java Spring Boot Backend

You can run the pure Java Spring Boot backend independently:

\`\`\`bash
# 1. Navigate to the backend directory
cd springboot-backend

# 2. Build and run with Maven
mvn clean spring-boot:run
\`\`\`

Once running:
- **REST Endpoints**: \`http://localhost:8080/api/transactions\`
- **Interactive Swagger UI**: \`http://localhost:8080/swagger-ui.html\`
- **OpenAPI Schema**: \`http://localhost:8080/api-docs\`

---

### Option C: Build for Production

#### Build the Frontend:
\`\`\`bash
npm run build
\`\`\`
The compiled static assets will be output to the \`dist/\` directory.

#### Build the Spring Boot JAR:
\`\`\`bash
cd springboot-backend
mvn clean package -DskipTests
java -jar target/expense-tracker-api-1.0.0.jar
\`\`\`

---

### Option D: Docker Container Deployment

A multi-stage \`Dockerfile\` is included in \`springboot-backend/\`:

\`\`\`bash
cd springboot-backend

# Build the Docker image
docker build -t aetherspend-spring-boot .

# Run the container
docker run -p 8080:8080 aetherspend-spring-boot
\`\`\`

---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| \`GET\` | \`/api/transactions\` | Retrieve all transactions with optional \`?type\`, \`?categoryId\`, \`?startDate\`, \`?endDate\` |
| \`POST\` | \`/api/transactions\` | Record a new transaction (Expense or Income) |
| \`GET\` | \`/api/transactions/{id}\` | Get transaction details by ID |
| \`PUT\` | \`/api/transactions/{id}\` | Update an existing transaction |
| \`DELETE\` | \`/api/transactions/{id}\` | Delete a transaction |
| \`GET\` | \`/api/categories\` | Retrieve all spending categories and their budget caps |
| \`PUT\` | \`/api/categories/{id}/budget\` | Update the monthly spending limit for a category |
| \`GET\` | \`/api/analytics/summary\` | Compute monthly totals, net savings, savings rate, and daily burn pace |
| \`POST\` | \`/api/reset\` | Reset all transactions and category budget limits back to \`$0.00\` |
| \`GET\` | \`/api/health\` | Health probe reporting system status |

### Sample Payload: Record Transaction (\`POST /api/transactions\`)
\`\`\`json
{
  "title": "Whole Foods Market",
  "amount": 142.80,
  "type": "expense",
  "categoryId": "cat-dining",
  "date": "2026-10-09",
  "paymentMethod": "Credit Card",
  "notes": "Weekly fresh meal prep supply",
  "isRecurring": false
}
\`\`\`

### Sample Response (\`GET /api/analytics/summary\`)
\`\`\`json
{
  "totalIncome": 4500.00,
  "totalExpense": 125.50,
  "netBalance": 4374.50,
  "savingsRate": 97.2,
  "burnRatePerDay": 13.94,
  "transactionCount": 2
}
\`\`\`

---

## 🎨 Design System & Visual Guidelines

- **Surface Refraction**: Layered glass panels (\`glass-panel\` and \`glass-card\`) using \`backdrop-filter: blur(16px)\` and subtle \`1px solid rgba(255, 255, 255, 0.08)\` borders.
- **Color Discipline (60-30-10)**:
  - **60%**: Deep neutral slate backdrop (\`#080B11\`).
  - **30%**: Translucent structural frosted acrylic surfaces.
  - **10%**: High-contrast luminous cyan (\`#06B6D4\`) and emerald (\`#10B981\`) accents.
- **Tabular Figures**: Enforced via \`tabular-nums font-mono\` for decimal alignment in all financial charts, ledger rows, and KPI cards.

---

## 🛡️ License

This project is open-source and licensed under the **Apache License 2.0**.
`;

export const BACKEND_README_CONTENT = `# AetherSpend - Java Spring Boot Backend (Zero Database Architecture)

A modern, high-throughput **Java Spring Boot 3.3.4 (Java 21)** REST API engineered with an in-memory concurrent store.

## 🚀 Key Highlights
- **Zero Database Required**: Runs standalone with thread-safe \`ConcurrentHashMap\` and Java Stream aggregations. Zero database installation, zero connection strings, zero latency!
- **Swagger / OpenAPI 3**: Interactive testing UI at \`http://localhost:8080/swagger-ui.html\`.
- **REST Endpoints**:
  - \`GET /api/transactions\` - Fetch all or filter by type/category/date
  - \`POST /api/transactions\` - Create transaction
  - \`PUT /api/transactions/{id}\` - Update transaction
  - \`DELETE /api/transactions/{id}\` - Delete transaction
  - \`GET /api/categories\` - Fetch categories and monthly budget limits
  - \`PUT /api/categories/{id}/budget\` - Update category budget cap
  - \`GET /api/analytics/summary\` - Inflows, outflows, savings rate, burn rate
  - \`POST /api/reset\` - Reset all entries and caps to $0.00
  - \`GET /api/health\` - Health probe

## 💻 Run Locally
\`\`\`bash
mvn clean spring-boot:run
\`\`\`
Visit:
- API: \`http://localhost:8080/api/transactions\`
- Swagger UI: \`http://localhost:8080/swagger-ui.html\`
`;
