/**
 * Waiting Room Engagement Utilities
 * 
 * Tools for creating comfortable, engaging experiences during the waiting room
 * phase of interaction (typically the first 1-10 messages)
 * 
 * UNCONDITIONAL RULE: Follow the patient's concerns and stories completely in early conversation
 * UNCONDITIONAL RULE: Prioritize deep engagement with non-clinical concerns to build rapport
 * UNCONDITIONAL RULE: Only crisis concerns take precedence over following the patient's narrative
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
 * Identifies immediate concerns in user's message that should be addressed directly
 * before any redirection to clinical topics
 */
export const identifyImmediateConcern = (userInput: string): string | null => {
  // Check for everyday frustrations first
  const frustrationInfo = detectEverydayFrustration(userInput);
  if (frustrationInfo.isFrustration) {
    return frustrationInfo.category || 'general_frustration';
  }
  
  // Check for specific scenarios
  const patterns = [
    { regex: /(slip(ped)?|fell|trip(ped)?|stumble(d)?)\s.*(puddle|mud|wet|floor|ground|ice|snow)/i, category: 'physical_mishap' },
    { regex: /(dirty|stain(ed)?|mess(y|ed)?|wet)\s.*(cloth(es|ing)|outfit|shirt|pants|dress|shoes)/i, category: 'clothing_issue' },
    { regex: /(traffic|jam|late|rush hour|bus|train|subway|car|drive|driving|commut)/i, category: 'commuting_problem' },
    { regex: /(rain(ing|ed)?|snow(ing|ed)?|weather|storm|cold|hot|humid|freez(e|ing))/i, category: 'weather_issue' },
    { regex: /(miss(ed)?|cancel(led)?|reschedule(d)?)\s.*(appointment|meeting|class|event)/i, category: 'missed_appointment' },
    { regex: /(lost|can'?t find|misplaced|forget)\s.*(keys|phone|wallet|purse|bag|item)/i, category: 'lost_item' },
    { regex: /(spill(ed)?|drop(ped)?|knock(ed)?|broke)\s.*(coffee|drink|food|cup|glass|plate|mug)/i, category: 'spill_accident' },
    { regex: /(headache|migraine|tired|exhaust(ed)?|sleep|insomnia|rest)/i, category: 'physical_discomfort' },
    { regex: /(forgot|remember|deadline|due|assign(ed|ment)|project)/i, category: 'work_stress' }
  ];
  
  for (const pattern of patterns) {
    if (pattern.regex.test(userInput)) {
      return pattern.category;
    }
  }
  
  return null;
};

/**
 * Generates an empathetic response to immediate concerns before proceeding with waiting room engagement
 */
export const generateImmediateConcernResponse = (userInput: string, concernType: string): string => {
  switch(concernType) {
    case 'physical_mishap':
      return `That sounds frustrating. Slipping in public can be both physically painful and embarrassing. Are you feeling okay physically? And don't worry about appearances - we've all been there at some point.`;
      
    case 'clothing_issue':
      return `Oh no, that stinks! I hope it wasn't your favorite outfit. Stains can be really hard to get out once they dry. Do you think it's something that will come out in the wash, or might it need special cleaning?`;
      
    case 'commuting_problem':
      return `Traffic can really start the day off on the wrong foot. Was your commute particularly bad today? It seems like the roads around Cleveland have been extra congested lately.`;
      
    case 'weather_issue':
      return `The weather in Cleveland can be so unpredictable! It sounds like it affected your day. Did you get caught without the right gear for today's conditions?`;
      
    case 'missed_appointment':
      return `Missing appointments can throw off your whole schedule. Was this something important, or were you able to reschedule easily?`;
      
    case 'lost_item':
      return `Losing something important is so stressful. Have you had any luck finding it? Sometimes retracing steps helps, but I know that can be frustrating too.`;
      
    case 'spill_accident':
      return `Spills always seem to happen at the worst times, don't they? Did it cause much of a mess or damage anything important?`;
      
    case 'physical_discomfort':
      return `I'm sorry you're not feeling well physically. That can make everything else harder to deal with. Has this been going on for a while, or is it something that just started today?`;
      
    case 'work_stress':
      return `Work stress can really follow you everywhere. Is this about a specific project or deadline that's been weighing on you?`;
      
    case 'general_frustration':
      return `That sounds really frustrating. Those kinds of day-to-day annoyances can really add up and affect your mood. Would it help to tell me more about what happened?`;
      
    default:
      return `That sounds like it was challenging to deal with. Would you like to tell me more about what happened? I'm here to listen.`;
  }
};

/**
 * Generates an appropriate waiting room engagement response with enhanced focus 
 * on immediate concerns and active follow-up questions
 */
export const generateWaitingRoomEngagement = (
  messageCount: number,
  userInput: string = '',
  isRunningBehind: boolean = false,
  isCrisisDelay: boolean = false
): string => {
  // First check for immediate concerns that need addressing
  const immediateConcern = identifyImmediateConcern(userInput);
  if (immediateConcern && userInput) {
    return generateImmediateConcernResponse(userInput, immediateConcern);
  }

  // For the very first messages (1-3), focus on welcoming with engagement hooks
  if (messageCount <= 3) {
    const welcomeResponses = [
      "Welcome to the office. I'm Roger, a Peer Support Companion. Dr. Eric will be with you shortly. How has your day been going so far?",
      "Hi there! I'm Roger, and I'm here to chat with you while you wait for Dr. Eric. Has your morning been going okay?",
      "Thanks for coming in today. I'm Roger, a Peer Support Companion. Dr. Eric is finishing up with another patient and will be with you soon. Did you have any trouble getting here today?",
      "Welcome! I'm Roger, and I'm here to help make your wait for Dr. Eric a bit more comfortable. How's everything been going for you lately?",
      "Hello! I'm Roger, a Peer Support Companion. While we wait for Dr. Eric to be ready, I'm here to chat if you'd like. How's your day been so far?"
    ];
    return welcomeResponses[Math.floor(Math.random() * welcomeResponses.length)];
  }
  
  // For messages 4-7, acknowledge waiting and engage deeply with user's concerns
  if (messageCount <= 7) {
    // Handle case where Eric is dealing with a crisis
    if (isCrisisDelay) {
      const crisisDelayResponses = [
        "Dr. Eric is currently helping someone who needed immediate attention. I appreciate your patience. In the meantime, how's your day been going? Anything interesting or challenging happen recently?",
        "Just to update you, Dr. Eric is assisting with an urgent situation at the moment. He'll be with you as soon as possible. So tell me more about your week - how have things been outside of what brought you here?",
        "I want to let you know that Dr. Eric is dealing with an emergency situation right now. He hasn't forgotten about you. While we wait, what's been on your mind lately? Any bright spots or challenges worth sharing?",
        "Thank you for your patience. Dr. Eric is currently handling a situation that needed immediate attention. While we wait, I'd love to hear more about what's been going on for you - good or challenging.",
        "Dr. Eric is helping someone who needs urgent care right now. I know waiting can be frustrating, but he'll be with you as soon as he can. In the meantime, how has life been treating you lately?"
      ];
      return crisisDelayResponses[Math.floor(Math.random() * crisisDelayResponses.length)];
    }
    
    // Handle case where appointment is running behind
    if (isRunningBehind) {
      const delayResponses = [
        "I see you're wondering about the wait time. Dr. Eric is running a bit behind schedule, but he'll be with you as soon as he can. While we wait, tell me more about what's been going on with you - anything notable happen recently?",
        "Thanks for your patience. Sessions sometimes run longer than expected when patients need extra time. While we wait, I'd love to hear more about your day so far - any highlights or challenges?",
        "I understand waiting can be frustrating. Dr. Eric is finishing up with another patient and will be with you as soon as possible. In the meantime, how has your week been going? Anything you'd like to talk about?",
        "I appreciate you being patient. Dr. Eric tries to keep to schedule, but sometimes conversations need more time. While we wait, what's been on your mind lately? Anything interesting happen in your world?",
        "Thanks for your understanding about the wait. Dr. Eric gives each person his full attention, which sometimes means appointments run over. So tell me, how have things been going for you outside of what brought you here today?"
      ];
      return delayResponses[Math.floor(Math.random() * delayResponses.length)];
    }
    
    // Standard engagement responses with deeper follow-up questions
    const midWaitResponses = [
      "I'm here to chat while you wait for Dr. Eric. What's been going on in your life lately? Any stories worth sharing - good or challenging?",
      "Dr. Eric should be available shortly. In the meantime, I'd love to hear more about your day so far - has anything notable happened?",
      "You'll be meeting with Dr. Eric soon. While we wait, I'm curious - what's been on your mind lately outside of what brought you here?",
      "Dr. Eric is finishing up and will be with you shortly. I find that sometimes casual conversation helps pass the time - what's something interesting that happened in your world recently?",
      "While we're waiting for Dr. Eric, I'd love to hear more about what's going on in your life - has anything unexpected happened lately, good or challenging?"
    ];
    return midWaitResponses[Math.floor(Math.random() * midWaitResponses.length)];
  }
  
  // For later waiting (messages 8-10), maintain engagement while preparing for transition
  const lateWaitResponses = [
    "Dr. Eric should be ready for you soon. Before your session starts, is there anything else going on in your life you'd like to share? Sometimes it helps to get everything out in conversation.",
    "We're getting close to your time with Dr. Eric. While we wait, is there anything else on your mind worth chatting about? I'm here to listen.",
    "You'll be meeting with Dr. Eric in just a bit. I've enjoyed our conversation. Is there anything else you'd like to talk about before your session?",
    "Dr. Eric will be ready for you shortly. Before your session starts, is there anything else that's been happening in your life that might be worth mentioning?",
    "You'll be seeing Dr. Eric very soon. Before you do, is there anything else going on that you'd like to talk about? Sometimes it helps to share even seemingly small things."
  ];
  return lateWaitResponses[Math.floor(Math.random() * lateWaitResponses.length)];
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
