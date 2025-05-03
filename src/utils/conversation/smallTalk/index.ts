
/**
 * Small Talk Utilities for Roger
 * 
 * Based on best practices for conversational engagement and turn-taking,
 * particularly for the first 10 minutes of conversation to establish rapport
 * while patients are waiting to see their therapist.
 */

// Re-export the components for easy access
export * from './topics';
export * from './detectors';
export * from './patientDetectors';
export * from './responseGenerators';

// Export smallTalk utility functions that were referenced
export const detectSocialOverstimulation = (userInput: string): boolean => {
  // Simple detection for social overstimulation
  const overstimulationPatterns = [
    /too (many|much) people/i,
    /crowded|overwhelming|overstimul/i,
    /need (some )?space|alone time/i,
    /sensory (issues|overload|problems)/i,
    /can'?t focus with (all these|so many)/i
  ];
  
  return overstimulationPatterns.some(pattern => pattern.test(userInput));
};

// Export other required utilities that were referenced
export const smallTalkTopics = [
  "weather",
  "local events",
  "Cleveland community",
  "simple daily activities",
  "waiting room comfort",
  "general wellbeing"
];

export const conversationStarters = [
  "How has your day been going so far?",
  "Is there anything specific on your mind today?",
  "How are you feeling about meeting with Eric?",
  "Have you been to our center before?",
  "Is there anything I can help with while you're waiting?"
];

export const turnTakingPrompts = [
  "Would you like to share more about that?",
  "Is there anything else on your mind?",
  "How has this been affecting you?",
  "What other thoughts do you have about this?",
  "Would you like to talk about something else?"
];

// Add additional exports needed from the errors
export const isWaitingRoomRelated = (userInput: string): boolean => {
  const waitingRoomPatterns = [
    /wait(ing)?/i,
    /how long/i,
    /when will/i,
    /appointment/i,
    /eric/i,
    /therapist/i,
    /see (the|my) doctor/i
  ];
  
  return waitingRoomPatterns.some(pattern => pattern.test(userInput));
};

export const generateWaitingRoomResponse = (
  messageCount: number, 
  userInput: string
): string => {
  if (messageCount <= 3) {
    return "While you're waiting to see Eric, I'm here to chat with you. Eric is looking forward to your session - is there anything specific on your mind today?";
  } else if (/wait(ing)?|how long/i.test(userInput)) {
    return "I understand waiting can be difficult. Eric tries to keep to schedule, but sometimes sessions require extra time. Is there anything you'd like to talk about while you wait?";
  } else {
    return "Thanks for sharing that with me while you wait. Eric should be available soon for your session. Is there anything else you'd like to talk about in the meantime?";
  }
};

export const shouldUseSmallTalk = (userInput: string, messageCount: number): boolean => {
  // Small talk is more likely in early conversation
  if (messageCount <= 5) {
    return true;
  }
  
  // Check for casual conversation patterns
  const smallTalkPatterns = [
    /\b(hi|hello|hey)\b/i,
    /\bhow are you\b/i,
    /\bnice\b/i,
    /\bweather\b/i,
    /\bday\b/i
  ];
  
  return smallTalkPatterns.some(pattern => pattern.test(userInput));
};

// Now explicitly export these functions from patientDetectors
export { isLikelyChild, isLikelyNewcomer } from './patientDetectors';

// Define missing functions from earlyConversationHandlers
export const isLikelyTeen = (userInput: string): boolean => {
  const teenPatterns = [
    /\b(school|class|homework|college|university|campus)\b/i,
    /\b(teacher|professor|lecture|assignment|test|exam|quiz)\b/i,
    /\b(parents?|grounded|curfew|allowance|teenage|adolescen|puberty)\b/i,
    /\b(dating|crush|friend|peer pressure|popular|social media|tiktok|snapchat|instagram)\b/i
  ];
  
  return teenPatterns.some(pattern => pattern.test(userInput));
};

export const isLikelyMale = (userInput: string): boolean => {
  const malePatterns = [
    /\b(guy|dude|bro|man|men|male|masculin|beard|father|husband|boyfriend|son)\b/i,
    /\b(he pronouns|him pronouns|his pronouns)\b/i
  ];
  
  // This is only a rough heuristic based on language patterns
  return malePatterns.some(pattern => pattern.test(userInput));
};

