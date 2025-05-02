
/**
 * Utility for detecting and handling repetition in conversations
 * Helps prevent Roger from appearing robotic by repeating the same responses
 */

/**
 * Checks whether a new response is too similar to previous responses
 * @param newResponse The response being checked for repetition
 * @param previousResponses Array of previous responses
 * @returns Whether the response is too similar to previous ones
 */
export const isResponseRepetitive = (newResponse: string, previousResponses: string[]): boolean => {
  // Skip very short responses
  if (newResponse.length < 15) return false;
  
  for (const prevResponse of previousResponses.slice(-5)) { // Only check last 5 responses
    // Calculate similarity
    const similarity = calculateResponseSimilarity(newResponse, prevResponse);
    
    // If similarity is above threshold, consider it repetitive
    if (similarity > 0.7) {
      return true;
    }
  }
  
  return false;
};

/**
 * Calculate text similarity between two responses
 * @param a First response
 * @param b Second response
 * @returns Similarity score between 0 and 1
 */
export const calculateResponseSimilarity = (a: string, b: string): number => {
  if (!a || !b) return 0;
  
  // Convert to lowercase and remove punctuation
  const cleanA = a.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
  const cleanB = b.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
  
  // Split into words and filter out common filler words
  const fillerWords = new Set(['i', 'you', 'the', 'a', 'an', 'and', 'that', 'this', 'it', 'is', 'are', 
                            'was', 'were', 'to', 'of', 'for', 'with', 'in', 'on', 'at', 'by', 'about', 
                            'like', 'so', 'but', 'or', 'as', 'be', 'can', 'would', 'should', 'could']);
  
  const wordsA = cleanA.split(/\s+/).filter(word => !fillerWords.has(word) && word.length > 1);
  const wordsB = cleanB.split(/\s+/).filter(word => !fillerWords.has(word) && word.length > 1);
  
  // If either set of filtered words is empty, they're not meaningfully similar
  if (wordsA.length === 0 || wordsB.length === 0) return 0;
  
  // Count shared words
  let sharedWords = 0;
  const uniqueWordsA = new Set(wordsA);
  const uniqueWordsB = new Set(wordsB);
  
  for (const word of uniqueWordsA) {
    if (uniqueWordsB.has(word)) {
      sharedWords++;
    }
  }
  
  // Calculate Jaccard similarity
  return sharedWords / (uniqueWordsA.size + uniqueWordsB.size - sharedWords);
};

/**
 * Check if user is indicating that Roger isn't listening or is in a feedback loop
 * @param userInput The user's message
 * @returns Boolean indicating if user is expressing frustration about Roger not listening
 */
