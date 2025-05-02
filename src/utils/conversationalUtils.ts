
/**
 * Utilities for generating conversational responses
 */
import { generateRogerianResponse } from './rogerianPrinciples';
import { generateCVMHWInfoResponse } from './conversation/cvmhwResponseGenerator';
import { generateCollaborativeResponse } from './conversation/collaborativeResponseGenerator';
import { appropriateResponses } from './conversation/generalResponses';
import { adaptToneForClientPreference } from './safetySupport';
import { ConcernType } from './reflection/reflectionTypes';

// Export all the imported functionality
export * from './conversation/cvmhwInfo';
export * from './conversation/collaborativeSupportPrinciples';
export * from './conversation/clientCenteredApproach';
export * from './conversation/cvmhwResponseGenerator';
export * from './conversation/collaborativeResponseGenerator';
export * from './conversation/generalResponses';
export * from './safetySupport';

// Function to detect if the conversation suggests client-specific preferences
export const detectClientPreferences = (userInput: string, conversationHistory: string[] = []) => {
  const combinedText = [userInput, ...conversationHistory].join(" ").toLowerCase();
  
  const formalLanguageIndicators = [
    'formal', 'professional', 'business', 'proper', 'corporate',
    'respectful', 'sir', 'madam', 'mr.', 'ms.', 'mrs.', 'dr.'
  ];
  
  const directApproachIndicators = [
    'straight to the point', 'direct', 'concrete', 'specifically',
    'exactly', 'precisely', 'no nonsense', 'bottom line', 'get to the point'
  ];
  
  const firstTimeIndicators = [
    'first time', 'never before', 'new to this', 'never tried', 
    'finally decided', 'took the step', 'never spoken', 'never talked'
  ];
  
  return {
    prefersFormalLanguage: formalLanguageIndicators.some(word => combinedText.includes(word)),
    prefersDirectApproach: directApproachIndicators.some(word => combinedText.includes(word)),
    isFirstTimeWithMentalHealth: firstTimeIndicators.some(phrase => combinedText.includes(phrase))
  };
};

// Function to generate appropriate conversational responses based on user input context
export const generateConversationalResponse = (
  userInput: string, 
  conversationHistory: string[] = [],
  concernType?: ConcernType | null
): string => {
  // Detect client preferences from conversation
  const clientPreferences = detectClientPreferences(userInput, conversationHistory);
  
  // First check if the user is asking about CVMHW specifically
  const cvmhwResponse = generateCVMHWInfoResponse(userInput);
  if (cvmhwResponse) {
    return adaptToneForClientPreference(cvmhwResponse, clientPreferences);
  }
  
  // Next check if the user is asking about the collaborative approach
  const collaborativeResponse = generateCollaborativeResponse(userInput);
  if (collaborativeResponse) {
    return adaptToneForClientPreference(collaborativeResponse, clientPreferences);
  }
  
  // Check if a Rogerian-specific response is appropriate
  const rogerianResponse = generateRogerianResponse(userInput);
  if (rogerianResponse) {
    return adaptToneForClientPreference(rogerianResponse, clientPreferences);
  }
  
  // For safety concerns, always ensure deescalation approach
  if (concernType && ['crisis', 'tentative-harm', 'substance-use'].includes(concernType)) {
    // Get an appropriate response from the general responses
    const baseResponse = appropriateResponses[Math.floor(Math.random() * appropriateResponses.length)];
    
    // Always adapt tone for safety concerns based on client preferences
    return adaptToneForClientPreference(baseResponse, {
      ...clientPreferences,
      // For safety concerns, always add extra care for first-time mental health engagement
      isFirstTimeWithMentalHealth: true
    });
  }
  
  // If no specific pattern is matched, use the general human-like responses
  // with adaptation for detected preferences
  const baseResponse = appropriateResponses[Math.floor(Math.random() * appropriateResponses.length)];
  return adaptToneForClientPreference(baseResponse, clientPreferences);
};
