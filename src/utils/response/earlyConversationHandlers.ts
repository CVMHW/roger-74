
import { isIntroduction, generateIntroductionResponse, isSmallTalk, isPersonalSharing, generatePersonalSharingResponse } from '../../utils/masterRules';
import { generateReflectionResponse } from '../reflection';
import { generateSmallTalkResponse } from '../conversation/smallTalkUtils';
import { ConversationStage } from '../../hooks/response/conversationStageManager';
import { detectDevelopmentalStage } from '../reflection/reflectionStrategies';
import { shouldUseConversationStarter, generateConversationStarterResponse } from '../reflection/ageAppropriateConversation';
import { getRogerPerspectivePhrase } from './personalityHelpers';

/**
 * Handles the logic for early conversation responses
 */
export const handleEarlyConversation = (
  userInput: string, 
  conversationStage: ConversationStage,
  messageCount: number,
  introductionMade: boolean,
  adaptiveResponseFn: (userInput: string) => string
): string | null => {
  // Check for introductions if this is the first interaction
  if (isIntroduction(userInput) && !introductionMade) {
    return generateIntroductionResponse();
  }
  
  // Process any personal sharing with explicit feelings
  if (isPersonalSharing(userInput)) {
    const personalResponse = generatePersonalSharingResponse(userInput);
    
    // Occasionally add Roger's perspective to personal sharing responses
    const perspectivePhrase = getRogerPerspectivePhrase(userInput, messageCount);
    if (perspectivePhrase) {
      return personalResponse + perspectivePhrase;
    }
    return personalResponse;
  }
  
  // Detect developmental stage for age-appropriate responses
  const developmentalStage = detectDevelopmentalStage(userInput);
  
  // Check if we should use a conversation starter based on context
  if (shouldUseConversationStarter(messageCount, userInput) && developmentalStage) {
    const conversationStarter = generateConversationStarterResponse(developmentalStage);
    return `${adaptiveResponseFn(userInput)} ${conversationStarter}`;
  }
  
  // First try a reflection response for early conversation
  const reflectionResponse = generateReflectionResponse(userInput, conversationStage, messageCount);
  if (reflectionResponse) {
    return reflectionResponse;
  }
  
  // If no reflection was generated, check for small talk
  if (isSmallTalk(userInput)) {
    return generateSmallTalkResponse(userInput, messageCount);
  }
  
  // Use adaptive response as last resort in early conversation
  const response = adaptiveResponseFn(userInput);
  
  // Occasionally add Roger's perspective
  const perspectivePhrase = getRogerPerspectivePhrase(userInput, messageCount);
  if (perspectivePhrase) {
    return response + perspectivePhrase;
  }
  
  return response;
};
