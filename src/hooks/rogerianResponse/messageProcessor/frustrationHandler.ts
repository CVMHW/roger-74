
import { MessageType } from '../../../components/Message';
import { 
  detectEverydayFrustration, 
  generateEverydayFrustrationResponse,
  detectSmallTalkCategory,
  generateSmallTalkResponse
} from '../../../utils/conversation/theSmallStuff';
import { processResponseThroughMasterRules } from '../../../utils/response/responseProcessor';

interface ProcessFrustrationProps {
  userInput: string;
  baseProcessUserMessage: any;
  conversationHistory: string[];
  updateStage: () => void;
}

/**
 * Process everyday frustrations and small talk
 */
export const processFrustrationAndSmallTalk = async ({
  userInput,
  baseProcessUserMessage,
  conversationHistory,
  updateStage
}: ProcessFrustrationProps): Promise<MessageType | null> => {
  // Check for everyday frustrations first (non-clinical concerns)
  const frustrationInfo = detectEverydayFrustration(userInput);
  if (frustrationInfo.isFrustration) {
    const frustrationResponse = generateEverydayFrustrationResponse(userInput, frustrationInfo);
    
    // Process through master rules for additional validation
    const processedResponse = processResponseThroughMasterRules(
      frustrationResponse,
      userInput,
      conversationHistory.length,
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
