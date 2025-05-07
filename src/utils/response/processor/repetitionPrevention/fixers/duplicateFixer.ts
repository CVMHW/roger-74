/**
 * Functions for fixing duplicate sentences and content
 */

/**
 * Fix duplicate sentences
 */
export function fixDuplicateSentences(text: string): string {
  // Split into sentences
  const sentences = text.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
  
  // Keep track of sentence signatures to avoid duplicates with slight variations
  const sentenceSignatures = new Set<string>();
  const uniqueSentences: string[] = [];
  
  for (const sentence of sentences) {
    // Create a simplified signature for comparison
    const signature = sentence.toLowerCase()
      .replace(/[.,!?;:"']|\b(a|an|the|is|are|was|were|be|being|been|have|has|had)\b/g, '')
      .trim();
    
    // If we haven't seen this signature, keep the sentence
    if (!sentenceSignatures.has(signature)) {
      uniqueSentences.push(sentence);
      sentenceSignatures.add(signature);
    }
  }
  
  return uniqueSentences.join(' ');
}
