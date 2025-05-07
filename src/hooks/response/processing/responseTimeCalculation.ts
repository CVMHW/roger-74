/**
 * Response time calculation utility
 * 
 * Manages the timing of responses based on message content and context
 */

import { ConcernType } from '../../../utils/reflection/reflectionTypes';
import { calculateMinimumResponseTime } from '../../../utils/masterRules';

/**
 * Calculate appropriate message response time based on content
 * 
 * @param userInput User message text
 * @param concernType Any detected concern type
 * @returns Response time in milliseconds
 */
export const calculateMessageResponseTime = (
  userInput: string,
  concernType?: ConcernType
): number => {
  // Determine message complexity (0-9 scale)
  let complexity = 4; // Default to medium complexity
  
  // Adjust based on message length
  if (userInput.length > 300) complexity += 2;
  else if (userInput.length > 150) complexity += 1;
  
  // Adjust based on sentence count
  const sentenceCount = userInput.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  if (sentenceCount > 5) complexity += 1;
  
  // Adjust based on question complexity
  const questionCount = userInput.split('?').length - 1;
  if (questionCount > 1) complexity += 1;
  
  // Determine emotional weight (0-9 scale)
  let emotionalWeight = 3; // Default to moderate emotional content
  
  // Adjust for specific concern types
  if (concernType) {
    switch (concernType) {
      case 'crisis':
      case 'tentative-harm':
        emotionalWeight = 8; // Very high emotional weight
        break;
      case 'mental-health':
      case 'ptsd':
      case 'trauma-response':
        emotionalWeight = 7; // High emotional weight
        break;
      case 'medical':
      case 'eating-disorder':
      case 'substance-use':
        emotionalWeight = 6; // Significant emotional weight
        break;
      case 'weather-related':
      case 'mild-gambling':
        emotionalWeight = 4; // Moderate emotional weight
        break;
      default:
        // Keep default
        break;
    }
  }
  
  // Check for emotional language
  const emotionalPatterns = [
    /sad|depress(ed|ion)|anxious|anxiety|stress(ed)?|worry|overwhelm(ed)?/i,
    /angry|mad|furious|upset|hurt|pain|suffer|trauma|scared|afraid/i
  ];
  
  // Increase emotional weight if emotional language detected
  for (const pattern of emotionalPatterns) {
    if (pattern.test(userInput)) {
      emotionalWeight += 1;
      break; // Only add once
    }
  }
  
  // Cap values at 9
  complexity = Math.min(9, complexity);
  emotionalWeight = Math.min(9, emotionalWeight);
  
  // Use master rule system to calculate final response time
  return calculateMinimumResponseTime(complexity, emotionalWeight);
};

/**
 * Calculate basic response time - simplified version
 */
export const calculateResponseTime = (userInput: string): number => {
  // Base time
  let responseTime = 500;
  
  // Adjust for message length
  if (userInput.length > 200) responseTime += 500;
  else if (userInput.length > 100) responseTime += 300;
  else if (userInput.length > 50) responseTime += 100;
  
  // Add randomness
  responseTime += Math.floor(Math.random() * 200);
  
  return responseTime;
};
