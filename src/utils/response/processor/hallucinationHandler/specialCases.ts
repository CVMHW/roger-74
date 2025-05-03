
/**
 * Special case handlers for specific hallucination patterns
 */

/**
 * Checks if a response contains repeated content, which is a sign of model confusion
 */
export const hasRepeatedContent = (responseText: string): boolean => {
  // Check for various repetition patterns
  const repetitionPatterns = [
    /I hear (you'?re|you are) dealing with I hear (you'?re|you are) dealing with/i,
    /I hear (you'?re|you are) dealing with you may have indicated/i,
    /I remember (you|your|we) I remember (you|your|we)/i,
    /you (mentioned|said|told me) you (mentioned|said|told me)/i,
    /(I hear|It sounds like) you('re| are) (dealing with|feeling) (I hear|It sounds like) you('re| are)/i,
    /you may have indicated Just a/i,
    /dealing with you may have indicated/i,
    /It seems like you shared that ([^.]{5,50})\. (I hear|It sounds like) you/i,
    // Check for sentences that have exact duplicates
    /([\w\s',]{15,})\s+\1/i,
    // Shared pattern detection
    /It seems like you shared that/i
  ];
  
  for (const pattern of repetitionPatterns) {
    if (pattern.test(responseText)) {
      return true;
    }
  }
  
  // Extract sentences and check for near-duplicates
  const sentences = responseText.split(/[.!?]+\s/).filter(s => s.trim().length > 0);
  for (let i = 0; i < sentences.length - 1; i++) {
    for (let j = i + 1; j < sentences.length; j++) {
      const similarity = calculateSimilarity(sentences[i], sentences[j]);
      if (similarity > 0.8 && sentences[i].length > 15) {
        return true;
      }
    }
  }
  
  return false;
};

/**
 * Simple similarity calculation between two strings
 */
const calculateSimilarity = (str1: string, str2: string): number => {
  const words1 = str1.toLowerCase().split(/\s+/);
  const words2 = str2.toLowerCase().split(/\s+/);
  
  const commonWords = words1.filter(word => words2.includes(word));
  return commonWords.length / Math.max(words1.length, words2.length);
};

/**
 * Specifically checks if the response has the problematic "It seems like you shared that" pattern
 */
export const hasSharedThatPattern = (responseText: string): boolean => {
  return /It seems like you shared that/i.test(responseText);
};

/**
 * Checks for invalid mention references that don't match conversation history
 */
export const hasInvalidMentionReference = (responseText: string, conversationHistory: string[]): boolean => {
  // Check for references to previous messages that don't exist
  const mentionPatterns = [
    /you mentioned ([^,.]+)/i,
    /you said ([^,.]+)/i,
    /you told me ([^,.]+)/i,
    /earlier you shared ([^,.]+)/i,
    /previously you noted ([^,.]+)/i
  ];
  
  // Nothing to check against if there's no history
  if (!conversationHistory || conversationHistory.length === 0) {
    // If there's no history but the response claims there was, that's a problem
    for (const pattern of mentionPatterns) {
      if (pattern.test(responseText)) {
        return true;
      }
    }
    return false;
  }
  
  // For each pattern, extract what was supposedly mentioned and check if it's in the history
  for (const pattern of mentionPatterns) {
    const matches = responseText.match(pattern);
    if (matches && matches[1]) {
      const supposedMention = matches[1].toLowerCase();
      // Check if this is actually in the history
      const historyHasMention = conversationHistory.some(
        msg => msg.toLowerCase().includes(supposedMention)
      );
      
      if (!historyHasMention) {
        return true; // Found an invalid reference
      }
    }
  }
  
  return false;
};

/**
 * Fixes repeated content in a response
 */
export const fixRepeatedContent = (responseText: string): string => {
  // First fix the critical patterns
  let fixedResponse = responseText;
  
  // Fix repetitive "I hear you're dealing with" pattern
  fixedResponse = fixedResponse.replace(
    /I hear (you'?re|you are) dealing with I hear (you'?re|you are) dealing with/i,
    "I hear you're dealing with"
  );
  
  // Fix "I hear you're dealing with you may have indicated" pattern
  fixedResponse = fixedResponse.replace(
    /I hear (you'?re|you are) dealing with you may have indicated/i,
    "I hear you're dealing with"
  );
  
  // Fix "It seems like you shared that X. I hear you're" pattern
  fixedResponse = fixedResponse.replace(
    /It seems like you shared that ([^.]{5,50})\. (I hear|It sounds like) you/i,
    "I hear you"
  );
  
  // Fix the problematic "It seems like you shared that" pattern completely
  fixedResponse = fixedResponse.replace(
    /It seems like you shared that ([^.]+)\./i,
    "I understand you're talking about $1."
  );
  
  // Remove all instances of "you may have indicated"
  fixedResponse = fixedResponse.replace(/you may have indicated/gi, "");
  
  // Deduplicate sentences by splitting, filtering unique, and rejoining
  const sentences = fixedResponse.split(/(?<=[.!?])\s+/)
    .filter(s => s.trim().length > 0);
  
  const uniqueSentences: string[] = [];
  for (const sentence of sentences) {
    let isDuplicate = false;
    for (const existing of uniqueSentences) {
      if (calculateSimilarity(sentence, existing) > 0.8) {
        isDuplicate = true;
        break;
      }
    }
    
    if (!isDuplicate) {
      uniqueSentences.push(sentence);
    }
  }
  
  fixedResponse = uniqueSentences.join(' ');
  
  return fixedResponse;
};

/**
 * Checks for false health topic hallucinations and fixes them
 */
export const handleHealthHallucination = (
  responseText: string, 
  conversationHistory: string[]
): { isHealthHallucination: boolean; correctedResponse: string } => {
  // Check if the response mentions health topics
  const hasHealthMention = /we've been focusing on health|dealing with health|focusing on health/i.test(responseText);
  
  // Check if the conversation history actually contains health topics
  const hasHealthInHistory = conversationHistory.some(msg => 
    /health|medical|doctor|sick|ill|wellness|disease|symptom|hospital|clinic/i.test(msg)
  );
  
  // If there's a mention of health topics without actual history, it's a hallucination
  if (hasHealthMention && !hasHealthInHistory) {
    // Replace the health topic reference with a more general statement
    const correctedResponse = responseText
      .replace(
        /we've been focusing on health|dealing with health|focusing on health/gi, 
        "what you've been sharing"
      )
      .replace(
        /our discussion about health|our health conversation|health concerns we discussed/gi,
        "what you've mentioned"
      );
    
    return {
      isHealthHallucination: true,
      correctedResponse
    };
  }
  
  // No health hallucination detected
  return {
    isHealthHallucination: false,
    correctedResponse: responseText
  };
};
