
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
  generatePersonalSharingResponse
} from '../masterRules/unconditionalRuleProtections';

import {
  isEmergency,
  handleEmergency,
  isDirectMedicalAdvice,
  handleDirectMedicalAdvice,
  isSuicidalIdeation,
  handleSuicidalIdeation
} from '../masterRules/safety/safetyUtils';

import {
  requiresClinicianReferral,
  generateClinicianReferral,
  mightNeedNormalizingLanguage,
  generateNormalizingResponse,
} from '../masterRules/clinicalProtections';

import {
  detectEmotionalContent,
  generateEmotionallyAttunedResponse,
  detectEverydaySituation,
  generatePracticalSupportResponse
} from '../masterRules/emotionalAttunementRules';

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
  messageCount: number,
  conversationHistory: string[] = []
): string => {
  // CRITICAL: Check for user message explaining their situation, prevent redundant questions
  if (userInput && userInput.length > 20 && 
      (response.includes("What's been going on?") || 
       response.includes("What's going on?") || 
       response.includes("What's been happening?") ||
       response.includes("What's been going on with you?"))) {
    
    // Use conversation history to extract topics
    const topics = extractUserTopics(userInput);
    
    if (topics.length > 0) {
      // Replace generic question with acknowledgment
      return response.replace(
        /(What's been going on\??|What's going on\??|What's been happening\??|What's been going on with you\??)/,
        `I understand you're dealing with ${topics.join(" and ")}. How has this been affecting you?`
      );
    } else {
      // If no specific topics found, use generic acknowledgment
      return response.replace(
        /(What's been going on\??|What's going on\??|What's been happening\??|What's been going on with you\??)/,
        "I'm here to listen. Could you tell me more about how this has been affecting you?"
      );
    }
  }
  
  // HIGHEST PRIORITY: Check for emergencies first
  if (isEmergency(userInput) || isSuicidalIdeation(userInput)) {
    return isEmergency(userInput) ? handleEmergency() : handleSuicidalIdeation();
  }
  
  // Check for medical advice requests (second highest priority)
  if (isDirectMedicalAdvice(userInput)) {
    return handleDirectMedicalAdvice();
  }
  
  // Skip rule processing for introduction messages
  if (isIntroduction(userInput)) {
    return generateIntroductionResponse();
  }
  
  // Check for personal sharing
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
  messageCount: number,
  conversationHistory: string[] = []
): string => {
  // CRITICAL: Check if response is redundantly asking what's going on when user already explained
  if ((response.includes("What's been going on?") || 
       response.includes("What's going on?") || 
       response.includes("What's been happening?")) && 
      conversationHistory.length >= 2) {
    
    // Extract topics from recent conversation
    const recentHistory = conversationHistory.slice(-4);
    const topics = [];
    
    for (const msg of recentHistory) {
      const msgTopics = extractUserTopics(msg);
      topics.push(...msgTopics);
    }
    
    const uniqueTopics = [...new Set(topics)];
    
    if (uniqueTopics.length > 0) {
      // Replace the redundant question with an acknowledgment and deeper follow-up
      return response.replace(
        /(What's been going on\??|What's going on\??|What's been happening\??)/,
        `I understand you've mentioned ${uniqueTopics.join(" and ")}. How has this been impacting you?`
      );
    }
  }
  
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
  if (!input || typeof input !== 'string') {
    return [];
  }
  
  const topics = [];
  const topicPatterns = [
    { regex: /wrench|tool|lost|find|found|missing/i, topic: "your lost wrench" },
    { regex: /work|job|school|family|relationship|health/i, topic: "your situation" },
    { regex: /sleep|anxious|anxiety|stress|depression|friend/i, topic: "how you're feeling" },
    { regex: /partner|spouse|child|parent|storm|electricity/i, topic: "what you're dealing with" },
    { regex: /power|outage|presentation|laptop|frustration/i, topic: "your frustration" },
    { regex: /upset|angry|mad|sad|down|unhappy|worried/i, topic: "your feelings" }
  ];
  
  for (const pattern of topicPatterns) {
    if (pattern.regex.test(input.toLowerCase()) && !topics.includes(pattern.topic)) {
      topics.push(pattern.topic);
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
  return topics.some(topic => response.toLowerCase().includes(topic.toLowerCase()));
};
