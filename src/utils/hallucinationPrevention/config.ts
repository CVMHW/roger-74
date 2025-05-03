
/**
 * Configuration for hallucination prevention system
 */

import { HallucinationPreventionOptions } from '../../types/hallucinationPrevention';

/**
 * Default options for the hallucination prevention system
 */
export const DEFAULT_OPTIONS: HallucinationPreventionOptions = {
  enableReasoning: true,
  enableRAG: true,
  enableDetection: true,
  reasoningThreshold: 0.7,
  detectionSensitivity: 0.65,
  enableTokenLevelDetection: false,
  enableNLIVerification: false,
  enableReranking: false,
  tokenThreshold: 0.6,
  entailmentThreshold: 0.7,
};
