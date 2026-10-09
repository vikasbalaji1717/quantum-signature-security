import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { PieChart as PieIcon, Crosshair } from 'lucide-react';
import { ThreatDistributionData } from '../../types';

interface ThreatDistributionProps {
  data: ThreatDistributionData | null;
  loading: boolean;
}

export const ThreatDistribution: React.FC<ThreatDistributionProps> = ({
  data,
  loading,
}) => {
  const classifications = data?.classifications || [];
  const vectors = data?.vectors || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Classification Donut */}
      <div className="lg:col-span-5 rounded-2xl glass-panel p-6 border border-sky-900/40 space-y-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-neon-cyan" />
            <h3 className="text-base font-bold text-white tracking-wide">
              Classification Breakdown
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Machine-learning anomaly detection partition
          </p>
        </div>

        {/* Donut Chart */}
        <div className="h-48 w-full relative flex items-center justify-center">
          {loading ? (
            <div className="text-slate-500 font-mono text-xs">Loading chart...</div>
          ) : classifications.length === 0 ? (
            <div className="text-slate-500 font-mono text-xs">No distribution data</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={classifications}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {classifications.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="#070d1e"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0];
                      return (
                        <div className="p-2.5 rounded-lg bg-cyber-900 border border-sky-800 text-xs font-mono shadow-xl">
                          <span style={{ color: item.payload.color }} className="font-bold">
                            {item.name}:
                          </span>{' '}
                          <span className="text-white">{item.value} events</span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}

          {/* Center icon / text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-[10px] font-mono uppercase text-slate-400">MODEL</span>
            <span className="text-sm font-extrabold text-white font-mono">STATUS</span>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-sky-950/80 font-mono text-xs">
          {classifications.map((c) => (
            <div
              key={c.name}
              className="flex items-center justify-between p-2 rounded-lg bg-cyber-900/60 border border-sky-900/30"
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                <span className="text-slate-300">{c.name}</span>
              </div>
              <span className="font-bold text-white">{c.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Attack Vector Radar / Intensity Bars */}
      <div className="lg:col-span-7 rounded-2xl glass-panel p-6 border border-sky-900/40 space-y-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Crosshair className="w-5 h-5 text-neon-cyan" />
            <h3 className="text-base font-bold text-white tracking-wide">
              Threat Vector Distribution
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Prevalence of triggered anomalous indicators across security events
          </p>
        </div>

        {/* Vector breakdown bars */}
        <div className="space-y-3.5 my-auto">
          {vectors.map((v) => {
            const pct = v.max > 0 ? Math.round((v.count / v.max) * 100) : 0;
            return (
              <div key={v.vector} className="space-y-1.5 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 flex items-center gap-2 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    {v.vector}
                  </span>
                  <span className="text-cyan-300 font-bold">
                    {v.count} <span className="text-slate-500 font-normal">({pct}%)</span>
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-cyber-900 border border-sky-900/40 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-500 transition-all duration-500"
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info note */}
        <div className="pt-2 border-t border-sky-950/80 text-[11px] font-mono text-slate-400 flex items-center justify-between">
          <span>Feature Selection Metric: Validation F1</span>
          <span className="text-cyan-400">5 Candidate Features</span>
        </div>
      </div>
    </div>
  );
};
