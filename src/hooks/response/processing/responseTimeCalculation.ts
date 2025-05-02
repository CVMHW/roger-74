
import { calculateMinimumResponseTime } from '../../../utils/masterRules';
import { detectGriefThemes } from '../../../utils/response/griefSupport';
import { 
  detectPoliticalEmotions,
  detectSimpleNegativeState
} from '../../../utils/conversationalUtils';
import { ConcernType } from '../../../utils/reflection/reflectionTypes';

/**
 * Calculates an appropriate response time based on message complexity and emotional weight
 * @param userInput User's message text
 * @param concernType Detected concern type if any
 * @returns Response time in milliseconds
 */
export const calculateMessageResponseTime = (
  userInput: string, 
  concernType: ConcernType
): number => {
  // Calculate base response time
  let responseTime = calculateBasicResponseTime(userInput);
  
  // Detect emotional patterns for timing adjustments
  const negativeStateInfo = detectSimpleNegativeState(userInput);
  const hasExplicitFeelings = negativeStateInfo.isNegativeState && 
                             negativeStateInfo.explicitFeelings.length > 0;
  
  // Analyze complexity and emotional weight factors
  const { estimatedComplexity, estimatedEmotionalWeight, responseTimeMultiplier } = 
    analyzeComplexityAndEmotion(userInput, concernType);
  
  // Get minimum response time from master rules
  const minimumTime = calculateMinimumResponseTime(estimatedComplexity, estimatedEmotionalWeight);
  
  // Ensure response time meets the minimum requirement
  responseTime = Math.max(responseTime, minimumTime);
  
  // Apply the response time multiplier for grief or other special cases
  responseTime = Math.round(responseTime * responseTimeMultiplier);
  
  return responseTime;
};

/**
 * Calculates a basic response time based on message length and complexity
 */
const calculateBasicResponseTime = (userInput: string): number => {
  // Simple formula based on message length (placeholder implementation)
  const baseTime = 1000;  // 1 second base time
  const perCharacterTime = 5; // 5ms per character
  return baseTime + (userInput.length * perCharacterTime);
};

/**
 * Analyzes the complexity and emotional weight of a message
 */
export const analyzeComplexityAndEmotion = (
  userInput: string, 
  concernType?: ConcernType
): { 
  estimatedComplexity: number, 
  estimatedEmotionalWeight: number,
  responseTimeMultiplier: number 
} => {
  // Initialize response time multiplier (default is 1.0)
  let responseTimeMultiplier = 1.0;
  
  // Estimate message complexity and emotional weight
  const isCrisis = concernType === 'crisis' || concernType === 'tentative-harm';
  const isMentalHealth = concernType === 'mental-health';
  const isMedical = concernType === 'medical' || concernType === 'eating-disorder';
  const isMildGambling = concernType === 'mild-gambling';
  const isPTSD = concernType === 'ptsd' || concernType === 'ptsd-mild';
  const isTraumaResponse = concernType === 'trauma-response';
  
  // Detect grief themes for response timing
  const griefThemes = detectGriefThemes(userInput);
  const hasSignificantGrief = griefThemes.themeIntensity >= 4;
  
  // Detect political emotions - these need rapid responses
  const politicalEmotions = detectPoliticalEmotions(userInput);
  const hasPoliticalEmotions = politicalEmotions.isPolitical;
  
  // Adjust complexity and emotional weight based on concerns and grief levels
  let estimatedComplexity = isCrisis ? 8 : 
                           isMentalHealth ? 7 :
                           isMedical ? 7 : 
                           isPTSD ? 8 :  // Higher complexity for PTSD
                           isTraumaResponse ? 7 : // Higher for trauma responses
                           isMildGambling ? 4 : 
                           hasSignificantGrief ? 6 : 5;
  
  let estimatedEmotionalWeight = isCrisis ? 9 : 
                                concernType === 'substance-use' || isMentalHealth ? 7 : 
                                isPTSD ? 8 : // Higher emotional weight for PTSD
                                isTraumaResponse ? 7 : 
                                isMildGambling ? 3 : 
                                hasSignificantGrief ? 7 : 4;
  
  // Political emotions should be responded to quickly
  if (hasPoliticalEmotions) {
    // Lower complexity for faster, more conversational response
    estimatedComplexity = 3;
    
    // But still acknowledge the emotional weight
    if (politicalEmotions.emotionExpressed === 'angry') {
      estimatedEmotionalWeight = 5;
    } else if (politicalEmotions.emotionExpressed === 'upset') {
      estimatedEmotionalWeight = 4;
    } else {
      estimatedEmotionalWeight = 3;
    }
    
    // Apply specific multiplier to ensure quick responses to political content
    responseTimeMultiplier = 0.7; // 30% faster than normal
  }
  
  // Further adjust based on specific grief severity
  if (hasSignificantGrief) {
    applyGriefAdjustments(griefThemes, estimatedComplexity, estimatedEmotionalWeight);
  }
  
  // Check for explicit feelings - give slightly faster response
  const negativeStateInfo = detectSimpleNegativeState(userInput);
  const hasExplicitFeelings = negativeStateInfo.isNegativeState && 
                             negativeStateInfo.explicitFeelings.length > 0;
  if (hasExplicitFeelings) {
    // Give explicit feeling responses slightly faster response time
    responseTimeMultiplier = 0.9;
  }
  
  return { 
    estimatedComplexity, 
    estimatedEmotionalWeight, 
    responseTimeMultiplier 
  };
};

/**
 * Applies adjustments to complexity and emotional weight based on grief themes
 */
const applyGriefAdjustments = (
  griefThemes: any, 
  complexity: number, 
  emotionalWeight: number
): { complexity: number, emotionalWeight: number } => {
  let adjustedComplexity = complexity;
  let adjustedEmotionalWeight = emotionalWeight;
  
  if (griefThemes.griefSeverity === 'existential') {
    adjustedComplexity = 8;
    adjustedEmotionalWeight = 8;
  } else if (griefThemes.griefSeverity === 'severe') {
    adjustedComplexity = 7;
    adjustedEmotionalWeight = 8;
  } else if (griefThemes.griefSeverity === 'moderate') {
    adjustedComplexity = 6;
    adjustedEmotionalWeight = 6;
  }
  
  // If grief is specifically about spousal loss, increase weights
  if (griefThemes.griefType === 'spousal-loss') {
    adjustedEmotionalWeight = Math.min(adjustedEmotionalWeight + 1, 9);
  }
  
  // If grief mentions non-linear or roller coaster metaphors, increase complexity
  if (griefThemes.griefMetaphorModel === 'roller-coaster') {
    adjustedComplexity = Math.min(adjustedComplexity + 1, 9);
  }
  
  return { 
    complexity: adjustedComplexity, 
    emotionalWeight: adjustedEmotionalWeight 
  };
};
