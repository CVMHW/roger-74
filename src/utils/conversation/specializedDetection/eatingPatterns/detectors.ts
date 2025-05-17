
/**
 * Eating Disorder Detection System
 * Specialized detection for eating-related concerns
 */

/**
 * Result of eating disorder concern detection
 */
export interface EatingDisorderDetectionResult {
  isEatingDisorderConcern: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  needsImmediate: boolean;
  concernType: string;
}

/**
 * Detects potential eating disorder concerns in user messages
 */
export const detectEatingDisorderConcerns = (userInput: string): EatingDisorderDetectionResult => {
  const lowerInput = userInput.toLowerCase().trim();
  
  // High-risk patterns (immediate attention needed)
  const highRiskPatterns = [
    /can't stop eating|binge eating|overeating|eaten [0-9]+ .+ in a row/i,
    /not eating|haven't (been )?eating|struggling not eating|can't eat|don't eat/i,
    /purge|purging|throw(ing)? up (after|food)/i,
    /starv(e|ing)|anorexia|bulimia|binge|restrict/i
  ];
  
  // Medium-risk patterns (concerning but not immediate)
  const mediumRiskPatterns = [
    /eating too much|compulsive eating/i,
    /body (image|weight|fat)|hate my body|feel fat/i,
    /diet(ing)?|weight loss|calories|counting calories/i
  ];
  
  // Low-risk patterns (potential concerns)
  const lowRiskPatterns = [
    /food (anxiety|worry|concern)|meal|eating habits/i,
    /weight|body|thin|fat/i
  ];
  
  // Check for high-risk patterns first (highest priority)
  for (const pattern of highRiskPatterns) {
    if (pattern.test(lowerInput)) {
      return {
        isEatingDisorderConcern: true,
        riskLevel: 'high',
        needsImmediate: true,
        concernType: 'eating-disorder'
      };
    }
  }
  
  // Then check medium risk patterns
  for (const pattern of mediumRiskPatterns) {
    if (pattern.test(lowerInput)) {
      return {
        isEatingDisorderConcern: true,
        riskLevel: 'medium',
        needsImmediate: false,
        concernType: 'eating-disorder'
      };
    }
  }
  
  // Finally check low risk patterns
  for (const pattern of lowRiskPatterns) {
    if (pattern.test(lowerInput)) {
      return {
        isEatingDisorderConcern: true,
        riskLevel: 'low',
        needsImmediate: false,
        concernType: 'eating-disorder'
      };
    }
  }
  
  // No eating disorder concerns detected
  return {
    isEatingDisorderConcern: false,
    riskLevel: 'low',
    needsImmediate: false,
    concernType: 'none'
  };
};
