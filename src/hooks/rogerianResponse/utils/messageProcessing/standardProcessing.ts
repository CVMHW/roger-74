
import { processUserMessage as processMessage } from '../../messageProcessor';
import { MessageType } from '../../../../components/Message';
import { enhanceResponse } from '../responseEnhancer';
import { recordToMemorySystems } from '../memoryHandler';
import { ConcernType } from '../../../../utils/reflection/reflectionTypes';
import { createMessage } from '../../../../utils/messageUtils';

/**
 * Handles standard message processing when no special cases apply
 * 
 * @param userInput User's original message
 * @param detectConcerns Function to detect user concerns
 * @param generateResponse Function to generate responses
 * @param baseProcessUserMessage Base function for processing user messages
 * @param conversationHistory Array of previous conversation messages
 * @param messageCount Number of messages in the conversation
 * @param clientPreferences User preferences
 * @param updateStage Function to update conversation stage
 * @returns Standard processed message
 */
export const handleStandardProcessing = async (
  userInput: string,
  detectConcerns: (input: string) => ConcernType | null,
  generateResponse: (input: string, concernType: ConcernType | null) => string,
  baseProcessUserMessage: any,
  conversationHistory: string[],
  messageCount: number,
  clientPreferences: any,
  updateStage: () => void
): Promise<MessageType> => {
  try {
    // Get the concern type for processing
    const concernType = detectConcerns(userInput);
    
    // Call processMessage with individual arguments, not as an object
    const response = await processMessage(
      userInput,
      detectConcerns,
      generateResponse,
      baseProcessUserMessage,
      conversationHistory,
      clientPreferences,
      updateStage
    );
    
    // Enhance the response with memory rules, master rules, and chat log review
    // Pass information about message context for better response generation
    const finalResponseText = enhanceResponse(
      response.text,
      userInput,
      messageCount,
      conversationHistory
    );
    
    // Record to memory systems
    try {
      recordToMemorySystems(userInput, finalResponseText);
    } catch (error) {
      console.error("Error recording to memory systems:", error);
    }
    
    // Return the memory-enhanced response with tertiary safeguard applied
    const finalResponse = createMessage(finalResponseText, 'roger');
    return finalResponse;
  } catch (error) {
    console.error("Error in handleStandardProcessing:", error);
    return createMessage(
      "I'm listening. Could you tell me more about what's been happening?", 
      'roger'
    );
  }
};
