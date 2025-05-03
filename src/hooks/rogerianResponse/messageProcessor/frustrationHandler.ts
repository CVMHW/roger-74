
import { MessageType } from '../../../components/Message';
import { createMessage } from '../../../utils/messageUtils';
import { processResponseThroughMasterRules } from '../../../utils/response/responseProcessor';
import { 
  detectEverydayFrustration, 
  generateEverydayFrustrationResponse,
  detectSmallTalkCategory,
  generateSmallTalkResponse
} from '../../../utils/conversation/theSmallStuff';

type FrustrationHandlerProps = {
  userInput: string;
  baseProcessUserMessage: (
    userInput: string, 
    responseFn: (input: string) => string, 
    concernFn: () => null, 
    multiplier?: number
  ) => Promise<MessageType>;
  conversationHistory: string[];
  updateStage: () => void;
};

/**
 * Process everyday frustrations and small talk
 */
export const processFrustrationAndSmallTalk = async ({
  userInput,
  baseProcessUserMessage,
  conversationHistory,
  updateStage
}: FrustrationHandlerProps): Promise<MessageType | null> => {
  // Check for everyday frustrations first (non-clinical concerns)
  const frustrationInfo = detectEverydayFrustration(userInput);
  if (frustrationInfo.isFrustration) {
    const frustrationResponse = generateEverydayFrustrationResponse(userInput, frustrationInfo);
    
    // Process through master rules for additional validation
    const messageCount = conversationHistory.length;
    const processedResponse = processResponseThroughMasterRules(
      frustrationResponse,
      userInput,
      messageCount,
      conversationHistory
    );
    
    // Update conversation stage
    updateStage();
    
    // Process with frustration response
    return baseProcessUserMessage(
      userInput,
      () => processedResponse,
      () => null
    );
  }
  
  // Check for small talk in early conversation
  const messageCount = conversationHistory.length;
  if (messageCount <= 5) {
    const smallTalkInfo = detectSmallTalkCategory(userInput);
    if (smallTalkInfo.isSmallTalk) {
      const smallTalkResponse = generateSmallTalkResponse(userInput, smallTalkInfo.category, messageCount);
      
      // Update conversation stage
      updateStage();
      
      // Process with small talk response
      return baseProcessUserMessage(
        userInput,
        () => smallTalkResponse,
        () => null
      );
    }
  }
  
  return null;
};

