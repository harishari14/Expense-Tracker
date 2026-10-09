import React, { useState } from 'react';
import { Transaction, Category } from '../types/expense';

interface CategoryDoughnutProps {
  transactions: Transaction[];
  categories: Category[];
  currencySymbol?: string;
  onAddExpense?: () => void;
}

export const CategoryDoughnut: React.FC<CategoryDoughnutProps> = ({
  transactions,
  categories,
  currencySymbol = '$',
  onAddExpense,
}) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // Calculate expense amounts by category from transactions
  const categorySpend = React.useMemo(() => {
    const expenseMap = new Map<string, number>();

    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        expenseMap.set(t.categoryId, (expenseMap.get(t.categoryId) || 0) + t.amount);
      });

    const expenseCategories = categories.filter((c) => c.type === 'expense');

    const list = expenseCategories.map((c) => ({
      id: c.id,
      name: c.name,
      color: c.color,
      amount: expenseMap.get(c.id) || 0,
    }));

    const total = list.reduce((acc, curr) => acc + curr.amount, 0);

    return {
      items: list.sort((a, b) => b.amount - a.amount),
      total,
    };
  }, [transactions, categories]);

  // Compute SVG arc slices
  let accumulatedAngle = 0;
  const radius = 68;
  const strokeWidth = 22;
  const circumference = 2 * Math.PI * radius;

  const hasExpenses = categorySpend.total > 0;

  const slices = categorySpend.items
    .filter((item) => item.amount > 0)
    .map((item) => {
      const percentage = (item.amount / categorySpend.total) * 100;
      const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
      const strokeDashoffset = -accumulatedAngle;
      accumulatedAngle += (percentage / 100) * circumference;

      return {
        ...item,
        percentage,
        strokeDasharray,
        strokeDashoffset,
      };
    });

  const activeItem = hoveredCategory
    ? slices.find((s) => s.id === hoveredCategory)
    : slices[0];

  return (
    <div className="glass-panel rounded-xl p-5 border border-white/[0.08] flex flex-col justify-between">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-white">Expense Allocation</h2>
        <div className="text-xs text-slate-400 mt-0.5">
          <span>By Spending Category</span>
          <span aria-hidden="true" className="mx-1.5 text-slate-600">·</span>
          <span className={hasExpenses ? 'text-cyan-400' : 'text-slate-500'}>
            {hasExpenses ? `${slices.length} Active Categories` : 'Current Total: $0.00'}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 my-auto">
        {/* SVG Doughnut */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg width="180" height="180" viewBox="0 0 180 180" className="transform -rotate-90">
            {/* Background ring */}
            <circle
              cx="90"
              cy="90"
              r={radius}
              fill="transparent"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth={strokeWidth}
            />

            {/* Slices (rendered when user enters expenses) */}
            {slices.map((slice) => {
              const isHovered = hoveredCategory === slice.id;
              return (
                <circle
                  key={slice.id}
                  cx="90"
                  cy="90"
                  r={radius}
                  fill="transparent"
                  stroke={slice.color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={slice.strokeDasharray}
                  strokeDashoffset={slice.strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-200 cursor-pointer"
                  style={{
                    filter: isHovered ? `drop-shadow(0 0 8px ${slice.color}80)` : 'none',
                  }}
                  onMouseEnter={() => setHoveredCategory(slice.id)}
                  onMouseLeave={() => setHoveredCategory(null)}
                />
              );
            })}
          </svg>

          {/* Central Donut Readout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-[11px] font-medium text-slate-400 truncate max-w-[84px]">
              {hasExpenses ? (activeItem ? activeItem.name : 'Total') : 'Expenses'}
            </span>
            <span className="text-sm font-bold text-white tabular-nums">
              {hasExpenses
                ? `${currencySymbol}${activeItem ? activeItem.amount.toFixed(0) : categorySpend.total.toFixed(0)}`
                : `${currencySymbol}0.00`}
            </span>
            {hasExpenses && activeItem && (
              <span className="text-[10px] text-cyan-400 font-mono tabular-nums">
                {activeItem.percentage.toFixed(1)}%
              </span>
            )}
            {!hasExpenses && (
              <span className="text-[10px] text-slate-500 font-mono">
                0%
              </span>
            )}
          </div>
        </div>

        {/* Legend / Category breakdown list */}
        <div className="w-full flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
          {hasExpenses ? (
            slices.map((slice) => {
              const isHovered = hoveredCategory === slice.id;
              return (
                <div
                  key={slice.id}
                  onMouseEnter={() => setHoveredCategory(slice.id)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  className={`flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    isHovered ? 'bg-white/[0.08] text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{ backgroundColor: slice.color }}
                    />
                    <span className="truncate">{slice.name}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono tabular-nums text-slate-300 shrink-0">
                    <span>{currencySymbol}{slice.amount.toFixed(2)}</span>
                    <span className="text-[11px] text-slate-500 w-9 text-right">
                      {slice.percentage.toFixed(0)}%
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-4 px-2">
              <p className="text-xs text-slate-400">
                No expense entries logged yet
              </p>
              <p className="text-[11px] text-slate-500 mt-1 max-w-[200px]">
                Add an expense to view live category distribution percentages
              </p>
              {onAddExpense && (
                <button
                  onClick={onAddExpense}
                  className="mt-2.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium underline cursor-pointer"
                >
                  + Add first expense
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
