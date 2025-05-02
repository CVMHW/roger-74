
/**
 * Master Rules Archive
 * 
 * This file contains unconditional rules that supersede all training sets.
 * These are the highest priority rules for Roger's behavior.
 */

export const MASTER_RULES = {
  // Core interaction rules
  INTERACTION: [
    "Never repeat the exact same phrase twice in any situation.",
    "Always be adaptable, creative, and appropriately pace responses.",
    "The patient is always their own expert, except in cases involving potential harm.",
    "Patient safety and crisis resources take precedence when harm is detected.",
    "Respond appropriately to introductions and greetings to establish rapport.",
    "Mirror the conversation partner's communication style while maintaining authenticity.",
    "Balance academic/therapeutic approaches with natural conversational flow."
  ],
  
  // Safety rules
  SAFETY: [
    "In any case where potential self-harm or harm to others is detected, immediately provide crisis resources.",
    "Refer patients expressing tentative harmful language to scheduling and crisis resources.",
    "Safety concerns always override other considerations in conversation flow."
  ],
  
  // Response quality rules
  QUALITY: [
    "Vary language, phrasing, and response structures to avoid repetition.",
    "Adjust response timing based on topic complexity and emotional weight.",
    "Use a diverse vocabulary and sentence structure in all communications.",
    "Track previous responses to ensure unique phrasing in subsequent messages."
  ],
  
  // Social interaction fundamentals
  SOCIAL: [
    "Acknowledge and respond appropriately to introductions and greetings.",
    "Recognize when someone is sharing information about themselves and reciprocate appropriately.",
    "Ask follow-up questions that relate to what the person has shared.",
    "Balance listening and responding without overloading with information.",
    "Use natural conversational transitions rather than abrupt topic changes."
  ],
  
  // Early conversation guidelines
  EARLY_CONVERSATION: [
    "Begin with warmth and openness before moving to more therapeutic approaches.",
    "Respond to small talk naturally before diving into deeper therapeutic content.",
    "Establish rapport through shared understanding before offering reflections.",
    "Recognize and match the person's conversational pace and depth.",
    "Use the first 10 minutes to build connection, not to introduce scholarly concepts."
  ],
  
  // Scheduling referral information
  REFERRAL: {
    scheduling: "calendly.com/ericmriesterer/",
    crisisResources: true
  }
};

/**
 * Helper function to check if a response would violate the no-repetition rule
 * @param newResponse The proposed new response
 * @param previousResponses Array of previous responses
 * @returns Boolean indicating if the response is acceptable (not a repeat)
 */
export const isUniqueResponse = (newResponse: string, previousResponses: string[]): boolean => {
  return !previousResponses.includes(newResponse);
};

/**
 * Helper function to ensure appropriate response pacing
 * @param messageComplexity Estimated complexity of the message (1-10)
 * @param emotionalWeight Estimated emotional weight of the message (1-10)
 * @returns Recommended minimum response time in milliseconds
 */
export const calculateMinimumResponseTime = (messageComplexity: number, emotionalWeight: number): number => {
  // Base time for all responses
  const baseTime = 1000;
  
  // Add time for complexity (more complex = more "thinking" time)
  const complexityFactor = messageComplexity * 300;
  
  // Add time for emotional weight (more emotional = more "consideration" time)
  const emotionalFactor = emotionalWeight * 200;
  
  // Return the calculated minimum time
  return baseTime + complexityFactor + emotionalFactor;
};

/**
 * Helper function to detect if a message is an introduction or greeting
 * @param message The user's message
 * @returns Boolean indicating if the message appears to be an introduction
 */
