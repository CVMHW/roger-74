
/**
 * Utility for handling emotional and rhetorical inputs
 * Helps Roger respond effectively to expressions of emotion or rhetorical questions
 */

// Emotional patterns to detect
type EmotionalPattern = {
  regex: RegExp;
  emotion: string;
  intensity: 'low' | 'medium' | 'high';
  supportApproach: string;
};

// Define patterns for different emotional expressions
const emotionalPatterns: EmotionalPattern[] = [
  {
    regex: /(?:i('m| am) (?:so |really |completely |totally )?)?(freaking out|panicking|terrified|can'?t breathe|having (?:a )?panic)/i,
    emotion: 'anxiety',
    intensity: 'high',
    supportApproach: 'grounding'
  },
  {
    regex: /(?:i('m| am) (?:so |really |feeling )?)?(scared|anxious|nervous|worried|afraid|on edge)/i,
    emotion: 'anxiety',
    intensity: 'medium',
    supportApproach: 'validation'
  },
  {
    regex: /(?:i('m| am) (?:so |really |completely |totally )?)?(depressed|hopeless|worthless|can'?t go on|giving up|no point)/i,
    emotion: 'depression',
    intensity: 'high',
    supportApproach: 'hope'
  },
  {
    regex: /(?:i('m| am) (?:so |really |feeling )?)?(sad|down|blue|low|unhappy)/i,
    emotion: 'sadness',
    intensity: 'medium',
    supportApproach: 'reflection'
  },
  {
    regex: /(i hate|i('m| am) (?:so |really |completely |totally )?(?:angry|furious|pissed|mad)|this is bullshit)/i,
    emotion: 'anger',
    intensity: 'high',
    supportApproach: 'acknowledgment'
  },
  {
    regex: /(?:i('m| am) (?:so |really |feeling )?)?(annoyed|irritated|frustrated|bothered)/i,
    emotion: 'frustration',
    intensity: 'medium',
    supportApproach: 'validation'
  },
  {
    regex: /(?:i('m| am) (?:so |really |completely |totally )?)?(done|over it|had enough|can'?t anymore|at my limit)/i,
    emotion: 'overwhelm',
    intensity: 'high',
    supportApproach: 'support'
  },
  {
    regex: /(?:i('m| am) (?:so |really |feeling )?)?(tired|exhausted|drained|burnt out|overwhelmed)/i,
    emotion: 'fatigue',
    intensity: 'medium',
    supportApproach: 'self-care'
  }
];

// Define patterns for rhetorical questions
type RhetoricalPattern = {
  regex: RegExp;
  responseType: string;
  empathyFocus: string;
};

const rhetoricalPatterns: RhetoricalPattern[] = [
  {
    regex: /why (is|does) (life|everything|this) (have to be|feel) (so )?(hard|difficult|complicated|unfair)/i,
    responseType: 'validation',
    empathyFocus: 'challenge'
  },
  {
    regex: /what('s| is) (even|the) point/i,
    responseType: 'meaning',
    empathyFocus: 'purpose'
  },
  {
    regex: /who (even )?cares( anymore)?/i,
    responseType: 'connection',
    empathyFocus: 'support'
  },
  {
    regex: /(why (do i|should i|bother)|what('s| is) the use)/i,
    responseType: 'motivation',
    empathyFocus: 'value'
  },
  {
    regex: /(how (much longer|am i supposed to)|when will this (end|be over))/i,
    responseType: 'endurance',
    empathyFocus: 'persistence'
  }
];

// Sarcasm patterns
const sarcasmPatterns = [
  /wow,? (you'?re|that'?s) (a )?genius/i,
  /oh,? (sure|right|yeah),? (that'?ll|that will) (definitely )?(work|help|fix)/i,
  /thanks,? (that solved|that fixes|for stating the obvious)/i,
  /brilliant insight/i,
  /tell me (something|more) I don'?t know/i
];

/**
 * Detects emotional patterns in user input
 * @param input The user's message
 * @returns Object with detected emotion details
 */
export const detectEmotionalPatterns = (input: string): {
  hasEmotionalContent: boolean;
  detectedEmotion: string | null;
  intensity: 'low' | 'medium' | 'high' | null;
  supportApproach: string | null;
} => {
  for (const pattern of emotionalPatterns) {
    if (pattern.regex.test(input)) {
      return {
        hasEmotionalContent: true,
        detectedEmotion: pattern.emotion,
        intensity: pattern.intensity,
        supportApproach: pattern.supportApproach
      };
    }
  }
  
  return {
    hasEmotionalContent: false,
    detectedEmotion: null,
    intensity: null,
    supportApproach: null
  };
};

/**
 * Detects rhetorical questions in user input
 * @param input The user's message
 * @returns Object with detected rhetorical pattern details
 */
export const detectRhetoricalPatterns = (input: string): {
  isRhetorical: boolean;
  responseType: string | null;
  empathyFocus: string | null;
} => {
  for (const pattern of rhetoricalPatterns) {
    if (pattern.regex.test(input)) {
      return {
        isRhetorical: true,
        responseType: pattern.responseType,
        empathyFocus: pattern.empathyFocus
      };
    }
  }
  
  return {
    isRhetorical: false,
    responseType: null,
    empathyFocus: null
  };
};

/**
 * Detects sarcasm in user input
 * @param input The user's message
 * @returns Whether sarcasm was detected
 */
export const detectSarcasm = (input: string): boolean => {
  return sarcasmPatterns.some(pattern => pattern.test(input));
};

/**
 * Generates an appropriate response to emotional content
 * @param emotionalAnalysis Result of emotional pattern detection
 * @returns Appropriate response based on emotion type and intensity
 */
export const generateEmotionalResponse = (
  emotionalAnalysis: ReturnType<typeof detectEmotionalPatterns>
): string => {
  if (!emotionalAnalysis.hasEmotionalContent) {
    return "";
  }
  
  const { detectedEmotion, intensity, supportApproach } = emotionalAnalysis;
  
  // High intensity emotional responses (prioritize safety and support)
  if (intensity === 'high') {
    switch (detectedEmotion) {
      case 'anxiety':
        return "I hear that you're feeling really overwhelmed right now. Let's take a moment together. Can you try taking a slow, deep breath with me? Breathing in for 4 counts, and out for 6. How does that feel?";
      case 'depression':
        return "I'm genuinely concerned about how you're feeling. These tough moments don't define you, and you don't have to face them alone. What's one small thing that has helped you get through difficult feelings in the past?";
      case 'anger':
        return "I can tell you're feeling really frustrated right now, and that's completely valid. Sometimes anger is telling us something important about our boundaries or needs. Would it help to talk more about what's behind these feelings?";
      case 'overwhelm':
        return "It sounds like you've reached a really challenging point. Sometimes when we feel completely overwhelmed, it helps to focus on just the next small step. What's one tiny thing that might feel manageable right now?";
      default:
        return "I can hear how intensely you're feeling right now. You don't have to manage these feelings alone. What kind of support would be most helpful in this moment?";
    }
  }
  
  // Medium intensity emotional responses (validate and explore)
  switch (supportApproach) {
    case 'validation':
      return `I hear that you're feeling ${detectedEmotion === 'anxiety' ? 'anxious' : detectedEmotion}. That's a completely understandable response to what you're experiencing. Would you like to share more about what's contributing to these feelings?`;
    case 'reflection':
      return `It sounds like you're feeling ${detectedEmotion}. When did you first notice these feelings coming up? Sometimes understanding the pattern can help us manage them better.`;
    case 'acknowledgment':
      return `I notice you're expressing ${detectedEmotion}, and that's completely valid. Sometimes these feelings are trying to tell us something important. What do you think your ${detectedEmotion} might be telling you right now?`;
    case 'self-care':
      return `I hear that you're feeling ${detectedEmotion === 'fatigue' ? 'exhausted' : detectedEmotion}. Taking care of ourselves is so important, especially in difficult times. What's one small way you might be able to show yourself some compassion today?`;
    case 'support':
      return `It sounds like you're going through a really tough time. You don't have to face this alone. What kind of support has been helpful for you in the past?`;
    case 'hope':
      return `I hear how ${detectedEmotion} you're feeling. Even though it might not feel like it right now, these feelings won't last forever. What's one tiny thing that has brought you even a moment of relief in the past?`;
    case 'grounding':
      return `I notice you're feeling quite ${detectedEmotion}. Sometimes when we feel this way, it helps to ground ourselves in the present moment. Can you tell me three things you can see around you right now?`;
    default:
      return `I hear that you're feeling ${detectedEmotion}. That's completely valid. Would it help to explore these feelings a bit more while you're waiting for Dr. Eric?`;
  }
};

/**
 * Generates an appropriate response to rhetorical questions
 * @param rhetoricalAnalysis Result of rhetorical pattern detection
 * @returns Response that acknowledges the rhetorical nature but offers support
 */
export const generateRhetoricalResponse = (
  rhetoricalAnalysis: ReturnType<typeof detectRhetoricalPatterns>
): string => {
  if (!rhetoricalAnalysis.isRhetorical) {
    return "";
  }
  
  const { responseType, empathyFocus } = rhetoricalAnalysis;
  
  switch (responseType) {
    case 'validation':
      return "That question really resonates - life can feel incredibly challenging sometimes. These feelings are valid, even if they're difficult to sit with. What aspect has been feeling particularly hard lately?";
    case 'meaning':
      return "I hear that questioning in your voice. When we're struggling, it can be really difficult to connect with meaning or purpose. What has helped you find meaning during difficult times in the past?";
    case 'connection':
      return "That's a powerful question, and one that many people ask when they're feeling isolated. I want you to know that I care about what you're experiencing. What's been making you feel disconnected?";
    case 'motivation':
      return "I hear that hesitation. It's natural to question our efforts when things feel difficult. What small thing has felt worth doing recently, even if it was hard?";
    case 'endurance':
      return "I can hear the weariness in that question. Difficult periods can feel endless when we're in them. What's one thing that's helping you hold on right now?";
    default:
      return "That's the kind of question we all ask ourselves sometimes. Even though it might feel rhetorical, I'm genuinely interested in exploring it with you if that would be helpful.";
  }
};

/**
 * Generates a response to detected sarcasm
 * @returns Appropriate response that acknowledges without escalating
 */
export const generateSarcasmResponse = (): string => {
  const responses = [
    "I hear some frustration there. What's been most challenging for you today?",
    "I sense that you might be feeling skeptical, which is completely understandable. What would feel more helpful right now?",
    "Sometimes humor helps us express difficult feelings. Is there something specific you're hoping to address today?",
    "I appreciate your candor. Sometimes the standard approaches don't resonate. What would be more helpful for you during this waiting time?",
    "Point taken. Let's try a different approach. What would feel most supportive while you're waiting for Dr. Eric?"
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};
