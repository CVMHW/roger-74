
// Add this function to the existing responseUtils.ts file

/**
 * Get appropriate response for crisis situations with information about inpatient stays
 */
export const getCrisisMessage = (): string => {
  return "I'm concerned about what you're sharing. If you're experiencing thoughts of harming yourself or others, it's important to connect with immediate professional support. The National Suicide Prevention Lifeline (988) is available 24/7. Inpatient treatment, when needed, typically involves brief stays of 3-7 days focused on ensuring your safety and helping you stabilize. Most people find these short stays helpful rather than restrictive.";
};

/**
 * Get appropriate response for tentative harm situations with inpatient information
 */
export const getTentativeHarmMessage = (): string => {
  return "I'm hearing some concerning thoughts about potential harm. Your safety is the top priority right now. Please consider contacting a crisis service like the 988 Lifeline or going to your nearest emergency room. If inpatient care is recommended, these stays are typically brief (3-7 days) and focused on helping you regain stability in a safe environment.";
};

/**
 * Generate a response for potentially deceptive backtracking on crisis statements
 */
export const getDeceptionResponse = (originalConcern: string): string => {
  return `I notice you may be downplaying what you shared earlier. Many people worry about what might happen if they express thoughts of ${originalConcern}. I want to reassure you that seeking help is focused on supporting you, not restricting you. If inpatient treatment is recommended, it typically involves a brief 3-7 day stay focused on safety and stabilization. Would it help to talk more about what professional support options look like?`;
};
