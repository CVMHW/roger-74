
/**
 * Response Enhancer
 * 
 * Unified enhancement pipeline for Roger's responses,
 * incorporating memory, vector knowledge, and hallucination prevention
 */

import { processResponseThroughMasterRules } from './processor';
import { retrieveAugmentation, augmentResponseWithRetrieval, addConversationExchange } from '../hallucinationPrevention/retrieval';
import { enhanceWithMeaningPerspective } from '../logotherapy/logotherapyIntegration';
import { getRogerPersonalityInsight } from '../reflection/rogerPersonality';
import { identifyEnhancedFeelings } from '../reflection/feelingDetection';
import { checkForResponseRepetition, getRepetitionRecoveryResponse, processUserMessageMemory } from './enhancer/repetitionDetection';

// Re-export these functions for backward compatibility
export { checkForResponseRepetition, getRepetitionRecoveryResponse, processUserMessageMemory };

/**
 * Enhances a response with vector-based knowledge, memory, and logotherapy
 * @param responseText Original response text
 * @param userInput User input that triggered the response
 * @param messageCount Number of messages in the conversation
 * @param conversationHistory Previous conversation messages
 * @param contextFlags Additional context information
 * @returns Enhanced response text
 */
export const enhanceResponse = async (
  responseText: string,
  userInput: string,
  messageCount: number,
  conversationHistory: string[] = [],
  contextFlags?: {
    isEverydaySituation?: boolean;
    isSmallTalkContext?: boolean;
    isIntroductionContext?: boolean;
    isPersonalSharingContext?: boolean;
  }
): Promise<string> => {
  try {
    let enhancedText = responseText;
    
    // Step 1: Process through master rules (existing functionality)
    enhancedText = processResponseThroughMasterRules(enhancedText, userInput, conversationHistory);
    
    // Step 2: Retrieve relevant vector knowledge with RAG
    try {
      const retrievalResult = await retrieveAugmentation(userInput, conversationHistory);
      if (retrievalResult.retrievedContent.length > 0) {
        enhancedText = await augmentResponseWithRetrieval(enhancedText, retrievalResult);
      }
    } catch (retrievalError) {
      console.error("RAG enhancement error:", retrievalError);
      // Continue with existing text if retrieval fails
    }
    
    // Step 3: Check if this is an early conversation or special context
    const isEarlyConversation = messageCount < 5;
    const isSmallTalk = contextFlags?.isSmallTalkContext || false;
    const isPersonalSharing = contextFlags?.isPersonalSharingContext || false;
    
    // Step 4: Add personality insights for personal sharing contexts
    if (isPersonalSharing && !isEarlyConversation) {
      try {
        const enhancedFeelings = identifyEnhancedFeelings(userInput);
        const primaryFeeling = enhancedFeelings.length > 0 ? enhancedFeelings[0].detectedWord : '';
        const personalityInsight = getRogerPersonalityInsight(userInput, primaryFeeling, messageCount > 30);
        
        if (personalityInsight) {
          // Insert at an appropriate point
          const sentences = enhancedText.split(/(?<=[.!?])\s+/);
          if (sentences.length > 3) {
            const insertPoint = Math.min(sentences.length - 2, Math.floor(sentences.length * 0.7));
            enhancedText = [
              ...sentences.slice(0, insertPoint),
              personalityInsight,
              ...sentences.slice(insertPoint)
            ].join(' ');
          } else {
            enhancedText = `${enhancedText} ${personalityInsight}`;
          }
        }
      } catch (personalityError) {
        console.error("Personality integration error:", personalityError);
      }
    }
    
    // Step 5: Enhance with logotherapy perspective for non-small-talk
    if (!isSmallTalk && !isEarlyConversation) {
      try {
        enhancedText = enhanceWithMeaningPerspective(enhancedText, userInput);
      } catch (logotherapyError) {
        console.error("Logotherapy enhancement error:", logotherapyError);
      }
    }
    
    // Step 6: Record this exchange to vector database for future reference
    try {
      addConversationExchange(userInput, enhancedText).catch(error => 
        console.error("Error recording to vector database:", error)
      );
    } catch (recordingError) {
      console.error("Vector recording error:", recordingError);
    }
    
    // Return the enhanced response
    return enhancedText;
  } catch (error) {
    console.error("Error in response enhancement:", error);
    // Return original text if enhancement fails
    return responseText;
  }
};
