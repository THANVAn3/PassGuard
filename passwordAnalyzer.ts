import { StrengthLevel, PasswordAnalysis, DetectedPatterns, CrackEstimates } from '../types';
import { COMMON_PASSWORDS, KEYBOARD_PATTERNS, PASSPHRASE_WORDS } from './wordlist';

/**
 * Format time duration into human readable string
 */
export function formatTimeEstimate(seconds: number): string {
  if (seconds < 1) return 'Instantly';
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  const minutes = seconds / 60;
  if (minutes < 60) return `${Math.round(minutes)} minutes`;
  const hours = minutes / 60;
  if (hours < 24) return `${Math.round(hours)} hours`;
  const days = hours / 24;
  if (days < 30) return `${Math.round(days)} days`;
  const months = days / 30.4375;
  if (months < 12) return `${Math.round(months)} months`;
  const years = days / 365.25;
  if (years < 100) return `${Math.round(years)} years`;
  if (years < 1_000) return `${Math.round(years / 100) * 100} years`;
  if (years < 1_000_000) return `${(years / 1_000).toFixed(1)}k years`;
  if (years < 1_000_000_000) return `${(years / 1_000_000).toFixed(1)} million years`;
  if (years < 1_000_000_000_000) return `${(years / 1_000_000_000).toFixed(1)} billion years`;
  return 'Trillions of years';
}

