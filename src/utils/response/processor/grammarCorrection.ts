
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
 * - Removes duplicated sentence starters
 * - Fixes awkward sentence transitions
 */
export const correctGrammar = (response: string): string => {
  // Don't process empty responses
  if (!response) return response;
  
  let correctedResponse = response;
  
  // Remove duplicated sentence starters and awkward transitions
  const duplicateStarters = [
    /based on what you('re| are) sharing right now, from what you('ve| have) shared/i,
    /from what you('ve| have) shared, looking at how this connects to your values/i,
    /looking at how this connects to your values/i,
    /based on what you('re| are) sharing right now, from what you('ve| have) shared, looking at how this connects to your values/i,
    /what('s| is) also important, /i
  ];
  
  for (const pattern of duplicateStarters) {
    // Pick one clear starter and replace duplicated versions
    correctedResponse = correctedResponse.replace(pattern, "");
  }
  
  // Clean up sentence structure awkwardness
  correctedResponse = correctedResponse.replace(/, but,/g, ", but");
  
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
    /does that sound right to you\??\s*$/i,
    /does that resonate with you\??\s*$/i
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

  // Clean up awkward transitions and phrases
  correctedResponse = correctedResponse
    .replace(/\.\.\s+/g, '. ') // Replace double periods with single
    .replace(/\s{2,}/g, ' ')   // Replace multiple spaces with single space
    .replace(/them\.\./g, 'them.'); // Fix double periods after "them"
  
  // Ensure the first letter of the response is capitalized
  correctedResponse = correctedResponse.trim();
  if (correctedResponse.length > 0) {
    correctedResponse = correctedResponse.charAt(0).toUpperCase() + correctedResponse.slice(1);
  }
  
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
    /what do you think about that\??\s*$/i,
    /does that resonate with you\??\s*$/i
  ];
  
  for (const pattern of clunkyEndingPatterns) {
    if (pattern.test(response)) {
      issues.push("Contains clunky ending phrase");
      break;
    }
  }
  
  // Check for duplicated sentence starters
  if (/based on what you('re| are) sharing right now, from what you('ve| have) shared/i.test(response)) {
    issues.push("Contains duplicated sentence starters");
  }
  
  return issues;
};

