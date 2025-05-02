
/**
 * Immediate Concern Handler
 * 
 * Utilities for detecting and responding to urgent patient concerns
 */

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
