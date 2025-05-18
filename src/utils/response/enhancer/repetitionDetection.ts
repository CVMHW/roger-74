
/**
 * Response Repetition Detection and Prevention
 *
 * Detects and prevents repetitive responses by tracking recent responses
 * and providing recovery mechanisms
 */

import { MemoryPiece } from '../../hallucinationPrevention/retrieval';
import { addMemory } from '../../memory/memoryController';

// Store recent responses
const recentResponses: string[] = [];
const MAX_RECENT_RESPONSES = 10; // Keep track of last 10 responses

/**
 * Check if a response is repetitive (too similar to recent responses)
 */
export const checkForResponseRepetition = (
  responseText: string,
  previousResponses: string[] = recentResponses
): boolean => {
  if (!responseText || responseText.length === 0) return false;
  if (previousResponses.length === 0) return false;

  // Check for exact duplication
  if (previousResponses.includes(responseText)) {
    return true;
  }

  // Check for high similarity (sentences in common)
  const responseSentences = responseText.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
  const repetitionThreshold = 0.7; // 70% similarity triggers repetition detection

  for (const prevResponse of previousResponses) {
    const prevSentences = prevResponse.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
    
    let sharedSentences = 0;
    for (const sentence of responseSentences) {
      if (sentence.length < 10) continue; // Ignore very short sentences
      
      if (prevSentences.some(prevSent => 
        prevSent.includes(sentence) || 
        sentence.includes(prevSent) || 
        getStringSimilarity(sentence, prevSent) > 0.8
      )) {
        sharedSentences++;
      }
    }
    
    const similarityRatio = 
      responseSentences.length > 0 
        ? sharedSentences / responseSentences.length 
        : 0;
    
    if (similarityRatio >= repetitionThreshold) {
      return true;
    }
  }

  return false;
};

/**
 * Get a recovery response when repetition is detected
 */
export const getRepetitionRecoveryResponse = (): string => {
  const recoveryResponses = [
    "I notice I've been saying similar things. Let me try a different approach. What aspect of this situation would you like to explore more deeply?",
    "I want to add something new to our conversation. What parts of what we're discussing feel most important to you right now?",
    "Let's look at this from a fresh angle. What feelings come up for you when you think about this situation?",
    "I'd like to shift our perspective a bit. How do you imagine things might be different if you approached this situation differently?",
    "I want to make sure I'm being helpful. What would be most supportive for you to focus on right now?"
  ];
  
  return recoveryResponses[Math.floor(Math.random() * recoveryResponses.length)];
};

/**
 * Process user message and store in memory system
 */
export const processUserMessageMemory = (
  userMessage: string,
  importance: number = 0.7
): void => {
  if (!userMessage || userMessage.trim().length === 0) return;
  
  try {
    // Add to memory controller
    addMemory(userMessage, 'patient', undefined, importance);
  } catch (error) {
    console.error("Error processing user message for memory:", error);
  }
};

/**
 * Track a response to detect repetitions later
 */
export const trackResponse = (responseText: string): void => {
  if (!responseText || responseText.trim().length === 0) return;
  
  // Add to recent responses
  recentResponses.unshift(responseText);
  
  // Limit size of recent responses
  if (recentResponses.length > MAX_RECENT_RESPONSES) {
    recentResponses.pop();
  }
};

/**
 * Get string similarity between two strings (0-1)
 * Using Levenshtein distance calculation
 */
const getStringSimilarity = (str1: string, str2: string): number => {
  if (!str1 || !str2) return 0;
  if (str1 === str2) return 1;
  
  // Convert to lowercase for better comparison
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  
  // Calculate Levenshtein distance
  const track = Array(s2.length + 1).fill(null).map(() => 
    Array(s1.length + 1).fill(null));
  
  for (let i = 0; i <= s1.length; i += 1) {
    track[0][i] = i;
  }
  
  for (let j = 0; j <= s2.length; j += 1) {
    track[j][0] = j;
  }
  
  for (let j = 1; j <= s2.length; j += 1) {
    for (let i = 1; i <= s1.length; i += 1) {
      const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1, // deletion
        track[j - 1][i] + 1, // insertion
        track[j - 1][i - 1] + indicator // substitution
      );
    }
  }
  
  const distance = track[s2.length][s1.length];
  const maxLength = Math.max(s1.length, s2.length);
  
  return maxLength > 0 ? 1 - distance / maxLength : 1;
};
