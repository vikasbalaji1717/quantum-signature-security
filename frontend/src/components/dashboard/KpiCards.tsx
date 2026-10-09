import React from 'react';
import {
  ShieldAlert,
  FileCheck2,
  AlertTriangle,
  KeyRound,
  TrendingUp,
  Percent,
} from 'lucide-react';
import { KpiData } from '../../types';

interface KpiCardsProps {
  kpis: KpiData | null;
  loading: boolean;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ kpis, loading }) => {
  const cards = [
    {
      id: 'total',
      title: 'Events Analysed',
      value: kpis?.total_analyzed ?? 0,
      sublabel: 'Telemetry volume',
      icon: FileCheck2,
      accentColor: 'text-cyan-400',
      borderColor: 'border-cyan-500/20 hover:border-cyan-400/50',
      glowClass: 'shadow-neon-cyan/10 hover:shadow-cyan-500/20',
      badge: 'LIVE STORE',
      badgeClass: 'bg-cyan-950/60 text-cyan-300 border-cyan-500/30',
      tag: '100% Verified Stream',
    },
    {
      id: 'suspicious',
      title: 'Suspicious Events',
      value: kpis?.suspicious_events ?? 0,
      sublabel: `${kpis?.threat_detection_rate_pct ?? 0}% anomaly rate`,
      icon: ShieldAlert,
      accentColor: 'text-rose-400',
      borderColor: 'border-rose-500/20 hover:border-rose-400/50',
      glowClass: 'shadow-rose-500/10 hover:shadow-rose-500/25',
      badge: 'ML CLASSIFIED',
      badgeClass: 'bg-rose-950/60 text-rose-300 border-rose-500/30',
      tag: 'Requires Triage',
    },
    {
      id: 'high_risk',
      title: 'High-Risk Incidents',
      value: kpis?.high_risk_events ?? 0,
      sublabel: 'Exceeded critical risk rules',
      icon: AlertTriangle,
      accentColor: 'text-amber-400',
      borderColor: 'border-amber-500/20 hover:border-amber-400/50',
      glowClass: 'shadow-amber-500/10 hover:shadow-amber-500/25',
      badge: 'CRITICAL',
      badgeClass: 'bg-amber-950/60 text-amber-300 border-amber-500/30',
      tag: 'Rule-Based High',
    },
    {
      id: 'sig_failures',
      title: 'Signature Failures',
      value: kpis?.signature_failures ?? 0,
      sublabel: 'Crypto integrity breaches',
      icon: KeyRound,
      accentColor: 'text-indigo-400',
      borderColor: 'border-indigo-500/20 hover:border-indigo-400/50',
      glowClass: 'shadow-indigo-500/10 hover:shadow-indigo-500/25',
      badge: 'CRYPTO ANOMALY',
      badgeClass: 'bg-indigo-950/60 text-indigo-300 border-indigo-500/30',
      tag: 'Invalid Ed25519',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className={`relative overflow-hidden rounded-2xl glass-panel p-5 transition-all duration-300 glass-panel-hover border ${card.borderColor} ${card.glowClass}`}
          >
            {/* Top row: Label & Icon */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase font-mono">
                {card.title}
              </span>
              <div className={`p-2.5 rounded-xl bg-cyber-900/90 border border-sky-900/40 ${card.accentColor}`}>
                <Icon size={18} />
              </div>
            </div>

            {/* Main Value */}
            <div className="mt-3 flex items-baseline gap-2">
              {loading ? (
                <div className="h-8 w-24 bg-slate-800/60 animate-pulse rounded" />
              ) : (
                <span className="text-3xl font-extrabold tracking-tight text-white font-mono">
                  {card.value.toLocaleString()}
                </span>
              )}
            </div>

            {/* Subtitle & Badge */}
            <div className="mt-2.5 flex items-center justify-between text-xs pt-2.5 border-t border-sky-950/80">
              <span className="text-slate-400 text-[11px] truncate">{card.sublabel}</span>
              <span
                className={`font-mono text-[10px] px-2 py-0.5 rounded-full border ${card.badgeClass}`}
              >
                {card.badge}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
