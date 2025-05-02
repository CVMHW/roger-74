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
import { getRogerPersonalityInsight } from '../../utils/reflection/rogerPersonality';

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
   * Selectively adds Roger's personal perspective based on his experiences and personality
   * Based on therapeutic appropriateness and contextual relevance
   * @returns A phrase that reflects Roger's unique perspective or empty string
   */
  const getRogerPerspectivePhrase = (userInput: string): string => {
    // Only add these occasionally (15% chance) to keep conversations natural
    // And only when therapeutically appropriate
    if (Math.random() > 0.15) return '';
    
    // Check if past 30-minute mark for autism disclosure (according to rule)
    const isPastThirtyMinutes = messageCount >= 30;
    
    // Get personality-based insight
    return getRogerPersonalityInsight(userInput, '', isPastThirtyMinutes);
  };
  
  /**
   * Creates a response for mild gambling concerns that emphasizes reflection rather than crisis response
   * @param userInput The user's message about gambling
   * @returns A reflective response that acknowledges the user's feelings without escalation
   */
  const createMildGamblingResponse = (userInput: string): string => {
    // Extract keywords related to sports teams and events if present
    const lowerInput = userInput.toLowerCase();
    
    // Look for sports teams and betting context
    const sportsTeams = ['cavs', 'cavaliers', 'browns', 'guardians', 'indians', 'yankees', 'lakers', 'warriors'];
    const mentionedTeams = sportsTeams.filter(team => lowerInput.includes(team));
    const team = mentionedTeams.length > 0 ? mentionedTeams[0] : 'sports team';
    
    // Look for emotion words
    const sadPattern = /sad|down|upset|disappointed|bummed/i;
    const frustrationPattern = /frustrat|annoy|irritat|bother/i;
    
    const hasSadness = sadPattern.test(lowerInput);
    const hasFrustration = frustrationPattern.test(lowerInput);
    
    // Check for money context
    const moneyMentioned = /[$]\d+|\d+ dollars|lost \d+|won \d+|bet \d+/i.test(lowerInput);
    
    // Generate appropriate reflection based on context
    if (hasSadness && moneyMentioned && mentionedTeams.length > 0) {
      return `I hear that you're feeling disappointed about losing your bet on the ${team}. It sounds like you usually have better luck with your bets. Would you like to tell me more about how this is affecting you?`;
    } else if (hasFrustration && moneyMentioned) {
      return `It sounds like you're frustrated about the money you lost betting. Even though it might not be a huge amount for you, it's still disappointing when things don't go as expected. How are you processing this experience?`;
    } else if (moneyMentioned) {
      return `I notice you mentioned losing some money on gambling. Even when the amount isn't financially significant, it can still impact our mood. How are you feeling about it now?`;
    } else {
      return `I'm hearing that gambling is something you engage in occasionally. How do you feel about your experience with betting overall?`;
    }
  };
  
  const generateResponse = (
    userInput: string, 
    concernType: string | null
  ): string => {
    try {
      // Safety concerns always take precedence, but now handle mild gambling differently
      if (concernType) {
        // New special handling for mild gambling
        if (concernType === 'mild-gambling') {
          return createMildGamblingResponse(userInput);
        }
        
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
        // Now more carefully controlled based on therapeutic relevance
        const perspectivePhrase = getRogerPerspectivePhrase(userInput);
        if (perspectivePhrase) {
          return personalResponse + perspectivePhrase;
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
        const reflectionResponse = generateReflectionResponse(userInput, conversationStage, messageCount);
        if (reflectionResponse) {
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
          const perspectivePhrase = getRogerPerspectivePhrase(userInput);
          if (perspectivePhrase) {
            return response + perspectivePhrase;
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
      const reflectionResponse = generateReflectionResponse(userInput, conversationStage, messageCount);
      if (reflectionResponse) {
        return reflectionResponse;
      } else {
        // If no reflection was appropriate, generate an adaptive response
        const response = adaptiveResponseFn(userInput);
        // Occasionally add Roger's perspective
        const perspectivePhrase = getRogerPerspectivePhrase(userInput);
        if (perspectivePhrase) {
          return response + perspectivePhrase;
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
