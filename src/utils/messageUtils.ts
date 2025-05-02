import { ConcernType } from './reflection/reflectionTypes';

export type MessageType = {
  id: string;
  text: string;
  sender: 'user' | 'roger';
  timestamp: Date;
  feedback?: 'positive' | 'negative' | null;
  concernType?: ConcernType | null;
  locationData?: {
    state?: string;
    city?: string;
  } | null;
};

/**
 * Generates initial messages for the chat interface.
 * @returns An array of MessageType objects representing the initial messages.
 */
export const getInitialMessages = (): MessageType[] => {
  return [
    {
      id: '1',
      text: "Hi, I'm Roger, your peer support companion. How can I help you today?",
      sender: 'roger',
      timestamp: new Date(),
      locationData: null
    }
  ];
};

/**
 * Creates a new message object.
 * @param text The text content of the message.
 * @param sender The sender of the message ('user' or 'roger').
 * @param concernType Optional concern type associated with the message.
 * @returns A MessageType object representing the new message.
 */
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
    locationData: null
  };
};

/**
 * Stores feedback for a message (placeholder function).
 * @param messageId The ID of the message.
 * @param feedback The feedback provided ('positive' or 'negative').
 */
export const storeFeedback = (messageId: string, feedback: 'positive' | 'negative') => {
  // In a real application, this function would store the feedback in a database or other persistent storage.
  console.log(`Feedback for message ${messageId}: ${feedback}`);
};

/**
 * Checks if location data is needed for a specific concern type.
 * @param concernType The concern type to check.
 * @returns True if location data is needed, false otherwise.
 */
export const isLocationDataNeeded = (concernType: ConcernType): boolean => {
  // Define the concern types that require location data
  const locationNeededConcerns: ConcernType[] = ['crisis', 'tentative-harm', 'medical'];
  return locationNeededConcerns.includes(concernType);
};

/**
 * Generates a message requesting location data.
 * @param concernType The concern type for which location data is needed.
 * @returns The location request message.
 */
export const generateLocationRequestMessage = (concernType: ConcernType): string => {
  switch (concernType) {
    case 'crisis':
    case 'tentative-harm':
      return "To ensure your safety, could you please share your current location or the nearest major city?";
    case 'medical':
      return "To help me find the nearest medical resources, could you please share your current location or the nearest major city?";
    default:
      return "Could you please share your current location or the nearest major city so I can provide more relevant information?";
  }
};

/**
 * Extracts a possible location from a text message.
 * @param text The text message to extract the location from.
 * @returns An object containing the city and state if found, otherwise undefined.
 */
export const extractPossibleLocation = (text: string): { state?: string; city?: string } | undefined => {
  if (!text) return undefined;

  // This is a placeholder implementation. In a real application, you would use a more sophisticated
  // method to extract the location, such as a natural language processing library or a geocoding API.

  // For this example, we'll just check for a few common city names.
  const lowerText = text.toLowerCase();
  if (lowerText.includes('new york')) {
    return { city: 'New York', state: 'NY' };
  } else if (lowerText.includes('los angeles')) {
    return { city: 'Los Angeles', state: 'CA' };
  } else if (lowerText.includes('chicago')) {
    return { city: 'Chicago', state: 'IL' };
  } else if (lowerText.includes('houston')) {
    return { city: 'Houston', state: 'TX' };
  }

  return undefined;
};

/**
 * Extracts user location from messages
 */
export const extractUserLocation = (userInput: string, conversationHistory: string[]): { state?: string; city?: string } | undefined => {
  // First check the current message
  const possibleLocation = extractPossibleLocation(userInput);
  if (possibleLocation) {
    return possibleLocation;
  }
  
  // Then check conversation history
  for (const message of conversationHistory) {
    const locationInHistory = extractPossibleLocation(message);
    if (locationInHistory) {
      return locationInHistory;
    }
  }
  
  return undefined;
};

/**
 * Updates a message with location data.
 * @param messages The array of messages to update.
 * @param messageId The ID of the message to update.
 * @param locationData The location data to add to the message.
 * @returns A new array of messages with the specified message updated.
 */
export const updateMessageWithLocation = (
  messages: MessageType[],
  messageId: string,
  locationData: { state?: string; city?: string }
): MessageType[] => {
  return messages.map(msg =>
    msg.id === messageId ? { ...msg, locationData } : msg
  );
};
