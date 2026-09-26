// Core type definitions for One Stop Platform

export type ViewMode = "grid" | "split" | "digest";

export type QueryMode = "fast" | "deep";

export interface AIEngine {
  id: string;
  name: string;
  provider: string;
  model: string;
  color: string;
  glowColor: string;
  badge: string;
  icon: string;
  latency: number; // ms
  uptime: string;
}

export interface ModelResponse {
  engineId: string;
  tokens: number;
  latencySeconds: number;
  temperature: number;
  contextWindow: string;
  badge: string;
  content: React.ReactNode | string;
  contentText: string; // plain text for copy
}

export interface ComparisonResult {
  id: string;
  query: string;
  askedAt: string;
  mode: QueryMode;
  engineCount: number;
  avgLatency: string;
  consensusPercent: number;
  responses: ModelResponse[];
  bestEngine?: string;
}

export interface PromptSuggestion {
  id: string;
  emoji: string;
  category: string;
  prompt: string;
  providers: string;
  consensusLabel: string;
  leader?: string;
}

export interface RecentComparison {
  id: string;
  engineCount: number;
  time: string;
  mode: QueryMode;
  query: string;
  bestEngine: string;
  bestEngineColor: string;
  avgLatency: string;
}
