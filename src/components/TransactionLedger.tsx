import React, { useState } from 'react';
import { Plus, Search, Trash2, Edit2, ArrowUpDown, Calendar, CreditCard, ChevronLeft, ChevronRight } from 'lucide-react';
import { Transaction, Category } from '../types/expense';

interface TransactionLedgerProps {
  transactions: Transaction[];
  categories: Category[];
  onAddTransaction: () => void;
  onEditTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  currencySymbol?: string;
}

export const TransactionLedger: React.FC<TransactionLedgerProps> = ({
  transactions,
  categories,
  onAddTransaction,
  onEditTransaction,
  onDeleteTransaction,
  currencySymbol = '$',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'expense' | 'income'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortField, setSortField] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter & Sort
  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.notes && tx.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
      tx.categoryName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || tx.type === selectedType;
    const matchesCat = selectedCategory === 'all' || tx.categoryId === selectedCategory;
    return matchesSearch && matchesType && matchesCat;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortField === 'date') {
      const cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
      return sortOrder === 'desc' ? -cmp : cmp;
    } else {
      const cmp = a.amount - b.amount;
      return sortOrder === 'desc' ? -cmp : cmp;
    }
  });

  const totalPages = Math.max(1, Math.ceil(sortedTransactions.length / itemsPerPage));
  const paginatedTransactions = sortedTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleSort = (field: 'date' | 'amount') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="glass-panel rounded-xl border border-white/[0.08] overflow-hidden">
      {/* Table Toolbar */}
      <div className="p-4 sm:p-5 border-b border-white/[0.08] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-white">Transaction Ledger</h2>
          <div className="text-xs text-slate-400 mt-0.5">
            <span>{filteredTransactions.length} recorded entries</span>
            <span aria-hidden="true" className="mx-1.5 text-slate-600">·</span>
            <span>Real-time persistence</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search box */}
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search memo, vendor, notes..."
              className="glass-input w-full pl-9 pr-3 py-1.5 text-xs rounded-lg placeholder-slate-500"
            />
          </div>

          {/* Type Filter Buttons */}
          <div className="flex items-center gap-1 p-0.5 bg-white/[0.04] border border-white/[0.06] rounded-lg">
            <button
              onClick={() => {
                setSelectedType('all');
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                selectedType === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => {
                setSelectedType('expense');
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                selectedType === 'expense'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Expenses
            </button>
            <button
              onClick={() => {
                setSelectedType('income');
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                selectedType === 'income'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Income
            </button>
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="glass-input px-2.5 py-1.5 text-xs rounded-lg bg-slate-900 border border-white/[0.1] text-slate-300 cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Primary Action Button */}
          <button
            onClick={onAddTransaction}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 active:scale-[0.98] rounded-lg transition-all shadow-md shadow-cyan-600/20 cursor-pointer whitespace-nowrap shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Entry</span>
          </button>
        </div>
      </div>

      {/* High Density Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/[0.06] bg-white/[0.02] text-slate-400 uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4 font-medium">Description & Notes</th>
              <th className="py-3 px-4 font-medium">Category</th>
              <th
                className="py-3 px-4 font-medium cursor-pointer hover:text-white transition-colors"
                onClick={() => toggleSort('date')}
              >
                <div className="flex items-center gap-1">
                  <span>Date</span>
                  <ArrowUpDown className="h-3 w-3 text-slate-500" />
                </div>
              </th>
              <th className="py-3 px-4 font-medium">Payment Method</th>
              <th
                className="py-3 px-4 font-medium text-right cursor-pointer hover:text-white transition-colors"
                onClick={() => toggleSort('amount')}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Amount</span>
                  <ArrowUpDown className="h-3 w-3 text-slate-500" />
                </div>
              </th>
              <th className="py-3 px-4 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="hover:bg-white/[0.03] transition-colors group"
                >
                  {/* Title & Notes */}
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-100 flex items-center gap-2">
                      <span>{tx.title}</span>
                      {tx.isRecurring && (
                        <span className="text-[10px] text-cyan-400 font-mono">
                          recurring
                        </span>
                      )}
                    </div>
                    {tx.notes && (
                      <div className="text-[11px] text-slate-400 truncate max-w-xs mt-0.5">
                        {tx.notes}
                      </div>
                    )}
                  </td>

                  {/* Category unboxed text metadata */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-slate-300">
                      <span
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{ backgroundColor: tx.categoryColor }}
                      />
                      <span>{tx.categoryName}</span>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="py-3 px-4 text-slate-400 whitespace-nowrap font-mono tabular-nums">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3 text-slate-500" />
                      <span>{tx.date}</span>
                    </div>
                  </td>

                  {/* Payment Method */}
                  <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <CreditCard className="h-3 w-3 text-slate-500" />
                      <span>{tx.paymentMethod}</span>
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="py-3 px-4 text-right whitespace-nowrap font-mono tabular-nums text-sm font-semibold">
                    <span
                      className={
                        tx.type === 'income' ? 'text-emerald-400' : 'text-slate-100'
                      }
                    >
                      {tx.type === 'income' ? '+' : '-'}
                      {currencySymbol}
                      {tx.amount.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEditTransaction(tx)}
                        title="Edit entry"
                        className="p-1 rounded hover:bg-white/[0.08] text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteTransaction(tx.id)}
                        title="Delete entry"
                        className="p-1 rounded hover:bg-white/[0.08] text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <p className="text-sm font-medium text-slate-300">
                      No transactions match your current filters
                    </p>
                    <p className="text-xs text-slate-500 max-w-sm">
                      Try clearing your search query or log a new transaction.
                    </p>
                    <button
                      onClick={onAddTransaction}
                      className="mt-2 px-3 py-1.5 text-xs font-medium text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-lg transition-colors cursor-pointer"
                    >
                      Log First Transaction
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
          <div>
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, sortedTransactions.length)} of{' '}
            {sortedTransactions.length} entries
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded hover:bg-white/[0.08] disabled:opacity-40 disabled:pointer-events-none text-slate-300 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2 font-mono tabular-nums text-slate-200">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded hover:bg-white/[0.08] disabled:opacity-40 disabled:pointer-events-none text-slate-300 cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
