
/**
 * Universal Laws - Highest priority rules that govern Roger's behavior
 * These laws take precedence over all other functionality and cannot be overridden
 */

import { UNIVERSAL_LAW_MEANING } from './logotherapyLaws';

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
  priority: 9.5, // High priority, just below memory retention and safety concerns
  
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
 * UNIVERSAL LAW: MEANING AND PURPOSE INTEGRATION
 * 
 * Roger MUST integrate awareness of meaning and purpose into therapeutic approach.
 * Based on Viktor Frankl's logotherapy principles, this law ensures that Roger
 * helps patients connect with meaning, purpose, and values in their lives.
 */
export const UNIVERSAL_LAW_MEANING_PURPOSE = {
  name: "Meaning and Purpose Integration",
  description: "Roger will incorporate concepts of meaning, purpose, and values in his therapeutic approach, recognizing the will to meaning as a fundamental human motivation. He will help patients discover meaning through creative work, experiences, or attitudinal values even in difficult circumstances.",
  priority: 9.8, // Very high priority, just below safety and memory retention
  
  // Implementation checks
  enforcement: {
    meaningPerspectiveIncorporated: true,
    willToMeaningRespected: true,
    purposeExplorationSupported: true,
    valueIdentificationEncouraged: true,
    existentialVacuumAddressed: true
  }
};

/**
 * List of all universal laws in priority order
 */
export const UNIVERSAL_LAWS = [
  UNIVERSAL_LAW_SAFETY,
  UNIVERSAL_LAW_MEMORY,
  UNIVERSAL_LAW_MEANING_PURPOSE, // Added logotherapy-based universal law
  UNIVERSAL_LAW_SPONTANEITY,
  UNIVERSAL_LAW_MEANING // Imported from logotherapyLaws.ts
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
 * Check if a response complies with the universal law of meaning
 */
export const checkMeaningPurposeCompliance = (response: string): boolean => {
  // Import necessary function
  const { checkLogotherapyCompliance } = require('./logotherapyLaws');
  
  // Use the imported function for consistency
  return checkLogotherapyCompliance(response);
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
  const { enhanceWithLogotherapyPerspective } = require('./logotherapyLaws');
  
  let processedResponse = response;
  
  // Always enforce spontaneity as a universal law
  if (!checkSpontaneityCompliance(processedResponse)) {
    console.log("UNIVERSAL LAW ENFORCEMENT: Spontaneity violation detected, applying correction");
    
    // Apply personality variation with high spontaneity to fix the violation
    processedResponse = addResponseVariety(processedResponse, userInput, messageCount, 85, 80);
  }
  
  // Check if the response incorporates meaning/purpose perspective
  if (!checkMeaningPurposeCompliance(processedResponse)) {
    console.log("UNIVERSAL LAW ENFORCEMENT: Meaning integration required, applying enhancement");
    
    // Add logotherapy perspective to the response
    processedResponse = enhanceWithLogotherapyPerspective(processedResponse, userInput);
  }
  
  return processedResponse;
};
