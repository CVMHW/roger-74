
/**
 * Grammar Correction System
 * 
 * Fixes common grammar issues in Roger's responses to ensure consistency
 */

/**
 * Fixes grammar issues in Roger's responses
 * - Ensures proper capitalization
 * - Fixes comma usage
 * - Removes clunky phrases like "How does that sound to you?"
 */
export const correctGrammar = (response: string): string => {
  // Don't process empty responses
  if (!response) return response;
  
  let correctedResponse = response;
  
  // Fix capitalization after periods
  correctedResponse = correctedResponse.replace(/\.\s+([a-z])/g, (match, letter) => {
    return '. ' + letter.toUpperCase();
  });
  
  // Fix capitalization after question marks
  correctedResponse = correctedResponse.replace(/\?\s+([a-z])/g, (match, letter) => {
    return '? ' + letter.toUpperCase();
  });
  
  // Fix capitalization after exclamation points
  correctedResponse = correctedResponse.replace(/\!\s+([a-z])/g, (match, letter) => {
    return '! ' + letter.toUpperCase();
  });
  
  // Add missing commas before coordinating conjunctions between independent clauses
  correctedResponse = correctedResponse.replace(/(\s+)(and|but|or|nor|for|so|yet)(\s+)(?=[^,;.!?]*?[.!?])/g, ' $2, ');
  
  // Remove clunky ending phrases
  const clunkyEndings = [
    /how does that sound to you\??\s*$/i,
    /does that make sense\??\s*$/i,
    /what do you think about that\??\s*$/i,
    /how does that resonate with you\??\s*$/i,
    /does that sound right to you\??\s*$/i
  ];
  
  for (const pattern of clunkyEndings) {
    if (pattern.test(correctedResponse)) {
      correctedResponse = correctedResponse.replace(pattern, '');
      // Make sure the response still ends with proper punctuation
      if (!/[.!?]$/.test(correctedResponse)) {
        correctedResponse += '.';
      }
      break; // Only remove one ending phrase
    }
  }
  
  // Ensure the first letter of the response is capitalized
  correctedResponse = correctedResponse.charAt(0).toUpperCase() + correctedResponse.slice(1);
  
  return correctedResponse;
};

/**
 * Identifies and logs grammar issues for monitoring
 */
export const identifyGrammarIssues = (response: string): string[] => {
  const issues: string[] = [];
  
  // Check for capitalization issues after periods
  if (/\.\s+[a-z]/.test(response)) {
    issues.push("Missing capitalization after period");
  }
  
  // Check for missing commas before conjunctions
  if (/\s+(?:and|but|or|nor|for|so|yet)\s+(?=[^,;.!?]*?[.!?])/.test(response)) {
    issues.push("Missing comma before conjunction");
  }
  
  // Check for clunky endings
  const clunkyEndingPatterns = [
    /how does that sound to you\??\s*$/i,
    /does that make sense\??\s*$/i,
    /what do you think about that\??\s*$/i
  ];
  
  for (const pattern of clunkyEndingPatterns) {
    if (pattern.test(response)) {
      issues.push("Contains clunky ending phrase");
      break;
    }
  }
  
  return issues;
};
