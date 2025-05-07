
/**
 * Early Conversation Handling
 * 
 * Specialized processing for the critical first few turns of conversation
 */

import {
  generateSmallTalkResponse,
  isLikelyChild,
  isLikelyNewcomer
} from '../conversation/smallTalk';

import {
  generateCulturalConnectionPrompt,
  incorporateRogerPersonality,
  generateConnectionStatement,
  generateTransitionToEric
} from '../conversation/earlyEngagement/culturalConnector';

// Import these from conversation/index.ts to ensure they're available
import { 
  isLikelyTeen,
  isLikelyMale,
  isLikelyBlueCollar,
  mightPreferSimpleLanguage,
  getAppropriateConversationStyle,
  identifyImmediateConcern,
  generateImmediateConcernResponse
} from '../conversation';

/**
 * Apply early conversation RAG (Retrieval Augmented Generation) 
 * for use in early parts of conversation
 */
export const applyEarlyConversationRAG = (
  response: string,
  userInput: string
): string => {
  // In early conversation, we want to be very cautious about making claims
  // This is a simplified version - in production this would use actual RAG
  
  // Remove any claims of prior knowledge
  let enhancedResponse = response
    .replace(/as you (mentioned|said|noted|shared)/gi, "from what you're sharing")
    .replace(/you (said|mentioned|told me|indicated) earlier/gi, "you're saying");
    
  // Add hedging language if not present
  if (!/(From what I understand|It sounds like|I hear that|Based on what you|From what you shared)/i.test(enhancedResponse)) {
    enhancedResponse = "From what you've shared, " + enhancedResponse;
  }
  
  return enhancedResponse;
};

/**
 * Create safe early conversation grounding
 * Ensures we don't make false claims about the user when we first meet them
 */
export const createEarlyConversationGrounding = (userInput: string): string => {
  // Extract basic topics from the user input without making assumptions
  const topics = extractSimpleTopics(userInput);
  
  if (topics.length > 0) {
    return `The user has mentioned: ${topics.join(', ')}. No prior context available yet.`;
  }
  
  return "New conversation with limited context. Avoid making assumptions about prior exchanges.";
};

/**
 * Process early conversation with special handling for first few exchanges
 */
export const processEarlyConversationStages = (
  response: string,
  userInput: string,
  conversationHistory: string[] = []
): string => {
  // Apply RAG for safer early responses
  let enhancedResponse = applyEarlyConversationRAG(response, userInput);
  
  // For the very first exchange, be extra cautious about assumptions
  if (conversationHistory.length <= 1) {
    // Avoid statements that imply prior knowledge
    enhancedResponse = enhancedResponse
      .replace(/you've been feeling/gi, "you may be feeling")
      .replace(/you've experienced/gi, "you might be experiencing");
      
    // Ensure we ask open-ended questions to gather more information
    if (!enhancedResponse.includes("?") && enhancedResponse.length < 150) {
      enhancedResponse += " What else would be helpful for me to understand about your situation?";
    }
  }
  
  return enhancedResponse;
};

/**
 * Extract simple topics from text without complex NLP
 */
function extractSimpleTopics(text: string): string[] {
  // This is a simplified approach - a real implementation would use proper NLP
  const stopwords = new Set([
    'a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'by',
    'i', 'me', 'my', 'mine', 'myself', 'you', 'your', 'yours', 'yourself',
    'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself',
    'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves',
    'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be',
    'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing'
  ]);
  
  // Split text and filter out stopwords and short words
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => !stopwords.has(word) && word.length > 3);
    
  // Count word frequency
  const wordCounts: Record<string, number> = {};
  for (const word of words) {
    wordCounts[word] = (wordCounts[word] || 0) + 1;
  }
  
  // Sort by frequency and take top 3
  return Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([word]) => word);
}

/**
 * Generate appropriate response for early conversations
 */
export const generateEarlyConversationResponse = (
  userInput: string,
  messageCount: number
): string => {
  // Prioritize immediate concerns
  const immediateConcern = identifyImmediateConcern(userInput);
  if (immediateConcern) {
    return generateImmediateConcernResponse(userInput, immediateConcern);
  }
  
  // Generate small talk response
  const smallTalkResponse = generateSmallTalkResponse(userInput, messageCount);
  if (smallTalkResponse) {
    return smallTalkResponse;
  }
  
  // Generate cultural connection prompt
  if (messageCount <= 5) {
    const culturalConnectionPrompt = generateCulturalConnectionPrompt(userInput, messageCount);
    if (culturalConnectionPrompt) {
      return culturalConnectionPrompt;
    }
  }
  
  // Default response
  return "I'm here to chat while you wait. How are you feeling today?";
};

// Export the handleEarlyConversation function to fix the import issue
export const handleEarlyConversation = (userInput: string, messageCount: number): string => {
  return generateEarlyConversationResponse(userInput, messageCount);
};
