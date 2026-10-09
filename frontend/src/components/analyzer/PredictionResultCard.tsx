import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  FileText,
  ListOrdered,
  AlertOctagon,
  Info,
} from 'lucide-react';
import { PredictionResult } from '../../types';

interface PredictionResultCardProps {
  result: PredictionResult | null;
}

export const PredictionResultCard: React.FC<PredictionResultCardProps> = ({
  result,
}) => {
  if (!result) {
    return (
      <div className="rounded-2xl glass-panel p-8 border border-sky-900/40 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-cyber-900/80 border border-sky-900/60 mx-auto flex items-center justify-center text-slate-500">
          <FileText size={22} />
        </div>
        <h4 className="text-sm font-semibold text-slate-300">Awaiting Telemetry Analysis</h4>
        <p className="text-xs text-slate-500 font-mono max-w-sm mx-auto">
          Configure event features in the console and click "Analyse Security Event" to execute model inference and response playbooks.
        </p>
      </div>
    );
  }

  const isSuspicious = result.prediction === 'SUSPICIOUS';
  const isHighRisk = result.risk === 'HIGH';
  const isReview = result.risk === 'REVIEW';

  return (
    <div className="rounded-2xl glass-panel p-6 border border-cyan-500/30 space-y-6 shadow-2xl relative overflow-hidden">
      {/* Top Banner Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-sky-900/40 pb-4">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase">
            EVALUATION REPORT · {result.id}
          </span>
          <h3 className="text-lg font-extrabold text-white">
            Security Event Analysis Results
          </h3>
          <span className="text-xs font-mono text-slate-400">Timestamp: {result.time}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Machine Learning Model Classification Badge */}
          <div
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 font-mono text-xs font-bold ${
              isSuspicious
                ? 'bg-rose-950/80 text-rose-300 border-rose-500/50 shadow-neon-rose/20'
                : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 shadow-neon-emerald/20'
            }`}
          >
            {isSuspicious ? <ShieldAlert size={16} /> : <ShieldCheck size={16} />}
            <span>MODEL: {result.prediction}</span>
          </div>

          {/* Illustrative Risk Category Badge */}
          <div
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 font-mono text-xs font-bold ${
              isHighRisk
                ? 'bg-rose-950/80 text-rose-300 border-rose-500/50'
                : isReview
                ? 'bg-amber-950/80 text-amber-300 border-amber-500/50'
                : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
            }`}
          >
            <AlertTriangle size={15} />
            <span>RISK: {result.risk}</span>
          </div>
        </div>
      </div>

      {/* Probabilities / Model Confidence if available */}
      {result.probabilities && Object.keys(result.probabilities).length > 0 && (
        <div className="p-4 rounded-xl bg-cyber-900/60 border border-sky-900/40 space-y-2">
          <div className="flex justify-between items-center text-xs font-mono text-slate-300">
            <span>Model Class Confidence:</span>
            <span className="text-cyan-300 font-bold">
              {((result.probabilities[result.prediction] || 1) * 100).toFixed(1)}% Confidence
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-cyber-950 overflow-hidden border border-sky-900/40 flex">
            {Object.entries(result.probabilities).map(([cls, prob]) => (
              <div
                key={cls}
                style={{ width: `${prob * 100}%` }}
                className={`h-full ${
                  cls === 'SUSPICIOUS' ? 'bg-rose-500' : 'bg-emerald-500'
                }`}
                title={`${cls}: ${(prob * 100).toFixed(1)}%`}
              />
            ))}
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>Normal: {((result.probabilities['NORMAL'] || 0) * 100).toFixed(1)}%</span>
            <span>Suspicious: {((result.probabilities['SUSPICIOUS'] || 0) * 100).toFixed(1)}%</span>
          </div>
        </div>
      )}

      {/* Triggered Heuristics & Rules */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-mono text-cyan-300 font-semibold flex items-center gap-1.5 uppercase tracking-wider">
          <AlertOctagon size={14} /> Triggered Heuristic Rules
        </h4>
        <div className="grid grid-cols-1 gap-2">
          {result.triggered_rules.length === 0 ? (
            <div className="p-3 rounded-xl bg-cyber-900/40 border border-sky-900/30 text-xs font-mono text-slate-400 flex items-center gap-2">
              <CheckCircle size={14} className="text-emerald-400" />
              No anomalous threshold rules were triggered by this event.
            </div>
          ) : (
            result.triggered_rules.map((rule, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-rose-950/20 border border-rose-500/20 text-xs font-mono text-rose-300 flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                <span>{rule}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recommended SOC Investigation Steps */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-mono text-cyan-300 font-semibold flex items-center gap-1.5 uppercase tracking-wider">
          <ListOrdered size={14} /> Recommended SOC Investigation Steps
        </h4>
        <div className="space-y-2">
          {result.recommended_steps.map((step, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-cyber-900/70 border border-sky-900/50 text-xs font-mono text-slate-200 flex items-start gap-2.5"
            >
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30 flex items-center justify-center text-[10px] font-bold">
                {idx + 1}
              </span>
              <span className="leading-relaxed">{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Event Details Snapshot */}
      <div className="p-3.5 rounded-xl bg-cyber-900/80 border border-sky-900/40 space-y-2 text-xs font-mono">
        <div className="text-slate-400 text-[11px] font-semibold border-b border-sky-900/30 pb-1">
          SUBMITTED TELEMETRY PARAMETERS
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-slate-300 text-[11px]">
          <div>
            <span className="text-slate-500 block">Failed Attempts:</span>
            <span className="font-bold text-white">{result.failed_attempts}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Requests / min:</span>
            <span className="font-bold text-white">{result.requests_per_minute}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Unknown Device:</span>
            <span className="font-bold text-white">{result.unknown_device ? 'Yes' : 'No'}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Revoked Key:</span>
            <span className="font-bold text-white">{result.revoked_key_used ? 'Yes' : 'No'}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Invalid Sig:</span>
            <span className="font-bold text-white">{result.invalid_signature ? 'Yes' : 'No'}</span>
          </div>
        </div>
      </div>

      {/* Scientific Transparency Disclaimer */}
      <div className="p-3 rounded-xl bg-cyber-950/80 border border-sky-900/40 text-[11px] font-mono text-slate-400 flex items-start gap-2">
        <Info size={14} className="text-cyan-400 flex-shrink-0 mt-0.5" />
        <span>
          <strong>Scientific Notice:</strong> The Machine Learning classification and illustrative risk category are independent.
          The risk category applies deterministic demo rules and does not represent a calibrated attack probability.
        </span>
      </div>
    </div>
  );
};
