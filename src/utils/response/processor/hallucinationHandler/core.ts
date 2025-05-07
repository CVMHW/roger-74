/**
 * Hallucination Handler Core functionality
 * 
 * Provides advanced prevention of hallucinations in Roger's responses
 */

import { detectHarmfulRepetitions, fixHarmfulRepetitions } from '../repetitionPrevention';

/**
 * Primary entry point for hallucination prevention
 */
export const handlePotentialHallucinations = (
  responseText: string,
  userInput: string,
  conversationHistory: string[] = []
): string => {
  console.log("HALLUCINATION HANDLER: Checking for potential hallucinations");
  
  // Step 1: Check for dangerous repetition patterns (highest priority)
  const { fixedResponse, hasRepetitionIssue } = fixDangerousRepetitionPatterns(responseText, userInput);
  
  // If we found and fixed repetition issues, apply additional checks to the fixed response
  let result = hasRepetitionIssue ? fixedResponse : responseText;
  
  // Step 2: Apply advanced repetition prevention
  const repetitionCheck = detectHarmfulRepetitions(result);
  if (repetitionCheck.hasRepetition) {
    console.log(`HALLUCINATION HANDLER: Detected harmful repetition (score: ${repetitionCheck.repetitionScore})`);
    result = fixHarmfulRepetitions(result);
  }
  
  // Step 3: Check for memory-related hallucinations
  result = handleMemoryHallucinations(result, conversationHistory);
  
  // Step 4: Check for health hallucinations
  result = handleHealthHallucination(result, userInput, conversationHistory);
  
  // Step 5: Check and fix false memory references in early conversation
  if (conversationHistory.length <= 2) {
    result = fixFalseMemoryReferences(result);
  }
  
  // Step 6: Check for repeated content using the existing repetition handler
  if (hasRepeatedContent(result)) {
    result = fixRepeatedContent(result, userInput);
  }
  
  return result;
};

/**
 * Fix memory-related hallucinations
 */
