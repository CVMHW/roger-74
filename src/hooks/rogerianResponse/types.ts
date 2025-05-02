
import { ConcernType } from '../../utils/reflection/reflectionTypes';
import { MessageType } from '../../components/Message';
import { DeceptionAnalysis } from '../../utils/detectionUtils/deceptionDetection';

export interface ClientPreferences {
  prefersFormalLanguage: boolean;
  prefersDirectApproach: boolean;
  isFirstTimeWithMentalHealth: boolean;
}

export interface RecentCrisisMessage {
  message: string;
  timestamp: Date;
  concernType: string;
}

export interface ActiveLocationConcern {
  concernType: string | null;
  messageId: string;
  askedForLocation: boolean;
}

export interface UseRogerianResponseReturn {
  isTyping: boolean;
  processUserMessage: (userInput: string) => Promise<MessageType>;
  simulateTypingResponse: (response: string, callback: (text: string) => void) => void;
  currentApproach: 'rogerian' | 'mi' | 'existential' | 'conversational' | 'socratic';
  handlePotentialDeception?: (originalMessage: string, followUpMessage: string) => Promise<MessageType | null>;
}
