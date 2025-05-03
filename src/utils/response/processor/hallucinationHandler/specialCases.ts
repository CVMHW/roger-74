
/**
 * Special cases for hallucination detection and handling
 */

/**
 * Checks if the response has repeated content
 * This is a sign of potential hallucination
 */
export const hasRepeatedContent = (responseText: string): boolean => {
  // Check for repeated phrases or sentences
  const phrases = responseText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // If we have fewer than 2 phrases, there can't be repetition
  if (phrases.length < 2) {
    return false;
  }
  
  // Look for similar phrases (where one contains the other)
  for (let i = 0; i < phrases.length; i++) {
    const phrase1 = phrases[i].trim().toLowerCase();
    if (phrase1.length < 5) continue; // Skip very short phrases
    
    for (let j = i + 1; j < phrases.length; j++) {
      const phrase2 = phrases[j].trim().toLowerCase();
      if (phrase2.length < 5) continue; // Skip very short phrases
      
      // Check if one phrase contains the other
      if (phrase1.includes(phrase2) || phrase2.includes(phrase1)) {
        return true;
      }
      
      // Check if there's significant word overlap (more than 70%)
      const words1 = phrase1.split(/\s+/);
      const words2 = phrase2.split(/\s+/);
      
      const commonWords = words1.filter(word => words2.includes(word));
      const overlapRatio = commonWords.length / Math.min(words1.length, words2.length);
      
      if (overlapRatio > 0.7) {
        return true;
      }
    }
  }
  
  return false;
};

/**
 * Fixes repeated content in a response
 */
export const fixRepeatedContent = (responseText: string): string => {
  const sentences = responseText.split(/([.!?]+)/).filter(s => s.trim().length > 0);
  const uniqueSentences: string[] = [];
  const addedContent = new Set<string>();
  
  for (const sentence of sentences) {
    const normalized = sentence.trim().toLowerCase();
    
    // Skip punctuation-only items
    if (/^[.!?]+$/.test(normalized)) {
      continue;
    }
    
    // Check if this content is similar to what we've already added
    let isDuplicate = false;
    for (const existing of addedContent) {
      if (normalized.includes(existing) || existing.includes(normalized)) {
        isDuplicate = true;
        break;
      }
    }
    
    if (!isDuplicate) {
      uniqueSentences.push(sentence);
      addedContent.add(normalized);
    }
  }
  
  // Reconstruct the response
  const fixedResponse = uniqueSentences.join('');
  return fixedResponse;
};

/**
 * Fixes the "dealing with" pattern repetition issue
 */
export const fixDealingWithPattern = (responseText: string): string => {
  // Fix repeated "dealing with" patterns
  let fixedText = responseText;
  
  // Fix the most common patterns
  fixedText = fixedText.replace(
    /I hear (you'?re|you are) dealing with I hear (you'?re|you are) dealing with/gi, 
    "I hear you're dealing with"
  );
  
  fixedText = fixedText.replace(
    /dealing with dealing with/gi,
    "dealing with"
  );
  
  // Fix bizarre concatenations 
  fixedText = fixedText.replace(
    /I hear you're dealing with you/gi,
    "I hear what you"
  );
  
  return fixedText;
};

/**
 * Fixes the "you may have indicated" pattern issue
 */
export const fixIndicatedPattern = (responseText: string): string => {
  // Fix the problematic patterns with "you may have indicated"
  let fixedText = responseText;
  
  // Replace the most problematic pattern
  fixedText = fixedText.replace(
    /you may have indicated Just a/gi,
    "you're having"
  );
  
  // Fix other variations
  fixedText = fixedText.replace(
    /you may have indicated/gi,
    "you mentioned"
  );
  
  return fixedText;
};

/**
 * Handles health topic hallucinations
 * Specifically targets the "we've been focusing on health" pattern
 */
export const handleHealthHallucination = (
  responseText: string, 
  conversationHistory: string[]
): {
  isHealthHallucination: boolean;
  correctedResponse: string;
} => {
  // Check for health topic hallucination patterns
  const healthPattern = /we've been focusing on health|dealing with health|focusing on health|talking about health|discussing health/i;
  
  // Check if the pattern exists in the response
  if (!healthPattern.test(responseText)) {
    return {
      isHealthHallucination: false,
      correctedResponse: responseText
    };
  }
  
  // Check if health was actually mentioned in conversation history
  const healthMentionedInHistory = conversationHistory.some(msg => 
    /health|medical|doctor|sick|ill|wellness|hospital|symptom|disease|condition|therapy|medicine|treatment/i.test(msg)
  );
  
  // If health was mentioned, this is not a hallucination
  if (healthMentionedInHistory) {
    return {
      isHealthHallucination: false,
      correctedResponse: responseText
    };
  }
  
  // This is a health hallucination, fix it
  console.log("HEALTH HALLUCINATION: Replacing false health reference");
  
  // Replace the health reference with a more general statement
  const correctedResponse = responseText.replace(
    healthPattern,
    "dealing with this situation"
  );
  
  return {
    isHealthHallucination: true,
    correctedResponse
  };
};

/**
 * Checks if the response contains invalid mentions of user content
 */
export const hasInvalidMentionReference = (
  responseText: string,
  conversationHistory: string[]
): boolean => {
  // Pattern for phrases like "you mentioned X" or "you said X"
  const mentionPattern = /you (mentioned|said|told me) (about |that |how |)([\w\s'"]+)/gi;
  
  let match;
  let hasInvalid = false;
  
  while ((match = mentionPattern.exec(responseText)) !== null) {
    const allegedContent = match[3].toLowerCase();
    
    // Skip very short or common phrases
    if (allegedContent.length < 5 || 
        /^(you|it|that|this|the|a|an|your|my|i|we|us|them)$/.test(allegedContent)) {
      continue;
    }
    
    // Check if this content actually appears in conversation history
    const contentAppears = conversationHistory.some(msg => 
      msg.toLowerCase().includes(allegedContent)
    );
    
    if (!contentAppears) {
      hasInvalid = true;
      break;
    }
  }
  
  return hasInvalid;
};
