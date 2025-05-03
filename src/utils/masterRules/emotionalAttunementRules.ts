
/**
 * Emotional Attunement Rules
 * 
 * Re-exports from the modular emotional attunement system.
 * This maintains backward compatibility while allowing for a more
 * modular and maintainable code structure.
 */

import { 
  detectEmotionalContent,
  detectEverydaySituation,
  generateEmotionallyAttunedResponse,
  generatePracticalSupportResponse,
  processEmotionalInput,
  EmotionInfo,
  EverydaySituationInfo
} from './emotionalAttunement';

export {
  detectEmotionalContent,
  detectEverydaySituation,
  generateEmotionallyAttunedResponse,
  generatePracticalSupportResponse,
  processEmotionalInput
};

export type {
  EmotionInfo,
  EverydaySituationInfo
};

