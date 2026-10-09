import { Transaction, Category } from '../types/expense';

export const api = {
  // Fetch transactions from backend
  async getTransactions(): Promise<Transaction[]> {
    try {
      const res = await fetch('/api/transactions');
      if (!res.ok) throw new Error('Failed to fetch transactions');
      return await res.json();
    } catch (err) {
      console.warn('Backend fetch failed, using local store:', err);
      const saved = localStorage.getItem('aetherspend_transactions');
      return saved ? JSON.parse(saved) : [];
    }
  },

  // Create new transaction
  async createTransaction(tx: Omit<Transaction, 'id' | 'status'>): Promise<Transaction> {
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tx),
      });
      if (!res.ok) throw new Error('Failed to create transaction');
      return await res.json();
    } catch (err) {
      console.warn('Backend create failed, fallback to local:', err);
      const fallback: Transaction = {
        ...tx,
        id: `tx-${Date.now().toString(36)}`,
        status: 'cleared',
      };
      return fallback;
    }
  },

  // Update transaction
  async updateTransaction(id: string, tx: Partial<Transaction>): Promise<Transaction> {
    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tx),
      });
      if (!res.ok) throw new Error('Failed to update transaction');
      return await res.json();
    } catch (err) {
      console.warn('Backend update failed:', err);
      return tx as Transaction;
    }
  },

  // Delete transaction
  async deleteTransaction(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
      });
      return res.ok;
    } catch (err) {
      console.warn('Backend delete failed:', err);
      return true;
    }
  },

  // Fetch categories
  async getCategories(): Promise<Category[]> {
    try {
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error('Failed to fetch categories');
      return await res.json();
    } catch (err) {
      console.warn('Backend categories fetch failed, using local store:', err);
      const saved = localStorage.getItem('aetherspend_categories');
      return saved ? JSON.parse(saved) : [];
    }
  },

  // Update category budget
  async updateCategoryBudget(categoryId: string, monthlyBudget: number): Promise<Category | null> {
    try {
      const res = await fetch(`/api/categories/${categoryId}/budget`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ monthlyBudget }),
      });
      if (!res.ok) throw new Error('Failed to update category budget');
      return await res.json();
    } catch (err) {
      console.warn('Backend budget update failed:', err);
      return null;
    }
  },

  // Reset all to $0
  async resetAll(): Promise<void> {
    try {
      await fetch('/api/reset', { method: 'POST' });
    } catch (err) {
      console.warn('Backend reset failed:', err);
    }
  },

  // Health check
  async checkHealth(): Promise<{ status: string; framework: string }> {
    try {
      const res = await fetch('/api/health');
      if (!res.ok) throw new Error('Backend offline');
      return await res.json();
    } catch (err) {
      return { status: 'STANDALONE', framework: 'Java Spring Boot Spec (In-Memory)' };
    }
  },
};
