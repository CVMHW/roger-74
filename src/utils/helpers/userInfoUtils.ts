
/**
 * Detect wealth indicators from user messages
 */
export const detectWealthIndicators = (userInput: string, history: string[]): 'low' | 'medium' | 'high' | 'unknown' => {
  // Simple implementation - would be expanded in a real system
  const combinedText = [userInput, ...history.slice(-3)].join(' ').toLowerCase();
  
  // Check for low wealth indicators
  if (/\b(can'?t afford|expensive|cost too much|budget|money trouble|financial difficulty|poor|poverty|assistance|welfare|food stamps|medicaid|public housing)\b/i.test(combinedText)) {
    return 'low';
  }
  
  // Check for high wealth indicators
  if (/\b(investment|portfolio|stocks|broker|luxury|premium|private insurance|vacation home|second home|yacht|private school)\b/i.test(combinedText)) {
    return 'high';
  }
  
  return 'unknown';
};

/**
 * Helper function to extract pet type from user message
 */
export const extractPetType = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('dog')) return 'dog';
  if (lowerMessage.includes('puppy')) return 'puppy';
  if (lowerMessage.includes('cat')) return 'cat';
  if (lowerMessage.includes('kitten')) return 'kitten';
  if (lowerMessage.includes('bird')) return 'bird';
  if (lowerMessage.includes('fish')) return 'fish';
  if (lowerMessage.includes('hamster')) return 'hamster';
  if (lowerMessage.includes('guinea pig')) return 'guinea pig';
  if (lowerMessage.includes('rabbit')) return 'rabbit';
  if (lowerMessage.includes('horse')) return 'horse';
  
  return 'pet'; // Default if no specific pet type is mentioned
};

/**
 * Calculate similarity between two responses (basic implementation)
 */
export const calculateResponseSimilarity = (a: string, b: string): number => {
  // Convert to lowercase and remove punctuation
  const cleanA = a.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
  const cleanB = b.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
  
  // Split into words
  const wordsA = cleanA.split(/\s+/);
  const wordsB = cleanB.split(/\s+/);
  
  // Count shared words
  let sharedWords = 0;
  for (const word of wordsA) {
    if (wordsB.includes(word)) {
      sharedWords++;
    }
  }
  
  // Calculate Jaccard similarity
  return sharedWords / (wordsA.length + wordsB.length - sharedWords);
};