export const handleMemoryHallucinations = (
  responseText: string, 
  conversationHistory: string[] = []
): string => {
  // Apply memory hallucination fixes based on conversation context
  let fixedResponse = responseText;
  
  // New conversation check - any reference to past context is hallucination
  if (conversationHistory.length <= 2) {
    fixedResponse = fixedResponse
      .replace(/as we (discussed|talked about) earlier/gi, '')
      .replace(/you (mentioned|told me) earlier/gi, 'you just mentioned')
      .replace(/we've been (talking|discussing) about/gi, 'you mentioned')
      .replace(/from our previous (conversation|discussion)/gi, 'from what you shared');
  }
  
  // Check for hallucinated memory references like "you mentioned X" that don't exist
  if (!hasActualMemoryReference(conversationHistory, responseText)) {
    fixedResponse = fixedResponse
      .replace(/you (mentioned|said|told me|indicated) that/gi, 'it sounds like')
      .replace(/you've (talked|spoken) about/gi, 'you mentioned');
  }
  
  return fixedResponse;
};

/**
 * Fixes dangerous repetition patterns in responses
 */
export const fixDangerousRepetitionPatterns = (
  response: string,
  userInput: string
): { fixedResponse: string; hasRepetitionIssue: boolean } => {
  // Simple repetition detection and fixing
  const sentences = response.split(/(?<=[.!?])\s+/);
  let hasRepetitionIssue = false;
  
  // If we have multiple sentences, check for exact duplicates
  if (sentences.length > 1) {
    const uniqueSentences = Array.from(new Set(sentences));
    
    // If we found and removed duplicates, rejoin the sentences
    if (uniqueSentences.length < sentences.length) {
      hasRepetitionIssue = true;
      return { 
        fixedResponse: uniqueSentences.join(' '),
        hasRepetitionIssue: true
      };
    }
  }
  
  // Check for dangerous repetition patterns
  const repetitionPatterns = [
    /I hear (you'?re|you are) dealing with I hear (you'?re|you are) dealing with/i,
    /I hear (you'?re|you are) dealing with you may have indicated/i,
    /I remember (you|your|we) I remember (you|your|we)/i,
    /you (mentioned|said|told me) you (mentioned|said|told me)/i,
    /(I hear|It sounds like) you('re| are) (dealing with|feeling) (I hear|It sounds like) you('re| are)/i,
    /you may have indicated Just a/i,
    /dealing with you may have indicated/i,
    // NEW: Advanced repetition patterns
    /Based on what you're sharing,?\s*Based on what you're sharing/i,
    /From what you've shared,?\s*From what you've shared/i,
    /I hear what you're sharing,?\s*I hear what you're sharing/i,
    /Based on what you're sharing.*?Based on what/i,
    /From what you've shared.*?From what you've/i
  ];
  
  let fixedResponse = response;
  
  for (const pattern of repetitionPatterns) {
    if (pattern.test(fixedResponse)) {
      fixedResponse = fixedResponse.replace(pattern, (match) => {
        hasRepetitionIssue = true;
        // Extract the first meaningful phrase from the repetition
        const parts = match.split(/\s+/);
        let firstHalfEndIndex = Math.floor(parts.length / 2);
        if (firstHalfEndIndex < 3) firstHalfEndIndex = 3; // Ensure we have at least 3 words
        const firstHalf = parts.slice(0, firstHalfEndIndex).join(' ');
        return firstHalf;
      });
    }
  }
  
  // Final check for other repetition patterns
  if (/Based on what you('re| are) sharing[\s,]+based on/i.test(fixedResponse)) {
    fixedResponse = fixedResponse.replace(
      /Based on what you('re| are) sharing[\s,]+based on/i, 
      'Based on what you\'re sharing'
    );
    hasRepetitionIssue = true;
  }
  
  // Fix exact repetitions of these entire phrases
  const exactPhrases = [
    "Based on what you're sharing,",
    "From what you've shared,",
    "I hear what you're sharing,"
  ];
  
  for (const phrase of exactPhrases) {
    if (fixedResponse.includes(`${phrase} ${phrase}`)) {
      fixedResponse = fixedResponse.replace(`${phrase} ${phrase}`, phrase);
      hasRepetitionIssue = true;
    }
  }
  
  return {
    fixedResponse,
    hasRepetitionIssue
  };
};

/**
 * Handle health-related hallucinations
 */
export const handleHealthHallucination = (
  responseText: string,
  userInput: string,
  conversationHistory: string[] = []
): string => {
  // If response falsely claims to have been discussing health topics
  if (/we've been discussing your health|focusing on your health|talking about your health/i.test(responseText)) {
    // Check if health was actually discussed
    const healthTerms = /health|medical|doctor|illness|condition|symptom|pain|medicine|treatment|hospital|clinic|disease/i;
    
    const wasHealthDiscussed = conversationHistory.some(msg => healthTerms.test(msg));
    
    if (!wasHealthDiscussed) {
      return responseText
        .replace(/we've been discussing your health/gi, "based on what you're sharing")
        .replace(/focusing on your health/gi, "focusing on what you've mentioned")
        .replace(/talking about your health/gi, "discussing what you've shared");
    }
  }
  
  return responseText;
};

/**
 * Fix any false memory references in early conversation
 */
export const fixFalseMemoryReferences = (responseText: string): string => {
  return responseText
    .replace(/(we|you|I) (discussed|talked about|mentioned) earlier/gi, "you mentioned")
    .replace(/in our previous conversation/gi, "just now")
    .replace(/last time we spoke/gi, "just now")
    .replace(/you've told me before/gi, "you've mentioned")
    .replace(/I remember/gi, "I understand");
};

/**
 * Check if memory references actually match conversation history
 */
const hasActualMemoryReference = (
  conversationHistory: string[],
  responseText: string
): boolean => {
  // Extract claimed memories from response
  const memoryMatches = responseText.match(/you (mentioned|said|told me|indicated) that ([^.!?]+)/i);
  
  if (!memoryMatches || memoryMatches.length < 3) {
    return true; // No specific memory claim found
  }
  
  // Get the claimed memory content
  const claimedMemory = memoryMatches[2].toLowerCase().trim();
  
  // Skip very short claimed memories as they're likely generic
  if (claimedMemory.split(/\s+/).length < 3) {
    return true;
  }
  
  // Find key terms from the claimed memory
  const keyTerms = claimedMemory
    .split(/\s+/)
    .filter(w => w.length > 3)
    .map(w => w.replace(/[.,;:!?]/, ''));
  
  // Check if ANY of these key terms appear in the conversation history
  return conversationHistory.some(msg => 
    keyTerms.some(term => msg.toLowerCase().includes(term))
  );
};

/**
 * Check if response has repeated content that needs fixing
 */
export const hasRepeatedContent = (responseText: string): boolean => {
  // Check for exactly repeated sentences
  const sentences = responseText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Need at least 3 sentences to check for repetition patterns
  if (sentences.length < 3) {
    return false;
  }
  
  // Look for exact repetitions
  for (let i = 0; i < sentences.length; i++) {
    for (let j = i + 1; j < sentences.length; j++) {
      const similarity = calculateSimilarity(sentences[i], sentences[j]);
      if (similarity > 0.85) {
        return true;
      }
    }
  }
  
  // Check for repeated phrases
  const phrases: Record<string, number> = {};
  const words = responseText.toLowerCase().split(/\s+/);
  
  for (let i = 0; i <= words.length - 4; i++) {
    const phrase = words.slice(i, i + 4).join(' ');
    phrases[phrase] = (phrases[phrase] || 0) + 1;
    
    // If we find the same 4-word phrase repeated, it's a sign of repetition
    if (phrases[phrase] > 1 && phrase.length > 10) {
      return true;
    }
  }
  
  return false;
};

/**
 * Calculate similarity between two text strings
 */
const calculateSimilarity = (str1: string, str2: string): number => {
  // Check length first
  if (Math.abs(str1.length - str2.length) > 10) {
    return 0;
  }
  
  // Simple word overlap for basic similarity
  const words1 = str1.toLowerCase().split(/\s+/);
  const words2 = str2.toLowerCase().split(/\s+/);
  
  // Count matching words
  let matches = 0;
  for (const word of words1) {
    if (word.length > 3 && words2.includes(word)) {
      matches++;
    }
  }
  
  return matches / Math.max(words1.length, words2.length);
};

/**
 * Fix repeated content by keeping only unique sentences
 */
export const fixRepeatedContent = (responseText: string, userInput: string = ''): string => {
  // Split into sentences
  const sentences = responseText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Keep only sentences that aren't too similar to previous ones
  const uniqueSentences: string[] = [];
  
  for (const sentence of sentences) {
    let isDuplicate = false;
    
    for (const existingSentence of uniqueSentences) {
      const similarity = calculateSimilarity(sentence, existingSentence);
      if (similarity > 0.7) {
        isDuplicate = true;
        break;
      }
    }
    
    if (!isDuplicate) {
      uniqueSentences.push(sentence.trim());
    }
  }
  
  // Recombine the unique sentences
  return uniqueSentences.join(". ") + ".";
};