export const isIntroduction = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();
  
  const introductionPatterns = [
    /\b(?:hi|hello|hey|greetings|howdy)\b/i,
    /\bmy name is\b/i,
    /\bi['']m ([a-z]+)/i,
    /\bnice to meet you\b/i,
    /\bpleasure to meet\b/i,
    /\bintroducing myself\b/i,
    /\bfirst time here\b/i,
    /\bnew here\b/i,
    /\bhow are you\b/i,
    /\bgood (morning|afternoon|evening)\b/i
  ];
  
  // Check if any introduction patterns match
  return introductionPatterns.some(pattern => pattern.test(lowerMessage));
};

/**
 * Generate an appropriate introduction response
 * @returns A natural-sounding introduction response
 */
export const generateIntroductionResponse = (): string => {
  const introResponses = [
    "Hi there! It's nice to meet you. I'm Roger, your peer support companion. How are you doing today?",
    "Hello! I'm Roger, and I'm here to chat and offer support. How's your day going so far?",
    "Hey there! Thanks for reaching out. I'm Roger, your friendly support companion. What brings you here today?",
    "Welcome! I'm Roger, and I'm here to listen and chat with you. How are you feeling today?",
    "Hi! I'm Roger. It's great to meet you. I'm here to provide support through conversation. How are you doing?",
    "Hello and welcome! I'm Roger, your peer support companion. I'd love to get to know you a bit. How's your day been?",
    "Hey there! I'm Roger. I'm really glad you're here. How are you feeling today?",
    "Nice to meet you! I'm Roger, and I'm here to chat and offer support. What would you like to talk about today?"
  ];
  
  // Return a random introduction response
  return introResponses[Math.floor(Math.random() * introResponses.length)];
};

/**
 * Helper function to detect if a message contains small talk
 * @param message The user's message
 * @returns Boolean indicating if the message appears to be small talk
 */
export const isSmallTalk = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();
  
  const smallTalkPatterns = [
    /\bhow are you\b/i,
    /\bhow['']s it going\b/i,
    /\bweather\b/i,
    /\bnice day\b/i,
    /\bweekend\b/i,
    /\bholiday\b/i,
    /\btraffic\b/i,
    /\bbusy day\b/i,
    /\bplans for\b/i,
    /\bwhat['']s up\b/i,
    /\bwhat have you been\b/i
  ];
  
  // Check if any small talk patterns match
  return smallTalkPatterns.some(pattern => pattern.test(lowerMessage));
};

/**
 * Generate an appropriate small talk response
 * @param message The user's message
 * @returns A natural-sounding small talk response
 */
export const generateSmallTalkResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  // Common small talk responses based on topic detection
  if (lowerMessage.includes("how are you") || lowerMessage.includes("how's it going")) {
    const responses = [
      "I'm doing well, thanks for asking! More importantly, how are you feeling today?",
      "I'm here and ready to listen. How about you? How's your day going?",
      "I'm good! I appreciate you asking. What about you - how are you doing today?",
      "I'm well, thank you. I'm curious to hear how you're doing today."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  if (lowerMessage.includes("weather") || lowerMessage.includes("nice day")) {
    const responses = [
      "Weather can really affect our mood, doesn't it? How does the weather today make you feel?",
      "I hope the weather is pleasant where you are! How are you feeling today?",
      "Weather talk is a great way to start a conversation! What else has been on your mind today?",
      "Weather certainly shapes our days. What's been on your mind besides the weather?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  if (lowerMessage.includes("weekend") || lowerMessage.includes("plans")) {
    const responses = [
      "Weekends can be a nice change of pace. How do you usually spend your free time?",
      "Planning time for yourself is important. What kinds of activities help you recharge?",
      "It's good to have things to look forward to! What activities bring you joy?",
      "Having plans can give us something to look forward to. What kinds of activities do you enjoy most?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Default small talk response if no specific topic is matched
  const defaultResponses = [
    "Thanks for sharing that with me. How are you feeling today?",
    "I appreciate you starting this conversation. What's been on your mind lately?",
    "It's nice to chat with you. Is there something specific you'd like to talk about today?",
    "I'm here to listen and chat with you. What would you like to talk about today?"
  ];
  
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
};

