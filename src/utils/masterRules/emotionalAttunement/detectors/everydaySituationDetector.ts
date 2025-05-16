
/**
 * Detector for everyday situations that may need emotional support
 */

import { EverydaySituation } from '../types';

/**
 * Patterns to detect common everyday situations that might need support
 */
export const everydaySituations: EverydaySituation[] = [
  // Social awkwardness/embarrassment
  { 
    pattern: /embarrass(ed|ing|ment)|awkward (moment|situation)/i, 
    type: 'social_embarrassment',
    needsSupport: true
  },
  // Difficult conversations
  { 
    pattern: /difficult conversation|hard talk|confrontation/i, 
    type: 'difficult_conversation',
    needsSupport: true
  },
  // Minor failures or mistakes
  { 
    pattern: /fail(ed|ure)|mess(ed)? up|mistake|screw(ed)? up/i, 
    type: 'failure',
    needsSupport: true
  },
  // Interpersonal conflicts
  { 
    pattern: /argument|fight with|disagree(ment)?|conflict with/i, 
    type: 'interpersonal_conflict',
    needsSupport: true
  },
  // Work stress
  { 
    pattern: /work (stress|pressure)|deadline|boss|coworker/i, 
    type: 'work_stress',
    needsSupport: true
  },
  // Social anxiety
  { 
    pattern: /nervous about|anxious about|social anxiety|party anxiety/i, 
    type: 'social_anxiety',
    needsSupport: true
  },
  // Relationship issues
  { 
    pattern: /relationship (issue|problem)|dating|partner|spouse/i, 
    type: 'relationship_issue',
    needsSupport: true
  }
];

/**
 * Detects everyday situations in user input
 * @param userInput User's message
 * @returns The matched situation type or null if none found
 */
export const detectEverydaySituation = (userInput: string): string | null => {
  const lowerInput = userInput.toLowerCase();
  
  for (const situation of everydaySituations) {
    if (situation.pattern.test(lowerInput)) {
      return situation.type;
    }
  }
  
  return null;
};

/**
 * Checks if the detected situation typically needs emotional support
 * @param situationType The type of situation detected
 * @returns Whether the situation typically needs emotional support
 */
export const situationNeedsSupport = (situationType: string): boolean => {
  const situation = everydaySituations.find(s => s.type === situationType);
  return situation ? situation.needsSupport : false;
};
