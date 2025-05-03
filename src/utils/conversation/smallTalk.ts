
/**
 * Small Talk Processor
 * 
 * Handles everyday conversation with memory integration to ensure
 * Roger maintains memory usage even in casual conversation.
 */

import { getContextualMemory } from '../nlpProcessor';
import { retrieveRelevantMemories } from '../memory/memoryBank';
import { enhanceSmallTalkResponse } from '../response/responseIntegration';

/**
 * Generate a response to small talk with memory integration
 */
export const generateSmallTalkResponse = (userInput: string, messageCount: number): string => {
  try {
    console.log("SMALLTALK: Generating response with memory integration");
    
    // Get contextual memory first
    const memory = getContextualMemory(userInput);
    
    // Check if input is about specific small talk topics
    if (/\b(weather|rain|snow|cold|hot|sunny|storm)\b/i.test(userInput)) {
      return enhanceSmallTalkResponse(
        "It's good to take a moment to notice these everyday things. How have you been feeling lately?",
        userInput
      );
    }
    
    if (/\b(weekend|plans|vacation|holiday|trip)\b/i.test(userInput)) {
      // Check if we have memory about their plans
      try {
        const relevantMemories = retrieveRelevantMemories(userInput);
        
        if (relevantMemories.length > 0) {
          const planMemory = relevantMemories[0];
          if (planMemory && typeof planMemory !== 'string') {
            return `I remember you mentioned ${planMemory.content.substring(0, 30)}... How are you feeling about your plans now?`;
          }
        }
      } catch (memoryError) {
        console.error('Error retrieving plan memories:', memoryError);
      }
      
      return enhanceSmallTalkResponse(
        "Having things to look forward to can be helpful. Is there anything specific you're anticipating?",
        userInput
      );
    }
    
    if (/\b(tired|sleep|rest|exhausted|nap)\b/i.test(userInput)) {
      return enhanceSmallTalkResponse(
        "Rest is so important for our wellbeing. Have your sleep patterns been affecting your mood?",
        userInput
      );
    }
    
    if (/\b(food|eat|dinner|lunch|breakfast|meal|recipe|cook)\b/i.test(userInput)) {
      return enhanceSmallTalkResponse(
        "Food can be connected to many aspects of our wellbeing. How have you been taking care of yourself lately?",
        userInput
      );
    }
    
    if (/\b(work|job|boss|meeting|colleague|office)\b/i.test(userInput)) {
      // Try to find work-related memories
      try {
        const workMemories = retrieveRelevantMemories(userInput);
        
        if (workMemories.length > 0) {
          const workMemory = workMemories[0];
          if (workMemory && typeof workMemory !== 'string') {
            return `I remember you mentioned ${workMemory.content.substring(0, 30)}... How has work been affecting you lately?`;
          }
        }
      } catch (memoryError) {
        console.error('Error retrieving work memories:', memoryError);
      }
      
      return enhanceSmallTalkResponse(
        "Our work lives can have such an impact on our wellbeing. How has it been affecting you lately?",
        userInput
      );
    }
    
    // For general small talk, use memory of dominant topics
    if (memory.dominantTopics.length > 0) {
      const topic = memory.dominantTopics[0];
      return `I remember we've been talking about ${topic}. Even in these everyday moments, how has that been on your mind?`;
    }
    
    // Default small talk response with memory
    return enhanceSmallTalkResponse(
      "Sometimes these everyday conversations help us connect. What's been on your mind lately?",
      userInput
    );
    
  } catch (error) {
    console.error('Error generating small talk response:', error);
    
    // Fallback with memory reference
    return "I remember our previous conversation. How have things been going for you today?";
  }
};

/**
 * Determine if a message is small talk with memory context
 */
export const isEnhancedSmallTalk = (userInput: string, conversationHistory: string[] = []): boolean => {
  try {
    // Basic small talk patterns
    const smallTalkPatterns = [
      /\b(hi|hello|hey|good morning|good afternoon|good evening)\b/i,
      /\b(how are you|how's it going|what's up|how's your day)\b/i,
      /\b(weather|rain|snow|cold|hot|sunny)\b/i,
      /\b(weekend|plans|vacation|holiday)\b/i,
      /\b(tired|sleep|rest|nap)\b/i,
      /\b(food|eat|dinner|lunch|breakfast|meal)\b/i
    ];
    
    // Check if input matches small talk patterns
    const isSmallTalk = smallTalkPatterns.some(pattern => pattern.test(userInput));
    
    if (!isSmallTalk) {
      return false;
    }
    
    // Enhanced small talk detection - check memory for context
    try {
      // Try to get relevant memories
      const relevantMemories = retrieveRelevantMemories(userInput);
      
      // If we have memories relevant to this small talk, it's contextual
      return relevantMemories.length > 0;
    } catch (memoryError) {
      console.error('Error retrieving memories for small talk detection:', memoryError);
      return isSmallTalk; // Fall back to basic detection
    }
    
  } catch (error) {
    console.error('Error in enhanced small talk detection:', error);
    return false;
  }
};

// Add missing exports required by other files
export const isLikelyChild = (userInput: string): boolean => false;
export const isLikelyNewcomer = (userInput: string): boolean => false;
export const detectSocialOverstimulation = (userInput: string): boolean => false;
export const smallTalkTopics: string[] = [];
export const conversationStarters: string[] = [];
export const turnTakingPrompts: string[] = [];
export const isLikelyTeen = (userInput: string): boolean => false;
export const isLikelyMale = (userInput: string): boolean => false;
export const isLikelyBlueCollar = (userInput: string): boolean => false;
export const mightPreferSimpleLanguage = (userInput: string): boolean => false;
export const getAppropriateConversationStyle = (userInput: string): string => "friendly";
export const shouldUseWaitingRoomEngagement = (userInput: string, messageCount: number): boolean => false;
export const identifyImmediateConcern = (userInput: string): string | null => null;
export const generateImmediateConcernResponse = (userInput: string, concernType: string): string => "";
export const generateWaitingRoomEngagement = (messageCount: number, userInput: string): string => "";
export const isWaitingRoomRelated = (userInput: string): boolean => {
  return userInput.toLowerCase().includes('waiting') || userInput.toLowerCase().includes('lobby');
};
export const generateWaitingRoomResponse = (userInput: string): string => {
  return "I understand waiting can be difficult. How can I help make this time more comfortable for you?";
};
export const shouldUseSmallTalk = (userInput: string): boolean => {
  return userInput.length < 20 && !userInput.includes('?');
};

export default {
  generateSmallTalkResponse,
  isEnhancedSmallTalk
};
