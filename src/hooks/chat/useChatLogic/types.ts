
import { MessageType } from '../../../components/Message';

export interface ChatLogicReturn {
  messages: MessageType[];
  isTyping: boolean;
  isProcessing: boolean;
  handleSendMessage: (message: string) => void;
  handleFeedback: (messageId: string, feedback: 'positive' | 'negative') => void;
  showCrisisResources: boolean;
  processingContext: string | null;
}

export interface ActiveLocationConcern {
  concernType: string | null;
  messageId: string;
  askedForLocation: boolean;
}

export interface RecentCrisisMessage {
  message: string;
  timestamp: Date;
  concernType: string;
}
