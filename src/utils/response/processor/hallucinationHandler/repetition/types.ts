
/**
 * Type definitions for repetition detection
 */

export interface DetectionPattern {
  regex: RegExp;
  description: string;
}

export interface RepetitionDetectionResult {
  hasRepetition: boolean;
  patterns: string[];
  severity: 'high' | 'medium' | 'low';
}
