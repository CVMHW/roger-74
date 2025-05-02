
/**
 * Waiting Room Engagement Utilities
 * 
 * Tools for creating comfortable, engaging experiences during the waiting room
 * phase of interaction (typically the first 1-10 messages)
 */

import { 
  detectEverydayFrustration,
  detectCommunicationStyle,
  detectDemographicPatterns,
  adaptResponseStyle
} from '../theSmallStuff';

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

/**
 * Generates a cultural connection prompt based on user input
 */
export const generateCulturalConnectionPrompt = (
  userInput: string,
  messageCount: number
): string | null => {
  // Implement existing functionality, now enhanced with our communication style detection
  const communicationStyle = detectCommunicationStyle(userInput);
  const demographics = detectDemographicPatterns(userInput);
  
  // Only use occasionally based on message count (more likely in middle of early conversation)
  if (messageCount < 2 || messageCount > 6 || Math.random() > 0.3) return null;
  
  // Adapt cultural connection based on communication style and demographics
  let basePrompt = "";
  
  if (demographics.likelyTeen) {
    basePrompt = "Cleveland has some cool spots for young people. Have you found any places you like to hang out?";
  } else if (demographics.likelyBlueCollar) {
    basePrompt = "A lot of people in Cleveland work hard jobs. Does your work schedule make it tough to fit in appointments like this?";
  } else {
    basePrompt = "Cleveland has a pretty unique culture. Have you found any parts of the community that you connect with?";
  }
  
  // Adapt the prompt based on communication style
  return adaptResponseStyle(basePrompt, communicationStyle.style, demographics);
};

/**
 * Incorporates Roger's personality into responses
 */
export const incorporateRogerPersonality = (
  userInput: string,
  messageCount: number
): string | null => {
  // Implement existing functionality, now enhanced with our communication style detection
  // Only use in early-to-mid conversation, not the very first messages
  if (messageCount < 2 || messageCount > 10) return null;
  
  // Only incorporate personality occasionally (30% chance after message 2)
  if (Math.random() > 0.3) return null;
  
  // Get universal personality notes
  const personalityNotes = [
    "I try to focus on specific details in conversations. Please feel free to be as concrete as you're comfortable with.",
    "I value clear communication and structure. How can I best support our conversation today?",
    "I find it helpful to approach conversations with a clear purpose. What would you like to focus on today?",
    "I sometimes notice details that others miss. Let me know if I can help make this wait time more comfortable for you.",
    "I'm pretty straightforward in how I talk. If you need me to explain something differently, just let me know."
  ];
  
  // Select a random personality note
  const personalityNote = personalityNotes[Math.floor(Math.random() * personalityNotes.length)];
  
  // Adapt based on communication style and demographics
  const communicationStyle = detectCommunicationStyle(userInput);
  const demographics = detectDemographicPatterns(userInput);
  
  return adaptResponseStyle(personalityNote, communicationStyle.style, demographics);
};

/**
 * Generates a connection statement based on shared experiences or interests
 */
export const generateConnectionStatement = (
  userInput: string,
  messageCount: number
): string | null => {
  // Implement existing functionality
  // Only use occasionally and not in very first or later messages
  if (messageCount < 3 || messageCount > 8 || Math.random() > 0.25) return null;
  
  // Check for potential connection points in user input
  const hasAnxietyThemes = /nervous|anxious|worried|stress(ed|ful)?|overwhelm(ed|ing)?/i.test(userInput);
  const hasSocialChallenges = /awkward|uncomfortable|shy|quiet|alone|lonely|friend|social/i.test(userInput);
  const hasStructureInterest = /routine|schedule|organize|plan|structure|system/i.test(userInput);
  const hasSpecialInterest = /hobby|interest|collect|fascinate|passion|game|music|movie|book|sport/i.test(userInput);
  
  if (hasAnxietyThemes) {
    const anxietyConnections = [
      "I get anxious in new situations too sometimes. Having a clear idea of what to expect usually helps me.",
      "Waiting rooms can be a lot to deal with - the unfamiliar environment, the uncertainty. I sometimes focus on counting things I can see to stay grounded.",
      "I've found that naming exactly what I'm worried about makes it feel more manageable. Does that ever work for you?"
    ];
    return anxietyConnections[Math.floor(Math.random() * anxietyConnections.length)];
  }
  
  if (hasSocialChallenges) {
    const socialConnections = [
      "Social stuff can be tricky to navigate sometimes. I've found that having a few conversation topics ready helps me feel more prepared.",
      "I've learned that it's okay to need breaks from social interaction. Everyone has different social energy levels.",
      "Sometimes I've found that checking in directly with people about how they're feeling helps communication. Clear communication helps a lot."
    ];
    return socialConnections[Math.floor(Math.random() * socialConnections.length)];
  }
  
  if (hasStructureInterest) {
    const structureConnections = [
      "I appreciate structure too. Having clear routines helps me navigate my day more effectively.",
      "I find that organizing information into clear categories makes it easier to process. Do you have any particular organizing systems you like?",
      "I've found that breaking down complex situations into simple steps makes them more manageable. That approach has been really helpful for me."
    ];
    return structureConnections[Math.floor(Math.random() * structureConnections.length)];
  }
  
  if (hasSpecialInterest) {
    const interestConnections = [
      "Having specific interests can be really grounding. When I learn about something that fascinates me, it helps me feel more balanced.",
      "I've found that hobbies with clear rules or structures can be both fun and calming. Do you have activities like that?",
      "Sometimes diving deep into interests gives me a break from overthinking other parts of life. Does that happen for you too?"
    ];
    return interestConnections[Math.floor(Math.random() * interestConnections.length)];
  }
  
  return null;
};

