/**
 * Special case detection for hallucination prevention
 * 
 * Handles specific patterns that indicate potential hallucinations
 */

/**
 * Check for repeated content in responses which often indicates hallucinations
 */
export const hasRepeatedContent = (text: string): boolean => {
  // Check for common repetition patterns
  const repetitionPatterns = [
    /I hear (you'?re|you are) dealing with I hear (you'?re|you are) dealing with/i,
    /I hear (you'?re|you are) dealing with you may have indicated/i,
    /I remember (you|your|we) I remember (you|your|we)/i,
    /you (mentioned|said|told me) you (mentioned|said|told me)/i,
    /(I hear|It sounds like) you('re| are) (dealing with|feeling) (I hear|It sounds like) you('re| are)/i,
    /you may have indicated Just a/i,
    /dealing with you may have indicated/i,
    /I hear you're dealing with you mentioned/i,
    /you're dealing with I hear you're dealing with/i,
    /you mentioned I'm jumping in/i
  ];
  
  // Check each pattern
  for (const pattern of repetitionPatterns) {
    if (pattern.test(text)) {
      return true;
    }
  }
  
  // Check for multiple "I hear" instances which can indicate repetition
  const iHearMatches = text.match(/I hear/gi);
  if (iHearMatches && iHearMatches.length > 1) {
    return true;
  }
  
  // Check for sentences that appear multiple times
  const sentences = text.split(/[.!?]+\s/).filter(s => s.trim().length > 0);
  const uniqueSentences = new Set(sentences.map(s => s.trim().toLowerCase()));
  
  // If we have repeating sentences, that's a strong signal of repetition
  if (uniqueSentences.size < sentences.length) {
    return true;
  }
  
  // Check for phrases that appear multiple times (4+ word phrases)
  const phrases = [];
  for (let i = 0; i < sentences.length; i++) {
    const words = sentences[i].split(/\s+/);
    for (let j = 0; j <= words.length - 4; j++) {
      phrases.push(words.slice(j, j + 4).join(' ').toLowerCase());
    }
  }
  
  // Count phrase occurrences
  const phraseCounts: Record<string, number> = {};
  for (const phrase of phrases) {
    if (phrase.length > 10) { // Only check substantial phrases
      phraseCounts[phrase] = (phraseCounts[phrase] || 0) + 1;
    }
  }
  
  // If any substantial phrase appears more than once, that's repetition
  return Object.values(phraseCounts).some(count => count > 1);
};

/**
 * Check for "you mentioned" hallucinations with no actual mention
 */
export const hasInvalidMentionReference = (
  responseText: string,
  conversationHistory: string[]
): boolean => {
  // Look for specific mention patterns
  const mentionMatches = responseText.match(/you mentioned ([^.!?]+)/i);
  
  if (mentionMatches && mentionMatches[1]) {
    const allegedMention = mentionMatches[1].toLowerCase();
    
    // Don't flag very generic mentions
    if (allegedMention.includes('concern') || 
        allegedMention.includes('feeling') || 
        allegedMention.includes('experience') ||
        allegedMention.length < 5) {
      return false;
    }
    
    // Check if this content actually exists in conversation history
    const mentionExists = conversationHistory.some(msg => 
      msg.toLowerCase().includes(allegedMention.substring(0, 
        Math.min(allegedMention.length, 10)))
    );
    
    if (!mentionExists) {
      return true;
    }
  }
  
  return false;
};

/**
 * Check for and fix the specific "dealing with I hear you're dealing with" pattern
 */
export const fixDealingWithPattern = (responseText: string): string => {
  const pattern = /dealing with I hear you're dealing with/i;
  
  if (pattern.test(responseText)) {
    return responseText.replace(pattern, "dealing with");
  }
  
  return responseText;
};

/**
 * Detects and corrects the "you may have indicated" pattern
 */
export const fixIndicatedPattern = (responseText: string): string => {
  const pattern = /you may have indicated/i;
  
  if (pattern.test(responseText)) {
    // Replace the entire response with a safer alternative
    return "I'd like to understand what you're experiencing. Could you share more about what's going on?";
  }
  
  return responseText;
};

/**
 * Fix repeated content in a response
 * This function removes or corrects repetitive phrases
 */
export const fixRepeatedContent = (responseText: string): string => {
  // Split into sentences for analysis
  const sentences = responseText.split(/[.!?]+\s/).filter(s => s.trim().length > 0);
  
  // Keep only unique sentences (avoiding repetition)
  const uniqueSentences: string[] = [];
  const addedPhrases = new Set<string>();
  
  for (const sentence of sentences) {
    const normalized = sentence.trim().toLowerCase();
    
    // Skip if too similar to an existing sentence
    let isDuplicate = false;
    for (const existing of uniqueSentences) {
      // Simple similarity check
      const existingNormalized = existing.toLowerCase();
      const commonWords = normalized.split(/\s+/).filter(word => 
        word.length > 3 && existingNormalized.includes(word)
      ).length;
      
      // If there's substantial overlap, consider it a duplicate
      if (commonWords > 3 || (commonWords > 0 && existingNormalized.length / normalized.length > 0.7)) {
        isDuplicate = true;
        break;
      }
    }
    
    if (!isDuplicate) {
      uniqueSentences.push(sentence);
    }
  }
  
  // Fix specific patterns
  let result = uniqueSentences.join(". ");
  if (!result.endsWith(".")) result += ".";
  
  // Fix any remaining "I hear you're dealing with" repetitions
  result = result.replace(/I hear (you'?re|you are) dealing with I hear (you'?re|you are) dealing with/gi, 
                          "I hear you're dealing with");
  
  // Fix doubled statements about what user said
  result = result.replace(/you (mentioned|said|told me).*?you (mentioned|said|told me)/gi, 
                          (match) => match.split("you")[0] + "you mentioned");
  
  return result;
};

/**
 * Handle potential health-related hallucinations
 * This is especially important for not giving false medical information or claims
 */
export const handleHealthHallucination = (
  responseText: string,
  conversationHistory: string[]
): { 
  isHealthHallucination: boolean; 
  correctedResponse: string;
} => {
  // Default response
  const result = {
    isHealthHallucination: false,
    correctedResponse: responseText
  };
  
  // Check for health diagnosis patterns that might be hallucinations
  const diagnosisPatterns = [
    /you (may|might|could) have (a|an|the) ([a-z\s]+) (condition|disorder|disease|diagnosis)/i,
    /sounds like you (have|might have|may have|are experiencing) ([a-z\s]+) (disorder|condition|disease)/i,
    /based on your symptoms/i,
    /I (can diagnose|can tell you have|believe you have|think you might have)/i,
    /your (symptoms|condition) (appear|seem|look|sound) (like|consistent with|typical of)/i,
    /this (could|may|might) be (a sign of|related to|connected to) ([a-z\s]+) (condition|disorder|disease)/i
  ];
  
  // Check if response contains any diagnosis patterns
  for (const pattern of diagnosisPatterns) {
    if (pattern.test(responseText)) {
      result.isHealthHallucination = true;
      result.correctedResponse = "I understand you're sharing something about your health. Since I'm not a medical professional, I can't provide diagnoses or medical advice. Would you like to talk more about how you're feeling or what you're experiencing?";
      return result;
    }
  }
  
  // Check for medication recommendations which would be inappropriate
  const medicationPatterns = [
    /you (should|could|might want to|may) (try|consider|take|use) ([a-z\s]+) (medication|drug|pill|supplement)/i,
    /(recommend|suggest) (taking|using|trying) ([a-z\s]+) for/i,
    /(medication|drug|treatment) (called|known as|such as) ([a-z]+)/i,
    /have you (tried|considered|thought about) (taking|using) ([a-z\s]+)/i
  ];
  
  for (const pattern of medicationPatterns) {
    if (pattern.test(responseText)) {
      result.isHealthHallucination = true;
      result.correctedResponse = "I hear you're talking about something health-related. As a peer support companion, I can't provide medical advice or medication recommendations. Would it be helpful to talk about how you're feeling emotionally about this situation?";
      return result;
    }
  }
  
  return result;
};
