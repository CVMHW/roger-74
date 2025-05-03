
import { detectEnhancedFeelings, getPersistentFeelings, getDominantTopics } from '../../../utils/reflection/feelingDetection';

/**
 * Detects patterns in user input to create better responses
 */
export const detectPatterns = async (userInput: string): Promise<{
  persistentFeelings: string[];
  dominantTopics: string[];
  enhancedResponse: string | null;
}> => {
  try {
    // Analyze message with pattern matching
    const feelingResult = await detectEnhancedFeelings(userInput);
    
    // For new conversations, don't attempt to use memory since there isn't any yet
    if (!userInput || userInput.length < 10) {
      return {
        persistentFeelings: [],
        dominantTopics: [],
        enhancedResponse: null
      };
    }
    
    // Extract topics from the current message
    const currentTopics = feelingResult.topics || [];
    const currentFeelings = feelingResult.allFeelings || [];
    
    // For initial messages, create a response based on current input only
    if (currentTopics.length > 0 || currentFeelings.length > 0) {
      let enhancedResponse = "";
      
      // Create context-aware response based on current message only
      if (currentFeelings.length > 0) {
        const primaryFeeling = currentFeelings[0];
        enhancedResponse = `I hear you're feeling ${primaryFeeling}. `;
        
        // Add relevant follow-up based on emotion
        if (primaryFeeling === 'embarrassed' || primaryFeeling === 'awkward') {
          enhancedResponse += "Social situations like that can be really uncomfortable. ";
        } else if (primaryFeeling === 'frustrated' || primaryFeeling === 'angry') {
          enhancedResponse += "That sounds frustrating. ";
        } else if (primaryFeeling === 'sad') {
          enhancedResponse += "That sounds difficult. ";
        }
      }
      
      // Acknowledge topics from current message
      if (currentTopics.length > 0) {
        if (!enhancedResponse) {
          enhancedResponse = `I hear you're dealing with ${currentTopics.join(", ")}. `;
        }
      }
      
      // Only for longer messages with clear content
      if (enhancedResponse && userInput.length > 15) {
        enhancedResponse += "Would you like to tell me more about what happened?";
        
        return {
          persistentFeelings: currentFeelings,
          dominantTopics: currentTopics,
          enhancedResponse
        };
      }
    }
    
    // For most conversations, safely access memory systems
    const persistentFeelings = getPersistentFeelings();
    const dominantTopics = getDominantTopics();
    
    // Only use memory systems for established conversations
    // and when we have reliable memory data
    if ((persistentFeelings.length > 0 || dominantTopics.length > 0) && 
        persistentFeelings.length + dominantTopics.length >= 2) {
        
      // Create enhanced context-aware response
      let enhancedResponse = "";
      
      // Acknowledge persistent emotions if present
      if (persistentFeelings.length > 0) {
        enhancedResponse = `I remember you've mentioned feeling ${persistentFeelings.join(", ")} several times. `;
        
        // Add relevant follow-up based on emotion
        if (persistentFeelings.includes('angry')) {
          enhancedResponse += "It sounds like this is really frustrating for you. ";
        } else if (persistentFeelings.includes('sad')) {
          enhancedResponse += "This seems to be weighing heavily on you. ";
        } else if (persistentFeelings.includes('anxious')) {
          enhancedResponse += "This appears to be causing you some worry. ";
        }
      }
      
      // Acknowledge dominant topics
      if (dominantTopics.length > 0) {
        if (enhancedResponse) {
          enhancedResponse += "I also notice we've been talking about ";
        } else {
          enhancedResponse = "I notice we've been focusing on ";
        }
        enhancedResponse += `${dominantTopics.join(", ")}. `;
      }
      
      // Add appropriate follow-up question
      if (enhancedResponse) {
        enhancedResponse += "What aspect of this feels most important for us to discuss right now?";
        
        // If this is detailed enough, return it
        if (enhancedResponse.length > 80) {
          return {
            persistentFeelings,
            dominantTopics,
            enhancedResponse
          };
        }
      }
    }
    
    return {
      persistentFeelings: [],
      dominantTopics: [],
      enhancedResponse: null
    };
  } catch (error) {
    console.error("Error in pattern detection:", error);
    return {
      persistentFeelings: [],
      dominantTopics: [],
      enhancedResponse: null
    };
  }
};
