
/**
 * Core detection functions for crisis content
 */

import { CrisisType } from './types';
import { crisisPatterns, matchesAnyPattern } from './patterns';
import { detectEatingDisorderConcerns } from '../../../utils/conversation/specializedDetection/eatingPatterns/detectors';
import { processFoodRelatedMessage } from '../../../utils/conversation/specializedDetection/eatingPatterns/processor';

/**
 * Detects multiple crisis types in a single message
 * @param userInput User message to analyze
 * @returns Array of crisis types detected
 */
export function detectMultipleCrisisTypes(userInput: string): CrisisType[] {
  const crisisTypes: CrisisType[] = [];
  const lowercaseInput = userInput.toLowerCase();
  
  // Check for suicide indicators
  if (matchesAnyPattern(lowercaseInput, crisisPatterns.suicide)) {
    crisisTypes.push('suicide');
  }
  
  // Check for self-harm indicators separate from suicide
  if (
    matchesAnyPattern(lowercaseInput, crisisPatterns.selfHarm) && 
    !crisisTypes.includes('suicide')
  ) {
    crisisTypes.push('self-harm');
  }
  
  // Check for eating disorder indicators
  const edResult = detectEatingDisorderConcerns(userInput);
  if (edResult.isEatingDisorderConcern && edResult.riskLevel !== 'low') {
    crisisTypes.push('eating-disorder');
  }
  
  // Check for substance abuse indicators
  if (matchesAnyPattern(lowercaseInput, crisisPatterns.substanceUse)) {
    crisisTypes.push('substance-use');
  }
  
  // If no specific type but there are general crisis indicators
  if (
    crisisTypes.length === 0 &&
    matchesAnyPattern(lowercaseInput, crisisPatterns.generalCrisis)
  ) {
    crisisTypes.push('general-crisis');
  }
  
  return crisisTypes;
}

/**
 * Checks for crisis-related content in user input
 */
export function checkForCrisisContent(userInput: string): boolean {
  if (!userInput || typeof userInput !== 'string') {
    console.error("CRISIS DETECTOR: Invalid input received", userInput);
    return false;
  }
  
  try {
    console.log("CRISIS DETECTOR: Checking user input for crisis content (direct function)");
    
    // First use our executive control system to process food-related messages
    // This ensures eating disorders are correctly identified as crisis situations
    if (/eat(ing)?|food|meal|diet|weight|body|fat|thin|anorexia|bulimia|binge|purge|hunger|starv/i.test(userInput.toLowerCase())) {
      console.log("CRISIS DETECTOR: Food-related content detected, using specialized processor");
      const result = processFoodRelatedMessage(userInput);
      
      // If the executive system says this is a high-risk eating disorder situation, it's a crisis
      if (result.responseType === 'eating_disorder' && result.riskLevel === 'high') {
        console.log("CRISIS DETECTOR: High-risk eating disorder detected by executive system");
        return true;
      }
    }
    
    // Direct pattern matches for eating disorders - highest sensitivity 
    const lowerInput = userInput.toLowerCase().trim();
    
    // Direct check for eating disorder issues - HIGHEST PRIORITY
    if (matchesAnyPattern(lowerInput, crisisPatterns.eatingDisorder)) {
      console.log("CRISIS DETECTOR: Direct eating disorder pattern match");
      return true;
    }
    
    // Check with our eating disorder detection system for high-risk cases
    const edResult = detectEatingDisorderConcerns(userInput);
    if (edResult.isEatingDisorderConcern && (edResult.riskLevel === 'high' || edResult.needsImmediate)) {
      console.log("CRISIS DETECTOR: Eating disorder detection system identified high risk");
      return true;
    }
    
    // Safety check for suicide content - direct patterns
    if (matchesAnyPattern(lowerInput, crisisPatterns.suicide)) {
      console.log("CRISIS DETECTOR: Direct suicide content detected");
      return true;
    }
    
    // Fallback pattern detection for crisis signals we might have missed
    const allCrisisPatterns = [
      ...crisisPatterns.suicide,
      ...crisisPatterns.selfHarm,
      ...crisisPatterns.generalCrisis
    ];
    
    return allCrisisPatterns.some(pattern => pattern.test(lowerInput));
  } catch (error) {
    console.error("CRISIS DETECTOR: Error in crisis detection", error);
    // Safety fallback - if there's any error, better to assume it might be a crisis
    return /suicid|kill|harm|hurt|die|dead/i.test(userInput.toLowerCase());
  }
}
