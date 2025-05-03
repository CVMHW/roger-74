
import { MessageType } from '../../../components/Message';
import { ConcernType } from '../../../utils/reflection/reflectionTypes';

/**
 * Props for the processUserMessage function
 */
export interface ProcessMessageProps {
  userInput: string;
  detectConcerns: (userInput: string) => ConcernType;
  generateResponse: (userInput: string, concernType: ConcernType) => string;
  baseProcessUserMessage: (
    input: string, 
    responseFn: (input: string) => string, 
    concernFn: () => ConcernType | null,
    multiplier?: number
  ) => Promise<MessageType>;
  conversationHistory: string[];
  clientPreferences: any;
  updateStage: () => void;
}