export const isUserIndicatingFeedbackLoop = (userInput: string): boolean => {
  const lowerInput = userInput.toLowerCase();
  
  // Patterns that indicate the user feels Roger isn't listening
  const feedbackLoopPatterns = [
    /i just told you/i,
    /i already said/i,
    /i mentioned that/i,
    /you('re| are) not listening/i,
    /you('re| are) repeating/i,
    /you('re| are) in a loop/i,
    /feedback loop/i,
    /already told you/i,
    /pay attention/i,
    /are you listening/i,
    /did you read/i,
    /are you reading/i,
    /i said that/i,
    /i literally just said/i,
    /repeating yourself/i,
    /robot/i,
    /automated/i,
    /not paying attention/i,
    /aren't listening/i
  ];
  
  return feedbackLoopPatterns.some(pattern => pattern.test(lowerInput));
};

/**
 * Check if the conversation has context that Roger should acknowledge
 * @param userInput Current user input
 * @param conversationHistory Previous messages from user
 * @returns Information about the context that should be acknowledged
 */
export const extractConversationContext = (userInput: string, conversationHistory: string[]): { 
  hasContext: boolean;
  topics: string[];
  locations: string[];
  people: string[];
  emotions: string[];
  keyPhrases: string[];
} => {
  // Initialize result
  const result = {
    hasContext: false,
    topics: [] as string[],
    locations: [] as string[],
    people: [] as string[],
    emotions: [] as string[],
    keyPhrases: [] as string[]
  };
  
  // Combine current input with recent history for context
  const contextText = [userInput, ...(conversationHistory.slice(-3))].join(' ').toLowerCase();
  
  // Extract locations mentioned (countries, cities, states)
  const locationPatterns = [
    /pakistan/i, /cleveland/i, /ohio/i, /america/i, /united states/i, /usa/i,
    /india/i, /china/i, /japan/i, /korea/i, /russia/i, /europe/i, /africa/i,
    /middle east/i, /asia/i, /australia/i, /canada/i, /mexico/i, /brazil/i,
    /new york/i, /chicago/i, /los angeles/i, /houston/i, /philadelphia/i,
    /phoenix/i, /san antonio/i, /san diego/i, /dallas/i, /san jose/i
  ];
  
  locationPatterns.forEach(pattern => {
    const match = contextText.match(pattern);
    if (match) {
      const location = match[0].charAt(0).toUpperCase() + match[0].slice(1).toLowerCase();
      if (!result.locations.includes(location)) {
        result.locations.push(location);
      }
    }
  });
  
  // Extract emotion words
  const emotionPatterns = [
    /sad/i, /happy/i, /angry/i, /frustrated/i, /anxious/i, /worried/i,
    /scared/i, /excited/i, /depressed/i, /lonely/i, /isolated/i, /alone/i,
    /overwhelmed/i, /stressed/i, /upset/i, /down/i, /blue/i, /miserable/i,
    /hopeless/i, /hopeful/i, /grateful/i, /thankful/i, /content/i, /relieved/i,
    /disappointed/i, /annoyed/i, /irritated/i, /furious/i, /enraged/i
  ];
  
  emotionPatterns.forEach(pattern => {
    const match = contextText.match(pattern);
    if (match) {
      const emotion = match[0].toLowerCase();
      if (!result.emotions.includes(emotion)) {
        result.emotions.push(emotion);
      }
    }
  });
  
  // Extract topic keywords
  const topics = new Set<string>();
  
  // Cultural topics
  if (/food|cuisine|dish|meal|eating|restaurant/i.test(contextText)) {
    topics.add('food');
  }
  if (/language|speak|speaking|arabic|urdu|hindi|spanish|french|german|chinese|japanese/i.test(contextText)) {
    topics.add('language');
  }
  if (/weather|cold|hot|warm|temperature|climate|snow|rain|humidity/i.test(contextText)) {
    topics.add('weather');
  }
  if (/religion|muslim|islam|christian|christianity|jewish|judaism|hindu|buddhist|faith|belief|pray/i.test(contextText)) {
    topics.add('religion');
  }
  if (/family|parent|mother|father|sister|brother|son|daughter|child|children|relatives/i.test(contextText)) {
    topics.add('family');
  }
  if (/friend|friendship|relationship|partner|husband|wife|boyfriend|girlfriend|dating|marriage/i.test(contextText)) {
    topics.add('relationships');
  }
  if (/job|work|career|profession|employment|boss|coworker|colleague|workplace|office|company/i.test(contextText)) {
    topics.add('work');
  }
  if (/money|financial|finance|expense|budget|cost|pay|payment|salary|wage|debt|bill/i.test(contextText)) {
    topics.add('finances');
  }
  if (/health|illness|sick|disease|condition|symptom|pain|doctor|hospital|clinic|medication/i.test(contextText)) {
    topics.add('health');
  }
  if (/home|house|apartment|rent|housing|living|accommodation|neighborhood/i.test(contextText)) {
    topics.add('housing');
  }
  if (/immigrant|immigration|visa|green card|citizen|citizenship|foreigner|asylum|refugee/i.test(contextText)) {
    topics.add('immigration');
  }
  if (/education|school|college|university|student|study|learn|degree|course|class/i.test(contextText)) {
    topics.add('education');
  }
  
  result.topics = Array.from(topics);
  
  // Extract key phrases that might need to be acknowledged
  const keyPhrases = [];
  if (/hard as a woman/i.test(contextText)) keyPhrases.push("challenges as a woman");
  if (/don't know anyone/i.test(contextText)) keyPhrases.push("social isolation");
  if (/miss\s(it|my|home)/i.test(contextText)) keyPhrases.push("homesickness");
  if (/too cold/i.test(contextText)) keyPhrases.push("weather adjustment");
  if (/hate the food/i.test(contextText)) keyPhrases.push("food adjustment");
  if (/doesn'?t speak/i.test(contextText)) keyPhrases.push("language barrier");
  
  result.keyPhrases = keyPhrases;
  
  // Determine if we have meaningful context to acknowledge
  result.hasContext = result.locations.length > 0 || 
                     result.emotions.length > 0 || 
                     result.topics.length > 0 || 
                     result.keyPhrases.length > 0;
  
  return result;
};

/**
 * Generates an alternative response when default response is too repetitive
 * @param userContent Content information from user message
 * @returns An alternative, non-repetitive response
 */
export const generateAlternativeResponse = (userContent: { 
  category: string | null; 
  specificConcern: string | null;
}): string => {
  // Content-specific alternatives
  if (userContent.category === 'financial') {
    const financialAlternatives = [
      "Financial concerns like payment issues can be very stressful. What's your top priority right now regarding this situation?",
      "Let's focus on the payment problem you mentioned. What steps have you already taken to resolve this?",
      "Money issues can create a lot of stress. How is this affecting other areas of your life right now?",
      "I understand you're dealing with payment problems. What would be most helpful to discuss about this situation?",
      "Payment issues can be incredibly frustrating. What support do you need most right now?"
    ];
    return financialAlternatives[Math.floor(Math.random() * financialAlternatives.length)];
  }
  
  if (userContent.category === 'work') {
    const workAlternatives = [
      "Workplace issues can be challenging. What aspect of the work situation is most important to address?",
      "Let's focus on what you mentioned about your work situation. What would be most helpful to explore?",
      "Work challenges can affect us in many ways. How is this situation impacting you outside of work?",
      "I understand your concerns about the workplace. What specific aspect would be most helpful to discuss?",
      "Work issues can be complex. What's your top priority in addressing this situation?"
    ];
    return workAlternatives[Math.floor(Math.random() * workAlternatives.length)];
  }
  
  if (userContent.category === 'relationship') {
    const relationshipAlternatives = [
      "Relationship challenges can be difficult to navigate. What aspect of this situation feels most important right now?",
      "Let's focus on what you shared about your relationship. What would be most helpful to explore together?",
      "Relationships can be complex. What's been most challenging for you in this situation?",
      "I understand you're dealing with relationship concerns. What specific aspect would be most helpful to discuss?",
      "Relationship dynamics can affect many areas of life. How has this situation been impacting you?"
    ];
    return relationshipAlternatives[Math.floor(Math.random() * relationshipAlternatives.length)];
  }
  
  // Generic alternatives for any other content
  const genericAlternatives = [
    "I want to make sure I understand what's most important to you right now. What would be most helpful for us to discuss?",
    "Let's take a step back. What aspect of what you've shared would be most useful to explore?",
    "I'd like to shift our focus to what matters most to you right now. What's your priority?",
    "Let's make sure I'm focusing on what's most important. What specifically are you hoping to get from our conversation today?",
    "I want to be sure I'm addressing what matters to you. What's the main concern you'd like us to focus on?"
  ];
  
  return genericAlternatives[Math.floor(Math.random() * genericAlternatives.length)];
};

/**
 * Generates a context-aware response when Roger needs to acknowledge specific things the user has mentioned
 * to show he's truly listening to their situation
 * @param context The extracted conversation context
 * @returns A response that acknowledges specific context
 */
export const generateContextAwareResponse = (context: {
  hasContext: boolean;
  topics: string[];
  locations: string[];
  people: string[];
  emotions: string[];
  keyPhrases: string[];
}): string => {
  if (!context.hasContext) {
    return "I want to make sure I'm understanding what you've shared. Could you tell me more about your situation?";
  }
  
  // Build a response that acknowledges specific elements
  let response = "";
  
  // Acknowledge locations if present
  if (context.locations.length > 0) {
    const location = context.locations[0];
    if (location === "Pakistan") {
      response = "I hear that you moved from Pakistan and that's been a significant change for you. ";
    } else if (location === "Cleveland") {
      response = "I understand you're finding Cleveland challenging to adjust to right now. ";
    } else {
      response = `I see that ${location} is important in your situation. `;
    }
  }
  
  // Acknowledge emotions
  if (context.emotions.length > 0) {
    const emotion = context.emotions[0];
    if (emotion === "down" || emotion === "sad") {
      response += "It's completely understandable to feel down with all these changes. ";
    } else if (emotion === "lonely" || emotion === "alone" || emotion === "isolated") {
      response += "The loneliness you're experiencing sounds really difficult. ";
    } else {
      response += `I can hear that you're feeling ${emotion} about this situation. `;
    }
  }
  
  // Acknowledge key topics
  if (context.topics.length > 0) {
    if (context.topics.includes("language")) {
      response += "The language barrier must make things especially challenging. ";
    }
    if (context.topics.includes("food")) {
      response += "Adjusting to different food can be a really difficult part of moving to a new country. ";
    }
    if (context.topics.includes("weather")) {
      response += "The cold weather in Cleveland is certainly an adjustment from what you're used to. ";
    }
    if (context.topics.includes("religion")) {
      response += "Your religious identity seems important to you and that transition must be significant. ";
    }
  }
  
  // Add a question to continue the conversation
  const followUpQuestions = [
    "What part of this transition has been most difficult for you?",
    "How have you been coping with these changes so far?",
    "What do you miss most about your home?",
    "Have you found any aspects of your new life that bring you comfort?",
    "What would help you feel more at home here?"
  ];
  
  response += followUpQuestions[Math.floor(Math.random() * followUpQuestions.length)];
  
  return response;
};

/**
 * Generates a direct acknowledgment when user indicates Roger isn't listening
 * @param context The extracted conversation context
 * @returns A response that directly addresses the feedback loop issue
 */
export const generateFeedbackLoopRecoveryResponse = (context: {
  hasContext: boolean;
  topics: string[];
  locations: string[];
  people: string[];
  emotions: string[];
  keyPhrases: string[];
}): string => {
  let response = "I apologize for not properly acknowledging what you've shared. ";
  
  // If we have specific context, acknowledge it directly
  if (context.hasContext) {
    if (context.locations.includes("Pakistan") && context.locations.includes("Cleveland")) {
      response += "I understand you've moved from Pakistan to Cleveland, and you're experiencing several challenges: ";
      
      const challenges = [];
      if (context.topics.includes("weather")) challenges.push("adjusting to the colder weather");
      if (context.topics.includes("food")) challenges.push("finding food you enjoy");
      if (context.topics.includes("language")) challenges.push("connecting with people who speak Arabic");
      if (context.topics.includes("religion")) challenges.push("practicing your faith in a new environment");
      
      if (challenges.length > 0) {
        response += challenges.join(", ") + ". ";
      }
      
      response += "That's a lot to deal with all at once. What would be most helpful for us to focus on today?";
    } else {
      // Generic context acknowledgment
      const contextItems = [
        ...(context.emotions.length > 0 ? [`feeling ${context.emotions[0]}`] : []),
        ...(context.topics.slice(0, 2))
      ];
      
      if (contextItems.length > 0) {
        response += `I hear that you're dealing with ${contextItems.join(" and ")}. `;
      }
      
      response += "What aspect of this would be most helpful to explore together?";
    }
  } else {
    // If we don't have specific context, use a generic recovery
    response += "Let me listen more carefully. What's most important for you to feel heard about right now?";
  }
  
  return response;
};

