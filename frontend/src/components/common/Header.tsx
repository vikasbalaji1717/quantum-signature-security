import React, { useState, useEffect } from 'react';
import {
  Clock,
  RefreshCw,
  Sparkles,
  Zap,
  Info,
} from 'lucide-react';

interface HeaderProps {
  onSimulate: () => void;
  onRefresh: () => void;
  isSimulating: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onSimulate,
  onRefresh,
  isSimulating,
}) => {
  const [time, setTime] = useState<string>('');
  const [utcTime, setUtcTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false }));
      setUtcTime(now.toUTCString().slice(17, 25) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3.5 border-b border-sky-900/30 bg-cyber-950/80 backdrop-blur-md">
      {/* Title & Environment Badge */}
      <div className="flex items-center gap-3.5">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-neon-cyan"></span>
          </span>
          <h1 className="text-sm font-semibold tracking-wide text-slate-100 hidden sm:inline-block">
            Quantum-Inspired Cyber Threat Detection for Digital Signature Security
          </h1>
          <h1 className="text-sm font-semibold tracking-wide text-slate-100 sm:hidden">
            QuantumShield SOC
          </h1>
        </div>

        {/* Environment Badge */}
        <div className="group relative flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-amber-500/10 text-amber-300 border border-amber-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span>DEMO PROTOTYPE</span>
          <Info size={12} className="text-amber-400/70" />

          {/* Hover disclaimer tooltip */}
          <div className="absolute top-full left-0 mt-2 w-72 p-2.5 rounded-xl bg-cyber-900 border border-sky-800/60 text-[11px] text-slate-300 shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50">
            Advisory prototype analyzing synthetic digital-signature security telemetry. Demonstrates quantum-inspired feature selection and ML anomaly detection.
          </div>
        </div>
      </div>

      {/* Right side: Clock & Quick Actions */}
      <div className="flex items-center gap-3">
        {/* Clock */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyber-900/80 border border-sky-900/40 font-mono text-xs text-sky-300">
          <Clock size={13} className="text-cyan-400" />
          <span>{time}</span>
          <span className="text-slate-500 text-[10px]">({utcTime})</span>
        </div>

        {/* Quick Simulate Attack Trigger */}
        <button
          onClick={onSimulate}
          disabled={isSimulating}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 hover:bg-cyan-900/40 hover:border-cyan-400 transition-all shadow-neon-cyan/10 active:scale-95 disabled:opacity-50"
          title="Simulate random threat vectors to feed live telemetry"
        >
          <Sparkles size={13} className={isSimulating ? 'animate-spin text-neon-cyan' : 'text-neon-cyan'} />
          <span className="hidden sm:inline">{isSimulating ? 'Simulating...' : 'Simulate Attack'}</span>
          <span className="sm:hidden">Simulate</span>
        </button>

        {/* Refresh button */}
        <button
          onClick={onRefresh}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 bg-cyber-900/80 border border-sky-900/40 hover:border-sky-700/60 transition-colors"
          title="Refresh Dashboard Data"
        >
          <RefreshCw size={15} />
        </button>
      </div>
    </header>
  );
};
