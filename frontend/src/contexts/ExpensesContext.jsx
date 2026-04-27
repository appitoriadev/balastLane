import { createContext, useContext, useState, useCallback } from 'react';
import { expensesService } from '../services/expenses.service';

const ExpensesContext = createContext(null);

export function ExpensesProvider({ children }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  /** GET /api/Expenses — fetches and replaces the local list. */
  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await expensesService.getAll();
      setExpenses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  /** POST /api/Expenses */
  const createExpense = async (dto) => {
    const created = await expensesService.create(dto);
    setExpenses((prev) =>
      [created, ...prev].sort((a, b) => new Date(b.date) - new Date(a.date))
    );
    return created;
  };

  /** PUT /api/Expenses/{id} */
  const updateExpense = async (id, dto) => {
    const updated = await expensesService.update(id, dto);
    setExpenses((prev) =>
      prev
        .map((e) => (e.id === id ? updated : e))
        .sort((a, b) => new Date(b.date) - new Date(a.date))
    );
    return updated;
  };

  /** DELETE /api/Expenses/{id} */
  const deleteExpense = async (id) => {
    await expensesService.delete(id);
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <ExpensesContext.Provider
      value={{ expenses, loading, error, fetchExpenses, createExpense, updateExpense, deleteExpense }}
    >
      {children}
    </ExpensesContext.Provider>
  );
}

export function useExpenses() {
  const ctx = useContext(ExpensesContext);
  if (!ctx) throw new Error('useExpenses must be used inside <ExpensesProvider>');
  return ctx;
}
