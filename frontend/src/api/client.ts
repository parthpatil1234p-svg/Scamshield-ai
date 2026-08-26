/**
 * src/api/client.ts
 * Axios HTTP client with JWT auth interceptor and typed error handling.
 * When VITE_API_BASE_URL is not set, defaults to relative /api/v1 (proxied by Vite).
 */
import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import type {
  AuthEnvelope,
  ScanResponse,
  ScanListResponse,
  DashboardStats,
  ScanCreateRequest,
  UserResponse,
} from '../types';

const rawBase = import.meta.env.VITE_API_BASE_URL || '';
const BASE_URL = rawBase.replace(/\/+$/, '');

export const apiClient = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// ─── Request Interceptor: inject Bearer token ──────────────────────────────
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('access_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Response Interceptor: handle 401 globally ────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Only redirect to /login on 401 if it's NOT an auth endpoint (login/register)
    const isAuthEndpoint = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register');
    if (error.response?.status === 401 && !isAuthEndpoint) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Helper: extract error message ────────────────────────────────────────
export function extractErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { error?: { message?: string }; detail?: unknown };
    if (data?.error?.message) return data.error.message;
    if (Array.isArray(data?.detail)) {
      // Pydantic validation error array
      return (data.detail as Array<{ msg: string }>).map((e) => e.msg).join('; ');
    }
    if (typeof data?.detail === 'string') return data.detail;
    if (err.message === 'Network Error') {
      return 'Unable to reach backend server. Please verify the backend is running.';
    }
  }
  if (err instanceof Error) return err.message;
  return 'An unexpected error occurred.';
}

// ─── Auth API ─────────────────────────────────────────────────────────────
export const authApi = {
  register: (email: string, password: string): Promise<AuthEnvelope> =>
    apiClient.post<AuthEnvelope>('/auth/register', { email, password }).then((r) => r.data),

  login: (email: string, password: string): Promise<AuthEnvelope> =>
    apiClient.post<AuthEnvelope>('/auth/login', { email, password }).then((r) => r.data),

  getMe: (): Promise<UserResponse> =>
    apiClient.get<UserResponse>('/auth/me').then((r) => r.data),
};

// ─── Scans API ────────────────────────────────────────────────────────────
export const scansApi = {
  createScan: (data: ScanCreateRequest): Promise<ScanResponse> =>
    apiClient.post<ScanResponse>('/scans', data).then((r) => r.data),

  listScans: (page = 1, limit = 20, risk_level?: string): Promise<ScanListResponse> => {
    const params: Record<string, unknown> = { page, limit };
    if (risk_level) params.risk_level = risk_level;
    return apiClient.get<ScanListResponse>('/scans', { params }).then((r) => r.data);
  },

  getScan: (scanId: string): Promise<ScanResponse> =>
    apiClient.get<ScanResponse>(`/scans/${scanId}`).then((r) => r.data),

  deleteScan: (scanId: string): Promise<void> =>
    apiClient.delete(`/scans/${scanId}`).then(() => undefined),

  getDashboardStats: (): Promise<DashboardStats> =>
    apiClient.get<DashboardStats>('/scans/dashboard/stats').then((r) => r.data),
};
