import React from 'react';
import { KeyRound, ShieldCheck, RefreshCw, BookOpen, History, Lock } from 'lucide-react';

interface HeaderProps {
  activeTab: 'analyzer' | 'generator' | 'history' | 'guide';
  setActiveTab: (tab: 'analyzer' | 'generator' | 'history' | 'guide') => void;
  reusedCountAlert: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, reusedCountAlert }) => {
  return (
    <header className="bg-[#fdfaf6] dark:bg-[#1c1a17] border-b border-[#e5e1da] dark:border-[#33302a] sticky top-0 z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Identity */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-[#5A5A40] flex items-center justify-center text-[#fdfaf6] shadow-sm">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif-natural font-bold text-2xl text-[#2c2926] dark:text-[#f4f1ea] tracking-tight">
                  PassGuard<span className="text-[#5A5A40] dark:text-[#a39e80]">.</span>
                </span>
                <span className="text-[10px] font-sans font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#e5e1da]/60 dark:bg-[#2e2a26] text-[#5A5A40] dark:text-[#c4be9e] border border-[#d8d3c9] dark:border-[#403c36]">
                  Analyzer
                </span>
              </div>
              <p className="text-xs text-[#7a746e] dark:text-[#a09990] hidden sm:block font-sans">
                Password Strength &amp; Cryptography Evaluator
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1.5 sm:space-x-2">
            <button
              onClick={() => setActiveTab('analyzer')}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-sans font-medium uppercase tracking-wider transition-all ${
                activeTab === 'analyzer'
                  ? 'bg-[#5A5A40] text-white shadow-sm font-bold'
                  : 'text-[#7a746e] dark:text-[#a09990] hover:text-[#2c2926] dark:hover:text-[#f4f1ea] hover:bg-[#f4f1ea] dark:hover:bg-[#292622]'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Analyzer</span>
            </button>

            <button
              onClick={() => setActiveTab('generator')}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-sans font-medium uppercase tracking-wider transition-all ${
                activeTab === 'generator'
                  ? 'bg-[#5A5A40] text-white shadow-sm font-bold'
                  : 'text-[#7a746e] dark:text-[#a09990] hover:text-[#2c2926] dark:hover:text-[#f4f1ea] hover:bg-[#f4f1ea] dark:hover:bg-[#292622]'
              }`}
            >
              <RefreshCw className="w-4 h-4" />
              <span>Generator</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`relative flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-sans font-medium uppercase tracking-wider transition-all ${
                activeTab === 'history'
                  ? 'bg-[#5A5A40] text-white shadow-sm font-bold'
                  : 'text-[#7a746e] dark:text-[#a09990] hover:text-[#2c2926] dark:hover:text-[#f4f1ea] hover:bg-[#f4f1ea] dark:hover:bg-[#292622]'
              }`}
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">Reuse Check</span>
              <span className="sm:hidden">History</span>
              {reusedCountAlert > 0 && (
                <span className="ml-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-sans font-medium uppercase tracking-wider transition-all ${
                activeTab === 'guide'
                  ? 'bg-[#5A5A40] text-white shadow-sm font-bold'
                  : 'text-[#7a746e] dark:text-[#a09990] hover:text-[#2c2926] dark:hover:text-[#f4f1ea] hover:bg-[#f4f1ea] dark:hover:bg-[#292622]'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden md:inline">Guide</span>
              <span className="md:hidden">Guide</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
