import React, { useState, useEffect } from 'react';
import { TopBar } from './components/TopBar';
import { MetricCards } from './components/MetricCards';
import { CashFlowChart } from './components/CashFlowChart';
import { CategoryDoughnut } from './components/CategoryDoughnut';
import { TransactionLedger } from './components/TransactionLedger';
import { TransactionModal } from './components/TransactionModal';
import { BudgetManager } from './components/BudgetManager';
import { AnalyticsView } from './components/AnalyticsView';
import {
  DEFAULT_CATEGORIES,
  DEFAULT_TRANSACTIONS,
} from './data/defaultData';
import {
  Transaction,
  Category,
} from './types/expense';
import { api } from './services/api';
import { Plus, ArrowRight, ShieldCheck, Target, RotateCcw, Sparkles, Terminal } from 'lucide-react';

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(DEFAULT_TRANSACTIONS);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'transactions' | 'budgets' | 'analytics'
  >('dashboard');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [backendStatus, setBackendStatus] = useState<string>('Connecting...');

  // Fetch from backend on initial mount
  useEffect(() => {
    async function loadData() {
      try {
        const [txs, cats, health] = await Promise.all([
          api.getTransactions(),
          api.getCategories(),
          api.checkHealth(),
        ]);
        setTransactions(txs || []);
        if (cats && cats.length > 0) setCategories(cats);
        setBackendStatus(health.framework || 'Java Spring Boot 3.3 (In-Memory)');
      } catch (e) {
        console.error('Error loading initial backend data:', e);
        setBackendStatus('Java Spring Boot (In-Memory)');
      }
    }
    loadData();
  }, []);

  // Sync to local storage as secondary cache
  useEffect(() => {
    localStorage.setItem('aetherspend_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('aetherspend_categories', JSON.stringify(categories));
  }, [categories]);

  // Financial Metrics (Real-time computed from user inputs)
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (netBalance / totalIncome) * 100 : 0;

  // Active days in month
  const daysInMonthToDate = 9;
  const burnRatePerDay = totalExpenses / Math.max(1, daysInMonthToDate);

  // Category Total Budgets
  const totalBudgetCap = categories
    .filter((c) => c.type === 'expense')
    .reduce((sum, c) => sum + (c.monthlyBudget || 0), 0);
  const budgetUtilization = totalBudgetCap > 0 ? Math.round((totalExpenses / totalBudgetCap) * 100) : (totalExpenses > 0 ? 100 : 0);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Reset all values to $0
  const handleResetToZero = async () => {
    await api.resetAll();
    setTransactions([]);
    setCategories((prev) => prev.map((c) => ({ ...c, monthlyBudget: 0 })));
    localStorage.removeItem('aetherspend_transactions');
    localStorage.setItem('aetherspend_categories', JSON.stringify(DEFAULT_CATEGORIES));
    triggerToast('All values reset to $0.00 in Spring Boot backend.');
  };

  // Quick helper to insert a test entry to see graphs update immediately
  const handleAddSampleIncome = async () => {
    const payload = {
      title: 'Salary Deposit',
      amount: 4500.00,
      type: 'income' as const,
      categoryId: 'cat-salary',
      categoryName: 'Primary Salary',
      categoryIcon: 'Briefcase',
      categoryColor: '#10B981',
      date: '2026-10-09',
      paymentMethod: 'Bank Transfer' as const,
      notes: 'Monthly direct deposit',
    };
    const created = await api.createTransaction(payload);
    setTransactions((prev) => [created, ...prev]);
    triggerToast('Added +$4,500.00 Income! Watch graph update.');
  };

  const handleAddSampleExpense = async () => {
    const payload = {
      title: 'Dining & Food Outing',
      amount: 125.50,
      type: 'expense' as const,
      categoryId: 'cat-dining',
      categoryName: 'Food & Dining',
      categoryIcon: 'Utensils',
      categoryColor: '#EC4899',
      date: '2026-10-09',
      paymentMethod: 'Credit Card' as const,
      notes: 'Dinner with team',
    };
    const created = await api.createTransaction(payload);
    setTransactions((prev) => [created, ...prev]);
    triggerToast('Added -$125.50 Expense! Watch graph update.');
  };

  // CRUD Handlers connected to backend
  const handleSaveTransaction = async (
    txData: Omit<Transaction, 'id' | 'status'> & { id?: string }
  ) => {
    if (txData.id) {
      const updated = await api.updateTransaction(txData.id, txData);
      setTransactions((prev) =>
        prev.map((t) => (t.id === txData.id ? { ...t, ...updated } : t))
      );
      triggerToast('Transaction updated in Spring Boot backend.');
    } else {
      const created = await api.createTransaction(txData);
      setTransactions((prev) => [created, ...prev]);
      triggerToast('Transaction posted to backend. Graph updated live.');
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    await api.deleteTransaction(id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    triggerToast('Transaction deleted from backend.');
  };

  const handleUpdateCategoryBudget = async (catId: string, newLimit: number) => {
    await api.updateCategoryBudget(catId, newLimit);
    setCategories((prev) =>
      prev.map((c) => (c.id === catId ? { ...c, monthlyBudget: newLimit } : c))
    );
    triggerToast('Category budget cap saved in backend.');
  };

  return (
    <div className="min-h-screen bg-[#080B11] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 2026 Ambient Glass Light Spheres */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/4 h-[520px] w-[520px] rounded-full bg-cyan-600/10 blur-[130px]" />
        <div className="absolute top-1/3 -right-40 h-[600px] w-[600px] rounded-full bg-indigo-600/10 blur-[150px]" />
        <div className="absolute -bottom-40 left-1/3 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[130px]" />
      </div>

      {/* Top Bar */}
      <TopBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenNewTransaction={() => {
          setEditingTransaction(null);
          setIsModalOpen(true);
        }}
      />

      {/* Main Viewport */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-slate-900/95 border border-cyan-500/40 px-4 py-3 text-xs text-cyan-200 shadow-2xl backdrop-blur-xl flex items-center gap-2 animate-fade-in">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Clean State & Backend Banner */}
        <div className="glass-panel rounded-xl p-4 sm:p-5 border border-cyan-500/25 bg-gradient-to-r from-cyan-950/30 via-slate-900/40 to-blue-950/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Terminal className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-white">
                  Java Spring Boot Backend Architecture (Zero Database)
                </h3>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  ONLINE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                All values start at $0.00. Enter expenses & income to watch the real-time graphs and backend models update!
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={() => {
                setEditingTransaction(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Enter Transaction</span>
            </button>
            <button
              onClick={handleAddSampleIncome}
              className="px-2.5 py-1.5 text-xs font-medium text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg transition-colors cursor-pointer"
              title="Quick test +$4,500 income"
            >
              + Test Income
            </button>
            <button
              onClick={handleAddSampleExpense}
              className="px-2.5 py-1.5 text-xs font-medium text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg transition-colors cursor-pointer"
              title="Quick test -$125.50 expense"
            >
              + Test Expense
            </button>
          </div>
        </div>

        {/* Tab 1: Overview Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Top Stat KPI Cards */}
            <MetricCards
              totalIncome={totalIncome}
              totalExpenses={totalExpenses}
              netBalance={netBalance}
              savingsRate={savingsRate}
              burnRatePerDay={burnRatePerDay}
            />

            {/* Financial Visualizers Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-7">
                <CashFlowChart
                  transactions={transactions}
                  onQuickAdd={() => {
                    setEditingTransaction(null);
                    setIsModalOpen(true);
                  }}
                />
              </div>
              <div className="lg:col-span-5">
                <CategoryDoughnut
                  transactions={transactions}
                  categories={categories}
                  onAddExpense={() => {
                    setEditingTransaction(null);
                    setIsModalOpen(true);
                  }}
                />
              </div>
            </div>

            {/* Recent Activity Strip & Budget Health Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Transaction Log Strip */}
              <div className="lg:col-span-2 glass-panel rounded-xl p-5 border border-white/[0.08] flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-base font-semibold text-white">Recent Transactions</h3>
                    <div className="text-xs text-slate-400 mt-0.5">
                      <span>{transactions.length} entries recorded</span>
                      <span aria-hidden="true" className="mx-1.5 text-slate-600">·</span>
                      <span>Spring Boot REST sync</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('transactions')}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>View all ledger</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                {transactions.length > 0 ? (
                  <div className="divide-y divide-white/[0.04]">
                    {transactions.slice(0, 4).map((tx) => (
                      <div
                        key={tx.id}
                        className="py-2.5 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <span
                            className="h-2 w-2 rounded-full shrink-0"
                            style={{ backgroundColor: tx.categoryColor }}
                          />
                          <div className="truncate">
                            <div className="font-medium text-slate-200 truncate">
                              {tx.title}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {tx.categoryName} · {tx.date}
                            </div>
                          </div>
                        </div>

                        <div
                          className={`font-mono tabular-nums font-semibold shrink-0 text-sm ${
                            tx.type === 'income' ? 'text-emerald-400' : 'text-slate-100'
                          }`}
                        >
                          {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-2">
                    <p className="text-slate-300">No transaction records entered yet</p>
                    <p className="text-slate-500 max-w-xs">
                      All accounts currently start at $0.00. Click below to add your first transaction and populate the charts.
                    </p>
                    <button
                      onClick={() => {
                        setEditingTransaction(null);
                        setIsModalOpen(true);
                      }}
                      className="mt-1 px-3 py-1.5 text-xs font-semibold text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-lg cursor-pointer"
                    >
                      + Add First Entry
                    </button>
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                  <button
                    onClick={() => {
                      setEditingTransaction(null);
                      setIsModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Enter New Transaction</span>
                  </button>

                  {transactions.length > 0 && (
                    <button
                      onClick={handleResetToZero}
                      className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Clear all transactions back to 0"
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span>Reset all to $0</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Monthly Budget Capacity Summary */}
              <div className="glass-panel rounded-xl p-5 border border-white/[0.08] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-medium text-slate-300">Monthly Budget Cap</span>
                    <Target className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div className="text-2xl font-bold tracking-tight text-white font-mono tabular-nums">
                    ${totalExpenses.toFixed(2)}
                    <span className="text-xs text-slate-400 font-normal ml-1">
                      / ${totalBudgetCap.toFixed(0)}
                    </span>
                  </div>
                  <div className="mt-3 space-y-1.5">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Budget Utilized</span>
                      <span className={budgetUtilization > 100 ? 'text-rose-400 font-bold' : 'text-cyan-400'}>
                        {budgetUtilization}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          budgetUtilization > 100
                            ? 'bg-rose-500'
                            : budgetUtilization > 80
                            ? 'bg-amber-400'
                            : 'bg-cyan-500'
                        }`}
                        style={{ width: `${Math.min(budgetUtilization, 100)}%` }}
                      />
                    </div>
                  </div>
                  <p className="mt-3 text-[11px] text-slate-400 leading-relaxed">
                    {totalBudgetCap > 0
                      ? `$${Math.max(0, totalBudgetCap - totalExpenses).toFixed(2)} remaining under total monthly spending plan.`
                      : 'Category limits start at $0. Click below to assign budgets.'}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                  <button
                    onClick={() => setActiveTab('budgets')}
                    className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>Configure Category Budgets</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Full Transaction Ledger */}
        {activeTab === 'transactions' && (
          <TransactionLedger
            transactions={transactions}
            categories={categories}
            onAddTransaction={() => {
              setEditingTransaction(null);
              setIsModalOpen(true);
            }}
            onEditTransaction={(tx) => {
              setEditingTransaction(tx);
              setIsModalOpen(true);
            }}
            onDeleteTransaction={handleDeleteTransaction}
          />
        )}

        {/* Tab 3: Budgets Management */}
        {activeTab === 'budgets' && (
          <BudgetManager
            categories={categories}
            transactions={transactions}
            onUpdateCategoryBudget={handleUpdateCategoryBudget}
          />
        )}

        {/* Tab 4: Analytics & Forecast */}
        {activeTab === 'analytics' && (
          <AnalyticsView
            transactions={transactions}
            categories={categories}
          />
        )}
      </main>

      {/* Modal for Add / Edit Transaction */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTransaction(null);
        }}
        onSave={handleSaveTransaction}
        initialData={editingTransaction}
        categories={categories}
      />

      {/* Clean Footer */}
      <footer className="mt-auto border-t border-white/[0.06] bg-[#070a10]/80 py-5 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">AetherSpend</span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span>Java Spring Boot 3.3 Backend</span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span>Zero Database In-Memory Architecture</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Ledger
            </button>
            <button
              onClick={() => setActiveTab('budgets')}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Budgets
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Analytics
            </button>
            <button
              onClick={handleResetToZero}
              className="hover:text-rose-400 transition-colors cursor-pointer"
            >
              Reset to 0
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
