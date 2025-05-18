
/**
 * Types for hallucination prevention system
 */

import { HallucinationCheck } from '../utils/hallucinationPrevention/detector/types';

/**
 * Options for hallucination prevention system
 */
export interface HallucinationPreventionOptions {
  enableRAG: boolean;
  enableReasoning: boolean; 
  enableDetection: boolean;
  reasoningThreshold: number;
  emotionAwareness?: {
    emotions?: any;
    recentEmotions?: any;
    hasConsistentDepression?: boolean;
  };
}

/**
 * Result of hallucination prevention processing
 */
export interface HallucinationProcessResult {
  processedResponse: string;
  wasRevised: boolean;
  reasoningApplied: boolean;
  detectionApplied: boolean;
  ragApplied: boolean;
  processingTime: number;
  confidence: number;
}
