import { api } from '../utils/api';

const TOKEN_KEY = 'et_token';

export const authService = {
  /**
   * POST /api/Auth/login
   * Request body matches LoginRequest record: { username, password }
   * Response matches LoginResponse record: { token, expiresAt }
   */
  async login(username, password) {
    const data = await api.post('/api/Auth/login', { username, password });
    localStorage.setItem(TOKEN_KEY, data.token);
    return data;
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  isAuthenticated() {
    return Boolean(localStorage.getItem(TOKEN_KEY));
  },
};
