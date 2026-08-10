import React, { useState } from 'react';
import { PasswordAnalysis } from '../types';
import { Sparkles, Copy, Check, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface UpgradedAlternativesProps {
  analysis: PasswordAnalysis;
  onApplyPassword: (pw: string) => void;
}

export const UpgradedAlternatives: React.FC<UpgradedAlternativesProps> = ({
  analysis,
  onApplyPassword,
}) => {
  const { upgradedAlternatives } = analysis;
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!upgradedAlternatives || upgradedAlternatives.length === 0) return null;

  const handleCopy = (pw: string, index: number) => {
    navigator.clipboard.writeText(pw);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const labels = [
    { type: 'Symbol & Number Boost', badge: 'Fast Upgrade', color: 'bg-[#e5e1da] text-[#5A5A40] dark:bg-[#2c2924] dark:text-[#c4be9e] border-[#d8d3c9] dark:border-[#3d3933]' },
    { type: 'Hybrid Passphrase', badge: 'High Memory', color: 'bg-[#e5e1da] text-[#5A5A40] dark:bg-[#2c2924] dark:text-[#c4be9e] border-[#d8d3c9] dark:border-[#3d3933]' },
    { type: '4-Word Diceware Passphrase', badge: 'Recommended', color: 'bg-[#5A5A40] text-white border-[#5A5A40]' },
    { type: 'Random High-Entropy String', badge: 'Max Security', color: 'bg-[#e5e1da] text-[#5A5A40] dark:bg-[#2c2924] dark:text-[#c4be9e] border-[#d8d3c9] dark:border-[#3d3933]' },
  ];

  return (
    <div className="bg-white dark:bg-[#22201d] rounded-[28px] border border-[#e5e1da] dark:border-[#383430] p-6 sm:p-7 shadow-xs">
      <div className="flex items-center space-x-3 mb-5 pb-4 border-b border-[#f0ede8] dark:border-[#33302a]">
        <div className="p-2.5 rounded-xl bg-[#f4f1ea] dark:bg-[#2c2924] text-[#5A5A40] dark:text-[#c4be9e]">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-serif-natural font-semibold text-[#2c2926] dark:text-[#f4f1ea] text-lg">
            Suggested Stronger Alternatives
          </h3>
          <p className="text-xs text-[#7a746e] dark:text-[#a09990] font-sans">
            Auto-generated secure variants that resolve weaknesses in your current password
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
        {upgradedAlternatives.map((alt, idx) => {
          const meta = labels[idx] || labels[0];
          const isCopied = copiedIndex === idx;

          return (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-2xl bg-[#f4f1ea] dark:bg-[#191715] border border-[#e5e1da] dark:border-[#33302a] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-xs font-semibold text-[#2c2926] dark:text-[#f4f1ea]">
                    {meta.type}
                  </span>
                  <span className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full border ${meta.color}`}>
                    {meta.badge}
                  </span>
                </div>

                <div className="font-mono text-sm sm:text-base font-bold text-[#2c2926] dark:text-[#f4f1ea] break-all bg-white dark:bg-[#22201d] p-3 rounded-xl border border-[#e5e1da] dark:border-[#383430] mb-3">
                  {alt}
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <button
                  onClick={() => onApplyPassword(alt)}
                  className="flex-1 inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-full bg-[#5A5A40] hover:bg-[#484833] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
                >
                  <span>Test in Evaluator</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleCopy(alt, idx)}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors border ${
                    isCopied
                      ? 'bg-[#5A5A40] text-white border-[#5A5A40]'
                      : 'bg-white text-[#2c2926] border-[#e5e1da] dark:bg-[#22201d] dark:text-[#f4f1ea] dark:border-[#383430] hover:bg-[#e5e1da]/60'
                  }`}
                >
                  {isCopied ? (
                    <span className="flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Copied
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Copy className="w-3.5 h-3.5" /> Copy
                    </span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
