import { api } from '../utils/api';

/**
 * Mirrors CategoriesController endpoints.
 *
 * CategoryDto fields (camelCase over the wire):
 *   id (Guid), categoryName, createdAt
 */
export const categoriesService = {
  /** GET /api/Categories */
  getAll() {
    return api.get('/api/Categories');
  },

  /** GET /api/Categories/{id} */
  getById(id) {
    return api.get(`/api/Categories/${id}`);
  },

  /** POST /api/Categories — body: { categoryName } */
  create(categoryName) {
    return api.post('/api/Categories', { categoryName });
  },

  /** PUT /api/Categories/{id} — body: { categoryName } */
  update(id, categoryName) {
    return api.put(`/api/Categories/${id}`, { categoryName });
  },

  /** DELETE /api/Categories/{id} */
  delete(id) {
    return api.delete(`/api/Categories/${id}`);
  },
};
