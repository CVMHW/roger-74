
/**
 * Special cases for hallucination detection and handling
 * ENHANCED with pattern detection and personality variation
 */

import { addResponseVariety } from '../../personalityVariation';
import { getRandomPersonality } from '../../spontaneityGenerator';

/**
 * Check for the "It seems like you shared that" problematic pattern
 */
export const hasSharedThatPattern = (responseText: string): boolean => {
  return /It seems like you shared that/i.test(responseText);
};

/**
 * Detect if response has obvious repetition patterns
 */
export const hasRepeatedContent = (responseText: string): boolean => {
  // Check for doubled phrases (common hallucination pattern)
  const phrases = responseText.toLowerCase().match(/[a-z]{5,} [a-z]{2,} [a-z]{2,}/g) || [];
  
  for (let i = 0; i < phrases.length; i++) {
    for (let j = i + 1; j < phrases.length; j++) {
      if (phrases[i] === phrases[j]) {
        return true;
      }
    }
  }
  
  // Check for repeated sentence structures
  const sentenceStarts = responseText.split(/[.!?]\s+/).map(s => {
    const words = s.trim().split(/\s+/).slice(0, 3).join(' ').toLowerCase();
    return words;
  });
  
  // If we have consecutive sentences starting the same way (except very short ones)
  for (let i = 0; i < sentenceStarts.length - 1; i++) {
    if (sentenceStarts[i].length > 10 && sentenceStarts[i] === sentenceStarts[i + 1]) {
      return true;
    }
  }
  
  // Check for repeated acknowledgment patterns
  const acknowledgmentPatterns = [
    /I hear you're feeling .+\. I hear you're feeling/i,
    /It sounds like you're .+\. It sounds like you're/i,
    /I understand that you .+\. I understand that you/i
  ];
  
  for (const pattern of acknowledgmentPatterns) {
    if (pattern.test(responseText)) {
      return true;
    }
  }
  
  // Check for repeated reflective questions
  const reflectiveQuestions = [
    /what do you think\?.*what do you think\?/i,
    /how does that feel\?.*how does that feel\?/i,
    /would you like to share more\?.*would you like to share more\?/i
  ];
  
  for (const pattern of reflectiveQuestions) {
    if (pattern.test(responseText)) {
      return true;
    }
  }
  
  // New check: Look for very short sentences repeated
  const shortSentences = responseText.match(/[^.!?]{5,30}[.!?]/g) || [];
  for (let i = 0; i < shortSentences.length; i++) {
    for (let j = i + 1; j < shortSentences.length; j++) {
      if (shortSentences[i] === shortSentences[j]) {
        return true;
      }
    }
  }
  
  return false;
};

/**
 * Fixes repeated content in a response with enhanced personality variation
 */
