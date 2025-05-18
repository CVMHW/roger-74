
/**
 * Enhanced RAG response processing
 * With emotion-specific RAG strategies and special handling for depression
 */
import { extractEmotionsFromInput } from '../response/processor/emotions';
import { retrieveAugmentation, augmentResponseWithRetrieval } from './retrieval';

/**
 * Enhanced RAG response processing
 * Now with emotion-specific RAG strategies and special handling for depression
 * 
 * @param responseText Original response text
 * @param userInput User's input message
 * @param conversationHistory Array of previous conversation messages
 * @param emotionContext Optional emotion context from previous processing
 * @returns Enhanced response text
 */
export const enhanceResponseWithRAG = async (
  responseText: string,
  userInput: string,
  conversationHistory: string[] = [],
  emotionContext?: any
): Promise<string> => {
  try {
    // Prevent RAG processing for very short responses (likely error states)
    if (responseText.length < 20) {
      return responseText;
    }
    
    console.log("RAG: Enhancing response with advanced vector knowledge");
    
    // Extract emotions if not provided
    const emotions = emotionContext || extractEmotionsFromInput(userInput);
    
    // CRITICAL: Check for depression mentioned first - highest priority
    const hasDepressionIndicators = emotions.isDepressionMentioned || 
      /\b(depress(ed|ing|ion)?|sad|down|low|hopeless|worthless|empty|numb|feeling (bad|low|terrible|awful|horrible))\b/i.test(userInput.toLowerCase());
    
    // Create augmentation query - depression gets special handling
    let queryAugmentation = userInput;
    
    if (hasDepressionIndicators) {
      // For depression, explicitly include depression in the query
      queryAugmentation = `depression ${userInput}`;
      console.log("RAG: Depression detected, prioritizing depression context");
    } else if (emotions.hasDetectedEmotion) {
      // For other emotions, augment with detected emotion
      const primaryEmotion = emotions.explicitEmotion || 
                           (emotions.emotionalContent?.hasEmotion ? emotions.emotionalContent.primaryEmotion : null);
      
      if (primaryEmotion) {
        queryAugmentation = `${primaryEmotion} feeling ${userInput}`;
        console.log(`RAG: Emotion detected (${primaryEmotion}), augmenting query`);
      }
    }
    
    // Retrieve augmentation with enhanced query
    const augmentation = await retrieveAugmentation(queryAugmentation, conversationHistory);
    
    if (!augmentation || !augmentation.retrievedContent || augmentation.retrievedContent.length === 0) {
      console.log("RAG: No relevant augmentation found");
      return responseText;
    }
    
    // Enhanced special handling for depression
    if (hasDepressionIndicators) {
      // For depression, ensure the augmentation includes depression-relevant content
      const depressionRelevantContent = augmentation.retrievedContent.filter(content => 
        /\b(depress(ed|ing|ion)?|sad|down|low|mood|mental health|support|therapy|treatment)\b/i.test(content)
      );
      
      // If we have depression-relevant content, prioritize it
      if (depressionRelevantContent.length > 0) {
        console.log("RAG: Using depression-specific content for augmentation");
        return await augmentResponseWithRetrieval(
          responseText,
          userInput,
          { ...augmentation, retrievedContent: depressionRelevantContent }
        );
      }
    }
    
    // Normal augmentation process
    const enhancedResponse = await augmentResponseWithRetrieval(
      responseText,
      userInput,
      augmentation
    );
    
    console.log("RAG: Response enhanced with relevant knowledge");
    return enhancedResponse;
    
  } catch (error) {
    console.error("Error in RAG enhancement:", error);
    // Return original response if enhancement fails
    return responseText;
  }
};
