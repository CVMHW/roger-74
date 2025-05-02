
/**
 * Utilities for creating and managing messages
 */
import { MessageType } from '../components/Message';
import { ConcernType } from './reflection/reflectionTypes';

// Create a new message with the given text and sender
export const createMessage = (
  text: string, 
  sender: 'user' | 'roger', 
  concernType: ConcernType | null = null
): MessageType => {
  return {
    id: Date.now().toString(),
    text,
    sender,
    timestamp: new Date(),
    concernType,
    locationData: null // Initialize location data as null
  };
};

// Initial messages for the chat
export const getInitialMessages = (): MessageType[] => [
  {
    id: '1',
    text: "Hi, I'm Roger, your peer support companion. I'm here to listen and offer support. How can I help you today?",
    sender: 'roger',
    timestamp: new Date(),
    locationData: null
  },
];

// Store feedback (this is a placeholder - replace with actual implementation)
export const storeFeedback = (messageId: string, feedback: 'positive' | 'negative') => {
  console.log(`Feedback for message ${messageId}: ${feedback}`);
  // In a real application, you would store this feedback in a database or other persistent storage
};
