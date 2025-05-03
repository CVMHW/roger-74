
/**
 * Hallucination Detection - Type Definitions
 */

import { 
  HallucinationCheck,
  HallucinationFlag
} from '../../../types/hallucinationPrevention';

/**
 * Result of a quick hallucination check
 */
export interface QuickCheckResult {
  potentialIssue: boolean;
  reason?: string;
  hasRepeatedSentences?: boolean;
}

export { HallucinationCheck, HallucinationFlag };
