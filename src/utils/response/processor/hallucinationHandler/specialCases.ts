
/**
 * Special case handlers for hallucination prevention
 */

/**
 * Handle health-related hallucinations
 */
export const handleHealthHallucination = (
  responseText: string,
  userInput: string
): {
  isHealthHallucination: boolean;
  correctedResponse: string;
} => {
  // Check for health-related false claims
  const healthPatterns = [
    /I can (diagnose|treat|prescribe|cure|heal)/i,
    /as a (doctor|medical professional|therapist|psychiatrist|psychologist)/i,
    /medical (advice|diagnosis|treatment)/i
  ];
  
  // Check if response contains health hallucinations
  const isHealthHallucination = healthPatterns.some(pattern => pattern.test(responseText));
  
  if (isHealthHallucination) {
    // Replace problematic claims with appropriate disclaimers
    let corrected = responseText
      .replace(/I can (diagnose|treat|prescribe|cure|heal)/gi, "I cannot $1")
      .replace(/as a (doctor|medical professional|therapist|psychiatrist|psychologist)/gi, "as a supportive listener, not a $1,")
      .replace(/medical (advice|diagnosis|treatment)/gi, "supportive conversation, not medical $1");
    
    // Add disclaimer if significant changes were made
    if (corrected !== responseText) {
      corrected = "I want to clarify that I'm here to listen and support you, not to provide medical advice. " + corrected;
    }
    
    return {
      isHealthHallucination: true,
      correctedResponse: corrected
    };
  }
  
  // No health hallucination detected
  return {
    isHealthHallucination: false,
    correctedResponse: responseText
  };
};

/**
 * Check if a response contains repeated content
 */
export const hasRepeatedContent = (responseText: string): boolean => {
  // Split into sentences
  const sentences = responseText.split(/(?<=[.!?])\s+/);
  
  // Check for duplicate sentences
  const uniqueSentences = new Set(sentences);
  if (uniqueSentences.size < sentences.length) {
    return true;
  }
  
  // Check for repeated phrases (3+ word phrases)
  const phrases: Record<string, number> = {};
  for (const sentence of sentences) {
    const words = sentence.split(/\s+/);
    for (let i = 0; i < words.length - 2; i++) {
      const phrase = `${words[i]} ${words[i+1]} ${words[i+2]}`.toLowerCase();
      phrases[phrase] = (phrases[phrase] || 0) + 1;
      if (phrases[phrase] > 1 && phrase.split(/\s+/).length >= 3) {
        return true;
      }
    }
  }
  
  return false;
};

/**
 * Fix repeated content in a response
 */
export const fixRepeatedContent = (responseText: string): string => {
  // Split into sentences
  const sentences = responseText.split(/(?<=[.!?])\s+/);
  
  // Remove duplicate sentences
  const uniqueSentences = Array.from(new Set(sentences));
  
  // Join and return
  return uniqueSentences.join(' ');
};

/**
 * Detect "you shared that" pattern in user statements
 */
export const hasSharedThatPattern = (text: string): boolean => {
  return /you (shared|mentioned|told me|indicated) that/i.test(text);
};
