import {
  KpiData,
  ActivityBucket,
  ThreatDistributionData,
  SecurityEvent,
  PredictionPayload,
  PredictionResult,
  SystemStatus,
  ModelInsightsData,
  CryptoDemoResult,
} from '../types';

const API_BASE = '/api';

export const api = {
  async getStatus(): Promise<SystemStatus> {
    const res = await fetch(`${API_BASE}/status`);
    if (!res.ok) throw new Error('Failed to retrieve system status');
    return res.json();
  },

  async getKpis(): Promise<KpiData> {
    const res = await fetch(`${API_BASE}/kpi`);
    if (!res.ok) throw new Error('Failed to retrieve security KPIs');
    return res.json();
  },

  async getActivity(rangeFilter: '1h' | '24h' | '7d' | 'all' = '24h'): Promise<{ data: ActivityBucket[] }> {
    const res = await fetch(`${API_BASE}/activity?range_filter=${rangeFilter}`);
    if (!res.ok) throw new Error('Failed to retrieve threat activity');
    return res.json();
  },

  async getDistribution(): Promise<ThreatDistributionData> {
    const res = await fetch(`${API_BASE}/distribution`);
    if (!res.ok) throw new Error('Failed to retrieve threat distribution');
    return res.json();
  },

  async getEvents(params: {
    search?: string;
    risk?: string;
    prediction?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ total: number; offset: number; limit: number; events: SecurityEvent[] }> {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.risk && params.risk !== 'ALL') query.append('risk', params.risk);
    if (params.prediction && params.prediction !== 'ALL') query.append('prediction', params.prediction);
    if (params.limit) query.append('limit', params.limit.toString());
    if (params.offset) query.append('offset', params.offset.toString());

    const res = await fetch(`${API_BASE}/events?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to retrieve security events');
    return res.json();
  },

  async predict(payload: PredictionPayload): Promise<PredictionResult> {
    const res = await fetch(`${API_BASE}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Threat analysis failed');
    }
    return res.json();
  },

  async getFeed(limit = 15): Promise<{ feed: SecurityEvent[]; status: string; is_demo_data: boolean }> {
    const res = await fetch(`${API_BASE}/feed?limit=${limit}`);
    if (!res.ok) throw new Error('Failed to retrieve event feed');
    return res.json();
  },

  async simulateFeedEvents(count = 3): Promise<{ simulated: SecurityEvent[]; count: number }> {
    const res = await fetch(`${API_BASE}/feed/simulate?count=${count}`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to generate simulation events');
    return res.json();
  },

  async resetEvents(): Promise<{ message: string; total: number }> {
    const res = await fetch(`${API_BASE}/events`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to reset events');
    return res.json();
  },

  async getModelInsights(): Promise<ModelInsightsData> {
    const res = await fetch(`${API_BASE}/model/insights`);
    if (!res.ok) throw new Error('Failed to retrieve model insights');
    return res.json();
  },

  async verifySignature(message: string, tamper: boolean): Promise<CryptoDemoResult> {
    const res = await fetch(`${API_BASE}/crypto/verify-signature`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, tamper }),
    });
    if (!res.ok) throw new Error('Failed to execute cryptographic verification');
    return res.json();
  },
};
