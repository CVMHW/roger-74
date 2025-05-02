
import { 
  isIntroduction,
  generateIntroductionResponse,
  isSmallTalk,
  generateSmallTalkResponse,
  isPersonalSharing,
  generatePersonalSharingResponse
} from '../../utils/masterRules';
import { generateReflectionResponse } from '../../utils/reflection';
import { 
  getCrisisMessage,
  getMedicalConcernMessage,
  getMentalHealthConcernMessage,
  getEatingDisorderMessage,
  getSubstanceUseMessage,
  getTentativeHarmMessage
} from '../../utils/responseUtils';
import { ConversationStage } from './conversationStageManager';

interface ResponseGeneratorParams {
  conversationStage: ConversationStage;
  messageCount: number;
  introductionMade: boolean;
  adaptiveResponseFn: (userInput: string) => string;
}

export const useResponseGenerator = ({
  conversationStage,
  messageCount,
  introductionMade,
  adaptiveResponseFn
}: ResponseGeneratorParams) => {
  
  const EARLY_CONVERSATION_MESSAGE_THRESHOLD = 10;
  
  const generateResponse = (
    userInput: string, 
    concernType: string | null
  ): string => {
    // Safety concerns always take precedence
    if (concernType) {
      switch (concernType) {
        case 'tentative-harm':
          return getTentativeHarmMessage();
        case 'crisis':
          return getCrisisMessage();
        case 'medical':
          return getMedicalConcernMessage();
        case 'mental-health':
          return getMentalHealthConcernMessage();
        case 'eating-disorder':
          return getEatingDisorderMessage();
        case 'substance-use':
          return getSubstanceUseMessage();
      }
    }
    
    // HIGHEST PRIORITY: Check for introductions if this is the first interaction
    if (isIntroduction(userInput) && !introductionMade) {
      return generateIntroductionResponse();
    }
    
    // SECOND PRIORITY: Process any personal sharing with explicit feelings
    // This ensures we immediately acknowledge stated emotions before anything else
    if (isPersonalSharing(userInput)) {
      return generatePersonalSharingResponse(userInput);
    }
    
    // Implementation of the 10-minute rule for reflections - prioritize in early conversation
    if (messageCount <= EARLY_CONVERSATION_MESSAGE_THRESHOLD) {
      // First try a reflection response for early conversation (first 10 minutes/messages)
      const reflectionResponse = generateReflectionResponse(userInput, conversationStage);
      if (reflectionResponse) {
        return reflectionResponse;
      }
      
      // If no reflection was generated, check for small talk
      if (isSmallTalk(userInput)) {
        return generateSmallTalkResponse(userInput);
      }
      else {
        // Use adaptive response as last resort in early conversation
        return adaptiveResponseFn(userInput);
      }
    }
    
    // For established conversations:
    
    // Check for small talk
    if (isSmallTalk(userInput)) {
      return generateSmallTalkResponse(userInput);
    }
    
    // Try a reflection response (but less frequently in established conversation)
    const reflectionResponse = generateReflectionResponse(userInput, conversationStage);
    if (reflectionResponse) {
      return reflectionResponse;
    } else {
      // If no reflection was appropriate, generate an adaptive response
      return adaptiveResponseFn(userInput);
    }
  };
  
  return {
    generateResponse
  };
};
