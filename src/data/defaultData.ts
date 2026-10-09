import { Category, Transaction, RecurringBill } from '../types/expense';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-housing', name: 'Housing & Rent', icon: 'Home', color: '#6366F1', monthlyBudget: 0, type: 'expense' },
  { id: 'cat-dining', name: 'Food & Dining', icon: 'Utensils', color: '#EC4899', monthlyBudget: 0, type: 'expense' },
  { id: 'cat-tech', name: 'Cloud & Tech', icon: 'Cpu', color: '#06B6D4', monthlyBudget: 0, type: 'expense' },
  { id: 'cat-transport', name: 'Transit & Travel', icon: 'Car', color: '#F59E0B', monthlyBudget: 0, type: 'expense' },
  { id: 'cat-health', name: 'Health & Wellness', icon: 'HeartPulse', color: '#10B981', monthlyBudget: 0, type: 'expense' },
  { id: 'cat-utilities', name: 'Utilities & Power', icon: 'Zap', color: '#8B5CF6', monthlyBudget: 0, type: 'expense' },
  { id: 'cat-entertainment', name: 'Entertainment', icon: 'Film', color: '#3B82F6', monthlyBudget: 0, type: 'expense' },
  { id: 'cat-shopping', name: 'Apparel & Gear', icon: 'ShoppingBag', color: '#F43F5E', monthlyBudget: 0, type: 'expense' },
  // Income categories
  { id: 'cat-salary', name: 'Primary Salary', icon: 'Briefcase', color: '#10B981', monthlyBudget: 0, type: 'income' },
  { id: 'cat-freelance', name: 'Consulting & Freelance', icon: 'Code', color: '#38BDF8', monthlyBudget: 0, type: 'income' },
  { id: 'cat-investments', name: 'Dividends & Yield', icon: 'TrendingUp', color: '#A855F7', monthlyBudget: 0, type: 'income' },
];

// Clean slate: all transactions start at zero
export const DEFAULT_TRANSACTIONS: Transaction[] = [];

// Clean slate: all recurring bills start at zero
export const DEFAULT_RECURRING_BILLS: RecurringBill[] = [];
