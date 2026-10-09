import React, { useState } from 'react';
import {
  KeyRound,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  Sparkles,
  ArrowRight,
  Fingerprint,
} from 'lucide-react';
import { api } from '../../services/api';
import { CryptoDemoResult } from '../../types';

interface SignatureSandboxProps {
  onSendToAnalyzer: (invalidSig: number) => void;
}

export const SignatureSandbox: React.FC<SignatureSandboxProps> = ({
  onSendToAnalyzer,
}) => {
  const [message, setMessage] = useState(
    'Authorize high-value cryptographic document transfer [TOKEN-QX-9912]'
  );
  const [tamper, setTamper] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CryptoDemoResult | null>(null);

  const handleVerify = async () => {
    setLoading(true);
    try {
      const res = await api.verifySignature(message, tamper);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Run on mount once
  React.useEffect(() => {
    handleVerify();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl glass-panel p-6 border border-sky-900/40">
        <div className="flex items-center gap-2.5">
          <KeyRound className="w-6 h-6 text-neon-cyan" />
          <h3 className="text-lg font-bold text-white tracking-wide">
            Interactive Ed25519 Cryptographic Signature Sandbox
          </h3>
        </div>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Direct cryptographic demonstration of digital-signature generation and in-transit tampering (based on <code className="text-cyan-300">signature_demo.py</code>)
        </p>
      </div>

      {/* Interactive Controls & Verification */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Input & Simulation Options */}
        <div className="lg:col-span-6 rounded-2xl glass-panel p-6 border border-sky-900/40 space-y-4">
          <div className="flex items-center justify-between border-b border-sky-900/30 pb-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Lock size={15} className="text-cyan-400" />
              <span>Document Payload to Sign</span>
            </h4>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-cyan-300 border border-sky-800">
              RFC 8032 Ed25519
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-400">Payload Plaintext:</label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 rounded-xl bg-cyber-900/80 border border-sky-900/50 text-slate-200 text-xs font-mono focus:outline-none focus:border-cyan-500/60"
            />
          </div>

          {/* Tamper Simulation Toggle */}
          <div
            onClick={() => setTamper(!tamper)}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between select-none ${
              tamper
                ? 'bg-rose-950/40 border-rose-500/50 text-rose-300 shadow-neon-rose/20'
                : 'bg-cyber-900/60 border-sky-900/40 text-slate-400 hover:border-sky-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Unlock size={17} className={tamper ? 'text-rose-400' : 'text-slate-500'} />
              <div>
                <div className="text-xs font-bold text-slate-200">
                  Simulate Man-in-the-Middle Payload Tampering
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  Mutates payload bytes in transit to trigger signature digest failure
                </div>
              </div>
            </div>
            <span
              className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                tamper
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              {tamper ? 'TAMPERED' : 'AUTHENTIC'}
            </span>
          </div>

          {/* Verify CTA */}
          <button
            onClick={handleVerify}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold font-mono text-xs uppercase bg-gradient-to-r from-cyan-400 to-sky-500 text-slate-950 hover:from-cyan-300 hover:to-sky-400 transition-all shadow-neon-cyan active:scale-95 disabled:opacity-50"
          >
            <Fingerprint size={16} />
            <span>{loading ? 'Verifying Ed25519 Cryptographic Digest...' : 'Sign & Verify Digital Signature'}</span>
          </button>
        </div>

        {/* Right: Verification Output */}
        <div className="lg:col-span-6 rounded-2xl glass-panel p-6 border border-sky-900/40 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-sky-900/30 pb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Fingerprint size={16} className="text-neon-cyan" />
                <span>Cryptographic Verification Output</span>
              </h4>
              {result && (
                <span
                  className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                    result.is_valid
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                      : 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                  }`}
                >
                  {result.status}
                </span>
              )}
            </div>

            {result ? (
              <div className="mt-4 space-y-3 font-mono text-xs">
                {/* Result banner */}
                <div
                  className={`p-3.5 rounded-xl border flex items-center gap-3 ${
                    result.is_valid
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                  }`}
                >
                  {result.is_valid ? <ShieldCheck size={20} /> : <ShieldAlert size={20} />}
                  <span className="font-semibold text-xs leading-relaxed">
                    {result.explanation}
                  </span>
                </div>

                <div className="space-y-1.5 p-3 rounded-xl bg-cyber-900/60 border border-sky-900/40 text-[11px]">
                  <div className="text-slate-400">Algorithm: <span className="text-white font-bold">{result.algorithm}</span></div>
                  <div className="text-slate-400">Signature Digest Preview:</div>
                  <div className="text-cyan-300 font-mono text-[10px] truncate bg-cyber-950 p-1.5 rounded border border-sky-900/40">
                    {result.signature_preview}
                  </div>
                  <div className="text-slate-400 pt-1">
                    Verified Payload: <span className="text-slate-200">{result.verified_message}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-indigo-300 text-[11px] leading-relaxed">
                  <strong>Threat Detection Link:</strong> {result.threat_implication}
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 font-mono text-xs">
                Click "Sign & Verify" to run Ed25519 cryptographic evaluation.
              </div>
            )}
          </div>

          {result && (
            <button
              onClick={() => onSendToAnalyzer(result.is_valid ? 0 : 1)}
              className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-mono font-medium text-cyan-300 bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-500/30 transition-colors"
            >
              <span>Test This Telemetry in Threat Analyzer Console</span>
              <ArrowRight size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
