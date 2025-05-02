
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
  /tell me (something|more) I don'?t know/i,
  /are you stupid/i,
  /not listening/i,
  /aren't listening/i,
  /robotic/i
];

// Content recognition patterns - detect specific concerns/topics
const contentPatterns = [
  {
    category: 'financial',
    patterns: [
      /not (getting )?(paid|my paycheck|my money)/i,
      /pay( | is | was | got )?(missed|late|wrong|issue)/i,
      /payroll (mistake|error|issue|problem)/i,
      /my (check|money|payment) (isn't|wasn't|didn't)/i,
      /financial (problem|issue|stress|concern)/i
    ]
  },
  {
    category: 'relationship',
    patterns: [
      /my (partner|spouse|boyfriend|girlfriend|husband|wife|significant other)/i,
      /(relationship|marriage) (issue|problem|trouble|stress)/i,
      /getting (divorced|separated)/i,
      /breaking up/i
    ]
  },
  {
    category: 'work',
    patterns: [
      /my (boss|manager|supervisor|colleague|coworker)/i,
      /at (work|my job|the office)/i,
      /got (fired|let go|laid off)/i,
      /(workplace|job) (stress|issue|problem)/i
    ]
  },
  {
    category: 'health',
    patterns: [
      /my (health|illness|condition|diagnosis)/i,
      /feeling (sick|ill|unwell)/i,
      /doctor (said|told|diagnosed)/i,
      /medical (issue|problem|concern|bill)/i
    ]
  }
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
 * Detects specific content/concerns in user input
 * @param input The user's message
 * @returns Object with detected content details
 */
export const detectContentConcerns = (input: string): {
  hasConcern: boolean;
  category: string | null;
  specificConcern: string | null;
} => {
  for (const category of contentPatterns) {
    for (const pattern of category.patterns) {
      if (pattern.test(input)) {
        // Extract the specific concern by finding the match
        const match = input.match(pattern);
        const specificConcern = match ? match[0] : null;
        
        return {
          hasConcern: true,
          category: category.category,
          specificConcern
        };
      }
    }
  }
  
  return {
    hasConcern: false,
    category: null,
    specificConcern: null
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
 * Detects repeated statements/concerns in conversation history
 * @param currentInput User's current message
 * @param history Previous messages in the conversation
 * @returns Information about repeated content
 */
export const detectRepetition = (currentInput: string, history: string[]): {
  isRepeating: boolean;
  repeatedContent: string | null;
  repetitionCount: number;
} => {
  if (history.length === 0) {
    return {
      isRepeating: false,
      repeatedContent: null,
      repetitionCount: 0
    };
  }
  
  // Check for content repetition from the user
  const contentMatches = [];
  const lowercaseInput = currentInput.toLowerCase();
  
  // Extract key phrases (3+ word sequences)
  const inputWords = lowercaseInput.split(/\s+/);
  const phrases = [];
  
  for (let i = 0; i <= inputWords.length - 3; i++) {
    phrases.push(inputWords.slice(i, i + 3).join(' '));
    if (i <= inputWords.length - 4) {
      phrases.push(inputWords.slice(i, i + 4).join(' '));
    }
    if (i <= inputWords.length - 5) {
      phrases.push(inputWords.slice(i, i + 5).join(' '));
    }
  }
  
  // Check for repeated phrases in history
  for (const phrase of phrases) {
    if (phrase.length < 10) continue; // Skip very short phrases
    
    let count = 0;
    for (const message of history) {
      if (message.toLowerCase().includes(phrase)) {
        count++;
        contentMatches.push(phrase);
      }
    }
  }
  
  // If we found repeated content
  if (contentMatches.length > 0) {
    // Find the most frequently repeated phrase
    const counts = {};
    let maxPhrase = contentMatches[0];
    let maxCount = 0;
    
    for (const phrase of contentMatches) {
      counts[phrase] = (counts[phrase] || 0) + 1;
      if (counts[phrase] > maxCount) {
        maxCount = counts[phrase];
        maxPhrase = phrase;
      }
    }
    
    return {
      isRepeating: true,
      repeatedContent: maxPhrase,
      repetitionCount: maxCount
    };
  }
  
  return {
    isRepeating: false,
    repeatedContent: null,
    repetitionCount: 0
  };
};

/**
 * Generates an appropriate response to emotional content
 * Improved to acknowledge specific concerns mentioned
 * @param emotionalAnalysis Result of emotional pattern detection
 * @param contentAnalysis Result of content detection
 * @returns Appropriate response based on emotion type and context
 */
export const generateEmotionalResponse = (
  emotionalAnalysis: ReturnType<typeof detectEmotionalPatterns>,
  contentAnalysis: ReturnType<typeof detectContentConcerns> = { hasConcern: false, category: null, specificConcern: null }
): string => {
  if (!emotionalAnalysis.hasEmotionalContent) {
    return "";
  }
  
  const { detectedEmotion, intensity, supportApproach, subtleEmotion, targetedAt } = emotionalAnalysis;
  
  // Integrate specific content/concern acknowledgment if available
  const specificAcknowledgment = contentAnalysis.hasConcern 
    ? ` about ${contentAnalysis.specificConcern || contentAnalysis.category}`
    : '';
  
  // Special case for targeted anger/frustration with specific content
  if (detectedEmotion === 'targeted-anger' && targetedAt && contentAnalysis.hasConcern) {
    if (contentAnalysis.category === 'financial') {
      return `I understand you're upset with ${targetedAt} about ${contentAnalysis.specificConcern || 'the payment issues'}. That's really frustrating. Pay problems can cause real stress. What steps have you taken so far to address this?`;
    }
    else if (contentAnalysis.category === 'work') {
      return `I hear that you're upset with ${targetedAt} at your workplace. Work issues can be really frustrating, especially when they affect your ${contentAnalysis.specificConcern || 'situation'}. What's been most challenging about this?`;
    }
    return `I hear that you're upset with ${targetedAt}${specificAcknowledgment}. That makes sense - it can be frustrating when things don't align with what we hope for. What part of this situation is most troubling for you?`;
  }
  
  // Special case for targeted anger/frustration (like political discussions)
  if (detectedEmotion === 'targeted-anger' && targetedAt) {
    return `I hear that you're upset with ${targetedAt}. That makes sense - it can be frustrating when things don't align with what we hope for. What about this situation is most concerning for you?`;
  }
  
  // For subtle emotions, use a more conversational, gentle approach
  if (subtleEmotion || intensity === 'low') {
    switch (detectedEmotion) {
      case 'fatigue':
        return `Yeah, I get that feeling tired${specificAcknowledgment} can really affect everything else. What's been going on?`;
      case 'sadness':
        return `I hear you. Those down days${specificAcknowledgment} happen to all of us. Want to talk about what's happening?`;
      case 'anxiety':
        return `That bit of worry${specificAcknowledgment} can be tough. What's on your mind right now?`;
      case 'anger':
        return `I can tell something's bothering you${specificAcknowledgment}. What happened?`;
      default:
        return `I'm picking up on how you're feeling${specificAcknowledgment}. Want to share more about that?`;
    }
  }
  
  // High intensity emotional responses with content awareness
  if (intensity === 'high') {
    switch (detectedEmotion) {
      case 'anxiety':
        if (contentAnalysis.hasConcern) {
          return `I hear you're feeling really overwhelmed about ${contentAnalysis.specificConcern || contentAnalysis.category}. That's really difficult. What aspect of this is causing you the most stress right now?`;
        }
        return "I hear you're feeling really overwhelmed. That's really hard. Do you want to talk about what's going on, or would it help to take a moment together first?";
      case 'depression':
        if (contentAnalysis.hasConcern) {
          return `Thanks for sharing how you're feeling about ${contentAnalysis.specificConcern || contentAnalysis.category}. That sounds really difficult. What part of this situation has been the hardest for you?`;
        }
        return "Thanks for sharing how you're feeling. That sounds really difficult. I'm here with you. What's been the hardest part?";
      case 'anger':
        if (contentAnalysis.hasConcern && contentAnalysis.category === 'financial') {
          return `I can tell you're really frustrated about ${contentAnalysis.specificConcern || 'the payment issues'}. Not getting paid properly is extremely frustrating. What's your next step to resolve this?`;
        }
        if (contentAnalysis.hasConcern) {
          return `I can see you're really upset about ${contentAnalysis.specificConcern || contentAnalysis.category}. That makes sense given what you've shared. What's been most frustrating about this situation?`;
        }
        return "I can tell there's some frustration there. That makes sense. What's been going on?";
      case 'overwhelm':
        if (contentAnalysis.hasConcern) {
          return `It sounds like dealing with ${contentAnalysis.specificConcern || contentAnalysis.category} has been a lot lately. What's been the most overwhelming part of this?`;
        }
        return "It sounds like things have been a lot lately. I'm here to listen. What's been happening?";
      default:
        if (contentAnalysis.hasConcern) {
          return `I can tell this ${contentAnalysis.specificConcern || contentAnalysis.category} situation is hitting you hard. What would be most helpful to focus on right now?`;
        }
        return "I can tell this is hitting you hard. I'm here with you. What would feel most helpful right now?";
    }
  }
  
  // Medium intensity emotional responses with content awareness
  switch (supportApproach) {
    case 'validation':
      if (contentAnalysis.hasConcern) {
        return `I hear that you're feeling ${detectedEmotion === 'anxiety' ? 'anxious' : detectedEmotion} about ${contentAnalysis.specificConcern || contentAnalysis.category}. That's completely understandable. What specific part is most concerning you?`;
      }
      return `I hear you. It's completely normal to feel ${detectedEmotion === 'anxiety' ? 'anxious' : detectedEmotion} with everything going on. What's been on your mind lately?`;
    case 'reflection':
      if (contentAnalysis.hasConcern) {
        return `Yeah, feeling ${detectedEmotion} about ${contentAnalysis.specificConcern || contentAnalysis.category} can be tough. How has this been affecting you?`;
      }
      return `Yeah, feeling ${detectedEmotion} can be tough. What do you think brought this on?`;
    case 'acknowledgment':
      if (contentAnalysis.hasConcern && contentAnalysis.category === 'work') {
        return `I hear that you're angry about ${contentAnalysis.specificConcern || 'your work situation'}. It makes sense you'd feel that way. Work issues can be really frustrating. What options do you see for addressing this?`;
      }
      if (contentAnalysis.hasConcern) {
        return `I hear that you're feeling ${detectedEmotion} about ${contentAnalysis.specificConcern || contentAnalysis.category}. Makes sense given what you're dealing with. What's been most frustrating about this?`;
      }
      return `I hear that ${detectedEmotion}. Makes sense given what you're dealing with. Want to talk about what happened?`;
    case 'gentle-presence':
      return `Being ${detectedEmotion === 'fatigue' ? 'tired' : detectedEmotion}${specificAcknowledgment} can really affect everything. What's been going on lately?`;
    case 'self-care':
      return `It sounds like you're pretty ${detectedEmotion === 'fatigue' ? 'worn out' : detectedEmotion}${specificAcknowledgment}. What usually helps you when you feel this way?`;
    case 'support':
      if (contentAnalysis.hasConcern) {
        return `That sounds really tough dealing with ${contentAnalysis.specificConcern || contentAnalysis.category}. What kinds of things have been helping you cope with this?`;
      }
      return `That sounds really tough. What kinds of things have been helping you manage lately?`;
    case 'hope':
      return `I hear how ${detectedEmotion} you're feeling${specificAcknowledgment}. What's one small thing that's been keeping you going?`;
    case 'grounding':
      return `It sounds like things are pretty intense right now${specificAcknowledgment}. Would it help to talk about what's happening, or would you prefer to focus on something else for a bit?`;
    default:
      return `I notice you're feeling ${detectedEmotion}${specificAcknowledgment}. What's been going on?`;
  }
};

/**
 * Generates an appropriate response when a user is repeating themselves
 * Used when Roger seems to not be "getting it" or addressing their concern
 */
export const generateRepetitionAcknowledgment = (
  repetitionInfo: ReturnType<typeof detectRepetition>,
  contentAnalysis: ReturnType<typeof detectContentConcerns>
): string => {
  if (!repetitionInfo.isRepeating) return "";
  
  if (contentAnalysis.hasConcern && contentAnalysis.category === 'financial') {
    return `I apologize for not addressing your concern directly. I understand that you're dealing with payment issues and not getting paid properly. That's a serious problem. How is this affecting your day-to-day life right now?`;
  }
  
  if (contentAnalysis.hasConcern && contentAnalysis.category === 'work') {
    return `I'm sorry I didn't acknowledge your work situation properly. You've made it clear this is about issues with your workplace. What would be most helpful to discuss about this situation?`;
  }
  
  if (contentAnalysis.hasConcern) {
    return `I apologize for not properly addressing your concern about ${contentAnalysis.specificConcern || contentAnalysis.category}. I want to make sure I understand what you're dealing with. Could you tell me more about what's most important for us to focus on?`;
  }
  
  // Generic response if we can't identify the specific content
  return `I'm sorry for not properly hearing what you've been saying. I want to make sure I understand correctly. Could you help me focus on what's most important for us to discuss right now?`;
};

/**
 * Generates a response to rhetorical questions
 * @param rhetoricalAnalysis Result of rhetorical pattern detection
 * @returns Response that acknowledges the rhetorical nature but offers support
 */
export const generateRhetoricalResponse = (
  rhetoricalAnalysis: ReturnType<typeof detectRhetoricalPatterns>,
  contentAnalysis: ReturnType<typeof detectContentConcerns> = { hasConcern: false, category: null, specificConcern: null }
): string => {
  if (!rhetoricalAnalysis.isRhetorical) {
    return "";
  }
  
  // Add content acknowledgment if available
  const contentAcknowledgment = contentAnalysis.hasConcern 
    ? ` with ${contentAnalysis.specificConcern || contentAnalysis.category}`
    : '';
  
  const { responseType, empathyFocus } = rhetoricalAnalysis;
  
  switch (responseType) {
    case 'validation':
      return `Yeah, it can definitely feel that way${contentAcknowledgment} sometimes. What's been making things particularly challenging lately?`;
    case 'meaning':
      return `I get that. Sometimes it's hard to see the point${contentAcknowledgment}. What's been making you feel that way?`;
    case 'connection':
      return `I hear you. It can feel pretty isolating${contentAcknowledgment} sometimes. What's been going on?`;
    case 'motivation':
      return `That's a fair question. What's been making it hard to find motivation${contentAcknowledgment} lately?`;
    case 'endurance':
      return `I can hear how tiring this has been${contentAcknowledgment}. What's been the hardest part to deal with?`;
    default:
      return `That's a good question${contentAcknowledgment}. What's been on your mind about that?`;
  }
};

/**
 * Generates a response to detected sarcasm
 * @returns Appropriate response that acknowledges without escalating
 */
export const generateSarcasmResponse = (
  contentAnalysis: ReturnType<typeof detectContentConcerns> = { hasConcern: false, category: null, specificConcern: null }
): string => {
  // For specific content categories
  if (contentAnalysis.hasConcern) {
    if (contentAnalysis.category === 'financial') {
      return "I apologize for not being more direct. I understand you're dealing with payment issues, which is extremely frustrating. What impact is this having on you right now?";
    }
    if (contentAnalysis.category === 'work') {
      return "I'm sorry for not addressing your workplace concern clearly. Let me be more direct - what exactly do you need help with regarding this work situation?";
    }
    return `I apologize if I've been frustrating to talk with. Let's focus directly on your concern about ${contentAnalysis.specificConcern || contentAnalysis.category}. What specifically would be helpful to discuss?`;
  }
  
  // Generic responses
  const responses = [
    "I hear your frustration. Let me be more direct - what's the most important thing you need from this conversation right now?",
    "You're right, I should be more direct. What's the core issue you're dealing with that I can help with?",
    "I apologize for not being more helpful. Let's refocus - what's the main concern you'd like to address?",
    "Sorry for the frustration. Let's try a different approach - what specifically would be most helpful to talk about?",
    "You're right to call that out. Let me be clearer - what's the most pressing issue you're facing?"
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};
