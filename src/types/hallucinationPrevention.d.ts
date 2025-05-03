
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
  | 'factual_error';     // General factual error

// Severity levels for flagged issues
export type HallucinationSeverity = 'low' | 'medium' | 'high';

// Flag structure with detailed information
export interface HallucinationFlag {
  type: HallucinationFlagType;
  severity: HallucinationSeverity;
  description: string;
}

// Full hallucination check result
export interface HallucinationCheck {
  content: string;
  confidenceScore: number; // 0-1 where 1 is high confidence it's NOT a hallucination
  hallucination: boolean;
  corrections?: string;
  flags: HallucinationFlag[];
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
}

// Configuration options for hallucination prevention
export interface HallucinationPreventionOptions {
  enableReasoning: boolean;
  enableRAG: boolean;
  enableDetection: boolean;
  additionalContext?: string[];
  reasoningThreshold: number;
  detectionSensitivity: number;
}
