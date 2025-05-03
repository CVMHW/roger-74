
/**
 * Utility functions for hallucination handler
 */

/**
 * Calculate similarity between two text fragments
 */
export const calculateSimilarity = (text1: string, text2: string): number => {
  // Simple word overlap similarity calculation
  const words1 = new Set(text1.toLowerCase().split(/\s+/));
  const words2 = new Set(text2.toLowerCase().split(/\s+/));
  
  // Find the intersection
  const intersection = [...words1].filter(word => words2.has(word));
  
  // Calculate Jaccard similarity
  const similarity = intersection.length / (words1.size + words2.size - intersection.length);
  
  return similarity;
};

/**
 * Extract key topics from text
 */
export const extractKeyTopics = (text: string): string[] => {
  // Simple implementation - split by spaces and punctuation
  const words = text.toLowerCase().split(/[\s,.!?;:()[\]{}'"]+/);
  
  // Filter out common stop words
  const stopWords = new Set([
    'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 
    'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 
    'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 
    'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', 
    'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 
    'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 
    'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 
    'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 
    'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 
    'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 
    'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 
    'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 
    'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very'
  ]);
  
  // Get phrases (individual words for now, but could be n-grams)
  const topics = words
    .filter(word => word.length > 3 && !stopWords.has(word))
    .slice(0, 10); // Limit to 10 key topics
    
  return topics;
};

/**
 * Check for abrupt topic changes
 */
export const detectTopicChange = (
  userInput: string,
  responseText: string
): boolean => {
  // Extract topics from both texts
  const userTopics = extractKeyTopics(userInput);
  const responseTopics = extractKeyTopics(responseText);
  
  // Check for overlap
  const overlap = userTopics.filter(topic => 
    responseTopics.some(rTopic => rTopic.includes(topic) || topic.includes(rTopic))
  );
  
  // If no topics match at all, that might indicate a topic change
  return overlap.length === 0 && userTopics.length > 0 && responseTopics.length > 0;
};

/**
 * Check if text contains specific memory claim patterns
 */
export const containsMemoryClaims = (text: string): boolean => {
  const memoryPatterns = [
    /you (mentioned|said|told me|indicated)/i,
    /earlier you/i,
    /previously you/i,
    /you've been/i,
    /we (discussed|talked about)/i,
    /I remember/i,
    /as you mentioned/i
  ];
  
  return memoryPatterns.some(pattern => pattern.test(text));
};
