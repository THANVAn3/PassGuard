import React, { useState, useEffect } from 'react';
import { PasswordHistoryItem, PasswordAnalysis } from '../types';
import { hashPassword, maskPassword } from '../utils/cryptoUtils';
import { analyzePassword } from '../utils/passwordAnalyzer';
import { History, ShieldAlert, Plus, Trash2, CheckCircle2, Lock, Key, AlertCircle, Database } from 'lucide-react';

interface PasswordHistorySectionProps {
  currentPassword: string;
  history: PasswordHistoryItem[];
  setHistory: React.Dispatch<React.SetStateAction<PasswordHistoryItem[]>>;
  onApplyPassword: (pw: string) => void;
}

export const PasswordHistorySection: React.FC<PasswordHistorySectionProps> = ({
  currentPassword,
  history,
  setHistory,
  onApplyPassword,
}) => {
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [labelInput, setLabelInput] = useState('');
  const [currentHash, setCurrentHash] = useState('');
  const [isMatch, setIsMatch] = useState(false);
  const [matchedItem, setMatchedItem] = useState<PasswordHistoryItem | null>(null);

  // Compute current password hash & check if reused
  useEffect(() => {
    let isMounted = true;
    async function checkHash() {
      if (!currentPassword) {
        if (isMounted) {
          setCurrentHash('');
          setIsMatch(false);
          setMatchedItem(null);
        }
        return;
      }
      const h = await hashPassword(currentPassword);
      if (isMounted) {
        setCurrentHash(h);
        const found = history.find((item) => item.hash === h);
        if (found) {
          setIsMatch(true);
          setMatchedItem(found);
        } else {
          setIsMatch(false);
          setMatchedItem(null);
        }
      }
    }
    checkHash();
    return () => {
      isMounted = false;
    };
  }, [currentPassword, history]);

  const handleAddCustom = async () => {
    if (!newPasswordInput) return;
    const h = await hashPassword(newPasswordInput);
    if (history.some((i) => i.hash === h)) {
      alert('This password hash is already in your history database!');
      return;
    }
    const analysis = analyzePassword(newPasswordInput);
    const newItem: PasswordHistoryItem = {
      id: Date.now().toString(),
      label: labelInput || 'Saved Account Password',
      hash: h,
      maskedPreview: maskPassword(newPasswordInput),
      strengthScore: analysis.score,
      createdAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    };
    setHistory([newItem, ...history]);
    setNewPasswordInput('');
    setLabelInput('');
  };

  const handleAddCurrent = async () => {
    if (!currentPassword) return;
    const h = await hashPassword(currentPassword);
    if (history.some((i) => i.hash === h)) {
      alert('This current password is already stored in your history database!');
      return;
    }
    const analysis = analyzePassword(currentPassword);
    const newItem: PasswordHistoryItem = {
      id: Date.now().toString(),
      label: 'Tested Password Entry',
      hash: h,
      maskedPreview: maskPassword(currentPassword),
      strengthScore: analysis.score,
      createdAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    };
    setHistory([newItem, ...history]);
  };

  const handleDelete = (id: string) => {
    setHistory(history.filter((i) => i.id !== id));
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all stored password hashes?')) {
      setHistory([]);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Active Tested Password Reuse Status */}
      <div className="bg-white dark:bg-[#22201d] rounded-[28px] border border-[#e5e1da] dark:border-[#383430] p-6 sm:p-7 shadow-xs">
        <div className="flex items-center space-x-3 mb-5 pb-4 border-b border-[#f0ede8] dark:border-[#33302a]">
          <div className="p-2.5 rounded-xl bg-[#f4f1ea] dark:bg-[#2c2924] text-[#5A5A40] dark:text-[#c4be9e]">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-serif-natural font-semibold text-[#2c2926] dark:text-[#f4f1ea]">
              Password Reuse Prevention &amp; History
            </h2>
            <p className="text-xs text-[#7a746e] dark:text-[#a09990]">
              Stores one-way SHA-256 cryptographic hashes locally to prevent password reuse across platforms.
            </p>
          </div>
        </div>

        {/* Live Reuse Alert */}
        {currentPassword ? (
          isMatch ? (
            <div className="p-4 sm:p-5 rounded-2xl bg-[#f4f1ea] dark:bg-[#191715] border border-[#5A5A40] text-[#2c2926] dark:text-[#f4f1ea] flex items-start space-x-3 text-xs mb-5">
              <ShieldAlert className="w-5 h-5 text-[#5A5A40] dark:text-[#c4be9e] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-sm block mb-1">Password Reuse Violation Detected!</span>
                The currently tested password matches stored entry <strong className="font-mono text-[#5A5A40] dark:text-[#c4be9e]">"{matchedItem?.label}"</strong> (SHA-256: <code className="text-[10px]">{matchedItem?.hash.slice(0, 12)}...</code>). Reusing passwords makes all your accounts vulnerable if a single service is breached!
              </div>
            </div>
          ) : (
            <div className="p-4 sm:p-5 rounded-2xl bg-[#f4f1ea] dark:bg-[#191715] border border-[#e5e1da] dark:border-[#33302a] text-[#2c2926] dark:text-[#f4f1ea] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs mb-5">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-5 h-5 text-[#5A5A40] dark:text-[#c4be9e] shrink-0" />
                <div>
                  <span className="font-bold text-sm block">No Password Reuse Found</span>
                  <span className="text-[#7a746e] dark:text-[#a09990]">Tested password SHA-256 hash does not match any entry in your saved history database.</span>
                </div>
              </div>
              <button
                onClick={handleAddCurrent}
                className="px-4 py-2 rounded-full bg-[#5A5A40] hover:bg-[#484833] text-white font-bold text-xs uppercase tracking-wider shrink-0 shadow-xs transition-colors"
              >
                + Save Hash to Database
              </button>
            </div>
          )
        ) : (
          <div className="p-4 rounded-2xl bg-[#f4f1ea] dark:bg-[#191715] border border-[#e5e1da] dark:border-[#33302a] text-xs text-[#7a746e] dark:text-[#a09990] mb-5">
            Enter a password in the Evaluator tab to automatically compare its SHA-256 hash against this database.
          </div>
        )}

        {/* Add Custom Entry Form */}
        <div className="p-5 rounded-2xl bg-[#f4f1ea] dark:bg-[#191715] border border-[#e5e1da] dark:border-[#33302a] space-y-3">
          <h3 className="text-xs font-bold text-[#2c2926] dark:text-[#f4f1ea] flex items-center gap-1.5 uppercase tracking-wider">
            <Plus className="w-4 h-4 text-[#5A5A40]" /> Add Previous Password to Database
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
            <input
              type="text"
              placeholder="Account Label (e.g., Work Email 2023)"
              value={labelInput}
              onChange={(e) => setLabelInput(e.target.value)}
              className="sm:col-span-2 px-3.5 py-2.5 bg-white dark:bg-[#22201d] border border-[#e5e1da] dark:border-[#383430] rounded-xl text-xs text-[#2c2926] dark:text-[#f4f1ea] focus:outline-none focus:border-[#5A5A40]"
            />
            <input
              type="password"
              placeholder="Old Password"
              value={newPasswordInput}
              onChange={(e) => setNewPasswordInput(e.target.value)}
              className="sm:col-span-2 px-3.5 py-2.5 bg-white dark:bg-[#22201d] border border-[#e5e1da] dark:border-[#383430] rounded-xl text-xs text-[#2c2926] dark:text-[#f4f1ea] font-mono focus:outline-none focus:border-[#5A5A40]"
            />
            <button
              onClick={handleAddCustom}
              disabled={!newPasswordInput}
              className="px-4 py-2.5 bg-[#5A5A40] hover:bg-[#484833] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-full transition-colors shadow-xs"
            >
              Add Hash
            </button>
          </div>
          <p className="text-[11px] text-[#a09990]">
            Note: Only standard SHA-256 digests are retained in your browser memory for privacy.
          </p>
        </div>
      </div>

      {/* History Database List */}
      <div className="bg-white dark:bg-[#22201d] rounded-[28px] border border-[#e5e1da] dark:border-[#383430] p-6 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#f0ede8] dark:border-[#33302a]">
          <h3 className="text-base font-serif-natural font-semibold text-[#2c2926] dark:text-[#f4f1ea] flex items-center gap-2">
            <History className="w-4 h-4 text-[#5A5A40]" />
            Stored Password Digest Database ({history.length})
          </h3>

          {history.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs font-bold uppercase tracking-wider text-[#7a746e] hover:text-[#2c2926] dark:hover:text-[#f4f1ea] transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear History
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="text-center py-8 text-xs text-[#a09990]">
            No password digests in database yet. Add past passwords above to enforce reuse checks.
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-[#f4f1ea] dark:bg-[#191715] border border-[#e5e1da] dark:border-[#33302a] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-[#2c2926] dark:text-[#f4f1ea]">{item.label}</span>
                    <span className="font-mono text-[#7a746e] dark:text-[#a09990]">({item.maskedPreview})</span>
                  </div>
                  <div className="mt-1 flex items-center space-x-2 text-[11px] text-[#a09990] font-mono">
                    <span>SHA-256: {item.hash.slice(0, 20)}...</span>
                    <span>• Added {item.createdAt}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-end sm:self-auto">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 text-[#a09990] hover:text-[#2c2926] dark:hover:text-[#f4f1ea] transition-colors"
                    title="Remove from history"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
