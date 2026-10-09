import React from 'react';
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, CreditCard, Flame } from 'lucide-react';

interface MetricCardsProps {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  savingsRate: number;
  burnRatePerDay: number;
  currencySymbol?: string;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  totalIncome,
  totalExpenses,
  netBalance,
  savingsRate,
  burnRatePerDay,
  currencySymbol = '$',
}) => {
  const formatAmount = (num: number) => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Net Balance Card */}
      <div className="glass-panel relative overflow-hidden rounded-xl p-5 border border-white/[0.08]">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 h-24 w-24 rounded-full bg-cyan-500/10 blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span>Net Balance</span>
          <Wallet className="h-4 w-4 text-cyan-400" />
        </div>
        <div className="text-2xl font-bold tracking-tight text-white tabular-nums">
          {currencySymbol}{formatAmount(netBalance)}
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
          <span className={netBalance >= 0 ? 'text-emerald-400 font-medium' : 'text-rose-400 font-medium'}>
            {netBalance >= 0 ? '+' : ''}{currencySymbol}{formatAmount(netBalance)}
          </span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>Rolling cash reserve</span>
        </div>
      </div>

      {/* 2. Total Inflows (Income) */}
      <div className="glass-panel relative overflow-hidden rounded-xl p-5 border border-white/[0.08]">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 h-24 w-24 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span>Monthly Inflow</span>
          <ArrowUpRight className="h-4 w-4 text-emerald-400" />
        </div>
        <div className="text-2xl font-bold tracking-tight text-emerald-400 tabular-nums">
          +{currencySymbol}{formatAmount(totalIncome)}
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
          <TrendingUp className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          <span>Active & passive income</span>
        </div>
      </div>

      {/* 3. Total Outflows (Expenses) */}
      <div className="glass-panel relative overflow-hidden rounded-xl p-5 border border-white/[0.08]">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 h-24 w-24 rounded-full bg-rose-500/10 blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span>Monthly Outflow</span>
          <ArrowDownRight className="h-4 w-4 text-rose-400" />
        </div>
        <div className="text-2xl font-bold tracking-tight text-slate-100 tabular-nums">
          {currencySymbol}{formatAmount(totalExpenses)}
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
          <CreditCard className="h-3.5 w-3.5 text-rose-400 shrink-0" />
          <span>Total verified charges</span>
        </div>
      </div>

      {/* 4. Savings Rate & Burn Rate */}
      <div className="glass-panel relative overflow-hidden rounded-xl p-5 border border-white/[0.08]">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 h-24 w-24 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span>Savings Rate</span>
          <Flame className="h-4 w-4 text-amber-400" />
        </div>
        <div className="text-2xl font-bold tracking-tight text-cyan-300 tabular-nums">
          {savingsRate.toFixed(1)}%
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
          <span className="font-mono tabular-nums text-slate-300">
            {currencySymbol}{burnRatePerDay.toFixed(0)}/day
          </span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>Current burn pace</span>
        </div>
      </div>
    </div>
  );
};
