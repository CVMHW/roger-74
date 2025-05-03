
/**
 * Types for hallucination prevention system
 */

export interface HallucinationCheck {
  isHallucination: boolean;
  confidence: number;
  reason?: string;
}

export interface HallucinationPreventionOptions {
  enableReasoning: boolean;
  enableRAG: boolean;
  enableDetection: boolean;
  reasoningThreshold: number;
  detectionSensitivity: number;
  enableTokenLevelDetection: boolean;
  tokenThreshold: number;
  enableReranking?: boolean;
  enableNLIVerification?: boolean;
}

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
