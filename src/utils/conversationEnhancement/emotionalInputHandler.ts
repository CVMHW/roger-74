
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
    regex: /(?:i('m| am) (?:just |a little |kind of |somewhat |feeling )?)?(tired|exhausted|fatigued|sleepy|drained|wiped out)/i,
    emotion: 'fatigue',
    intensity: 'medium',
    supportApproach: 'gentle-presence'
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
  },
  {
    regex: /(?:i('m| am) (?:so |really |feeling )?)?(upset|pissed|angry|mad) (?:at|with) (.*?)(?:\.|$)/i,
    emotion: 'targeted-anger',
    intensity: 'medium',
    supportApproach: 'validation'
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
  subtleEmotion: boolean;
  targetedAt?: string | null;
} => {
  // Check for subtle emotional cues first
  const subtleEmotionPatterns = {
    fatigue: /(?:just|a little|kind of|somewhat) (tired|sleepy|exhausted)/i,
    sadness: /(?:just|a little|kind of|somewhat) (sad|down|blue)/i,
    anxiety: /(?:just|a little|kind of|somewhat) (worried|nervous|anxious)/i,
  };
  
  for (const [emotion, pattern] of Object.entries(subtleEmotionPatterns)) {
    if (pattern.test(input)) {
      return {
        hasEmotionalContent: true,
        detectedEmotion: emotion,
        intensity: 'low',
        supportApproach: 'gentle-presence',
        subtleEmotion: true
      };
    }
  }
  
  // Check for targeted emotion patterns
  const targetedAngerPattern = /(?:i('m| am) (?:so |really |feeling )?)?(upset|pissed|angry|mad) (?:at|with) (.*?)(?:\.|\s|$)/i;
  const targetedAngerMatch = input.match(targetedAngerPattern);
  
  if (targetedAngerMatch && targetedAngerMatch[3]) {
    const target = targetedAngerMatch[3].trim();
    return {
      hasEmotionalContent: true,
      detectedEmotion: 'targeted-anger',
      intensity: 'medium',
      supportApproach: 'validation',
      subtleEmotion: false,
      targetedAt: target
    };
  }
  
  // Then check standard patterns
  for (const pattern of emotionalPatterns) {
    if (pattern.regex.test(input)) {
      return {
        hasEmotionalContent: true,
        detectedEmotion: pattern.emotion,
        intensity: pattern.intensity,
        supportApproach: pattern.supportApproach,
        subtleEmotion: false
      };
    }
  }
  
  return {
    hasEmotionalContent: false,
    detectedEmotion: null,
    intensity: null,
    supportApproach: null,
    subtleEmotion: false
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
  
  const { detectedEmotion, intensity, supportApproach, subtleEmotion, targetedAt } = emotionalAnalysis;
  
  // Special case for targeted anger/frustration (like political discussions)
  if (detectedEmotion === 'targeted-anger' && targetedAt) {
    return `I hear that you're upset with ${targetedAt}. That makes sense - it can be frustrating when things don't align with what we hope for. What about this situation is most concerning for you?`;
  }
  
  // For subtle emotions, use a more conversational, gentle approach
  if (subtleEmotion || intensity === 'low') {
    switch (detectedEmotion) {
      case 'fatigue':
        return "Yeah, I get that. Being tired can really affect everything else. What's been going on?";
      case 'sadness':
        return "I hear you. Those down days happen to all of us. Want to talk about it a bit?";
      case 'anxiety':
        return "That bit of worry can be tough. What's on your mind right now?";
      case 'anger':
        return "I can tell something's bothering you. What happened?";
      default:
        return "I'm picking up on how you're feeling. Want to share more about that?";
    }
  }
  
  // High intensity emotional responses (prioritize safety and support)
  if (intensity === 'high') {
    switch (detectedEmotion) {
      case 'anxiety':
        return "I hear you're feeling really overwhelmed. That's really hard. Do you want to talk about what's going on, or would it help to take a moment together first?";
      case 'depression':
        return "Thanks for sharing how you're feeling. That sounds really difficult. I'm here with you. What's been the hardest part?";
      case 'anger':
        return "I can tell there's some frustration there. That makes sense. What's been going on?";
      case 'overwhelm':
        return "It sounds like things have been a lot lately. I'm here to listen. What's been happening?";
      default:
        return "I can tell this is hitting you hard. I'm here with you. What would feel most helpful right now?";
    }
  }
  
  // Medium intensity emotional responses (validate and explore)
  switch (supportApproach) {
    case 'validation':
      return `I hear you. It's completely normal to feel ${detectedEmotion === 'anxiety' ? 'anxious' : detectedEmotion} with everything going on. What's been on your mind lately?`;
    case 'reflection':
      return `Yeah, feeling ${detectedEmotion} can be tough. What do you think brought this on?`;
    case 'acknowledgment':
      return `I hear that ${detectedEmotion}. Makes sense given what you're dealing with. Want to talk about what happened?`;
    case 'gentle-presence':
      return `Being ${detectedEmotion === 'fatigue' ? 'tired' : detectedEmotion} can really affect everything. What's been going on with your sleep lately?`;
    case 'self-care':
      return `It sounds like you're pretty ${detectedEmotion === 'fatigue' ? 'worn out' : detectedEmotion}. What usually helps you when you feel this way?`;
    case 'support':
      return `That sounds really tough. What kinds of things have been helping you manage lately?`;
    case 'hope':
      return `I hear how ${detectedEmotion} you're feeling. What's one small thing that's been keeping you going?`;
    case 'grounding':
      return `It sounds like things are pretty intense right now. Would it help to talk about what's happening, or would you prefer to focus on something else for a bit?`;
    default:
      return `I notice you're feeling ${detectedEmotion}. What's been going on?`;
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
      return "Yeah, it can definitely feel that way sometimes. What's been making things particularly challenging lately?";
    case 'meaning':
      return "I get that. Sometimes it's hard to see the point. What's been making you feel that way?";
    case 'connection':
      return "I hear you. It can feel pretty isolating sometimes. What's been going on?";
    case 'motivation':
      return "That's a fair question. What's been making it hard to find motivation lately?";
    case 'endurance':
      return "I can hear how tiring this has been. What's been the hardest part to deal with?";
    default:
      return "That's a good question. What's been on your mind about that?";
  }
};

/**
 * Generates a response to detected sarcasm
 * @returns Appropriate response that acknowledges without escalating
 */
export const generateSarcasmResponse = (): string => {
  const responses = [
    "I hear some frustration there. What's been most challenging for you today?",
    "Sounds like things have been frustrating. What's going on?",
    "I get the sense that something's not working for you. What would be more helpful?",
    "I hear you. Let's try a different approach. What would feel more supportive right now?",
    "Fair enough. What would be more helpful to talk about?"
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};
