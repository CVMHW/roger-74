
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

// Export additional functions for backward compatibility
export const isLikelyChild = detectors.isLikelyChild;
export const isLikelyNewcomer = detectors.isLikelyNewcomer;
export const detectSocialOverstimulation = detectors.detectSocialOverstimulation;
export const smallTalkTopics = topics.smallTalkTopics;
export const conversationStarters = topics.conversationStarters;
export const turnTakingPrompts = topics.turnTakingPrompts;

// Export functions needed by other modules
export const isLikelyTeen = patientDetectors.isLikelyTeen;
export const isLikelyMale = patientDetectors.isLikelyMale;
export const isLikelyBlueCollar = patientDetectors.isLikelyBlueCollar;
export const mightPreferSimpleLanguage = patientDetectors.mightPreferSimpleLanguage;
export const getAppropriateConversationStyle = responseGenerators.getAppropriateConversationStyle;
export const shouldUseWaitingRoomEngagement = responseGenerators.shouldUseWaitingRoomEngagement;
export const identifyImmediateConcern = responseGenerators.identifyImmediateConcern;
export const generateImmediateConcernResponse = responseGenerators.generateImmediateConcernResponse;
export const generateWaitingRoomEngagement = responseGenerators.generateWaitingRoomEngagement;

// Required by masterRules.ts
export const isWaitingRoomRelated = responseGenerators.isWaitingRoomRelated || 
  function(input: string) { return input.toLowerCase().includes('waiting') || input.toLowerCase().includes('lobby'); };
export const generateWaitingRoomResponse = responseGenerators.generateWaitingRoomResponse || 
  generateWaitingRoomEngagement;
export const shouldUseSmallTalk = responseGenerators.shouldUseSmallTalk || 
  function(input: string) { return input.length < 20 && !input.includes('?'); };
