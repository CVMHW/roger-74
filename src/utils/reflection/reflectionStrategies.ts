
/**
 * Utilities for determining when and how to use reflections
 */

import { ConversationStage } from './reflectionTypes';

/**
 * Determines whether a reflection response would be appropriate given the conversation context
 * @param userMessage The user's message
 * @param conversationStage The current stage of the conversation
 * @returns Boolean indicating whether to use a reflection
 */
export const shouldUseReflection = (userMessage: string, conversationStage: ConversationStage): boolean => {
  // More likely to use reflections in early conversation stages
  const stageThresholds = {
    initial: 0.9,  // 90% chance in initial stage
    early: 0.7,    // 70% chance in early stage
    established: 0.5 // 50% chance in established stage
  };
  
  // Base probability on conversation stage
  const baseProb = stageThresholds[conversationStage];
  
  // Increase probability for longer messages (more content to reflect on)
  const lengthFactor = Math.min(userMessage.length / 100, 0.3); // Up to 30% increase for long messages
  
  // Calculate final probability
  const finalProb = Math.min(baseProb + lengthFactor, 0.95); // Cap at 95%
  
  // Random decision based on probability
  return Math.random() < finalProb;
};
