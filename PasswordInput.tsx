import React, { useState } from 'react';
import { Eye, EyeOff, Copy, Check, X, Lock, Sparkles, ShieldAlert, Cpu } from 'lucide-react';
import { PasswordAnalysis } from '../types';

interface PasswordInputProps {
  password: string;
  setPassword: (val: string) => void;
  analysis: PasswordAnalysis;
  onOpenGenerator: () => void;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  password,
  setPassword,
  analysis,
  onOpenGenerator,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePreset = (samplePw: string) => {
    setPassword(samplePw);
  };

  return (
    <div className="bg-white dark:bg-[#22201d] rounded-[28px] border border-[#e5e1da] dark:border-[#383430] p-6 sm:p-7 shadow-xs transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif-natural font-semibold text-[#2c2926] dark:text-[#f4f1ea] flex items-center gap-2.5">
            <Lock className="w-5 h-5 text-[#5A5A40] dark:text-[#c4be9e]" />
            Password Evaluator
          </h2>
          <p className="text-xs text-[#7a746e] dark:text-[#a09990] mt-0.5">
            Type or paste a password below for real-time cryptographic feedback.
          </p>
        </div>

        {/* 100% Privacy Pill */}
        <div className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-[#f4f1ea] dark:bg-[#2c2924] text-[#5A5A40] dark:text-[#c4be9e] border border-[#e5e1da] dark:border-[#3d3933] text-xs font-sans font-medium self-start sm:self-auto">
          <Cpu className="w-3.5 h-3.5" />
          <span>100% Local Browser Evaluation</span>
        </div>
      </div>

      {/* Main Password Input Field */}
      <div className="relative group">
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Type or paste a password to test..."
          className="w-full pr-32 pl-5 py-4 sm:py-4.5 bg-[#f8f6f2] dark:bg-[#191715] border border-[#e5e1da] dark:border-[#383430] rounded-2xl text-[#2c2926] dark:text-[#f4f1ea] placeholder-[#a8a29a] dark:placeholder-[#6e6860] font-mono text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/40 focus:border-[#5A5A40] transition-all"
          autoFocus
        />

        {/* Action Controls inside Input */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1 bg-[#f8f6f2]/90 dark:bg-[#191715]/90 pl-2 rounded-xl">
          {password && (
            <button
              onClick={() => setPassword('')}
              className="p-2 text-[#7a746e] hover:text-[#2c2926] dark:hover:text-[#f4f1ea] rounded-lg hover:bg-[#e5e1da]/60 dark:hover:bg-[#2e2a26] transition-colors"
              title="Clear password"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => setShowPassword(!showPassword)}
            className="p-2 text-[#7a746e] hover:text-[#2c2926] dark:hover:text-[#f4f1ea] rounded-lg hover:bg-[#e5e1da]/60 dark:hover:bg-[#2e2a26] transition-colors"
            title={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>

          <button
            onClick={handleCopy}
            disabled={!password}
            className={`p-2 rounded-lg transition-colors ${
              copied
                ? 'bg-[#5A5A40] text-white'
                : 'text-[#7a746e] hover:text-[#2c2926] dark:hover:text-[#f4f1ea] hover:bg-[#e5e1da]/60 dark:hover:bg-[#2e2a26]'
            }`}
            title="Copy password"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Quick Test Presets & Generator Action */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#f0ede8] dark:border-[#33302a]">
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#7a746e] dark:text-[#a09990]">
          <span className="font-semibold uppercase tracking-wider text-[11px] mr-1">Quick Test:</span>
          <button
            onClick={() => handlePreset('123456')}
            className="px-2.5 py-1 rounded-full bg-[#f4f1ea] dark:bg-[#292622] text-[#7a746e] dark:text-[#a09990] hover:bg-[#e5e1da] dark:hover:bg-[#383430] hover:text-[#2c2926] dark:hover:text-[#f4f1ea] transition-colors font-mono"
          >
            123456
          </button>
          <button
            onClick={() => handlePreset('password123')}
            className="px-2.5 py-1 rounded-full bg-[#f4f1ea] dark:bg-[#292622] text-[#7a746e] dark:text-[#a09990] hover:bg-[#e5e1da] dark:hover:bg-[#383430] hover:text-[#2c2926] dark:hover:text-[#f4f1ea] transition-colors font-mono"
          >
            password123
          </button>
          <button
            onClick={() => handlePreset('Summer2024!')}
            className="px-2.5 py-1 rounded-full bg-[#f4f1ea] dark:bg-[#292622] text-[#7a746e] dark:text-[#a09990] hover:bg-[#e5e1da] dark:hover:bg-[#383430] hover:text-[#2c2926] dark:hover:text-[#f4f1ea] transition-colors font-mono"
          >
            Summer2024!
          </button>
          <button
            onClick={() => handlePreset('k9$mQ#2xP!8vL1')}
            className="px-2.5 py-1 rounded-full bg-[#f4f1ea] dark:bg-[#292622] text-[#7a746e] dark:text-[#a09990] hover:bg-[#e5e1da] dark:hover:bg-[#383430] hover:text-[#2c2926] dark:hover:text-[#f4f1ea] transition-colors font-mono"
          >
            k9$mQ#2xP!8vL1
          </button>
          <button
            onClick={() => handlePreset('correct-horse-battery-staple')}
            className="px-2.5 py-1 rounded-full bg-[#f4f1ea] dark:bg-[#292622] text-[#5A5A40] dark:text-[#c4be9e] hover:bg-[#e5e1da] dark:hover:bg-[#383430] font-semibold transition-colors font-mono"
          >
            Passphrase
          </button>
        </div>

        <button
          onClick={onOpenGenerator}
          className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-[#5A5A40] dark:text-[#c4be9e] hover:underline transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#5A5A40]" />
          <span>Need a Stronger Password?</span>
        </button>
      </div>
    </div>
  );
};
