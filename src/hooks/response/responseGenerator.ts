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
import { detectDevelopmentalStage } from '../../utils/reflection/reflectionStrategies';
import { shouldUseConversationStarter, generateConversationStarterResponse } from '../../utils/reflection/ageAppropriateConversation';

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
  
  /**
   * Occasionally adds Roger's personal perspective as someone with autism who has developed social work skills
   * @returns A phrase that reflects Roger's unique perspective
   */
  const getRogerPerspectivePhrase = (): string => {
    // Only add these occasionally (20% chance) to keep conversations natural
    if (Math.random() > 0.2) return '';
    
    const perspectivePhrases = [
      " As someone who works in peer support, I find that clear communication helps build understanding.",
      " In my experience, directly acknowledging emotions like this can be really helpful.",
      " Through my social work training, I've learned that everyone processes experiences differently.",
      " I've found that taking time to understand exactly what people mean helps me provide better support.",
      " In my work, I've learned that structure and clarity help create meaningful conversations.",
      " As someone who sometimes finds social cues challenging, I value when people express themselves directly.",
      " My approach to peer support involves focusing on specifics rather than making assumptions.",
      " I've learned through my training that acknowledging feelings directly is important.",
      " In my experience, asking clarifying questions helps ensure I'm understanding correctly.",
      " My background in social work has taught me how important it is to truly listen to what people are saying."
    ];
    
    return perspectivePhrases[Math.floor(Math.random() * perspectivePhrases.length)];
  };
  
  const generateResponse = (
    userInput: string, 
    concernType: string | null
  ): string => {
    try {
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

      // Detect developmental stage for age-appropriate responses
      const developmentalStage = detectDevelopmentalStage(userInput);
      
      // HIGHEST PRIORITY: Check for introductions if this is the first interaction
      if (isIntroduction(userInput) && !introductionMade) {
        return generateIntroductionResponse();
      }
      
      // SECOND PRIORITY: Process any personal sharing with explicit feelings
      // This ensures we immediately acknowledge stated emotions before anything else
      if (isPersonalSharing(userInput)) {
        const personalResponse = generatePersonalSharingResponse(userInput);
        // Occasionally add Roger's perspective to personal sharing responses
        if (Math.random() < 0.3) {
          return personalResponse + getRogerPerspectivePhrase();
        }
        return personalResponse;
      }
      
      // Check if we should use a conversation starter based on context
      if (shouldUseConversationStarter(messageCount, userInput) && developmentalStage) {
        const conversationStarter = generateConversationStarterResponse(developmentalStage);
        return `${adaptiveResponseFn(userInput)} ${conversationStarter}`;
      }
      
      // Implementation of the 10-minute rule for reflections - prioritize in early conversation
      if (messageCount <= EARLY_CONVERSATION_MESSAGE_THRESHOLD) {
        // First try a reflection response for early conversation (first 10 minutes/messages)
        const reflectionResponse = generateReflectionResponse(userInput, conversationStage);
        if (reflectionResponse) {
          // Occasionally add Roger's perspective to reflection responses
          if (Math.random() < 0.25) {
            return reflectionResponse + getRogerPerspectivePhrase();
          }
          return reflectionResponse;
        }
        
        // If no reflection was generated, check for small talk
        if (isSmallTalk(userInput)) {
          return generateSmallTalkResponse(userInput);
        }
        else {
          // Use adaptive response as last resort in early conversation
          const response = adaptiveResponseFn(userInput);
          // Occasionally add Roger's perspective
          if (Math.random() < 0.2) {
            return response + getRogerPerspectivePhrase();
          }
          return response;
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
        // Occasionally add Roger's perspective
        if (Math.random() < 0.2) {
          return reflectionResponse + getRogerPerspectivePhrase();
        }
        return reflectionResponse;
      } else {
        // If no reflection was appropriate, generate an adaptive response
        const response = adaptiveResponseFn(userInput);
        // Occasionally add Roger's perspective
        if (Math.random() < 0.15) {
          return response + getRogerPerspectivePhrase();
        }
        return response;
      }
    } catch (error) {
      console.error("Error in response generation:", error);
      return "I'm listening. Would you like to tell me more about that?";
    }
  };
  
  return {
    generateResponse
  };
};
