import React from 'react';
import { PasswordAnalysis } from '../types';
import { Clock, CheckCircle2, XCircle, ShieldCheck, Cpu, Server, Lock, Globe } from 'lucide-react';

interface MetricsCardsProps {
  analysis: PasswordAnalysis;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({ analysis }) => {
  const { estimates, characterTypes, length, charsetSize, entropyBits, rawEntropyBits } = analysis;

  const charChecks = [
    { label: 'Lowercase (a-z)', active: characterTypes.lowercase, count: '26 chars' },
    { label: 'Uppercase (A-Z)', active: characterTypes.uppercase, count: '26 chars' },
    { label: 'Numbers (0-9)', active: characterTypes.numbers, count: '10 chars' },
    { label: 'Symbols (!@#$...)', active: characterTypes.symbols, count: '33 chars' },
    { label: 'Min 12+ Characters', active: length >= 12, count: `${length} chars` },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Time to Crack Matrix */}
      <div className="bg-white dark:bg-[#22201d] rounded-[28px] border border-[#e5e1da] dark:border-[#383430] p-6 sm:p-7 shadow-xs">
        <div className="flex items-center space-x-3 mb-5 pb-4 border-b border-[#f0ede8] dark:border-[#33302a]">
          <div className="p-2.5 rounded-xl bg-[#f4f1ea] dark:bg-[#2c2924] text-[#5A5A40] dark:text-[#c4be9e]">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif-natural font-semibold text-[#2c2926] dark:text-[#f4f1ea] text-lg">
              Brute-Force Crack Time
            </h3>
            <p className="text-xs text-[#7a746e] dark:text-[#a09990] font-sans">
              Estimated time to crack across standard attacker threat scenarios
            </p>
          </div>
        </div>

        <div className="space-y-3 font-sans">
          {/* Scenario 1: Online Throttled */}
          <div className="p-3.5 rounded-2xl bg-[#f4f1ea] dark:bg-[#191715] border border-[#e5e1da] dark:border-[#33302a] flex items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <Globe className="w-4 h-4 text-[#5A5A40] shrink-0" />
              <div>
                <span className="font-semibold text-[#2c2926] dark:text-[#f4f1ea] text-xs block">
                  Online Attack (Rate Limited)
                </span>
                <span className="text-[11px] text-[#7a746e] dark:text-[#a09990]">
                  ~100 guesses/sec (Web form captcha)
                </span>
              </div>
            </div>
            <span className="font-mono font-bold text-xs sm:text-sm text-[#2c2926] dark:text-[#f4f1ea] bg-white dark:bg-[#22201d] px-3 py-1 rounded-full border border-[#e5e1da] dark:border-[#383430]">
              {estimates.onlineThrottled}
            </span>
          </div>

          {/* Scenario 2: Online Unthrottled */}
          <div className="p-3.5 rounded-2xl bg-[#f4f1ea] dark:bg-[#191715] border border-[#e5e1da] dark:border-[#33302a] flex items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <Server className="w-4 h-4 text-[#5A5A40] shrink-0" />
              <div>
                <span className="font-semibold text-[#2c2926] dark:text-[#f4f1ea] text-xs block">
                  Online Attack (Unthrottled)
                </span>
                <span className="text-[11px] text-[#7a746e] dark:text-[#a09990]">
                  ~10,000 guesses/sec (API endpoint)
                </span>
              </div>
            </div>
            <span className="font-mono font-bold text-xs sm:text-sm text-[#2c2926] dark:text-[#f4f1ea] bg-white dark:bg-[#22201d] px-3 py-1 rounded-full border border-[#e5e1da] dark:border-[#383430]">
              {estimates.onlineUnthrottled}
            </span>
          </div>

          {/* Scenario 3: Offline Slow Hash */}
          <div className="p-3.5 rounded-2xl bg-[#f4f1ea] dark:bg-[#191715] border border-[#e5e1da] dark:border-[#33302a] flex items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <Lock className="w-4 h-4 text-[#5A5A40] shrink-0" />
              <div>
                <span className="font-semibold text-[#2c2926] dark:text-[#f4f1ea] text-xs block">
                  Offline Stolen Database (Modern Hash)
                </span>
                <span className="text-[11px] text-[#7a746e] dark:text-[#a09990]">
                  Bcrypt / Argon2 (~10k guesses/sec)
                </span>
              </div>
            </div>
            <span className="font-mono font-bold text-xs sm:text-sm text-[#2c2926] dark:text-[#f4f1ea] bg-white dark:bg-[#22201d] px-3 py-1 rounded-full border border-[#e5e1da] dark:border-[#383430]">
              {estimates.offlineSlowHash}
            </span>
          </div>

          {/* Scenario 4: Offline Fast Hash */}
          <div className="p-3.5 rounded-2xl bg-[#f4f1ea] dark:bg-[#191715] border border-[#e5e1da] dark:border-[#33302a] flex items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <Cpu className="w-4 h-4 text-amber-800 dark:text-amber-500 shrink-0" />
              <div>
                <span className="font-semibold text-[#2c2926] dark:text-[#f4f1ea] text-xs block">
                  Offline Stolen Database (Legacy Hash)
                </span>
                <span className="text-[11px] text-[#7a746e] dark:text-[#a09990]">
                  MD5 / SHA1 GPU Rig (100 Billion/sec)
                </span>
              </div>
            </div>
            <span className="font-mono font-bold text-xs sm:text-sm text-amber-900 dark:text-amber-300 bg-white dark:bg-[#22201d] px-3 py-1 rounded-full border border-[#e5e1da] dark:border-[#383430]">
              {estimates.offlineFastHash}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Character Composition & Entropy Math */}
      <div className="bg-white dark:bg-[#22201d] rounded-[28px] border border-[#e5e1da] dark:border-[#383430] p-6 sm:p-7 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-5 pb-4 border-b border-[#f0ede8] dark:border-[#33302a]">
            <div className="p-2.5 rounded-xl bg-[#f4f1ea] dark:bg-[#2c2924] text-[#5A5A40] dark:text-[#c4be9e]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-natural font-semibold text-[#2c2926] dark:text-[#f4f1ea] text-lg">
                Complexity Checklist
              </h3>
              <p className="text-xs text-[#7a746e] dark:text-[#a09990] font-sans">
                Character set diversity &amp; length parameters
              </p>
            </div>
          </div>

          {/* Checklist */}
          <div className="space-y-2.5 mb-6 font-sans">
            {charChecks.map((item, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                  item.active
                    ? 'bg-[#f4f1ea] dark:bg-[#292622] border-[#5A5A40]/30 text-[#2c2926] dark:text-[#f4f1ea]'
                    : 'bg-[#f8f6f2] dark:bg-[#191715] border-[#e5e1da] dark:border-[#33302a] text-[#a09990]'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  {item.active ? (
                    <CheckCircle2 className="w-4 h-4 text-[#5A5A40] dark:text-[#c4be9e] shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-[#a09990] shrink-0" />
                  )}
                  <span className="text-xs font-semibold">{item.label}</span>
                </div>
                <span className="text-[11px] font-mono font-medium opacity-80">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Entropy Breakdown Footer */}
        <div className="p-4 rounded-2xl bg-[#f4f1ea] dark:bg-[#191715] border border-[#e5e1da] dark:border-[#33302a] text-xs font-sans">
          <div className="flex items-center justify-between mb-1 font-semibold text-[#2c2926] dark:text-[#f4f1ea]">
            <span>Entropy Math Formula:</span>
            <span className="font-mono text-[#5A5A40] dark:text-[#c4be9e]">
              {charsetSize > 0 ? `log₂(${charsetSize}^${length})` : '0 bits'}
            </span>
          </div>
          <p className="text-[11px] text-[#7a746e] dark:text-[#a09990] leading-relaxed">
            Raw entropy pool: <strong className="text-[#2c2926] dark:text-[#f4f1ea] font-mono">{rawEntropyBits} bits</strong>. Deducting pattern penalties, effective entropy is <strong className="text-[#5A5A40] dark:text-[#c4be9e] font-mono">{entropyBits} bits</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};
