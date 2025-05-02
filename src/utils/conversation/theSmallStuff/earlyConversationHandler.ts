
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
  
  // First, ensure we directly address the user's input for the first 3 messages
  if (messageCount <= 3) {
    // Detect any key topics from the input
    const topics = extractKeyTopics(userInput);
    
    if (topics.length > 0 && !responseAddressesTopic(response, topics[0])) {
      // Add explicit acknowledgment of the user's topic
      return `I hear that you're mentioning ${topics[0]}. ${response}`;
    }
  }
  
  // Add personal touch for minor concerns
  if (messageCount <= 5 && detectEverydayFrustration(userInput).isFrustration) {
    const personalTouches = [
      "I've been there!",
      "That happens to me too!",
      "I get that!",
      "That stinks!"
    ];
    
    const selectedTouch = personalTouches[Math.floor(Math.random() * personalTouches.length)];
    
    // Check if the response already has a personal touch
    if (!response.includes(selectedTouch)) {
      return `${selectedTouch} ${response}`;
    }
  }
  
  // Add follow-up questions to encourage sharing
  if (messageCount <= 3 && !response.includes("?")) {
    // Use a more specific question based on the content of the user's message
    const followUpQuestions = [
      "What else has been going on?",
      "How are you feeling about that right now?",
      "What's been most on your mind about this?",
      "How has that been affecting you?"
    ];
    
    const selectedQuestion = followUpQuestions[Math.floor(Math.random() * followUpQuestions.length)];
    return `${response} ${selectedQuestion}`;
  }
  
  return response;
};

/**
 * Extract key topics from user input
 */
const extractKeyTopics = (input: string): string[] => {
  const topics = [];
  
  // Check for work-related topics
  if (/work|job|career|office|boss|coworker|colleague|supervisor/i.test(input)) {
    topics.push("work");
  }
  
  // Check for emotional states
  if (/sad|upset|down|depressed|unhappy/i.test(input)) {
    topics.push("feeling sad");
  } else if (/anxious|worried|nervous|stress/i.test(input)) {
    topics.push("feeling anxious");
  } else if (/angry|mad|furious|frustrated/i.test(input)) {
    topics.push("feeling frustrated");
  } else if (/happy|glad|excited|thrilled/i.test(input)) {
    topics.push("feeling positive");
  }
  
  // Check for specific situations
  if (/spill|drink|accident|mess/i.test(input)) {
    topics.push("the spill");
  }
  
  if (/lost|missing|can't find|looking for/i.test(input)) {
    topics.push("the thing you're looking for");
  }
  
  if (/bad day|rough day|terrible day|awful day/i.test(input)) {
    topics.push("your day");
  }
  
  return topics;
};

/**
 * Check if response addresses a specific topic
 */
const responseAddressesTopic = (response: string, topic: string): boolean => {
  const lowerResponse = response.toLowerCase();
  const lowerTopic = topic.toLowerCase();
  
  // Check for direct mentions or related words
  return lowerResponse.includes(lowerTopic) || 
         (lowerTopic === "work" && lowerResponse.includes("job")) ||
         (lowerTopic === "feeling sad" && lowerResponse.includes("feeling down")) ||
         (lowerTopic === "feeling anxious" && lowerResponse.includes("stress")) ||
         (lowerTopic === "feeling frustrated" && lowerResponse.includes("upset")) ||
         (lowerTopic === "the spill" && lowerResponse.includes("accident")) ||
         (lowerTopic === "your day" && lowerResponse.includes("today"));
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
