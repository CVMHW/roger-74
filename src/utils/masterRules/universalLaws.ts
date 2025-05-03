
/**
 * Universal Laws - Highest priority rules that govern Roger's behavior
 * These laws take precedence over all other functionality and cannot be overridden
 */

/**
 * UNIVERSAL LAW: SPONTANEITY AND PERSONALITY VARIATION
 * 
 * Roger MUST incorporate personality, spontaneity, and creativity in ALL responses.
 * This law ensures that Roger's communication feels natural, varied, and authentic,
 * avoiding repetitive patterns and formulaic responses.
 */
export const UNIVERSAL_LAW_SPONTANEITY = {
  name: "Universal Spontaneity and Personality Variation",
  description: "Roger will incorporate spontaneity, creativity, and authentic personality in EVERY response. Responses must avoid formulaic patterns and demonstrate natural variation in language, structure, and perspective. This law takes precedence over all other non-safety rules.",
  priority: 9.5, // Second only to memory retention and safety concerns
  
  // Implementation checks
  enforcement: {
    responseMustBeVaried: true,
    formulaicPatternsProhibited: true,
    personalityMustBeExpressed: true,
    spontaneityRequired: true,
    repetitionProhibited: true
  }
};

/**
 * UNIVERSAL LAW: UNCONDITIONAL MEMORY RETENTION
 * 
 * Roger MUST retain and utilize all memory of patient interactions.
 * This law ensures conversation continuity and prevents hallucinations.
 */
export const UNIVERSAL_LAW_MEMORY = {
  name: "Unconditional Memory Retention",
  description: "Roger will retain constant memory of every word sent by the patient and his replies. He will rely on NLP and AdvancedMemory as well as advanced language capabilities to NEVER forget what a patient's problem, patient's emotion, or patient's conversational habits are. This rule takes precedence over all other rules except immediate safety concerns.",
  priority: 10, // Highest priority after immediate safety concerns
  
  // Implementation checks
  enforcement: {
    memoryRetained: true,
    previousProblemsTracked: true,
    emotionsTracked: true,
    conversationHistoryMaintained: true
  }
};

/**
 * UNIVERSAL LAW: SAFETY AND CRISIS PRIORITIZATION
 * 
 * Roger MUST immediately respond to safety concerns and crisis situations.
 * This law ensures appropriate handling of emergent needs.
 */
export const UNIVERSAL_LAW_SAFETY = {
  name: "Safety and Crisis Prioritization",
  description: "Roger will immediately identify and appropriately respond to any safety concerns or crisis situations. This includes suicidal ideation, self-harm, harm to others, abuse, and medical emergencies. This rule takes absolute precedence over all other rules.",
  priority: 10, // Shared highest priority with memory retention
  
  // Implementation checks
  enforcement: {
    safetyIssuesIdentified: true,
    crisisProtocolsFollowed: true,
    resourcesProvided: true,
    appropriateLanguageUsed: true
  }
};

/**
 * List of all universal laws in priority order
 */
export const UNIVERSAL_LAWS = [
  UNIVERSAL_LAW_SAFETY,
  UNIVERSAL_LAW_MEMORY,
  UNIVERSAL_LAW_SPONTANEITY
];

/**
 * Check if a response complies with the universal law of spontaneity
 */
export const checkSpontaneityCompliance = (response: string): boolean => {
  // Check for formulaic patterns that violate spontaneity
  const formulaicPatterns = [
    /It seems like you shared that/i,
    /I notice I may have been repeating myself/i,
    /I'd like to focus specifically on/i,
    /I hear you('re| are) feeling .+\. I hear you('re| are) feeling/i,
    /Would you like to tell me more\? Would you like to tell me more\?/i
  ];
  
  // If any formulaic pattern is found, the response fails spontaneity compliance
  for (const pattern of formulaicPatterns) {
    if (pattern.test(response)) {
      return false;
    }
  }
  
  return true;
};

/**
 * Enforce universal laws on a response
 */
export const enforceUniversalLaws = (
  response: string, 
  userInput: string, 
  messageCount: number
): string => {
  // Import necessary functions
  const { addResponseVariety } = require('../response/personalityVariation');
  
  // Always enforce spontaneity as a universal law
  if (!checkSpontaneityCompliance(response)) {
    console.log("UNIVERSAL LAW ENFORCEMENT: Spontaneity violation detected, applying correction");
    
    // Apply personality variation with high spontaneity to fix the violation
    return addResponseVariety(response, userInput, messageCount, 85, 80);
  }
  
  return response;
};
