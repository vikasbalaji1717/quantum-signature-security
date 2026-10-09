import React, { useState } from 'react';
import {
  ShieldAlert,
  Zap,
  Sliders,
  RotateCcw,
  Sparkles,
  AlertOctagon,
  Key,
  Laptop,
  Gauge,
  HelpCircle,
} from 'lucide-react';
import { PredictionPayload, PredictionResult } from '../../types';

interface ThreatAnalyzerPanelProps {
  onAnalyze: (payload: PredictionPayload) => Promise<void>;
  loading: boolean;
  initialValues?: Partial<PredictionPayload> | null;
}

export const ThreatAnalyzerPanel: React.FC<ThreatAnalyzerPanelProps> = ({
  onAnalyze,
  loading,
  initialValues,
}) => {
  const [failedAttempts, setFailedAttempts] = useState<number>(
    initialValues?.failed_attempts ?? 5
  );
  const [requestsPerMinute, setRequestsPerMinute] = useState<number>(
    initialValues?.requests_per_minute ?? 25
  );
  const [unknownDevice, setUnknownDevice] = useState<number>(
    initialValues?.unknown_device ?? 1
  );
  const [revokedKeyUsed, setRevokedKeyUsed] = useState<number>(
    initialValues?.revoked_key_used ?? 0
  );
  const [invalidSignature, setInvalidSignature] = useState<number>(
    initialValues?.invalid_signature ?? 1
  );

  // Sync if initial values change from outside (e.g. clicking "Inspect" in Feed)
  React.useEffect(() => {
    if (initialValues) {
      if (initialValues.failed_attempts !== undefined) setFailedAttempts(initialValues.failed_attempts);
      if (initialValues.requests_per_minute !== undefined) setRequestsPerMinute(initialValues.requests_per_minute);
      if (initialValues.unknown_device !== undefined) setUnknownDevice(initialValues.unknown_device);
      if (initialValues.revoked_key_used !== undefined) setRevokedKeyUsed(initialValues.revoked_key_used);
      if (initialValues.invalid_signature !== undefined) setInvalidSignature(initialValues.invalid_signature);
    }
  }, [initialValues]);

  const presets = [
    {
      name: 'Normal Verification',
      badge: 'BENIGN',
      values: { failed: 0, rpm: 5, unknown: 0, revoked: 0, invalid: 0 },
    },
    {
      name: 'Tampered Signature',
      badge: 'INTEGRITY',
      values: { failed: 2, rpm: 12, unknown: 1, revoked: 0, invalid: 1 },
    },
    {
      name: 'Revoked Key Replay',
      badge: 'COMPROMISED',
      values: { failed: 4, rpm: 26, unknown: 1, revoked: 1, invalid: 0 },
    },
    {
      name: 'Brute-Force Anomaly',
      badge: 'BURST',
      values: { failed: 7, rpm: 40, unknown: 1, revoked: 0, invalid: 1 },
    },
  ];

  const applyPreset = (preset: typeof presets[0]) => {
    setFailedAttempts(preset.values.failed);
    setRequestsPerMinute(preset.values.rpm);
    setUnknownDevice(preset.values.unknown);
    setRevokedKeyUsed(preset.values.revoked);
    setInvalidSignature(preset.values.invalid);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze({
      failed_attempts: Number(failedAttempts),
      requests_per_minute: Number(requestsPerMinute),
      unknown_device: Number(unknownDevice),
      revoked_key_used: Number(revokedKeyUsed),
      invalid_signature: Number(invalidSignature),
      source_ip: '192.168.1.100 (Console)',
      key_id: 'ed25519:console-eval',
    });
  };

  return (
    <div className="rounded-2xl glass-panel p-6 border border-sky-900/40 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-sky-900/40 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-neon-cyan" />
            <h3 className="text-base font-bold text-white tracking-wide">
              Threat Analysis Console
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Evaluate a simulated or manual digital-signature telemetry event against the quantum-inspired model
          </p>
        </div>

        {/* Reset */}
        <button
          type="button"
          onClick={() => {
            setFailedAttempts(0);
            setRequestsPerMinute(5);
            setUnknownDevice(0);
            setRevokedKeyUsed(0);
            setInvalidSignature(0);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-white bg-cyber-900/60 border border-sky-900/40 hover:border-sky-700 transition-colors"
        >
          <RotateCcw size={13} /> Clear Form
        </button>
      </div>

      {/* Preset Buttons */}
      <div className="space-y-2">
        <label className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
          <Sparkles size={13} className="text-cyan-400" />
          <span>Quick Attack Scenarios & Presets:</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {presets.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => applyPreset(p)}
              className="p-2.5 rounded-xl text-left bg-cyber-900/70 hover:bg-cyber-850 border border-sky-900/50 hover:border-cyan-500/40 transition-all group"
            >
              <div className="text-[10px] font-mono text-cyan-400 group-hover:text-cyan-300 font-semibold flex items-center justify-between">
                <span>{p.badge}</span>
                <span className="text-slate-500">→</span>
              </div>
              <div className="text-xs font-medium text-slate-200 mt-0.5 truncate">
                {p.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Form Inputs */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Failed Attempts */}
          <div className="p-4 rounded-xl bg-cyber-900/60 border border-sky-900/40 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-slate-300 font-medium flex items-center gap-1.5">
                <AlertOctagon size={14} className="text-amber-400" />
                <span>Failed Verification Attempts</span>
              </label>
              <span className="font-mono text-xs font-bold text-cyan-300 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30">
                {failedAttempts}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={20}
              value={failedAttempts}
              onChange={(e) => setFailedAttempts(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>0 (Normal)</span>
              <span>3 (Review threshold)</span>
              <span>5+ (Critical brute-force)</span>
            </div>
          </div>

          {/* Requests Per Minute */}
          <div className="p-4 rounded-xl bg-cyber-900/60 border border-sky-900/40 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-slate-300 font-medium flex items-center gap-1.5">
                <Gauge size={14} className="text-cyan-400" />
                <span>Requests Per Minute (RPM)</span>
              </label>
              <span className="font-mono text-xs font-bold text-cyan-300 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30">
                {requestsPerMinute} RPM
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={60}
              value={requestsPerMinute}
              onChange={(e) => setRequestsPerMinute(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>1 RPM (Idle)</span>
              <span>20 RPM (Elevated)</span>
              <span>25+ RPM (Velocity surge)</span>
            </div>
          </div>
        </div>

        {/* Binary Toggles Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Unknown Device Toggle */}
          <div
            onClick={() => setUnknownDevice(unknownDevice === 1 ? 0 : 1)}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between select-none ${
              unknownDevice === 1
                ? 'bg-amber-950/30 border-amber-500/40 text-amber-300 shadow-neon-amber/10'
                : 'bg-cyber-900/60 border-sky-900/40 text-slate-400 hover:border-sky-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <Laptop size={16} className={unknownDevice === 1 ? 'text-amber-400' : 'text-slate-500'} />
              <div>
                <div className="text-xs font-semibold text-slate-200">Unknown Device</div>
                <div className="text-[10px] font-mono text-slate-400">Unfamiliar TLS client</div>
              </div>
            </div>
            <span
              className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                unknownDevice === 1
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              {unknownDevice === 1 ? 'YES' : 'NO'}
            </span>
          </div>

          {/* Revoked Key Toggle */}
          <div
            onClick={() => setRevokedKeyUsed(revokedKeyUsed === 1 ? 0 : 1)}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between select-none ${
              revokedKeyUsed === 1
                ? 'bg-rose-950/40 border-rose-500/50 text-rose-300 shadow-neon-rose/20'
                : 'bg-cyber-900/60 border-sky-900/40 text-slate-400 hover:border-sky-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <Key size={16} className={revokedKeyUsed === 1 ? 'text-rose-400' : 'text-slate-500'} />
              <div>
                <div className="text-xs font-semibold text-slate-200">Revoked Key Attempt</div>
                <div className="text-[10px] font-mono text-slate-400">CRL / OCSP revoked ID</div>
              </div>
            </div>
            <span
              className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                revokedKeyUsed === 1
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              {revokedKeyUsed === 1 ? 'YES' : 'NO'}
            </span>
          </div>

          {/* Invalid Signature Toggle */}
          <div
            onClick={() => setInvalidSignature(invalidSignature === 1 ? 0 : 1)}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between select-none ${
              invalidSignature === 1
                ? 'bg-indigo-950/40 border-indigo-500/50 text-indigo-300 shadow-neon-violet/20'
                : 'bg-cyber-900/60 border-sky-900/40 text-slate-400 hover:border-sky-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <ShieldAlert size={16} className={invalidSignature === 1 ? 'text-indigo-400' : 'text-slate-500'} />
              <div>
                <div className="text-xs font-semibold text-slate-200">Invalid Signature</div>
                <div className="text-[10px] font-mono text-slate-400">Ed25519 digest error</div>
              </div>
            </div>
            <span
              className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                invalidSignature === 1
                  ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              {invalidSignature === 1 ? 'YES' : 'NO'}
            </span>
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl font-bold text-sm tracking-wider uppercase font-mono bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 text-slate-950 hover:from-cyan-300 hover:to-indigo-400 transition-all shadow-neon-cyan active:scale-[0.99] disabled:opacity-50"
        >
          {loading ? (
            <>
              <Zap className="animate-spin" size={17} />
              <span>Running Quantum-Inspired Model Evaluation...</span>
            </>
          ) : (
            <>
              <Zap size={17} />
              <span>⚡ Analyse Security Event</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
