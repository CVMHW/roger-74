
import { MessageType } from "../../../components/Message";
import { extractUserFrustrations } from "../../../utils/conversation/theSmallStuff/everydayFrustrations";
import { detectSmallTalk } from "../../../utils/conversation/smallTalk/detectors";
import { generateSmallTalkResponse } from "../../../utils/conversation/smallTalk/responseGenerators";

interface FrustrationParams {
  userInput: string;
  baseProcessUserMessage: any;
  conversationHistory: string[];
  updateStage: () => void;
}

/**
 * Process potential frustrations or small talk in user messages
 */
export const processFrustrationAndSmallTalk = async ({
  userInput,
  baseProcessUserMessage,
  conversationHistory,
  updateStage,
}: FrustrationParams): Promise<MessageType | null> => {
  // First check for everyday frustrations
  const userFrustrations = extractUserFrustrations(userInput);
  
  // Check if we have detected frustrations
  if (userFrustrations && userFrustrations.detected) {
    console.log("Everyday frustration detected:", userFrustrations.category);
    
    // Move conversation forward
    updateStage();
    
    // Generate a response using the frustration information
    const generateFrustrationResponse = () => {
      return userFrustrations.response || "That sounds frustrating. Could you tell me more about how this has been affecting you?";
    };
    
    // Process using the base message processor but with our custom response
    return baseProcessUserMessage(
      userInput,
      generateFrustrationResponse,
      () => null
    );
  }
  
  // Next check for small talk
  const smallTalkResult = detectSmallTalk(userInput, conversationHistory);
  
  if (smallTalkResult.isSmallTalk) {
    console.log("Small talk detected:", smallTalkResult.category);
    
    // Move conversation forward
    updateStage();
    
    // Generate a response based on small talk category
    const generateSmallTalkResponseFn = () => {
      return generateSmallTalkResponse(smallTalkResult.category, userInput, conversationHistory);
    };
    
    // Process using the base message processor but with our custom response
    return baseProcessUserMessage(
      userInput,
      generateSmallTalkResponseFn,
      () => null
    );
  }
  
  // Return null if no frustration or small talk detected
  return null;
};
