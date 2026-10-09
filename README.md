# AetherSpend — 2026 Glassmorphic Expense Tracker

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
  - Deep dark canvas (`#080B11`) with frosted crystal glass panels (`backdrop-blur-2xl`), subtle specular light borders, and ambient light spheres.
  - Zero-pill typographic metadata hierarchy using clean dividers (`·`, `/`).
  - Monospace tabular figures (`tabular-nums font-mono`) for all financial metrics, timestamps, and amounts.
- **$0.00 Clean-Slate Initial State**:
  - All accounts, categories, and metrics start at `$0.00`.
  - Enter custom income and expenses and watch the graphs scale and animate dynamically in real time.
- **Interactive Cash Flow Trajectory**:
  - Switch between **Trend Wave** (smooth SVG gradient curves) and **Monthly Bars** (side-by-side inflows vs. outflows).
  - Hover tooltips inspect precise income, expense, and net values for each billing cycle.
- **Category Allocation Doughnut**:
  - Interactive SVG doughnut chart breaking down spending categories with slice highlights, percentages, and dollar totals.
- **High-Density Transaction Ledger**:
  - Multi-facet filters (`All`, `Expenses`, `Income`, Category filter), real-time search, sorting by date or amount, pagination, and modal Add/Edit/Delete actions.
- **Monthly Budget Manager**:
  - Category spending caps, dynamic percentage progress bars, caution/over-budget warnings, and inline cap updates.
- **Predictive Analytics & Forecasting**:
  - Projected month-end spend, daily capital burn pace, essential vs. discretionary ratio, and top outflow merchants.
- **Zero-Database Architecture**:
  - Runs completely standalone with thread-safe `ConcurrentHashMap` storage and Java Stream aggregations. Zero database installation, zero connection strings, and zero configuration friction.

---

## 📐 Architecture Overview
