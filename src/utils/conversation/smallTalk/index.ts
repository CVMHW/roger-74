
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

// Explicitly re-export functions from patientDetectors for backward compatibility
import { isLikelyChild, isLikelyNewcomer } from './patientDetectors';
export { isLikelyChild, isLikelyNewcomer };

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
