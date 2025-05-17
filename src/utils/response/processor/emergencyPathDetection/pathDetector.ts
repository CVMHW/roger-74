
/**
 * Emergency Path Detection System
 * 
 * Detects conversations that are at risk of entering problematic loops
 * or showing signs of AI confusion/hallucination
 */

import { EmergencyPathResult, EmergencyPathFlag, SeverityLevel } from './types';
import { isSeverityEqual, isSeverityAtLeast, getHigherSeverity } from './severityUtils';

/**
 * Primary detector for emergency conversation paths
 * 
 * @param responseText Current response being generated
 * @param userInput User's most recent message
 * @param conversationHistory Full history of the conversation
 * @param previousResponses Previous AI responses for pattern matching
 * @returns Analysis result with flags and severity
 */
export const detectEmergencyPath = (
  responseText: string,
  userInput: string,
  conversationHistory: string[] = [],
  previousResponses: string[] = []
): EmergencyPathResult => {
  // Initialize result object
  const result: EmergencyPathResult = {
    isEmergencyPath: false,
    severity: SeverityLevel.LOW,
    flags: [],
    requiresImmediateIntervention: false
  };
  
  // CRITICAL: Check for suicide/crisis response issues
  const isSuicideOrSelfHarm = /suicid|kill (myself|me)|end (my|this) life|harm (myself|me)|cut (myself|me)|hurt (myself|me)|don'?t want to (live|be alive)|take my (own )?life/i.test(userInput.toLowerCase());
  
  if (isSuicideOrSelfHarm) {
    // Check for repetition in suicide crisis response
    const responseHasRepetition = /what you('re| are) sharing.+what you('re| are) sharing/i.test(responseText);
    
    if (responseHasRepetition) {
      result.flags.push({
        type: 'critical_suicide_repetition',
        description: 'Critical repetition in suicide crisis response',
        severity: SeverityLevel.SEVERE,
        requiresImmediateIntervention: true
      });
    }
    
    // Check for non-crisis-focused response to suicide message
    const hasProperCrisisContent = /crisis|professional|988|suicide|lifeline|emergency|help|resource/i.test(responseText);
    
    if (!hasProperCrisisContent) {
      result.flags.push({
        type: 'inappropriate_crisis_response',
        description: 'Response to suicide content lacks appropriate crisis intervention',
        severity: SeverityLevel.SEVERE,
        requiresImmediateIntervention: true
      });
    }
  }
  
  // Check for the highly problematic "It seems like you shared that" pattern
  const sharedThatPattern = /It seems like you shared that/i;
  if (sharedThatPattern.test(responseText)) {
    const sharedContentMatch = responseText.match(/It seems like you shared that ([^.]+)\./i);
    
    // This pattern is always problematic, but especially if what was "shared" isn't in the input
    if (sharedContentMatch && sharedContentMatch[1]) {
      const supposedlyShared = sharedContentMatch[1].toLowerCase();
      const userInputLower = userInput.toLowerCase();
      
      // If what was supposedly shared isn't actually in the user input, this is severe
      if (!userInputLower.includes(supposedlyShared)) {
        result.flags.push({
          type: 'false_sharing_statement',
          description: `Response claims user shared "${supposedlyShared}" but this isn't in their message`,
          severity: SeverityLevel.SEVERE,
          requiresImmediateIntervention: true
        });
      } else {
        // Even if accurate, this phrasing is problematic
        result.flags.push({
          type: 'awkward_sharing_statement',
          description: 'Using awkward "It seems like you shared that" phrasing',
          severity: SeverityLevel.HIGH,
          requiresImmediateIntervention: false
        });
      }
    }
  }
  
  // Check for repetitions of "I hear you're feeling" in the same message
  const hearFeelingMatches = responseText.match(/I hear you('re| are) feeling/gi);
  if (hearFeelingMatches && hearFeelingMatches.length > 1) {
    result.flags.push({
      type: 'repeated_acknowledgment',
      description: 'Multiple "I hear you\'re feeling" phrases in one response',
      severity: SeverityLevel.HIGH,
      requiresImmediateIntervention: false
    });
  }
  
  // Check for exact response repetition
  if (previousResponses.length > 0) {
    const exactMatchCount = previousResponses.filter(prev => 
      responseText === prev
    ).length;
    
    if (exactMatchCount > 0) {
      result.flags.push({
        type: 'exact_response_repetition',
        description: 'Exactly repeating a previous response',
        severity: SeverityLevel.SEVERE,
        requiresImmediateIntervention: true
      });
    }
  }
  
  // Check for pattern repetition in previous responses (using "shared that" pattern)
  const sharedThatInPrevious = previousResponses.filter(prev => 
    sharedThatPattern.test(prev)
  ).length;
  
  if (sharedThatPattern.test(responseText) && sharedThatInPrevious > 0) {
    result.flags.push({
      type: 'pattern_repetition',
      description: 'Repeating "It seems like you shared that" pattern across multiple responses',
      severity: SeverityLevel.SEVERE,
      requiresImmediateIntervention: true
    });
  }
  
  // Check for inconsistency (contradicting earlier responses)
  if (previousResponses.length >= 2 && responseText.includes("feeling")) {
    const currentFeeling = extractFeeling(responseText);
    const previousFeeling = extractFeeling(previousResponses[0]);
    
    if (currentFeeling && previousFeeling && 
        currentFeeling !== previousFeeling && 
        !userInput.toLowerCase().includes(currentFeeling)) {
      result.flags.push({
        type: 'feeling_inconsistency',
        description: `Changed feeling from "${previousFeeling}" to "${currentFeeling}" without user mentioning it`,
        severity: SeverityLevel.HIGH,
        requiresImmediateIntervention: false
      });
    }
  }
  
  // Special check for continuing suicide conversation
  if (previousResponses.length > 0 && isSuicideOrSelfHarm) {
    // If this is a follow-up in a suicide conversation, check if Roger is still responding appropriately
    const isFollowUpSuicideMessage = /want to die|do it|hurt|end it|no reason to live/i.test(userInput.toLowerCase());
    
    if (isFollowUpSuicideMessage && !/crisis|professional|988|suicide|lifeline|emergency|help|resource/i.test(responseText)) {
      result.flags.push({
        type: 'inappropriate_followup_crisis_response',
        description: 'Lost crisis intervention focus in suicide conversation follow-up',
        severity: SeverityLevel.SEVERE,
        requiresImmediateIntervention: true
      });
    }
  }
  
  // Analyze all flags and determine overall severity
  if (result.flags.length > 0) {
    result.isEmergencyPath = true;
    
    // Start with lowest severity
    let highestSeverity = SeverityLevel.LOW;
    
    // Find highest severity flag
    for (const flag of result.flags) {
      highestSeverity = getHigherSeverity(highestSeverity, flag.severity);
    }
    
    // Increase severity if multiple flags
    if (result.flags.length >= 3) {
      highestSeverity = getHigherSeverity(highestSeverity, SeverityLevel.HIGH);
    }
    
    // Special case: combined "shared that" + repetition is always SEVERE
    if (result.flags.some(f => f.type.includes('sharing_statement')) && 
        result.flags.some(f => f.type.includes('repetition'))) {
      highestSeverity = SeverityLevel.SEVERE;
    }
    
    result.severity = highestSeverity;
    
    // Determine if immediate intervention is required
    result.requiresImmediateIntervention = 
      isSeverityEqual(highestSeverity, SeverityLevel.SEVERE) || 
      (isSeverityEqual(highestSeverity, SeverityLevel.HIGH) && result.flags.length >= 2);
  }
  
  return result;
};

/**
 * Helper function to extract feeling from response
 */
function extractFeeling(text: string): string | null {
  const match = text.match(/feeling ([a-z]+)/i);
  return match ? match[1].toLowerCase() : null;
}

/**
 * Categorize flags into groups for better handling
 */
export const categorizeFlags = (flags: EmergencyPathFlag[]): Record<string, EmergencyPathFlag[]> => {
  const categories: Record<string, EmergencyPathFlag[]> = {
    repetition: [],
    inconsistency: [],
    phrasing: [],
    other: []
  };
  
  for (const flag of flags) {
    if (flag.type.includes('repetition') || flag.type.includes('repeated')) {
      categories.repetition.push(flag);
    } else if (flag.type.includes('inconsistency')) {
      categories.inconsistency.push(flag);
    } else if (flag.type.includes('statement') || flag.type.includes('phrasing')) {
      categories.phrasing.push(flag);
    } else {
      categories.other.push(flag);
    }
  }
  
  return categories;
};
