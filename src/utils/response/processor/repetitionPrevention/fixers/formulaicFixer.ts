/**
 * Functions for fixing formulaic repetition patterns
 */

/**
 * Fix formulaic beginnings
 */
export function fixFormulaicBeginnings(text: string): string {
  // Common formulaic phrases that make Roger sound repetitive
  const formulaicPhrases = [
    'Based on what you\'re sharing',
    'From what you\'ve shared',
    'I hear what you\'re sharing',
    'I hear you\'re feeling',
    'It sounds like',
    'I understand that'
  ];
  
  // Track which phrases we've seen
  const seenPhrases = new Set<string>();
  let processedText = text;
  
  for (const phrase of formulaicPhrases) {
    // Create case-insensitive regex
    const regex = new RegExp(phrase, 'gi');
    const matches = processedText.match(regex);
    
    if (matches && matches.length > 1) {
      // Only keep the first occurrence
      let isFirst = true;
      processedText = processedText.replace(regex, (match) => {
        if (isFirst) {
          isFirst = false;
          seenPhrases.add(phrase.toLowerCase());
          return match;
        }
        return ''; // Remove other occurrences
      });
    } else if (matches && matches.length === 1) {
      seenPhrases.add(phrase.toLowerCase());
    }
  }
  
  return processedText.replace(/\s{2,}/g, ' ').trim();
}
