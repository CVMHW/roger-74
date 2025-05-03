
/**
 * Special case handling for hallucinations
 */

/**
 * Check if a response contains repeated content
 */
export const hasRepeatedContent = (responseText: string): boolean => {
  // Check for repeated phrases that indicate hallucination
  const phrases = [
    "I hear you're", 
    "you mentioned",
    "I understand",
    "you said",
    "you told me",
    "you're feeling",
    "you may have indicated",
    "dealing with"
  ];
  
  for (const phrase of phrases) {
    // Count occurrences of each phrase
    const regex = new RegExp(phrase, 'gi');
    const matches = responseText.match(regex);
    
    // If a phrase appears more than once, it might indicate repetition
    if (matches && matches.length > 1) {
      // Check if they're too close to each other (within 40 chars)
      const firstIndex = responseText.toLowerCase().indexOf(phrase.toLowerCase());
      const secondIndex = responseText.toLowerCase().indexOf(phrase.toLowerCase(), firstIndex + phrase.length);
      
      if (secondIndex > 0 && (secondIndex - firstIndex) < 40) {
        return true;
      }
    }
  }
  
  // Check for repeated sentences or partial sentences
  const sentences = responseText.split(/[.!?]+/).filter(s => s.trim().length > 10);
  for (let i = 0; i < sentences.length; i++) {
    for (let j = i + 1; j < sentences.length; j++) {
      const similarity = calculateStringSimilarity(
        sentences[i].toLowerCase().trim(),
        sentences[j].toLowerCase().trim()
      );
      
      if (similarity > 0.7) {
        return true;
      }
    }
  }
  
  return false;
};

/**
 * Fix repeated content in responses
 */
export const fixRepeatedContent = (responseText: string): string => {
  // First try to identify the repeating patterns
  const phrases = [
    "I hear you're", 
    "you mentioned",
    "I understand",
    "you said",
    "you told me",
    "you're feeling",
    "you may have indicated",
    "dealing with"
  ];
  
  let fixedResponse = responseText;
  
  // Check each phrase for close repetition and fix
  for (const phrase of phrases) {
    const firstIndex = fixedResponse.toLowerCase().indexOf(phrase.toLowerCase());
    if (firstIndex >= 0) {
      const secondIndex = fixedResponse.toLowerCase().indexOf(phrase.toLowerCase(), firstIndex + phrase.length);
      
      // If the same phrase appears again within 40 chars
      if (secondIndex > 0 && (secondIndex - firstIndex) < 40) {
        // Take everything before the second occurrence and what comes after the repeated section
        const repetitionEndIndex = findRepetitionEndIndex(fixedResponse, secondIndex);
        
        if (repetitionEndIndex > secondIndex) {
          fixedResponse = 
            fixedResponse.substring(0, secondIndex).trim() + 
            fixedResponse.substring(repetitionEndIndex).trim();
        } else {
          // If we can't find a good end point, just take the first sentence
          const sentences = fixedResponse.split(/[.!?]+/);
          if (sentences.length > 0 && sentences[0].length > 20) {
            fixedResponse = sentences[0].trim() + ". Could you tell me more about that?";
          } else {
            fixedResponse = "I'm interested in understanding your situation better. Could you share more?";
          }
        }
      }
    }
  }
  
  // If the response still has issues or became too short, use a fallback
  if (hasRepeatedContent(fixedResponse) || fixedResponse.length < 20) {
    return "I'd like to understand what you're going through. Could you share more about your situation?";
  }
  
  return fixedResponse;
};

/**
 * Find the end index of a repetition
 */
function findRepetitionEndIndex(text: string, startIndex: number): number {
  // This is a simplified algorithm to find where repetition likely ends
  const nextPunctuation = text.substring(startIndex).search(/[.!?]/);
  
  if (nextPunctuation > 0) {
    return startIndex + nextPunctuation + 1; // Include the punctuation
  }
  
  // If no punctuation found, look for the next sentence starter
  const nextCapital = text.substring(startIndex).search(/\s[A-Z]/);
  
  if (nextCapital > 0) {
    return startIndex + nextCapital; // End before the next sentence
  }
  
  // Fallback - end after 50 chars or end of string
  return Math.min(startIndex + 50, text.length);
}

/**
 * Calculate similarity between two strings
 * Using a simplified version of Levenshtein distance ratio
 */
function calculateStringSimilarity(a: string, b: string): number {
  if (a.length === 0 || b.length === 0) return 0;
  if (a === b) return 1;
  
  // If one string contains the other
  if (a.includes(b) || b.includes(a)) {
    return Math.min(a.length, b.length) / Math.max(a.length, b.length);
  }
  
  // Simplified word overlap
  const wordsA = a.split(/\s+/).filter(w => w.length > 3);
  const wordsB = b.split(/\s+/).filter(w => w.length > 3);
  
  let matches = 0;
  for (const wordA of wordsA) {
    if (wordsB.some(wordB => wordB === wordA)) {
      matches++;
    }
  }
  
  return matches / Math.max(wordsA.length, wordsB.length);
}

/**
 * Handle specific health hallucination case
 */
export const handleHealthHallucination = (
  responseText: string,
  conversationHistory: string[]
): {
  isHealthHallucination: boolean;
  correctedResponse: string;
} => {
  // Check for health hallucination pattern
  const hasHealthPattern = /we've been focusing on health|dealing with health|focusing on health/i.test(responseText);
  
  // Check if health was actually mentioned in conversation history
  const healthMentioned = conversationHistory.some(msg => 
    /health|medical|doctor|sick|ill|wellness/i.test(msg)
  );
  
  // If pattern exists but health wasn't mentioned, it's a hallucination
  if (hasHealthPattern && !healthMentioned) {
    return {
      isHealthHallucination: true,
      correctedResponse: "I'm here to listen. What's been going on for you recently?"
    };
  }
  
  // No health hallucination detected
  return {
    isHealthHallucination: false,
    correctedResponse: responseText
  };
};
