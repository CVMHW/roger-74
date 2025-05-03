/**
 * Unified Response Enhancement Pipeline
 * 
 * Centralizes all enhancement operations on Roger's responses to ensure
 * consistency and reduce confusion in responses.
 */

import { processResponseThroughMasterRules } from '../processor';
import { applyMemoryRules } from '../../rulesEnforcement/memoryEnforcer';
import { processThroughChatLogReview } from '../chatLogReviewer';
import { enhanceResponseWithContext } from '../../conversation/contextAware';
import { addToFiveResponseMemory } from '../../memory/fiveResponseMemory';
import { detectNewConversation, resetConversationSession } from '../../memory/newConversationDetector';

// Prevent repeated memory references
const memoryReferenceRegex = /I remember (you|we|your|our) [^.!?]+(\.|\!|\?)/gi;

/**
 * Sanitize response to remove duplicate or excessive memory references
 */
const removeDuplicateMemoryReferences = (responseText: string): string => {
  // Extract all memory references
  const memoryReferences = responseText.match(memoryReferenceRegex) || [];
  
  // If we have multiple memory references, keep only the first one
  if (memoryReferences.length > 1) {
    let cleanedResponse = responseText;
    
    // Remove all but the first memory reference
    for (let i = 1; i < memoryReferences.length; i++) {
      cleanedResponse = cleanedResponse.replace(memoryReferences[i], '');
    }
    
    // Clean up any double spaces created by removals
    return cleanedResponse.replace(/\s{2,}/g, ' ').trim();
  }
  
  return responseText;
};

/**
 * Check if memory reference is appropriate 
 * Don't use memory references in first few messages of a conversation
 */
const shouldUseMemoryReferences = (messageCount: number): boolean => {
  // Only use memory references after at least 3 exchanges
  return messageCount >= 3;
};

/**
 * Primary response enhancement pipeline
 * Processes responses through a unified series of enhancement steps
 * to ensure consistent, high-quality responses
 */
export const enhanceResponse = (
  responseText: string,
  userInput: string,
  messageCount: number,
  conversationHistory: string[]
): string => {
  try {
    // Check if this is a new conversation
    if (detectNewConversation(userInput)) {
      // Reset memory systems for new conversations
      resetConversationSession();
      console.log("NEW CONVERSATION DETECTED: Memory references will be suppressed");
      
      // For new conversations, remove any memory references
      return responseText.replace(memoryReferenceRegex, '').trim();
    }
    
    // For first few messages in a conversation, don't use memory references
    const useMemory = shouldUseMemoryReferences(messageCount);
    
    // Step 1: Apply context awareness (time of day, work stress, etc)
    let enhancedText = enhanceResponseWithContext(
      responseText,
      userInput, 
      conversationHistory
    );
    
    // Step 2: Apply master rules to ensure memory utilization (only if appropriate)
    if (useMemory) {
      enhancedText = processResponseThroughMasterRules(
        enhancedText,
        userInput,
        messageCount,
        conversationHistory
      );
    }
    
    // Step 3: Force memory enhancement according to memory rules (only if appropriate)
    if (useMemory) {
      enhancedText = applyMemoryRules(
        enhancedText,
        userInput,
        conversationHistory
      );
    }
    
    // Step 4: Apply tertiary safeguard - comprehensive chat log review
    enhancedText = processThroughChatLogReview(
      enhancedText,
      userInput,
      conversationHistory
    );
    
    // Step 5: Remove duplicate memory references
    enhancedText = removeDuplicateMemoryReferences(enhancedText);
    
    // Step 6: Record the final response to memory systems
    addToFiveResponseMemory('roger', enhancedText);
    
    return enhancedText;
  } catch (error) {
    console.error("Error in unified response enhancement pipeline:", error);
    
    // In case of error, return original to avoid empty responses
    try {
      // Still try to record the original response to memory
      addToFiveResponseMemory('roger', responseText);
    } catch (memError) {
      console.error("Failed to record to memory:", memError);
    }
    
    return responseText;
  }
};

/**
 * Process user message through the memory system
 * Records user input to ensure context is maintained
 */
export const processUserMessageMemory = (userInput: string): void => {
  try {
    // Record user message to memory system
    addToFiveResponseMemory('patient', userInput);
  } catch (error) {
    console.error("Error recording user message to memory:", error);
  }
};

/**
 * Check for repetition in recent responses
 * Helps prevent Roger from getting stuck in feedback loops
 */
export const checkForResponseRepetition = (
  newResponse: string,
  recentResponses: string[]
): boolean => {
  if (!newResponse || recentResponses.length === 0) return false;
  
  // Clean responses for comparison (remove spaces, lowercase)
  const normalizeText = (text: string): string => {
    return text.toLowerCase().replace(/\s+/g, ' ').trim();
  };
  
  const normalizedNew = normalizeText(newResponse);
  
  // Check for high similarity with recent responses
  for (const recent of recentResponses) {
    const normalizedRecent = normalizeText(recent);
    
    // Check for exact matches
    if (normalizedNew === normalizedRecent) {
      return true;
    }
    
    // Check for high similarity (90%+ of words are the same)
    const newWords = new Set(normalizedNew.split(' '));
    const recentWords = new Set(normalizedRecent.split(' '));
    
    // Count common words
    let commonCount = 0;
    for (const word of newWords) {
      if (recentWords.has(word)) {
        commonCount++;
      }
    }
    
    // Calculate similarity ratio
    const similarityRatio = commonCount / Math.max(newWords.size, recentWords.size);
    if (similarityRatio > 0.9) {
      return true;
    }
  }
  
  return false;
};

/**
 * Get a recovery response when repetition is detected
 * Helps Roger break out of response loops
 */
export const getRepetitionRecoveryResponse = (): string => {
  const recoveryResponses = [
    "I notice that I might be repeating myself. Let me take a different approach. What specific aspect of your situation would be most helpful to focus on right now?",
    "I want to make sure we're making progress in our conversation. Could you help me understand what would be most useful to discuss about your situation?",
    "It seems like we might be covering similar ground. I'd like to shift our conversation to be more helpful for you. What would you like to explore further?",
    "I'd like to make sure I'm addressing what matters most to you. What aspect of what you've shared would you like me to focus on?"
  ];
  
  return recoveryResponses[Math.floor(Math.random() * recoveryResponses.length)];
};
