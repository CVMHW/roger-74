
/**
 * Memory-related hallucination handling
 * 
 * Focuses on detecting and fixing false memory references
 */

import { getConversationMessageCount } from '../../../memory/newConversationDetector';

/**
 * Handle memory-related hallucinations
 */
export const handleMemoryHallucinations = (
  responseText: string,
  conversationHistory: string[]
): {
  requiresStrictPrevention: boolean;
} => {
  // Track if we have a potential memory reference
  const containsMemoryReference = /I remember|you mentioned|you told me|you said|earlier you|previously you|we talked about|we discussed|we've been|you shared|as I recall/i.test(responseText);
  
  // Get conversation message count
  const messageCount = getConversationMessageCount();
  const isNewConversation = messageCount < 3;
  
  // Critical check for false continuity claims like "we've been focusing on"
  const falseContinuityPattern = /(?:we've been focusing on|we've been discussing|we've been talking about|as we discussed|we were discussing|we talked about earlier) (?:your|the|about|how|what|why)?\s*([a-zA-Z\s]+)/gi;
  
  const containsFalseContinuity = falseContinuityPattern.test(responseText);
  
  // Check for "you may have indicated" which is often a sign of confusion
  const containsMayHaveIndicated = /you may have indicated/i.test(responseText);
  
  // Check for multiple "I hear" statements which suggest repetition
  const multipleIHear = (responseText.match(/I hear/gi) || []).length > 1;
  
  // Determine if strict prevention is required
  const requiresStrictPrevention = 
      // Memory references in new conversations are always concerning
      (isNewConversation && containsMemoryReference) || 
      // False continuity claims in new conversations
      (containsFalseContinuity && isNewConversation) ||
      // "you may have indicated" is a strong sign of hallucination
      containsMayHaveIndicated ||
      // Multiple "I hear" statements suggest repetition
      multipleIHear;
  
  return {
    requiresStrictPrevention
  };
};
