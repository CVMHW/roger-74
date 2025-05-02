/**
 * Utilities for generating responses to specific concerns
 */

// Import the teen response utilities
import { isLikelyTeenMessage, generateTeenResponse } from './response/teenResponseUtils';
import { detectCommonProblems } from './detectionUtils/problemDetection';

// Export existing functions
export * from './responseUtils/petHealthResponses';

// Export other utility functions
export const getCrisisMessage = (userMessage: string): string => {
  // Check if this is likely a teen message
  if (isLikelyTeenMessage(userMessage)) {
    return "I notice that you're going through something really difficult right now. It takes courage to talk about these feelings. Many teens face similar struggles, and there are people who can help. Would you feel comfortable talking more about what's going on?";
  }
  
  // Standard adult crisis message
  return "I can hear that you're going through a really difficult time right now. Many people experience moments of crisis, and it's important to know that help is available. Would you like to talk more about what's happening?";
};

export const getMedicalConcernMessage = (userMessage: string): string => {
  // Check if this is likely a teen message
  if (isLikelyTeenMessage(userMessage)) {
    return "Health concerns can feel especially confusing as a teenager when your body is already going through so many changes. Many teens worry about similar things. Would you like to share more about what's concerning you?";
  }
  
  // Standard adult medical message
  return "I understand you're experiencing some health concerns, which can be both physically and emotionally challenging. Many people find it helpful to talk through medical issues. Would you like to share more about what you're experiencing?";
};

// Similar teen-aware versions for other response types...
export const getMentalHealthConcernMessage = (userMessage: string): string => {
  // Check if this is likely a teen message and use teen-appropriate language
  if (isLikelyTeenMessage(userMessage)) {
    return "Mental health challenges can feel especially intense during the teen years when everything else is changing too. Many teens go through similar struggles, and it's brave of you to talk about this. Would you like to share more about what you're experiencing?";
  }
  
  return "I understand you may be experiencing some mental health challenges right now. These experiences are common and many people face similar struggles. Would you like to talk more about what you're going through?";
};

export const getEatingDisorderMessage = (userMessage: string): string => {
  if (isLikelyTeenMessage(userMessage)) {
    return "Body image and eating concerns are really common during the teen years when there's so much pressure to look a certain way. Many teens struggle with similar feelings. Would you like to talk more about what you're experiencing?";
  }

  return "I understand you may be experiencing some concerns related to eating or body image. These are complex issues that many people struggle with. Would you like to share more about what you're going through?";
};

export const getSubstanceUseMessage = (userMessage: string): string => {
  if (isLikelyTeenMessage(userMessage)) {
    return "Navigating situations involving substances can be really challenging as a teenager when there's a lot of peer pressure and curiosity. Many teens have questions or concerns about this. Would you feel comfortable sharing more about what's on your mind?";
  }

  return "I understand you may be experiencing some concerns related to substance use. Many people face similar challenges and find it helpful to talk through these issues. Would you like to share more about your situation?";
};

export const getTentativeHarmMessage = (userMessage: string): string => {
  if (isLikelyTeenMessage(userMessage)) {
    return "I notice you're expressing some thoughts that sound concerning. The teenage years can be incredibly difficult sometimes, and many teens have thoughts about harm when they're going through tough times. I'm here to listen if you'd like to talk more about these feelings.";
  }

  return "I notice you're expressing some thoughts that sound concerning. Many people have thoughts about harm during difficult times. I'm here to listen if you'd like to talk more about what you're experiencing.";
};

// Additional helper functions
export const processTeenConcerns = (userMessage: string): {
  isTeenMessage: boolean;
  concernCategory?: string;
  specificIssue?: string | null;
  response?: string;
} => {
  const isTeenMessage = isLikelyTeenMessage(userMessage);
  
  if (isTeenMessage) {
    // Detect specific teen concerns
    const problemDetails = detectCommonProblems(userMessage);
    
    // Generate age-appropriate response
    const response = generateTeenResponse({
      ageGroup: 'teen',
      concernCategory: problemDetails.category || undefined,
      specificIssue: problemDetails.specificIssue,
      userMessage
    });
    
    return {
      isTeenMessage,
      concernCategory: problemDetails.category || undefined,
      specificIssue: problemDetails.specificIssue,
      response
    };
  }
  
  return { isTeenMessage };
};

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
  
  // First check if this is likely a teen message
  if (isLikelyTeenMessage(userInput)) {
    const teenResponse = processTeenConcerns(userInput);
    if (teenResponse.response) {
      return teenResponse.response;
    }
  }
  
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
