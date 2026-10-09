export interface SecurityEvent {
  id: string;
  time: string;
  timestamp: number;
  failed_attempts: number;
  requests_per_minute: number;
  unknown_device: number;
  revoked_key_used: number;
  invalid_signature: number;
  prediction: 'SUSPICIOUS' | 'NORMAL';
  risk: 'HIGH' | 'REVIEW' | 'LOW';
  source_ip?: string;
  key_id?: string;
  scenario?: string;
  is_simulated?: boolean;
}

export interface KpiData {
  total_analyzed: number;
  suspicious_events: number;
  normal_events: number;
  high_risk_events: number;
  review_risk_events: number;
  signature_failures: number;
  revoked_key_events: number;
  threat_detection_rate_pct: number;
  is_demo_data: boolean;
}

export interface ActivityBucket {
  time: string;
  suspicious: number;
  normal: number;
  total: number;
  high_risk: number;
  sig_failures: number;
}

export interface ThreatVector {
  vector: string;
  count: number;
  max: number;
}

export interface ThreatDistributionData {
  classifications: Array<{ name: string; value: number; color: string }>;
  risk_levels: Array<{ name: string; value: number; color: string }>;
  vectors: ThreatVector[];
}

export interface PredictionPayload {
  failed_attempts: number;
  requests_per_minute: number;
  unknown_device: number;
  revoked_key_used: number;
  invalid_signature: number;
  source_ip?: string;
  key_id?: string;
}

export interface PredictionResult extends SecurityEvent {
  probabilities?: Record<string, number>;
  triggered_rules: string[];
  recommended_steps: string[];
}

export interface SystemStatus {
  status: string;
  system: string;
  model_loaded: boolean;
  model_type: string;
  features: string[];
  baseline_model_available: boolean;
  dataset_available: boolean;
  total_session_events: number;
  demo_mode: boolean;
  environment: string;
  disclaimer: string;
}

export interface ModelInsightsData {
  features: {
    all_features: string[];
    quantum_selected_features: string[];
    total_count: number;
  };
  baseline_model: {
    name: string;
    n_estimators: number;
    features_used: number;
    feature_selection: string;
    test_accuracy: number;
    suspicious_f1: number;
  };
  quantum_inspired_model: {
    name: string;
    candidate_n_estimators: number;
    final_n_estimators: number;
    search_generations: number;
    candidates_per_generation: number;
    learning_rate: number;
    exploration_bounds: [number, number];
    validation_metric: string;
    selected_features: string[];
    test_accuracy: number;
    suspicious_f1: number;
  };
  search_convergence: Array<{
    generation: number;
    validation_f1: number;
    active_features: number;
  }>;
  scientific_caveats: string[];
  next_research_milestones: string[];
}

export interface CryptoDemoResult {
  status: 'VALID' | 'INVALID';
  is_valid: boolean;
  algorithm: string;
  original_message: string;
  verified_message: string;
  signature_preview: string;
  tampered: boolean;
  explanation: string;
  threat_implication: string;
}
