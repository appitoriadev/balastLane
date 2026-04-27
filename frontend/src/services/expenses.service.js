import { api } from '../utils/api';

/**
 * Mirrors ExpensesController endpoints.
 *
 * ExpenseResponseDto fields (camelCase over the wire):
 *   id (int), title, amount, category, date
 *
 * CreateExpenseDto / UpdateExpenseDto fields:
 *   title, amount, category, date
 */
export const expensesService = {
  /** GET /api/Expenses — returns ExpenseResponseDto[] sorted by date DESC */
  getAll() {
    return api.get('/api/Expenses');
  },

  /** GET /api/Expenses/{id} */
  getById(id) {
    return api.get(`/api/Expenses/${id}`);
  },

  /** POST /api/Expenses */
  create(dto) {
    return api.post('/api/Expenses', dto);
  },

  /** PUT /api/Expenses/{id} */
  update(id, dto) {
    return api.put(`/api/Expenses/${id}`, dto);
  },

  /** DELETE /api/Expenses/{id} */
  delete(id) {
    return api.delete(`/api/Expenses/${id}`);
  },
};
