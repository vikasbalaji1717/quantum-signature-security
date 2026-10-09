import React, { useState, useEffect } from 'react';
import {
  Radio,
  Play,
  Pause,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Key,
  Flame,
  Sparkles,
} from 'lucide-react';
import { SecurityEvent } from '../../types';

interface LiveEventFeedProps {
  events: SecurityEvent[];
  onInspectEvent: (event: SecurityEvent) => void;
  onSimulateTick: () => void;
}

export const LiveEventFeed: React.FC<LiveEventFeedProps> = ({
  events,
  onInspectEvent,
  onSimulateTick,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // Auto-pulse simulated events every 10 seconds if play is active
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      onSimulateTick();
    }, 10000);
    return () => clearInterval(interval);
  }, [isPlaying, onSimulateTick]);

  return (
    <div className="rounded-2xl glass-panel p-6 border border-sky-900/40 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Radio
              className={`w-5 h-5 ${
                isPlaying ? 'text-neon-cyan animate-pulse' : 'text-slate-500'
              }`}
            />
            <h3 className="text-base font-bold text-white tracking-wide">
              Live SOC Telemetry Stream
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
              SYNTHETIC STREAM
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Real-time feed driven by active verification events and simulated threat vectors
          </p>
        </div>

        {/* Live Stream Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-semibold border transition-all ${
              isPlaying
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30 hover:bg-emerald-900/40'
                : 'bg-amber-950/60 text-amber-300 border-amber-500/30 hover:bg-amber-900/40'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause size={13} /> STREAMING
              </>
            ) : (
              <>
                <Play size={13} /> PAUSED
              </>
            )}
          </button>

          <button
            onClick={onSimulateTick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-medium text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 hover:bg-cyan-900/40 transition-colors"
            title="Inject an immediate simulated telemetry event"
          >
            <Sparkles size={13} />
            <span>+ Inject Event</span>
          </button>
        </div>
      </div>

      {/* Feed List */}
      <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
        {events.length === 0 ? (
          <div className="py-12 text-center text-slate-500 font-mono text-xs">
            No telemetry events currently streaming.
          </div>
        ) : (
          events.slice(0, 10).map((evt) => {
            const isSuspicious = evt.prediction === 'SUSPICIOUS';
            const isHighRisk = evt.risk === 'HIGH';

            return (
              <div
                key={evt.id}
                className={`p-3.5 rounded-xl transition-all duration-200 border flex flex-col md:flex-row items-start md:items-center justify-between gap-3 ${
                  isSuspicious
                    ? 'bg-rose-950/20 hover:bg-rose-950/30 border-rose-500/20 hover:border-rose-500/40'
                    : 'bg-cyber-900/50 hover:bg-cyber-900/70 border-sky-900/30 hover:border-sky-800/50'
                }`}
              >
                {/* Left: Icon & Core Details */}
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-xl border flex-shrink-0 mt-0.5 ${
                      isSuspicious
                        ? 'bg-rose-950/60 border-rose-500/40 text-rose-400'
                        : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400'
                    }`}
                  >
                    {isSuspicious ? <ShieldAlert size={16} /> : <ShieldCheck size={16} />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-white">
                        {evt.id}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {evt.time}
                      </span>
                      {evt.scenario && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-950/70 text-indigo-300 border border-indigo-500/30">
                          {evt.scenario}
                        </span>
                      )}
                    </div>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-slate-400">
                      <span>IP: {evt.source_ip || '198.51.100.x'}</span>
                      <span className="text-slate-600">•</span>
                      <span>Key: {evt.key_id || 'ed25519:xxxx'}</span>
                      <span className="text-slate-600">•</span>
                      <span>Failed: {evt.failed_attempts}</span>
                      <span className="text-slate-600">•</span>
                      <span>Rate: {evt.requests_per_minute} RPM</span>
                      {evt.revoked_key_used === 1 && (
                        <span className="text-rose-400 font-bold bg-rose-950/40 px-1 rounded">
                          [REVOKED KEY]
                        </span>
                      )}
                      {evt.invalid_signature === 1 && (
                        <span className="text-amber-400 font-bold bg-amber-950/40 px-1 rounded">
                          [BAD SIG]
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Badges & Inspect Button */}
                <div className="flex items-center gap-2.5 self-end md:self-center">
                  {/* Prediction Pill */}
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                      isSuspicious
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    }`}
                  >
                    {evt.prediction}
                  </span>

                  {/* Risk Category Pill */}
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      isHighRisk
                        ? 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                        : evt.risk === 'REVIEW'
                        ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                        : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                    }`}
                  >
                    RISK: {evt.risk}
                  </span>

                  {/* Inspect CTA */}
                  <button
                    onClick={() => onInspectEvent(evt)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono text-cyan-300 bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-500/30 transition-colors"
                    title="Load event parameters into Threat Analyzer console"
                  >
                    <ExternalLink size={12} />
                    <span>Analyze</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
