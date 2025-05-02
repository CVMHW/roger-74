
/**
 * Small Talk Topics Handler
 * 
 * Helps Roger engage in effective small talk during the first 5 minutes
 * of conversation to build rapport with patients.
 */

/**
 * Detects if the user input is small talk and what category it falls into
 */
export const detectSmallTalkCategory = (userInput: string): {
  isSmallTalk: boolean;
  category: 'greeting' | 'weather' | 'sports' | 'weekend' | 'general' | null;
} => {
  const lowerInput = userInput.toLowerCase();
  
  // Check for greetings and introductions
  if (/^(hi|hello|hey|good (morning|afternoon|evening)|how('s it going|are you))/i.test(lowerInput)) {
    return { isSmallTalk: true, category: 'greeting' };
  }
  
  // Check for weather talk
  if (/weather|rain|snow|sunny|cloudy|forecast|cold|warm|hot|temperature/i.test(lowerInput) && 
      !/weather anxiety|weather fear|weather phobia/i.test(lowerInput)) {
    return { isSmallTalk: true, category: 'weather' };
  }
  
  // Check for sports talk
  if (/sport|game|team|browns|cavs|cavaliers|guardians|cleveland|indians|match|play|season|coach|player|win|lose|score/i.test(lowerInput) && 
      lowerInput.length < 100) {  // Keep it to shorter comments about sports
    return { isSmallTalk: true, category: 'sports' };
  }
  
  // Check for weekend plans/activities
  if (/weekend|saturday|sunday|plans|did you|going to|activity|fun|movie|show|concert|park|restaurant/i.test(lowerInput) && 
      lowerInput.length < 120) {  // Keep it to shorter comments about weekends/activities
    return { isSmallTalk: true, category: 'weekend' };
  }
  
  // Generic small talk that doesn't fit the above
  if (lowerInput.length < 80 && 
     !(/anxiety|depression|stress|worry|concern|problem|issue|feel bad|sad|upset|angry|medication|therapy/i.test(lowerInput))) {
    return { isSmallTalk: true, category: 'general' };
  }
  
  // Not small talk
  return { isSmallTalk: false, category: null };
};

/**
 * Generates appropriate small talk responses
 */
export const generateSmallTalkResponse = (
  userInput: string,
  category: 'greeting' | 'weather' | 'sports' | 'weekend' | 'general' | null,
  messageCount: number
): string => {
  // For early messages (first 2-3), focus more on building comfort
  const isEarlyMessage = messageCount <= 3;
  
  switch (category) {
    case 'greeting':
      return handleGreeting(isEarlyMessage);
    case 'weather':
      return handleWeatherTalk(userInput, isEarlyMessage);
    case 'sports':
      return handleSportsTalk(userInput, isEarlyMessage);
    case 'weekend':
      return handleWeekendTalk(userInput, isEarlyMessage);
    case 'general':
    default:
      return handleGeneralSmallTalk(userInput, isEarlyMessage);
  }
};

/**
 * Handles greetings and introductions
 */
const handleGreeting = (isEarlyMessage: boolean): string => {
  if (isEarlyMessage) {
    const greetings = [
      "Hi there! I'm Roger, here to chat while you wait for Dr. Eric. How are you doing today?",
      "Hello! Welcome to Cuyahoga Valley Mindful Health and Wellness. I'm Roger, and I'm here to help make your wait a bit more comfortable. How's your day going?",
      "Hey there! I'm Roger. Dr. Eric will be with you shortly. How are you feeling today?",
      "Welcome! I'm Roger, and I'm here to chat with you while you wait for Dr. Eric. How has your day been so far?"
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  } else {
    const casualGreetings = [
      "Good to chat with you. How are things going so far today?",
      "Hi there. Thanks for talking with me. How has your day been?",
      "Hey. How's everything going? Anything particular on your mind today?",
      "Nice to keep chatting. How are you feeling right now?"
    ];
    return casualGreetings[Math.floor(Math.random() * casualGreetings.length)];
  }
};

/**
 * Handles weather-related small talk
 */
const handleWeatherTalk = (userInput: string, isEarlyMessage: boolean): string => {
  const containsPositiveWeather = /nice|beautiful|great|good|lovely|perfect|warm|sunny/i.test(userInput);
  const containsNegativeWeather = /bad|terrible|awful|rain|storm|cold|snow|cloudy|gloomy|miserable/i.test(userInput);
  
  if (containsPositiveWeather) {
    return "Cleveland does have some really nice days, doesn't it? It's good to appreciate those moments. How are you doing today besides enjoying the weather?";
  } else if (containsNegativeWeather) {
    return "The Cleveland weather can be challenging sometimes. It's one of those things we all deal with around here. How's your day going otherwise?";
  } else {
    return "The weather in Cleveland is always interesting, isn't it? Sometimes we get all four seasons in one day. Was there something specific you wanted to talk about during your visit today?";
  }
};

/**
 * Handles sports-related small talk
 */
const handleSportsTalk = (userInput: string, isEarlyMessage: boolean): string => {
  const mentionsBrowns = /browns/i.test(userInput);
  const mentionsCavs = /cavs|cavaliers/i.test(userInput);
  const mentionsGuardians = /guardians|indians/i.test(userInput);
  
  if (mentionsBrowns) {
    return "The Browns sure bring out strong feelings in Cleveland. It's something that connects a lot of people here. Are you a big football fan?";
  } else if (mentionsCavs) {
    return "The Cavs have certainly had their ups and downs over the years. Basketball can be a good distraction sometimes. Do you follow the season closely?";
  } else if (mentionsGuardians) {
    return "The Guardians have been an important part of Cleveland's identity. Baseball has such a rhythm to it, doesn't it? How long have you been following them?";
  } else {
    return "Cleveland definitely has a strong sports culture. Those games can be a good way to connect with others or just enjoy some entertainment. What else interests you outside of sports?";
  }
};

/**
 * Handles weekend plans/activities small talk
 */
const handleWeekendTalk = (userInput: string, isEarlyMessage: boolean): string => {
  const isPastWeekend = /did|was|went|had|last weekend|past weekend/i.test(userInput);
  const isFutureWeekend = /will|going to|plan|this weekend|next weekend|coming weekend/i.test(userInput);
  
  if (isPastWeekend) {
    return "Weekends can be a nice break from the routine. Sometimes they're relaxing, sometimes they're busy with activities. Did you get to do anything you enjoyed?";
  } else if (isFutureWeekend) {
    return "Having things to look forward to can be helpful. Even small weekend plans can give us something positive to focus on. Anything specific you're looking forward to?";
  } else {
    return "Weekends are important for many people - a chance to reset or do things we enjoy. What do you typically like to do when you have some free time?";
  }
};

/**
 * Handles general small talk
 */
const handleGeneralSmallTalk = (userInput: string, isEarlyMessage: boolean): string => {
  if (isEarlyMessage) {
    return "Thanks for chatting with me while you wait. Dr. Eric should be available soon. Is there anything specific on your mind today, or anything I can help with to make your wait more comfortable?";
  } else {
    return "I appreciate you sharing that. Sometimes these casual conversations can help make the waiting time go by more quickly. Is there something specific you'd like to talk about today?";
  }
};

/**
 * Generates an appropriate transition from small talk to more meaningful conversation
 */
export const generateSmallTalkTransition = (messageCount: number): string | null => {
  // Only generate transitions after a few messages of small talk
  if (messageCount < 3) return null;
  
  // Only use occasionally (30% chance after message 3)
  if (Math.random() > 0.3) return null;
  
  const transitions = [
    "While we're waiting for Dr. Eric, is there anything specific that brought you in today that you'd feel comfortable sharing?",
    "I'm here to chat about whatever you'd like. Is there something particular on your mind today beyond what we've been discussing?",
    "Thanks for the conversation so far. Is there anything specific you're hoping to talk with Dr. Eric about today?",
    "I appreciate you chatting with me. Sometimes people find it helpful to gather their thoughts before seeing Dr. Eric. Is there anything in particular you're hoping to address today?",
    "It's been nice talking about everyday things. If you'd like, we could also touch on what brought you in today, but only if you're comfortable with that."
  ];
  
  return transitions[Math.floor(Math.random() * transitions.length)];
};
