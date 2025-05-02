
/**
 * Early Conversation Handler
 * 
 * Utilities for building rapport in early conversation stages
 */

/**
 * Enhances rapport in early conversation by adding personal touch
 * @param response The generated response
 * @param userInput The original user input
 * @param messageCount Current message count
 * @returns Enhanced response with rapport-building elements
 */
export const enhanceRapportInEarlyConversation = (
  response: string,
  userInput: string,
  messageCount: number
): string => {
  // Import the function needed from the local module
  const { detectEverydayFrustration } = require('./everydayFrustrationHandler');
  
  // Add personal touch for minor concerns
  if (messageCount <= 5 && detectEverydayFrustration(userInput).isFrustration) {
    const personalTouches = [
      "I've been there!",
      "That happens to me too!",
      "I get that!",
      "That stinks!"
    ];
    
    const selectedTouch = personalTouches[Math.floor(Math.random() * personalTouches.length)];
    return `${selectedTouch} ${response}`;
  }
  
  // Add follow-up questions to encourage sharing
  if (messageCount <= 3 && !response.includes("?")) {
    return `${response} What else has been going on?`;
  }
  
  return response;
};

/**
 * Generates a response for the first message in a conversation
 */
export const generateFirstMessageResponse = (): string => {
  const firstMessageResponses = [
    "Hi there! I'm Roger, here to chat while you wait for Dr. Eric. How are you doing today?",
    "Hello! Welcome to Cuyahoga Valley Mindful Health and Wellness. I'm Roger, and I'm here to help make your wait a bit more comfortable. How's your day going?",
    "Hey there! I'm Roger. Dr. Eric will be with you shortly. How are you feeling today?",
    "Welcome! I'm Roger, and I'm here to chat with you while you wait for Dr. Eric. How has your day been so far?"
  ];
  
  return firstMessageResponses[Math.floor(Math.random() * firstMessageResponses.length)];
};
