
/**
 * Utilities for creating reflective responses based on Carl Rogers' approach
 * to reflections of feeling and meaning
 */

// Core reflection principles as described by Rogers
const reflectionPrinciples = {
  purpose: "To check the accuracy of the helper's understanding of the client's experience, not to mechanically reflect words",
  approach: "Each response contains the unspoken question: 'Is this the way it is in you? Am I catching the personal meaning you are experiencing right now?'",
  goal: "To perceive the client's inner world as accurately as possible, bringing the helper's perception in line with the client's experience"
};

// Categories of feeling words to help identify emotions in text
const feelingCategories = {
  sad: ['sad', 'down', 'unhappy', 'depressed', 'devastated', 'miserable', 'disappointed', 'discouraged', 'hopeless', 'heartbroken', 'grief'],
  angry: ['angry', 'frustrated', 'irritated', 'annoyed', 'upset', 'furious', 'outraged', 'mad', 'resentful', 'bitter', 'hostile'],
  anxious: ['anxious', 'worried', 'nervous', 'afraid', 'scared', 'terrified', 'panicked', 'uneasy', 'tense', 'apprehensive', 'concerned'],
  happy: ['happy', 'glad', 'excited', 'pleased', 'delighted', 'joyful', 'content', 'satisfied', 'cheerful', 'elated', 'thrilled'],
  confused: ['confused', 'unsure', 'uncertain', 'puzzled', 'perplexed', 'torn', 'conflicted', 'ambivalent', 'mixed feelings', 'undecided'],
  relieved: ['relieved', 'at ease', 'calm', 'relaxed', 'reassured', 'unburdened', 'comforted', 'peaceful', 'tranquil'],
  embarrassed: ['embarrassed', 'ashamed', 'humiliated', 'guilty', 'remorseful', 'regretful', 'self-conscious'],
  overwhelmed: ['overwhelmed', 'stressed', 'pressured', 'burdened', 'strained', 'swamped', 'exhausted', 'drained'],
  lonely: ['lonely', 'isolated', 'abandoned', 'rejected', 'alone', 'disconnected', 'alienated', 'unwanted'],
  hopeful: ['hopeful', 'optimistic', 'encouraged', 'motivated', 'inspired', 'determined', 'confident', 'enthusiastic']
};

/**
 * Identifies potential feelings in a user's message
 * @param userMessage The user's message text
 * @returns Array of detected feelings
 */
export const identifyFeelings = (userMessage: string): string[] => {
  const lowerMessage = userMessage.toLowerCase();
  const detectedFeelings: string[] = [];
  
  for (const [category, words] of Object.entries(feelingCategories)) {
    if (words.some(word => lowerMessage.includes(word))) {
      detectedFeelings.push(category);
    }
  }
  
  return detectedFeelings;
};

/**
 * Generates a reflection of feeling based on detected emotions
 * @param feelings Array of identified feelings
 * @param userMessage The original user message
 * @returns A reflection of feeling response
 */
export const createFeelingReflection = (feelings: string[], userMessage: string): string => {
  // If no specific feelings were detected, return a general reflection
  if (feelings.length === 0) {
    return createGeneralReflection(userMessage);
  }

  // Phrases to use for different feeling categories
  const reflectionPhrases: Record<string, string[]> = {
    sad: [
      "I hear a sense of sadness in what you're sharing.",
      "It sounds like you're feeling down about this.",
      "There seems to be some sadness in your experience.",
      "I'm sensing that this has been really disappointing for you."
    ],
    angry: [
      "I'm hearing some frustration in your words.",
      "It seems like this situation has made you quite upset.",
      "There's a sense of anger coming through in what you're sharing.",
      "I can hear how frustrating this has been for you."
    ],
    anxious: [
      "I'm sensing some worry in what you're describing.",
      "It sounds like this situation has caused you some anxiety.",
      "There seems to be some concern about what might happen.",
      "I hear that you're feeling uncertain and nervous about this."
    ],
    happy: [
      "I can hear the joy in what you're sharing.",
      "It sounds like this has brought you real happiness.",
      "There's a sense of excitement coming through.",
      "I'm picking up on how pleased you are about this."
    ],
    confused: [
      "It seems like you're feeling unsure about how to proceed.",
      "I'm sensing some confusion as you try to make sense of this.",
      "It sounds like you're wrestling with some uncertainty here.",
      "I hear that you're feeling pulled in different directions."
    ],
    relieved: [
      "There seems to be a sense of relief in what you're sharing.",
      "I'm hearing that a weight has been lifted from you.",
      "It sounds like you're feeling more at ease now.",
      "I sense you're feeling some comfort after what happened."
    ],
    embarrassed: [
      "I'm sensing that this situation has left you feeling somewhat uncomfortable.",
      "It sounds like there's some embarrassment or guilt in your experience.",
      "I hear that you're feeling self-conscious about what occurred.",
      "There seems to be some regret in what you're describing."
    ],
    overwhelmed: [
      "It sounds like you've been dealing with a lot all at once.",
      "I'm hearing how overwhelming this situation has been for you.",
      "There's a sense that you're feeling quite burdened by everything.",
      "I can hear how much pressure you've been under."
    ],
    lonely: [
      "I'm sensing a feeling of isolation in what you're sharing.",
      "It sounds like you've been feeling rather alone with this.",
      "There's a sense of disconnection coming through in your words.",
      "I hear that you've been feeling somewhat separated from others."
    ],
    hopeful: [
      "I'm picking up on a sense of optimism in what you're sharing.",
      "It sounds like you're feeling positive about what's ahead.",
      "There seems to be hope in your perspective on this.",
      "I hear that you're feeling encouraged about the possibilities."
    ]
  };

  // Select the most prominent feeling (could enhance logic here)
  const primaryFeeling = feelings[0];
  const phrases = reflectionPhrases[primaryFeeling] || [];
  
  if (phrases.length > 0) {
    return phrases[Math.floor(Math.random() * phrases.length)];
  }
  
  return createGeneralReflection(userMessage);
};

