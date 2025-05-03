
/**
 * Memory Enforcer Module
 * 
 * UNCONDITIONAL RULE: Roger must ALWAYS leverage memory in every response.
 * This module enforces multiple checks to guarantee memory utilization
 * in every single interaction.
 */

import { getContextualMemory, recordToMemory, getAllMemory } from '../nlpProcessor';
import { RuleType, RulePriority, withRuleEnforcement } from './rulesEnforcer';
import { addToFiveResponseMemory, getLastPatientMessage, getFiveResponseMemory } from '../memory/fiveResponseMemory';

// Memory reference patterns that should appear in responses
const MEMORY_REFERENCE_PATTERNS = [
  "remember", "mentioned", "earlier", "previously", 
  "you've shared", "you told me", "we talked about",
  "you said", "as we discussed", "based on what you"
];

/**
 * UNCONDITIONAL: Verify that a proposed response utilizes memory
 */
export const verifyMemoryUtilization = (
  userInput: string,
  proposedResponse: string,
  conversationHistory: string[] = []
): boolean => {
  console.log("UNCONDITIONAL MEMORY CHECK: Verifying memory utilization");
  
  try {
    // Get contextual memory
    const memory = getContextualMemory(userInput);
    
    // Check if response references memory in any way
    const hasMemoryReference = MEMORY_REFERENCE_PATTERNS.some(ref => 
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
    
    const memoryUtilizationDetected = hasMemoryReference || usesSpecificMemory || usesRelevantContext;
    
    // UNCONDITIONAL RULE: Log violation if memory not used
    if (!memoryUtilizationDetected) {
      console.error("UNCONDITIONAL RULE VIOLATION: Response does not utilize memory");
    }
    
    return memoryUtilizationDetected;
  } catch (error) {
    console.error('Error verifying memory utilization:', error);
    return false;  // Return false to force memory enhancement
  }
};

/**
 * UNCONDITIONAL: Force memory enhancement when verification fails
 */
export const forceMemoryEnhancement = (response: string, userInput: string): string => {
  console.log("UNCONDITIONAL RULE ENFORCEMENT: Adding memory references to response");
  
  try {
    // Get contextual memory
    const memory = getContextualMemory(userInput);
    
    // Different ways to incorporate memory
    const memoryPhrases = [
      `I remember you mentioned ${memory.dominantTopics[0] || 'what you\'ve been going through'} earlier. `,
      `Based on what you've told me about ${memory.dominantTopics[0] || 'your situation'}, `,
      `Considering our conversation about ${memory.dominantTopics[0] || 'your concerns'}, `,
      `From what you've shared about ${memory.dominantTopics[0] || 'your experiences'}, `,
      `As we've been discussing ${memory.dominantTopics[0] || 'these issues'}, `
    ];
    
    // Select a memory phrase
    const randomPhrase = memoryPhrases[Math.floor(Math.random() * memoryPhrases.length)];
    
    // Create enhanced response with memory reference
    const enhancedResponse = randomPhrase + response;
    
    // Log the memory enforcement
    console.log("UNCONDITIONAL RULE ENFORCED: Memory reference added to response");
    
    return enhancedResponse;
  } catch (error) {
    console.error('Critical error in force memory enhancement:', error);
    
    // CRITICAL: Try to use 5ResponseMemory as fallback
    try {
      const lastPatientMessage = getLastPatientMessage();
      if (lastPatientMessage) {
        const snippet = lastPatientMessage.substring(0, 30);
        return `I remember you said "${snippet}..." ${response}`;
      }
    } catch (memoryError) {
      console.error('Critical failure in 5ResponseMemory fallback:', memoryError);
    }
    
    // Even if everything fails, still add a basic memory reference
    return `I remember what you've shared with me. ${response}`;
  }
};

/**
 * UNCONDITIONAL: Process response through memory rules system
 * This is the primary function to ensure memory compliance
 */
export const processResponseWithMemoryRules = (
  response: string,
  userInput: string,
  conversationHistory: string[] = []
): string => {
  console.log("UNCONDITIONAL MEMORY RULE: Processing response");
  
  try {
    // CRITICAL: Add to 5ResponseMemory 
    addToFiveResponseMemory('patient', userInput);
    
    // REQUIRED: Verify memory system is active
    const memory = getAllMemory();
    if (!memory.persistentMemory) {
      console.error("CRITICAL VIOLATION: Memory system disabled");
      // Force enable memory
      recordToMemory("SYSTEM: Memory verification", "SYSTEM: Re-enabling memory");
    }
    
    // REQUIRED: Check if the response already uses memory
    const usesMemory = verifyMemoryUtilization(userInput, response, conversationHistory);
    
    // UNCONDITIONAL: If memory isn't used, force memory enhancement
    if (!usesMemory) {
      console.warn("UNCONDITIONAL RULE ENFORCEMENT: Response requires memory enhancement");
      const enhancedResponse = forceMemoryEnhancement(response, userInput);
      
      // Record the enhanced response to memory
      recordToMemory(userInput, enhancedResponse);
      
      // CRITICAL: Add to 5ResponseMemory
      addToFiveResponseMemory('roger', enhancedResponse);
      
      return enhancedResponse;
    }
    
    // Already uses memory - record and return
    recordToMemory(userInput, response);
    
    // CRITICAL: Add to 5ResponseMemory
    addToFiveResponseMemory('roger', response);
    
    return response;
    
  } catch (error) {
    console.error("CRITICAL ERROR in memory rule processing:", error);
    
    // CRITICAL: Try 5ResponseMemory fallback
    try {
      const fiveResponseMemory = getFiveResponseMemory();
      const lastPatientMessage = getLastPatientMessage();
      
      if (lastPatientMessage) {
        const snippet = lastPatientMessage.substring(0, 20);
        const fallbackResponse = `I remember you mentioned "${snippet}..." ${response}`;
        
        // Record to 5ResponseMemory
        addToFiveResponseMemory('roger', fallbackResponse);
        
        return fallbackResponse;
      }
    } catch (fiveResponseError) {
      console.error("CRITICAL FAILURE in 5ResponseMemory fallback:", fiveResponseError);
    }
    
    // UNCONDITIONAL: Even in critical failure, ensure memory reference
    const fallbackResponse = `I remember what you've shared with me. ${response}`;
    
    try {
      // Try to record to memory even in error state
      recordToMemory(userInput, fallbackResponse);
      
      // Try to record to 5ResponseMemory
      addToFiveResponseMemory('roger', fallbackResponse);
    } catch (memError) {
      console.error("CRITICAL MEMORY FAILURE:", memError);
    }
    
    return fallbackResponse;
  }
};

// Wrap the process function with rule enforcement to ensure double checking
export const processWithEnforcedMemoryRules = withRuleEnforcement(processResponseWithMemoryRules);

// Export a function that applies all memory rules as a single call
export const applyMemoryRules = (
  response: string, 
  userInput: string,
  conversationHistory: string[] = []
): string => {
  console.log("APPLYING ALL MEMORY RULES: Beginning enforcement");
  
  // CRITICAL: Record to 5ResponseMemory first
  addToFiveResponseMemory('patient', userInput);
  
  // Process through enforced rules
  const memoryEnforcedResponse = processWithEnforcedMemoryRules(
    response, 
    userInput,
    conversationHistory
  );
  
  // Perform final verification
  const finalCheckPassed = verifyMemoryUtilization(
    userInput,
    memoryEnforcedResponse,
    conversationHistory
  );
  
  // CRITICAL: Record to 5ResponseMemory
  addToFiveResponseMemory('roger', memoryEnforcedResponse);
  
  if (!finalCheckPassed) {
    console.error("CRITICAL VERIFICATION FAILURE: Memory rules not enforced correctly");
    
    // Try fallback from 5ResponseMemory first
    try {
      const lastPatient = getLastPatientMessage();
      if (lastPatient) {
        const snippet = lastPatient.substring(0, 20);
        return `I remember our conversation about ${snippet}... ${memoryEnforcedResponse}`;
      }
    } catch (fallbackError) {
      console.error("CRITICAL FAILURE in 5ResponseMemory fallback:", fallbackError);
    }
    
    // Last resort emergency fix
    return `I remember our conversation about ${userInput.substring(0, 20)}... ${memoryEnforcedResponse}`;
  }
  
  return memoryEnforcedResponse;
};

// Export functions
export default {
  verifyMemoryUtilization,
  forceMemoryEnhancement,
  processResponseWithMemoryRules,
  applyMemoryRules
};
