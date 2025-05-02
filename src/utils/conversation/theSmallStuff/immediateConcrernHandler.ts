
/**
 * Immediate Concern Handler
 * 
 * Utilities for detecting and responding to urgent patient concerns
 */

/**
 * Identifies immediate concerns that need addressing in early conversation
 */
export const identifyImmediateConcern = (userInput: string): string | null => {
  const lowerInput = userInput.toLowerCase();
  
  // Priority check for emotional states
  if (/upset|sad|depress|anxious|nervous|worried|scared|afraid|angry|mad|frustrat/i.test(lowerInput)) {
    if (/spill(ed)?|drink|accident/i.test(lowerInput)) {
      return "spill_emotional_impact";
    }
    if (/wait(ing)?|appointment|late|delay/i.test(lowerInput)) {
      return "wait_time_emotional";
    }
    if (/work|job|boss|coworker/i.test(lowerInput)) {
      return "work_stress";
    }
    if (/lost|missing|can't find/i.test(lowerInput)) {
      return "lost_item_emotional";
    }
    // General emotional state
    return "emotional_state";
  }
  
  // Common waiting room concerns
  const concernPatterns = [
    { pattern: /wait(ing)?|how long|when|delayed|late/i, concern: "wait_time" },
    { pattern: /first time|never been|new patient|new here/i, concern: "first_visit" },
    { pattern: /cost|payment|insurance|afford|expensive|price/i, concern: "payment_concerns" },
    { pattern: /bad day|rough day|tough day|difficult day/i, concern: "bad_day" },
    { pattern: /lost|can't find|missing|misplaced/i, concern: "lost_item" },
    { pattern: /spill(ed)?|drink|accident|mess|clumsy/i, concern: "spill_incident" },
    { pattern: /guilt(y)?|embarrass|ashamed|regret/i, concern: "feeling_guilty" }
  ];

  for (const { pattern, concern } of concernPatterns) {
    if (pattern.test(lowerInput)) {
      return concern;
    }
  }

  // Check for specific content patterns not caught above
  if (/work|job|office|boss|coworker|colleague/i.test(lowerInput)) {
    return "work_related";
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
    wait_time_emotional: [
      "I can hear that you're feeling frustrated about the wait. That's completely understandable. Dr. Eric tries to give everyone full attention, which sometimes causes slight delays. Would it help to talk about what's on your mind while we wait?",
      "It sounds like the waiting is adding to your stress. I'm sorry about that. While we wait for Dr. Eric, maybe we could use this time to talk through what's been going on for you lately?"
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
    ],
    bad_day: [
      "I'm sorry to hear you're having a rough day. Those days can really wear on you. Would you like to share what's been making today particularly difficult?",
      "Bad days happen to all of us. Sometimes just talking about it can help put things in perspective. What's been going on today that's been challenging?"
    ],
    lost_item: [
      "Losing something important can be incredibly frustrating. It's amazing how much stress a missing item can cause. How long have you been searching for it?",
      "I know how disruptive it can be when you can't find something you need. Is this something you use regularly or has special meaning to you?"
    ],
    lost_item_emotional: [
      "I can hear how upsetting it is to have lost this item. It's completely normal to feel frustrated when something important goes missing. What have you tried so far to find it?",
      "The feeling of missing something important can really throw off your day. I understand why you're upset about it. Can you tell me more about what this item means to you?"
    ],
    spill_incident: [
      "Accidents like spills happen to everyone. Was anyone else involved, or is it mainly the hassle of cleaning up that's on your mind?",
      "Spilling something can create an unexpected disruption in your day. Are you more concerned about any damage caused or about how others reacted?"
    ],
    spill_emotional_impact: [
      "I hear that you're feeling upset about spilling your drink. Those small accidents can sometimes trigger bigger feelings than we might expect. How did the other person respond to the situation?",
      "Spilling something and having someone else affected can definitely bring up feelings of guilt or embarrassment. Those feelings are completely normal. Would it help to talk through exactly what happened?"
    ],
    feeling_guilty: [
      "Guilt can be a heavy feeling to carry around. I appreciate you sharing that with me. What aspects of the situation are making you feel most guilty?",
      "Those feelings of guilt or embarrassment are very normal human reactions. Being able to recognize and acknowledge them is actually a sign of emotional awareness. Would talking through the details help process some of those feelings?"
    ],
    work_related: [
      "Work situations can have a big impact on our overall wellbeing. What specifically happened at work that's been on your mind?",
      "The workplace can be a source of many different kinds of stress. What aspect of work has been most challenging lately?"
    ],
    work_stress: [
      "I hear that work has been difficult for you. Those stresses can really follow you even after the workday ends. What's been the most challenging part of your work situation?",
      "Work frustrations can certainly affect your mood and wellbeing. I understand why you're feeling upset about it. Would it help to talk about what specifically happened at work?"
    ],
    emotional_state: [
      "I notice you're sharing some strong emotions. Thank you for being open about how you're feeling. Would you like to talk more about what's behind these feelings?",
      "I appreciate you expressing your feelings so clearly. That kind of emotional awareness is really valuable. What do you think has been contributing most to how you're feeling?"
    ]
  };

  const defaultResponses = [
    "I appreciate you sharing that. While we're waiting for Dr. Eric, I'm here to listen. What else has been on your mind lately?",
    "That sounds important. I'm glad you brought it up. Is there anything specific about it you'd like to discuss while we wait for Dr. Eric?"
  ];

  const responseOptions = responses[concernType] || defaultResponses;
  return responseOptions[Math.floor(Math.random() * responseOptions.length)];
};
