/**
 * Common repetitive patterns used in pattern detection
 */

import { RepetitivePattern } from './types';

export const repetitivePatterns: RepetitivePattern[] = [
  {
    regex: /I notice I may have been repeating myself/i,
    pattern: 'meta-acknowledgment',
    weight: Math.log10(10) // logarithmic weight of 1.0
  },
  {
    regex: /It seems like you shared that/i,
    pattern: 'generic-acknowledgment',
    weight: Math.log10(10) // logarithmic weight of 1.0
  },
  {
    regex: /I'd like to focus specifically on/i,
    pattern: 'redirection-attempt',
    weight: Math.log10(6.3) // logarithmic weight of 0.8
  },
  {
    regex: /I hear you('re| are) feeling .+\. I hear you('re| are) feeling/i,
    pattern: 'feeling-reflection',
    weight: Math.log10(5) // logarithmic weight of 0.7
  },
  {
    regex: /Would you like to tell me more\? Would you like to tell me more\?/i,
    pattern: 'generic-prompt',
    weight: Math.log10(4) // logarithmic weight of 0.6
  },
  
  // Enhanced pattern detection for robotic-sounding phrases
  {
    regex: /(Based on what you're sharing[,.!?]?\s*){2,}/i,
    pattern: 'repetitive-phrase',
    weight: Math.log10(10) // logarithmic weight of 1.0
  },
  {
    regex: /(From what you've shared[,.!?]?\s*){2,}/i,
    pattern: 'repetitive-phrase',
    weight: Math.log10(10) // logarithmic weight of 1.0
  },
  {
    regex: /(I hear what you're sharing[,.!?]?\s*){2,}/i,
    pattern: 'repetitive-phrase',
    weight: Math.log10(10) // logarithmic weight of 1.0
  },
  {
    regex: /Based on what you're sharing[,.!?\s]+Based on what/i,
    pattern: 'repetitive-phrase',
    weight: Math.log10(10) // logarithmic weight of 1.0
  },
  {
    regex: /From what you've shared[,.!?\s]+From what/i,
    pattern: 'repetitive-phrase',
    weight: Math.log10(10) // logarithmic weight of 1.0
  },
  {
    regex: /I hear[,.!?\s]+I hear/i,
    pattern: 'repetitive-phrase',
    weight: Math.log10(10) // logarithmic weight of 1.0
  },
  
  // CVMHW therapeutic approach patterns
  {
    regex: /Let's find meaning[,.!?\s]+Let's find meaning/i,
    pattern: 'meaning-repetition',
    weight: Math.log10(6.3) // logarithmic weight of 0.8
  },
  {
    regex: /(In the present moment[,.!?]?\s*){2,}/i,
    pattern: 'mindfulness-repetition',
    weight: Math.log10(6.3) // logarithmic weight of 0.8
  },
  {
    regex: /(Take a deep breath[,.!?]?\s*){2,}/i,
    pattern: 'breathing-instruction-repetition',
    weight: Math.log10(5) // logarithmic weight of 0.7
  },
  
  // Crisis/emergency detection patterns
  {
    regex: /(suicid(e|al)|kill (myself|me)|end (my|this) life)[,.!?\s]+(suicid(e|al)|kill (myself|me)|end (my|this) life)/i,
    pattern: 'crisis-repetition',
    weight: Math.log10(20) // critical weight of 1.3
  },
  {
    regex: /(eating disorder|anorexia|bulimia|binge)[,.!?\s]+(eating disorder|anorexia|bulimia|binge)/i,
    pattern: 'eating-disorder-repetition',
    weight: Math.log10(15) // high weight of 1.18
  },
  {
    regex: /(gambling|betting|casino|lottery)[,.!?\s]+(gambling|betting|casino|lottery)/i,
    pattern: 'gambling-repetition',
    weight: Math.log10(15) // high weight of 1.18
  },
  {
    regex: /(substance|alcohol|drugs|addiction)[,.!?\s]+(substance|alcohol|drugs|addiction)/i,
    pattern: 'substance-abuse-repetition',
    weight: Math.log10(15) // high weight of 1.18
  }
];

export const formulaicPhrases = [
  /Based on what you're sharing/i,
  /From what you've shared/i,
  /I hear what you're sharing/i,
  /I hear you're feeling/i,
  /It sounds like you're/i,
  /What I'm hearing is/i,
  /I understand that you're/i,
  /It seems like you're experiencing/i
];

// Add mindfulness and meaning-focused phrases that reflect CVMHW approach
export const cvmhwTherapeuticPhrases = [
  "In this moment, let's focus on what matters to you",
  "Finding meaning can help us navigate difficult emotions",
  "Taking a mindful approach means acknowledging your feelings without judgment",
  "When we connect with what's meaningful, we often find clarity",
  "Our values can guide us through challenging times",
  "Finding purpose in our experiences helps us make sense of them",
  "I'm here to listen and support you in this space"
];

// Topic-specific patterns for specialized concerns
export const specializedConcernPatterns = {
  eatingDisorders: [
    /eating habits|body image|weight concerns|food restriction|purging|bingeing/i,
    /anorexia|bulimia|binge eating|eating disorder/i,
    /calories|dieting|weight loss|food control/i
  ],
  gambling: [
    /gambling|betting|casino|slots|lottery|odds|wagering/i,
    /winning money|losing money|gambling debt|betting addiction/i,
    /gambling urges|sports betting|online gambling/i
  ],
  substanceAbuse: [
    /drinking|alcohol|drugs|substances|using|high|intoxicated/i,
    /recovery|sobriety|relapse|addiction|dependence|withdrawal/i,
    /cocaine|heroin|opioids|marijuana|weed|pills/i
  ],
  crisis: [
    /emergency|crisis|urgent help|immediate danger|critical situation/i,
    /suicidal|suicide|kill myself|end my life|don't want to live/i,
    /harm myself|hurt someone|violent thoughts|emergency situation/i
  ]
};

// Mathematical decay functions for response timing
export const responseTimingFunctions = {
  // Logarithmic delay function - increases delay logarithmically with repetition count
  logarithmicDelay: (repetitionCount: number): number => {
    return Math.max(500, Math.log10(repetitionCount + 1) * 2000);
  },
  
  // Exponential decay function for response confidence
  confidenceDecay: (repetitionCount: number): number => {
    return Math.exp(-0.2 * repetitionCount);
  },
  
  // Sigmoid function for determining if response should be rolled back
  shouldRollback: (repetitionScore: number): boolean => {
    // Sigmoid function: 1 / (1 + e^-(score-threshold))
    const threshold = 1.5;
    const probability = 1 / (1 + Math.exp(-(repetitionScore - threshold)));
    return probability > 0.7; // 70% confidence threshold for rollback
  }
};
