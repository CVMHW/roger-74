
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
  matchedPhrases: string[]; // Added to track matched phrases
  contextMarkers?: string[]; // Added for additional context markers
}

/**
 * Detects potential eating disorder concerns in user messages
 */
export const detectEatingDisorderConcerns = (userInput: string): EatingDisorderDetectionResult => {
  const lowerInput = userInput.toLowerCase().trim();
  const matchedPhrases: string[] = []; // Track matched phrases
  
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
      const match = lowerInput.match(pattern);
      if (match) matchedPhrases.push(match[0]);
      
      return {
        isEatingDisorderConcern: true,
        riskLevel: 'high',
        needsImmediate: true,
        concernType: 'eating-disorder',
        matchedPhrases
      };
    }
  }
  
  // Then check medium risk patterns
  for (const pattern of mediumRiskPatterns) {
    if (pattern.test(lowerInput)) {
      const match = lowerInput.match(pattern);
      if (match) matchedPhrases.push(match[0]);
      
      // Detect additional context markers
      const contextMarkers = detectContextMarkers(lowerInput);
      
      return {
        isEatingDisorderConcern: true,
        riskLevel: 'medium',
        needsImmediate: false,
        concernType: 'eating-disorder',
        matchedPhrases,
        contextMarkers
      };
    }
  }
  
  // Finally check low risk patterns
  for (const pattern of lowRiskPatterns) {
    if (pattern.test(lowerInput)) {
      const match = lowerInput.match(pattern);
      if (match) matchedPhrases.push(match[0]);
      
      return {
        isEatingDisorderConcern: true,
        riskLevel: 'low',
        needsImmediate: false,
        concernType: 'eating-disorder',
        matchedPhrases
      };
    }
  }
  
  // No eating disorder concerns detected
  return {
    isEatingDisorderConcern: false,
    riskLevel: 'low',
    needsImmediate: false,
    concernType: 'none',
    matchedPhrases: []
  };
};

/**
 * Detects if message is casual food small talk
 */
export const isFoodSmallTalk = (userInput: string): FoodSmallTalkResult => {
  const lowerInput = userInput.toLowerCase().trim();
  
  // Casual food patterns
  const casualFoodPatterns = [
    /restaurant|dining|recipe|cook(ing)?|meal prep|grocery/i,
    /favorite food|breakfast|lunch|dinner|snack|taste|delicious|yummy|flavor/i,
    /pizza|burger|sushi|mexican|italian|chinese|indian|thai|japanese/i,
    /vegetarian|vegan|gluten-free|keto|paleo|diet/i
  ];
  
  for (const pattern of casualFoodPatterns) {
    if (pattern.test(lowerInput) && 
        !lowerInput.includes("can't stop") &&
        !lowerInput.includes("too much") &&
        !lowerInput.includes("hate my body") &&
        !lowerInput.includes("feel fat")) {
      
      return {
        isFoodSmallTalk: true,
        confidence: 0.8,
        pattern: pattern.toString()
      };
    }
  }
  
  return {
    isFoodSmallTalk: false,
    confidence: 0,
    pattern: null
  };
};

/**
 * Detect additional context markers for better understanding
 * @private
 */
const detectContextMarkers = (input: string): string[] => {
  const markers: string[] = [];
  
  if (/distress|worry|concern|anxious|anxiet|stress|depress|sad/i.test(input)) {
    markers.push('emotional-distress');
  }
  
  if (/everyday|interfere|problem|issue|difficult|struggle|can't focus/i.test(input)) {
    markers.push('daily-life-impact');
  }
  
  if (/long time|weeks|months|years|always been|since|childhood/i.test(input)) {
    markers.push('chronic-issue');
  }
  
  return markers;
};

/**
 * Result for food small talk detection
 */
export interface FoodSmallTalkResult {
  isFoodSmallTalk: boolean;
  confidence: number;
  pattern: string | null;
}
