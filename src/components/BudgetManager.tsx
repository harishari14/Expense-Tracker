import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Edit3, Plus } from 'lucide-react';
import { Category, Transaction } from '../types/expense';

interface BudgetManagerProps {
  categories: Category[];
  transactions: Transaction[];
  onUpdateCategoryBudget: (categoryId: string, newBudget: number) => void;
  currencySymbol?: string;
}

export const BudgetManager: React.FC<BudgetManagerProps> = ({
  categories,
  transactions,
  onUpdateCategoryBudget,
  currencySymbol = '$',
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempBudget, setTempBudget] = useState<string>('');

  // Calculate actual spend for each expense category
  const expenseCategories = categories.filter((c) => c.type === 'expense');

  const budgetStats = expenseCategories.map((cat) => {
    const spent = transactions
      .filter((t) => t.type === 'expense' && t.categoryId === cat.id)
      .reduce((sum, t) => sum + t.amount, 0);

    const limit = cat.monthlyBudget ?? 0;
    const percentage = limit > 0 ? Math.min(Math.round((spent / limit) * 100), 200) : (spent > 0 ? 100 : 0);
    const isExceeded = limit > 0 ? spent > limit : (spent > 0 && limit === 0);
    const isWarning = limit > 0 && !isExceeded && percentage >= 80;

    return {
      category: cat,
      spent,
      limit,
      percentage,
      isExceeded,
      isWarning,
    };
  });

  const totalBudgeted = budgetStats.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgetStats.reduce((sum, b) => sum + b.spent, 0);
  const overallPercentage = totalBudgeted > 0 ? Math.round((totalSpent / totalBudgeted) * 100) : 0;

  const startEdit = (catId: string, currentBudget: number) => {
    setEditingId(catId);
    setTempBudget(currentBudget > 0 ? currentBudget.toString() : '');
  };

  const saveEdit = (catId: string) => {
    const val = parseFloat(tempBudget);
    if (!isNaN(val) && val >= 0) {
      onUpdateCategoryBudget(catId, val);
    } else if (tempBudget === '' || tempBudget === '0') {
      onUpdateCategoryBudget(catId, 0);
    }
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="glass-panel rounded-xl p-5 border border-white/[0.08] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-white">Monthly Budget Allocation</h2>
          <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
            <span>Overall Capital Consumption</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="font-mono tabular-nums text-cyan-300">
              {currencySymbol}{totalSpent.toFixed(2)} of {currencySymbol}{totalBudgeted.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="w-full md:w-64 space-y-1.5">
          <div className="flex justify-between text-xs font-mono text-slate-400">
            <span>Capacity Utilized</span>
            <span className={overallPercentage > 100 ? 'text-rose-400 font-bold' : 'text-cyan-400'}>
              {overallPercentage}%
            </span>
          </div>
          <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                overallPercentage > 100
                  ? 'bg-rose-500'
                  : overallPercentage > 80
                  ? 'bg-amber-400'
                  : 'bg-cyan-500'
              }`}
              style={{ width: `${Math.min(overallPercentage, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Category Budget Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {budgetStats.map(({ category, spent, limit, percentage, isExceeded, isWarning }) => (
          <div
            key={category.id}
            className="glass-card rounded-xl p-4.5 border border-white/[0.08] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5 truncate">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="font-medium text-sm text-white truncate">
                    {category.name}
                  </span>
                </div>

                {limit === 0 && spent === 0 ? (
                  <span className="text-[11px] text-slate-500 font-mono">
                    $0 Cap
                  </span>
                ) : isExceeded ? (
                  <div className="flex items-center gap-1 text-rose-400 text-xs shrink-0">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span>Over limit</span>
                  </div>
                ) : isWarning ? (
                  <div className="flex items-center gap-1 text-amber-400 text-xs shrink-0">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span>Caution</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-emerald-400 text-xs shrink-0">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>On track</span>
                  </div>
                )}
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-800/80 rounded-full h-2 mb-3 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(percentage, 100)}%`,
                    backgroundColor: isExceeded ? '#F43F5E' : isWarning ? '#F59E0B' : category.color,
                  }}
                />
              </div>

              {/* Numbers */}
              <div className="flex items-baseline justify-between text-xs text-slate-400 mb-2 font-mono tabular-nums">
                <div>
                  <span className="text-white font-semibold text-sm">
                    {currencySymbol}{spent.toFixed(2)}
                  </span>
                  <span className="text-slate-500 text-[11px] ml-1">spent</span>
                </div>
                <div>
                  {editingId === category.id ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        placeholder="0"
                        min="0"
                        step="10"
                        value={tempBudget}
                        onChange={(e) => setTempBudget(e.target.value)}
                        className="glass-input w-20 px-1.5 py-0.5 text-xs rounded text-right"
                        autoFocus
                      />
                      <button
                        onClick={() => saveEdit(category.id)}
                        className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold px-1 cursor-pointer"
                      >
                        Set
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startEdit(category.id, limit)}
                      className="group flex items-center gap-1 hover:text-cyan-400 transition-colors cursor-pointer"
                      title="Adjust budget limit"
                    >
                      <span>Cap: {currencySymbol}{limit.toFixed(0)}</span>
                      <Edit3 className="h-3 w-3 text-slate-500 group-hover:text-cyan-400" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-2.5 border-t border-white/[0.05] flex items-center justify-between text-[11px] text-slate-500">
              <span>{limit > 0 ? `${percentage}% utilized` : 'No budget set'}</span>
              <span className={isExceeded ? 'text-rose-400 font-mono' : 'text-slate-400 font-mono'}>
                {limit > 0
                  ? isExceeded
                    ? `Exceeded by ${currencySymbol}${(spent - limit).toFixed(0)}`
                    : `${currencySymbol}${(limit - spent).toFixed(0)} remaining`
                  : (
                    <button
                      onClick={() => startEdit(category.id, limit)}
                      className="text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Set limit</span>
                    </button>
                  )}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
