
/**
 * Entity extraction utilities for hallucination detection
 */

import { isCommonWord } from './similarity-utils';

/**
 * Extract key topics from user input
 * Enhanced with additional pattern matching
 */
export const extractTopicsFromInput = (userInput: string): string[] => {
  const topics: string[] = [];
  
  // Look for key phrases that indicate topics
  const keyPhrases = [
    { pattern: /(?:worried|anxious|anxiety) about ([\w\s]+)/i, type: 'anxiety' },
    { pattern: /(?:sad|depressed|down) about ([\w\s]+)/i, type: 'mood' },
    { pattern: /(?:problem|issue|trouble) with ([\w\s]+)/i, type: 'problem' },
    { pattern: /(?:upset|concerned|frustrated) (?:with|about) ([\w\s]+)/i, type: 'concern' },
    { pattern: /(?:happy|excited|thrilled) about ([\w\s]+)/i, type: 'positive' },
    { pattern: /my ([\w]+) (?:is|has|have|seems)/i, type: 'subject' }
  ];
  
  // Extract matches
  for (const { pattern, type } of keyPhrases) {
    const match = userInput.match(pattern);
    if (match && match[1]) {
      topics.push(match[1].trim());
    }
  }
  
  // If no matches, try to extract important nouns or phrases
  if (topics.length === 0) {
    // Attempt to identify key objects or subjects in the input
    // This is a simplified approach - ideally would use proper NLP
    const words = userInput.split(/\s+/);
    const importantPhrases = [];
    
    // Group potential noun phrases (simplified version)
    for (let i = 0; i < words.length; i++) {
      // Skip very short words and common words
      if (words[i].length <= 3 || isCommonWord(words[i])) continue;
      
      // Check for noun phrases (e.g., "cute girl", "rough day")
      if (i < words.length - 1 && !isCommonWord(words[i+1])) {
        importantPhrases.push(`${words[i]} ${words[i+1]}`);
      } else {
        importantPhrases.push(words[i]);
      }
    }
    
    // Add the most likely important phrases
    topics.push(...importantPhrases.slice(0, 2));
  }
  
  return topics;
};

/**
 * Extract candidate entities from text
 * Very simplified NER - in a real implementation, use a proper NLP library
 */
export const extractEntities = (text: string): string[] => {
  const entities: string[] = [];
  
  // Simple approach: extract capitalized phrases and potential entities
  const words = text.split(/\s+/);
  let currentEntity = '';
  
  for (const word of words) {
    // Clean up word
    const cleanWord = word.replace(/[.,;!?()]/g, '');
    
    // Skip short words and common stopwords
    if (cleanWord.length < 2 || isCommonWord(cleanWord)) {
      if (currentEntity) {
        entities.push(currentEntity.trim());
        currentEntity = '';
      }
      continue;
    }
    
    // Check if word begins with capital letter
    if (cleanWord.length > 0 && cleanWord[0] === cleanWord[0].toUpperCase()) {
      if (currentEntity) {
        currentEntity += ' ' + cleanWord;
      } else {
        currentEntity = cleanWord;
      }
    } else {
      if (currentEntity) {
        entities.push(currentEntity.trim());
        currentEntity = '';
      }
    }
  }
  
  // Add the last entity if there is one
  if (currentEntity) {
    entities.push(currentEntity.trim());
  }
  
  // Add dates, numbers, and other specific entities
  const datePattern = /\b(\d{1,2}\/\d{1,2}\/\d{2,4}|\d{4}|\d{1,2}\/\d{1,2})\b/g;
  const dateMatches = text.match(datePattern) || [];
  entities.push(...dateMatches);
  
  // Add specific phrases that often lead to factual claims
  const specificPhrases = extractSpecificPhrases(text);
  entities.push(...specificPhrases);
  
  return [...new Set(entities)]; // Remove duplicates
};

/**
 * Extract specific phrases that often lead to factual claims
 */
export const extractSpecificPhrases = (text: string): string[] => {
  const phrases: string[] = [];
  
  // Extract phrases after "you mentioned" or similar
  const referencePattern = /(?:you mentioned|you told me|you said) (?:that|how|about)? ([\w\s]+?)(?:\.|\,|;|$)/gi;
  let match;
  
  while ((match = referencePattern.exec(text)) !== null) {
    if (match[1] && match[1].trim().length > 3) {
      phrases.push(match[1].trim());
    }
  }
  
  return phrases;
};

/**
 * Extract all n-gram phrases from text
 */
export const extractPhrases = (text: string, minWords: number): string[] => {
  const phrases: string[] = [];
  const words = text.split(/\s+/);
  
  // Generate n-grams
  for (let n = minWords; n <= Math.min(8, words.length); n++) {
    for (let i = 0; i <= words.length - n; i++) {
      const phrase = words.slice(i, i + n).join(' ').toLowerCase();
      if (phrase.length > 10) { // Only consider substantial phrases
        phrases.push(phrase);
      }
    }
  }
  
  return phrases;
};

/**
 * Helper: Is this entity likely a factual claim?
 */
export const isLikelyFactualClaim = (entity: string): boolean => {
  // Names, dates, numbers, and specific entities are likely factual claims
  return (
    entity.length > 2 && 
    (
      /^\d+$/.test(entity) || // Pure number
      /^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(entity) || // Date
      (entity[0] === entity[0].toUpperCase() && !isCommonWord(entity)) // Capitalized non-common word
    )
  );
};
