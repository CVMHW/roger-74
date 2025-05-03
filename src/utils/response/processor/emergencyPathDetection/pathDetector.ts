/**
 * Emergency Path Detector
 * 
 * Detects high-risk conversation patterns that may lead to hallucinations
 */

import { SeverityLevel, EmergencyPathResult, EmergencyPathFlags, EmergencyPathFlag } from './types';
import { UNCONDITIONAL_MEMORY_RULE } from '../../../masterRules/core/coreRules';

// Critical patterns that indicate severe hallucination risk
const CRITICAL_PATTERNS = [
  {
    pattern: /I hear (you'?re|you are) dealing with I hear (you'?re|you are) dealing with/i,
    type: 'dangerous_repetition',
    description: 'Dangerous repetition of "I hear you\'re dealing with"',
    severity: SeverityLevel.SEVERE
  },
  {
    pattern: /you may have indicated Just a/i,
    type: 'incoherent_phrase',
    description: 'Incoherent phrase "you may have indicated Just a"',
    severity: SeverityLevel.SEVERE
  },
  {
    pattern: /(I hear|It sounds like) you('re| are) (dealing with|feeling) (I hear|It sounds like) you('re| are)/i,
    type: 'repetitive_acknowledgment',
    description: 'Repetitive acknowledgment pattern',
    severity: SeverityLevel.SEVERE
  },
  {
    pattern: /I hear you're dealing with you may have indicated/i,
    type: 'conflated_phrases',
    description: 'Conflated phrases indicating processing error',
    severity: SeverityLevel.SEVERE
  }
];

// High-risk patterns that suggest hallucination risk
const HIGH_RISK_PATTERNS = [
  {
    pattern: /I remember (you|your|we) I remember (you|your|we)/i,
    type: 'memory_repetition',
    description: 'Repetitive memory reference',
    severity: SeverityLevel.HIGH
  },
  {
    pattern: /you (mentioned|said|told me) you (mentioned|said|told me)/i,
    type: 'attribution_repetition',
    description: 'Repetitive attribution to user',
    severity: SeverityLevel.HIGH
  },
  {
    pattern: /you may have indicated/i,
    type: 'uncertain_attribution',
    description: 'Uncertain attribution to user',
    severity: SeverityLevel.HIGH
  },
  {
    pattern: /dealing with you may have indicated/i,
    type: 'phrase_conflation',
    description: 'Phrase conflation',
    severity: SeverityLevel.HIGH
  }
];

// Medium-risk patterns that should be monitored
const MEDIUM_RISK_PATTERNS = [
  {
    pattern: /we've been focusing on health|dealing with health|focusing on health/i,
    type: 'false_continuity',
    description: 'False continuity claim about health discussions',
    severity: SeverityLevel.MEDIUM
  },
  {
    pattern: /as we discussed earlier|as I mentioned earlier|we talked about this before/i,
    type: 'false_history',
    description: 'False reference to previous conversation',
    severity: SeverityLevel.MEDIUM
  }
];

/**
 * Detects if the conversation is entering an emergency path
 * based on response patterns and context
 */
