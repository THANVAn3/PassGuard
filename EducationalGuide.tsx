import React, { useState } from 'react';
import { BookOpen, Key, Cpu, ShieldCheck, Lock, Calculator, HelpCircle, Lightbulb } from 'lucide-react';
import { formatTimeEstimate } from '../utils/passwordAnalyzer';

export const EducationalGuide: React.FC = () => {
  // Mini Entropy Calculator State
  const [calcLength, setCalcLength] = useState(14);
  const [useLower, setUseLower] = useState(true);
  const [useUpper, setUseUpper] = useState(true);
  const [useNum, setUseNum] = useState(true);
  const [useSym, setUseSym] = useState(true);

  let poolSize = 0;
  if (useLower) poolSize += 26;
  if (useUpper) poolSize += 26;
  if (useNum) poolSize += 10;
  if (useSym) poolSize += 33;
  if (poolSize === 0) poolSize = 1;

  const totalCombinations = Math.pow(poolSize, calcLength);
  const calcEntropy = Math.round(calcLength * Math.log2(poolSize));
  const crackTimeOfflineFast = formatTimeEstimate((totalCombinations / 2) / 100_000_000_000);

  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="bg-white dark:bg-[#22201d] rounded-[28px] border border-[#e5e1da] dark:border-[#383430] p-6 sm:p-7 shadow-xs">
        <div className="flex items-center space-x-3 mb-5 pb-4 border-b border-[#f0ede8] dark:border-[#33302a]">
          <div className="p-2.5 rounded-xl bg-[#f4f1ea] dark:bg-[#2c2924] text-[#5A5A40] dark:text-[#c4be9e]">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-serif-natural font-semibold text-[#2c2926] dark:text-[#f4f1ea]">
              Learn Password Cryptography &amp; Security Concepts
            </h2>
            <p className="text-xs text-[#7a746e] dark:text-[#a09990]">
              Understanding entropy, brute-force mechanics, hashing algorithms, and password safety.
            </p>
          </div>
        </div>

        {/* Concept Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-[#f4f1ea] dark:bg-[#191715] border border-[#e5e1da] dark:border-[#33302a] space-y-2">
            <h3 className="text-sm font-bold text-[#2c2926] dark:text-[#f4f1ea] flex items-center gap-2">
              <Key className="w-4 h-4 text-[#5A5A40]" /> What is Password Entropy?
            </h3>
            <p className="text-xs text-[#7a746e] dark:text-[#a09990] leading-relaxed">
              Password entropy measures the unpredictability of a password in <strong>bits</strong>. Each bit of entropy doubles the time required to brute-force a password. A password with 60 bits of entropy has 2⁶⁰ (~1.15 quintillion) possible combinations.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#f4f1ea] dark:bg-[#191715] border border-[#e5e1da] dark:border-[#33302a] space-y-2">
            <h3 className="text-sm font-bold text-[#2c2926] dark:text-[#f4f1ea] flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#5A5A40]" /> Length vs. Complexity
            </h3>
            <p className="text-xs text-[#7a746e] dark:text-[#a09990] leading-relaxed">
              Adding length increases security exponentially, while adding character types only increases security linearly. A 20-character passphrase made of simple words is mathematically thousands of times harder to crack than a complex 8-character password like <code className="text-[#5A5A40] dark:text-[#c4be9e] font-mono">P@ss123!</code>.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#f4f1ea] dark:bg-[#191715] border border-[#e5e1da] dark:border-[#33302a] space-y-2">
            <h3 className="text-sm font-bold text-[#2c2926] dark:text-[#f4f1ea] flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#5A5A40]" /> Hashing &amp; Salting
            </h3>
            <p className="text-xs text-[#7a746e] dark:text-[#a09990] leading-relaxed">
              Websites should never store passwords in plain text. Instead, passwords are run through cryptographic key derivation functions like <strong>Bcrypt</strong> or <strong>Argon2</strong> with a random salt. This ensures even if a database leaks, attackers cannot easily recover plain passwords.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#f4f1ea] dark:bg-[#191715] border border-[#e5e1da] dark:border-[#33302a] space-y-2">
            <h3 className="text-sm font-bold text-[#2c2926] dark:text-[#f4f1ea] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#5A5A40]" /> The Threat of Password Reuse
            </h3>
            <p className="text-xs text-[#7a746e] dark:text-[#a09990] leading-relaxed">
              When one website suffers a data breach, hackers take leaked email/password pairs and use automated bots to test them across thousands of popular services (Credential Stuffing). Never reuse passwords for important accounts!
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Entropy Playground */}
      <div className="bg-white dark:bg-[#22201d] rounded-[28px] border border-[#e5e1da] dark:border-[#383430] p-6 sm:p-7 shadow-xs">
        <h3 className="text-lg font-serif-natural font-semibold text-[#2c2926] dark:text-[#f4f1ea] flex items-center gap-2 mb-1">
          <Calculator className="w-4 h-4 text-[#5A5A40]" /> Interactive Entropy Playground
        </h3>
        <p className="text-xs text-[#7a746e] dark:text-[#a09990] mb-6">
          Adjust character set size (N) and length (L) to calculate exact combination space (N^L) and estimated cracking speed.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold text-[#2c2926] dark:text-[#f4f1ea] mb-1">
                <span>Password Length (L):</span>
                <span className="font-mono text-[#5A5A40] dark:text-[#c4be9e] bg-[#f4f1ea] dark:bg-[#191715] px-3 py-0.5 rounded-full border border-[#e5e1da] dark:border-[#33302a]">{calcLength} characters</span>
              </div>
              <input
                type="range"
                min="4"
                max="32"
                value={calcLength}
                onChange={(e) => setCalcLength(parseInt(e.target.value))}
                className="w-full accent-[#5A5A40] cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-[#2c2926] dark:text-[#f4f1ea] block">Character Pool Sets:</span>
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <label className="flex items-center space-x-2 p-3 rounded-2xl bg-[#f4f1ea] dark:bg-[#191715] border border-[#e5e1da] dark:border-[#33302a] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useLower}
                    onChange={(e) => setUseLower(e.target.checked)}
                    className="rounded text-[#5A5A40] accent-[#5A5A40]"
                  />
                  <span className="text-[#2c2926] dark:text-[#f4f1ea]">Lowercase (26)</span>
                </label>
                <label className="flex items-center space-x-2 p-3 rounded-2xl bg-[#f4f1ea] dark:bg-[#191715] border border-[#e5e1da] dark:border-[#33302a] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useUpper}
                    onChange={(e) => setUseUpper(e.target.checked)}
                    className="rounded text-[#5A5A40] accent-[#5A5A40]"
                  />
                  <span className="text-[#2c2926] dark:text-[#f4f1ea]">Uppercase (26)</span>
                </label>
                <label className="flex items-center space-x-2 p-3 rounded-2xl bg-[#f4f1ea] dark:bg-[#191715] border border-[#e5e1da] dark:border-[#33302a] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useNum}
                    onChange={(e) => setUseNum(e.target.checked)}
                    className="rounded text-[#5A5A40] accent-[#5A5A40]"
                  />
                  <span className="text-[#2c2926] dark:text-[#f4f1ea]">Digits (10)</span>
                </label>
                <label className="flex items-center space-x-2 p-3 rounded-2xl bg-[#f4f1ea] dark:bg-[#191715] border border-[#e5e1da] dark:border-[#33302a] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useSym}
                    onChange={(e) => setUseSym(e.target.checked)}
                    className="rounded text-[#5A5A40] accent-[#5A5A40]"
                  />
                  <span className="text-[#2c2926] dark:text-[#f4f1ea]">Symbols (33)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Result Output */}
          <div className="p-5 rounded-2xl bg-[#f4f1ea] dark:bg-[#191715] border border-[#e5e1da] dark:border-[#33302a] flex flex-col justify-between space-y-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#a09990] block mb-1">Calculated Combination Space</span>
              <div className="text-xl font-bold font-mono text-[#2c2926] dark:text-[#f4f1ea] break-all">
                {poolSize}^{calcLength} = <span className="text-[#5A5A40] dark:text-[#c4be9e]">{calcEntropy} bits</span>
              </div>
              <p className="text-[11px] text-[#7a746e] dark:text-[#a09990] mt-1">
                Character Pool Size (N) = {poolSize} characters. Total possible guesses: 2^{calcEntropy}.
              </p>
            </div>

            <div className="pt-3 border-t border-[#e5e1da] dark:border-[#33302a]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#a09990] block">GPU Rig Crack Time (100 Billion guesses/sec)</span>
              <span className="text-base font-bold text-[#2c2926] dark:text-[#f4f1ea] font-mono">{crackTimeOfflineFast}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