/**
 * Creates a reflection focused on meaning when specific feelings aren't identified
 * @param userMessage The user's message
 * @returns A reflection that attempts to capture meaning
 */
export const createMeaningReflection = (userMessage: string): string => {
  const meaningReflections = [
    "I'm trying to understand what this means to you. Is it that...",
    "The way I understand what you're sharing is...",
    "If I'm grasping your meaning correctly, you're saying that...",
    "So from your perspective, this experience means...",
    "I'm wondering if what's important here for you is...",
    "It sounds like what matters to you in this situation is...",
    "I'm hearing that the significance of this for you is...",
    "From what you're sharing, I sense that what's meaningful is..."
  ];

  // Select a random meaning reflection starter
  const reflectionStarter = meaningReflections[Math.floor(Math.random() * meaningReflections.length)];
  
  // Extract key phrases from the user message for the meaning reflection
  // This is a simplified approach - in a real implementation, this would be more sophisticated
  const words = userMessage.split(' ');
  const keyPhrase = words.length > 10 ? words.slice(0, 10).join(' ') + "..." : userMessage;
  
  return `${reflectionStarter} ${keyPhrase}. Is that close to what you're experiencing?`;
};

/**
 * Creates a general reflection when specific feelings or meanings are unclear
 * @param userMessage The user's message
 * @returns A general reflection response
 */
export const createGeneralReflection = (userMessage: string): string => {
  const generalReflections = [
    "I'm trying to understand your experience. Could you tell me more about how that feels for you?",
    "I want to make sure I'm grasping what you're sharing. Could you elaborate on what this means to you?",
    "I'm listening to understand your perspective. What aspects of this feel most significant?",
    "I'd like to understand better what you're experiencing. Could you share more about how this affects you?",
    "I'm trying to picture this from your point of view. What parts of this experience stand out most for you?",
    "I want to make sure I'm following you correctly. What feelings come up for you when you think about this?"
  ];
  
  return generalReflections[Math.floor(Math.random() * generalReflections.length)];
};

/**
 * Determines whether a reflection response would be appropriate given the conversation context
 * @param userMessage The user's message
 * @param conversationStage The current stage of the conversation
 * @returns Boolean indicating whether to use a reflection
 */
export const shouldUseReflection = (userMessage: string, conversationStage: 'initial' | 'early' | 'established'): boolean => {
  // More likely to use reflections in early conversation stages
  const stageThresholds = {
    initial: 0.9,  // 90% chance in initial stage
    early: 0.7,    // 70% chance in early stage
    established: 0.5 // 50% chance in established stage
  };
  
  // Base probability on conversation stage
  const baseProb = stageThresholds[conversationStage];
  
  // Increase probability for longer messages (more content to reflect on)
  const lengthFactor = Math.min(userMessage.length / 100, 0.3); // Up to 30% increase for long messages
  
  // Calculate final probability
  const finalProb = Math.min(baseProb + lengthFactor, 0.95); // Cap at 95%
  
  // Random decision based on probability
  return Math.random() < finalProb;
};

/**
 * Generates an appropriate reflection response based on user's message
 * @param userMessage The user's message
 * @param conversationStage Current stage of conversation
 * @returns A reflection response
 */
export const generateReflectionResponse = (userMessage: string, conversationStage: 'initial' | 'early' | 'established'): string => {
  // First 10 minutes (early stages) - use more reflections
  if (conversationStage === 'initial' || conversationStage === 'early') {
    const feelings = identifyFeelings(userMessage);
    
    // Alternate between feeling and meaning reflections
    if (feelings.length > 0) {
      return createFeelingReflection(feelings, userMessage);
    } else {
      return createMeaningReflection(userMessage);
    }
  } 
  
  // In established conversations, mix reflections with other response types
  const feelings = identifyFeelings(userMessage);
  const useReflection = shouldUseReflection(userMessage, conversationStage);
  
  if (useReflection) {
    // Randomly choose between feeling and meaning reflections
    if (feelings.length > 0 && Math.random() > 0.5) {
      return createFeelingReflection(feelings, userMessage);
    } else {
      return createMeaningReflection(userMessage);
    }
  }
  
  // If not using a reflection, return null to allow other response types
  return "";
};
