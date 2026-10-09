import React from 'react';
import { Plus, Sparkles } from 'lucide-react';

interface TopBarProps {
  activeTab: 'dashboard' | 'transactions' | 'budgets' | 'analytics';
  onTabChange: (tab: 'dashboard' | 'transactions' | 'budgets' | 'analytics') => void;
  onOpenNewTransaction: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  onTabChange,
  onOpenNewTransaction,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#080B11]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand title, one line */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 via-indigo-500/20 to-purple-500/20 border border-cyan-400/30 text-cyan-400 shadow-inner">
            <Sparkles className="h-4 w-4" />
          </div>
          <button
            onClick={() => onTabChange('dashboard')}
            className="text-left group cursor-pointer"
          >
            <span className="text-lg font-bold tracking-tight text-white transition-colors group-hover:text-cyan-300 whitespace-nowrap shrink-0">
              AetherSpend
            </span>
          </button>
        </div>

        {/* Zone 2: 4 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <button
            onClick={() => onTabChange('dashboard')}
            className={`cursor-pointer whitespace-nowrap transition-colors hover:text-white ${
              activeTab === 'dashboard'
                ? 'text-cyan-400 font-semibold'
                : 'text-slate-400'
            }`}
          >
            Overview
          </button>

          <button
            onClick={() => onTabChange('transactions')}
            className={`cursor-pointer whitespace-nowrap transition-colors hover:text-white ${
              activeTab === 'transactions'
                ? 'text-cyan-400 font-semibold'
                : 'text-slate-400'
            }`}
          >
            Ledger
          </button>

          <button
            onClick={() => onTabChange('budgets')}
            className={`cursor-pointer whitespace-nowrap transition-colors hover:text-white ${
              activeTab === 'budgets'
                ? 'text-cyan-400 font-semibold'
                : 'text-slate-400'
            }`}
          >
            Budgets
          </button>

          <button
            onClick={() => onTabChange('analytics')}
            className={`cursor-pointer whitespace-nowrap transition-colors hover:text-white ${
              activeTab === 'analytics'
                ? 'text-cyan-400 font-semibold'
                : 'text-slate-400'
            }`}
          >
            Analytics & Forecast
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenNewTransaction}
            className="group flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all hover:from-cyan-400 hover:to-blue-500 active:scale-[0.98] cursor-pointer whitespace-nowrap shrink-0"
          >
            <Plus className="h-3.5 w-3.5 transition-transform group-hover:rotate-90 duration-200" />
            <span>New Transaction</span>
          </button>
        </div>
      </div>

      {/* Mobile nav row */}
      <div className="flex md:hidden items-center justify-around border-t border-white/[0.06] bg-[#0a0f1d]/90 px-2 py-2 text-xs">
        <button
          onClick={() => onTabChange('dashboard')}
          className={`py-1 px-2.5 rounded ${activeTab === 'dashboard' ? 'text-cyan-400 font-semibold' : 'text-slate-400'}`}
        >
          Overview
        </button>
        <button
          onClick={() => onTabChange('transactions')}
          className={`py-1 px-2.5 rounded ${activeTab === 'transactions' ? 'text-cyan-400 font-semibold' : 'text-slate-400'}`}
        >
          Ledger
        </button>
        <button
          onClick={() => onTabChange('budgets')}
          className={`py-1 px-2.5 rounded ${activeTab === 'budgets' ? 'text-cyan-400 font-semibold' : 'text-slate-400'}`}
        >
          Budgets
        </button>
        <button
          onClick={() => onTabChange('analytics')}
          className={`py-1 px-2.5 rounded ${activeTab === 'analytics' ? 'text-cyan-400 font-semibold' : 'text-slate-400'}`}
        >
          Analytics
        </button>
      </div>
    </header>
  );
};
