
/**
 * Utility for detecting and handling repetition in conversations
 * Helps prevent Roger from appearing robotic by repeating the same responses
 */

/**
 * Checks whether a new response is too similar to previous responses
 * @param newResponse The response being checked for repetition
 * @param previousResponses Array of previous responses
 * @returns Whether the response is too similar to previous ones
 */
export const isResponseRepetitive = (newResponse: string, previousResponses: string[]): boolean => {
  // Skip very short responses
  if (newResponse.length < 15) return false;
  
  for (const prevResponse of previousResponses.slice(-5)) { // Only check last 5 responses
    // Calculate similarity
    const similarity = calculateResponseSimilarity(newResponse, prevResponse);
    
    // If similarity is above threshold, consider it repetitive
    if (similarity > 0.7) {
      return true;
    }
  }
  
  return false;
};

/**
 * Calculate text similarity between two responses
 * @param a First response
 * @param b Second response
 * @returns Similarity score between 0 and 1
 */
export const calculateResponseSimilarity = (a: string, b: string): number => {
  if (!a || !b) return 0;
  
  // Convert to lowercase and remove punctuation
  const cleanA = a.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
  const cleanB = b.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
  
  // Split into words and filter out common filler words
  const fillerWords = new Set(['i', 'you', 'the', 'a', 'an', 'and', 'that', 'this', 'it', 'is', 'are', 
                            'was', 'were', 'to', 'of', 'for', 'with', 'in', 'on', 'at', 'by', 'about', 
                            'like', 'so', 'but', 'or', 'as', 'be', 'can', 'would', 'should', 'could']);
  
  const wordsA = cleanA.split(/\s+/).filter(word => !fillerWords.has(word) && word.length > 1);
  const wordsB = cleanB.split(/\s+/).filter(word => !fillerWords.has(word) && word.length > 1);
  
  // If either set of filtered words is empty, they're not meaningfully similar
  if (wordsA.length === 0 || wordsB.length === 0) return 0;
  
  // Count shared words
  let sharedWords = 0;
  const uniqueWordsA = new Set(wordsA);
  const uniqueWordsB = new Set(wordsB);
  
  for (const word of uniqueWordsA) {
    if (uniqueWordsB.has(word)) {
      sharedWords++;
    }
  }
  
  // Calculate Jaccard similarity
  return sharedWords / (uniqueWordsA.size + uniqueWordsB.size - sharedWords);
};

/**
 * Generates an alternative response when default response is too repetitive
 * @param userContent Content information from user message
 * @returns An alternative, non-repetitive response
 */
export const generateAlternativeResponse = (userContent: { 
  category: string | null; 
  specificConcern: string | null;
}): string => {
  // Content-specific alternatives
  if (userContent.category === 'financial') {
    const financialAlternatives = [
      "Financial concerns like payment issues can be very stressful. What's your top priority right now regarding this situation?",
      "Let's focus on the payment problem you mentioned. What steps have you already taken to resolve this?",
      "Money issues can create a lot of stress. How is this affecting other areas of your life right now?",
      "I understand you're dealing with payment problems. What would be most helpful to discuss about this situation?",
      "Payment issues can be incredibly frustrating. What support do you need most right now?"
    ];
    return financialAlternatives[Math.floor(Math.random() * financialAlternatives.length)];
  }
  
  if (userContent.category === 'work') {
    const workAlternatives = [
      "Workplace issues can be challenging. What aspect of the work situation is most important to address?",
      "Let's focus on what you mentioned about your work situation. What would be most helpful to explore?",
      "Work challenges can affect us in many ways. How is this situation impacting you outside of work?",
      "I understand your concerns about the workplace. What specific aspect would be most helpful to discuss?",
      "Work issues can be complex. What's your top priority in addressing this situation?"
    ];
    return workAlternatives[Math.floor(Math.random() * workAlternatives.length)];
  }
  
  if (userContent.category === 'relationship') {
    const relationshipAlternatives = [
      "Relationship challenges can be difficult to navigate. What aspect of this situation feels most important right now?",
      "Let's focus on what you shared about your relationship. What would be most helpful to explore together?",
      "Relationships can be complex. What's been most challenging for you in this situation?",
      "I understand you're dealing with relationship concerns. What specific aspect would be most helpful to discuss?",
      "Relationship dynamics can affect many areas of life. How has this situation been impacting you?"
    ];
    return relationshipAlternatives[Math.floor(Math.random() * relationshipAlternatives.length)];
  }
  
  // Generic alternatives for any other content
  const genericAlternatives = [
    "I want to make sure I understand what's most important to you right now. What would be most helpful for us to discuss?",
    "Let's take a step back. What aspect of what you've shared would be most useful to explore?",
    "I'd like to shift our focus to what matters most to you right now. What's your priority?",
    "Let's make sure I'm focusing on what's most important. What specifically are you hoping to get from our conversation today?",
    "I want to be sure I'm addressing what matters to you. What's the main concern you'd like us to focus on?"
  ];
  
  return genericAlternatives[Math.floor(Math.random() * genericAlternatives.length)];
};
