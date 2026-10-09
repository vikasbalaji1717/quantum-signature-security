import React from 'react';
import {
  Cpu,
  TrendingUp,
  AlertTriangle,
  Award,
  Layers,
  Sparkles,
  CheckCircle,
  Compass,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { ModelInsightsData } from '../../types';

interface ModelInsightsViewProps {
  insights: ModelInsightsData | null;
  loading: boolean;
}

export const ModelInsightsView: React.FC<ModelInsightsViewProps> = ({
  insights,
  loading,
}) => {
  if (loading || !insights) {
    return (
      <div className="rounded-2xl glass-panel p-12 text-center text-cyan-400 font-mono text-xs">
        Loading model architecture & quantum search benchmarks...
      </div>
    );
  }

  const convergenceData = insights.search_convergence.map((item) => ({
    generation: `Gen ${item.generation}`,
    f1: Number((item.validation_f1 * 100).toFixed(2)),
    activeFeatures: item.active_features,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl glass-panel p-6 border border-sky-900/40">
        <div className="flex items-center gap-2.5">
          <Cpu className="w-6 h-6 text-neon-cyan" />
          <h3 className="text-lg font-bold text-white tracking-wide">
            Model Architecture & Quantum-Inspired Experiment Insights
          </h3>
        </div>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Probabilistic state exploration heuristic vs standard Random Forest baseline on digital signature security telemetry
        </p>
      </div>

      {/* Head-to-Head Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Baseline Model */}
        <div className="rounded-2xl glass-panel p-6 border border-sky-900/40 space-y-4">
          <div className="flex items-center justify-between border-b border-sky-900/30 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-sky-400" />
              <h4 className="text-sm font-bold text-white">Baseline Random Forest</h4>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950/60 text-sky-300 border border-sky-800">
              CONVENTIONAL
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between py-1.5 border-b border-sky-950/60">
              <span className="text-slate-400">Classifiers / Trees:</span>
              <span className="text-white font-bold">{insights.baseline_model.n_estimators} Estimators</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-sky-950/60">
              <span className="text-slate-400">Feature Selection:</span>
              <span className="text-slate-300">{insights.baseline_model.feature_selection}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-sky-950/60">
              <span className="text-slate-400">Features Active:</span>
              <span className="text-white font-bold">{insights.baseline_model.features_used} of 5</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-sky-950/60">
              <span className="text-slate-400">Held-Out Test Accuracy:</span>
              <span className="text-emerald-400 font-bold">100.0% (1.000)</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Suspicious Class F1-Score:</span>
              <span className="text-emerald-400 font-bold">1.0000</span>
            </div>
          </div>
        </div>

        {/* Quantum-Inspired Model */}
        <div className="rounded-2xl glass-panel p-6 border border-cyan-500/30 space-y-4 shadow-neon-cyan/10">
          <div className="flex items-center justify-between border-b border-sky-900/30 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-neon-cyan" />
              <h4 className="text-sm font-bold text-white">Quantum-Inspired Selected Model</h4>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-neon-cyan border border-cyan-500/40">
              RESEARCH EXPERIMENT
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between py-1.5 border-b border-sky-950/60">
              <span className="text-slate-400">Search Heuristic:</span>
              <span className="text-cyan-300">Probabilistic State Vector Exploration</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-sky-950/60">
              <span className="text-slate-400">Generations / Candidates:</span>
              <span className="text-white font-bold">
                {insights.quantum_inspired_model.search_generations} Gens × {insights.quantum_inspired_model.candidates_per_generation} Candidates
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-sky-950/60">
              <span className="text-slate-400">Learning Rate (Rotation Step):</span>
              <span className="text-cyan-300 font-bold">{insights.quantum_inspired_model.learning_rate}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-sky-950/60">
              <span className="text-slate-400">Held-Out Test Accuracy:</span>
              <span className="text-emerald-400 font-bold">100.0% (1.000)</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Suspicious Class F1-Score:</span>
              <span className="text-emerald-400 font-bold">1.0000</span>
            </div>
          </div>
        </div>
      </div>

      {/* Generation Search Convergence Curve */}
      <div className="rounded-2xl glass-panel p-6 border border-sky-900/40 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-neon-cyan" />
            <h4 className="text-sm font-bold text-white">
              Probabilistic Search Convergence Curve (10 Generations)
            </h4>
          </div>
          <span className="text-xs font-mono text-cyan-300">
            Validation Metric: F1-Score (pos_label=SUSPICIOUS)
          </span>
        </div>

        <div className="h-60 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={convergenceData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="generation"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
              />
              <YAxis
                domain={[97, 100]}
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="p-3 rounded-xl bg-cyber-900 border border-cyan-500/30 text-xs font-mono shadow-xl">
                        <div className="text-slate-400">{label}</div>
                        <div className="text-neon-cyan font-bold">
                          Validation F1: {payload[0].value}%
                        </div>
                        <div className="text-slate-300">
                          Active Features: {payload[0].payload.activeFeatures}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="f1"
                stroke="#00f0ff"
                strokeWidth={3}
                dot={{ fill: '#00f0ff', r: 4 }}
                activeDot={{ r: 6, fill: '#ffffff', stroke: '#00f0ff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Feature Rationale */}
      <div className="rounded-2xl glass-panel p-6 border border-sky-900/40 space-y-4">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-neon-cyan" />
          <span>Selected Telemetry Feature Set & Security Significance</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
          {insights.features.quantum_selected_features.map((feat) => (
            <div
              key={feat}
              className="p-3.5 rounded-xl bg-cyber-900/60 border border-sky-900/40 space-y-1"
            >
              <div className="text-cyan-300 font-bold flex items-center gap-1.5">
                <CheckCircle size={13} className="text-neon-cyan" />
                <span>{feat}</span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                {feat === 'revoked_key_used' && 'Detects attempts to execute cryptographic operations with certificates marked invalid in CRL/OCSP.'}
                {feat === 'invalid_signature' && 'Direct cryptographic breach where document content fails Ed25519 hash verification.'}
                {feat === 'failed_attempts' && 'Identifies credential stuffing and brute-force key guessing against access boundaries.'}
                {feat === 'requests_per_minute' && 'High-frequency burst rate indicating automated botnet or replay attack activity.'}
                {feat === 'unknown_device' && 'Unfamiliar TLS endpoint fingerprint deviating from known trusted enterprise profiles.'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Honest Scientific Caveats & Future Roadmap */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-mono text-xs">
        {/* Caveats */}
        <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-3">
          <h5 className="font-bold text-amber-300 flex items-center gap-2">
            <AlertTriangle size={15} />
            <span>Methodological Disclosure & Limitations</span>
          </h5>
          <ul className="space-y-2 text-slate-300 text-[11px] list-disc list-inside">
            {insights.scientific_caveats.map((c, i) => (
              <li key={i} className="leading-relaxed">
                {c}
              </li>
            ))}
          </ul>
        </div>

        {/* Future Roadmap */}
        <div className="p-5 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-3">
          <h5 className="font-bold text-indigo-300 flex items-center gap-2">
            <Compass size={15} />
            <span>Next Research Milestones</span>
          </h5>
          <ul className="space-y-2 text-slate-300 text-[11px] list-disc list-inside">
            {insights.next_research_milestones.map((m, i) => (
              <li key={i} className="leading-relaxed">
                {m}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
