import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Wraps protected routes. Redirects to /login if the user is not authenticated.
 * Shows nothing while the auth state is being determined (avoids flash of login page).
 */
export default function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-dvh items-center justify-center bg-gray-50">
        <div className="w-8 h-8 rounded-full border-4 border-primary-200 border-t-primary-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
