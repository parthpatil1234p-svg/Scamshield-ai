/**
 * src/components/GuestRoute.tsx
 * Redirects already-authenticated users away from login/register pages
 * to the dashboard, preventing unnecessary re-auth.
 */
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function GuestRoute() {
  const { isAuthenticated, isLoading } = useAuth();

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

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
