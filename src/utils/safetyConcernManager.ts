/**
 * Utilities for managing safety concerns and generating appropriate responses
 */

import { adaptToneForClientPreference } from './conversationalUtils';

// Module constants for de-escalation responses
const denialResponses = [
  "I understand that it might be difficult to accept or talk about this right now. I'm here to listen without judgment whenever you're ready.",
  "It's okay to feel unsure or resistant. I'm here to provide support at your pace.",
  "I respect your feelings. If you ever want to explore this further, I'm here to help."
];

const angerResponses = [
  "I hear that you're feeling angry. It's okay to express your emotions, and I'm here to listen without judgment.",
  "I understand that you're frustrated. I'm here to help you work through these feelings.",
  "It's okay to feel angry. I'm here to provide support and understanding."
];

const bargainingResponses = [
  "I understand that you're looking for a way to make things better. I'm here to help you explore your options.",
  "It's okay to want to find a solution. I'm here to support you in finding a path forward.",
  "I hear that you're trying to find a way to cope. I'm here to help you explore your feelings and options."
];

const minimizationResponses = [
  "I understand that you might be trying to downplay the situation. I'm here to listen without judgment.",
  "It's okay to feel like it's not a big deal. I'm here to provide support and understanding.",
  "I hear that you're trying to minimize the impact. I'm here to help you explore your feelings and options."
];

/**
 * Generates an appropriate response for safety concerns based on concern type
 * @param userInput The user's message
 * @param concernType The type of safety concern detected
 * @param clientPreferences Optional preferences for response customization
 * @returns A safety-focused response appropriate to the concern
 */
export const generateSafetyConcernResponse = (
  userInput: string, 
  concernType: string,
  clientPreferences?: {
    prefersFormalLanguage?: boolean;
    prefersDirectApproach?: boolean;
    isFirstTimeWithMentalHealth?: boolean;
    wealthIndicators?: boolean;
    previousMentalHealthExperience?: boolean;
  }
): string => {
  // Default client preferences if none provided
  const preferences = clientPreferences || {
    prefersFormalLanguage: false,
    prefersDirectApproach: false,
    isFirstTimeWithMentalHealth: true
  };
  
  // Process the concern and generate an appropriate response
  // Always prioritize safety while maintaining a supportive tone
  switch (concernType) {
    case 'crisis':
      return getCrisisSupportResponse(userInput);
    case 'tentative-harm':
      return getTentativeHarmResponse(userInput);
    case 'mental-health':
      return getMentalHealthSupportResponse(userInput);
    case 'medical':
      return getMedicalConcernResponse(userInput);
    case 'eating-disorder':
      return getEatingDisorderSupportResponse(userInput);
    case 'substance-use':
      return getSubstanceUseSupportResponse(userInput);
    case 'ptsd':
      return getPTSDSupportResponse(userInput);
    case 'trauma-response':
      return getTraumaResponseSupport(userInput);
    case 'pet-illness':
      // For pet illness, we'll use a different approach focused on empathy
      return getPetIllnessSupport(userInput);
    default:
      // Generic supportive response with a slight focus on safety
      return "I hear you. It sounds like you're going through something difficult. I'm here to support you through this conversation. What would be most helpful to talk about right now?";
  }
};

/**
 * Generates a de-escalation response based on the type of defensive reaction
 * @param reactionType The type of defensive reaction (denial, anger, bargaining, minimization)
 * @param suggestedConcern The concern that was suggested to the user
 * @returns A de-escalation response appropriate to the reaction
 */
export const generateDeescalationResponse = (
  reactionType: 'denial' | 'anger' | 'bargaining' | 'minimization',
  suggestedConcern: string
): string => {
  let responseOptions: string[];
  
  switch (reactionType) {
    case 'denial':
      responseOptions = denialResponses;
      break;
    case 'anger':
      responseOptions = angerResponses;
      break;
    case 'bargaining':
      responseOptions = bargainingResponses;
      break;
    case 'minimization':
      responseOptions = minimizationResponses;
      break;
    default:
      responseOptions = denialResponses; // Default to denial responses
  }
  
  // Select a random response from the appropriate options
  const randomIndex = Math.floor(Math.random() * responseOptions.length);
  const baseResponse = responseOptions[randomIndex];
  
  // Add a personalized touch to the response
  const personalizedResponse = `${baseResponse} I'm here to support you, regardless of how you feel about discussing ${suggestedConcern}.`;
  
  return personalizedResponse;
};

