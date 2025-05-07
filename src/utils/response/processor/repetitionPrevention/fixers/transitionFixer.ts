
/**
 * Functions for cleaning up transitions between sentences
 */

/**
 * Clean up transitions for a smoother response
 */
export function cleanupTransitions(text: string): string {
  let result = text;
  
  // Fix potential grammatical issues from our repetition removal
  result = result.replace(/\s+([,.!?;:])/g, '$1'); // Fix spacing before punctuation
  result = result.replace(/\s{2,}/g, ' '); // Fix multiple spaces
  
  // Ensure sensible sentence structure
  const sentences = result.split(/(?<=[.!?])\s+/);
  const updatedSentences: string[] = [];
  
  for (let sentence of sentences) {
    // Skip empty sentences
    if (!sentence.trim()) continue;
    
    // Make sure sentence starts with a capital letter
    if (sentence[0]) {
      sentence = sentence[0].toUpperCase() + sentence.slice(1);
    }
    
    // Make sure sentence has proper ending punctuation
    if (!/[.!?]$/.test(sentence)) {
      sentence += '.';
    }
    
    updatedSentences.push(sentence);
  }
  
  return updatedSentences.join(' ');
}
