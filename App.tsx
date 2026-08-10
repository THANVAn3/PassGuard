import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PasswordInput } from './components/PasswordInput';
import { StrengthMeter } from './components/StrengthMeter';
import { MetricsCards } from './components/MetricsCards';
import { PatternsGrid } from './components/PatternsGrid';
import { UpgradedAlternatives } from './components/UpgradedAlternatives';
import { PasswordGeneratorTab } from './components/PasswordGeneratorTab';
import { PasswordHistorySection } from './components/PasswordHistorySection';
import { EducationalGuide } from './components/EducationalGuide';
import { analyzePassword } from './utils/passwordAnalyzer';
import { hashPassword, maskPassword } from './utils/cryptoUtils';
import { PasswordHistoryItem } from './types';
import { KeyRound, ShieldCheck, Cpu } from 'lucide-react';

const STORAGE_KEY = 'passguard_history_v1';

export default function App() {
  const [password, setPassword] = useState('Summer2024!');
  const [activeTab, setActiveTab] = useState<'analyzer' | 'generator' | 'history' | 'guide'>('analyzer');
  const [history, setHistory] = useState<PasswordHistoryItem[]>([]);

  // Load history from localStorage or seed initial defaults
  useEffect(() => {
    let isMounted = true;
    async function initHistory() {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            if (isMounted) setHistory(parsed);
            return;
          }
        } catch (e) {
          console.error('Failed to parse history:', e);
        }
      }

      // Seed initial sample history entries if none exist
      const sample1Hash = await hashPassword('password123');
      const sample2Hash = await hashPassword('AdminPass2023!');
      const sample3Hash = await hashPassword('Summer2024!');

      const defaults: PasswordHistoryItem[] = [
        {
          id: 'def-1',
          label: 'Primary Work Email (2023)',
          hash: sample2Hash,
          maskedPreview: maskPassword('AdminPass2023!'),
          strengthScore: 3,
          createdAt: 'Jan 15, 2025',
        },
        {
          id: 'def-2',
          label: 'Old Social Media Login',
          hash: sample1Hash,
          maskedPreview: maskPassword('password123'),
          strengthScore: 1,
          createdAt: 'Nov 02, 2024',
        },
        {
          id: 'def-3',
          label: 'Stored WiFi Password',
          hash: sample3Hash,
          maskedPreview: maskPassword('Summer2024!'),
          strengthScore: 2,
          createdAt: 'Aug 01, 2026',
        },
      ];

      if (isMounted) {
        setHistory(defaults);
      }
    }

    initHistory();
    return () => {
      isMounted = false;
    };
  }, []);

  // Save history updates
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [history]);

  // Analyze active password
  const analysis = analyzePassword(password);

  const handleApplyPasswordFromAnywhere = (newPw: string) => {
    setPassword(newPw);
    setActiveTab('analyzer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#fdfaf6] dark:bg-[#1c1a17] text-[#2c2926] dark:text-[#f4f1ea] font-sans antialiased transition-colors flex flex-col">
      {/* Header Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        reusedCountAlert={analysis.isReused ? 1 : 0}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {activeTab === 'analyzer' && (
          <div className="space-y-6">
            {/* Password Input Card */}
            <PasswordInput
              password={password}
              setPassword={setPassword}
              analysis={analysis}
              onOpenGenerator={() => setActiveTab('generator')}
            />

            {/* Strength Meter & Score */}
            <StrengthMeter analysis={analysis} />

            {/* Upgraded Alternatives */}
            <UpgradedAlternatives
              analysis={analysis}
              onApplyPassword={handleApplyPasswordFromAnywhere}
            />

            {/* Brute-Force Crack Estimates & Complexity Checklist */}
            <MetricsCards analysis={analysis} />

            {/* Pattern & Vulnerability Diagnostics */}
            <PatternsGrid analysis={analysis} />
          </div>
        )}

        {activeTab === 'generator' && (
          <PasswordGeneratorTab onApplyToAnalyzer={handleApplyPasswordFromAnywhere} />
        )}

        {activeTab === 'history' && (
          <PasswordHistorySection
            currentPassword={password}
            history={history}
            setHistory={setHistory}
            onApplyPassword={handleApplyPasswordFromAnywhere}
          />
        )}

        {activeTab === 'guide' && <EducationalGuide />}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-[#22201d] border-t border-[#e5e1da] dark:border-[#383430] py-6 mt-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7a746e] dark:text-[#a09990]">
          <div className="flex items-center space-x-2">
            <KeyRound className="w-4 h-4 text-[#5A5A40] dark:text-[#c4be9e]" />
            <span className="font-semibold text-[#2c2926] dark:text-[#f4f1ea]">Password Strength Analyzer</span>
            <span>• Developed for Password Security &amp; Cryptography Learning</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono bg-[#f4f1ea] dark:bg-[#191715] text-[#5A5A40] dark:text-[#c4be9e] px-3 py-1 rounded-full border border-[#e5e1da] dark:border-[#33302a]">
              <Cpu className="w-3 h-3 text-[#5A5A40]" /> SHA-256 &amp; Local Entropy
            </span>
            <span>100% Client-Side Memory</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
