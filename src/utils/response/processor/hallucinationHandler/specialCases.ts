
/**
 * Special Cases for Hallucination Handler
 * 
 * Handles specific types of hallucinations that need special treatment
 */

/**
 * Handle health-related hallucinations
 */
export const handleHealthHallucination = (
  response: string,
  userInput: string
): string => {
  // Remove any definitive medical diagnoses or interpretations
  let modified = response;
  
  // Check for medical diagnosis patterns
  if (/you have|you're experiencing|sounds like you have|you might have|you could have|you are suffering from/i.test(response)) {
    // Add heavy hedging to any potential medical interpretations
    modified = modified.replace(
      /(you have|you're experiencing|sounds like you have|you might have|you could have|you are suffering from)\s+([^.,]*)/gi,
      "what you're describing might be similar to $2, though I'm not qualified to diagnose"
    );
  }
  
  return modified;
};

/**
 * Check if response has repeated content
 */
export const hasRepeatedContent = (response: string): boolean => {
  // Simple check for repeated sentence patterns
  const sentences = response.split(/(?<=[.!?])\s+/);
  
  // If fewer than 2 sentences, no repetition
  if (sentences.length < 2) return false;
  
  // Check for exact duplicates
  const uniqueSentences = new Set(sentences);
  if (uniqueSentences.size < sentences.length) {
    return true;
  }
  
  // Check for high similarity between sentences (simplified)
  for (let i = 0; i < sentences.length; i++) {
    for (let j = i + 1; j < sentences.length; j++) {
      if (stringSimilarity(sentences[i], sentences[j]) > 0.7) {
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
      if (stringSimilarity(uniqueSentences[i], filteredSentences[j]) > 0.7) {
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
 * Calculate string similarity (simplified version)
 */
const stringSimilarity = (str1: string, str2: string): number => {
  // Convert to lowercase
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  
  // Split into words
  const words1 = new Set(s1.split(/\s+/));
  const words2 = new Set(s2.split(/\s+/));
  
  // Find intersection
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  
  // Calculate Jaccard similarity
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
};
