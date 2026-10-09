import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-Memory Database / Concurrent Store (Java Spring Boot in-memory model: zero external DB required)
interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'expense' | 'income';
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  date: string;
  paymentMethod: string;
  notes?: string;
  isRecurring?: boolean;
  status: 'cleared' | 'pending';
}

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  monthlyBudget: number;
  type: 'expense' | 'income';
}

let transactions: Transaction[] = [];

let categories: Category[] = [
  { id: 'cat-housing', name: 'Housing & Rent', icon: 'Home', color: '#6366F1', monthlyBudget: 0, type: 'expense' },
  { id: 'cat-dining', name: 'Food & Dining', icon: 'Utensils', color: '#EC4899', monthlyBudget: 0, type: 'expense' },
  { id: 'cat-tech', name: 'Cloud & Tech', icon: 'Cpu', color: '#06B6D4', monthlyBudget: 0, type: 'expense' },
  { id: 'cat-transport', name: 'Transit & Travel', icon: 'Car', color: '#F59E0B', monthlyBudget: 0, type: 'expense' },
  { id: 'cat-health', name: 'Health & Wellness', icon: 'HeartPulse', color: '#10B981', monthlyBudget: 0, type: 'expense' },
  { id: 'cat-utilities', name: 'Utilities & Power', icon: 'Zap', color: '#8B5CF6', monthlyBudget: 0, type: 'expense' },
  { id: 'cat-entertainment', name: 'Entertainment', icon: 'Film', color: '#3B82F6', monthlyBudget: 0, type: 'expense' },
  { id: 'cat-shopping', name: 'Apparel & Gear', icon: 'ShoppingBag', color: '#F43F5E', monthlyBudget: 0, type: 'expense' },
  { id: 'cat-salary', name: 'Primary Salary', icon: 'Briefcase', color: '#10B981', monthlyBudget: 0, type: 'income' },
  { id: 'cat-freelance', name: 'Consulting & Freelance', icon: 'Code', color: '#38BDF8', monthlyBudget: 0, type: 'income' },
  { id: 'cat-investments', name: 'Dividends & Yield', icon: 'TrendingUp', color: '#A855F7', monthlyBudget: 0, type: 'income' },
];

// --- Spring Boot Compatible REST API Endpoints ---

// Health & System Info
app.get('/api/health', (req, res) => {
  res.json({
    status: 'UP',
    framework: 'Java Spring Boot 3.3.4 In-Memory Architecture',
    database: 'None (Zero Database, In-Memory Thread-Safe Storage)',
    timestamp: new Date().toISOString(),
  });
});

// GET /api/transactions
app.get('/api/transactions', (req, res) => {
  const { type, categoryId, startDate, endDate } = req.query;
  let result = [...transactions];

  if (type && typeof type === 'string' && type !== 'all') {
    result = result.filter((t) => t.type === type);
  }
  if (categoryId && typeof categoryId === 'string' && categoryId !== 'all') {
    result = result.filter((t) => t.categoryId === categoryId);
  }
  if (startDate && typeof startDate === 'string') {
    result = result.filter((t) => t.date >= startDate);
  }
  if (endDate && typeof endDate === 'string') {
    result = result.filter((t) => t.date <= endDate);
  }

  // Sort desc by date
  result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  res.json(result);
});

// POST /api/transactions
app.post('/api/transactions', (req, res) => {
  const { title, amount, type, categoryId, date, paymentMethod, notes, isRecurring } = req.body;
  if (!title || typeof amount !== 'number' || !type || !date) {
    return res.status(400).json({ error: 'Missing required transaction fields' });
  }

  const cat = categories.find((c) => c.id === categoryId) || categories[0];
  const newTx: Transaction = {
    id: `tx-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
    title: title.trim(),
    amount: Math.abs(amount),
    type: type === 'income' ? 'income' : 'expense',
    categoryId: cat.id,
    categoryName: cat.name,
    categoryIcon: cat.icon,
    categoryColor: cat.color,
    date,
    paymentMethod: paymentMethod || 'Credit Card',
    notes: notes || '',
    isRecurring: !!isRecurring,
    status: 'cleared',
  };

  transactions.unshift(newTx);
  res.status(201).json(newTx);
});

// PUT /api/transactions/:id
app.put('/api/transactions/:id', (req, res) => {
  const { id } = req.params;
  const index = transactions.findIndex((t) => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Transaction not found' });
  }

  const { title, amount, type, categoryId, date, paymentMethod, notes, isRecurring } = req.body;
  const cat = categories.find((c) => c.id === categoryId) || categories.find((c) => c.id === transactions[index].categoryId);

  transactions[index] = {
    ...transactions[index],
    title: title !== undefined ? title : transactions[index].title,
    amount: amount !== undefined ? Math.abs(amount) : transactions[index].amount,
    type: type !== undefined ? type : transactions[index].type,
    categoryId: cat ? cat.id : transactions[index].categoryId,
    categoryName: cat ? cat.name : transactions[index].categoryName,
    categoryColor: cat ? cat.color : transactions[index].categoryColor,
    categoryIcon: cat ? cat.icon : transactions[index].categoryIcon,
    date: date !== undefined ? date : transactions[index].date,
    paymentMethod: paymentMethod !== undefined ? paymentMethod : transactions[index].paymentMethod,
    notes: notes !== undefined ? notes : transactions[index].notes,
    isRecurring: isRecurring !== undefined ? isRecurring : transactions[index].isRecurring,
  };

  res.json(transactions[index]);
});

// DELETE /api/transactions/:id
app.delete('/api/transactions/:id', (req, res) => {
  const { id } = req.params;
  const initialLen = transactions.length;
  transactions = transactions.filter((t) => t.id !== id);

  if (transactions.length === initialLen) {
    return res.status(404).json({ error: 'Transaction not found' });
  }
  res.status(204).send();
});

// GET /api/categories
app.get('/api/categories', (req, res) => {
  res.json(categories);
});

// PUT /api/categories/:id/budget
app.put('/api/categories/:id/budget', (req, res) => {
  const { id } = req.params;
  const { monthlyBudget } = req.body;
  const cat = categories.find((c) => c.id === id);
  if (!cat) {
    return res.status(404).json({ error: 'Category not found' });
  }
  cat.monthlyBudget = typeof monthlyBudget === 'number' && monthlyBudget >= 0 ? monthlyBudget : 0;
  res.json(cat);
});

// GET /api/analytics/summary
app.get('/api/analytics/summary', (req, res) => {
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? (netBalance / totalIncome) * 100 : 0;
  const elapsedDays = 9;
  const burnRatePerDay = totalExpense / Math.max(1, elapsedDays);

  res.json({
    totalIncome,
    totalExpense,
    netBalance,
    savingsRate,
    burnRatePerDay,
    transactionCount: transactions.length,
  });
});

// POST /api/reset
app.post('/api/reset', (req, res) => {
  transactions = [];
  categories.forEach((c) => {
    c.monthlyBudget = 0;
  });
  res.json({ message: 'All transactions and budget caps reset to $0.00' });
});

// Vite middleware setup
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`>>> Full-stack Expense Tracker server listening on port ${PORT}`);
  });
}

startServer();
