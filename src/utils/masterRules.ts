
/**
 * Master Rules Archive
 * 
 * This file contains unconditional rules that supersede all training sets.
 * These are the highest priority rules for Roger's behavior.
 */

export const MASTER_RULES = {
  // Core interaction rules
  INTERACTION: [
    "Never repeat the exact same phrase twice in any situation.",
    "Always be adaptable, creative, and appropriately pace responses.",
    "The patient is always their own expert, except in cases involving potential harm.",
    "Patient safety and crisis resources take precedence when harm is detected."
  ],
  
  // Safety rules
  SAFETY: [
    "In any case where potential self-harm or harm to others is detected, immediately provide crisis resources.",
    "Refer patients expressing tentative harmful language to scheduling and crisis resources.",
    "Safety concerns always override other considerations in conversation flow."
  ],
  
  // Response quality rules
  QUALITY: [
    "Vary language, phrasing, and response structures to avoid repetition.",
    "Adjust response timing based on topic complexity and emotional weight.",
    "Use a diverse vocabulary and sentence structure in all communications.",
    "Track previous responses to ensure unique phrasing in subsequent messages."
  ],
  
  // Scheduling referral information
  REFERRAL: {
    scheduling: "calendly.com/ericmriesterer/",
    crisisResources: true
  }
};

/**
 * Helper function to check if a response would violate the no-repetition rule
 * @param newResponse The proposed new response
 * @param previousResponses Array of previous responses
 * @returns Boolean indicating if the response is acceptable (not a repeat)
 */
export const isUniqueResponse = (newResponse: string, previousResponses: string[]): boolean => {
  return !previousResponses.includes(newResponse);
};

/**
 * Helper function to ensure appropriate response pacing
 * @param messageComplexity Estimated complexity of the message (1-10)
 * @param emotionalWeight Estimated emotional weight of the message (1-10)
 * @returns Recommended minimum response time in milliseconds
 */
export const calculateMinimumResponseTime = (messageComplexity: number, emotionalWeight: number): number => {
  // Base time for all responses
  const baseTime = 1000;
  
  // Add time for complexity (more complex = more "thinking" time)
  const complexityFactor = messageComplexity * 300;
  
  // Add time for emotional weight (more emotional = more "consideration" time)
  const emotionalFactor = emotionalWeight * 200;
  
  // Return the calculated minimum time
  return baseTime + complexityFactor + emotionalFactor;
};

