import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Activity, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { ActivityBucket } from '../../types';

interface ThreatActivityChartProps {
  data: ActivityBucket[];
  loading: boolean;
  onRangeChange: (range: '1h' | '24h' | '7d' | 'all') => void;
  activeRange: '1h' | '24h' | '7d' | 'all';
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const suspicious = payload.find((p: any) => p.dataKey === 'suspicious')?.value || 0;
    const normal = payload.find((p: any) => p.dataKey === 'normal')?.value || 0;
    const total = suspicious + normal;

    return (
      <div className="p-3.5 rounded-xl bg-cyber-900/95 border border-cyan-500/30 shadow-2xl backdrop-blur-md text-xs font-mono space-y-1.5 min-w-[170px]">
        <div className="text-slate-400 border-b border-sky-900/40 pb-1 flex justify-between">
          <span>TIME BUCKET</span>
          <span className="text-cyan-300 font-semibold">{label}</span>
        </div>
        <div className="flex items-center justify-between text-rose-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" /> Suspicious:
          </span>
          <span className="font-bold">{suspicious}</span>
        </div>
        <div className="flex items-center justify-between text-emerald-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Normal:
          </span>
          <span className="font-bold">{normal}</span>
        </div>
        <div className="pt-1 border-t border-sky-900/40 flex justify-between text-slate-300">
          <span>Total Stream:</span>
          <span className="font-bold text-white">{total}</span>
        </div>
      </div>
    );
  }
  return null;
};

export const ThreatActivityChart: React.FC<ThreatActivityChartProps> = ({
  data,
  loading,
  onRangeChange,
  activeRange,
}) => {
  const ranges: Array<'1h' | '24h' | '7d' | 'all'> = ['1h', '24h', '7d', 'all'];

  const totalSuspicious = data.reduce((acc, curr) => acc + curr.suspicious, 0);
  const totalNormal = data.reduce((acc, curr) => acc + curr.normal, 0);

  return (
    <div className="rounded-2xl glass-panel p-6 border border-sky-900/40 space-y-5">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-neon-cyan" />
            <h3 className="text-base font-bold text-white tracking-wide">
              Threat Velocity & Event Stream
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Time-bucketed distribution of normal vs suspicious digital signature verification activity
          </p>
        </div>

        {/* Range Selector & Legends */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="hidden lg:flex items-center gap-4 text-xs font-mono mr-2">
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]" />
              Suspicious ({totalSuspicious})
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
              Normal ({totalNormal})
            </span>
          </div>

          <div className="flex items-center p-1 rounded-xl bg-cyber-900/90 border border-sky-900/50">
            {ranges.map((r) => (
              <button
                key={r}
                onClick={() => onRangeChange(r)}
                className={`px-3 py-1 rounded-lg text-xs font-mono uppercase transition-all ${
                  activeRange === r
                    ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-72 w-full pt-2">
        {loading ? (
          <div className="h-full w-full flex items-center justify-center bg-cyber-900/40 rounded-xl">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs">
              <Activity className="animate-spin" size={16} /> Loading telemetry chart...
            </div>
          </div>
        ) : data.length === 0 ? (
          <div className="h-full w-full flex items-center justify-center text-slate-500 font-mono text-xs">
            No telemetry data available for this range
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                {/* Suspicious Gradient */}
                <linearGradient id="suspiciousGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                </linearGradient>
                {/* Normal Gradient */}
                <linearGradient id="normalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="time"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
                tickLine={false}
              />
              <YAxis
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="suspicious"
                stroke="#f43f5e"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#suspiciousGrad)"
                name="Suspicious"
              />
              <Area
                type="monotone"
                dataKey="normal"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#normalGrad)"
                name="Normal"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
