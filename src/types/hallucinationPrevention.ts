
/**
 * Types for hallucination prevention system
 */

import type { HallucinationCheck } from '../utils/hallucinationPrevention/detector/types';

/**
 * Options for hallucination prevention system
 */
export interface HallucinationPreventionOptions {
  enableRAG: boolean;
  enableReasoning: boolean; 
  enableDetection: boolean;
  reasoningThreshold: number;
  detectionSensitivity?: number;
  enableTokenLevelDetection?: boolean;
  enableNLIVerification?: boolean;
  enableReranking?: boolean;
  tokenThreshold?: number;
  entailmentThreshold?: number;
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

// Export HallucinationCheck for wider use
export type { HallucinationCheck };

/**
 * Memory Piece for RAG system
 */
export interface MemoryPiece {
  content: string;
  role: 'system' | 'user' | 'assistant';
  importance: number;
  metadata?: any;
}
