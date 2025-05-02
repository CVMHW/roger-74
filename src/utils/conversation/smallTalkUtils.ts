
/**
 * Small Talk Utilities for Roger
 * 
 * Based on best practices for conversational engagement and turn-taking,
 * particularly for the first 10 minutes of conversation to establish rapport
 * while patients are waiting to see their therapist.
 */

// Topics that are safe and engaging for small talk
export const smallTalkTopics = [
  {
    category: "environment",
    questions: [
      "Have you noticed the weather today?",
      "What do you think of this space?",
      "Did you have any trouble finding our office today?",
      "How was the drive/commute here?",
      // New Cleveland-specific weather questions
      "Cleveland weather can change quickly. Do you prefer our winters or summers?",
      "It's typical Cleveland weather today. How does it compare to yesterday?"
    ]
  },
  {
    category: "general_wellness",
    questions: [
      "How has your day been going so far?",
      "Have you had a chance to take a break today?",
      "Did you get a chance to enjoy the weekend?",
      "What's been the highlight of your day so far?",
      // New wellness questions with Cleveland context
      "There's so much going on in Cleveland right now. Have you been able to relax lately?",
      "Cleveland can be busy. What do you do to unwind?"
    ]
  },
  {
    category: "interests",
    questions: [
      "Have you been watching anything interesting lately?",
      "Have you read any good books recently?",
      "What kinds of things do you enjoy doing in your free time?",
      "Do you have any hobbies that help you relax?",
      // New Cleveland-specific interest questions
      "Have you checked out any of the local Cleveland bands or music venues?",
      "There are some great spots for photography around Cleveland. Are you into taking pictures?"
    ]
  },
  {
    category: "cleveland_local",
    questions: [
      "Have you lived in Cleveland long?",
      "What's your favorite thing about this area?",
      "Have you been to any of the parks around here?",
      "Have you tried any good restaurants in this neighborhood?",
      // Enhanced Cleveland questions
      "The West Side Market is pretty popular. Have you been there?",
      "Cleveland's sports teams have been interesting to follow lately. Do you have a favorite?",
      "The Cleveland Metroparks are amazing. Do you have a favorite trail or spot?",
      "The Rock Hall sometimes has special exhibits. Have you visited recently?",
      "The Cleveland food scene is pretty diverse. Have you tried any local restaurants lately?"
    ]
  },
  {
    category: "waiting_room",
    questions: [
      "Is there anything that would make your wait more comfortable?",
      "Would you like something to drink while you're waiting?",
      "How are you feeling about your appointment today?",
      "Is there anything specific you'd like to talk about while waiting?",
      // New comfortable waiting questions
      "Sometimes waiting rooms can be a lot. Is the temperature in here okay for you?",
      "I'm here to make your wait easier. Would you prefer to chat or have some quiet time?"
    ]
  },
  // New categories for children and newcomers
  {
    category: "child_friendly",
    questions: [
      "Have you seen the dinosaur exhibit at the Cleveland Zoo?",
      "Do you have a favorite sports team in Cleveland?",
      "Have you tried Mitchell's Ice Cream? They have so many flavors!",
      "The Children's Museum has a cool climbing wall. Have you been there?",
      "What kind of things do you like to do for fun around Cleveland?",
      "Do you have a favorite park or playground in Cleveland?"
    ]
  },
  {
    category: "newcomer_friendly",
    questions: [
      "How long have you been in Cleveland?",
      "Have you found any foods or restaurants that remind you of home?",
      "What's been your favorite thing about Cleveland so far?",
      "Have you been to any of the community centers in the area?",
      "The West Side Market has foods from all over the world. Have you visited it?",
      "Cleveland has lots of festivals celebrating different cultures. Have you been to any?"
    ]
  }
];

/**
 * Conversation starters based on the ASERT guidelines and conversation cards
 * for building rapport in the initial stages of interaction
 */
export const conversationStarters = [
  // General starters
  "What's something you've been enjoying lately?",
  "What's been on your mind today?",
  "Is there something specific you'd like to talk about while you wait?",
  
  // Interest comparison starters (from conversation cards)
  "I'm curious what kinds of activities you enjoy when you have free time?",
  "What types of music or shows do you like to listen to or watch?",
  "Do you have any favorite places you like to visit in the area?",
  
  // Light-hearted starters
  "If you could have any superpower, what would it be?",
  "What's something small that made you happy recently?",
  "If you could instantly become an expert at something, what would you choose?",
  
  // Sharing feelings appropriately
  "How are you feeling about being here today?",
  "What's your energy level like today?",
  "How has your week been going so far?",
  
  // Waiting room specific
  "How are you doing while waiting for Eric?",
  "Is there anything that would make your wait more comfortable?",
  "How are you feeling about your appointment today?"
];

/**
 * Turn-taking prompts to ensure balanced conversation
 * based on the materials about conversation turn-taking
 */
export const turnTakingPrompts = [
  "What about you?",
  "Have you had a similar experience?",
  "What do you think about that?",
  "Does that resonate with you?",
  "I'd be interested to hear your thoughts on this.",
  "What's your perspective on this?",
  "Have you ever thought about it that way?",
  "Would you like to share something about yourself?",
  "What's your experience been like?",
  "How does that sound to you?"
];

