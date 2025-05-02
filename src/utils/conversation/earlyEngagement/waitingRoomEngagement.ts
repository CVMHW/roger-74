
/**
 * Waiting Room Engagement Strategies
 * 
 * Functions to keep patients engaged when Eric is running behind
 * or handling crisis situations.
 */

/**
 * Generates a waiting room engagement message based on message count
 * and waiting context
 */
export const generateWaitingRoomEngagement = (
  messageCount: number,
  isRunningBehind: boolean = false,
  isCrisisDelay: boolean = false
): string => {
  // Very early conversation (first 2-3 messages)
  if (messageCount <= 3) {
    return generateEarlyWaitingResponse(isRunningBehind, isCrisisDelay);
  }
  
  // Early-mid conversation (messages 4-7)
  if (messageCount <= 7) {
    return generateMidWaitingResponse(isRunningBehind);
  }
  
  // Later early conversation (messages 8-10)
  return generateLaterWaitingResponse();
};

/**
 * Generate very early waiting room responses (messages 1-3)
 */
const generateEarlyWaitingResponse = (
  isRunningBehind: boolean,
  isCrisisDelay: boolean
): string => {
  if (isCrisisDelay) {
    const crisisDelayMessages = [
      "While Dr. Eric is assisting another patient with an urgent matter, I'm here to keep you company. I'm Roger - what brings you in today?",
      "Dr. Eric is currently managing an urgent situation with another patient. In the meantime, I'd be happy to chat with you. I'm Roger - how has your day been going?",
      "There's been a brief delay as Dr. Eric is helping a patient with an immediate need. I'm Roger, and I'll be here with you while you wait. What would you like to talk about?"
    ];
    return crisisDelayMessages[Math.floor(Math.random() * crisisDelayMessages.length)];
  }
  
  if (isRunningBehind) {
    const runningBehindMessages = [
      "Dr. Eric is running a little behind schedule today, but he's looking forward to seeing you soon. I'm Roger - is there anything specific you'd like to chat about while you wait?",
      "We're running slightly behind schedule, but Dr. Eric will be with you as soon as possible. In the meantime, I'm Roger. What brings you in today?",
      "Thanks for your patience today. Dr. Eric is running a bit behind, but I'm Roger and I'd be happy to chat while you wait. How has your week been going?"
    ];
    return runningBehindMessages[Math.floor(Math.random() * runningBehindMessages.length)];
  }
  
  // Standard early messages
  const earlyMessages = [
    "Hi there! I'm Roger. While you're waiting to see Dr. Eric, I'd love to hear a bit about what brings you in today.",
    "Welcome! I'm Roger, and I'm here to chat while you wait for your appointment with Dr. Eric. How are you doing today?",
    "Hello! I'm Roger. It's nice to meet you. While Dr. Eric prepares for your session, is there anything specific you'd like to talk about?"
  ];
  return earlyMessages[Math.floor(Math.random() * earlyMessages.length)];
};

/**
 * Generate mid-waiting room responses (messages 4-7)
 */
const generateMidWaitingResponse = (isRunningBehind: boolean): string => {
  if (isRunningBehind) {
    const midDelayMessages = [
      "I appreciate your patience today. I find that sometimes these unexpected waiting periods can be good moments for reflection. Is there anything specific on your mind you'd like to explore?",
      "Thanks for being patient. Dr. Eric values giving each person the time they need, which occasionally means a bit of a wait. What would be most helpful for us to talk about while you're waiting?",
      "While we're waiting for Dr. Eric, I wonder if there's a particular topic or concern that's been on your mind lately that you'd like to discuss?"
    ];
    return midDelayMessages[Math.floor(Math.random() * midDelayMessages.length)];
  }
  
  const midMessages = [
    "As we wait for your appointment with Dr. Eric, I'm curious about what you're hoping to get out of today's session.",
    "I've found that sometimes the conversations before appointments can be valuable in their own way. Is there anything specific you'd like to explore while we wait?",
    "While we're waiting for Dr. Eric, I wonder if there's something particular that brought you in today that you'd like to share?"
  ];
  return midMessages[Math.floor(Math.random() * midMessages.length)];
};

/**
 * Generate later waiting room responses (messages 8-10)
 */
const generateLaterWaitingResponse = (): string => {
  const laterMessages = [
    "I appreciate you taking the time to chat while waiting. Sometimes these conversations can help set the stage for a productive session with Dr. Eric. Is there anything specific you're hoping to address today?",
    "As your appointment with Dr. Eric approaches, is there anything else you'd like to discuss or any questions you have about the session?",
    "Thanks for chatting with me while you wait. Is there anything specific that would be helpful for you to talk about before your session with Dr. Eric begins?"
  ];
  return laterMessages[Math.floor(Math.random() * laterMessages.length)];
};

/**
 * Determines if waiting room engagement is appropriate based on context
 */
export const shouldUseWaitingRoomEngagement = (
  userInput: string,
  messageCount: number
): boolean => {
  // Always use for very early messages
  if (messageCount <= 3) return true;
  
  // Check for waiting room keywords
  const waitingRoomKeywords = [
    /wait(ing)?/i, /how long/i, /when will/i, /see (eric|the doctor)/i,
    /appointment/i, /schedule/i, /delayed/i, /late/i, /sitting here/i
  ];
  
  return messageCount <= 10 || 
         waitingRoomKeywords.some(keyword => keyword.test(userInput));
};
