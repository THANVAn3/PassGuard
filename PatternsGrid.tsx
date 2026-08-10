import React from 'react';
import { PasswordAnalysis } from '../types';
import { AlertTriangle, CheckCircle, ShieldAlert, Zap, BookOpen, Key, Calendar, Repeat, Grid } from 'lucide-react';

interface PatternsGridProps {
  analysis: PasswordAnalysis;
}

export const PatternsGrid: React.FC<PatternsGridProps> = ({ analysis }) => {
  const { patterns, warnings, suggestions } = analysis;

  const patternItems = [
    {
      title: 'Dictionary Term',
      detected: patterns.hasCommonWords || patterns.isCommonPassword,
      icon: BookOpen,
      desc: 'Matches known words or wordlists.',
    },
    {
      title: 'Keyboard Walks',
      detected: patterns.hasKeyboardWalk,
      icon: Grid,
      desc: 'Uses adjacent keys like "qwerty" or "12345".',
    },
    {
      title: 'Sequential Runs',
      detected: patterns.hasSequential,
      icon: Key,
      desc: 'Contains ordered runs like "abc" or "789".',
    },
    {
      title: 'Repeated Chars',
      detected: patterns.hasRepeats,
      icon: Repeat,
      desc: 'Repeats same char 3+ times in a row.',
    },
    {
      title: 'Predictable Dates',
      detected: patterns.hasDates,
      icon: Calendar,
      desc: 'Includes 4-digit years (e.g. 1998, 2026).',
    },
  ];

  return (
    <div className="bg-white dark:bg-[#22201d] rounded-[28px] border border-[#e5e1da] dark:border-[#383430] p-6 sm:p-7 shadow-xs">
      <div className="flex items-center space-x-3 mb-5 pb-4 border-b border-[#f0ede8] dark:border-[#33302a]">
        <div className="p-2.5 rounded-xl bg-[#f4f1ea] dark:bg-[#2c2924] text-[#5A5A40] dark:text-[#c4be9e]">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-serif-natural font-semibold text-[#2c2926] dark:text-[#f4f1ea] text-lg">
            Pattern Diagnostics
          </h3>
          <p className="text-xs text-[#7a746e] dark:text-[#a09990] font-sans">
            Detecting predictable keyboard patterns, sequences, and dictionary words
          </p>
        </div>
      </div>

      {/* Pattern Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-6 font-sans">
        {patternItems.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div
              key={idx}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                p.detected
                  ? 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60 text-amber-950 dark:text-amber-200'
                  : 'bg-[#f4f1ea] dark:bg-[#191715] border-[#e5e1da] dark:border-[#33302a] text-[#2c2926] dark:text-[#f4f1ea]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Icon
                    className={`w-4 h-4 ${
                      p.detected ? 'text-amber-800 dark:text-amber-400' : 'text-[#7a746e] dark:text-[#a09990]'
                    }`}
                  />
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      p.detected
                        ? 'bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200'
                        : 'bg-[#e5e1da] text-[#5A5A40] dark:bg-[#2e2a26] dark:text-[#c4be9e]'
                    }`}
                  >
                    {p.detected ? 'Detected' : 'Clear'}
                  </span>
                </div>
                <h4 className="text-xs font-bold mb-1 leading-tight">{p.title}</h4>
                <p className="text-[11px] text-[#7a746e] dark:text-[#a09990] leading-normal">{p.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recommendations & Warnings Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
        {/* Warnings */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#f4f1ea] dark:bg-[#191715] border border-[#e5e1da] dark:border-[#33302a]">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-400 flex items-center gap-1.5 mb-2.5 font-serif-natural">
            <AlertTriangle className="w-4 h-4 text-amber-800" />
            Vulnerabilities ({warnings.length})
          </h4>
          {warnings.length === 0 ? (
            <p className="text-xs text-[#7a746e] dark:text-[#a09990] italic">No structural weaknesses detected.</p>
          ) : (
            <ul className="space-y-2 text-xs text-[#2c2926] dark:text-[#f4f1ea]">
              {warnings.map((w, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <span className="text-amber-800 font-bold">•</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Suggestions */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#f4f1ea] dark:bg-[#191715] border border-[#e5e1da] dark:border-[#33302a]">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#5A5A40] dark:text-[#c4be9e] flex items-center gap-1.5 mb-2.5 font-serif-natural">
            <CheckCircle className="w-4 h-4 text-[#5A5A40]" />
            Actionable Enhancements
          </h4>
          <ul className="space-y-2 text-xs text-[#2c2926] dark:text-[#f4f1ea]">
            {suggestions.map((s, i) => (
              <li key={i} className="flex items-start space-x-2">
                <span className="text-[#5A5A40] font-bold">•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
