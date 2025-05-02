
/**
 * Small Talk Topics for Roger
 * 
 * Defines safe and engaging topics for conversation, particularly for
 * the first 10 minutes to establish rapport while patients are waiting.
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
      // Cleveland-specific weather questions
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
      // Wellness questions with Cleveland context
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
      // Cleveland-specific interest questions
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
      // Comfortable waiting questions
      "Sometimes waiting rooms can be a lot. Is the temperature in here okay for you?",
      "I'm here to make your wait easier. Would you prefer to chat or have some quiet time?"
    ]
  },
  // Categories for children and newcomers
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
