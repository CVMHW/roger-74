
import { MessageType } from '../../../components/Message';
import { createMessage } from '../../../utils/messageUtils';
import { isUserPointingOutNonResponsiveness } from './detectionUtils';
import { getPersistentFeelings, getDominantTopics } from '../../../utils/reflection/feelingDetection';

/**
 * Handles cases where the user points out that Roger is not being responsive
 */
export const handleNonResponsivenessComplaints = async (
  userInput: string,
  conversationHistory: string[],
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>,
  simulateTypingResponse: (response: string, callback: (text: string) => void) => void,
  updateRogerResponseHistory: (response: string) => void,
  setProcessingContext: (context: string | null) => void,
  responseDelay: number
): Promise<boolean> => {
  // Enhanced handling for non-responsiveness complaints
  if (isUserPointingOutNonResponsiveness(userInput) && conversationHistory.length >= 3) {
    setTimeout(() => {
      // Get persistent feelings and dominant topics
      const persistentFeelings = getPersistentFeelings();
      const dominantTopics = getDominantTopics();
    
      // Generate an enhanced acknowledgment response
      let acknowledgmentResponse = "I apologize for not properly acknowledging what you've already shared. ";
      
      // Use persistent feelings and topics for better acknowledgment
      if (persistentFeelings.length > 0) {
        acknowledgmentResponse += `I notice you've mentioned feeling ${persistentFeelings.join(", ")}. `;
      }
      
      if (dominantTopics.length > 0) {
        acknowledgmentResponse += `You've been talking about ${dominantTopics.join(", ")}. `;
      }
      
      acknowledgmentResponse += "Could you help me understand which aspects of this are most important for us to focus on right now?";
      
      // Create message object
      const responseMsg = createMessage(acknowledgmentResponse, 'roger');
      
      // Add the response
      setMessages(prevMessages => [...prevMessages, responseMsg]);
      
      // Update the response history to prevent future repetition
      updateRogerResponseHistory(acknowledgmentResponse);
      
      // Simulate typing with a callback to update the message text
      simulateTypingResponse(acknowledgmentResponse, (text) => {
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg.id === responseMsg.id ? { ...msg, text } : msg
          )
        );
        
        // Clear the processing context once response is complete
        setProcessingContext(null);
      });
    }, Math.min(responseDelay, 1000)); // Respond faster to acknowledgment requests
    
    return true;
  }
  
  return false;
};
