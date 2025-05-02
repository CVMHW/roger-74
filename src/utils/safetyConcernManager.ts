
/**
 * Manager for handling safety concerns in a customer-centric, adaptive way
 * Implements the unconditional rule about deescalation and treating patients as valued customers
 */

import { ConcernType } from './reflection/reflectionTypes';
import { getDeescalationApproaches } from './safetySupport';
import { 
  getCrisisMessage,
  getMedicalConcernMessage,
  getMentalHealthConcernMessage,
  getEatingDisorderMessage, 
  getSubstanceUseMessage,
  getTentativeHarmMessage,
  getPTSDMessage,
  getMildPTSDResponse,
  getTraumaResponseMessage
} from './responseUtils';

// Interface for client context to inform adaptive responses
export interface ClientContext {
  prefersFormalLanguage?: boolean;
  prefersDirectApproach?: boolean;
  isFirstTimeWithMentalHealth?: boolean;
  culturalConsiderations?: string[];
  wealthIndicators?: boolean;
  previousMentalHealthExperience?: boolean;
}

/**
 * Generates an appropriate safety response based on concern type
 * and adapts it to the client's context and preferences
 */
export const generateSafetyConcernResponse = (
  userInput: string, 
  concernType: ConcernType,
  clientContext: ClientContext = {}
): string => {
  // Get base response from standard templates
  let baseResponse = "";
  
  switch (concernType) {
    case 'crisis':
      baseResponse = getCrisisMessage();
      break;
    case 'medical':
      baseResponse = getMedicalConcernMessage();
      break;
    case 'mental-health':
      baseResponse = getMentalHealthConcernMessage();
      break;
    case 'eating-disorder':
      baseResponse = getEatingDisorderMessage();
      break;
    case 'substance-use':
      baseResponse = getSubstanceUseMessage();
      break;
    case 'tentative-harm':
      baseResponse = getTentativeHarmMessage();
      break;
    case 'ptsd':
      baseResponse = getPTSDMessage();
      break;
    case 'ptsd-mild':
      baseResponse = getMildPTSDResponse(userInput);
      break;
    case 'trauma-response':
      baseResponse = getTraumaResponseMessage(userInput);
      break;
    case 'mild-gambling':
      // For mild gambling, we use a conversational approach
      baseResponse = "I notice you mentioned gaming or gambling. It's something many people enjoy, though it can sometimes become challenging. Would you like to talk more about your experiences with this?";
      break;
    default:
      baseResponse = "I'm here to listen and support you. How can I best help right now?";
  }
  
  // Get de-escalation approaches appropriate for this concern
  const deescalationApproaches = getDeescalationApproaches(concernType);
  
  // Add customer-centric language based on the unconditional rule
  // Treat patients as valued customers regardless of background
  if (clientContext.isFirstTimeWithMentalHealth) {
    baseResponse = addFirstTimeSupportLanguage(baseResponse);
  }
  
  // For high-profile or wealthy clients (as per unconditional rule)
  if (clientContext.wealthIndicators) {
    baseResponse = enhanceServiceLevel(baseResponse);
  }
  
  // Add acknowledgment of continued support alongside professional referrals
  // This implements the rule about remaining with them during the referral process
  if (isSeriousConcern(concernType)) {
    baseResponse = addContinuedSupportLanguage(baseResponse);
  }
  
  return baseResponse;
};

/**
 * Determines if a concern type requires both referral and continued support
 */
const isSeriousConcern = (concernType: ConcernType): boolean => {
  return ['crisis', 'tentative-harm', 'ptsd', 'mental-health'].includes(concernType);
};

/**
 * Enhances responses for first-time mental health engagements
 */
const addFirstTimeSupportLanguage = (baseResponse: string): string => {
  if (!baseResponse.includes("first step") && 
      !baseResponse.includes("new experience") &&
      !baseResponse.includes("appreciate you sharing")) {
    
    return baseResponse + " Reaching out like this can be a new experience, and I want to acknowledge the courage it takes. We'll navigate this together at your pace.";
  }
  
  return baseResponse;
};

/**
 * Enhances service level for high-profile or wealthy clients
 * while maintaining clinical appropriateness
 */
const enhanceServiceLevel = (baseResponse: string): string => {
  // Replace clinical language with more personalized approach
  return baseResponse
    .replace(/resources available/gi, "personalized support options available")
    .replace(/professional help/gi, "specialized assistance")
    .replace(/recommend/gi, "suggest as an option")
    .replace(/should/gi, "might consider");
};

/**
 * Adds language emphasizing continued support alongside professional referrals
 */
const addContinuedSupportLanguage = (baseResponse: string): string => {
  if (!baseResponse.includes("continue to be available") && 
      !baseResponse.includes("remain with you") && 
      !baseResponse.includes("continue supporting")) {
    
    return baseResponse + " I want to emphasize that I'll remain available to support you throughout this process, including as you connect with additional specialized resources.";
  }
  
  return baseResponse;
};