export const detectEmergencyPath = (
  responseText: string,
  userInput: string,
  conversationHistory: string[],
  previousResponses: string[] = []
): EmergencyPathResult => {
  console.log("EMERGENCY PATH: Analyzing for high-risk patterns");
  
  const flags: EmergencyPathFlag[] = [];
  let highestSeverity = SeverityLevel.LOW;
  
  // Check for critical patterns first - these require immediate intervention
  for (const { pattern, type, description, severity } of CRITICAL_PATTERNS) {
    if (pattern.test(responseText)) {
      flags.push({ type, description, severity, pattern: pattern.toString() });
      highestSeverity = SeverityLevel.SEVERE;
    }
  }
  
  // If any critical patterns were found, return immediately
  if (highestSeverity === SeverityLevel.SEVERE) {
    return {
      isEmergencyPath: true,
      severity: SeverityLevel.SEVERE,
      flags,
      recommendedAction: 'reset_conversation',
      requiresImmediateIntervention: true
    };
  }
  
  // Check for high-risk patterns
  for (const { pattern, type, description, severity } of HIGH_RISK_PATTERNS) {
    if (pattern.test(responseText)) {
      flags.push({ type, description, severity, pattern: pattern.toString() });
      if (severity === SeverityLevel.HIGH && highestSeverity !== SeverityLevel.SEVERE) {
        highestSeverity = SeverityLevel.HIGH;
      }
    }
  }
  
  // Check for medium-risk patterns
  for (const { pattern, type, description, severity } of MEDIUM_RISK_PATTERNS) {
    if (pattern.test(responseText)) {
      flags.push({ type, description, severity, pattern: pattern.toString() });
      if (severity === SeverityLevel.MEDIUM && 
          highestSeverity !== SeverityLevel.SEVERE && 
          highestSeverity !== SeverityLevel.HIGH) {
        highestSeverity = SeverityLevel.MEDIUM;
      }
    }
  }
  
  // Special check for nonsensical content in early conversation
  if (conversationHistory.length <= 3) {
    // Check for mentions of previous discussions in new conversations
    if (/we've been|we discussed|as I mentioned|you told me|you said|you mentioned|I remember|earlier you said|previously/i.test(responseText)) {
      flags.push({
        type: 'false_continuity_early',
        description: 'False reference to previous conversation in early exchange',
        severity: SeverityLevel.HIGH
      });
      if (highestSeverity !== SeverityLevel.SEVERE) {
        highestSeverity = SeverityLevel.HIGH;
      }
    }
  }
  
  // Check for sentences that don't parse grammatically
  const sentences = responseText.split(/[.!?]+\s/).filter(s => s.trim().length > 0);
  for (const sentence of sentences) {
    if (/\b[A-Z][a-z]+ [a-z]+ [a-z]+ [A-Z][a-z]+\b/.test(sentence)) {
      flags.push({
        type: 'grammatical_error',
        description: 'Sentence with unusual capitalization pattern',
        severity: SeverityLevel.MEDIUM
      });
      if (highestSeverity !== SeverityLevel.SEVERE && highestSeverity !== SeverityLevel.HIGH) {
        highestSeverity = SeverityLevel.MEDIUM;
      }
    }
  }
  
  // Determine if this is an emergency path and what action to take
  const isEmergencyPath = highestSeverity === SeverityLevel.HIGH || highestSeverity === SeverityLevel.SEVERE;
  
  let recommendedAction: 'continue' | 'minor_intervention' | 'major_intervention' | 'reset_conversation' = 'continue';
  
  if (highestSeverity === SeverityLevel.SEVERE) {
    recommendedAction = 'reset_conversation';
  } else if (highestSeverity === SeverityLevel.HIGH) {
    recommendedAction = 'major_intervention';
  } else if (highestSeverity === SeverityLevel.MEDIUM) {
    recommendedAction = 'minor_intervention';
  }
  
  const requiresImmediateIntervention = 
    highestSeverity === SeverityLevel.SEVERE || 
    (highestSeverity === SeverityLevel.HIGH && flags.length >= 2);
  
  return {
    isEmergencyPath,
    severity: highestSeverity,
    flags,
    recommendedAction,
    requiresImmediateIntervention
  };
};

/**
 * Organizes all detected flags into categories
 */
export const categorizeFlags = (flags: EmergencyPathFlag[]): EmergencyPathFlags => {
  return {
    repetitionPatterns: flags.filter(flag => 
      flag.type.includes('repetition') || 
      flag.type.includes('repeated')),
    memoryInconsistencies: flags.filter(flag => 
      flag.type.includes('memory') || 
      flag.type.includes('false_continuity') || 
      flag.type.includes('history')),
    contextBreaks: flags.filter(flag => 
      flag.type.includes('context') || 
      flag.type.includes('continuity')),
    nonsensePhrases: flags.filter(flag => 
      flag.type.includes('phrase') || 
      flag.type.includes('incoherent') || 
      flag.type.includes('nonsense')),
    malformedResponses: flags.filter(flag => 
      flag.type.includes('grammatical') || 
      flag.type.includes('structure') || 
      flag.type.includes('malformed'))
  };
};
