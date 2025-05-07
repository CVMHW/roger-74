
/**
 * Master Rules System
 * 
 * Central export file for all master rule systems
 */

// Re-export from sub-modules
export * from './masterRules/emotionalAttunement';
export * from './masterRules/detection/topicDetection';
export * from './masterRules/integration';

/**
 * Calculate the minimum response time based on message complexity and emotional weight
 * Implements response delay timing to ensure thoughtful responses
 * 
 * @param complexity Message complexity score (0-9)
 * @param emotionalWeight Emotional weight score (0-9) 
 * @returns Response time in milliseconds
 */
export const calculateMinimumResponseTime = (complexity: number, emotionalWeight: number): number => {
  // Base response time (500ms)
  const baseTime = 500;
  
  // Add time based on complexity (100-900ms)
  const complexityTime = complexity * 100;
  
  // Add time based on emotional weight (100-900ms)
  const emotionalTime = emotionalWeight * 100;
  
  // Add a small random factor for natural variation (0-200ms)
  const randomFactor = Math.floor(Math.random() * 200);
  
  // Calculate total response time
  return baseTime + complexityTime + emotionalTime + randomFactor;
};
