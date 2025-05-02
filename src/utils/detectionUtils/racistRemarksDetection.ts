
/**
 * Utility to detect racist remarks in user input
 */

// Function to detect racist remarks in text
export const detectRacistRemarks = (text: string): boolean => {
  const lowerText = text.toLowerCase();
  
  // List of common racist slurs and language patterns
  // This is a simplified implementation - in a real application, this would be more comprehensive
  // and would use more sophisticated techniques like ML models
  const racistPatterns = [
    // Specifically identified slurs
    /nigger/i,
    /nigga/i,
    /spick/i,
    /faggot/i,
    /communist/i,
    /commie/i,
    /retard/i,
    /chink/i,
    /dirty \w+/i, // "dirty" followed by any nationality or group
    
    // Additional general patterns - implementation uses general patterns
    /\bn[^a-z]*word\b/i,
    /\bc[^a-z]*word\b/i,
    /\bs[^a-z]*word\b/i,
    /\bw[^a-z]*tback\b/i,
    /\bg[^a-z]*ok\b/i,
    /\bch[^a-z]*nk\b/i,
    /\bk[^a-z]*ke\b/i,
    /\bsp[^a-z]*c\b/i,
    /\br[^a-z]*ghead\b/i,
    
    // Explicit racist terms
    /white (power|supremacy|superiority)/i,
    /racial (superiority|inferiority)/i,
    /master race/i,
    /ethnic cleansing/i,
    
    // Phrases indicating racist intent
    /go back to your (country|where you came from)/i,
    /don't belong (here|in this country)/i,
    /deport (them|all of them|those people)/i
  ];
  
  // Check if the text contains any racist patterns
  return racistPatterns.some(pattern => pattern.test(lowerText));
};

// Function to get an appropriate response to racist remarks
export const getRacistRemarksResponse = (): string => {
  return "I notice that your message contains language that appears to be racially insensitive. At this facility, we are committed to providing a safe, respectful environment for everyone. " +
    "If you're experiencing strong feelings that are leading to this type of language, I'd like to help connect you with appropriate resources. " +
    "I'm going to provide some crisis resources, as this type of language often indicates underlying distress that might benefit from immediate support.";
};
