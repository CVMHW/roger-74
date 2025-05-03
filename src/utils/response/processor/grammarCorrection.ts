
/**
 * Grammar Correction System
 * 
 * Fixes common grammar issues in Roger's responses to ensure consistency
 * and maintains appropriate response length proportional to user input
 */

/**
 * Fixes grammar issues in Roger's responses
 * - Ensures proper capitalization
 * - Fixes comma usage
 * - Removes clunky phrases like "How does that sound to you?"
 * - Removes duplicated sentence starters
 * - Fixes awkward sentence transitions
 * - Controls response length to be proportional to user input
 */
export const correctGrammar = (response: string, userInput?: string): string => {
  // Don't process empty responses
  if (!response) return response;
  
  let correctedResponse = response;
  
  // Remove duplicated sentence starters and awkward transitions - this is now more aggressive
  const duplicateStarters = [
    /Based on what you('re| are) sharing right now,?\s*/i,
    /From what you('ve| have) shared,?\s*/i,
    /Looking at how this connects to your values,?\s*/i,
    /When we look at what truly matters here,?\s*/i,
    /What('s| is) also important,?\s*/i,
    /Related to this,?\s*/i,
    /Additionally,?\s*/i,
    /Another perspective is how this\s*/i,
    /Maybe there's a way\s*/i,
    /Considering how this situation relates to your life purpose\s*/i,
    /We could also consider\s*/i,
  ];
  
  // Find the first starter (if any) and remove all others
  let foundFirstStarter = false;
  for (const pattern of duplicateStarters) {
    if (pattern.test(correctedResponse)) {
      if (!foundFirstStarter) {
        foundFirstStarter = true;
      } else {
        // Remove all additional starters
        correctedResponse = correctedResponse.replace(pattern, "");
      }
    }
  }
  
  // If we have any of these starters at the beginning, let's remove them entirely
  // for a more direct approach, especially with short messages
  if (userInput && userInput.split(/\s+/).length < 20) {
    correctedResponse = duplicateStarters.reduce((result, pattern) => {
      return result.replace(pattern, "");
    }, correctedResponse);
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
  
  // Control response length based on user input if available
  if (userInput) {
    correctedResponse = adjustResponseLength(correctedResponse, userInput);
  }
  
  return correctedResponse;
};

/**
 * Adjusts response length to be proportional to user input
 * Aims for a ratio of approximately 1.2-2.0x the user's message length
 * for normal messages, with exceptions for critical content
 */
const adjustResponseLength = (response: string, userInput: string): string => {
  // Don't adjust response if it contains critical keywords
  if (containsCriticalKeywords(response)) {
    return response;
  }
  
  const userWords = userInput.split(/\s+/).filter(Boolean).length;
  const responseWords = response.split(/\s+/).filter(Boolean).length;
  
  // Target range: 1.2-2.0x user input length, with minimum of 5-10 words
  // This is tighter than before to ensure more concise responses
  const minWords = Math.max(5, Math.round(userWords * 1.2));
  const maxWords = Math.max(10, Math.round(userWords * 2.0));
  
  // If response is already in appropriate range, return as is
  if (responseWords >= minWords && responseWords <= maxWords) {
    return response;
  }
  
  // If response is too long, trim it
  if (responseWords > maxWords) {
    return shortenResponse(response, maxWords);
  }
  
  // If response is too short but still substantial, keep as is
  // We don't want to artificially lengthen responses
  return response;
};

/**
 * Shortens a response to the target word count while keeping it coherent
 * This version is more aggressive about shortening to match user brevity
 */
const shortenResponse = (response: string, targetWordCount: number): string => {
  const sentences = response.match(/[^.!?]+[.!?]+/g) || [];
  if (sentences.length <= 1) {
    return response; // Can't shorten a single sentence response easily
  }
  
  let shortened = "";
  let wordCount = 0;
  
  // Start with most important sentences (usually the first 1-2)
  // Keep adding sentences until we reach target word count
  for (let i = 0; i < sentences.length; i++) {
    const sentenceWords = sentences[i].split(/\s+/).filter(Boolean).length;
    
    // Always include first sentence
    if (i === 0) {
      shortened += sentences[i];
      wordCount += sentenceWords;
      continue;
    }
    
    // Check if adding this sentence would exceed target
    if (wordCount + sentenceWords > targetWordCount) {
      // If we only have one sentence so far, add this one too
      if (i === 1) {
        shortened += sentences[i];
      }
      break;
    }
    
    shortened += sentences[i];
    wordCount += sentenceWords;
    
    // Break if we've reached target word count
    if (wordCount >= targetWordCount) {
      break;
    }
  }
  
  return shortened.trim();
};

/**
 * Detects if message contains critical keywords that should not be shortened
 */
const containsCriticalKeywords = (text: string): boolean => {
  const criticalPatterns = [
    /suicid/i,
    /kill (myself|yourself|himself|herself|themselves)/i,
    /harm (myself|yourself|himself|herself|themselves)/i,
    /hurt (myself|yourself|himself|herself|themselves)/i,
    /emergency/i,
    /crisis/i,
    /immediate danger/i,
    /bleeding/i,
    /overdose/i,
    /poison/i
  ];
  
  return criticalPatterns.some(pattern => pattern.test(text));
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
  
  // Check if response is excessively long compared to latest user input
  const responseWords = response.split(/\s+/).filter(Boolean).length;
  issues.push(`Response length: ${responseWords} words`);
  
  return issues;
};
