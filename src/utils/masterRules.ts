
/**
 * Master Rules for Roger's response system
 * 
 * Contains high-priority detection functions and rules that govern
 * Roger's behavior and responses
 */

// Export existing functions (maintaining backward compatibility)

/**
 * Detect if message contains suicidal ideation or self-harm indicators
 */
export const isSuicidalIdeation = (text: string): boolean => {
  const suicidalPatterns = [
    /suicid(e|al)/i,
    /kill (myself|me)/i,
    /end (my|this) life/i,
    /don'?t want to (live|be here|exist)/i,
    /want to die/i,
    /hurt(ing)? myself/i,
    /self.?harm/i,
    /no reason to live/i,
    /everyone would be better off without me/i
  ];

  return suicidalPatterns.some(pattern => pattern.test(text));
};

/**
 * Detect if message is requesting medical advice
 */
export const isDirectMedicalAdvice = (text: string): boolean => {
  const medicalAdvicePatterns = [
    /should I take (medication|medicine|drug|pill)/i,
    /what (medication|medicine|drug|pill) should/i,
    /medical advice/i,
    /diagnosis/i,
    /prescribe/i,
    /medical (condition|problem|issue)/i,
    /medical (treatment|intervention)/i
  ];

  return medicalAdvicePatterns.some(pattern => pattern.test(text));
};

/**
 * Calculate minimum response time based on complexity and emotional weight
 * Used by response time calculation system
 */
export const calculateMinimumResponseTime = (
  estimatedComplexity: number,
  estimatedEmotionalWeight: number
): number => {
  // Base time is higher for complex or emotional messages
  const baseTime = 500; // 500ms base
  
  // Add time based on complexity (0-9 scale)
  const complexityFactor = Math.min(estimatedComplexity, 9) * 150;
  
  // Add time based on emotional weight (0-9 scale)
  const emotionalFactor = Math.min(estimatedEmotionalWeight, 9) * 100;
  
  // Calculate minimum response time
  return baseTime + complexityFactor + emotionalFactor;
};

// Re-export existing detection functions - using correct path
export { isSmallTalk, isIntroduction, isPersonalSharing } from './masterRules/detection/topicDetection';
