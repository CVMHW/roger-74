
/**
 * Unconditional Rule Protections
 * 
 * These rules MUST be followed in ALL Roger interactions without exception.
 * They are the foundation of the therapeutic relationship and cannot be overridden.
 */

import { recordToMemory, getAllMemory, getContextualMemory } from '../nlpProcessor';

// Re-export from core rules
export { 
  UNCONDITIONAL_RULES,
  UNCONDITIONAL_MEMORY_RULE,
  getEarlyEngagementMandate,
  shouldPrioritizeCulturalAttunement 
} from './core/coreRules';

// Re-export from validation
export {
  validateUnconditionalRules,
  validatesSubclinicalConcerns
} from './validation/responseValidation';

// Re-export from topic detection
export {
  shouldPrioritizeSmallTalk,
  isSubclinicalConcern,
  isIntroduction,
  isSmallTalk,
  isPersonalSharing
} from './detection/topicDetection';

// Re-export from response generators
export {
  generateIntroductionResponse,
  generatePersonalSharingResponse
} from './generators/responseGenerators';

// Re-export from safety utilities
export {
  isEmergency,
  handleEmergency,
  isDirectMedicalAdvice,
  handleDirectMedicalAdvice,
  isSuicidalIdeation,
  handleSuicidalIdeation
} from './safety/safetyUtils';

// Export memory utilities for unconditional memory protection
export { recordToMemory, getAllMemory, getContextualMemory };

/**
 * Enforces the Unconditional Memory Rule
 * Ensures Roger always has access to memory of past interactions
 */
export const enforceMemoryRule = (userInput: string, rogerResponse: string): void => {
  // UNCONDITIONAL recording of all interactions to memory
  try {
    recordToMemory(userInput, rogerResponse);
  } catch (error) {
    console.error('Error enforcing memory rule:', error);
    
    // Emergency fallback for critical memory failure
    try {
      // Attempt to store in session storage as backup
      const backupStore = {
        timestamp: Date.now(),
        userInput,
        rogerResponse
      };
      
      // Get existing backup or initialize new one
      const existingBackup = sessionStorage.getItem('rogerMemoryBackup');
      const backupArray = existingBackup ? JSON.parse(existingBackup) : [];
      
      // Add current interaction and save
      backupArray.push(backupStore);
      sessionStorage.setItem('rogerMemoryBackup', JSON.stringify(backupArray));
    } catch (backupError) {
      console.error('Critical memory protection failure:', backupError);
    }
  }
};

/**
 * Verifies that Roger's response reflects memory of past interactions
 * Implements the UNCONDITIONAL_MEMORY_RULE
 */
export const verifyMemoryUtilization = (
  userInput: string,
  proposedResponse: string,
  conversationHistory: string[]
): boolean => {
  // Check if conversation is long enough to require memory usage
  if (conversationHistory.length < 3) {
    return true; // Not enough history to require memory yet
  }
  
  try {
    // Get contextual memory
    const memory = getContextualMemory(userInput);
    
    // Check if response uses memory by checking for key topics or emotions
    const usesMemory = memory.dominantTopics.some(topic => 
      proposedResponse.toLowerCase().includes(topic.toLowerCase())
    ) || proposedResponse.toLowerCase().includes(memory.dominantEmotion.toLowerCase());
    
    return usesMemory;
  } catch (error) {
    console.error('Error verifying memory utilization:', error);
    return true; // Default to allowing response on error
  }
};
