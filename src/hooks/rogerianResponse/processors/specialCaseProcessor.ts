
import { MessageType } from '../../../components/Message';
import { ConcernType } from '../../../utils/reflection/reflectionTypes';
import { createMessage } from '../../../utils/messageUtils';
import { extractUserLocation } from '../../../utils/messageUtils';
import { explainInpatientProcess } from '../../../utils/safetyConcernManager';
import { extractPetType } from '../../../utils/helpers/userInfoUtils';
import { generateWeatherRelatedResponse, generateCulturalAdjustmentResponse } from '../../../utils/response/specialConcernResponses';

/**
 * Process special cases like inpatient questions, weather-related concerns, etc.
 */
export const processSpecialCases = async (
  userInput: string,
  concernType: ConcernType,
  baseProcessUserMessage: (userInput: string, responseFn: (input: string) => string, concernFn: () => ConcernType | null, multiplier?: number) => Promise<MessageType>,
  conversationHistory: string[],
  updateStage: () => void
): Promise<MessageType | null> => {
  // Check for special case patterns
  const { detectSpecialCasePatterns } = await import('../specialCaseDetection');
  const specialCaseResult = detectSpecialCasePatterns(userInput);
  
  // Extract special case flags
  const {
    isInpatientQuestion,
    isWeatherRelated,
    isCulturalAdjustment
  } = specialCaseResult;
  
  // Check for statements about wanting to understand inpatient stays
  if (isInpatientQuestion) {
    // Get location data if available
    const locationData = extractUserLocation(userInput, conversationHistory);
    
    const inpatientInfoResponse = explainInpatientProcess(locationData);
    
    // Update conversation stage before processing
    updateStage();
    
    // Process with our specific response
    return baseProcessUserMessage(
      userInput,
      () => inpatientInfoResponse,
      () => concernType
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
      const { extractConversationContext } = await import('../../../utils/conversationEnhancement/repetitionDetector');
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
  
  return null;
};
