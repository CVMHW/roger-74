
import { MessageType } from '../../../components/Message';
import { ConcernType } from '../../../utils/reflection/reflectionTypes';
import { determineResponseTimeMultiplier } from '../specialCaseDetection';

/**
 * Process general messages that don't fall into specific categories
 */
export const processGeneralMessage = async (
  userInput: string,
  concernType: ConcernType,
  generateResponse: (userInput: string, concernType: ConcernType) => string,
  baseProcessUserMessage: (userInput: string, responseFn: (input: string) => string, concernFn: () => ConcernType | null, multiplier?: number) => Promise<MessageType>,
  updateStage: () => void
): Promise<MessageType> => {
  // Calculate appropriate response time multiplier based on content
  const responseTimeMultiplier = determineResponseTimeMultiplier(userInput, concernType);
  
  // Update stage before processing
  updateStage();
  
  const wrappedGenerateResponse = (input: string) => {
    return generateResponse(input, concernType);
  };
  
  return baseProcessUserMessage(
    userInput,
    wrappedGenerateResponse,
    () => concernType,
    responseTimeMultiplier // Pass the multiplier to adjust response time
  );
};
