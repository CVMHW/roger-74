
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
import { getRacistRemarksResponse } from './detectionUtils/racistRemarksDetection';

// Interface for client context to inform adaptive responses
export interface ClientContext {
  prefersFormalLanguage?: boolean;
  prefersDirectApproach?: boolean;
  isFirstTimeWithMentalHealth?: boolean;
  culturalConsiderations?: string[];
  wealthIndicators?: boolean;
  previousMentalHealthExperience?: boolean;
  locationData?: {
    state?: string;
    city?: string;
  };
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
  
  // Check if the concern is due to racist remarks
  let containsRacistRemarks = false;
  try {
    const racistModule = require('./detectionUtils/racistRemarksDetection');
    containsRacistRemarks = racistModule.detectRacistRemarks(userInput);
  } catch (e) {
    console.log("Error checking for racist remarks:", e);
  }
  
  // If racist remarks are detected, override with special response
  if (containsRacistRemarks && concernType === 'crisis') {
    baseResponse = getRacistRemarksResponse();
  } else {
    switch (concernType) {
      case 'crisis':
        baseResponse = getCrisisMessage() + " If you're experiencing thoughts of harming yourself or others, inpatient treatment is an option that typically lasts 3-7 days and focuses on stabilization and safety.";
        break;
      case 'medical':
        baseResponse = getMedicalConcernMessage();
        break;
      case 'mental-health':
        baseResponse = getMentalHealthConcernMessage() + " If hospitalization is recommended, these stays are typically brief, lasting 3-7 days, and focused on stabilization and developing a follow-up care plan.";
        break;
      case 'eating-disorder':
        baseResponse = getEatingDisorderMessage();
        break;
      case 'substance-use':
        baseResponse = getSubstanceUseMessage();
        break;
      case 'tentative-harm':
        baseResponse = getTentativeHarmMessage() + " Inpatient treatment, when needed, typically involves short stays of 3-7 days focused on safety and stabilization rather than long-term confinement.";
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
  
  // Add location-specific information if available
  if (clientContext.locationData && (clientContext.locationData.state || clientContext.locationData.city)) {
    baseResponse = addLocationSpecificInformation(
      baseResponse, 
      concernType, 
      clientContext.locationData
    );
  }
  
  // Add acknowledgment of continued support alongside professional referrals
  // This implements the rule about remaining with them during the referral process
  if (isSeriousConcern(concernType)) {
    baseResponse = addContinuedSupportLanguage(baseResponse);
  }
  
  return baseResponse;
};

// Function to explain inpatient stays for crisis situations
export const explainInpatientProcess = (locationInfo?: { city?: string; state?: string }): string => {
  // Base explanation
  let explanation = "I want to address any concerns you might have about inpatient mental health treatment. Typical stays last just 3-7 days and are focused on stabilization, safety, and creating a support plan. ";
  
  // Add location-specific information if available
  if (locationInfo) {
    const location = locationInfo.city || locationInfo.state || "";
    if (location) {
      // Customize based on location if possible
      if (location.toLowerCase() === "cleveland") {
        explanation += `In Cleveland, facilities like the Cleveland Clinic and University Hospitals offer supportive inpatient programs designed to help during crisis periods. `;
      } else {
        explanation += `In ${location}, there are facilities that provide compassionate inpatient care designed to help during crisis periods. `;
      }
    }
  }
  
  explanation += "The focus is always on getting you the support you need, not on restriction or confinement. Many people find these brief stays helpful for regaining stability during difficult times.";
  
  return explanation;
}

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
 * Adds location-specific information to responses when available
 */
const addLocationSpecificInformation = (
  baseResponse: string, 
  concernType: ConcernType, 
  locationData: { state?: string; city?: string; }
): string => {
  const location = locationData.city || locationData.state || "";
  if (!location) return baseResponse;
  
  // Don't add location info if it's already mentioned
  if (baseResponse.includes(location)) return baseResponse;
  
  let locationPhrase = "";
  
  switch(concernType) {
    case 'substance-use':
      locationPhrase = ` In ${location}, there are specialized substance use treatment centers that can provide evaluation and support tailored to your specific needs.`;
      break;
    case 'mental-health':
      locationPhrase = ` The ${location} area has several mental health providers that offer both in-person and telehealth options for various levels of care.`;
      break;
    case 'crisis':
      locationPhrase = ` ${location} has crisis response services available 24/7 that can provide immediate support.`;
      break;
    case 'ptsd':
    case 'trauma-response':
      locationPhrase = ` There are trauma-informed specialists in the ${location} area who have expertise in addressing these specific concerns.`;
      break;
    default:
      locationPhrase = ` There are resources available in the ${location} area that might be helpful for you.`;
  }
  
  // Add the location phrase before any final sentence about being available
  if (baseResponse.includes("I'll remain available") || 
      baseResponse.includes("I want to emphasize") ||
      baseResponse.includes("I'll continue to support")) {
    // Insert before the final sentence
    const lastSentenceMatch = baseResponse.match(/\.\s+[^.]+\.$/);
    if (lastSentenceMatch) {
      const lastSentenceIndex = lastSentenceMatch.index;
      if (lastSentenceIndex !== undefined) {
        return baseResponse.substring(0, lastSentenceIndex + 1) + 
               locationPhrase + 
               baseResponse.substring(lastSentenceIndex + 1);
      }
    }
  }
  
  // If no appropriate insertion point was found, just append
  return baseResponse + locationPhrase;
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
