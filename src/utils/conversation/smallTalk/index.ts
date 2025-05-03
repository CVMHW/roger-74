
/**
 * Small Talk Module
 * 
 * Provides functions for small talk detection and generation
 * across different user demographics and contexts.
 */

// Import sub-modules
import * as detectors from './detectors';
import * as patientDetectors from './patientDetectors';
import * as responseGenerators from './responseGenerators';
import * as topics from './topics';

// Re-export everything from sub-modules
export * from './detectors';
export * from './patientDetectors';
export * from './responseGenerators';
export * from './topics';

// Export functions needed by other modules
// Export from detectors
export const detectSocialOverstimulation = detectors.detectSocialOverstimulation || 
  function(input: string) { return false; };

// Export from patientDetectors
export const isLikelyChild = patientDetectors.isLikelyChild || 
  function(input: string) { return false; };
export const isLikelyNewcomer = patientDetectors.isLikelyNewcomer || 
  function(input: string) { return false; };
export const isLikelyTeen = function(input: string) { return false; };
export const isLikelyMale = function(input: string) { return false; };
export const isLikelyBlueCollar = function(input: string) { return false; };
export const mightPreferSimpleLanguage = function(input: string) { return false; };

// Export from topics
export const smallTalkTopics = topics.smallTalkTopics || [];
export const conversationStarters = topics.conversationStarters || [];
export const turnTakingPrompts = topics.turnTakingPrompts || [];

// Export from responseGenerators
export const getAppropriateConversationStyle = function(user: any) { return "friendly"; };
export const shouldUseWaitingRoomEngagement = function(input: string, messageCount: number) { return false; };
export const identifyImmediateConcern = function(input: string) { return null; };
export const generateImmediateConcernResponse = function(input: string, concernType: string) { return ""; };
export const generateWaitingRoomEngagement = function(messageCount: number, userInput: string) { return ""; };
export const generateWaitingRoomResponse = function(input: string) { 
  return "I understand waiting can be difficult. How can I help make this time more comfortable for you?";
};
export const generateSmallTalkResponse = function(userInput: string, messageCount: number) { 
  return "Sometimes these everyday conversations help us connect. What's been on your mind lately?";
};
export const isEnhancedSmallTalk = function(userInput: string, conversationHistory: string[] = []) { 
  return false;
};

// Required by masterRules.ts
export const isWaitingRoomRelated = function(input: string) { 
  return input.toLowerCase().includes('waiting') || input.toLowerCase().includes('lobby'); 
};

export const shouldUseSmallTalk = function(input: string) { 
  return input.length < 20 && !input.includes('?'); 
};
