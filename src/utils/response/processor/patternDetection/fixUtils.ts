/**
 * Utilities for fixing repetitive patterns in text
 */

/**
 * Fix a specific repetitive pattern in a response
 */
export const fixRepetitivePattern = (response: string, pattern: RegExp): string => {
  // Replace the repetitive pattern with a non-repetitive version
  return response.replace(pattern, (match) => {
    // For multi-phrase repetitions, keep only the first occurrence
    if (/(Based on|From what|I hear).+(Based on|From what|I hear)/i.test(match)) {
      const firstPhraseMatch = match.match(/(Based on[^,.!?]+|From what[^,.!?]+|I hear[^,.!?]+)/i);
      if (firstPhraseMatch) {
        return firstPhraseMatch[0];
      }
    }
    
    // For simple direct repetitions
    if (match.includes('Would you like to tell me more?')) {
      return 'Would you like to tell me more?';
    }
    
    // For feeling repetitions
    if (/I hear you('re| are) feeling .+\. I hear you('re| are) feeling/i.test(match)) {
      const feelingMatch = match.match(/I hear you('re| are) feeling ([^.!?]+)/i);
      if (feelingMatch && feelingMatch[2]) {
        return `I hear you're feeling ${feelingMatch[2]}`;
      }
    }
    
    // Default: just return the first half
    const words = match.split(/\s+/);
    return words.slice(0, Math.ceil(words.length / 2)).join(' ');
  });
};

/**
 * Generate a variation of a response to avoid repetition
 */
export const generateVariation = (currentResponse: string, similarResponse: string): string => {
  // If the response is already short, just return it
  if (currentResponse.length < 30) return currentResponse;
  
  // 1. Try removing formulaic beginnings first
  const withoutFormulaicBeginning = currentResponse
    .replace(/^(Based on what you're sharing|From what you've shared|I hear what you're sharing|I understand that),?\s*/i, '');
  
  if (withoutFormulaicBeginning !== currentResponse) {
    // Capitalize the first letter
    return withoutFormulaicBeginning[0].toUpperCase() + withoutFormulaicBeginning.slice(1);
  }
  
  // 2. Try reordering sentences if there are multiple
  const sentences = currentResponse.split(/(?<=[.!?])\s+/);
  if (sentences.length > 1) {
    // Reorder sentences by moving the first sentence to the end
    const reordered = [...sentences.slice(1), sentences[0]].join(' ');
    return reordered;
  }
  
  // 3. Add variety by changing the opening phrase
  const openingPhrases = [
    "I'm curious about ",
    "Let's explore ",
    "Tell me more about ",
    "I'd like to understand ",
    "Let's focus on "
  ];
  
  const randomOpening = openingPhrases[Math.floor(Math.random() * openingPhrases.length)];
  return randomOpening + currentResponse.replace(/^(I'm wondering about|Tell me about|Let's explore|I'd like to understand)/i, '');
};
