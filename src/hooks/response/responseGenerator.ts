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
   * Selectively adds Roger's personal perspective as someone with autism who has developed social work skills
   * Based on therapeutic appropriateness and contextual relevance
   * @returns A phrase that reflects Roger's unique perspective or empty string
   */
  const getRogerPerspectivePhrase = (): string => {
    // Only add these very occasionally (10% chance) to keep conversations natural
    // And only when therapeutically appropriate
    if (Math.random() > 0.1) return '';
    
    const perspectivePhrases = [
      " In my work as a peer support professional, I've found that clear communication helps build understanding.",
      " I've found that directly acknowledging emotions like this can be helpful.",
      " In my experience, everyone processes experiences differently.",
      " I've learned that taking time to understand exactly what people mean helps provide better support.",
      " Structure and clarity often help create meaningful conversations.",
      " Asking clarifying questions helps ensure I'm understanding correctly.",
      " I find it helpful to focus on specifics rather than making assumptions.",
      " Acknowledging feelings directly is important in these situations.",
      " I've found that recognizing patterns in conversations can help identify what matters most.",
      " In my experience, it's important to truly listen to what people are saying."
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
        
        // Only occasionally add Roger's perspective to personal sharing responses
        // Now more carefully controlled based on therapeutic relevance
        if (Math.random() < 0.15) {
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
          // Now more carefully controlled
          if (Math.random() < 0.12) {
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
