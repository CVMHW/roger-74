
import { 
  getCrisisMessage,
  getMedicalConcernMessage,
  getMentalHealthConcernMessage,
  getEatingDisorderMessage,
  getSubstanceUseMessage,
  getTentativeHarmMessage,
  getPTSDMessage,
  getMildPTSDResponse
} from '../../utils/responseUtils';

import { ConversationStage } from './conversationStageManager';
import { detectGriefThemes, generateGriefResponse } from '../../utils/response/griefSupport';
import { ConcernType } from '../../utils/reflection/reflectionTypes';

// Import our new modular helpers
import { handleEmotionalResponses } from '../../utils/response/emotionalResponseGenerator';
import { 
  createSadnessResponse,
  createDefensiveReactionResponse,
  createWeatherRelatedResponse,
  createTraumaResponseMessage,
  createMildGamblingResponse,
  createOhioContextResponse
} from '../../utils/response/handlers';
import { handleEarlyConversation } from '../../utils/response/earlyConversationHandlers';
import { handleEstablishedConversation } from '../../utils/response/establishedConversationHandlers';

interface ResponseGeneratorParams {
  conversationStage: ConversationStage;
  messageCount: number;
  introductionMade: boolean;
  adaptiveResponseFn: (userInput: string) => string;
  conversationHistory: string[];
}

export const useResponseGenerator = ({
  conversationStage,
  messageCount,
  introductionMade,
  adaptiveResponseFn,
  conversationHistory
}: ResponseGeneratorParams) => {
  
  const EARLY_CONVERSATION_MESSAGE_THRESHOLD = 10;
  
  const generateResponse = (
    userInput: string, 
    concernType: ConcernType
  ): string => {
    try {
      // First handle any emotional responses (high priority)
      const emotionalResponse = handleEmotionalResponses(userInput, conversationHistory);
      if (emotionalResponse) {
        return emotionalResponse;
      }
      
      // Check for defensive reactions to mental health suggestions
      const defensiveReactionResponse = createDefensiveReactionResponse(userInput);
      if (defensiveReactionResponse) {
        return defensiveReactionResponse;
      }
      
      // Safety concerns always take precedence, but now properly handling weather-related concerns
      if (concernType) {
        // Special handling for weather-related concerns
        if (concernType === 'weather-related') {
          return createWeatherRelatedResponse(userInput);
        }
        
        // Special handling for mild gambling
        if (concernType === 'mild-gambling') {
          return createMildGamblingResponse(userInput);
        }
        
        // Special handling for mild PTSD
        if (concernType === 'ptsd-mild') {
          return getMildPTSDResponse(userInput);
        }
        
        // Special handling for cultural adjustment
        if (concernType === 'cultural-adjustment') {
          return `It sounds like you're navigating some significant cultural adjustments. Moving to a new country brings many challenges - from language differences to missing familiar foods and environments. These feelings of displacement are completely normal. What aspect of this transition has been most difficult for you?`;
        }
        
        // New handling for trauma responses that aren't PTSD
        if (concernType === 'trauma-response') {
          const traumaResponse = createTraumaResponseMessage(userInput);
          if (traumaResponse) {
            return traumaResponse;
          }
          // Fallback if trauma response generation fails
          return "I notice you're describing experiences that might relate to challenging past events. Our minds and bodies develop protective responses that can persist even when the danger has passed. Would it help to explore what might support you when these responses arise?";
        }
        
        switch (concernType) {
          case 'tentative-harm':
            return getTentativeHarmMessage(userInput);
          case 'crisis':
            return getCrisisMessage(userInput);
          case 'medical':
            return getMedicalConcernMessage(userInput);
          case 'mental-health':
            return getMentalHealthConcernMessage(userInput);
          case 'eating-disorder':
            return getEatingDisorderMessage(userInput);
          case 'substance-use':
            return getSubstanceUseMessage(userInput);
          case 'ptsd':
            return getPTSDMessage(userInput);
        }
      }

      // Check for normal sadness vs clinical depression
      const sadnessResponse = createSadnessResponse(userInput);
      if (sadnessResponse) {
        return sadnessResponse;
      }

      // Enhanced: Check for grief and existential loneliness responses
      const griefThemes = detectGriefThemes(userInput);
      if (griefThemes.themeIntensity >= 2) {
        // Special handling for roller coaster metaphor
        const griefResponse = generateGriefResponse(userInput);
        if (griefResponse) {
          // Grief responses should be delivered without personality additions
          return griefResponse;
        }
      }

      // Different handling based on conversation stage
      if (messageCount <= EARLY_CONVERSATION_MESSAGE_THRESHOLD) {
        // Early conversation handling
        const earlyConversationResponse = handleEarlyConversation(userInput, messageCount);
        
        if (earlyConversationResponse) {
          return earlyConversationResponse;
        }
      }
      
      // For established conversations
      return handleEstablishedConversation(
        userInput,
        conversationStage,
        messageCount,
        adaptiveResponseFn
      );
      
    } catch (error) {
      console.error("Error in response generation:", error);
      return "I'm listening. What's been going on with you?";
    }
  };
  
  return {
    generateResponse
  };
};
