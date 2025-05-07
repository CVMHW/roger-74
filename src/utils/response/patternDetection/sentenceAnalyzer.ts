
/**
 * Functions for analyzing sentence structure and patterns
 */

/**
 * Extract a simplified representation of sentence structure
 */
export const getSentenceStructure = (text: string): string[] => {
  // Split into sentences
  const sentences = text.split(/[.!?]\s+/);
  
  return sentences.map(sentence => {
    // Create a simple structural representation
    const words = sentence.toLowerCase().trim().split(/\s+/);
    
    if (words.length === 0) return '';
    
    let structure = '';
    
    // Add first word
    if (words.length > 0) structure += words[0] + ' ';
    
    // Add sentence length marker
    structure += `[${words.length}] `;
    
    // Add last two words if available
    if (words.length > 2) structure += words[words.length - 2] + ' ' + words[words.length - 1];
    else if (words.length > 1) structure += words[words.length - 1];
    
    return structure;
  });
};

/**
 * Calculate similarity between sentence structures
 */
export const calculateStructureSimilarity = (struct1: string[], struct2: string[]): number => {
  // Handle empty structures
  if (struct1.length === 0 || struct2.length === 0) return 0;
  
  // Count matching structures
  let matchCount = 0;
  const minLength = Math.min(struct1.length, struct2.length);
  
  for (let i = 0; i < minLength; i++) {
    if (struct1[i] === struct2[i]) {
      matchCount++;
    }
  }
  
  return matchCount / minLength;
};
