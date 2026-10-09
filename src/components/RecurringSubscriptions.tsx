import React, { useState } from 'react';
import { Calendar, CheckCircle2, Plus, Server, Home, Wifi, Music, Activity, CreditCard } from 'lucide-react';
import { RecurringBill } from '../types/expense';

interface RecurringSubscriptionsProps {
  bills: RecurringBill[];
  onAddBill: (bill: Omit<RecurringBill, 'id'>) => void;
  onToggleAutoPay: (id: string) => void;
  onDeleteBill: (id: string) => void;
  currencySymbol?: string;
}

export const RecurringSubscriptions: React.FC<RecurringSubscriptionsProps> = ({
  bills,
  onAddBill,
  onToggleAutoPay,
  onDeleteBill,
  currencySymbol = '$',
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newFrequency, setNewFrequency] = useState<'Monthly' | 'Yearly' | 'Weekly'>('Monthly');
  const [newDueDate, setNewDueDate] = useState('');

  const totalMonthlyCommitment = bills.reduce((sum, b) => {
    if (b.frequency === 'Monthly') return sum + b.amount;
    if (b.frequency === 'Yearly') return sum + b.amount / 12;
    if (b.frequency === 'Weekly') return sum + b.amount * 4.33;
    return sum + b.amount;
  }, 0);

  const getServiceIcon = (logo: string) => {
    switch (logo) {
      case 'Database':
        return <Server className="h-4 w-4 text-cyan-400" />;
      case 'Home':
        return <Home className="h-4 w-4 text-indigo-400" />;
      case 'Wifi':
        return <Wifi className="h-4 w-4 text-purple-400" />;
      case 'Music':
        return <Music className="h-4 w-4 text-emerald-400" />;
      case 'Activity':
        return <Activity className="h-4 w-4 text-amber-400" />;
      default:
        return <CreditCard className="h-4 w-4 text-cyan-400" />;
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(newAmount);
    if (!newTitle.trim() || isNaN(val) || val <= 0 || !newDueDate) return;

    onAddBill({
      title: newTitle.trim(),
      amount: val,
      categoryId: 'cat-tech',
      categoryName: 'Cloud & Tech',
      frequency: newFrequency,
      nextDueDate: newDueDate,
      autoPay: true,
      logo: 'CreditCard',
    });

    setNewTitle('');
    setNewAmount('');
    setNewDueDate('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Commitment Card */}
      <div className="glass-panel rounded-xl p-5 border border-white/[0.08] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-white">Active Subscriptions & Recurring Bills</h2>
          <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
            <span>Fixed Monthly Outflow</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="font-mono tabular-nums text-cyan-300 font-medium">
              {currencySymbol}{totalMonthlyCommitment.toFixed(2)}/mo
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>{showAddForm ? 'Cancel' : 'Track New Subscription'}</span>
        </button>
      </div>

      {/* Add Subscription Drawer / Form */}
      {showAddForm && (
        <form
          onSubmit={handleCreate}
          className="glass-panel rounded-xl p-5 border border-cyan-500/20 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end animate-fade-in"
        >
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Service / Bill</label>
            <input
              type="text"
              required
              placeholder="e.g. GitHub Copilot, Netflix"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="glass-input w-full px-3 py-1.5 text-xs rounded-lg"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Amount ($ USD)</label>
            <input
              type="number"
              step="0.01"
              required
              placeholder="0.00"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              className="glass-input w-full px-3 py-1.5 text-xs rounded-lg font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Next Billing Date</label>
            <input
              type="date"
              required
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              className="glass-input w-full px-3 py-1.5 text-xs rounded-lg font-mono"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-2 text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-lg transition-colors cursor-pointer"
            >
              Add Subscription
            </button>
          </div>
        </form>
      )}

      {/* Bills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bills.map((bill) => (
          <div
            key={bill.id}
            className="glass-card rounded-xl p-4.5 border border-white/[0.08] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-white/[0.05] border border-white/[0.08]">
                    {getServiceIcon(bill.logo)}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{bill.title}</h3>
                    <div className="text-[11px] text-slate-400">{bill.categoryName}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-base font-bold text-white font-mono tabular-nums">
                    {currencySymbol}{bill.amount.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                    {bill.frequency}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 py-2 border-t border-white/[0.05]">
                <div className="flex items-center gap-1.5 font-mono">
                  <Calendar className="h-3.5 w-3.5 text-slate-500" />
                  <span>Due {bill.nextDueDate}</span>
                </div>

                <button
                  onClick={() => onToggleAutoPay(bill.id)}
                  className={`flex items-center gap-1 cursor-pointer transition-colors ${
                    bill.autoPay ? 'text-emerald-400 hover:text-emerald-300' : 'text-slate-500 hover:text-slate-400'
                  }`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>{bill.autoPay ? 'Auto-Pay On' : 'Manual Pay'}</span>
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => onDeleteBill(bill.id)}
                className="text-[11px] text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
