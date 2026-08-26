/**
 * src/components/ProtectedRoute.tsx
 * Auth guard — redirects unauthenticated users to /login.
 * Preserves the intended destination in redirect query parameter.
 */
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'var(--color-bg-base)' }}
      >
        <div
          className="w-8 h-8 rounded-full border-2 animate-spin-fast"
          style={{
            borderColor: 'var(--color-border)',
            borderTopColor: 'var(--color-brand)',
          }}
          aria-label="Loading"
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  return <Outlet />;
}
