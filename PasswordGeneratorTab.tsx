import React, { useState, useEffect } from 'react';
import { GeneratorOptions, PasswordAnalysis } from '../types';
import { generateRandomPassword, analyzePassword } from '../utils/passwordAnalyzer';
import { RefreshCw, Copy, Check, ArrowRight, Sliders, ShieldCheck, Sparkles, Layers } from 'lucide-react';

interface PasswordGeneratorTabProps {
  onApplyToAnalyzer: (password: string) => void;
}

export const PasswordGeneratorTab: React.FC<PasswordGeneratorTabProps> = ({
  onApplyToAnalyzer,
}) => {
  const [options, setOptions] = useState<GeneratorOptions>({
    length: 16,
    useUppercase: true,
    useLowercase: true,
    useNumbers: true,
    useSymbols: true,
    avoidAmbiguous: true,
    isPassphrase: false,
    wordCount: 4,
    separator: '-',
  });

  const [generatedPassword, setGeneratedPassword] = useState('');
  const [batchList, setBatchList] = useState<string[]>([]);
  const [copiedMain, setCopiedMain] = useState(false);
  const [copiedBatchIndex, setCopiedBatchIndex] = useState<number | null>(null);

  const handleGenerate = () => {
    const main = generateRandomPassword(options);
    setGeneratedPassword(main);

    // Batch of 4 alternative generated passwords with same settings
    const list: string[] = [];
    for (let i = 0; i < 4; i++) {
      list.push(generateRandomPassword(options));
    }
    setBatchList(list);
  };

  useEffect(() => {
    handleGenerate();
  }, [
    options.length,
    options.useUppercase,
    options.useLowercase,
    options.useNumbers,
    options.useSymbols,
    options.avoidAmbiguous,
    options.isPassphrase,
    options.wordCount,
    options.separator,
  ]);

  const analysis: PasswordAnalysis = analyzePassword(generatedPassword);

  const handleCopyMain = () => {
    navigator.clipboard.writeText(generatedPassword);
    setCopiedMain(true);
    setTimeout(() => setCopiedMain(false), 2000);
  };

  const handleCopyBatch = (pw: string, idx: number) => {
    navigator.clipboard.writeText(pw);
    setCopiedBatchIndex(idx);
    setTimeout(() => setCopiedBatchIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-[#22201d] rounded-[28px] border border-[#e5e1da] dark:border-[#383430] p-6 sm:p-7 shadow-xs font-sans">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#f0ede8] dark:border-[#33302a]">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#5A5A40] dark:text-[#c4be9e] flex items-center gap-1.5 mb-1">
              <Sparkles className="w-4 h-4 text-[#5A5A40]" /> Cryptographically Secure Generator
            </span>
            <h2 className="text-2xl font-serif-natural font-semibold text-[#2c2926] dark:text-[#f4f1ea]">
              Generate High-Entropy Passwords
            </h2>
            <p className="text-xs text-[#7a746e] dark:text-[#a09990] mt-1">
              Uses standard browser <code className="text-[#5A5A40] dark:text-[#c4be9e] font-mono">crypto.getRandomValues()</code> for non-predictable randomness.
            </p>
          </div>

          {/* Type Toggle: Password vs Passphrase */}
          <div className="flex items-center p-1 bg-[#f4f1ea] dark:bg-[#191715] rounded-full border border-[#e5e1da] dark:border-[#33302a] self-start md:self-auto">
            <button
              onClick={() => setOptions({ ...options, isPassphrase: false })}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                !options.isPassphrase
                  ? 'bg-[#5A5A40] text-white shadow-xs'
                  : 'text-[#7a746e] dark:text-[#a09990] hover:text-[#2c2926] dark:hover:text-[#f4f1ea]'
              }`}
            >
              Random String
            </button>
            <button
              onClick={() => setOptions({ ...options, isPassphrase: true })}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                options.isPassphrase
                  ? 'bg-[#5A5A40] text-white shadow-xs'
                  : 'text-[#7a746e] dark:text-[#a09990] hover:text-[#2c2926] dark:hover:text-[#f4f1ea]'
              }`}
            >
              Multi-Word Passphrase
            </button>
          </div>
        </div>

        {/* Main Generated Output Display */}
        <div className="bg-[#f4f1ea] dark:bg-[#191715] p-6 rounded-2xl border border-[#e5e1da] dark:border-[#33302a] mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="font-mono text-xl sm:text-2xl font-bold text-[#2c2926] dark:text-[#f4f1ea] break-all tracking-wider">
              {generatedPassword}
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={handleGenerate}
                className="p-3 rounded-full bg-white dark:bg-[#22201d] border border-[#e5e1da] dark:border-[#383430] text-[#5A5A40] hover:bg-[#e5e1da]/50 transition-colors shadow-xs"
                title="Regenerate"
              >
                <RefreshCw className="w-5 h-5 text-[#5A5A40]" />
              </button>

              <button
                onClick={handleCopyMain}
                className={`flex items-center space-x-1.5 px-4 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-xs ${
                  copiedMain
                    ? 'bg-[#5A5A40] text-white'
                    : 'bg-[#2c2926] text-white dark:bg-[#f4f1ea] dark:text-[#2c2926] hover:opacity-90'
                }`}
              >
                {copiedMain ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedMain ? 'Copied!' : 'Copy'}</span>
              </button>

              <button
                onClick={() => onApplyToAnalyzer(generatedPassword)}
                className="flex items-center space-x-1.5 px-4 py-3 rounded-full bg-[#5A5A40] hover:bg-[#484833] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs"
              >
                <span>Test in Evaluator</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Generated Password Strength Badge */}
          <div className="mt-4 pt-3 border-t border-[#e5e1da] dark:border-[#33302a] flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-0.5 rounded-full font-bold uppercase text-[10px] bg-[#e5e1da] text-[#5A5A40] dark:bg-[#2e2a26] dark:text-[#c4be9e]">
                {analysis.scoreLabel}
              </span>
              <span className="text-[#7a746e] dark:text-[#a09990] font-mono">
                {analysis.entropyBits} bits entropy ({analysis.length} chars)
              </span>
            </div>
            <span className="text-[#7a746e] dark:text-[#a09990] text-[11px]">
              Fast Hash Crack Time: <strong className="text-[#2c2926] dark:text-[#f4f1ea] font-mono">{analysis.estimates.offlineFastHash}</strong>
            </span>
          </div>
        </div>

        {/* Generator Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Slider Controls */}
          <div>
            {!options.isPassphrase ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#2c2926] dark:text-[#f4f1ea]">
                    Password Length:
                  </label>
                  <span className="font-mono text-sm font-bold text-[#5A5A40] dark:text-[#c4be9e] bg-[#f4f1ea] dark:bg-[#191715] px-3 py-0.5 rounded-full border border-[#e5e1da] dark:border-[#33302a]">
                    {options.length} characters
                  </span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="64"
                  value={options.length}
                  onChange={(e) => setOptions({ ...options, length: parseInt(e.target.value) })}
                  className="w-full accent-[#5A5A40] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-[#a09990]">
                  <span>8 chars</span>
                  <span>16 chars (Rec)</span>
                  <span>32 chars</span>
                  <span>64 chars</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#2c2926] dark:text-[#f4f1ea]">
                    Word Count:
                  </label>
                  <span className="font-mono text-sm font-bold text-[#5A5A40] dark:text-[#c4be9e] bg-[#f4f1ea] dark:bg-[#191715] px-3 py-0.5 rounded-full border border-[#e5e1da] dark:border-[#33302a]">
                    {options.wordCount} words
                  </span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="8"
                  value={options.wordCount}
                  onChange={(e) => setOptions({ ...options, wordCount: parseInt(e.target.value) })}
                  className="w-full accent-[#5A5A40] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-[#a09990]">
                  <span>3 words</span>
                  <span>4 words (Diceware)</span>
                  <span>6 words</span>
                  <span>8 words</span>
                </div>
              </div>
            )}
          </div>

          {/* Toggle Checkboxes */}
          <div className="grid grid-cols-2 gap-3">
            {!options.isPassphrase ? (
              <>
                <label className="flex items-center space-x-2.5 p-3 rounded-2xl bg-[#f4f1ea] dark:bg-[#191715] border border-[#e5e1da] dark:border-[#33302a] cursor-pointer hover:border-[#5A5A40]/40 transition-all">
                  <input
                    type="checkbox"
                    checked={options.useUppercase}
                    onChange={(e) => setOptions({ ...options, useUppercase: e.target.checked })}
                    className="rounded text-[#5A5A40] focus:ring-[#5A5A40] w-4 h-4 accent-[#5A5A40]"
                  />
                  <span className="text-xs font-semibold text-[#2c2926] dark:text-[#f4f1ea]">Uppercase (A-Z)</span>
                </label>

                <label className="flex items-center space-x-2.5 p-3 rounded-2xl bg-[#f4f1ea] dark:bg-[#191715] border border-[#e5e1da] dark:border-[#33302a] cursor-pointer hover:border-[#5A5A40]/40 transition-all">
                  <input
                    type="checkbox"
                    checked={options.useLowercase}
                    onChange={(e) => setOptions({ ...options, useLowercase: e.target.checked })}
                    className="rounded text-[#5A5A40] focus:ring-[#5A5A40] w-4 h-4 accent-[#5A5A40]"
                  />
                  <span className="text-xs font-semibold text-[#2c2926] dark:text-[#f4f1ea]">Lowercase (a-z)</span>
                </label>

                <label className="flex items-center space-x-2.5 p-3 rounded-2xl bg-[#f4f1ea] dark:bg-[#191715] border border-[#e5e1da] dark:border-[#33302a] cursor-pointer hover:border-[#5A5A40]/40 transition-all">
                  <input
                    type="checkbox"
                    checked={options.useNumbers}
                    onChange={(e) => setOptions({ ...options, useNumbers: e.target.checked })}
                    className="rounded text-[#5A5A40] focus:ring-[#5A5A40] w-4 h-4 accent-[#5A5A40]"
                  />
                  <span className="text-xs font-semibold text-[#2c2926] dark:text-[#f4f1ea]">Numbers (0-9)</span>
                </label>

                <label className="flex items-center space-x-2.5 p-3 rounded-2xl bg-[#f4f1ea] dark:bg-[#191715] border border-[#e5e1da] dark:border-[#33302a] cursor-pointer hover:border-[#5A5A40]/40 transition-all">
                  <input
                    type="checkbox"
                    checked={options.useSymbols}
                    onChange={(e) => setOptions({ ...options, useSymbols: e.target.checked })}
                    className="rounded text-[#5A5A40] focus:ring-[#5A5A40] w-4 h-4 accent-[#5A5A40]"
                  />
                  <span className="text-xs font-semibold text-[#2c2926] dark:text-[#f4f1ea]">Symbols (!@#$)</span>
                </label>

                <label className="col-span-2 flex items-center space-x-2.5 p-3 rounded-2xl bg-[#f4f1ea] dark:bg-[#191715] border border-[#e5e1da] dark:border-[#33302a] cursor-pointer hover:border-[#5A5A40]/40 transition-all">
                  <input
                    type="checkbox"
                    checked={options.avoidAmbiguous}
                    onChange={(e) => setOptions({ ...options, avoidAmbiguous: e.target.checked })}
                    className="rounded text-[#5A5A40] focus:ring-[#5A5A40] w-4 h-4 accent-[#5A5A40]"
                  />
                  <span className="text-xs font-semibold text-[#2c2926] dark:text-[#f4f1ea]">
                    Avoid Ambiguous Chars <code className="text-[#a09990] font-mono">(0, O, I, 1, l)</code>
                  </span>
                </label>
              </>
            ) : (
              <>
                <div className="col-span-2 space-y-2">
                  <label className="text-xs font-bold text-[#2c2926] dark:text-[#f4f1ea]">
                    Word Separator:
                  </label>
                  <div className="flex gap-2">
                    {['-', '_', '.', ' '].map((sep) => (
                      <button
                        key={sep}
                        onClick={() => setOptions({ ...options, separator: sep })}
                        className={`flex-1 py-2 rounded-full text-xs font-mono font-bold border transition-all ${
                          options.separator === sep
                            ? 'bg-[#5A5A40] text-white border-[#5A5A40]'
                            : 'bg-[#f4f1ea] dark:bg-[#191715] text-[#2c2926] dark:text-[#f4f1ea] border-[#e5e1da] dark:border-[#33302a]'
                        }`}
                      >
                        {sep === ' ' ? '[ Space ]' : sep}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="col-span-2 flex items-center space-x-2.5 p-3 rounded-2xl bg-[#f4f1ea] dark:bg-[#191715] border border-[#e5e1da] dark:border-[#33302a] cursor-pointer hover:border-[#5A5A40]/40 transition-all">
                  <input
                    type="checkbox"
                    checked={options.useUppercase}
                    onChange={(e) => setOptions({ ...options, useUppercase: e.target.checked })}
                    className="rounded text-[#5A5A40] focus:ring-[#5A5A40] w-4 h-4 accent-[#5A5A40]"
                  />
                  <span className="text-xs font-semibold text-[#2c2926] dark:text-[#f4f1ea]">Capitalize Word Starts</span>
                </label>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Batch Generation Options */}
      <div className="bg-white dark:bg-[#22201d] rounded-[28px] border border-[#e5e1da] dark:border-[#383430] p-6 sm:p-7 shadow-xs font-sans">
        <h3 className="text-lg font-serif-natural font-semibold text-[#2c2926] dark:text-[#f4f1ea] flex items-center gap-2 mb-2">
          <Layers className="w-4 h-4 text-[#5A5A40]" />
          Batch Variations ({batchList.length})
        </h3>
        <p className="text-xs text-[#7a746e] dark:text-[#a09990] mb-4">
          Choose from these alternative generated passwords using your active settings:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {batchList.map((pw, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#f4f1ea] dark:bg-[#191715] border border-[#e5e1da] dark:border-[#33302a] flex items-center justify-between gap-2"
            >
              <span className="font-mono text-xs sm:text-sm font-bold text-[#2c2926] dark:text-[#f4f1ea] truncate">
                {pw}
              </span>

              <div className="flex items-center space-x-1.5 shrink-0">
                <button
                  onClick={() => handleCopyBatch(pw, idx)}
                  className="p-2 rounded-full bg-white dark:bg-[#22201d] border border-[#e5e1da] dark:border-[#383430] text-[#7a746e] hover:text-[#2c2926] transition-colors"
                  title="Copy"
                >
                  {copiedBatchIndex === idx ? (
                    <Check className="w-3.5 h-3.5 text-[#5A5A40]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>

                <button
                  onClick={() => onApplyToAnalyzer(pw)}
                  className="px-3.5 py-1.5 rounded-full bg-[#5A5A40] hover:bg-[#484833] text-white text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Test
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
