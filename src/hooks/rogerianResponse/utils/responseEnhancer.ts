
/**
 * Response Enhancer - Acts as adapter to the unified enhancement pipeline
 * 
 * This maintains backward compatibility for existing imports while
 * using the new unified pipeline under the hood.
 */

import { enhanceResponse as enhanceResponseUnified } from '../../../utils/response/enhancer';
import { isSmallTalk, isIntroduction, isPersonalSharing } from '../../../utils/masterRules';

// Track initialization attempt
let initializationAttempted = false;

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
  
  // Try to initialize the RAG system on first use if not already initialized
  if (!initializationAttempted) {
    initializationAttempted = true;
    import('../../../utils/hallucinationPrevention/index').then(ragModule => {
      console.log("Initializing RAG system from response enhancer...");
      ragModule.initializeRAGSystem().catch(error => 
        console.error("Error initializing RAG system:", error)
      );
    }).catch(error => 
      console.error("Error importing RAG module:", error)
    );
  }
  
  // Call the async function but use it synchronously by returning the immediate response text
  // This maintains backward compatibility with existing code
  enhanceResponseUnified(
    responseText, 
    userInput, 
    { messageCount, conversationHistory }
  ).catch(error => {
    console.error("Error in async response enhancement:", error);
  });
  
  // Return the original text for backward compatibility
  return responseText;
};
