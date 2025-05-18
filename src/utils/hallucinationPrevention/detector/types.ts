
/**
 * Types for hallucination detection
 */

// Define flag severity levels
export type HallucinationSeverity = 'critical' | 'high' | 'medium' | 'low';

// Define flag types
export type HallucinationFlagType = 
  'false_memory' | 
  'emotion_misidentification' | 
  'neutral_emotion_hallucination' |
  'factual_contradiction' | 
  'repetition' | 
  'incompatible_advice' |
  'false_continuity' |
  'critical_protocol_violation' |
  'critical_protocol_mix' |
  'crisis_type_mismatch' |
  'substance_use_mishandled' |
  'critical_suicide_repetition' |
  'missing_crisis_resources' |
  'critical_emotion_misidentification';

// Define hallucination flag
export interface HallucinationFlag {
  type: HallucinationFlagType;
  description: string;
  severity: HallucinationSeverity;
  confidence?: number;
  affectedText?: string;
}

// Define hallucination check result
export interface HallucinationCheck {
  isHallucination: boolean;
  confidence: number;
  reason?: string;
  flags?: HallucinationFlag[];
  corrections?: string;
  emotionMisidentified?: boolean;
  depressionMisidentified?: boolean;
  tokenLevelAnalysis?: any;
  wasHallucination?: boolean; // For backward compatibility
}

// Quick check result type
export interface QuickCheckResult {
  isPotentialHallucination: boolean;
  confidence: number;
  reason?: string;
}
