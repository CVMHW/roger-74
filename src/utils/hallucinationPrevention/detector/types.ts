
/**
 * Types for the hallucination detection system
 */

/**
 * Severity levels for hallucination flags
 */
export type HallucinationSeverity = 'low' | 'medium' | 'high' | 'critical';

/**
 * Types of hallucination flags
 */
export type HallucinationFlagType = 
  | 'false_memory' 
  | 'false_continuity' 
  | 'logical_error' 
  | 'token_issue' 
  | 'repetition' 
  | 'emotion_misidentification'
  | 'critical_emotion_misidentification'
  | 'critical_protocol_violation'
  | 'crisis_type_mismatch'
  | 'substance_use_mishandled';

/**
 * A flag indicating a potential hallucination
 */
export interface HallucinationFlag {
  type: string;
  severity: HallucinationSeverity;
  description: string;
  confidence: number;
}

/**
 * Result of token level analysis
 */
export interface TokenAnalysisResult {
  problematicTokens?: string[];
  confidenceByToken?: Record<string, number>;
}

/**
 * Result of hallucination detection
 */
export interface HallucinationCheck {
  isHallucination: boolean;
  confidence: number;
  wasHallucination?: boolean; // For backward compatibility
  flags: HallucinationFlag[];
  tokenLevelAnalysis?: TokenAnalysisResult;
  emotionMisidentified?: boolean;
  depressionMisidentified?: boolean;
}

/**
 * Configuration for hallucination detection
 */
export interface HallucinationDetectorConfig {
  sensitivityLevel: 'low' | 'medium' | 'high';
  enableTokenLevelDetection: boolean;
  enableNLIVerification: boolean;
  tokenThreshold: number;
}
