import React, { useState } from 'react';
import { Transaction } from '../types/expense';

interface CashFlowChartProps {
  transactions: Transaction[];
  currencySymbol?: string;
  onQuickAdd?: () => void;
}

interface MonthlyData {
  monthKey: string;
  monthLabel: string;
  income: number;
  expense: number;
}

export const CashFlowChart: React.FC<CashFlowChartProps> = ({
  transactions,
  currencySymbol = '$',
  onQuickAdd,
}) => {
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Group transactions by month for the last 6 months (all initialized to 0)
  const monthsData: MonthlyData[] = React.useMemo(() => {
    const map = new Map<string, { income: number; expense: number; label: string }>();

    // Seed last 6 months with 0 values
    const date = new Date(2026, 9, 1); // Current anchor: Oct 2026
    for (let i = 5; i >= 0; i--) {
      const d = new Date(date.getFullYear(), date.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleString('en-US', { month: 'short' });
      map.set(key, { income: 0, expense: 0, label });
    }

    // Populate ONLY with real user entered transactions
    transactions.forEach((tx) => {
      const key = tx.date.substring(0, 7);
      if (map.has(key)) {
        const item = map.get(key)!;
        if (tx.type === 'income') {
          item.income += tx.amount;
        } else {
          item.expense += tx.amount;
        }
      } else {
        // Also support current month or newly added months
        const [year, month] = key.split('-');
        const d = new Date(parseInt(year), parseInt(month) - 1, 1);
        const label = d.toLocaleString('en-US', { month: 'short' });
        map.set(key, {
          income: tx.type === 'income' ? tx.amount : 0,
          expense: tx.type === 'expense' ? tx.amount : 0,
          label,
        });
      }
    });

    return Array.from(map.entries()).map(([key, val]) => ({
      monthKey: key,
      monthLabel: val.label,
      income: val.income,
      expense: val.expense,
    }));
  }, [transactions]);

  const actualMax = Math.max(
    ...monthsData.map((d) => Math.max(d.income, d.expense)),
    0
  );

  const hasAnyData = actualMax > 0;
  const maxVal = hasAnyData ? actualMax * 1.15 : 1000;

  const svgWidth = 600;
  const svgHeight = 220;
  const paddingX = 40;
  const paddingY = 25;
  const usableWidth = svgWidth - paddingX * 2;
  const usableHeight = svgHeight - paddingY * 2;

  const pointsIncome = monthsData.map((d, i) => {
    const x = paddingX + (i / (monthsData.length - 1)) * usableWidth;
    const y = svgHeight - paddingY - (d.income / maxVal) * usableHeight;
    return { x, y, ...d };
  });

  const pointsExpense = monthsData.map((d, i) => {
    const x = paddingX + (i / (monthsData.length - 1)) * usableWidth;
    const y = svgHeight - paddingY - (d.expense / maxVal) * usableHeight;
    return { x, y, ...d };
  });

  // SVG Area Paths
  const incomePath = pointsIncome.reduce(
    (acc, pt, i) => (i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
    ''
  );
  const incomeArea = `${incomePath} L ${pointsIncome[pointsIncome.length - 1].x} ${svgHeight - paddingY} L ${pointsIncome[0].x} ${svgHeight - paddingY} Z`;

  const expensePath = pointsExpense.reduce(
    (acc, pt, i) => (i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
    ''
  );
  const expenseArea = `${expensePath} L ${pointsExpense[pointsExpense.length - 1].x} ${svgHeight - paddingY} L ${pointsExpense[0].x} ${svgHeight - paddingY} Z`;

  return (
    <div className="glass-panel rounded-xl p-5 border border-white/[0.08] flex flex-col justify-between">
      {/* Header with clean segmented button control */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-base font-semibold text-white">Cash Flow Trajectory</h2>
          <div className="text-xs text-slate-400 mt-0.5">
            <span>Inflows vs Outflows</span>
            <span aria-hidden="true" className="mx-1.5 text-slate-600">·</span>
            <span className={hasAnyData ? 'text-emerald-400' : 'text-slate-500'}>
              {hasAnyData ? 'Live User Data' : 'All Values 0.00 (Ready for Input)'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 p-1 bg-white/[0.04] border border-white/[0.06] rounded-lg">
          <button
            onClick={() => setChartType('area')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              chartType === 'area'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Trend Wave
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              chartType === 'bar'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Monthly Bars
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full h-56">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full overflow-visible"
        >
          <defs>
            <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = paddingY + usableHeight * (1 - ratio);
            const labelVal = hasAnyData ? Math.round(maxVal * ratio) : Math.round(ratio * 1000);
            return (
              <g key={i}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={svgWidth - paddingX}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingX - 8}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="10"
                  fill="rgba(148, 163, 184, 0.6)"
                  fontFamily="JetBrains Mono"
                >
                  ${labelVal >= 1000 ? `${(labelVal / 1000).toFixed(1)}k` : labelVal}
                </text>
              </g>
            );
          })}

          {chartType === 'area' ? (
            <>
              {/* Areas */}
              <path d={incomeArea} fill="url(#incomeGradient)" />
              <path d={expenseArea} fill="url(#expenseGradient)" />

              {/* Stroke Lines */}
              <path
                d={incomePath}
                fill="none"
                stroke="#10B981"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d={expensePath}
                fill="none"
                stroke="#06B6D4"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Data points */}
              {pointsIncome.map((pt, idx) => (
                <g key={`income-pt-${idx}`}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={hoveredIndex === idx ? 6 : 4}
                    fill="#10B981"
                    stroke="#080B11"
                    strokeWidth="2"
                    className="cursor-pointer transition-all"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                  <circle
                    cx={pointsExpense[idx].x}
                    cy={pointsExpense[idx].y}
                    r={hoveredIndex === idx ? 6 : 4}
                    fill="#06B6D4"
                    stroke="#080B11"
                    strokeWidth="2"
                    className="cursor-pointer transition-all"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                </g>
              ))}
            </>
          ) : (
            /* Bar Chart View */
            monthsData.map((d, idx) => {
              const groupX = paddingX + (idx / (monthsData.length - 1)) * usableWidth;
              const barWidth = 14;
              const gap = 3;

              const incomeHeight = maxVal > 0 ? (d.income / maxVal) * usableHeight : 0;
              const expenseHeight = maxVal > 0 ? (d.expense / maxVal) * usableHeight : 0;

              return (
                <g key={`bars-${idx}`} onMouseEnter={() => setHoveredIndex(idx)} onMouseLeave={() => setHoveredIndex(null)}>
                  {/* Income Bar */}
                  <rect
                    x={groupX - barWidth - gap / 2}
                    y={svgHeight - paddingY - Math.max(incomeHeight, 2)}
                    width={barWidth}
                    height={Math.max(incomeHeight, 2)}
                    fill="#10B981"
                    rx="3"
                    opacity={hoveredIndex === null || hoveredIndex === idx ? 0.9 : 0.4}
                  />
                  {/* Expense Bar */}
                  <rect
                    x={groupX + gap / 2}
                    y={svgHeight - paddingY - Math.max(expenseHeight, 2)}
                    width={barWidth}
                    height={Math.max(expenseHeight, 2)}
                    fill="#06B6D4"
                    rx="3"
                    opacity={hoveredIndex === null || hoveredIndex === idx ? 0.9 : 0.4}
                  />
                </g>
              );
            })
          )}

          {/* Month labels at bottom */}
          {monthsData.map((d, i) => {
            const x = paddingX + (i / (monthsData.length - 1)) * usableWidth;
            return (
              <text
                key={i}
                x={x}
                y={svgHeight - 6}
                textAnchor="middle"
                fontSize="11"
                fill="rgba(148, 163, 184, 0.8)"
                fontWeight="500"
              >
                {d.monthLabel}
              </text>
            );
          })}
        </svg>

        {/* Empty state overlay message if 0 */}
        {!hasAnyData && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-4">
            <span className="text-xs font-mono text-cyan-300 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-cyan-500/20 backdrop-blur-sm shadow-lg">
              Starting baseline at $0.00 — Add entries to watch the graph update in real-time
            </span>
          </div>
        )}

        {/* Hover Tooltip Overlay */}
        {hoveredIndex !== null && (
          <div
            className="pointer-events-none absolute -top-2 rounded-lg bg-slate-900/95 border border-white/15 px-3 py-2 text-xs shadow-xl backdrop-blur-md transition-all duration-150 z-20"
            style={{
              left: `${(hoveredIndex / (monthsData.length - 1)) * 80 + 10}%`,
              transform: 'translateX(-50%)',
            }}
          >
            <div className="font-semibold text-white mb-1">
              {monthsData[hoveredIndex].monthKey}
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <span>Income:</span>
              <span className="font-mono tabular-nums">
                +{currencySymbol}{monthsData[hoveredIndex].income.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-cyan-300">
              <span>Expenses:</span>
              <span className="font-mono tabular-nums">
                -{currencySymbol}{monthsData[hoveredIndex].expense.toFixed(2)}
              </span>
            </div>
            <div className="border-t border-white/10 mt-1 pt-1 text-slate-300 flex items-center justify-between">
              <span>Net:</span>
              <span className="font-mono font-semibold tabular-nums">
                {currencySymbol}
                {(
                  monthsData[hoveredIndex].income -
                  monthsData[hoveredIndex].expense
                ).toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Legend */}
      <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
            <span>Inflows (Income)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50" />
            <span>Outflows (Expenses)</span>
          </div>
        </div>

        {onQuickAdd && !hasAnyData && (
          <button
            onClick={onQuickAdd}
            className="text-cyan-400 hover:text-cyan-300 underline font-medium cursor-pointer"
          >
            + Enter first entry
          </button>
        )}
      </div>
    </div>
  );
};