export const isLikelyBlueCollar = (userInput: string): boolean => {
  const blueCollarPatterns = [
    /\b(factory|warehouse|construction|trade|union|shift|manual labor|physical work)\b/i,
    /\b(machinist|welder|plumber|electrician|carpenter|mechanic|trucker|driver)\b/i,
    /\b(steel|manufacturing|industrial|assembly|production|overtime|foreman|boss)\b/i
  ];
  
  return blueCollarPatterns.some(pattern => pattern.test(userInput));
};

export const mightPreferSimpleLanguage = (userInput: string): boolean => {
  // Detect if the message uses simpler vocabulary and sentence structure
  const wordCount = userInput.split(/\s+/).length;
  const avgWordLength = userInput.replace(/[^\w\s]/g, '').split(/\s+/).reduce((total, word) => total + word.length, 0) / wordCount;
  
  // Simpler language often has shorter words and sentences
  return avgWordLength < 4.5 && wordCount < 15;
};

export const getAppropriateConversationStyle = (userInput: string): string => {
  if (isLikelyTeen(userInput)) {
    return 'teen-friendly';
  } else if (isLikelyChild(userInput)) {
    return 'child-friendly';
  } else if (mightPreferSimpleLanguage(userInput)) {
    return 'simple';
  } else {
    return 'standard';
  }
};

export const identifyImmediateConcern = (userInput: string): string | null => {
  if (/\b(nervous|anxious|anxiety|worry|worried|scared|fear|afraid|panic|stress(ed)?)\b/i.test(userInput)) {
    return 'anxiety';
  } else if (/\b(sad|depress(ed|ion)?|hopeless|down|blue|unhappy|miserable)\b/i.test(userInput)) {
    return 'depression';
  } else if (/\b(angry|mad|furious|upset|irritate(d|ing)|frustrat(ed|ing)|rage)\b/i.test(userInput)) {
    return 'anger';
  } else if (/\b(relationship|partner|spouse|wife|husband|marriage|dating|breakup)\b/i.test(userInput)) {
    return 'relationship';
  } else if (/\b(work|job|career|coworker|boss|colleague|workplace)\b/i.test(userInput)) {
    return 'work';
  }
  return null;
};

export const generateImmediateConcernResponse = (userInput: string, concernType: string): string => {
  switch (concernType) {
    case 'anxiety':
      return "I notice you mentioned feeling anxious. That's something many people experience. Would you like to talk more about what's causing these feelings?";
    case 'depression':
      return "It sounds like you might be experiencing some sadness or low mood. Would it help to share more about what's been going on for you?";
    case 'anger':
      return "I can hear that you're feeling frustrated. Sometimes talking through those feelings can help make them more manageable. What's been happening?";
    case 'relationship':
      return "Relationships can bring up a lot of emotions. Would you like to share more about what's been happening in this relationship?";
    case 'work':
      return "Work challenges can be really stressful. What aspects of your work situation have been most difficult lately?";
    default:
      return "I'm here to listen. What would be most helpful to focus on today?";
  }
};

export const shouldUseWaitingRoomEngagement = (userInput: string, messageCount: number): boolean => {
  // Prioritize waiting room context in early conversation
  if (messageCount <= 10) {
    return true;
  }
  
  // Check for explicit mentions of waiting room or appointment
  return isWaitingRoomRelated(userInput);
};

export const generateWaitingRoomEngagement = (
  messageCount: number, 
  userInput: string,
  isRunningBehind: boolean = false,
  isCrisisDelay: boolean = false
): string => {
  if (messageCount <= 3) {
    return "While you're waiting to see Eric, I'm here to chat with you. Is there anything specific on your mind today?";
  } else if (isRunningBehind) {
    if (isCrisisDelay) {
      return "Thanks for your patience. Eric is currently handling an urgent situation but will be with you as soon as possible. How are you feeling while you wait?";
    } else {
      return "I appreciate your patience. Eric is running a bit behind schedule but will be with you soon. In the meantime, how can I support you?";
    }
  } else if (messageCount > 8) {
    return "Eric should be available for your session soon. Before then, is there anything else you'd like to discuss?";
  } else {
    return "While we're waiting for your session with Eric to begin, feel free to share whatever's on your mind.";
  }
};
