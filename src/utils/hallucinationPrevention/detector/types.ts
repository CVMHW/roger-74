
/**
 * Hallucination Detection - Type Definitions
 */

import { 
  HallucinationCheck,
  HallucinationFlag,
  HallucinationFlagType,
  HallucinationSeverity
} from '../../../types/hallucinationPrevention';

/**
 * Result of a quick hallucination check
 */
export interface QuickCheckResult {
  potentialIssue: boolean;
  reason?: string;
  hasRepeatedSentences?: boolean;
}

// Need to use "export type" when re-exporting types with isolatedModules enabled
export type { 
  HallucinationCheck,
  HallucinationFlag,
  HallucinationFlagType,
  HallucinationSeverity 
};
