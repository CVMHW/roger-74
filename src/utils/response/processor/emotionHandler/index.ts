
/**
 * Emotion Handler
 * 
 * Central export point for emotion-related processing functions
 */

// Import from conversation/theSmallStuff for everyday situations
export { 
  detectEverydayFrustration as detectEverydaySituation,
  generateEverydayFrustrationResponse 
} from '../../../conversation/theSmallStuff/index';

// Import from Cleveland-specific modules
export { 
  detectClevelandSportsReference,
  detectClevelandWeatherReference,
  detectClevelandCulturalReference 
} from '../../../conversationEnhancement/ohio/detectors';

// Export our core emotion handlers
export { 
  checkEmotionMisidentification,
  fixEmotionMisidentification,
  addHumanTouch
} from './emotionMisidentificationHandler';

// Export additional emotion-related handlers as needed
