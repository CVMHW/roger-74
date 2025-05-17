
/**
 * Response generators for food-related discussions
 */

import { RiskLevel } from './types';

/**
 * Generates an appropriate response for potential eating disorder concerns
 */
export const generateEatingDisorderResponse = (userInput: string, riskLevel: RiskLevel): string => {
  // Handle different risk levels appropriately
  if (riskLevel === 'high') {
    return "I'm concerned about what you're sharing regarding your eating patterns. This sounds serious, and it's important that you speak with a healthcare professional right away. The National Eating Disorders Association (NEDA) helpline (1-800-931-2237) can provide immediate support and resources. Would it be possible for you to reach out to them today?";
  } else if (riskLevel === 'medium') {
    return "I notice you're talking about some challenging experiences with food and eating. These feelings are important to address. Many people find it helpful to talk with someone who specializes in this area. Would you like to talk more about what you've been experiencing with food or eating?";
  } else {
    return "I hear you mentioning some thoughts about food and eating. Sometimes our relationship with food can be complicated. How has this been affecting you lately?";
  }
};

/**
 * Generates a casual response for food-related small talk
 */
export const generateFoodSmallTalkResponse = (userInput: string, context?: string): string => {
  if (context === 'restaurant') {
    return "It sounds like you're interested in food and restaurants. While I don't have personal food preferences, I'm happy to hear about your experiences with different cuisines or restaurants that you enjoy.";
  } else if (context === 'cooking') {
    return "You're talking about cooking - that's something many people find both creative and therapeutic. Though I can't offer recipes, I'd be interested to hear what cooking means to you or how it fits into your life.";
  } else {
    return "I notice you're bringing up the topic of food. While I don't have personal experiences with eating, I'm here to discuss whatever's on your mind.";
  }
};

/**
 * Generates a neutral but supportive response for ambiguous food-related messages
 */
export const generateNeutralResponse = (userInput: string): string => {
  return "I notice you mentioned something related to food or eating. This can be an important topic for many people. Would you like to share more about how this relates to what's been going on for you?";
};
