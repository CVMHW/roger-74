
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
  'crisis_type_mismatch';

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
}