/**
 * Get appropriate response for crisis situations
 */
const getCrisisSupportResponse = (userInput: string): string => {
  // Prioritize immediate safety and support
  return "It sounds like you're going through a lot right now. Your safety is my top priority. Would you like me to help you connect with immediate support, such as a crisis hotline or emergency services?";
};

/**
 * Get appropriate response for tentative harm concerns
 */
const getTentativeHarmResponse = (userInput: string): string => {
  // Express concern and offer support
  return "I'm concerned about what you're going through. It sounds like you're having thoughts of harming yourself. I want you to know that you're not alone, and I'm here to support you. Would you like to explore some resources that can help?";
};

/**
 * Get appropriate response for mental health concerns
 */
const getMentalHealthSupportResponse = (userInput: string): string => {
  // Acknowledge the user's feelings and offer support
  return "I hear that you're struggling with your mental health. It's important to take care of yourself, and I'm here to support you. Would you like to explore some resources that can help you feel better?";
};

/**
 * Get appropriate response for medical concerns
 */
const getMedicalConcernResponse = (userInput: string): string => {
  // Encourage seeking professional medical advice
  return "I understand that you're concerned about your health. It's important to seek professional medical advice for any health concerns. Would you like me to help you find a doctor or other healthcare provider?";
};

/**
 * Get appropriate response for eating disorder concerns
 */
const getEatingDisorderSupportResponse = (userInput: string): string => {
  // Express concern and offer support
  return "I'm concerned about what you're going through. It sounds like you're struggling with an eating disorder. I want you to know that you're not alone, and I'm here to support you. Would you like to explore some resources that can help?";
};

/**
 * Get appropriate response for substance use concerns
 */
const getSubstanceUseSupportResponse = (userInput: string): string => {
  // Express concern and offer support
  return "I'm concerned about what you're going through. It sounds like you're struggling with substance use. I want you to know that you're not alone, and I'm here to support you. Would you like to explore some resources that can help?";
};

/**
 * Get appropriate response for PTSD concerns
 */
const getPTSDSupportResponse = (userInput: string): string => {
  // Acknowledge the user's experiences and offer support
  return "I hear that you're struggling with PTSD. It's important to take care of yourself, and I'm here to support you. Would you like to explore some resources that can help you feel better?";
};

/**
 * Get appropriate response for trauma-related concerns
 */
const getTraumaResponseSupport = (userInput: string): string => {
  // Acknowledge the user's experiences and offer support
  return "I hear that you're describing experiences that might relate to challenging past events. Our minds and bodies develop protective responses that can persist even when the danger has passed. Would it help to explore what might support you when these responses arise?";
};

/**
 * Get appropriate response for pet illness concerns
 */
const getPetIllnessSupport = (userInput: string): string => {
  // Express empathy and offer support
  return "I'm so sorry to hear that your pet is ill. It's understandable that you're feeling concerned. Pets are part of our families, and it's hard when they're not well. I'm here to listen and support you. Would you like to talk more about what's happening?";
};

/**
 * Explains the inpatient process for mental health treatment
 */
export const explainInpatientProcess = (locationData?: { city?: string; state?: string }): string => {
  // Start with a general explanation
  let response = "I understand you're curious about inpatient mental health treatment. It's a supportive environment designed for intensive care and stabilization during a mental health crisis. ";
  
  // Add details about what to expect
  response += "Typically, it involves 24/7 monitoring, medication management, therapy, and group activities. The goal is to help you regain stability and develop a plan for ongoing care.";
  
  // Add location-specific information if available
  if (locationData && locationData.city && locationData.state) {
    response += ` Since you might be near ${locationData.city}, ${locationData.state}, I can help you find local resources if you're interested.`;
  } else {
    response += " If you'd like, I can help you find resources in your area.";
  }
  
  // Add a closing statement
  response += " Remember, seeking help is a sign of strength, and I'm here to support you through this process.";
  
  return response;
};
