
/**
 * Utilities for generating conversational responses
 */
import { generateRogerianResponse } from './rogerianPrinciples';
import { generateCVMHWInfoResponse } from './conversation/cvmhwResponseGenerator';
import { generateCollaborativeResponse } from './conversation/collaborativeResponseGenerator';
import { appropriateResponses } from './conversation/generalResponses';
import { adaptToneForClientPreference } from './safetySupport';
import { ConcernType } from './reflection/reflectionTypes';
import { 
  cleanFillerWords, 
  detectFillerPatterns, 
  generateCasualSpeechResponse 
} from './conversationEnhancement/fillerWordProcessor';
import { 
  detectOhioReferences,
  generateOhioContextResponse,
  mapReferenceToMentalHealthTopic
} from './conversationEnhancement/ohioContextManager';
import { 
  detectEmotionalPatterns,
  detectRhetoricalPatterns,
  detectSarcasm,
  generateEmotionalResponse,
  generateRhetoricalResponse,
  generateSarcasmResponse
} from './conversationEnhancement/emotionalInputHandler';

// Export all the imported functionality
export * from './conversation/cvmhwInfo';
export * from './conversation/collaborativeSupportPrinciples';
export * from './conversation/clientCenteredApproach';
export * from './conversation/cvmhwResponseGenerator';
export * from './conversation/collaborativeResponseGenerator';
export * from './conversation/generalResponses';
export * from './safetySupport';

// Enhanced client preference detection
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

/**
 * Enhanced function to generate appropriate conversational responses based on user input context
 * Incorporates Ohio context, filler word processing, and emotional/rhetorical handling
 * @param userInput User's message
 * @param conversationHistory Previous messages for context
 * @param concernType Any detected safety concerns
 * @returns Appropriate response
 */
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
  
  // Process filler words and detect patterns
  const cleanedInput = cleanFillerWords(userInput);
  const fillerPatterns = detectFillerPatterns(userInput);
  
  // Detect Ohio-specific references
  const ohioReferences = detectOhioReferences(userInput);
  
  // Detect emotional and rhetorical patterns
  const emotionalPatterns = detectEmotionalPatterns(userInput);
  const rhetoricalPatterns = detectRhetoricalPatterns(userInput);
  const isSarcastic = detectSarcasm(userInput);
  
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
  
  // Generate response strategies for different input types
  const casualSpeechStrategy = generateCasualSpeechResponse(
    userInput, 
    cleanedInput, 
    fillerPatterns
  );
  
  const ohioContextStrategy = generateOhioContextResponse(ohioReferences);
  
  // Prioritize response types based on intensity and relevance
  
  // 1. High intensity emotional content takes highest priority
  if (emotionalPatterns.hasEmotionalContent && emotionalPatterns.intensity === 'high') {
    const emotionalResponse = generateEmotionalResponse(emotionalPatterns);
    return adaptToneForClientPreference(emotionalResponse, clientPreferences);
  }
  
  // 2. Sarcasm detection and handling
  if (isSarcastic) {
    const sarcasmResponse = generateSarcasmResponse();
    return adaptToneForClientPreference(sarcasmResponse, clientPreferences);
  }
  
  // 3. Rhetorical questions
  if (rhetoricalPatterns.isRhetorical) {
    const rhetoricalResponse = generateRhetoricalResponse(rhetoricalPatterns);
    return adaptToneForClientPreference(rhetoricalResponse, clientPreferences);
  }
  
  // 4. Medium intensity emotional content
  if (emotionalPatterns.hasEmotionalContent) {
    const emotionalResponse = generateEmotionalResponse(emotionalPatterns);
    return adaptToneForClientPreference(emotionalResponse, clientPreferences);
  }
  
  // 5. Ohio-specific context if present
  if (ohioContextStrategy.shouldIncludeLocalReference) {
    // Create a response that bridges Ohio reference to mental health
    const ohioReference = ohioReferences.detectedLocations[0] || 
                         ohioReferences.detectedCulturalReferences[0];
    
    if (ohioReference) {
      const mentalHealthConnection = mapReferenceToMentalHealthTopic(ohioReference);
      const response = `${ohioContextStrategy.opener}${mentalHealthConnection}`;
      return adaptToneForClientPreference(response, clientPreferences);
    }
  }
  
  // 6. Handle casual speech and hesitation patterns
  if (fillerPatterns.hasHighFillerDensity || fillerPatterns.potentialHesitation) {
    // Use the opener from casual speech strategy
    const baseResponse = appropriateResponses[Math.floor(Math.random() * appropriateResponses.length)];
    const response = `${casualSpeechStrategy.suggestedOpener}${baseResponse}`;
    return adaptToneForClientPreference(response, clientPreferences);
  }
  
  // If no specific pattern is matched, use the general human-like responses
  // with adaptation for detected preferences
  const baseResponse = appropriateResponses[Math.floor(Math.random() * appropriateResponses.length)];
  return adaptToneForClientPreference(baseResponse, clientPreferences);
};
