import React, { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Database,
} from 'lucide-react';
import { SecurityEvent } from '../../types';

interface EventHistoryTableProps {
  events: SecurityEvent[];
  total: number;
  loading: boolean;
  onSearchChange: (query: string) => void;
  onRiskFilterChange: (risk: string) => void;
  onPredictionFilterChange: (pred: string) => void;
  onReset: () => void;
  onInspect: (event: SecurityEvent) => void;
}

export const EventHistoryTable: React.FC<EventHistoryTableProps> = ({
  events,
  total,
  loading,
  onSearchChange,
  onRiskFilterChange,
  onPredictionFilterChange,
  onReset,
  onInspect,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [predictionFilter, setPredictionFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const pageSize = 15;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    setPage(1);
    onSearchChange(val);
  };

  const handleRisk = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setRiskFilter(val);
    setPage(1);
    onRiskFilterChange(val);
  };

  const handlePrediction = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setPredictionFilter(val);
    setPage(1);
    onPredictionFilterChange(val);
  };

  // Export to CSV
  const exportToCSV = () => {
    if (events.length === 0) return;

    const headers = [
      'Event ID',
      'Timestamp',
      'Prediction',
      'Risk Category',
      'Failed Attempts',
      'Requests Per Minute',
      'Unknown Device',
      'Revoked Key Used',
      'Invalid Signature',
      'Source IP',
      'Key ID',
    ];

    const rows = events.map((e) => [
      e.id,
      e.time,
      e.prediction,
      e.risk,
      e.failed_attempts,
      e.requests_per_minute,
      e.unknown_device ? '1' : '0',
      e.revoked_key_used ? '1' : '0',
      e.invalid_signature ? '1' : '0',
      e.source_ip || 'N/A',
      e.key_id || 'N/A',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `quantum_shield_telemetry_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalPages = Math.max(1, Math.ceil(events.length / pageSize));
  const displayedEvents = events.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="rounded-2xl glass-panel p-6 border border-sky-900/40 space-y-5">
      {/* Header & Export CTA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-sky-900/40 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-neon-cyan" />
            <h3 className="text-base font-bold text-white tracking-wide">
              Security Event Telemetry Audit Log
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Audit history of all evaluated digital-signature transactions ({total} records total)
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={exportToCSV}
            disabled={events.length === 0}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold text-slate-900 bg-neon-cyan hover:bg-cyan-300 transition-all shadow-neon-cyan active:scale-95 disabled:opacity-50"
            title="Download audit telemetry as CSV"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white bg-cyber-900/70 border border-sky-900/40 hover:border-sky-700 transition-colors"
            title="Reset telemetry to initial benchmark seeds"
          >
            <RotateCcw size={13} />
            <span>Reset Log</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Search */}
        <div className="sm:col-span-6 relative">
          <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search by ID, IP, Key ID, Timestamp..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-cyber-900/80 border border-sky-900/50 text-slate-200 placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-cyan-500/60"
          />
        </div>

        {/* Risk Filter */}
        <div className="sm:col-span-3">
          <select
            value={riskFilter}
            onChange={handleRisk}
            className="w-full px-3 py-2 rounded-xl bg-cyber-900/80 border border-sky-900/50 text-slate-300 text-xs font-mono focus:outline-none focus:border-cyan-500/60"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="HIGH">Risk: HIGH</option>
            <option value="REVIEW">Risk: REVIEW</option>
            <option value="LOW">Risk: LOW</option>
          </select>
        </div>

        {/* Prediction Filter */}
        <div className="sm:col-span-3">
          <select
            value={predictionFilter}
            onChange={handlePrediction}
            className="w-full px-3 py-2 rounded-xl bg-cyber-900/80 border border-sky-900/50 text-slate-300 text-xs font-mono focus:outline-none focus:border-cyan-500/60"
          >
            <option value="ALL">All Predictions</option>
            <option value="SUSPICIOUS">SUSPICIOUS</option>
            <option value="NORMAL">NORMAL</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-sky-900/40">
        <table className="w-full text-left font-mono text-xs">
          <thead className="bg-cyber-900/90 text-slate-400 uppercase tracking-wider text-[11px] border-b border-sky-900/40">
            <tr>
              <th className="py-3 px-3.5">ID / Time</th>
              <th className="py-3 px-3.5">Prediction</th>
              <th className="py-3 px-3.5">Risk Category</th>
              <th className="py-3 px-3.5">Failed Att.</th>
              <th className="py-3 px-3.5">Rate (RPM)</th>
              <th className="py-3 px-3.5">Revoked Key</th>
              <th className="py-3 px-3.5">Invalid Sig</th>
              <th className="py-3 px-3.5">Source IP</th>
              <th className="py-3 px-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sky-950/80 bg-cyber-950/40">
            {loading ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-cyan-400">
                  Loading telemetry records...
                </td>
              </tr>
            ) : displayedEvents.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-500">
                  No security events match the active search and filter criteria.
                </td>
              </tr>
            ) : (
              displayedEvents.map((e) => {
                const isSuspicious = e.prediction === 'SUSPICIOUS';
                const isHigh = e.risk === 'HIGH';

                return (
                  <tr
                    key={e.id}
                    className="hover:bg-cyber-900/60 transition-colors group"
                  >
                    <td className="py-3 px-3.5">
                      <div className="font-bold text-slate-200">{e.id}</div>
                      <div className="text-[10px] text-slate-400">{e.time}</div>
                    </td>

                    <td className="py-3 px-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold border ${
                          isSuspicious
                            ? 'bg-rose-950/60 text-rose-300 border-rose-500/40'
                            : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                        }`}
                      >
                        {isSuspicious ? <ShieldAlert size={12} /> : <ShieldCheck size={12} />}
                        {e.prediction}
                      </span>
                    </td>

                    <td className="py-3 px-3.5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                          isHigh
                            ? 'bg-rose-950/60 text-rose-300 border-rose-500/40'
                            : e.risk === 'REVIEW'
                            ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                            : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                        }`}
                      >
                        {e.risk}
                      </span>
                    </td>

                    <td className="py-3 px-3.5 text-slate-200 font-bold">
                      {e.failed_attempts}
                    </td>

                    <td className="py-3 px-3.5 text-slate-200">
                      {e.requests_per_minute} RPM
                    </td>

                    <td className="py-3 px-3.5">
                      {e.revoked_key_used ? (
                        <span className="text-rose-400 font-bold bg-rose-950/50 px-1.5 py-0.5 rounded border border-rose-500/30">
                          YES
                        </span>
                      ) : (
                        <span className="text-slate-500">NO</span>
                      )}
                    </td>

                    <td className="py-3 px-3.5">
                      {e.invalid_signature ? (
                        <span className="text-amber-400 font-bold bg-amber-950/50 px-1.5 py-0.5 rounded border border-amber-500/30">
                          INVALID
                        </span>
                      ) : (
                        <span className="text-emerald-400">VALID</span>
                      )}
                    </td>

                    <td className="py-3 px-3.5 text-slate-400 text-[11px]">
                      {e.source_ip || '198.51.100.x'}
                    </td>

                    <td className="py-3 px-3.5 text-right">
                      <button
                        onClick={() => onInspect(e)}
                        className="px-2.5 py-1 rounded-lg text-[11px] text-cyan-300 hover:text-white bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/30 transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs font-mono text-slate-400">
        <div>
          Showing {displayedEvents.length} of {events.length} filtered items
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1.5 rounded-lg border border-sky-900/40 bg-cyber-900/80 text-slate-300 hover:text-white disabled:opacity-40"
          >
            <ChevronLeft size={16} />
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-1.5 rounded-lg border border-sky-900/40 bg-cyber-900/80 text-slate-300 hover:text-white disabled:opacity-40"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
