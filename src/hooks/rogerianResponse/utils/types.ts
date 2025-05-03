
import { MessageType } from '../../../components/Message';

/**
 * Dependencies required for processing user messages
 */
export interface ProcessDependencies {
  conversationHistory: string[];
  updateConversationHistory: (input: string) => void;
  conversationStage: any;
  messageCount: number;
  updateStage: () => void;
  detectConcerns: (input: string) => any;
  generateResponse: (input: string, concernType: any) => string;
  baseProcessUserMessage: (input: string, responseFn: any, concernFn: any, multiplier?: number) => Promise<MessageType>;
  clientPreferences: any;
}

/**
 * Hook interface for Rogerian response processing
 */
export interface RogerianResponseHook {
  isTyping: boolean;
  processUserMessage: (userInput: string) => Promise<MessageType>;
  simulateTypingResponse: (response: string, callback: (text: string) => void) => void;
  currentApproach: 'rogerian' | 'mi' | 'existential' | 'conversational' | 'socratic';
  handlePotentialDeception?: (originalMessage: string, followUpMessage: string) => Promise<MessageType | null>;
}
