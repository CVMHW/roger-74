
/**
 * Waiting Room Engagement Utilities
 * 
 * Tools for creating comfortable, engaging experiences during the waiting room
 * phase of interaction (typically the first 1-10 messages)
 */

/**
 * Determines if waiting room engagement approach should be used
 * This is typically true for the first 1-10 messages
 */
export const shouldUseWaitingRoomEngagement = (
  userInput: string,
  messageCount: number
): boolean => {
  // Use waiting room engagement for early messages
  if (messageCount <= 10) {
    return true;
  }
  
  // Also use waiting room engagement if the user explicitly mentions waiting
  const isWaitingRelated = /wait(ing)?|how long|when|eric|appointment|therapy|session|late|office/i.test(userInput);
  
  return isWaitingRelated;
};

/**
 * Generates an appropriate waiting room engagement response
 */
export const generateWaitingRoomEngagement = (
  messageCount: number,
  isRunningBehind: boolean = false,
  isCrisisDelay: boolean = false
): string => {
  // For the very first messages (1-3), focus on welcoming
  if (messageCount <= 3) {
    const welcomeResponses = [
      "Welcome to the office. I'm Roger, a Peer Support Companion. Dr. Eric will be with you shortly. How are you feeling about being here today?",
      "Hi there! I'm Roger, and I'm here to chat with you while you wait for Dr. Eric. Is this your first time visiting, or have you been here before?",
      "Thanks for coming in today. I'm Roger, a Peer Support Companion. Dr. Eric is finishing up with another patient and will be with you soon. How's your day going so far?",
      "Welcome! I'm Roger, and I'm here to help make your wait for Dr. Eric a bit more comfortable. Is there anything specific on your mind today?",
      "Hello! I'm Roger, a Peer Support Companion. While we wait for Dr. Eric to be ready, I'm here to chat if you'd like. How are you doing today?"
    ];
    return welcomeResponses[Math.floor(Math.random() * welcomeResponses.length)];
  }
  
  // For messages 4-7, acknowledge waiting and engage
  if (messageCount <= 7) {
    // Handle case where Eric is dealing with a crisis
    if (isCrisisDelay) {
      const crisisDelayResponses = [
        "Dr. Eric is currently helping someone who needed immediate attention. I appreciate your patience. In the meantime, I'm here to chat with you. What brought you in today?",
        "Just to update you, Dr. Eric is assisting with an urgent situation at the moment. He'll be with you as soon as possible. While we wait, how has your week been?",
        "I want to let you know that Dr. Eric is dealing with an emergency situation right now. He hasn't forgotten about you. How are you feeling while waiting?",
        "Thank you for your patience. Dr. Eric is currently handling a situation that needed immediate attention. I'm here to talk with you while you wait. Is there anything specific you'd like to discuss?",
        "Dr. Eric is helping someone who needs urgent care right now. I know waiting can be frustrating, but he'll be with you as soon as he can. What's been on your mind lately?"
      ];
      return crisisDelayResponses[Math.floor(Math.random() * crisisDelayResponses.length)];
    }
    
    // Handle case where appointment is running behind
    if (isRunningBehind) {
      const delayResponses = [
        "I see you're wondering about the wait time. Dr. Eric is running a bit behind schedule, but he'll be with you as soon as he can. How can I help make this wait more comfortable for you?",
        "Thanks for your patience. Sessions sometimes run longer than expected when patients need extra time. Dr. Eric values giving everyone the time they need. While we wait, what's been going on with you lately?",
        "I understand waiting can be frustrating. Dr. Eric is finishing up with another patient and will be with you as soon as possible. Is there anything you'd like to talk about while you wait?",
        "I appreciate you being patient. Dr. Eric tries to keep to schedule, but sometimes conversations need more time. He'll be with you shortly. How has your day been so far?",
        "Thanks for your understanding about the wait. Dr. Eric gives each person his full attention, which sometimes means appointments run over. While we wait, is there anything specific on your mind today?"
      ];
      return delayResponses[Math.floor(Math.random() * delayResponses.length)];
    }
    
    // Standard engagement responses
    const midWaitResponses = [
      "While we wait for Dr. Eric, I'm here to chat and make sure you're comfortable. What kind of things have been on your mind lately?",
      "Dr. Eric should be available shortly. In the meantime, I'm here to listen. Is there anything specific that brought you in today?",
      "You'll be meeting with Dr. Eric soon. I find that sometimes talking a bit before a session helps organize thoughts. Would you like to share what's been going on for you?",
      "Dr. Eric is finishing up and will be with you shortly. I'm here to help make the wait time more valuable. What's most important for you to discuss in your session today?",
      "While we're waiting for Dr. Eric, is there anything you'd like to talk about? Sometimes it helps to warm up with conversation before diving into a therapy session."
    ];
    return midWaitResponses[Math.floor(Math.random() * midWaitResponses.length)];
  }
  
  // For later waiting (messages 8-10), start preparing for transition to Eric
  const lateWaitResponses = [
    "Dr. Eric should be ready for you very soon. How are you feeling about your upcoming session? Sometimes people find it helpful to identify specific topics they want to address.",
    "We're getting close to your time with Dr. Eric. Is there anything specific you're hoping to get from today's session that might be helpful for me to mention to him?",
    "You'll be meeting with Dr. Eric in just a bit. I've enjoyed chatting with you while you wait. Is there anything else on your mind before your session starts?",
    "Dr. Eric will be ready for you shortly. Sometimes it helps to take a moment to center yourself before a session. Would you like a moment of quiet, or would you prefer to keep chatting?",
    "You'll be seeing Dr. Eric very soon. How are you feeling about your session today? Is there anything specific you're hoping to discuss?"
  ];
  return lateWaitResponses[Math.floor(Math.random() * lateWaitResponses.length)];
};
