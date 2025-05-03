
import { ConcernType } from '../../../utils/reflection/reflectionTypes';
import { MessageType } from '../../../components/Message';

/**
 * Type definitions for message processor
 */

export type ProcessMessageProps = {
  userInput: string;
  detectConcerns: (userInput: string) => ConcernType;
  generateResponse: (userInput: string, concernType: ConcernType) => string;
  baseProcessUserMessage: (
    userInput: string, 
    responseFn: (input: string) => string, 
    concernFn: () => ConcernType | null, 
    multiplier?: number
  ) => Promise<MessageType>;
  conversationHistory: string[];
  clientPreferences: any;
  updateStage: () => void;
};

export type ProcessorPipeline = {
  userInput: string;
  concernType: ConcernType;
  baseProcessUserMessage: ProcessMessageProps['baseProcessUserMessage'];
  clientPreferences: any;
  conversationHistory: string[];
  updateStage: () => void;
};

