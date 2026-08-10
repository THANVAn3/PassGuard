export type StrengthLevel = 0 | 1 | 2 | 3 | 4;

export interface CharacterTypes {
  lowercase: boolean;
  uppercase: boolean;
  numbers: boolean;
  symbols: boolean;
  unicode: boolean;
}

export interface CrackEstimates {
  onlineThrottled: string;   // ~100 guesses/sec (Rate limited login)
  onlineUnthrottled: string; // ~10,000 guesses/sec
  offlineSlowHash: string;   // ~10,000 guesses/sec (Bcrypt / Argon2)
  offlineFastHash: string;   // ~100 Billion guesses/sec (MD5 / SHA-1 GPU cluster)
}

export interface DetectedPatterns {
  hasCommonWords: boolean;
  hasSequential: boolean;
  hasRepeats: boolean;
  hasKeyboardWalk: boolean;
  hasDates: boolean;
  isCommonPassword: boolean;
}

export interface PasswordAnalysis {
  password: string;
  score: StrengthLevel;
  scoreLabel: string;
  scoreColor: string;
  entropyBits: number;
  rawEntropyBits: number;
  length: number;
  characterTypes: CharacterTypes;
  charsetSize: number;
  estimates: CrackEstimates;
  warnings: string[];
  suggestions: string[];
  patterns: DetectedPatterns;
  upgradedAlternatives: string[];
  isReused: boolean;
  reusedCount: number;
}

export interface PasswordHistoryItem {
  id: string;
  label: string;
  hash: string;
  maskedPreview: string;
  strengthScore: StrengthLevel;
  createdAt: string;
}

export interface GeneratorOptions {
  length: number;
  useUppercase: boolean;
  useLowercase: boolean;
  useNumbers: boolean;
  useSymbols: boolean;
  avoidAmbiguous: boolean; // e.g. 0, O, I, l, 1
  isPassphrase: boolean;
  wordCount: number;
  separator: string;
}
