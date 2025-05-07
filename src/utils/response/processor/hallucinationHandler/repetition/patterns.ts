
/**
 * Common repetition patterns to detect
 */

import { DetectionPattern } from './types';

/**
 * Dangerous repetition patterns that indicate model confusion
 */
export const dangerousPatterns: DetectionPattern[] = [
  {
    regex: /I hear (you'?re|you are) dealing with I hear/i,
    description: 'Double I hear pattern'
  },
  {
    regex: /you may have indicated Just/i,
    description: 'Interrupted phrase'
  },
  {
    regex: /dealing with you may have indicated/i,
    description: 'Malformed transition'
  },
  {
    regex: /I hear (you'?re|you are) dealing with you may have indicated/i,
    description: 'Mixed introduction phrases'
  },
  {
    regex: /I hear.*you('re| are) dealing with.*you may have indicated/i,
    description: 'Extended mixed phrases'
  },
  {
    regex: /you may have indicated/i,
    description: 'Problematic transitional phrase'
  },
  {
    regex: /I hear.*I hear/i,
    description: 'Repeated acknowledgment'
  },
  {
    regex: /dealing with.*dealing with/i,
    description: 'Repeated sympathy phrase'
  },
  {
    regex: /indicated.*indicated/i,
    description: 'Repeated attribution'
  },
  {
    regex: /you('re| are).*you('re| are)/i,
    description: 'Repeated you are pattern'
  },
  {
    regex: /I hear you.*I hear you/i,
    description: 'Exact phrase repetition'
  },
  {
    regex: /you shared that.*you shared that/i,
    description: 'Repeated attribution'
  },
  {
    regex: /it seems like.*it seems like/i,
    description: 'Repeated observation'
  },
  {
    regex: /I hear that.*I hear that/i,
    description: 'Repeated acknowledgment'
  },
  {
    regex: /you('re| are) dealing with/i,
    description: 'Problematic empathy phrase'
  },
  {
    regex: /I understand.*I understand.*I understand/i,
    description: 'Multiple understanding claims'
  },
  {
    regex: /seems like you.*seems like you/i, 
    description: 'Repeated observation'
  },
  {
    regex: /diagnoses|diagnostic|labels|uncomfortable.*labels/i,
    description: 'Diagnosis/label-related phrases'
  },
  {
    regex: /see your experiences/i,
    description: 'Problematic experience phrase'
  },
  {
    regex: /I hear that you're.*I hear that you're/i,
    description: 'Exact phrase repetition'
  },
  {
    regex: /I'm here to.*I'm here to/i,
    description: 'Repeated purpose statement'
  },
  {
    regex: /you('re| are) feeling.*you('re| are) feeling/i,
    description: 'Repeated feeling attribution'
  },
  {
    regex: /it sounds.*it sounds/i,
    description: 'Repeated observation'
  },
  {
    regex: /what you('re| are) going through.*what you('re| are) going through/i,
    description: 'Repeated empathy phrase'
  },
  {
    regex: /I hear that.*I hear that/i,
    description: 'Exact phrase repetition'
  },
  {
    regex: /I understand that.*I understand that/i,
    description: 'Repeated understanding claim'
  },
  {
    regex: /It sounds like.*It sounds like/i,
    description: 'Repeated observation'
  },
  {
    regex: /diagnoses/i,
    description: 'Medical terminology'
  },
  {
    regex: /diagnostic/i,
    description: 'Medical terminology'
  },
  {
    regex: /labels/i,
    description: 'Labeling terminology'
  },
  {
    regex: /uncomfortable way/i,
    description: 'Discomfort terminology'
  },
  {
    regex: /completely okay to see your experiences/i,
    description: 'Problematic validation'
  }
];

/**
 * Memory reference phrases that shouldn't be repeated
 */
export const memoryPhrases = [
  "I remember", 
  "you mentioned", 
  "you told me", 
  "you said", 
  "we discussed"
];
