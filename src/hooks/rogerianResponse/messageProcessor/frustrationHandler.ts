
import { MessageType } from "../../../components/Message";

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
  // Import these functions dynamically to avoid circular dependencies
  const { extractUserFrustrations } = require("../../../utils/conversation/theSmallStuff/everydayFrustrations");
  const { detectSmallTalk } = require("../../../utils/conversation/smallTalk/detectors");
  
  // First check for everyday frustrations
  const userFrustrations = extractUserFrustrations ? extractUserFrustrations(userInput) : null;
  
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
      generateFrustrationResponse
    );
  }
  
  // Next check for small talk
  const smallTalkResult = detectSmallTalk ? detectSmallTalk(userInput, conversationHistory) : { isSmallTalk: false };
  
  if (smallTalkResult.isSmallTalk) {
    console.log("Small talk detected:", smallTalkResult.category);
    
    // Move conversation forward
    updateStage();
    
    // Generate a response based on small talk category
    const generateSmallTalkResponseFn = () => {
      const { generateSmallTalkResponse } = require("../../../utils/conversation/smallTalk/responseGenerators");
      return generateSmallTalkResponse ? 
        generateSmallTalkResponse(smallTalkResult.category, userInput, conversationHistory) :
        "I see. What would be most helpful to focus on in our conversation?";
    };
    
    // Process using the base message processor but with our custom response
    return baseProcessUserMessage(
      userInput,
      generateSmallTalkResponseFn
    );
  }
  
  // Return null if no frustration or small talk detected
  return null;
};
