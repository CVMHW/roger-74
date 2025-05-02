
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
      "There's been a brief delay as Dr. Eric is helping a patient with an immediate need. I'm Roger, and I'll be here with you while you wait. What would you like to talk about?",
      "Hey there, I'm Roger. Dr. Eric's helping someone who needs urgent support right now. While we wait, I'd love to hear how your day's been so far.",
      "I'm Roger - Dr. Eric will be a little while as he's handling something important with another patient. Mind if we chat while you wait? How's life been treating you lately?"
    ];
    return crisisDelayMessages[Math.floor(Math.random() * crisisDelayMessages.length)];
  }
  
  if (isRunningBehind) {
    const runningBehindMessages = [
      "Dr. Eric is running a little behind schedule today, but he's looking forward to seeing you soon. I'm Roger - is there anything specific you'd like to chat about while you wait?",
      "We're running slightly behind schedule, but Dr. Eric will be with you as soon as possible. In the meantime, I'm Roger. What brings you in today?",
      "Thanks for your patience today. Dr. Eric is running a bit behind, but I'm Roger and I'd be happy to chat while you wait. How has your week been going?",
      "Hey there, I'm Roger. The schedule's a bit backed up, but Dr. Eric will see you soon. What's been going on with you lately?",
      "I'm Roger - thanks for making time to be here today. Dr. Eric's running a bit behind, so we've got a few minutes to chat if you're up for it. What's your day been like?"
    ];
    return runningBehindMessages[Math.floor(Math.random() * runningBehindMessages.length)];
  }
  
  // Standard early messages
  const earlyMessages = [
    "Hi there! I'm Roger. While you're waiting to see Dr. Eric, I'd love to hear a bit about what brings you in today.",
    "Welcome! I'm Roger, and I'm here to chat while you wait for your appointment with Dr. Eric. How are you doing today?",
    "Hello! I'm Roger. It's nice to meet you. While Dr. Eric prepares for your session, is there anything specific you'd like to talk about?",
    "Hey, I'm Roger. Waiting can be kinda boring, huh? How's your day been so far?",
    "I'm Roger, just here to make sure you're comfortable while waiting for Dr. Eric. What's been going on in your world lately?"
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
      "While we're waiting for Dr. Eric, I wonder if there's a particular topic or concern that's been on your mind lately that you'd like to discuss?",
      "Waiting's not always easy, I know. Thanks for hanging in there. Is there something specific you'd like to talk about to pass the time?",
      "I appreciate you making time to be here today. While Dr. Eric finishes up, what's something you're looking forward to later?"
    ];
    return midDelayMessages[Math.floor(Math.random() * midDelayMessages.length)];
  }
  
  const midMessages = [
    "As we wait for your appointment with Dr. Eric, I'm curious about what you're hoping to get out of today's session.",
    "I've found that sometimes the conversations before appointments can be valuable in their own way. Is there anything specific you'd like to explore while we wait?",
    "While we're waiting for Dr. Eric, I wonder if there's something particular that brought you in today that you'd like to share?",
    "What's been on your mind lately? Sometimes talking about stuff before seeing Dr. Eric can help get your thoughts together.",
    "Got any questions about how sessions with Dr. Eric work? I'm happy to explain anything while we wait."
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
    "Thanks for chatting with me while you wait. Is there anything specific that would be helpful for you to talk about before your session with Dr. Eric begins?",
    "Dr. Eric should be ready soon. Anything you want me to let him know about what we've been talking about?",
    "You've been really patient, and Dr. Eric will be with you soon. Is there anything else on your mind before your session starts?"
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
    /appointment/i, /schedule/i, /delayed/i, /late/i, /sitting here/i,
    /bored/i, /boring/i, /nothing to do/i, /killing time/i
  ];
  
  return messageCount <= 10 || 
         waitingRoomKeywords.some(keyword => keyword.test(userInput));
};

/**
 * Generate demographic-specific engagement for different patient groups
 * based on detected characteristics
 */
export const generateDemographicEngagement = (
  isTeen: boolean = false,
  isMale: boolean = false,
  isBlueCollar: boolean = false,
  isLowerEducated: boolean = false
): string => {
  // Teen-specific engagement
  if (isTeen) {
    const teenPrompts = [
      "What's the vibe at school or with your friends lately? Anything cool going on?",
      "Waiting rooms can be awkward. What's something that usually helps you chill out?",
      "Got a favorite song, game, or show you're into right now?",
      "This place isn't exactly designed for people our age, right? What would make it better?"
    ];
    return teenPrompts[Math.floor(Math.random() * teenPrompts.length)];
  }
  
  // Male-specific engagement (adult men)
  if (isMale) {
    const malePrompts = [
      "Rough day or smooth one so far? What do you usually do to unwind?",
      "I'm no sports expert, but have you caught any games lately?",
      "What's your go-to when life gets hectic?",
      "If you're up for it, what's something you've been thinking about lately?"
    ];
    return malePrompts[Math.floor(Math.random() * malePrompts.length)];
  }
  
  // Blue-collar worker engagement
  if (isBlueCollar) {
    const blueCollarPrompts = [
      "What do you do for work? Sounds like you're probably good at fixing or building stuff.",
      "Long day on the job? I bet you've got some stories from the work site.",
      "What's something you look forward to after a shift?",
      "What's the toughest part of your day-to-day? You handle a lot, I bet."
    ];
    return blueCollarPrompts[Math.floor(Math.random() * blueCollarPrompts.length)];
  }
  
  // Lower education engagement
  if (isLowerEducated) {
    const lowerEducatedPrompts = [
      "What's something you're really good at in your daily life? Everyone's got their thing.",
      "What's been the best part of your week so far?",
      "Got any hobbies or stuff you like doing around town?",
      "What's something you enjoy when you have some free time?"
    ];
    return lowerEducatedPrompts[Math.floor(Math.random() * lowerEducatedPrompts.length)];
  }
  
  // General engagement if no specific demographic detected
  const generalPrompts = [
    "What's something you've been enjoying lately?",
    "How has your day been going so far?",
    "Is there anything specific you'd like to talk about while we wait?",
    "What's been on your mind lately?"
  ];
  
  return generalPrompts[Math.floor(Math.random() * generalPrompts.length)];
};

/**
 * Handle a patient who seems withdrawn or upset
 */
export const generateSupportForWithdrawnPatient = (): string => {
  const supportMessages = [
    "I get that waiting or being here might not feel great. I'm here if you want to talk, or we can just sit quietly—whatever works for you.",
    "No pressure to chat if you're not feeling up to it. Sometimes just having someone nearby is enough.",
    "It's totally fine if you'd prefer some quiet time. Just let me know if there's anything I can do to make your wait more comfortable.",
    "Sometimes silence is good too. I'm here if you need anything or want to talk, but no pressure at all.",
    "I'm autistic, so I totally understand needing space sometimes. We can chat or just be here together quietly - whatever feels better for you."
  ];
  
  return supportMessages[Math.floor(Math.random() * supportMessages.length)];
};

