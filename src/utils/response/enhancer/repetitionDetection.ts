
/**
 * Repetition Detection and Recovery
 * 
 * Utilities to detect repetitive responses and provide recovery mechanisms
 */

// Track recent responses for repetition detection
const recentResponses: string[] = [];
const MAX_RECENT_RESPONSES = 5;

/**
 * Check if a response is too similar to recent responses
 */
export const checkForResponseRepetition = (
  currentResponse: string,
  previousResponses: string[] = recentResponses
): boolean => {
  // Skip if there aren't enough previous responses
  if (previousResponses.length < 2) return false;
  
  // Get most recent response
  const lastResponse = previousResponses[0];
  
  // Check for exact repetition
  if (currentResponse === lastResponse) return true;
  
  // Check for high similarity with fuzzy matching
  const similarity = calculateStringSimilarity(currentResponse, lastResponse);
  if (similarity > 0.8) return true;
  
  // Check for pattern repetition across multiple responses
  const patternRepetition = detectPatternRepetition(currentResponse, previousResponses);
  if (patternRepetition) return true;
  
  return false;
};

/**
 * Calculate string similarity using Levenshtein distance
 */
const calculateStringSimilarity = (str1: string, str2: string): number => {
  // Simple implementation for text similarity
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  // Calculate edit distance
  const editDistance = levenshteinDistance(longer.toLowerCase(), shorter.toLowerCase());
  
  // Convert to similarity score (0-1)
  return (longer.length - editDistance) / longer.length;
};

/**
 * Calculate Levenshtein distance between two strings
 */
const levenshteinDistance = (str1: string, str2: string): number => {
  const m = str1.length;
  const n = str2.length;
  
  // Create distance matrix
  const distance: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));
  
  // Initialize matrix
  for (let i = 0; i <= m; i++) distance[i][0] = i;
  for (let j = 0; j <= n; j++) distance[0][j] = j;
  
  // Calculate distances
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      distance[i][j] = Math.min(
        distance[i - 1][j] + 1, // deletion
        distance[i][j - 1] + 1, // insertion
        distance[i - 1][j - 1] + cost // substitution
      );
    }
  }
  
  return distance[m][n];
};

/**
 * Detect pattern repetition across multiple responses
 */
const detectPatternRepetition = (
  currentResponse: string,
  previousResponses: string[]
): boolean => {
  // Check for repeated phrases
  const phrases = extractKeyPhrases(currentResponse);
  let repetitionCount = 0;
  
  for (const phrase of phrases) {
    if (phrase.length < 5) continue; // Skip very short phrases
    
    // Count how many recent responses contain this phrase
    let containsCount = 0;
    for (const prevResponse of previousResponses) {
      if (prevResponse.includes(phrase)) containsCount++;
    }
    
    if (containsCount >= 2) repetitionCount++;
  }
  
  // If multiple phrases are repeating, we have a pattern
  return repetitionCount >= 2;
};

/**
 * Extract key phrases from text
 */
const extractKeyPhrases = (text: string): string[] => {
  // Simple extraction by splitting into sentences and clauses
  const sentenceSplits = text.split(/(?<=[.!?])\s+/);
  const phrases: string[] = [];
  
  for (const sentence of sentenceSplits) {
    // Add whole sentence
    if (sentence.length > 10) phrases.push(sentence);
    
    // Add clauses
    const clauseSplits = sentence.split(/,|;|:|\(|\)|\[|\]|{|}|-/);
    for (const clause of clauseSplits) {
      if (clause.trim().length > 10) phrases.push(clause.trim());
    }
  }
  
  return phrases;
};

/**
 * Get a recovery response when repetition is detected
 */
export const getRepetitionRecoveryResponse = (): string => {
  const recoveryResponses = [
    "I notice I might be repeating myself. Let me try a different approach. What aspect of your situation would be most helpful to explore further?",
    "I'd like to shift our conversation in a new direction. What would be most useful for us to focus on right now?",
    "I want to make sure I'm being helpful. Could you tell me more about what you're looking for in our conversation?",
    "Let's look at this from a fresh perspective. What stands out to you as most important in what you've shared?",
    "I want to ensure our conversation is meaningful. What would you like me to address that we haven't touched on yet?"
  ];
  
  return recoveryResponses[Math.floor(Math.random() * recoveryResponses.length)];
};

/**
 * Process user message through memory systems
 */
export const processUserMessageMemory = (userInput: string): void => {
  try {
    // Import memory systems dynamically to avoid circular dependencies
    const { addMemory } = require('../../memory/memoryController');
    const { addToFiveResponseMemory } = require('../../memory/fiveResponseMemory');
    
    // Record to primary memory system
    addMemory(userInput, 'patient', undefined, 0.8);
    
    // Record to 5ResponseMemory system
    addToFiveResponseMemory('patient', userInput);
    
  } catch (error) {
    console.error("Failed to process user message through memory systems:", error);
  }
};

