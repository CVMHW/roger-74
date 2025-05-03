
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
    console.log("UNCONDITIONAL MEMORY RULE: Recording interaction to memory");
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
      console.log("Backup memory storage activated");
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
  console.log("UNCONDITIONAL MEMORY CHECK: Verifying memory utilization");
  
  // Always require memory usage, regardless of conversation length
  try {
    // Get contextual memory
    const memory = getContextualMemory(userInput);
    
    // Memory references in the response
    const memoryReferences = [
      "remember", "mentioned", "earlier", "previously", 
      "you've shared", "you told me", "we talked about",
      "you said", "as we discussed", "based on what you"
    ];
    
    // Check if response references memory in any way
    const hasMemoryReference = memoryReferences.some(ref => 
      proposedResponse.toLowerCase().includes(ref.toLowerCase())
    );
    
    // Check if response uses specific topics or emotions from memory
    const usesSpecificMemory = memory.dominantTopics.some(topic => 
      proposedResponse.toLowerCase().includes(topic.toLowerCase())
    ) || proposedResponse.toLowerCase().includes(memory.dominantEmotion.toLowerCase());
    
    // Check for relevant statement correlation
    const usesRelevantContext = memory.relevantStatements.some(statement => {
      // Find key words (3+ letters) in the statement
      const statementWords = statement.toLowerCase().split(/\s+/).filter(word => word.length > 3);
      // Check if any of these words appear in the response
      return statementWords.some(word => proposedResponse.toLowerCase().includes(word));
    });
    
    console.log("Memory utilization check results:", { 
      hasMemoryReference, 
      usesSpecificMemory, 
      usesRelevantContext 
    });
    
    return hasMemoryReference || usesSpecificMemory || usesRelevantContext;
  } catch (error) {
    console.error('Error verifying memory utilization:', error);
    return false;  // Return false to force memory enhancement
  }
};

/**
 * Backup method to enforce memory utilization when primary method fails
 * Ensures the UNCONDITIONAL_MEMORY_RULE is never violated
 */
export const forceMemoryEnhancement = (response: string): string => {
  try {
    // Get all memory
    const memory = getAllMemory();
    
    // If there are any patient statements, use the most recent one
    if (memory.patientStatements.length > 0) {
      const lastStatement = memory.patientStatements[memory.patientStatements.length - 1];
      
      // Create a memory-enhanced response
      return `I remember you said "${lastStatement.substring(0, 30)}..." earlier. ${response}`;
    }
    
    return response;
  } catch (error) {
    console.error('Critical error in force memory enhancement:', error);
    return response;
  }
};
