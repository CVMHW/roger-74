
/**
 * Utilities for validating responses against unconditional rules
 */

/**
 * Validates that a response follows the unconditional rules
 * @param response The candidate response
 * @param userInput The original user input
 * @param messageCount Current message count in the conversation
 * @returns Whether the response meets the unconditional requirements
 */
export const validateUnconditionalRules = (
  response: string,
  userInput: string,
  messageCount: number
): boolean => {
  // Early conversation requires acknowledging everyday concerns first
  if (messageCount <= 10) {
    const hasAcknowledgment = /sounds|seems|understand|hear you|that's|frustrating|challenging|difficult|tough|stressful/i.test(response);
    const hasPersonalTouch = response.includes("club soda") || 
      response.includes("stinks") || 
      response.includes("been there") || 
      response.includes("happens to") ||
      response.includes("get that");
      
    if (!hasAcknowledgment && !hasPersonalTouch) {
      return false;
    }
  }
  
  // For all conversations, check if response follows the patient's lead
  const userTopics = extractTopics(userInput);
  const responseAddressesUserTopics = userTopics.some(topic => 
    response.toLowerCase().includes(topic.toLowerCase())
  );
  
  return responseAddressesUserTopics;
};

/**
 * Extracts key topics from user input
 * @param input The user's message
 * @returns List of key topics mentioned
 */
const extractTopics = (input: string): string[] => {
  const topics: string[] = [];
  
  // Extract potential topics (nouns and noun phrases)
  const sentences = input.split(/[.!?]+/);
  
  for (const sentence of sentences) {
    const words = sentence.trim().split(/\s+/);
    for (const word of words) {
      const cleaned = word.replace(/[^a-zA-Z]/g, '').toLowerCase();
      if (cleaned.length > 3 && !commonWords.includes(cleaned)) {
        topics.push(cleaned);
      }
    }
  }
  
  return topics;
};

// Common words to filter out from topic extraction
const commonWords = [
  "about", "after", "again", "also", "always", "another", "because", 
  "before", "being", "between", "both", "could", "doesn", "doing", 
  "don't", "during", "each", "either", "enough", "every", "everyone", 
  "everything", "from", "getting", "have", "having", "here", "himself", 
  "just", "know", "like", "more", "most", "much", "myself", "never", 
  "only", "other", "over", "same", "some", "something", "such", "take", 
  "taking", "than", "that", "their", "them", "then", "there", "these", 
  "they", "this", "those", "through", "very", "want", "well", "were", 
  "what", "when", "where", "which", "while", "will", "with", "would", 
  "your", "you're", "should", "could", "would"
];

/**
 * Checks if response appropriately validates subclinical concerns
 * without pathologizing normal emotions
 */
export const validatesSubclinicalConcerns = (response: string): boolean => {
  const pathologizingLanguage = /(clinical|disorder|diagnosis|symptom|treatment|therapy|mental health issue)/i;
  const normalizingLanguage = /(normal|common|we all|everyone feels|natural|understandable|makes sense)/i;
  
  return !pathologizingLanguage.test(response) && normalizingLanguage.test(response);
};
