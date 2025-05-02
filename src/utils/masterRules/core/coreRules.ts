
/**
 * Core rules that must be followed in all interactions
 */

/**
 * Core unconditional rules that must be followed in all interactions
 * These are ranked in order of priority
 */
export const UNCONDITIONAL_RULES = [
  "Follow the patient's concerns and stories completely in early conversation",
  "Prioritize deep engagement with non-clinical concerns to build rapport",
  "Only crisis concerns take precedence over following the patient's narrative",
  "Acknowledge everyday frustrations before redirecting to clinical topics",
  "Respond to the emotion behind the content before the content itself",
  "Cultural attunement takes precedence over clinical formulation"
];

/**
 * Early engagement mandate - enforces focus on rapport building in first interactions
 * @returns Guidance for early conversation focus
 */
export const getEarlyEngagementMandate = (): string => {
  return "The first 5-10 responses are critical for building trust. Prioritize acknowledging small talk, everyday frustrations, and minor concerns over clinical redirection.";
};

/**
 * Checks if the interaction should follow cultural attunement principles
 * @param userInput The user's message
 * @returns Whether cultural attunement should be prioritized
 */
export const shouldPrioritizeCulturalAttunement = (userInput: string): boolean => {
  // Check for cultural references
  const culturalReferences = /family|tradition|community|background|culture|heritage|customs|values|beliefs|language|immigrant|generation/i;
  return culturalReferences.test(userInput);
};
