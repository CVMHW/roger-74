/**
 * Main repetition fixing functionality
 */

import { fixDuplicateSentences } from './fixers/duplicateFixer';
import { fixFormulaicBeginnings } from './fixers/formulaicFixer';
import { fixStutterPatterns } from './fixers/stutterFixer';
import { cleanupTransitions } from './fixers/transitionFixer';

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
