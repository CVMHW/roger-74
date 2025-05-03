
/**
 * Special Cases for Hallucination Handler
 * 
 * Handles specific types of hallucinations that need special treatment
 */

import { calculateSimilarity } from './utils';

/**
 * Handle health-related hallucinations
 */
export const handleHealthHallucination = (
  response: string,
  userInput: string
): { isHealthHallucination: boolean; correctedResponse: string } => {
  // Check for medical diagnosis patterns
  const hasMedicalDiagnosis = /you have|you're experiencing|sounds like you have|you might have|you could have|you are suffering from/i.test(response);
  
  // Check for health topic patterns without user mentioning them
  const hasHealthTopic = /health|medical condition|diagnosis|medical issue|health condition/i.test(response);
  const userMentionedHealth = /health|medical|doctor|sick|ill|wellness|condition|diagnosis/i.test(userInput);
  
  const isHealthHallucination = (hasHealthTopic && !userMentionedHealth) || hasMedicalDiagnosis;
  
  if (isHealthHallucination) {
    // Add heavy hedging to any potential medical interpretations
    let correctedResponse = response.replace(
      /(you have|you're experiencing|sounds like you have|you might have|you could have|you are suffering from)\s+([^.,]*)/gi,
      "what you're describing might be similar to $2, though I'm not qualified to diagnose"
    );
    
    // Replace mentions of health topics with more general terms
    correctedResponse = correctedResponse
      .replace(/health condition/gi, "situation")
      .replace(/medical (issue|condition)/gi, "challenge")
      .replace(/health issues/gi, "difficulties");
    
    return { isHealthHallucination: true, correctedResponse };
  }
  
  return { isHealthHallucination: false, correctedResponse: response };
};

/**
 * Check if response has repeated content
 */
export const hasRepeatedContent = (response: string): boolean => {
  // Split into sentences
  const sentences = response.split(/(?<=[.!?])\s+/);
  
  // If fewer than 2 sentences, no repetition
  if (sentences.length < 2) return false;
  
  // Check for exact duplicates
  const uniqueSentences = new Set(sentences);
  if (uniqueSentences.size < sentences.length) {
    return true;
  }
  
  // Check for high similarity between sentences
  for (let i = 0; i < sentences.length; i++) {
    for (let j = i + 1; j < sentences.length; j++) {
      if (calculateSimilarity(sentences[i], sentences[j]) > 0.7) {
        return true;
      }
    }
  }
  
  return false;
};

/**
 * Fix repeated content in responses
 */
export const fixRepeatedContent = (response: string): string => {
  const sentences = response.split(/(?<=[.!?])\s+/);
  
  // If fewer than 2 sentences, return as is
  if (sentences.length < 2) return response;
  
  // Remove exact duplicates
  const uniqueSentences = Array.from(new Set(sentences));
  
  // Check for similar sentences and remove them
  const filteredSentences = [];
  for (let i = 0; i < uniqueSentences.length; i++) {
    let isDuplicate = false;
    
    // Check against already filtered sentences
    for (let j = 0; j < filteredSentences.length; j++) {
      if (calculateSimilarity(uniqueSentences[i], filteredSentences[j]) > 0.7) {
        isDuplicate = true;
        break;
      }
    }
    
    if (!isDuplicate) {
      filteredSentences.push(uniqueSentences[i]);
    }
  }
  
  return filteredSentences.join(' ');
};

/**
 * Check if text has a "you shared that" pattern
 */
export const hasSharedThatPattern = (text: string): boolean => {
  return /you (shared|mentioned|said|told me) that/i.test(text);
};