export const fixRepeatedContent = (responseText: string, userInput: string): string => {
  // First, let's completely replace the "It seems like you shared that" pattern
  let fixedResponse = responseText;
  
  // Replace standard problematic patterns
  if (hasSharedThatPattern(fixedResponse)) {
    // Extract the topic being referenced
    const match = fixedResponse.match(/It seems like you shared that ([^.]+)\./i);
    const topic = match ? match[1] : "";
    
    // Special case for bar/social anxiety scenarios
    if (userInput.toLowerCase().includes("spill") && 
        (userInput.toLowerCase().includes("bar") || userInput.toLowerCase().includes("girl"))) {
      fixedResponse = fixedResponse.replace(
        /It seems like you shared that [^.]+\./i,
        "That sounds like an uncomfortable social situation."
      );
    } else if (topic && userInput.toLowerCase().includes(topic.toLowerCase())) {
      // If the topic is actually in the user input, replace with a natural acknowledgment
      fixedResponse = fixedResponse.replace(
        /It seems like you shared that [^.]+\./i,
        `I understand you're talking about ${topic}.`
      );
    } else {
      // Generic replacement for other cases
      fixedResponse = fixedResponse.replace(
        /It seems like you shared that [^.]+\./i,
        "Thanks for sharing that with me."
      );
    }
  }
  
  // Replace repetitive acknowledgment patterns
  const acknowledgmentPatterns = [
    { regex: /(I hear|It sounds like) you('re| are) feeling (.+)\. \1 you\2 feeling/i, groupIndex: 3 },
    { regex: /I understand that you (.+)\. I understand that you/i, groupIndex: 1 },
    { regex: /It seems that you (.+)\. It seems that you/i, groupIndex: 1 },
  ];
  
  for (const pattern of acknowledgmentPatterns) {
    const match = fixedResponse.match(pattern.regex);
    if (match) {
      const content = match[pattern.groupIndex];
      // Replace with a single acknowledgment
      fixedResponse = fixedResponse.replace(
        pattern.regex, 
        `I hear you're feeling ${content}.`
      );
    }
  }
  
  // Split into sentences to remove duplicates
  const sentences = fixedResponse.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
  const uniqueSentences: string[] = [];
  
  for (const sentence of sentences) {
    let isDuplicate = false;
    
    for (const existingSentence of uniqueSentences) {
      if (calculateSentenceSimilarity(sentence, existingSentence) > 0.7) {
        isDuplicate = true;
        break;
      }
    }
    
    if (!isDuplicate) {
      uniqueSentences.push(sentence);
    }
  }
  
  // Recombine unique sentences
  let cleanedResponse = uniqueSentences.join(" ");
  
  // Apply personality variation to the fixed response for extra diversity
  // Use high spontaneity level (80) to ensure significant variation
  return addResponseVariety(cleanedResponse, userInput, 5, 80, 75);
};

/**
 * Calculate similarity between sentences for deduplication
 */
const calculateSentenceSimilarity = (sentence1: string, sentence2: string): number => {
  const words1 = sentence1.toLowerCase().split(/\s+/);
  const words2 = sentence2.toLowerCase().split(/\s+/);
  
  // Simple word overlap
  const shortestLength = Math.min(words1.length, words2.length);
  let matchCount = 0;
  
  for (let i = 0; i < shortestLength; i++) {
    if (words1[i] === words2[i]) {
      matchCount++;
    }
  }
  
  return matchCount / shortestLength;
};

/**
 * Check for and handle problematic health hallucinations
 */
export const handleHealthHallucination = (
  responseText: string,
  conversationHistory: string[]
): { isHealthHallucination: boolean; correctedResponse: string } => {
  // Check if response contains health claims
  const hasHealthClaim = /cure|treatment|medical condition|diagnos|therapy|medic|symptom|health condition|disorder/i.test(responseText);
  
  // Only proceed if there's a potential health claim
  if (!hasHealthClaim) {
    return { isHealthHallucination: false, correctedResponse: responseText };
  }
  
  // Look for disclaimer pattern
  const hasDisclaimer = /I('m| am) not a (medical professional|doctor|healthcare provider)|This is not medical advice/i.test(responseText);
  
  // If health related but no disclaimer, this is likely a hallucination
  if (!hasDisclaimer) {
    // Add appropriate disclaimer
    const corrected = responseText + " I should note that I'm not a healthcare professional, and it would be important to consult with a qualified medical provider for any health concerns.";
    
    return { isHealthHallucination: true, correctedResponse: corrected };
  }
  
  return { isHealthHallucination: false, correctedResponse: responseText };
};

/**
 * Check if references to prior conversation are valid
 */
export const hasInvalidMentionReference = (
  responseText: string, 
  conversationHistory: string[]
): boolean => {
  // Look for phrases that indicate reference to shared information
  const referencePhrases = [
    /as you (mentioned|said) (earlier|before|previously)/i,
    /you told me (earlier|before|previously) (about|that)/i,
    /as we (discussed|talked about) (earlier|before|previously)/i,
    /from our (previous|earlier|last) conversation/i,
    /continuing (our|from where we) (discussion|conversation)/i,
    /last time (we talked|we spoke|you mentioned)/i
  ];
  
  // Check for references
  for (const phrase of referencePhrases) {
    if (phrase.test(responseText)) {
      // This is a reference to prior conversation
      
      // If conversation history is very short, this is definitely invalid
      if (conversationHistory.length < 3) {
        return true;
      }
      
      // For longer conversations, we would need more sophisticated checking
      // but for safety we'll return false (meaning potentially valid)
      return false;
    }
  }
  
  // No reference phrases found
  return false;
};