export function analyzePassword(
  password: string,
  historyHashes: string[] = []
): PasswordAnalysis {
  if (!password) {
    return {
      password: '',
      score: 0,
      scoreLabel: 'Empty',
      scoreColor: 'bg-slate-400 dark:bg-slate-600',
      entropyBits: 0,
      rawEntropyBits: 0,
      length: 0,
      characterTypes: { lowercase: false, uppercase: false, numbers: false, symbols: false, unicode: false },
      charsetSize: 0,
      estimates: {
        onlineThrottled: 'Instantly',
        onlineUnthrottled: 'Instantly',
        offlineSlowHash: 'Instantly',
        offlineFastHash: 'Instantly',
      },
      warnings: ['Please enter a password to evaluate.'],
      suggestions: ['Use at least 12-16 characters combining letters, numbers, and symbols.'],
      patterns: {
        hasCommonWords: false,
        hasSequential: false,
        hasRepeats: false,
        hasKeyboardWalk: false,
        hasDates: false,
        isCommonPassword: false,
      },
      upgradedAlternatives: [],
      isReused: false,
      reusedCount: 0,
    };
  }

  const length = password.length;
  const lower = /[a-z]/.test(password);
  const upper = /[A-Z]/.test(password);
  const numbers = /[0-9]/.test(password);
  const symbols = /[^a-zA-Z0-9\s]/.test(password) || /[\u0021-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u007E]/.test(password);
  const unicode = /[^\x00-\x7F]/.test(password);

  let charsetSize = 0;
  if (lower) charsetSize += 26;
  if (upper) charsetSize += 26;
  if (numbers) charsetSize += 10;
  if (symbols) charsetSize += 33;
  if (unicode) charsetSize += 100;

  if (charsetSize === 0) charsetSize = 26; // fallback for spaces/unusuals

  // Raw Entropy = L * log2(charsetSize)
  const rawEntropyBits = Math.round(length * Math.log2(charsetSize));

  // Pattern detection & entropy penalties
  const lowerPw = password.toLowerCase();
  const isCommonPassword = COMMON_PASSWORDS.has(lowerPw);

  let hasKeyboardWalk = false;
  for (const pattern of KEYBOARD_PATTERNS) {
    if (lowerPw.includes(pattern) || lowerPw.includes(pattern.split('').reverse().join(''))) {
      hasKeyboardWalk = true;
      break;
    }
  }

  let hasRepeats = /(.)\1{2,}/.test(password); // 3+ identical chars in row
  let hasSequential = /(012|123|234|345|456|567|678|789|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(password);
  let hasDates = /(19\d\d|20\d\d|\b\d{2}[\/\.-]\d{2}[\/\.-]\d{2,4}\b)/.test(password);
  let hasCommonWords = /\b(password|admin|user|welcome|login|secret|master|dragon|monkey|sunshine|superman)\b/i.test(password);

  // Calculate entropy penalty
  let penaltyBits = 0;
  if (isCommonPassword) penaltyBits += 40;
  if (hasKeyboardWalk) penaltyBits += 15;
  if (hasRepeats) penaltyBits += 10;
  if (hasSequential) penaltyBits += 10;
  if (hasDates) penaltyBits += 10;
  if (hasCommonWords) penaltyBits += 15;
  if (length < 8) penaltyBits += 15;

  const entropyBits = Math.max(0, Math.round(rawEntropyBits - penaltyBits));

  // Determine Score (0 to 4)
  let score: StrengthLevel = 0;
  if (length >= 16 && entropyBits >= 75 && !isCommonPassword) {
    score = 4; // Very Strong
  } else if (length >= 12 && entropyBits >= 55 && !isCommonPassword) {
    score = 3; // Strong
  } else if (length >= 8 && entropyBits >= 38 && !isCommonPassword) {
    score = 2; // Fair
  } else if (length >= 6 && entropyBits >= 20) {
    score = 1; // Weak
  } else {
    score = 0; // Very Weak
  }

  // Label and Colors
  let scoreLabel = 'Very Weak';
  let scoreColor = 'bg-rose-500 text-white';

  if (score === 1) {
    scoreLabel = 'Weak';
    scoreColor = 'bg-amber-500 text-white';
  } else if (score === 2) {
    scoreLabel = 'Fair';
    scoreColor = 'bg-yellow-500 text-slate-900';
  } else if (score === 3) {
    scoreLabel = 'Strong';
    scoreColor = 'bg-emerald-500 text-white';
  } else if (score === 4) {
    scoreLabel = 'Very Strong';
    scoreColor = 'bg-teal-600 text-white';
  }

  // Time to crack calculations
  // Combination space = 2^entropyBits
  // Average guesses needed to find = 2^entropyBits / 2 = 2^(entropyBits - 1)
  const combinationsHalf = Math.pow(2, Math.max(1, entropyBits - 1));

  const estimates: CrackEstimates = {
    onlineThrottled: formatTimeEstimate(combinationsHalf / 100),
    onlineUnthrottled: formatTimeEstimate(combinationsHalf / 10_000),
    offlineSlowHash: formatTimeEstimate(combinationsHalf / 10_000), // e.g. Bcrypt
    offlineFastHash: formatTimeEstimate(combinationsHalf / 100_000_000_000), // GPU Rig (100 Billion/s)
  };

  // Warnings
  const warnings: string[] = [];
  if (isCommonPassword) warnings.push('This password is on the list of most frequently leaked passwords!');
  if (length < 8) warnings.push('Password is dangerously short (less than 8 characters).');
  else if (length < 12) warnings.push('Password length is under the recommended 12 characters.');
  if (hasKeyboardWalk) warnings.push('Contains predictable keyboard sequential patterns (e.g., qwerty).');
  if (hasRepeats) warnings.push('Contains repeating identical characters.');
  if (hasSequential) warnings.push('Contains sequential numbers or letters (e.g., 123, abc).');
  if (hasDates) warnings.push('Contains predictable date or year sequences.');
  if (!lower || !upper) warnings.push('Lacks mix of both uppercase and lowercase letters.');
  if (!numbers) warnings.push('Missing numeric digits (0-9).');
  if (!symbols) warnings.push('Missing special symbols (!@#$%^&*).');

  // Suggestions
  const suggestions: string[] = [];
  if (length < 12) suggestions.push('Increase password length to at least 12–16 characters.');
  if (!symbols) suggestions.push('Add special characters like !, @, #, $, or % to increase complexity.');
  if (!numbers) suggestions.push('Include numbers scattered throughout the password.');
  if (hasKeyboardWalk || hasCommonWords) suggestions.push('Replace dictionary words or keyboard rows with unpredictable word combinations.');
  if (suggestions.length === 0 && score < 4) {
    suggestions.push('Consider turning this into a multi-word passphrase for maximum memorable security.');
  } else if (score === 4) {
    suggestions.push('Excellent password strength! Store it securely in a trusted password manager.');
  }

  // Upgraded Alternatives
  const upgradedAlternatives = generateUpgradedAlternatives(password);

  return {
    password,
    score,
    scoreLabel,
    scoreColor,
    entropyBits,
    rawEntropyBits,
    length,
    characterTypes: { lowercase: lower, uppercase: upper, numbers, symbols, unicode },
    charsetSize,
    estimates,
    warnings,
    suggestions,
    patterns: {
      hasCommonWords,
      hasSequential,
      hasRepeats,
      hasKeyboardWalk,
      hasDates,
      isCommonPassword,
    },
    upgradedAlternatives,
    isReused: false,
    reusedCount: 0,
  };
}

/**
 * Generates 4 strong alternative versions based on the original password
 */
export function generateUpgradedAlternatives(password: string): string[] {
  if (!password) return [];

  const alternatives: string[] = [];
  const cleanPw = password.replace(/\s+/g, '');

  // 1. Symbol & Number Injection
  const syms = ['!', '@', '#', '$', '%', '&', '*', '?'];
  const rSym1 = syms[Math.floor(Math.random() * syms.length)];
  const rSym2 = syms[Math.floor(Math.random() * syms.length)];
  const rNum = Math.floor(100 + Math.random() * 900);
  alternatives.push(`${cleanPw}${rSym1}${rNum}${rSym2}`);

  // 2. Passphrase Style based on words or modified base
  const word1 = PASSPHRASE_WORDS[Math.floor(Math.random() * PASSPHRASE_WORDS.length)];
  const word2 = PASSPHRASE_WORDS[Math.floor(Math.random() * PASSPHRASE_WORDS.length)];
  const word3 = PASSPHRASE_WORDS[Math.floor(Math.random() * PASSPHRASE_WORDS.length)];
  alternatives.push(`${capitalize(word1)}-${capitalize(word2)}-${cleanPw.slice(0, 4)}-${rNum}!`);

  // 3. Pure memorable 4-word passphrase
  const word4 = PASSPHRASE_WORDS[Math.floor(Math.random() * PASSPHRASE_WORDS.length)];
  alternatives.push(`${word1}-${word2}-${word3}-${word4}`);

  // 4. Ultra secure 18-char randomized string
  alternatives.push(generateRandomPassword({
    length: 16,
    useUppercase: true,
    useLowercase: true,
    useNumbers: true,
    useSymbols: true,
    avoidAmbiguous: true,
    isPassphrase: false,
    wordCount: 4,
    separator: '-',
  }));

  return alternatives;
}

function capitalize(s: string): string {
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Random password or passphrase generator
 */
export function generateRandomPassword(options: {
  length: number;
  useUppercase: boolean;
  useLowercase: boolean;
  useNumbers: boolean;
  useSymbols: boolean;
  avoidAmbiguous: boolean;
  isPassphrase: boolean;
  wordCount: number;
  separator: string;
}): string {
  if (options.isPassphrase) {
    const words: string[] = [];
    for (let i = 0; i < options.wordCount; i++) {
      const idx = Math.floor(Math.random() * PASSPHRASE_WORDS.length);
      let word = PASSPHRASE_WORDS[idx];
      if (options.useUppercase && i % 2 === 0) {
        word = capitalize(word);
      }
      words.push(word);
    }
    let res = words.join(options.separator || '-');
    if (options.useNumbers) {
      res += `${options.separator || '-'}${Math.floor(10 + Math.random() * 90)}`;
    }
    if (options.useSymbols) {
      res += '!';
    }
    return res;
  }

  let charset = '';
  if (options.useLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
  if (options.useUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (options.useNumbers) charset += '0123456789';
  if (options.useSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

  if (options.avoidAmbiguous) {
    charset = charset.replace(/[0O1lI]/g, '');
  }

  if (!charset) charset = 'abcdefghijklmnopqrstuvwxyz0123456789';

  let result = '';
  const cryptoObj = window.crypto || (window as any).msCrypto;
  const randomValues = new Uint32Array(options.length);
  cryptoObj.getRandomValues(randomValues);

  for (let i = 0; i < options.length; i++) {
    result += charset[randomValues[i] % charset.length];
  }

  return result;
}
