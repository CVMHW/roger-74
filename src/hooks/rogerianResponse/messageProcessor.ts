
import { ConcernType } from '../../utils/reflection/reflectionTypes';
import { MessageType } from '../../components/Message';
import { createMessage } from '../../utils/messageUtils';
import { extractPossibleLocation, generateLocationRequestMessage, extractUserLocation } from '../../utils/messageUtils';
import { explainInpatientProcess } from '../../utils/safetyConcernManager';
import { extractPetType } from '../../utils/helpers/userInfoUtils';
import { generateWeatherRelatedResponse, generateCulturalAdjustmentResponse } from '../../utils/response/specialConcernResponses';
import { determineResponseTimeMultiplier } from './specialCaseDetection';
import { generateSafetyResponse } from './safetyResponseGenerator';

/**
 * Processes user messages and generates appropriate responses
 */
export const processUserMessage = async (
  userInput: string,
  detectConcerns: (userInput: string) => ConcernType,
  generateResponse: (userInput: string, concernType: ConcernType) => string,
  baseProcessUserMessage: (userInput: string, responseFn: (input: string) => string, concernFn: () => ConcernType | null, multiplier?: number) => Promise<MessageType>,
  conversationHistory: string[],
  clientPreferences: any,
  updateStage: () => void
): Promise<MessageType> => {
  try {
    // Check for special case patterns
    const { detectSpecialCasePatterns } = await import('./specialCaseDetection');
    const {
      isInpatientQuestion,
      isWeatherRelated,
      isCulturalAdjustment
    } = detectSpecialCasePatterns(userInput);
    
    // Check for statements about wanting to understand inpatient stays
    if (isInpatientQuestion) {
      // If the user is asking about inpatient stays, provide accurate information
      // Get location data if available
      const locationData = extractUserLocation(userInput, conversationHistory);
      
      const inpatientInfoResponse = explainInpatientProcess(locationData);
      
      // Update conversation stage before processing
      updateStage();
      
      // Process with our specific response
      return baseProcessUserMessage(
        userInput,
        () => inpatientInfoResponse,
        () => detectConcerns(userInput)
      );
    }
    
    // Check for weather-related concerns as high priority
    if (isWeatherRelated) {
      const weatherResponse = generateWeatherRelatedResponse(userInput);
      
      // Update conversation stage
      updateStage();
      
      // Return a weather-specific response
      return Promise.resolve(createMessage(weatherResponse, 'roger', 'weather-related'));
    }
    
    // Check for cultural adjustment concerns
    if (isCulturalAdjustment) {
      try {
        // Check if we have explicit location mentions
        const { extractConversationContext } = await import('../../utils/conversationEnhancement/repetitionDetector');
        const context = extractConversationContext(userInput, conversationHistory);
        
        if (context && context.hasContext) {
          const culturalResponse = generateCulturalAdjustmentResponse(userInput);
          
          // Update conversation stage
          updateStage();
          
          // Return a culturally sensitive response
          return Promise.resolve(createMessage(culturalResponse, 'roger', 'cultural-adjustment'));
        }
      } catch (error) {
        console.error("Error processing cultural adjustment:", error);
      }
    }

    // Check for pet illness or cancer mentions
    try {
      const detectionUtils = await import('../../utils/detectionUtils');
      
      // Check for pet illness concerns
      if (detectionUtils.detectPetIllnessConcerns(userInput)) {
        // Get specific illness details
        const illnessDetails = detectionUtils.detectSpecificIllness(userInput);
        
        // Generate appropriate response for pet illness
        const petIllnessResponse = detectionUtils.generatePetIllnessResponse({
          petType: extractPetType(userInput),
          illnessType: illnessDetails.illnessType,
          severity: illnessDetails.severity
        });
        
        // Update conversation stage
        updateStage();
        
        // Process with our specific response
        return baseProcessUserMessage(
          userInput,
          () => petIllnessResponse,
          () => 'pet-illness' as ConcernType // Special concern type for pet illness
        );
      }
    } catch (error) {
      console.error("Error checking for illness mentions:", error);
    }
    
    // Check for safety concerns to prioritize deescalation and customer service
    const concernType = detectConcerns(userInput);
    
    // For weather-related concerns, use our specialized response generator
    if (concernType === 'weather-related') {
      const weatherResponse = generateWeatherRelatedResponse(userInput);
      
      // Update conversation stage
      updateStage();
      
      return baseProcessUserMessage(
        userInput,
        () => weatherResponse,
        () => concernType 
      );
    }
    // For safety concerns, use our enhanced safety response generator
    else if (concernType && 
        ['crisis', 'tentative-harm', 'mental-health', 'ptsd', 'trauma-response', 'pet-illness'].includes(concernType)) {
      
      // Update conversation stage
      updateStage();
      
      return baseProcessUserMessage(
        userInput,
        () => generateSafetyResponse(userInput, concernType, clientPreferences, conversationHistory),
        () => concernType,
        1.3 // Increase response time for safety concerns
      );
    }
    
    // Calculate appropriate response time multiplier based on content
    const responseTimeMultiplier = await determineResponseTimeMultiplier(userInput, concernType);
    
    // For all other cases, use the regular processing pipeline
    updateStage();
    
    const wrappedGenerateResponse = (input: string) => {
      return generateResponse(input, concernType);
    };
    
    return baseProcessUserMessage(
      userInput,
      wrappedGenerateResponse,
      () => concernType,
      responseTimeMultiplier // Pass the multiplier to adjust response time
    );
  } catch (error) {
    console.error("Error in processUserMessage:", error);
    // Return a fallback response if an error occurs
    return Promise.resolve(createMessage(
      "I'm sorry, I'm having trouble responding right now. Could you try again?", 
      'roger'
    ));
  }
};
