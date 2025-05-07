
/**
 * Types for pattern detection functionality
 */

export interface RepetitivePattern {
  regex: RegExp;
  pattern: string;
  weight: number;
}

export interface PatternDetectionResult {
  isRepetitive: boolean;
  repetitionScore: number;
  enhancedResponse?: string;
  detectedPatterns?: string[];
}

export interface FormulaicBeginningResult {
  hasFormulaicBeginning: boolean;
  count: number;
  enhancedResponse?: string;
}
