
/**
 * Response Integration System
 * 
 * Integrates MasterRules UnconditionalRuleProtections into the Roger response system
 */

import {
  UNCONDITIONAL_RULES,
  getEarlyEngagementMandate,
  shouldPrioritizeCulturalAttunement,
  validateUnconditionalRules,
  shouldPrioritizeSmallTalk,
  isSubclinicalConcern,
  validatesSubclinicalConcerns,
  isIntroduction,
  generateIntroductionResponse,
  isSmallTalk,
  isPersonalSharing,
  generatePersonalSharingResponse,
  requiresClinicianReferral,
  generateClinicianReferral,
  mightNeedNormalizingLanguage,
  generateNormalizingResponse,
  detectEmotionalContent,
  generateEmotionallyAttunedResponse,
  detectEverydaySituation,
  generatePracticalSupportResponse
} from '../masterRules';

/**
 * Process response through UnconditionalRuleProtections
 * @param response The candidate response
 * @param userInput The original user input
 * @param messageCount Current message count
 * @returns Response that conforms to unconditional rules
 */
export const applyUnconditionalRules = (
  response: string, 
  userInput: string,
  messageCount: number
): string => {
  // Skip rule processing for introduction messages
  if (isIntroduction(userInput)) {
    return generateIntroductionResponse();
  }
  
  // Check for personal sharing first
  if (isPersonalSharing(userInput)) {
    return generatePersonalSharingResponse(userInput);
  }
  
  // For early conversation, check for everyday situations
  if (messageCount <= 10) {
    const situationInfo = detectEverydaySituation(userInput);
    if (situationInfo.isEverydaySituation) {
      const practicalResponse = generatePracticalSupportResponse(situationInfo);
      if (practicalResponse) {
        return practicalResponse;
      }
    }
  }
  
  // Check for emotional content
  const emotionInfo = detectEmotionalContent(userInput);
  if (emotionInfo.hasEmotion) {
    const emotionalResponse = generateEmotionallyAttunedResponse(emotionInfo, userInput);
    if (emotionalResponse) {
      return emotionalResponse;
    }
  }
  
  // Check for small talk
  if (isSmallTalk(userInput)) {
    // Custom small talk response would go here
    // For now, let the existing response pass through
    return response;
  }
  
  // Check if response validates subclinical concerns properly
  if (isSubclinicalConcern(userInput) && !validatesSubclinicalConcerns(response)) {
    return generateNormalizingResponse(userInput);
  }
  
  // Check if clinician referral is needed
  if (requiresClinicianReferral(userInput)) {
    return generateClinicianReferral();
  }
  
  // For early conversation, ensure response follows mandate
  if (messageCount <= 10 && !validateUnconditionalRules(response, userInput, messageCount)) {
    // Add emotional acknowledgment if missing
    return `I hear what you're saying. ${response}`;
  }
  
  return response;
};

/**
 * Enhances response with rapport-building elements based on MasterRules
 * @param response The processed response
 * @param userInput The original user input
 * @param messageCount Current message count
 * @returns Enhanced response with appropriate rapport elements
 */
export const enhanceResponseWithRapport = (
  response: string,
  userInput: string,
  messageCount: number
): string => {
  // Ensure early conversations always include follow-up questions
  if (messageCount <= 5 && !response.includes("?")) {
    return response + " What's been going on with you lately?";
  }
  
  // For messages 5-10, ensure connection to user's context
  if (messageCount <= 10 && messageCount > 5) {
    const userTopics = extractUserTopics(userInput);
    if (userTopics.length > 0 && !containsTopic(response, userTopics)) {
      return response + ` I notice you mentioned ${userTopics[0]}. How has that been affecting things for you?`;
    }
  }
  
  return response;
};

/**
 * Extract main topics from user input
 * @param input User message
 * @returns Array of main topics
 */
const extractUserTopics = (input: string): string[] => {
  const topics = [];
  const potentialTopics = [
    "work", "job", "school", "family", "relationship", "health", 
    "sleep", "anxiety", "stress", "depression", "friend", 
    "partner", "spouse", "child", "parent"
  ];
  
  for (const topic of potentialTopics) {
    if (input.toLowerCase().includes(topic)) {
      topics.push(topic);
    }
  }
  
  return topics;
};

/**
 * Check if response contains reference to user topics
 * @param response Response text
 * @param topics User topics
 * @returns Whether response references user topics
 */
const containsTopic = (response: string, topics: string[]): boolean => {
  return topics.some(topic => response.toLowerCase().includes(topic));
};
