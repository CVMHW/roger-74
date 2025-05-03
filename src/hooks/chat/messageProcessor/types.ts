
import { ConcernType } from '../../../utils/reflection/reflectionTypes';
import { MessageType } from '../../../components/Message';

export interface MessageProcessorProps {
  processUserMessage: (userInput: string) => Promise<MessageType>;
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
  handleCrisisMessage: (userInput: string, rogerResponse: MessageType) => void;
  activeLocationConcern: any | null;
  setActiveLocationConcern: React.Dispatch<React.SetStateAction<any | null>>;
  simulateTypingResponse: (response: string, callback: (text: string) => void) => void;
  updateRogerResponseHistory: (response: string) => void;
  shouldThrottleResponse: () => boolean;
  getResponseDelay: (content: string) => number;
  setProcessingContext: (context: string | null) => void;
}

export interface ProcessResponseParams {
  userInput: string;
  processUserMessage: (userInput: string) => Promise<MessageType>;
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
  handleCrisisMessage: (userInput: string, rogerResponse: MessageType) => void;
  activeLocationConcern: any | null;
  setActiveLocationConcern: React.Dispatch<React.SetStateAction<any | null>>;
  simulateTypingResponse: (response: string, callback: (text: string) => void) => void;
  updateRogerResponseHistory: (response: string) => void;
  shouldThrottleResponse: () => boolean;
  getResponseDelay: (content: string) => number;
  setProcessingContext: (context: string | null) => void;
  conversationHistory: string[];
}
