
/**
 * New Conversation Detector
 * 
 * Provides robust detection of new conversations to prevent false memories
 * from being carried over between separate conversations.
 */

interface ConversationSession {
  startTime: number;
  lastMessageTime: number;
  messageCount: number;
  firstMessage: string;
}

// Store the current conversation session
let currentSession: ConversationSession | null = null;

/**
 * Detects if this is a new conversation based on multiple heuristics
 * - Time since last message (over 30 minutes = new conversation)
 * - Greeting patterns in first message of session
 * - Explicit reset indicators
 */
export const detectNewConversation = (userInput: string): boolean => {
  const currentTime = Date.now();
  
  // If no session exists or this is the first message, it's a new conversation
  if (!currentSession) {
    initializeNewSession(userInput, currentTime);
    return true;
  }
  
  // Time-based detection: If more than 30 minutes since last message
  const timeSinceLastMessage = currentTime - currentSession.lastMessageTime;
  const thirtyMinutesMs = 30 * 60 * 1000;
  
  if (timeSinceLastMessage > thirtyMinutesMs) {
    console.log("NEW CONVERSATION: Time gap detected");
    initializeNewSession(userInput, currentTime);
    return true;
  }
  
  // Pattern-based detection: Check for introductory phrases
  const greetingPatterns = [
    /^(hi|hello|hey|good morning|good afternoon|good evening)/i,
    /^(my name is|i'm|i am) [a-z]+/i,
    /^nice to meet you/i,
  ];
  
  // Only apply pattern detection if we've had a few messages already
  // This prevents false positives during normal conversation
  if (currentSession.messageCount > 3) {
    for (const pattern of greetingPatterns) {
      if (pattern.test(userInput.trim())) {
        console.log("NEW CONVERSATION: Greeting pattern detected in established conversation");
        initializeNewSession(userInput, currentTime);
        return true;
      }
    }
  }
  
  // Content mismatch: If they're introducing themselves after we already have messages
  if (currentSession.messageCount > 2 && 
      /\b(i am|i'm) [a-z]+ and (i|i'm)/i.test(userInput)) {
    console.log("NEW CONVERSATION: New introduction detected");
    initializeNewSession(userInput, currentTime);
    return true;
  }
  
  // Explicit reset indicators
  if (/\b(start over|new conversation|reset|forget|start fresh|let's start again)\b/i.test(userInput)) {
    console.log("NEW CONVERSATION: Explicit reset requested");
    initializeNewSession(userInput, currentTime);
    return true;
  }
  
  // Update the session and continue the current conversation
  updateExistingSession(userInput, currentTime);
  return false;
};

/**
 * Initialize a new conversation session
 */
const initializeNewSession = (userInput: string, currentTime: number): void => {
  currentSession = {
    startTime: currentTime,
    lastMessageTime: currentTime,
    messageCount: 1,
    firstMessage: userInput
  };
};

/**
 * Update the existing conversation session
 */
const updateExistingSession = (userInput: string, currentTime: number): void => {
  if (currentSession) {
    currentSession.lastMessageTime = currentTime;
    currentSession.messageCount++;
  }
};

/**
 * Reset the current conversation session
 */
export const resetConversationSession = (): void => {
  currentSession = null;
};

/**
 * Get the current conversation message count
 */
export const getConversationMessageCount = (): number => {
  return currentSession?.messageCount || 0;
};
