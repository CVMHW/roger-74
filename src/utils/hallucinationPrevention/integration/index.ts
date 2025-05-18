/**
 * RAG Integration - Unified Module
 * 
 * Connects all Roger's components with the vector knowledge system
 */

// Import specific integrations
import { enhanceRogerianResponse } from './rogerian';
import { enhanceLogotherapyResponse } from './logotherapy';
import { enhanceCrisisResponse } from './crisis';
import { enhanceWithPersonality } from './personality';

// Import type detection utilities
import { isSmallTalk, isIntroduction, isPersonalSharing } from '../../masterRules';
import { isEmergency, isDirectMedicalAdvice } from '../../masterRules/unconditionalRuleProtections';
import { initializeRetrievalSystem, addConversationExchange } from '../retrieval';

/**
 * Initialize the RAG integration system
 */
export const initializeRAGIntegration = async (): Promise<boolean> => {
  return await initializeRetrievalSystem();
};

/**
 * Integrate vector knowledge into a response based on context
 */
export const integrateKnowledgeIntoResponse = async (
  response: string,
  userInput: string,
  messageCount: number,
  conversationHistory: string[] = []
): Promise<string> => {
  try {
    let enhancedResponse = response;
    
    // Determine the context
    const isEmergencyContext = isEmergency(userInput);
    const isMedicalAdvice = isDirectMedicalAdvice(userInput);
    const isSmallTalkContext = isSmallTalk(userInput);
    const isIntroductionContext = isIntroduction(userInput);
    const isPersonalSharingContext = isPersonalSharing(userInput);
    
    // First, handle emergency situation (highest priority)
    if (isEmergencyContext) {
      enhancedResponse = enhanceCrisisResponse(enhancedResponse, userInput);
      return enhancedResponse;
    }
    
    // Handle medical advice differently
    if (isMedicalAdvice) {
      // For medical advice, we focus on being accurate but cautious
      enhancedResponse = addMedicalDisclaimerIfNeeded(enhancedResponse);
      return enhancedResponse;
    }
    
    // Different enhancements based on conversation context
    if (isSmallTalkContext) {
      // For small talk, keep it light and conversational
      // Only add personality for small talk
      enhancedResponse = await enhanceWithPersonality(enhancedResponse, userInput, messageCount);
    } else if (isIntroductionContext) {
      // For introductions, focus on Rogerian principles
      enhancedResponse = enhanceRogerianResponse(enhancedResponse, userInput, messageCount);
    } else if (isPersonalSharingContext) {
      // For personal sharing, enhance with logotherapy
      enhancedResponse = await enhanceLogotherapyResponse(enhancedResponse, userInput);
    } else {
      // For general conversation, apply both Rogerian and logotherapy
      enhancedResponse = enhanceRogerianResponse(enhancedResponse, userInput, messageCount);
      enhancedResponse = await enhanceLogotherapyResponse(enhancedResponse, userInput);
    }
    
    // Record this exchange to the vector database for future retrieval
    addConversationExchange(userInput, enhancedResponse).catch(error => 
      console.error("Error recording exchange:", error)
    );
    
    return enhancedResponse;
  } catch (error) {
    console.error("Error integrating knowledge:", error);
    return response;
  }
};

/**
 * Add medical disclaimer if needed
 */
function addMedicalDisclaimerIfNeeded(response: string): string {
  const disclaimer = "Please remember that I'm not a medical professional and can't provide medical advice. Consider consulting with a healthcare provider for personalized guidance.";
  
  // Check if response already contains a disclaimer
  if (response.includes("not a medical professional") || 
      response.includes("can't provide medical advice") ||
      response.includes("consult with a healthcare provider")) {
    return response;
  }
  
  // Add disclaimer at the end
  return `${response}\n\n${disclaimer}`;
}

// Export integration functions
export {
  enhanceRogerianResponse,
  enhanceLogotherapyResponse,
  enhanceCrisisResponse,
  enhanceWithPersonality
};
