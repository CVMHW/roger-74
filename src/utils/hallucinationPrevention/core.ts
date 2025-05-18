
/**
 * Core functionality for hallucination prevention system
 */
import { HallucinationPreventionOptions, HallucinationProcessResult } from '../../types/hallucinationPrevention';
import { detectHallucinations } from './detector';
import { createEmotionContext } from '../response/processor/emotionHandler/emotionMisidentificationHandler';
import { extractEmotionsFromInput } from '../response/processor/emotions';

/**
 * Track initialization status
 */
let isRAGInitialized = false;

/**
 * Checks if the RAG system is ready for use
 */
export const isRAGSystemReady = () => {
  return isRAGInitialized;
};

/**
 * Set initialization status
 */
export const setRAGInitialized = (status: boolean) => {
  isRAGInitialized = status;
};

/**
 * Analyzes the conversation context and checks for hallucinations
 * Enhanced with emotion context awareness
 */
export const analyzeConversation = async (
  conversationHistory: string[],
  options: Partial<HallucinationPreventionOptions> = {}
): Promise<any> => {
  try {
    if (!conversationHistory || conversationHistory.length < 2) {
      return { analysisComplete: false, message: "Not enough conversation history" };
    }
    
    // Get the last user message and Roger's response
    const userInput = conversationHistory[conversationHistory.length - 2];
    const responseText = conversationHistory[conversationHistory.length - 1];
    
    // Extract emotions from user input
    const emotions = extractEmotionsFromInput(userInput);
    
    // Check for hallucinations with emotion awareness
    const hallucination = detectHallucinations(
      responseText,
      userInput,
      conversationHistory.slice(0, -2) // Previous history
    );
    
    // Check for emotion misidentification
    const emotionAnalysis = {
      hasDetectedEmotion: emotions.hasDetectedEmotion,
      primaryEmotion: emotions.explicitEmotion || 
                     (emotions.emotionalContent?.hasEmotion ? emotions.emotionalContent.primaryEmotion : null),
      emotionMisidentified: hallucination.isHallucination && hallucination.emotionMisidentified
    };
    
    return {
      analysisComplete: true,
      wasHallucination: hallucination.isHallucination,
      emotionAnalysis,
      hallucination: hallucination.isHallucination ? hallucination : null,
      suggestedCorrection: hallucination.isHallucination ? "Corrected response would be provided here" : null
    };
    
  } catch (error) {
    console.error("Error analyzing conversation:", error);
    return { analysisComplete: false, error: (error as Error).message };
  }
};
