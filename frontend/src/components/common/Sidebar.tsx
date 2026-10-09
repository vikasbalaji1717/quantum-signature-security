import React from 'react';
import {
  ShieldAlert,
  Activity,
  Cpu,
  History,
  KeyRound,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Radio,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  backendOnline: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  collapsed,
  setCollapsed,
  backendOnline,
}) => {
  const navItems = [
    {
      id: 'overview',
      label: 'Threat Overview',
      icon: Activity,
      badge: 'LIVE',
    },
    {
      id: 'analyzer',
      label: 'Threat Analyzer',
      icon: ShieldAlert,
      badge: 'CONSOLE',
    },
    {
      id: 'history',
      label: 'Telemetry History',
      icon: History,
      badge: null,
    },
    {
      id: 'insights',
      label: 'Quantum Insights',
      icon: Cpu,
      badge: 'EXP',
    },
    {
      id: 'crypto',
      label: 'Signature Sandbox',
      icon: KeyRound,
      badge: 'Ed25519',
    },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-40 transition-all duration-300 ease-in-out border-r border-sky-900/30 bg-cyber-900/90 backdrop-blur-xl flex flex-col justify-between ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Header & Logo */}
      <div>
        <div className="flex items-center justify-between p-4 border-b border-sky-900/30">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/30 shadow-neon-cyan">
              <ShieldCheck className="w-5 h-5 text-neon-cyan animate-pulse-slow" />
              <div className="absolute inset-0 rounded-xl bg-neon-cyan/10 blur-sm -z-10" />
            </div>
            {!collapsed && (
              <div className="leading-tight">
                <span className="font-extrabold text-base tracking-wider bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                  QUANTUM<span className="text-neon-cyan font-mono">SHIELD</span>
                </span>
                <span className="block text-[10px] tracking-widest text-sky-400/70 font-mono uppercase">
                  SOC DEFENSE
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-sky-950/40 border border-transparent hover:border-sky-800/40 transition-colors"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation items */}
        <nav className="p-3 space-y-1.5 mt-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-950/80 to-sky-950/40 text-cyan-300 border border-cyan-500/30 shadow-neon-cyan/20'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-sky-950/30 border border-transparent hover:border-sky-800/20'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  size={20}
                  className={`flex-shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-neon-cyan' : 'text-slate-400 group-hover:text-cyan-300'
                  }`}
                />
                {!collapsed && (
                  <span className="flex-1 text-left truncate">{item.label}</span>
                )}
                {!collapsed && item.badge && (
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${
                      isActive
                        ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300'
                        : 'border-slate-700/60 bg-slate-800/40 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-md bg-neon-cyan shadow-[0_0_8px_#00f0ff]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer System Status Panel */}
      <div className="p-3 border-t border-sky-900/30">
        {!collapsed ? (
          <div className="p-3 rounded-xl bg-cyber-850/80 border border-sky-900/40 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-slate-400 flex items-center gap-1.5">
                <Radio size={12} className={backendOnline ? 'text-neon-emerald animate-pulse' : 'text-rose-500'} />
                ML Engine
              </span>
              <span
                className={`font-mono text-[10px] px-1.5 py-0.5 rounded border ${
                  backendOnline
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                    : 'bg-rose-950/60 text-rose-300 border-rose-500/30'
                }`}
              >
                {backendOnline ? 'ONLINE' : 'OFFLINE'}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 size={12} className="text-cyan-400" />
                Model Check
              </span>
              <span className="font-mono text-[10px] text-cyan-300">QUANTUM-RF</span>
            </div>

            <div className="pt-1.5 border-t border-sky-900/40 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Mode</span>
              <span className="text-amber-400 flex items-center gap-1">
                <AlertCircle size={11} /> SYNTHETIC DEMO
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-2">
            <div
              className={`w-3 h-3 rounded-full ${
                backendOnline ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]' : 'bg-rose-400'
              }`}
              title={backendOnline ? 'ML Engine Online' : 'ML Engine Offline'}
            />
          </div>
        )}
      </div>
    </aside>
  );
};
