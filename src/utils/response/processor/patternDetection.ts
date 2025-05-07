/**
 * Pattern Detection Module for Response Processor
 * 
 * Detects patterns in responses to prevent repetition and enhance variety
 * ENHANCED with logarithmic pattern detection for more natural responses
 */

import { calculateStringSimilarity } from '../../hallucinationPrevention/detector/similarity-utils';

/**
 * Detect repetitive patterns in responses
 * Now with enhanced logarithmic similarity detection
 */
export const detectPatterns = (
  currentResponse: string,
  previousResponses: string[] = []
): {
  isRepetitive: boolean;
  repetitionScore: number;
  enhancedResponse?: string;
} => {
  // Initialize result
  const result = {
    isRepetitive: false,
    repetitionScore: 0,
    enhancedResponse: undefined as string | undefined
  };
  
  // If we don't have any previous responses, there can't be repetition
  if (!previousResponses || previousResponses.length === 0) {
    return result;
  }
  
  // Common repetitive phrases that might indicate patterns
  const repetitivePatterns = [
    /I notice I may have been repeating myself/i,
    /It seems like you shared that/i,
    /I'd like to focus specifically on/i,
    /I hear you('re| are) feeling .+\. I hear you('re| are) feeling/i,
    /Would you like to tell me more\? Would you like to tell me more\?/i,
    // NEW: Enhanced pattern detection for robotic-sounding phrases
    /(Based on what you're sharing[,.!?]?\s*){2,}/i,
    /(From what you've shared[,.!?]?\s*){2,}/i,
    /(I hear what you're sharing[,.!?]?\s*){2,}/i,
    /Based on what you're sharing[,.!?\s]+Based on what/i,
    /From what you've shared[,.!?\s]+From what/i,
    /I hear[,.!?\s]+I hear/i
  ];
  
  // Check current response for these patterns
  for (const pattern of repetitivePatterns) {
    if (pattern.test(currentResponse)) {
      // Apply exponential penalty for repetitive phrases using log function
      // log2(2) = 1, log2(4) = 2, log2(8) = 3, making penalties increasingly severe
      result.repetitionScore += Math.log2(4) * 0.5;
      
      // Generate an enhanced version that fixes the repetition
      if (!result.enhancedResponse) {
        result.enhancedResponse = fixRepetitivePattern(currentResponse, pattern);
      }
    }
  }
  
  // Check for formulaic beginnings with advanced similarity detection
  const formulaicBeginnings = detectFormulaicBeginnings(currentResponse);
  if (formulaicBeginnings.hasFormulaicBeginning) {
    // Apply logarithmic penalty
    result.repetitionScore += Math.log2(formulaicBeginnings.count + 1) * 0.4;
    
    // Set enhanced response if we found a way to improve it
    if (formulaicBeginnings.enhancedResponse) {
      result.enhancedResponse = formulaicBeginnings.enhancedResponse;
    }
  }
  
  // Check if the current response is too similar to any previous responses
  // Using logarithmic similarity scoring for more natural results
  let highestSimilarity = 0;
  let mostSimilarResponse = '';
  
  for (const prevResponse of previousResponses) {
    const similarity = calculateAdvancedSimilarity(currentResponse, prevResponse);
    if (similarity > highestSimilarity) {
      highestSimilarity = similarity;
      mostSimilarResponse = prevResponse;
    }
  }
  
  // Apply logarithmic penalty based on similarity score
  // As similarity approaches 1, penalty increases dramatically
  if (highestSimilarity > 0.7) { // High similarity threshold
    result.repetitionScore += Math.log2(1 + highestSimilarity * 5) * 0.8;
    
    // If we haven't already enhanced the response, create a varied alternative
    if (!result.enhancedResponse && mostSimilarResponse) {
      result.enhancedResponse = generateVariation(currentResponse, mostSimilarResponse);
    }
  }
  
  // Set isRepetitive flag if repetition score is high enough
  if (result.repetitionScore >= 1.0) {
    result.isRepetitive = true;
  }
  
  return result;
};

/**
 * Fix a specific repetitive pattern in a response
 */
const fixRepetitivePattern = (response: string, pattern: RegExp): string => {
  // Replace the repetitive pattern with a non-repetitive version
  return response.replace(pattern, (match) => {
    // For multi-phrase repetitions, keep only the first occurrence
    if (/(Based on|From what|I hear).+(Based on|From what|I hear)/i.test(match)) {
      const firstPhraseMatch = match.match(/(Based on[^,.!?]+|From what[^,.!?]+|I hear[^,.!?]+)/i);
      if (firstPhraseMatch) {
        return firstPhraseMatch[0];
      }
    }
    
    // For simple direct repetitions
    if (match.includes('Would you like to tell me more?')) {
      return 'Would you like to tell me more?';
    }
    
    // For feeling repetitions
    if (/I hear you('re| are) feeling .+\. I hear you('re| are) feeling/i.test(match)) {
      const feelingMatch = match.match(/I hear you('re| are) feeling ([^.!?]+)/i);
      if (feelingMatch && feelingMatch[2]) {
        return `I hear you're feeling ${feelingMatch[2]}`;
      }
    }
    
    // Default: just return the first half
    const words = match.split(/\s+/);
    return words.slice(0, Math.ceil(words.length / 2)).join(' ');
  });
};

/**
 * Calculate advanced similarity between two texts using a logarithmic approach
 * for more natural similarity detection
 */
const calculateAdvancedSimilarity = (text1: string, text2: string): number => {
  // Basic length check as optimization
  if (Math.abs(text1.length - text2.length) > text1.length * 0.5) {
    return 0;
  }
  
  // Convert to lowercase and split into words
  const words1 = text1.toLowerCase().split(/\s+/);
  const words2 = text2.toLowerCase().split(/\s+/);
  
  // Skip common function words to focus on content
  const skipWords = new Set([
    'the', 'a', 'an', 'in', 'on', 'at', 'to', 'of', 'for', 'with', 'by',
    'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had',
    'do', 'does', 'did', 'can', 'could', 'will', 'would', 'should', 'may',
    'i', 'you', 'he', 'she', 'it', 'we', 'they', 'this', 'that'
  ]);
  
  // Filter out common words
  const contentWords1 = words1.filter(w => !skipWords.has(w) && w.length > 2);
  const contentWords2 = words2.filter(w => !skipWords.has(w) && w.length > 2);
  
  // Count matching words with logarithmic weighting
  let matchScore = 0;
  const uniqueWords1 = new Set(contentWords1);
  
  for (const word of uniqueWords1) {
    if (contentWords2.includes(word)) {
      // Words that appear in both texts contribute to similarity
      // Use log function to make each additional match worth less
      matchScore += 1 / Math.log2(contentWords2.filter(w => w === word).length + 2);
    }
  }
  
  // Calculate similarity ratio with logarithmic normalization
  const maxPossibleScore = Math.min(uniqueWords1.size, new Set(contentWords2).size);
  return maxPossibleScore > 0 ? matchScore / maxPossibleScore : 0;
};

/**
 * Detect formulaic beginnings that make Roger sound robotic
 */
const detectFormulaicBeginnings = (response: string): {
  hasFormulaicBeginning: boolean;
  count: number;
  enhancedResponse?: string;
} => {
  const result = {
    hasFormulaicBeginning: false,
    count: 0,
    enhancedResponse: undefined as string | undefined
  };
  
  const formulaicPhrases = [
    /Based on what you're sharing/i,
    /From what you've shared/i,
    /I hear what you're sharing/i,
    /I hear you're feeling/i,
    /It sounds like you're/i
  ];
  
  let enhancedResponse = response;
  
  // Count occurrences of formulaic phrases
  for (const phrase of formulaicPhrases) {
    const matches = response.match(phrase);
    if (matches && matches.length > 0) {
      result.count += matches.length;
      
      // If we have more than one occurrence, flag it
      if (matches.length > 1) {
        result.hasFormulaicBeginning = true;
        
        // Replace all but the first occurrence
        let firstFound = false;
        enhancedResponse = enhancedResponse.replace(phrase, (match) => {
          if (!firstFound) {
            firstFound = true;
            return match;
          }
          return '';
        });
      }
    }
  }
  
  // Check for overly formal beginning
  if (
    /^(Based on what you're sharing|From what you've shared|I hear what you're sharing)/i.test(response) &&
    result.count > 0 && 
    Math.random() < 0.7 // 70% chance to remove formulaic beginning for variety
  ) {
    result.hasFormulaicBeginning = true;
    
    // Remove the beginning phrase
    enhancedResponse = enhancedResponse
      .replace(/^Based on what you're sharing,?\s*/i, '')
      .replace(/^From what you've shared,?\s*/i, '')
      .replace(/^I hear what you're sharing,?\s*/i, '')
      .replace(/^I understand that,?\s*/i, '');
      
    // Ensure sentence starts with capital letter
    if (enhancedResponse[0]) {
      enhancedResponse = enhancedResponse[0].toUpperCase() + enhancedResponse.slice(1);
    }
  }
  
  if (result.hasFormulaicBeginning) {
    result.enhancedResponse = enhancedResponse;
  }
  
  return result;
};

/**
 * Generate a variation of a response to avoid repetition
 */
const generateVariation = (currentResponse: string, similarResponse: string): string => {
  // If the response is already short, just return it
  if (currentResponse.length < 30) return currentResponse;
  
  // 1. Try removing formulaic beginnings first
  const withoutFormulaicBeginning = currentResponse
    .replace(/^(Based on what you're sharing|From what you've shared|I hear what you're sharing|I understand that),?\s*/i, '');
  
  if (withoutFormulaicBeginning !== currentResponse) {
    // Capitalize the first letter
    return withoutFormulaicBeginning[0].toUpperCase() + withoutFormulaicBeginning.slice(1);
  }
  
  // 2. Try reordering sentences if there are multiple
  const sentences = currentResponse.split(/(?<=[.!?])\s+/);
  if (sentences.length > 1) {
    // Reorder sentences by moving the first sentence to the end
    const reordered = [...sentences.slice(1), sentences[0]].join(' ');
    return reordered;
  }
  
  // 3. Add variety by changing the opening phrase
  const openingPhrases = [
    "I'm curious about ",
    "Let's explore ",
    "Tell me more about ",
    "I'd like to understand ",
    "Let's focus on "
  ];
  
  const randomOpening = openingPhrases[Math.floor(Math.random() * openingPhrases.length)];
  return randomOpening + currentResponse.replace(/^(I'm wondering about|Tell me about|Let's explore|I'd like to understand)/i, '');
};
