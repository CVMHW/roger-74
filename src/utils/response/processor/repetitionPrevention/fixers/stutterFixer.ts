
/**
 * Functions for fixing stutter patterns
 */

/**
 * Fix stutter patterns (immediate repetition of words/phrases)
 */
export function fixStutterPatterns(text: string): string {
  // Fix word repetition (e.g., "the the")
  let result = text.replace(/\b(\w+)\s+\1\b/g, '$1');
  
  // Fix phrase repetition (e.g., "I hear I hear")
  const commonPhrases = [
    'I hear', 
    'you are', 
    'you\'re', 
    'that is', 
    'this is', 
    'there is',
    'based on',
    'from what'
  ];
  
  for (const phrase of commonPhrases) {
    const escapedPhrase = phrase.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`${escapedPhrase}\\s+${escapedPhrase}`, 'gi');
    result = result.replace(regex, phrase);
  }
  
  return result;
}
