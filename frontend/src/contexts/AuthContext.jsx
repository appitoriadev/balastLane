import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]         = useState(null);
  const [isLoading, setLoading] = useState(true);
  const navigate                = useNavigate();

  // On mount, restore session from stored token.
  // The backend has no /me endpoint, so we simply check token presence.
  useEffect(() => {
    if (authService.isAuthenticated()) {
      setUser({ username: 'admin' });
    }
    setLoading(false);
  }, []);

  /**
   * POST /api/Auth/login — stores the JWT and redirects to /dashboard.
   * @param {string} username
   * @param {string} password
   */
  const login = async (username, password) => {
    await authService.login(username, password);
    setUser({ username });
    navigate('/dashboard');
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
