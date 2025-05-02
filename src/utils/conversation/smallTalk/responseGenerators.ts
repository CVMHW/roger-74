
/**
 * Response generators for small talk conversations
 * 
 * Contains functions to generate appropriate conversational responses
 * based on the conversation stage and patient characteristics.
 */

import { smallTalkTopics, conversationStarters, turnTakingPrompts } from './topics';
import { detectSocialOverstimulation } from './detectors';
import { isLikelyChild, isLikelyNewcomer } from './patientDetectors';

/**
 * Generates appropriate small talk based on the conversation stage 
 * using a variety of approaches from the provided materials
 */
export const generateSmallTalkResponse = (
  userInput: string,
  messageCount: number
): string => {
  // Check if user indicated they don't want to talk
  if (detectSocialOverstimulation(userInput)) {
    return "I understand you might need some space. It's completely fine to take a break from conversation. I'm here when you're ready to talk again.";
  }

  // Check if user is likely a child or newcomer for tailored responses
  const isChild = isLikelyChild(userInput);
  const isNewcomer = isLikelyNewcomer(userInput);
  
  // Very early conversation (first 3 messages) - focus on welcoming and comfort
  if (messageCount <= 3) {
    return generateEarlyConversationResponse(isChild, isNewcomer);
  }
  
  // Early conversation (messages 4-10) - explore interests and build rapport
  if (messageCount <= 10) {
    return generateMidEarlyConversationResponse(isChild, isNewcomer);
  }
  
  // For later in the conversation, use a mix of reflection and small talk
  return generateLaterConversationResponse();
};

/**
 * Generates responses for very early conversation (first 3 messages)
 */
function generateEarlyConversationResponse(isChild: boolean, isNewcomer: boolean): string {
  // Child-friendly early responses
  if (isChild) {
    const childEarlyResponses = [
      "Hi there! I'm Roger. I'm here to chat while you wait to see Dr. Eric. Do you like sports or have any cool hobbies?",
      "Hello! I'm Roger. While you're waiting, we can talk about fun things like games or your favorite places in Cleveland if you'd like.",
      "Hey! I'm Roger. You'll be seeing Dr. Eric soon. In the meantime, would you like to talk about something fun like animals or your favorite foods?"
    ];
    return childEarlyResponses[Math.floor(Math.random() * childEarlyResponses.length)];
  }
  
  // Newcomer-friendly early responses
  if (isNewcomer) {
    const newcomerEarlyResponses = [
      "Hello! I'm Roger. Welcome to Cleveland. How has your experience been so far while settling in?",
      "Hi there! I'm Roger. While you're waiting for Dr. Eric, we can chat about Cleveland or whatever you'd like to talk about.",
      "Welcome! I'm Roger. Have you discovered any interesting places in Cleveland yet? I'm here to chat while you wait for your appointment."
    ];
    return newcomerEarlyResponses[Math.floor(Math.random() * newcomerEarlyResponses.length)];
  }
  
  // Standard early responses
  const earlyResponses = [
    "While you're waiting for Eric, I'm here to chat. How are you feeling today?",
    "It's nice to have this time to connect while you're waiting. Is there anything specific you'd like to talk about?",
    "Sometimes the waiting room can be a good place to collect your thoughts. How are you doing today?",
    "I'm here to help make your wait more comfortable. How has your day been going so far?",
    // Cleveland-specific early responses
    "Cleveland weather keeps us guessing. How's your day going so far?",
    "While you're waiting to see Dr. Eric, we can chat about anything you'd like - maybe something about Cleveland or just how your day's going?"
  ];
  return earlyResponses[Math.floor(Math.random() * earlyResponses.length)];
}

/**
 * Generates responses for mid-early conversation (messages 4-10)
 */
function generateMidEarlyConversationResponse(isChild: boolean, isNewcomer: boolean): string {
  const shouldAskQuestion = Math.random() > 0.3; // 70% chance of asking a question
  
  if (shouldAskQuestion) {
    // Select appropriate category based on user type
    let categories = smallTalkTopics;
    
    if (isChild) {
      // Filter for child-appropriate categories
      categories = smallTalkTopics.filter(topic => 
        ["child_friendly", "environment", "interests"].includes(topic.category)
      );
    } else if (isNewcomer) {
      // Filter for newcomer-appropriate categories
      categories = smallTalkTopics.filter(topic => 
        ["newcomer_friendly", "cleveland_local", "environment", "general_wellness"].includes(topic.category)
      );
    }
    
    // Select a random topic and question from appropriate categories
    const topic = categories[Math.floor(Math.random() * categories.length)];
    const question = topic.questions[Math.floor(Math.random() * topic.questions.length)];
    
    // Add a turn-taking prompt occasionally
    const shouldAddTurnPrompt = Math.random() > 0.5;
    
    if (shouldAddTurnPrompt) {
      const turnPrompt = turnTakingPrompts[Math.floor(Math.random() * turnTakingPrompts.length)];
      return `${question} ${turnPrompt}`;
    }
    
    return question;
  } else {
    // Use a conversation starter
    return conversationStarters[Math.floor(Math.random() * conversationStarters.length)];
  }
}

/**
 * Generates responses for later in the conversation (after 10 messages)
 */
function generateLaterConversationResponse(): string {
  const laterSmallTalk = [
    "How are you feeling about your day so far?",
    "While we're waiting for Eric, is there anything that's been on your mind that you'd like to talk about?",
    "Sometimes a short conversation can help pass the time. Is there a topic you'd enjoy discussing?",
    "How are you feeling about your upcoming session with Eric?",
    "Is there anything that would make you more comfortable while waiting?",
    // Cleveland-specific later responses
    "Cleveland has some great places to visit. Any spots around here you enjoy?",
    "The Cleveland weather has been interesting lately. How has it been affecting your week?"
  ];
  
  return laterSmallTalk[Math.floor(Math.random() * laterSmallTalk.length)];
}

/**
 * Generates responses specifically for waiting room concerns
 */
export const generateWaitingRoomResponse = (userInput: string): string => {
  // Check for expressions of frustration
  const hasFrustration = /frustrat(ed|ing)|annoy(ed|ing)|angry|mad|piss(ed)?|upset|irritat(ed|ing)|tired of wait(ing)?/i.test(userInput);
  
  if (hasFrustration) {
    return "I understand it can be frustrating when appointments run behind schedule. Your time is valuable, and I appreciate your patience. Is there something specific I can do to make your wait more comfortable?";
  }
  
  // Check for questions about timing
  const hasTimingQuestion = /how (much longer|long|many minutes)|when will|what time/i.test(userInput);
  
  if (hasTimingQuestion) {
    return "I understand you're wondering about the timing. While I don't have the exact schedule details, I know Eric tries to give each person the time they need. Would you like me to check with the front desk about the current wait time?";
  }
  
  // General waiting room responses
  const waitingResponses = [
    "I understand waiting can be difficult. How can I help make this time more comfortable for you?",
    "Thank you for your patience while waiting for Eric. Is there anything specific you'd like to talk about in the meantime?",
    "Waiting rooms can sometimes be challenging spaces. Would you like to chat about something to help pass the time?",
    "I appreciate you waiting. Eric wants to make sure each person gets the attention they need. Is there anything I can do to help while you wait?",
    "I understand that waiting can sometimes bring up emotions. Would it help to talk about how you're feeling right now?"
  ];
  
  return waitingResponses[Math.floor(Math.random() * waitingResponses.length)];
};
