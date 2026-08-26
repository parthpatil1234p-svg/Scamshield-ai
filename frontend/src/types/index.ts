/**
 * src/types/index.ts
 * Shared TypeScript type definitions matching the backend Pydantic schemas.
 * These are the single source of truth for frontend data contracts.
 */

// ─── Auth ─────────────────────────────────────────────────────────────────
export interface UserResponse {
  user_id: string;
  email: string;
  is_active: boolean;
  created_at: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in_seconds: number;
  user: UserResponse;
}

export interface AuthEnvelope {
  success: boolean;
  data: TokenResponse;
}

// ─── Scans ────────────────────────────────────────────────────────────────
export type AnalysisType = 'text' | 'url' | 'combined';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type IndicatorSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface IndicatorDetail {
  code: string;
  name: string;
  severity: IndicatorSeverity;
  weight: number;
  evidence: string;
  explanation: string;
}

export interface ModelMetadata {
  analysis_version: string;
  model_version: string;
  inference_latency_ms: number;
}

export interface ScanResponse {
  scan_id: string;
  user_id: string;
  analysis_type: AnalysisType;
  submitted_text?: string;
  submitted_url?: string;
  risk_score: number;
  risk_level: RiskLevel;
  low_confidence: boolean;
  text_sub_score?: number;
  url_sub_score?: number;
  detected_indicators: IndicatorDetail[];
  summary: string;
  recommendations: string[];
  model_metadata: ModelMetadata;
  created_at: string;
}

export interface ScanSummaryItem {
  scan_id: string;
  analysis_type: AnalysisType;
  risk_score: number;
  risk_level: RiskLevel;
  indicator_count: number;
  summary_preview: string;
  created_at: string;
}

export interface ScanPagination {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface ScanListResponse {
  success: boolean;
  data: ScanSummaryItem[];
  pagination: ScanPagination;
}

export interface DashboardStats {
  total_scans: number;
  low_risk_scans: number;
  medium_risk_scans: number;
  high_risk_scans: number;
  critical_risk_scans: number;
}

// ─── API Error ────────────────────────────────────────────────────────────
export interface ApiErrorDetail {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiErrorDetail;
}

// ─── Scan Request ─────────────────────────────────────────────────────────
export interface ScanCreateRequest {
  analysis_type: AnalysisType;
  text?: string;
  url?: string;
}
