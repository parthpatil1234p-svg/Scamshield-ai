/**
 * src/context/AuthContext.tsx
 * React context providing authentication state (user, token) across the app.
 * Persists login to localStorage and provides login/logout helpers.
 */
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { UserResponse } from '../types';
import { authApi, extractErrorMessage } from '../api/client';

interface AuthContextValue {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const envelope = await authApi.login(email, password);
    localStorage.setItem('access_token', envelope.data.access_token);
    localStorage.setItem('user', JSON.stringify(envelope.data.user));
    setUser(envelope.data.user);
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    const envelope = await authApi.register(email, password);
    localStorage.setItem('access_token', envelope.data.access_token);
    localStorage.setItem('user', JSON.stringify(envelope.data.user));
    setUser(envelope.data.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

// Re-export for convenience
export { extractErrorMessage };
