import React from 'react';
import { Transaction, Category } from '../types/expense';
import { Flame, Target, TrendingUp, ShieldCheck, Zap } from 'lucide-react';

interface AnalyticsViewProps {
  transactions: Transaction[];
  categories: Category[];
  currencySymbol?: string;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  transactions,
  categories,
  currencySymbol = '$',
}) => {
  // Calculations
  const incomeList = transactions.filter((t) => t.type === 'income');
  const expenseList = transactions.filter((t) => t.type === 'expense');

  const totalIncome = incomeList.reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = expenseList.reduce((sum, t) => sum + t.amount, 0);
  const netSavings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

  // Days in current billing cycle (assume 9 days elapsed in Oct 2026)
  const elapsedDays = 9;
  const daysInMonth = 31;
  const burnRatePerDay = totalExpense / Math.max(1, elapsedDays);
  const projectedMonthEndSpend = burnRatePerDay * daysInMonth;

  // Merchant spending ranking
  const merchantMap = new Map<string, { total: number; count: number; category: string }>();
  expenseList.forEach((t) => {
    const existing = merchantMap.get(t.title) || { total: 0, count: 0, category: t.categoryName };
    merchantMap.set(t.title, {
      total: existing.total + t.amount,
      count: existing.count + 1,
      category: t.categoryName,
    });
  });

  const topMerchants = Array.from(merchantMap.entries())
    .map(([title, data]) => ({ title, ...data }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  // Essential vs Discretionary spend
  const essentialCategories = ['cat-housing', 'cat-utilities', 'cat-health', 'cat-transport'];
  const essentialSpend = expenseList
    .filter((t) => essentialCategories.includes(t.categoryId))
    .reduce((sum, t) => sum + t.amount, 0);
  const discretionarySpend = totalExpense - essentialSpend;
  const essentialPercentage = totalExpense > 0 ? (essentialSpend / totalExpense) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Forecasting KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel rounded-xl p-5 border border-white/[0.08] relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Projected Month-End</span>
            <Target className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-white font-mono tabular-nums">
            {currencySymbol}{projectedMonthEndSpend.toFixed(2)}
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
            <span className="text-cyan-400 font-medium">Est. 31-day outflow</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>Forecast model</span>
          </div>
        </div>

        <div className="glass-panel rounded-xl p-5 border border-white/[0.08] relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Capital Burn Pace</span>
            <Flame className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-amber-300 font-mono tabular-nums">
            {currencySymbol}{burnRatePerDay.toFixed(2)}<span className="text-xs text-slate-400 font-normal">/day</span>
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
            <span>Based on {elapsedDays} days logged</span>
          </div>
        </div>

        <div className="glass-panel rounded-xl p-5 border border-white/[0.08] relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Savings Yield Rate</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-emerald-400 font-mono tabular-nums">
            {savingsRate.toFixed(1)}%
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
            <span>+{currencySymbol}{netSavings.toFixed(2)} retained</span>
          </div>
        </div>

        <div className="glass-panel rounded-xl p-5 border border-white/[0.08] relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Discretionary Index</span>
            <Zap className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-indigo-300 font-mono tabular-nums">
            {(100 - essentialPercentage).toFixed(0)}%
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
            <span>{essentialPercentage.toFixed(0)}% essential baseline</span>
          </div>
        </div>
      </div>

      {/* Main Split: Merchant Ranking & Capital Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Outflow Merchants */}
        <div className="lg:col-span-7 glass-panel rounded-xl p-5 border border-white/[0.08]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-white">Top Expense Outflows</h3>
              <div className="text-xs text-slate-400 mt-0.5">
                <span>Ranked by cumulative spend</span>
                <span aria-hidden="true" className="mx-1.5 text-slate-600">·</span>
                <span>Active Cycle</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {topMerchants.map((m, idx) => {
              const percentageOfTotal = (m.total / totalExpense) * 100;
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-500 w-4 text-right">0{idx + 1}</span>
                      <span className="font-medium text-slate-200">{m.title}</span>
                      <span className="text-slate-500 text-[11px] font-mono">({m.category})</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono tabular-nums">
                      <span className="text-white font-semibold">
                        {currencySymbol}{m.total.toFixed(2)}
                      </span>
                      <span className="text-slate-500 text-[11px] w-12 text-right">
                        {percentageOfTotal.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                      style={{ width: `${Math.min(percentageOfTotal * 2, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Essential vs Discretionary Breakdown */}
        <div className="lg:col-span-5 glass-panel rounded-xl p-5 border border-white/[0.08] flex flex-col justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">Structural Budget Balance</h3>
            <div className="text-xs text-slate-400 mt-0.5">
              <span>Needs vs Lifestyle Distribution</span>
            </div>

            <div className="mt-5 space-y-4">
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium text-slate-300">Essential Fixed Outflows</span>
                  <span className="font-mono font-semibold text-emerald-400 tabular-nums">
                    {currencySymbol}{essentialSpend.toFixed(2)} ({essentialPercentage.toFixed(1)}%)
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Housing, energy, utilities, transit, and healthcare baselines.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium text-slate-300">Discretionary & Variable</span>
                  <span className="font-mono font-semibold text-cyan-400 tabular-nums">
                    {currencySymbol}{discretionarySpend.toFixed(2)} ({(100 - essentialPercentage).toFixed(1)}%)
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Dining, entertainment, shopping, and flexible lifestyle expenditures.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Healthy Capital Ratio</span>
            </span>
            <span className="font-mono text-slate-500">In-Memory Standalone</span>
          </div>
        </div>
      </div>
    </div>
  );
};
