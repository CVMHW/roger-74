
/**
 * Response Enhancer
 * 
 * Unified enhancement pipeline for Roger's responses,
 * incorporating memory, vector knowledge, and hallucination prevention
 */

import { processResponse } from './processor';
import { retrieveAugmentation, augmentResponseWithRetrieval, addConversationExchange } from '../hallucinationPrevention/retrieval';
import { enhanceWithMeaningPerspective } from '../logotherapy/logotherapyIntegration';
import { getRogerPersonalityInsight } from '../reflection/rogerPersonality';
import { identifyEnhancedFeelings } from '../reflection/feelingDetection';
import { checkForResponseRepetition, getRepetitionRecoveryResponse, processUserMessageMemory } from './enhancer/repetitionDetection';

// Import from hallucination prevention system
import { enhanceResponseWithRAG } from '../hallucinationPrevention';

/**
 * Enhanced response processing with vector-based knowledge retrieval
 * and unified hallucination prevention
 */
export const enhanceResponse = async (
  responseText: string,
  userInput: string,
  messageCount: number,
  conversationHistory: string[] = [],
  context: {
    isEverydaySituation?: boolean;
    isSmallTalkContext?: boolean;
    isIntroductionContext?: boolean;
    isPersonalSharingContext?: boolean;
  } = {}
): Promise<string> => {
  try {
    console.log("ENHANCER: Processing response through unified pipeline");
    
    // Skip enhancement for very short responses (likely error states)
    if (responseText.length < 20) {
      return responseText;
    }
    
    // First apply memory-based processing
    let enhancedText = await processResponse(
      responseText,
      userInput,
      conversationHistory
    );
    
    // Next, enhance with RAG if appropriate context
    // We avoid RAG for small talk, introductions, and very short user inputs
    const shouldApplyRAG = !context.isSmallTalkContext && 
                           !context.isIntroductionContext &&
                           userInput.length > 30;
    
    if (shouldApplyRAG) {
      try {
        // Apply RAG enhancement
        enhancedText = await enhanceResponseWithRAG(
          enhancedText,
          userInput,
          conversationHistory
        );
      } catch (ragError) {
        console.error("Error in RAG enhancement:", ragError);
        // Continue with current text if RAG fails
      }
    }
    
    // Always check for repetition last
    if (checkForResponseRepetition(enhancedText)) {
      console.log("ENHANCER: Repetition detected, using recovery response");
      return getRepetitionRecoveryResponse();
    }
    
    return enhancedText;
  } catch (error) {
    console.error("Error in response enhancer:", error);
    // Return original response if enhancement fails
    return responseText;
  }
};

// Re-export for backward compatibility
export { 
  processUserMessageMemory,
  checkForResponseRepetition,
  getRepetitionRecoveryResponse
};
