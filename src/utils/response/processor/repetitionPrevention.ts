/**
 * Advanced Repetition Prevention System
 * 
 * This module uses computational linguistics techniques to identify and
 * prevent repetitive patterns in Roger's responses.
 */

import { calculateStringSimilarity, commonPrefix, isCommonWord } from '../../hallucinationPrevention/detector/similarity-utils';

/**
 * Detect if response has harmful repetitive patterns
 */
export const detectHarmfulRepetitions = (responseText: string): {
  hasRepetition: boolean;
  repetitionType: string;
  repetitionScore: number;
  segments: string[];
} => {
  // Initialize result
  const result = {
    hasRepetition: false,
    repetitionType: '',
    repetitionScore: 0,
    segments: [] as string[]
  };
  
  // Split into sentences for analysis
  const sentences = responseText.split(/(?<=[.!?])\s+/);
  
  // 1. Check for exact duplicate sentences
  const uniqueSentences = new Set(sentences);
  if (uniqueSentences.size < sentences.length) {
    result.hasRepetition = true;
    result.repetitionType = 'duplicate_sentences';
    result.repetitionScore = 1.0; // Highest severity
    result.segments = Array.from(uniqueSentences); // Keep only unique sentences
  }
  
  // 2. Check for repeated phrases with mathematical similarity
  // Use overlapping n-grams (3-5 words) to detect phrase repetitions
  const ngramSimilarities = computeNGramSimilarities(responseText);
  if (ngramSimilarities.highSimilarityFound) {
    result.hasRepetition = true;
    result.repetitionType = 'similar_phrases';
    result.repetitionScore = Math.max(result.repetitionScore, 0.8);
    result.segments = ngramSimilarities.segments;
  }
  
  // 3. Check for "stutter patterns" - immediate repetition of words/phrases
  const stutterRegex = /(\b\w+\b)(\s+\1\b){1,}/g;
  if (stutterRegex.test(responseText)) {
    result.hasRepetition = true;
    result.repetitionType = 'stutter';
    result.repetitionScore = Math.max(result.repetitionScore, 0.9);
  }
  
  // 4. Check for formulaic repetition like "Based on X... Based on X"
  const formulaicPhrases = [
    /Based on what (you('re| are)|you've been) (sharing|saying)/i,
    /From what you('ve| have) shared/i,
    /I hear (what|that) you('re| are) (sharing|saying)/i,
    /It sounds like you('re| are)/i
  ];
  
  let formulaicCount = 0;
  for (const pattern of formulaicPhrases) {
    const matches = responseText.match(pattern);
    if (matches && matches.length > 1) {
      formulaicCount += matches.length - 1;
      result.hasRepetition = true;
      result.repetitionType += ' formulaic';
      result.repetitionScore = Math.max(result.repetitionScore, 0.95);
    }
  }
  
  return result;
};

/**
 * Fix harmful repetitions in responses using a variety of techniques
 * Returns a completely de-duplicated response
 */
export const fixHarmfulRepetitions = (responseText: string): string => {
  // Apply multiple fixing techniques in sequence
  let processed = responseText;
  
  // 1. Fix duplicate sentences by keeping only unique ones
  processed = fixDuplicateSentences(processed);
  
  // 2. Fix formulaic beginnings - only keep one instance of each
  processed = fixFormulaicBeginnings(processed);
  
  // 3. Fix stutter patterns (immediate repetition)
  processed = fixStutterPatterns(processed);
  
  // 4. Final cleanup pass - ensure smooth transitions
  processed = cleanupTransitions(processed);
  
  return processed;
};

/**
 * Compute N-Gram similarities using computational linguistics
 */
function computeNGramSimilarities(text: string): {
  highSimilarityFound: boolean;
  segments: string[];
} {
  const words = text.split(/\s+/);
  const result = {
    highSimilarityFound: false,
    segments: [] as string[]
  };
  
  // Skip short texts
  if (words.length < 8) {
    return result;
  }
  
  // Extract 4-grams (groups of 4 consecutive words)
  const ngrams: string[] = [];
  for (let i = 0; i <= words.length - 4; i++) {
    ngrams.push(words.slice(i, i + 4).join(' '));
  }
  
  // Check for similar n-grams
  const uniqueNgrams = new Set<string>();
  const segments = new Set<string>();
  
  for (let i = 0; i < ngrams.length; i++) {
    const ngram = ngrams[i].toLowerCase();
    
    // Skip common phrases and very short n-grams
    if (ngram.length < 12 || isCommonPhrase(ngram)) {
      continue;
    }
    
    // Check if we've seen a similar n-gram before
    let foundSimilar = false;
    for (const existingNgram of uniqueNgrams) {
      const similarity = calculateStringSimilarity(ngram, existingNgram);
      
      if (similarity > 0.7) {
        foundSimilar = true;
        result.highSimilarityFound = true;
        
        // Extract the larger context for both n-grams
        const contextStart = Math.max(0, i - 2);
        const contextEnd = Math.min(words.length, i + 6);
        const context = words.slice(contextStart, contextEnd).join(' ');
        
        segments.add(context);
        break;
      }
    }
    
    if (!foundSimilar) {
      uniqueNgrams.add(ngram);
    }
  }
  
  result.segments = Array.from(segments);
  return result;
}

/**
 * Fix duplicate sentences
 */
function fixDuplicateSentences(text: string): string {
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

/**
 * Fix formulaic beginnings
 */
function fixFormulaicBeginnings(text: string): string {
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

/**
 * Fix stutter patterns (immediate repetition of words/phrases)
 */
function fixStutterPatterns(text: string): string {
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

/**
 * Clean up transitions for a smoother response
 */
function cleanupTransitions(text: string): string {
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

/**
 * Check if a phrase is very common and should be ignored in repetition detection
 */
function isCommonPhrase(phrase: string): boolean {
  const commonPhrases = [
    'would you like to',
    'tell me more about',
    'i understand that you',
    'i hear what you',
    'you mentioned that you',
    'it sounds like you',
    'i think that',
    'it seems that'
  ];
  
  return commonPhrases.some(common => phrase.includes(common));
}
