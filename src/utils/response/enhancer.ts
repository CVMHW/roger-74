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
import { extractEmotionsFromInput } from './processor/emotions';
import { checkEmotionMisidentification } from './processor/emotionHandler/emotionMisidentificationHandler';

// Import from hallucination prevention system with explicit type annotations
import { enhanceResponseWithRAG } from '../hallucinationPrevention';

// Types for context object
interface EnhancementContext {
  isEverydaySituation?: boolean;
  isSmallTalkContext?: boolean;
  isIntroductionContext?: boolean;
  isPersonalSharingContext?: boolean;
  detectedEmotions?: {
    hasDetectedEmotion: boolean;
    primaryEmotion?: string | null;
    emotionalIntensity?: string | null;
    isDepressionMentioned?: boolean;
  };
}

/**
 * Enhanced response processing with vector-based knowledge retrieval
 * and unified hallucination prevention
 */
export const enhanceResponse = async (
  responseText: string,
  userInput: string,
  messageCount: number,
  conversationHistory: string[] = [],
  context: EnhancementContext = {}
): Promise<string> => {
  try {
    console.log("ENHANCER: Processing response through unified pipeline");
    
    // Skip enhancement for very short responses (likely error states)
    if (responseText.length < 20) {
      return responseText;
    }
    
    // CRITICAL: Extract emotions from user input first - this is now done early in the pipeline
    const emotionInfo = extractEmotionsFromInput(userInput);
    
    // Update context with emotion information if not already provided
    if (!context.detectedEmotions) {
      context.detectedEmotions = {
        hasDetectedEmotion: !!emotionInfo.hasDetectedEmotion,
        primaryEmotion: emotionInfo.explicitEmotion || 
                       (emotionInfo.emotionalContent.hasEmotion ? emotionInfo.emotionalContent.primaryEmotion : null),
        emotionalIntensity: emotionInfo.emotionalContent.hasEmotion ? emotionInfo.emotionalContent.intensity : null,
        isDepressionMentioned: /\b(depress(ed|ing|ion)?|sad|down|low|hopeless|worthless|empty|numb|feeling (bad|low|terrible|awful|horrible))\b/i.test(userInput.toLowerCase())
      };
    }
    
    // Check for emotion misidentification EARLY in the pipeline
    const emotionMisidentified = checkEmotionMisidentification(responseText, userInput);
    
    // First apply memory-based processing
    let enhancedText = await processResponse(
      responseText,
      userInput,
      conversationHistory,
      context.detectedEmotions // Pass emotion context to processor
    );
    
    // CRITICAL: Determine if RAG should be applied - UPDATED LOGIC
    // We now ALWAYS apply RAG for emotional content, especially depression
    const shouldApplyRAG = 
      // ALWAYS apply RAG for emotional content, regardless of length
      context.detectedEmotions?.isDepressionMentioned ||
      context.detectedEmotions?.hasDetectedEmotion ||
      emotionMisidentified ||
      // Otherwise, use less restrictive length check
      (!context.isSmallTalkContext && userInput.length > 10);
    
    console.log("ENHANCER: Should apply RAG:", shouldApplyRAG, 
                "Emotion detected:", context.detectedEmotions?.hasDetectedEmotion,
                "Depression mentioned:", context.detectedEmotions?.isDepressionMentioned);
    
    if (shouldApplyRAG) {
      try {
        // Apply RAG enhancement with emotional context
        enhancedText = await enhanceResponseWithRAG(
          enhancedText,
          userInput,
          conversationHistory,
          context.detectedEmotions // Pass emotion context to RAG
        );
      } catch (ragError) {
        console.error("Error in RAG enhancement:", ragError);
        // Continue with current text if RAG fails
      }
    }
    
    // CRITICAL: Always check for repetition last
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
