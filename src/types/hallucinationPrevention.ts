
/**
 * Type definitions for hallucination prevention system
 */

// Hallucination flags by type
export type HallucinationFlagType = 
  | 'memory_reference'   // False reference to something patient said
  | 'topic_reference'    // Reference to topic not in conversation
  | 'timing_reference'   // Incorrect time reference
  | 'contradiction'      // Self-contradictory statement
  | 'logical_error'      // Logical inconsistency 
  | 'false_continuity'   // False implication of ongoing conversation
  | 'mathematical_error' // Error in calculations
  | 'factual_error'      // General factual error
  | 'token_level_error'  // Detected at token level
  | 'repetition'         // Detected repetition in response
  | 'nli_contradiction'; // Natural Language Inference detected contradiction

// Severity levels for flagged issues
export type HallucinationSeverity = 'low' | 'medium' | 'high';

// Flag structure with detailed information
export interface HallucinationFlag {
  type: HallucinationFlagType;
  severity: HallucinationSeverity;
  description: string;
  tokensAffected?: string[];  // Specific tokens flagged
  confidenceScore?: number;   // Detection confidence
}

// Full hallucination check result
export interface HallucinationCheck {
  isHallucination: boolean;
  confidence: number; // 0-1 where 1 is high confidence it's NOT a hallucination
  reason?: string;
  corrections?: string;
  flags?: HallucinationFlag[];
  tokenLevelAnalysis?: {  // Token-level analysis results
    tokens: string[];
    scores: number[];
  };
}

// Result from hallucination prevention system
export interface HallucinationProcessResult {
  processedResponse: string;
  wasRevised: boolean;
  reasoningApplied: boolean;
  detectionApplied: boolean;
  ragApplied: boolean;
  processingTime: number;
  confidence: number;
  issueDetails?: string[];
  // Fields for enhanced tracking and debugging
  tokenScores?: Record<string, number>; 
  entailmentScore?: number;
  rerankedOptions?: {
    text: string;
    score: number;
  }[];
}

// Configuration options for hallucination prevention
export interface HallucinationPreventionOptions {
  enableReasoning: boolean;
  enableRAG: boolean;
  enableDetection: boolean;
  additionalContext?: string[];
  reasoningThreshold: number;
  detectionSensitivity: number;
  // New options
  enableTokenLevelDetection: boolean;
  enableNLIVerification?: boolean;
  enableReranking?: boolean;
  generateMultipleResponses?: number; // Number of responses to generate for reranking
  tokenThreshold: number;            // Threshold for token-level detection
  entailmentThreshold?: number;       // Threshold for NLI entailment
}
