
import { MessageType } from "../../../components/Message";
import { ConcernType } from "../../../utils/reflection/reflectionTypes";

/**
 * Props for processing messages
 */
export interface ProcessMessageProps {
  userInput: string;
  detectConcernsFn: (input: string) => ConcernType;
  generateResponseFn: (input: string, concernType: ConcernType) => string;
  baseProcessUserMessage: (input: string, responseFn: any, concernFn: any) => Promise<MessageType>;
  conversationHistory: string[];
  clientPreferences: any;
  updateStageFn?: () => void;
}