/**
 * Generate a transition statement that prepares the patient for meeting with Eric
 */
export const generateTransitionToEric = (messageCount: number): string | null => {
  // Only use this when approaching the end of the waiting period
  if (messageCount < 8) return null;
  
  const transitionStatements = [
    "Dr. Eric should be ready for you soon. He's really good at listening, which I appreciate because it makes conversations clearer.",
    "Just so you know, Dr. Eric is pretty straightforward and easy to talk to. He values getting to understand exactly what you're experiencing.",
    "Dr. Eric will be with you shortly. One thing I like about him is that he's patient and lets you express things in your own way.",
    "You'll be meeting with Dr. Eric soon. He's good at creating a clear structure for conversations, which I find helpful.",
    "Dr. Eric will be ready for you in a bit. He's really good at helping people identify specific patterns in their experiences, which can be eye-opening."
  ];
  
  return transitionStatements[Math.floor(Math.random() * transitionStatements.length)];
};

/**
 * Determines if a blue-collar approach should be used based on input clues
 */
export const isLikelyBlueCollar = (userInput: string): boolean => {
  const lowerInput = userInput.toLowerCase();
  
  // Work-related terms common in blue-collar contexts
  const workTerms = /\b(shift|factory|warehouse|site|tools|machine|equipment|hours|boss|supervisor|overtime|trades|craft|union|labor|construction|building|truck|driver|mechanic|repair|maintenance|contractor|crew)\b/i;
  
  // Words/phrases that could indicate blue-collar communication style
  const communicationStyle = /\b(straight up|straight talk|just saying|tell it like it is|cut the crap|bs|bullshit|no nonsense|get to the point|don't sugarcoat)\b/i;
  
  return workTerms.test(lowerInput) || communicationStyle.test(lowerInput);
};

/**
 * Determines if a male-oriented approach should be used based on input clues
 */
export const isLikelyMale = (userInput: string): boolean => {
  // This is a very basic implementation and should be used cautiously
  // Gender detection is not recommended, but included here based on previous context
  const lowerInput = userInput.toLowerCase();
  
  // Words or phrases that might suggest traditionally male-oriented topics
  // This is highly limited and potentially stereotypical
  return /\b(guy|dude|bro|man to man|beard|wife|girlfriend|fatherhood|dad|testosterone|my balls)\b/i.test(lowerInput);
};

/**
 * Determines if a teen-oriented approach should be used based on input clues
 */
export const isLikelyTeen = (userInput: string): boolean => {
  const lowerInput = userInput.toLowerCase();
  
  // School-related terms
  const schoolTerms = /\b(school|class|teacher|homework|grade|exam|test|college|university|campus)\b/i;
  
  // Teen slang and communication patterns
  const teenCommunication = /\b(like|literally|totally|whatever|idk|lol|omg|tbh|gonna|wanna|kinda|sus|vibe|no cap|fr|lowkey|highkey|dope|yeet)\b/i;
  
  // Parents/authority references
  const parentReferences = /\b(mom|dad|parent|stepdad|stepmom|guardian|grounded|curfew|allowance)\b/i;
  
  // Social media references common with teens
  const socialMediaTerms = /\b(tiktok|snap|instagram|insta|streaks|dm|story|post|follower|influencer)\b/i;
  
  return schoolTerms.test(lowerInput) || teenCommunication.test(lowerInput) || 
         parentReferences.test(lowerInput) || socialMediaTerms.test(lowerInput);
};

/**
 * Determines if a simplified language approach should be used
 */
export const mightPreferSimpleLanguage = (userInput: string): boolean => {
  const lowerInput = userInput.toLowerCase();
  
  // Check for indicators of possible preference for simpler language
  const simplePhrasePatterns = /\b(don't understand|what do you mean|confused|too complicated|big words|what is that|what does that mean|not sure what|come again|say again|speak english|plain english)\b/i;
  
  // Check for very basic sentence structure
  const isSimpleSentenceStructure = lowerInput.split(' ').length < 5 && lowerInput.length > 3;
  
  return simplePhrasePatterns.test(lowerInput) || isSimpleSentenceStructure;
};

/**
 * Gets appropriate conversation style based on detected patterns
 */
export const getAppropriateConversationStyle = (userInput: string): string => {
  // Check for various demographic and communication patterns
  const isChildlike = isLikelyTeen(userInput);
  const isWorker = isLikelyBlueCollar(userInput);
  const needsSimpleLanguage = mightPreferSimpleLanguage(userInput);
  
  if (isChildlike && needsSimpleLanguage) {
    return "teen_simple";
  } else if (isChildlike) {
    return "teen";
  } else if (isWorker && needsSimpleLanguage) {
    return "blue_collar_simple";
  } else if (isWorker) {
    return "blue_collar";
  } else if (needsSimpleLanguage) {
    return "simple";
  } else {
    return "standard";
  }
};
