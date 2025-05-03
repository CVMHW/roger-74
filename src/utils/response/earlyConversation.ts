
/**
 * Early Conversation Handling
 * 
 * Specialized processing for the critical first few turns of conversation
 */

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
