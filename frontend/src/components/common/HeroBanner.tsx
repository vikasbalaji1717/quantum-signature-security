import React from 'react';
import { Shield, Sparkles, Terminal, Activity, Zap } from 'lucide-react';

interface HeroBannerProps {
  onOpenAnalyzer: () => void;
  onOpenInsights: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onOpenAnalyzer,
  onOpenInsights,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl glass-panel border border-cyan-500/20 p-6 md:p-8 bg-gradient-to-br from-cyber-900/90 via-cyber-850/80 to-indigo-950/40 shadow-2xl">
      {/* Subtle background ambient glow */}
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute right-40 -bottom-20 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="max-w-2xl space-y-3">
          {/* Posture Badge */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium text-neon-cyan bg-cyan-950/80 border border-cyan-500/40 shadow-neon-cyan/20">
              <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
              DEFENSE POSTURE: ACTIVE SURVEILLANCE
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono text-indigo-300 bg-indigo-950/50 border border-indigo-500/30">
              <Sparkles size={12} className="text-indigo-400" />
              QUANTUM-INSPIRED HEURISTIC
            </span>
          </div>

          {/* Hero Heading */}
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
            Cyber Threat Intelligence Center
          </h2>

          {/* Description */}
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            AI-driven anomaly detection and risk classification for cryptographic digital-signature events.
            Optimized via a probabilistic <span className="text-cyan-300 font-medium">quantum-inspired feature-selection</span> heuristic 
            to isolate compromised keys, signature tampering, and high-frequency intrusion bursts.
          </p>

          {/* Warning disclaimer */}
          <div className="flex items-center gap-2 pt-1 text-xs text-amber-300/80 font-mono">
            <span className="text-amber-400">⚡ NOTE:</span>
            <span>Operating in research demo mode with synthetic verification telemetry. Advisory ML scoring.</span>
          </div>
        </div>

        {/* Action triggers */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto">
          <button
            onClick={onOpenAnalyzer}
            className="flex-1 lg:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 text-slate-950 font-semibold text-sm hover:from-cyan-400 hover:to-sky-500 transition-all shadow-neon-cyan hover:shadow-cyan-400/50 active:scale-95"
          >
            <Terminal size={17} />
            <span>Launch Threat Analyzer</span>
          </button>

          <button
            onClick={onOpenInsights}
            className="flex-1 lg:flex-initial flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-cyber-850/80 hover:bg-cyber-800 text-sky-200 border border-sky-800/60 hover:border-cyan-500/40 font-medium text-sm transition-all"
          >
            <Activity size={16} className="text-cyan-400" />
            <span>Model Benchmarks</span>
          </button>
        </div>
      </div>
    </div>
  );
};
