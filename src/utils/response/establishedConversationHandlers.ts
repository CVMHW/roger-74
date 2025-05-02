
import { isSmallTalk } from '../../utils/masterRules';
import { generateReflectionResponse } from '../reflection';
import { generateSmallTalkResponse } from '../conversation/smallTalk';
import { ConversationStage } from '../../hooks/response/conversationStageManager';
import { getRogerPerspectivePhrase } from './personalityHelpers';

/**
 * Handles the logic for established conversation responses
 */
export const handleEstablishedConversation = (
  userInput: string,
  conversationStage: ConversationStage,
  messageCount: number,
  adaptiveResponseFn: (userInput: string) => string
): string => {
  // Check for small talk
  if (isSmallTalk(userInput)) {
    return generateSmallTalkResponse(userInput, messageCount);
  }
  
  // Try a reflection response (but less frequently in established conversation)
  const reflectionResponse = generateReflectionResponse(userInput, conversationStage, messageCount);
  if (reflectionResponse) {
    return reflectionResponse;
  } 
  
  // If no reflection was appropriate, generate an adaptive response
  const response = adaptiveResponseFn(userInput);
  
  // Occasionally add Roger's perspective
  const perspectivePhrase = getRogerPerspectivePhrase(userInput, messageCount);
  if (perspectivePhrase) {
    return response + perspectivePhrase;
  }
  
  return response;
};
