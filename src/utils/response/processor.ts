
/**
 * Main response processor
 * 
 * Enhanced with improved emotion detection and integration
 */

import { processEmotions, extractEmotionsFromInput, createEmotionMemoryContext } from './processor/emotions';
import { checkEmotionMisidentification, fixEmotionMisidentification, performFinalEmotionVerification } from './processor/emotionHandler/emotionMisidentificationHandler';
import { integrateEmotionsAcrossAllSystems, integrateEmotionsWithMemory, createEmotionalLookback } from '../emotions/emotionalIntegration';
import { preventHallucinations } from '../hallucinationPrevention/processor';
import { hasRepeatedContent, fixRepeatedContent } from '../hallucinationPrevention/repetitionHandler';

/**
 * Comprehensive response processing
 * Enhanced with improved emotion detection and integration
 * 
 * @param responseText Original response text
 * @param userInput User's message
 * @param conversationHistory Recent conversation history
 * @param emotionContext Optional emotion context from previous processing
 * @returns Enhanced response text
 */
export const processResponse = async (
  responseText: string,
  userInput: string,
  conversationHistory: string[] = [],
  emotionContext?: any
): Promise<string> => {
  try {
    console.log("PROCESSOR: Processing response through emotion-enhanced pipeline");
    
    // Skip processing for very short responses (likely error states)
    if (responseText.length < 20) {
      return responseText;
    }
    
    // PHASE 1: CRITICAL EMOTION DETECTION
    // Extract emotions if not provided
    const emotions = emotionContext || extractEmotionsFromInput(userInput);
    
    // CRITICAL: Check for depression first - highest priority
    const hasDepressionIndicators = emotions?.isDepressionMentioned || 
      /\b(depress(ed|ing|ion)?|sad|down|low|hopeless|worthless|empty|numb|feeling (bad|low|terrible|awful|horrible))\b/i.test(userInput.toLowerCase());
    
    if (hasDepressionIndicators && !responseText.toLowerCase().includes("depress")) {
      console.log("PROCESSOR: CRITICAL - Depression detected but not acknowledged");
      
      // Force depression acknowledgment
      if (/^(I hear|I understand|It sounds like|Thank you)/i.test(responseText)) {
        responseText = responseText.replace(
          /^(I hear|I understand|It sounds like|Thank you)([^.]*)\./i,
          `$1 that you're feeling depressed.`
        );
      } else {
        responseText = `I'm sorry to hear that you're feeling depressed. ${responseText}`;
      }
    }
    
    // PHASE 2: EMOTIONAL PROCESSING
    // Check for emotion misidentification
    const emotionMisidentified = checkEmotionMisidentification(responseText, userInput);
    
    if (emotionMisidentified) {
      console.log("PROCESSOR: Emotion misidentification detected - fixing");
      responseText = fixEmotionMisidentification(responseText, userInput);
    }
    
    // Process emotions in detail
    responseText = processEmotions(responseText, userInput, emotions);
    
    // PHASE 3: HALLUCINATION PREVENTION
    // Look back at recent emotions for context
    const recentEmotions = createEmotionalLookback(conversationHistory.slice(-5));
    
    // Run hallucination prevention with emotion awareness
    const hallucinationResult = preventHallucinations(
      responseText,
      userInput,
      conversationHistory,
      {
        enableRAG: true,
        enableReasoning: true,
        enableDetection: true,
        reasoningThreshold: 0.7,
        // Use proper context format for hallucination prevention
        emotionAwareness: {
          emotions,
          recentEmotions,
          hasConsistentDepression: recentEmotions.hasConsistentDepression
        }
      }
    );
    
    // Apply hallucination fixes if needed
    if (hallucinationResult.wasRevised) {
      console.log("PROCESSOR: Hallucination detected and fixed");
      responseText = hallucinationResult.processedResponse;
    }
    
    // PHASE 4: REPETITION HANDLING
    // Fix any repeated content
    if (hasRepeatedContent(responseText)) {
      console.log("PROCESSOR: Fixing repeated content");
      responseText = fixRepeatedContent(responseText);
    }
    
    // PHASE 5: FINAL VERIFICATION
    // Final verification to ensure emotional consistency
    responseText = performFinalEmotionVerification(responseText, userInput, emotions);
    
    // Track this interaction in memory systems
    try {
      const emotionMemory = integrateEmotionsWithMemory(userInput, responseText);
      // Memory storage would happen here in a real implementation
    } catch (memoryError) {
      console.error("PROCESSOR: Error in memory integration:", memoryError);
    }
    
    console.log("PROCESSOR: Processing complete");
    return responseText;
    
  } catch (error) {
    console.error("Error in response processor:", error);
    
    // SAFETY: Even in error, check for depression
    const hasDepressionIndicators = /\b(depress(ed|ing|ion)?|sad|down|low|hopeless|worthless|empty|numb|feeling (bad|low|terrible|awful|horrible))\b/i.test(userInput.toLowerCase());
    
    if (hasDepressionIndicators && !responseText.toLowerCase().includes("depress")) {
      // Force depression acknowledgment even in error case
      return `I hear that you're feeling depressed. ${responseText}`;
    }
    
    // Return original response if processing fails
    return responseText;
  }
};