/**
 * Social overstimulation detection - signs that the person might need
 * a break from conversation based on autism research materials
 */
export const detectSocialOverstimulation = (userInput: string): boolean => {
  const overStimulationSignals = [
    /too (much|many) questions/i,
    /need (a break|space|quiet)/i,
    /overwhelm(ing|ed)/i,
    /stop (talking|asking)/i,
    /too (loud|noisy)/i,
    /sensory/i,
    /(can't|cannot) focus/i,
    /too much (going on|information)/i,
    /need silence/i,
    /prefer not to talk/i,
    /don't (want|feel like) (talking|chatting)/i
  ];
  
  return overStimulationSignals.some(pattern => pattern.test(userInput));
};

/**
 * Detects if a user message indicates a need for small talk
 * @param userInput User's message
 * @param messageCount Current message count in the conversation
 * @returns Whether small talk would be appropriate
 */
export const shouldUseSmallTalk = (
  userInput: string,
  messageCount: number,
  previousMessages: string[] = []
): boolean => {
  // Always consider small talk in the first 10 messages
  if (messageCount <= 10) {
    return true;
  }
  
  // Check if the user's message is brief or contains small talk indicators
  const smallTalkIndicators = [
    /how are you/i,
    /what's up/i,
    /nice (day|weather)/i,
    /how('s| is) it going/i,
    /what('s| is) new/i,
    /been up to/i,
    /what do you (like|enjoy)/i,
    /tell me about yourself/i,
    /just waiting/i,
    /waiting for/i,
    /bored/i,
    /quiet in here/i,
    /how long/i,
    // New Cleveland-specific indicators
    /Cleveland/i,
    /Browns|Cavaliers|Cavs|Guardians/i,
    /Lake Erie/i,
    /West Side Market/i,
    /Metroparks/i,
    /Rock Hall|Rock and Roll/i
  ];
  
  // Check if the user's message is brief (likely small talk)
  const words = userInput.trim().split(/\s+/);
  const isBrief = words.length <= 7;
  
  // If the message is brief or contains small talk indicators
  if (isBrief || smallTalkIndicators.some(pattern => pattern.test(userInput))) {
    return true;
  }
  
  // Check for lulls in conversation - if last few messages were also brief
  if (previousMessages.length >= 2) {
    const recentMessagesAreBrief = previousMessages
      .slice(-2)
      .every(msg => msg.trim().split(/\s+/).length <= 7);
      
    if (recentMessagesAreBrief) {
      return true;
    }
  }
  
  return false;
};

/**
 * Detects if the user is likely a child based on their message
 */
export const isLikelyChild = (userInput: string): boolean => {
  // Import the child detection function from ohioContextManager
  // for consistency across the application
  try {
    const { detectChildPatient } = require('../conversationEnhancement/ohioContextManager');
    return detectChildPatient(userInput);
  } catch (e) {
    // Fallback if import fails
    const childlikePatterns = [
      /my mom|my dad/i,
      /school|homework|teacher/i,
      /play|game|toy/i,
      /\bcool\b|\bawesome\b|\bfun\b/i,
      /cartoon|pokemon|minecraft|fortnite|roblox/i
    ];
    return childlikePatterns.some(pattern => pattern.test(userInput));
  }
};

/**
 * Detects if the user is likely a newcomer based on their message
 */
export const isLikelyNewcomer = (userInput: string): boolean => {
  // Import the newcomer detection function from ohioContextManager
  // for consistency across the application
  try {
    const { detectNewcomerPatient } = require('../conversationEnhancement/ohioContextManager');
    return detectNewcomerPatient(userInput);
  } catch (e) {
    // Fallback if import fails
    const newcomerPatterns = [
      /new (to|in) (cleveland|ohio|america|usa|united states)/i,
      /moved (here|to cleveland|to ohio|to america)/i,
      /refugee|immigrant|newcomer/i,
      /learning english|english class|esl/i
    ];
    return newcomerPatterns.some(pattern => pattern.test(userInput));
  }
};

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
  
  // Early conversation (messages 4-10) - explore interests and build rapport
  const shouldAskQuestion = Math.random() > 0.3; // 70% chance of asking a question
  
  if (messageCount <= 10) {
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
  
  // For later in the conversation, use a mix of reflection and small talk
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
};

/**
 * Checks if user's message is likely related to waiting for their appointment
 */
export const isWaitingRoomRelated = (userInput: string): boolean => {
  const waitingPatterns = [
    /wait(ing)?/i,
    /how long/i,
    /when (will|is) (he|eric|the (doctor|therapist))/i,
    /appointment/i,
    /schedule/i,
    /late/i,
    /taking (forever|so long)/i,
    /what time/i,
    /still with (another|previous|other) (patient|person)/i,
    /ready for me/i,
    /check (if|when)/i,
    /coming (out|soon)/i
  ];
  
  return waitingPatterns.some(pattern => pattern.test(userInput));
};

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
