
/**
 * Common repetitive patterns used in pattern detection
 */

import { RepetitivePattern } from './types';

export const repetitivePatterns: RepetitivePattern[] = [
  {
    regex: /I notice I may have been repeating myself/i,
    pattern: 'meta-acknowledgment',
    weight: 1.0
  },
  {
    regex: /It seems like you shared that/i,
    pattern: 'generic-acknowledgment',
    weight: 1.0
  },
  {
    regex: /I'd like to focus specifically on/i,
    pattern: 'redirection-attempt',
    weight: 0.8
  },
  {
    regex: /I hear you('re| are) feeling .+\. I hear you('re| are) feeling/i,
    pattern: 'feeling-reflection',
    weight: 0.7
  },
  {
    regex: /Would you like to tell me more\? Would you like to tell me more\?/i,
    pattern: 'generic-prompt',
    weight: 0.6
  },
  // Enhanced pattern detection for robotic-sounding phrases
  {
    regex: /(Based on what you're sharing[,.!?]?\s*){2,}/i,
    pattern: 'repetitive-phrase',
    weight: 1.0
  },
  {
    regex: /(From what you've shared[,.!?]?\s*){2,}/i,
    pattern: 'repetitive-phrase',
    weight: 1.0
  },
  {
    regex: /(I hear what you're sharing[,.!?]?\s*){2,}/i,
    pattern: 'repetitive-phrase',
    weight: 1.0
  },
  {
    regex: /Based on what you're sharing[,.!?\s]+Based on what/i,
    pattern: 'repetitive-phrase',
    weight: 1.0
  },
  {
    regex: /From what you've shared[,.!?\s]+From what/i,
    pattern: 'repetitive-phrase',
    weight: 1.0
  },
  {
    regex: /I hear[,.!?\s]+I hear/i,
    pattern: 'repetitive-phrase',
    weight: 1.0
  }
];

export const formulaicPhrases = [
  /Based on what you're sharing/i,
  /From what you've shared/i,
  /I hear what you're sharing/i,
  /I hear you're feeling/i,
  /It sounds like you're/i
];
