
/**
 * Pattern Detector for Roger's Responses
 * 
 * Specialized system for detecting emergent patterns in Roger's conversational style
 * that may indicate confusion or hallucination
 */

import { SeverityLevel, EmergencyPathFlag } from './types';

/**
 * Detects problematic patterns in Roger's responses over time
 */
export const detectPatternedResponses = (
  currentResponse: string,
  previousResponses: string[] = []
): EmergencyPathFlag[] => {
  const flags: EmergencyPathFlag[] = [];
  
  // Nothing to analyze without previous responses
  if (!previousResponses.length) {
    return flags;
  }
  
  // Check for the repetitive "It seems like you shared that" pattern
  // which is particularly problematic in Roger's responses
  if (/It seems like you shared that/i.test(currentResponse)) {
    // Check if this pattern appears in previous responses as well
    const sharedThatCount = previousResponses.filter(
      resp => /It seems like you shared that/i.test(resp)
    ).length;
    
    // If this pattern is being repeated, flag it with higher severity
    if (sharedThatCount > 0) {
      flags.push({
        type: 'repetitive_shared_pattern',
        description: 'Repetitive use of "It seems like you shared that" pattern',
        severity: sharedThatCount > 1 ? SeverityLevel.SEVERE : SeverityLevel.HIGH
      });
    } else {
      flags.push({
        type: 'rigid_shared_pattern',
        description: 'Use of formulaic "It seems like you shared that" pattern',
        severity: SeverityLevel.MEDIUM
      });
    }
  }
  
  // Check for overuse of "I hear you're feeling" pattern
  if (/I hear you're feeling/i.test(currentResponse)) {
    const hearFeelingCount = previousResponses.filter(
      resp => /I hear you're feeling/i.test(resp)
    ).length;
    
    if (hearFeelingCount > 1) {
      flags.push({
        type: 'repetitive_acknowledgment',
        description: 'Overuse of "I hear you\'re feeling" acknowledgment pattern',
        severity: hearFeelingCount > 2 ? SeverityLevel.HIGH : SeverityLevel.MEDIUM
      });
    }
  }
  
  // Detect formulaic questions at the end of responses
  if (/Would you like to tell me more about what happened\?$/i.test(currentResponse)) {
    const formulaicQuestionCount = previousResponses.filter(
      resp => /Would you like to tell me more about what happened\?$/i.test(resp)
    ).length;
    
    if (formulaicQuestionCount > 0) {
      flags.push({
        type: 'repetitive_question',
        description: 'Repeated use of identical closing question',
        severity: formulaicQuestionCount > 1 ? SeverityLevel.HIGH : SeverityLevel.MEDIUM
      });
    }
  }
  
  return flags;
};
