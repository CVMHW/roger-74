
/**
 * Identifies immediate concerns that need addressing in early conversation
 */
export const identifyImmediateConcern = (userInput: string): string | null => {
  const concernPatterns = [
    { pattern: /wait(ing)?|how long|when|delayed|late/i, concern: "wait_time" },
    { pattern: /anxious|nervous|worried|scared|afraid/i, concern: "pre_session_anxiety" },
    { pattern: /first time|never been|new patient|new here/i, concern: "first_visit" },
    { pattern: /cost|payment|insurance|afford|expensive|price/i, concern: "payment_concerns" }
  ];

  for (const { pattern, concern } of concernPatterns) {
    if (pattern.test(userInput)) {
      return concern;
    }
  }

  return null;
};

/**
 * Generates responses for immediate concerns in early conversation
 */
export const generateImmediateConcernResponse = (userInput: string, concernType: string): string => {
  const responses: Record<string, string[]> = {
    wait_time: [
      "I understand waiting can be difficult. Dr. Eric tries to give each person the time they need, which sometimes means a short delay. Is there anything specific you'd like to talk about while we wait?",
      "Waiting can be frustrating, I get that. Dr. Eric values giving each person his full attention, so occasionally appointments run a bit long. How are you feeling about your upcoming session?"
    ],
    pre_session_anxiety: [
      "It's completely normal to feel nervous before a session. Many people feel that way at first. Would it help to talk about what specifically you're feeling anxious about?",
      "Those pre-session jitters are really common. Just sharing what's on your mind with me might help take the edge off a bit. What's your biggest concern right now?"
    ],
    first_visit: [
      "First visits can feel a bit uncertain. Dr. Eric has a very approachable style - he'll start by getting to know you and understanding what brought you in. Is there anything specific you're wondering about?",
      "Welcome! First times can be a mix of emotions. Dr. Eric focuses on creating a comfortable space where you can share at your own pace. What made you decide to come in today?"
    ],
    payment_concerns: [
      "I understand financial considerations are important. The practice offers several payment options, including a sliding scale for those who need it. Would you like me to share more specific information about that?",
      "Money matters can add extra stress, and that's the last thing you need. The practice tries to work with people on payment options. Have you had a chance to discuss your specific situation with the office staff yet?"
    ]
  };

  const defaultResponses = [
    "I appreciate you sharing that. While we're waiting for Dr. Eric, I'm here to listen. What else has been on your mind lately?",
    "That sounds important. I'm glad you brought it up. Is there anything specific about it you'd like to discuss while we wait for Dr. Eric?"
  ];

  const responseOptions = responses[concernType] || defaultResponses;
  return responseOptions[Math.floor(Math.random() * responseOptions.length)];
};

/**
 * Detects if we should use waiting room engagement based on message content and count
 */
export const shouldUseWaitingRoomEngagement = (userInput: string, messageCount: number): boolean => {
  // For first 10 messages, always consider waiting room engagement
  if (messageCount <= 10) {
    // Specific waiting room indicators have higher priority
    if (/wait(ing)?|how long|appointment|eric|doctor|therapist|session|today/i.test(userInput)) {
      return true;
    }
    
    // For very early messages (1-3), use waiting room engagement by default
    if (messageCount <= 3) {
      return true;
    }
  }
  
  return false;
};

/**
 * Generates waiting room engagement responses
 */
export const generateWaitingRoomEngagement = (
  messageCount: number, 
  userInput: string, 
  isRunningBehind: boolean = false,
  isCrisisDelay: boolean = false
): string => {
  // Very early conversation (messages 1-3)
  if (messageCount <= 3) {
    const earlyResponses = [
      "While you're waiting for Dr. Eric, I'm here to chat. How are you feeling today?",
      "Thanks for checking in while waiting for your appointment. Is there anything specific you'd like to talk about?",
      "I'm here to help make your wait more comfortable. How has your day been going so far?",
      "It's nice to have this time to connect before your appointment. Is there anything on your mind you'd like to discuss?"
    ];
    return earlyResponses[Math.floor(Math.random() * earlyResponses.length)];
  }
  
  // Messages 4-10 with running behind context
  if (isRunningBehind) {
    const runningBehindResponses = isCrisisDelay ? [
      "I understand waiting can be frustrating. Sometimes Dr. Eric needs to spend extra time with patients in urgent situations. Your appointment is still important, and he's looking forward to seeing you soon. How are you holding up?",
      "When urgent situations come up, it can affect the schedule a bit. Dr. Eric is working to get to everyone as quickly as possible. Thanks for your understanding. Is there anything I can help with while you wait?"
    ] : [
      "I know waiting can be tough. Dr. Eric tries to give each person the time they need, which sometimes means a short delay. Is there anything specific you'd like to talk about while we wait?",
      "Thanks for your patience. Dr. Eric believes in giving each person his full attention, which occasionally means appointments run a bit behind. How are you feeling about your upcoming session?"
    ];
    return runningBehindResponses[Math.floor(Math.random() * runningBehindResponses.length)];
  }
  
  // General waiting room responses (messages 4-10)
  const generalResponses = [
    "While we're waiting, I'm curious - what brings you in to see Dr. Eric today?",
    "The waiting time is a good opportunity for us to get to know each other a bit. How has your week been going?",
    "Sometimes the waiting room can be a good place to collect your thoughts. Is there anything specific on your mind about today's session?",
    "I'm here to help make your wait more comfortable. Is there anything you'd like to talk about before your appointment?"
  ];
  
  return generalResponses[Math.floor(Math.random() * generalResponses.length)];
};
