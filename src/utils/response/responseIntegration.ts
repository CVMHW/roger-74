
/**
 * Response Integration Module
 * 
 * Applies unconditional rules and integrates memory directly into responses
 * to ensure Roger maintains memory usage in every interaction.
 * 
 * This module serves as another layer of memory redundancy in the system.
 */

import { getContextualMemory, recordToMemory } from '../nlpProcessor';
import { applyMemoryRules } from '../rulesEnforcement/memoryEnforcer';
import { getFiveResponseMemory, getLastPatientMessage } from '../memory/fiveResponseMemory';
import { retrieveRelevantMemories } from '../memory/memoryBank';

/**
 * Apply unconditional rules to a response
 * Always checks if memory is being used
 */
export const applyUnconditionalRules = (
  response: string,
  userInput: string,
  messageCount: number,
  conversationHistory: string[] = []
): string => {
  try {
    console.log("UNCONDITIONAL RULES: Applying to response");
    
    // Always force memory rule application
    return applyMemoryRules(response, userInput, conversationHistory);
  } catch (error) {
    console.error('Error applying unconditional rules:', error);
    
    // Even on error, ensure response has memory reference
    try {
      // Try to get memory from any available system
      let memoryReference = "";
      
      // Try 5ResponseMemory first
      const lastPatientMessage = getLastPatientMessage();
      if (lastPatientMessage) {
        memoryReference = `I remember you mentioned "${lastPatientMessage.substring(0, 20)}..." `;
      } else {
        // Fall back to primary memory system
        const memory = getContextualMemory(userInput);
        memoryReference = `I remember our conversation about ${memory.dominantTopics[0] || 'your concerns'}. `;
      }
      
      // Return memory-enhanced fallback
      return memoryReference + response;
    } catch (memoryError) {
      console.error('Error creating memory reference during error recovery:', memoryError);
      return `I remember what you've shared with me. ${response}`;
    }
  }
};

/**
 * Enhance response with rapport-building elements
 * Always ensures memory utilization
 */
export const enhanceResponseWithRapport = (
  response: string,
  userInput: string,
  messageCount: number,
  conversationHistory: string[] = []
): string => {
  try {
    console.log("RAPPORT BUILDING: Enhancing response");
    
    // Check if response already contains memory reference
    const hasMemoryReference = /remember|mentioned|earlier|previously|you've shared|you told me|we talked about|you said|as we discussed|based on what you/i.test(response);
    
    if (hasMemoryReference) {
      return response; // Already using memory
    }
    
    // Try to get relevant memories from MemoryBank
    try {
      const relevantMemories = retrieveRelevantMemories(userInput);
      
      if (relevantMemories.length > 0) {
        const memory = relevantMemories[0];
        return `I remember you mentioned ${memory.content.substring(0, 30)}... ${response}`;
      }
    } catch (memoryError) {
      console.error('Error retrieving from MemoryBank during rapport building:', memoryError);
    }
    
    // Try to get memory from 5ResponseMemory
    try {
      const fiveMemory = getFiveResponseMemory();
      if (fiveMemory.length > 1) {
        const patientEntries = fiveMemory.filter(entry => entry.role === 'patient');
        if (patientEntries.length > 1) {
          // Use second most recent to avoid repetition
          const memoryEntry = patientEntries[1];
          return `I remember you told me about ${memoryEntry.content.substring(0, 20)}... ${response}`;
        }
      }
    } catch (memoryError) {
      console.error('Error retrieving from 5ResponseMemory during rapport building:', memoryError);
    }
    
    // Fall back to primary memory system
    const memory = getContextualMemory(userInput);
    if (memory.dominantTopics.length > 0) {
      return `I remember we were talking about ${memory.dominantTopics[0]}. ${response}`;
    }
    
    // Last resort
    return `I remember what we've been discussing. ${response}`;
    
  } catch (error) {
    console.error('Error enhancing response with rapport building:', error);
    return response; // Return original response if error occurs
  }
};

/**
 * Add memory integration to any response type
 */
export const integrateMemoryIntoResponse = (
  responseType: string,
  response: string,
  userInput: string
): string => {
  try {
    console.log(`MEMORY INTEGRATION: Adding to ${responseType} response`);
    
    // Check if already using memory
    if (/remember|mentioned|earlier|previously|you've shared|you told me|we talked about|you said|as we discussed|based on what you/i.test(response)) {
      return response;
    }
    
    // Different memory phrases based on response type
    let memoryPhrase = "";
    
    switch (responseType) {
      case 'cultural':
        memoryPhrase = "Based on what you've shared about your background, ";
        break;
      case 'smalltalk':
        memoryPhrase = "As we've been talking, I remember you mentioned ";
        break;
      case 'reflection':
        memoryPhrase = "From our conversation, I recall you said ";
        break;
      case 'safety':
        memoryPhrase = "Given what you've shared with me, ";
        break;
      default:
        memoryPhrase = "I remember you mentioned ";
    }
    
    // Try to get specific memory content
    try {
      const relevantMemories = retrieveRelevantMemories(userInput);
      
      if (relevantMemories.length > 0) {
        const memory = relevantMemories[0];
        return `${memoryPhrase}${memory.content.substring(0, 20)}... ${response}`;
      }
    } catch (memoryError) {
      console.error('Failed to retrieve relevant memories for integration:', memoryError);
    }
    
    // Fall back to the memory phrase without specific content
    return `${memoryPhrase}your concerns. ${response}`;
    
  } catch (error) {
    console.error('Error integrating memory into response:', error);
    return response;
  }
};

/**
 * Ensure any cultural response uses memory
 */
export const enhanceCulturalResponse = (response: string, userInput: string): string => {
  return integrateMemoryIntoResponse('cultural', response, userInput);
};

/**
 * Ensure any small talk response uses memory
 */
export const enhanceSmallTalkResponse = (response: string, userInput: string): string => {
  return integrateMemoryIntoResponse('smalltalk', response, userInput);
};

/**
 * Ensure any reflection response uses memory
 */
export const enhanceReflectionResponse = (response: string, userInput: string): string => {
  return integrateMemoryIntoResponse('reflection', response, userInput);
};

/**
 * Ensure any safety response uses memory
 */
export const enhanceSafetyResponse = (response: string, userInput: string): string => {
  return integrateMemoryIntoResponse('safety', response, userInput);
};

export default {
  applyUnconditionalRules,
  enhanceResponseWithRapport,
  enhanceCulturalResponse,
  enhanceSmallTalkResponse,
  enhanceReflectionResponse,
  enhanceSafetyResponse
};
