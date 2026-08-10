import React from 'react';
import { PasswordAnalysis } from '../types';
import { ShieldCheck, ShieldAlert, Zap, Layers, AlertCircle } from 'lucide-react';

interface StrengthMeterProps {
  analysis: PasswordAnalysis;
}

export const StrengthMeter: React.FC<StrengthMeterProps> = ({ analysis }) => {
  const { score, scoreLabel, scoreColor, entropyBits, length, warnings } = analysis;

  // Segment colors for meter
  const getSegmentColor = (index: number) => {
    if (index > score) return 'bg-[#e5e1da] dark:bg-[#2e2a26]';
    switch (score) {
      case 0:
        return 'bg-amber-800 dark:bg-amber-700';
      case 1:
        return 'bg-amber-600 dark:bg-amber-500';
      case 2:
        return 'bg-[#7a746e] dark:bg-[#a09990]';
      case 3:
        return 'bg-[#5A5A40] dark:bg-[#8c8c68]';
      case 4:
        return 'bg-[#3b3b29] dark:bg-[#a39e80]';
      default:
        return 'bg-[#e5e1da]';
    }
  };

  return (
    <div className="bg-white dark:bg-[#22201d] rounded-[28px] border border-[#e5e1da] dark:border-[#383430] p-6 sm:p-7 shadow-xs transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div className="flex items-center space-x-3.5">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg text-[#fdfaf6] shadow-xs transition-colors ${
              score >= 3 ? 'bg-[#5A5A40]' : score === 2 ? 'bg-[#7a746e]' : 'bg-amber-700'
            }`}
          >
            {score >= 3 ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h3 className="text-2xl font-serif-natural font-semibold text-[#2c2926] dark:text-[#f4f1ea]">
                {scoreLabel}
              </h3>
              <span className={`px-3 py-0.5 rounded-full text-xs font-sans font-bold tracking-widest uppercase bg-[#f4f1ea] dark:bg-[#2c2924] border border-[#e5e1da] dark:border-[#3d3933] text-[#5A5A40] dark:text-[#c4be9e]`}>
                Grade {score}/4
              </span>
            </div>
            <p className="text-xs text-[#7a746e] dark:text-[#a09990] mt-0.5 font-sans">
              {length === 0
                ? 'No password entered'
                : score === 4
                ? 'Optimal cryptographic entropy for critical accounts'
                : score === 3
                ? 'Strong protection against standard brute force'
                : score === 2
                ? 'Moderate security, consider adding length and symbols'
                : 'Vulnerable to automated dictionary and fast-hash cracking'}
            </p>
          </div>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex items-center space-x-2.5 text-xs">
          <div className="bg-[#f4f1ea] dark:bg-[#191715] px-3.5 py-2 rounded-2xl border border-[#e5e1da] dark:border-[#33302a] text-center">
            <span className="text-[#7a746e] dark:text-[#a09990] block text-[10px] font-bold uppercase tracking-wider">Length</span>
            <span className="font-mono font-bold text-[#2c2926] dark:text-[#f4f1ea] text-sm">{length} chars</span>
          </div>

          <div className="bg-[#f4f1ea] dark:bg-[#191715] px-3.5 py-2 rounded-2xl border border-[#e5e1da] dark:border-[#33302a] text-center">
            <span className="text-[#7a746e] dark:text-[#a09990] block text-[10px] font-bold uppercase tracking-wider">Entropy</span>
            <span className="font-mono font-bold text-[#5A5A40] dark:text-[#c4be9e] text-sm">{entropyBits} bits</span>
          </div>
        </div>
      </div>

      {/* Segmented Strength Bar */}
      <div className="space-y-2">
        <div className="grid grid-cols-4 gap-2.5">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="h-3.5 rounded-full bg-[#f4f1ea] dark:bg-[#191715] border border-[#e5e1da]/60 dark:border-[#33302a] overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ease-out ${getSegmentColor(step)}`}
                style={{ width: score >= step ? '100%' : '0%' }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[11px] font-medium text-[#7a746e] dark:text-[#a09990] px-1 font-sans">
          <span>Very Weak</span>
          <span>Weak</span>
          <span>Fair</span>
          <span>Strong</span>
          <span>Very Strong</span>
        </div>
      </div>

      {/* Critical Leak Warning if common password */}
      {analysis.patterns.isCommonPassword && (
        <div className="mt-5 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200 flex items-start space-x-3 text-xs font-sans">
          <AlertCircle className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-sm font-serif-natural">Critical Security Warning: Leaked Password</span>
            This exact password is featured in public breach wordlists (like RockYou). Automated hacker tools test this password first regardless of length!
          </div>
        </div>
      )}
    </div>
  );
};
