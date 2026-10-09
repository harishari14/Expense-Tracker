export type TransactionType = 'expense' | 'income';

export type PaymentMethod = 'Credit Card' | 'Debit Card' | 'Bank Transfer' | 'Cash' | 'Crypto' | 'Apple Pay';

export type TransactionStatus = 'cleared' | 'pending';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  date: string; // YYYY-MM-DD
  paymentMethod: PaymentMethod;
  notes?: string;
  isRecurring?: boolean;
  status: TransactionStatus;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  monthlyBudget: number;
  type: TransactionType;
}

export interface Budget {
  id: string;
  categoryId: string;
  categoryName: string;
  limit: number;
  month: string; // YYYY-MM
}

export interface RecurringBill {
  id: string;
  title: string;
  amount: number;
  categoryId: string;
  categoryName: string;
  frequency: 'Monthly' | 'Yearly' | 'Weekly';
  nextDueDate: string;
  autoPay: boolean;
  logo: string;
}

export interface RenderConnectionSettings {
  useLiveApi: boolean;
  backendUrl: string; // e.g. https://my-expense-tracker-api.onrender.com
  postgresUrl: string; // e.g. postgres://user:password@dpg-xxxx.oregon-postgres.render.com/expense_db
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
  lastPing?: string;
  errorMessage?: string;
}

export interface MonthlyFinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  savingsRate: number; // percentage
  burnRatePerDay: number;
  projectedMonthEndExpense: number;
}
