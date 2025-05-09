
/**
 * Response Enhancer - Acts as adapter to the unified enhancement pipeline
 * 
 * This maintains backward compatibility for existing imports while
 * using the new unified pipeline under the hood.
 */

import { enhanceResponse as enhanceResponseUnified } from '../../../utils/response/enhancer';
import { isSmallTalk, isIntroduction, isPersonalSharing } from '../../../utils/masterRules';

/**
 * Enhances a response with memory rules, master rules, and chat log review
 * Now delegates to the unified enhancement pipeline
 */
export const enhanceResponse = (
  responseText: string,
  userInput: string,
  messageCount: number,
  conversationHistory: string[] = []
): string => {
  // Check for important context information
  const isEverydaySituation = /trip(ped)?|spill(ed)?|embarrass(ing|ed)?|awkward|class|teacher|student|bar|drink|fall|fell|stumble|social|party/i.test(userInput);
  const isSmallTalkContext = isSmallTalk(userInput);
  const isIntroductionContext = isIntroduction(userInput);
  const isPersonalSharingContext = isPersonalSharing(userInput);
  
  return enhanceResponseUnified(
    responseText, 
    userInput, 
    messageCount, 
    conversationHistory,
    {
      isEverydaySituation,
      isSmallTalkContext,
      isIntroductionContext,
      isPersonalSharingContext
    }
  );
};
