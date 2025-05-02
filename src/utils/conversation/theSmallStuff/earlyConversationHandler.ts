
/**
 * Early Conversation Handler
 * 
 * Enhanced utilities for building rapport in early conversation stages
 * with immediate acknowledgment of user concerns
 */

/**
 * Enhances rapport in early conversation by adding personal touch
 * Now with improved prioritization of user concerns and topic acknowledgment
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
  const { identifyImmediateConcern } = require('./immediateConcrernHandler');
  
  // CRITICAL: Direct acknowledgment of user topics for the first 3 messages
  // This addresses the core issue of Roger not immediately identifying concerns
  if (messageCount <= 3) {
    // Detect any key topics from the input with improved precision
    const topics = extractKeyTopics(userInput);
    
    // If we found topics but haven't acknowledged them in the response,
    // add explicit acknowledgment at the beginning of the response
    if (topics.length > 0 && !responseAddressesTopic(response, topics[0])) {
      // Use more specific and empathetic acknowledgment phrases
      const acknowledgmentPhrases = [
        `I hear that you're dealing with ${topics[0]}. `,
        `It sounds like ${topics[0]} is on your mind right now. `,
        `I understand that ${topics[0]} is what you're concerned about. `,
        `I can see that ${topics[0]} is affecting you. `
      ];
      
      const selectedAcknowledgment = acknowledgmentPhrases[Math.floor(Math.random() * acknowledgmentPhrases.length)];
      return selectedAcknowledgment + response;
    }
  }
  
  // Add personal touch for minor concerns
  // But only if we haven't already addressed the main topic
  if (messageCount <= 5) {
    const frustrationInfo = detectEverydayFrustration(userInput);
    const concernType = identifyImmediateConcern(userInput);
    
    // Only add personal touch if we've detected frustration or a concern
    if ((frustrationInfo.isFrustration || concernType) && !hasPersonalTouch(response)) {
      const personalTouches = [
        "I've been there! ",
        "That happens to me too sometimes. ",
        "I get that feeling! ",
        "That stinks, I know. ",
        "That's definitely frustrating. "
      ];
      
      const selectedTouch = personalTouches[Math.floor(Math.random() * personalTouches.length)];
      
      // Only add if the response doesn't already have a personal touch
      return `${selectedTouch}${response}`;
    }
  }
  
  // Add follow-up questions to encourage sharing
  // But only for early messages and if the response doesn't already have a question
  if (messageCount <= 3 && !response.includes("?")) {
    // Use more specific questions based on the content of the user's message
    const followUpQuestions = [
      " What else has been going on?",
      " How are you feeling about that right now?",
      " What's been most on your mind about this?",
      " How has that been affecting you?"
    ];
    
    const selectedQuestion = followUpQuestions[Math.floor(Math.random() * followUpQuestions.length)];
    return `${response}${selectedQuestion}`;
  }
  
  return response;
};

/**
 * Check if a response already includes personal touch phrases
 */
const hasPersonalTouch = (response: string): boolean => {
  const personalPhrases = [
    "been there",
    "happens to me",
    "get that",
    "stinks",
    "i understand",
    "that's frustrating",
    "that can be difficult"
  ];
  
  const lowerResponse = response.toLowerCase();
  return personalPhrases.some(phrase => lowerResponse.includes(phrase));
};

/**
 * Extract key topics from user input with enhanced pattern matching
 * Now with improved ability to identify specific concerns
 */
const extractKeyTopics = (input: string): string[] => {
  const topics = [];
  
  // Check for work-related topics - more comprehensive
  if (/work|job|career|office|boss|coworker|colleague|supervisor|presentation|meeting|deadline/i.test(input)) {
    topics.push("work concerns");
  }
  
  // Enhanced emotional state detection
  if (/sad|upset|down|depress|unhappy|blue|low/i.test(input)) {
    topics.push("feeling sad");
  } else if (/anxious|worried|nervous|stress|tension|on edge/i.test(input)) {
    topics.push("feeling anxious");
  } else if (/angry|mad|furious|frustrated|irritated|annoyed/i.test(input)) {
    topics.push("feeling frustrated");
  } else if (/happy|glad|excited|thrilled|pleased|good|great/i.test(input)) {
    topics.push("positive feelings");
  } else if (/guilt(y)?|shame|embarrass|regret/i.test(input)) {
    topics.push("feeling guilty");
  }
  
  // Enhanced specific situation detection
  if (/spill(ed)?|drink|accident|mess|knocked over/i.test(input)) {
    topics.push("the spill");
  }
  
  if (/lost|missing|can't find|looking for|misplaced/i.test(input)) {
    topics.push("what you're looking for");
  }
  
  if (/bad day|rough day|terrible day|awful day|tough day|difficult day/i.test(input)) {
    topics.push("your difficult day");
  }
  
  if (/wait(ing)?|appointment|late|delay|doctor|eric/i.test(input)) {
    topics.push("the wait time");
  }
  
  if (/family|parent|sibling|brother|sister|mom|dad|mother|father/i.test(input)) {
    topics.push("family matters");
  }
  
  if (/relationship|partner|spouse|husband|wife|boyfriend|girlfriend|significant other/i.test(input)) {
    topics.push("your relationship");
  }
  
  return topics;
};

/**
 * Check if response addresses a specific topic
 * Enhanced to catch more variations of acknowledgment
 */
const responseAddressesTopic = (response: string, topic: string): boolean => {
  const lowerResponse = response.toLowerCase();
  const lowerTopic = topic.toLowerCase();
  
  // Check for direct mentions or related words - expanded for better coverage
  return lowerResponse.includes(lowerTopic) || 
         (lowerTopic === "work concerns" && (lowerResponse.includes("job") || lowerResponse.includes("workplace") || lowerResponse.includes("professional"))) ||
         (lowerTopic === "feeling sad" && (lowerResponse.includes("feeling down") || lowerResponse.includes("sadness") || lowerResponse.includes("unhappy"))) ||
         (lowerTopic === "feeling anxious" && (lowerResponse.includes("stress") || lowerResponse.includes("anxiety") || lowerResponse.includes("worried"))) ||
         (lowerTopic === "feeling frustrated" && (lowerResponse.includes("upset") || lowerResponse.includes("irritated") || lowerResponse.includes("annoyed"))) ||
         (lowerTopic === "the spill" && (lowerResponse.includes("accident") || lowerResponse.includes("spilled") || lowerResponse.includes("mess"))) ||
         (lowerTopic === "your difficult day" && (lowerResponse.includes("today") || lowerResponse.includes("rough time") || lowerResponse.includes("hard day"))) ||
         (lowerTopic === "feeling guilty" && (lowerResponse.includes("embarrassment") || lowerResponse.includes("regret") || lowerResponse.includes("sorry")));
};

/**
 * Generates a response for the first message in a conversation
 * Enhanced with more welcoming and personalized options
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
