
/**
 * Unified Emotion Detector
 * 
 * Uses the sophisticated emotions wheel for accurate detection
 * NO MORE "NEUTRAL" RESPONSES FOR THERAPY SESSIONS
 */

export interface EmotionResult {
  primaryEmotion: string;
  intensity: 'low' | 'medium' | 'high' | 'critical';
  category: 'happy' | 'sad' | 'angry' | 'fearful' | 'disgusted' | 'surprised';
  confidence: number;
  therapeuticContext: string;
  rogerResponse: string;
}

// Sophisticated emotions wheel mapping
const EMOTIONS_WHEEL = {
  happy: {
    ecstatic: ['ecstatic', 'euphoric', 'elated', 'blissful'],
    joyful: ['joyful', 'cheerful', 'delighted', 'gleeful'],
    content: ['content', 'satisfied', 'peaceful', 'serene'],
    optimistic: ['optimistic', 'hopeful', 'confident', 'encouraged'],
    playful: ['playful', 'cheeky', 'free', 'energetic'],
    proud: ['proud', 'successful', 'respected', 'valued']
  },
  sad: {
    despair: ['despair', 'hopeless', 'powerless', 'grief'],
    lonely: ['lonely', 'vulnerable', 'abandoned', 'isolated'],
    guilty: ['guilty', 'ashamed', 'remorse', 'regret'],
    depressed: ['depressed', 'disappointed', 'dismayed', 'hurt'],
    rejected: ['rejected', 'insignificant', 'worthless', 'inferior']
  },
  angry: {
    furious: ['furious', 'livid', 'outraged', 'hostile'],
    frustrated: ['frustrated', 'annoyed', 'irritated', 'agitated'],
    bitter: ['bitter', 'resentful', 'violated', 'indignant'],
    mad: ['mad', 'aggressive', 'provoked', 'infuriated'],
    humiliated: ['humiliated', 'disrespected', 'ridiculed', 'let down']
  },
  fearful: {
    overwhelmed: ['overwhelmed', 'helpless', 'frightened', 'scared'],
    anxious: ['anxious', 'insecure', 'weak', 'rejected'],
    worried: ['worried', 'nervous', 'threatened', 'exposed'],
    persecuted: ['persecuted', 'excluded', 'worthless', 'inadequate']
  },
  disgusted: {
    revolted: ['revolted', 'appalled', 'horrified', 'nauseated'],
    awful: ['awful', 'terrible', 'detestable', 'repelled'],
    judgmental: ['judgmental', 'embarrassed', 'disapproving', 'skeptical'],
    withdrawn: ['withdrawn', 'numb', 'dismissive', 'bored']
  },
  surprised: {
    amazed: ['amazed', 'astonished', 'awe', 'eager'],
    confused: ['confused', 'perplexed', 'disillusioned', 'shocked'],
    startled: ['startled', 'dismayed', 'confused', 'surprised']
  }
};

// Crisis-level emotion patterns
const CRISIS_EMOTIONS = [
  'hopeless', 'despair', 'worthless', 'powerless', 'suicidal', 'overwhelmed'
];

// Therapy-specific context patterns
const THERAPY_CONTEXTS = {
  relationship: /wife|husband|spouse|partner|boyfriend|girlfriend|marriage|divorce|breakup|left me|broke up/i,
  work: /job|work|career|boss|fired|laid off|unemployed|quit|promotion|colleague/i,
  family: /mom|dad|mother|father|parents|family|siblings|children|kids/i,
  health: /sick|illness|health|medical|doctor|hospital|pain|diagnosis/i,
  financial: /money|financial|debt|bills|broke|expensive|afford|budget/i,
  social: /friends|social|lonely|isolated|people|party|group|community/i,
  identity: /who am i|identity|purpose|meaning|self|myself|confidence|worth/i
};

/**
 * Detect emotions using sophisticated wheel - NO NEUTRAL ALLOWED
 */
export const detectEmotion = (userInput: string): EmotionResult => {
  if (!userInput || userInput.trim().length === 0) {
    return createDefaultTherapyResponse();
  }

  const lowerInput = userInput.toLowerCase();
  
  // Step 1: Check for crisis-level emotions FIRST
  for (const crisisEmotion of CRISIS_EMOTIONS) {
    if (lowerInput.includes(crisisEmotion)) {
      return {
        primaryEmotion: crisisEmotion,
        intensity: 'critical',
        category: 'sad',
        confidence: 0.95,
        therapeuticContext: 'crisis',
        rogerResponse: `I hear how ${crisisEmotion} you're feeling right now. That's an incredibly heavy emotion to carry.`
      };
    }
  }

  // Step 2: Detect specific emotions from wheel
  let bestMatch: EmotionResult | null = null;
  let highestConfidence = 0;

  for (const [category, emotionGroups] of Object.entries(EMOTIONS_WHEEL)) {
    for (const [emotionType, synonyms] of Object.entries(emotionGroups)) {
      for (const synonym of synonyms) {
        const regex = new RegExp(`\\b${synonym}\\b`, 'i');
        if (regex.test(userInput)) {
          const confidence = calculateConfidence(userInput, synonym, category);
          if (confidence > highestConfidence) {
            highestConfidence = confidence;
            bestMatch = {
              primaryEmotion: synonym,
              intensity: determineIntensity(userInput, synonym),
              category: category as any,
              confidence,
              therapeuticContext: detectTherapeuticContext(userInput),
              rogerResponse: generateRogerResponse(synonym, category, userInput)
            };
          }
        }
      }
    }
  }

  // Step 3: If no specific emotion found, infer from context
  if (!bestMatch || bestMatch.confidence < 0.3) {
    return inferEmotionFromContext(userInput);
  }

  return bestMatch;
};

/**
 * Calculate confidence based on context and emotional markers
 */
const calculateConfidence = (input: string, emotion: string, category: string): number => {
  let confidence = 0.6; // Base confidence

  // Boost for emotional intensifiers
  if (/very|extremely|really|so|absolutely|completely|totally/.test(input)) {
    confidence += 0.2;
  }

  // Boost for personal pronouns (I feel, I am)
  if (/\b(i feel|i am|i'm|i've been)\b/i.test(input)) {
    confidence += 0.15;
  }

  // Boost for therapy context
  if (Object.values(THERAPY_CONTEXTS).some(pattern => pattern.test(input))) {
    confidence += 0.1;
  }

  // Boost for negative emotions (more likely in therapy)
  if (['sad', 'angry', 'fearful', 'disgusted'].includes(category)) {
    confidence += 0.1;
  }

  return Math.min(confidence, 1.0);
};

/**
 * Determine emotional intensity
 */
const determineIntensity = (input: string, emotion: string): 'low' | 'medium' | 'high' | 'critical' => {
  if (CRISIS_EMOTIONS.includes(emotion)) return 'critical';
  
  if (/extremely|completely|absolutely|devastated|destroyed/.test(input)) return 'high';
  if (/very|really|so|quite|pretty/.test(input)) return 'medium';
  if (/a bit|slightly|somewhat|kind of|sort of/.test(input)) return 'low';
  
  return 'medium';
};

/**
 * Detect therapeutic context
 */
const detectTherapeuticContext = (input: string): string => {
  for (const [context, pattern] of Object.entries(THERAPY_CONTEXTS)) {
    if (pattern.test(input)) return context;
  }
  return 'general';
};

/**
 * Generate Roger's response based on detected emotion
 */
const generateRogerResponse = (emotion: string, category: string, userInput: string): string => {
  const context = detectTherapeuticContext(userInput);
  
  // Context-specific responses
  const contextResponses = {
    relationship: `Feeling ${emotion} in a relationship is incredibly painful. Those connections matter so deeply to us.`,
    work: `Work situations that leave us feeling ${emotion} can really impact our sense of identity and security.`,
    family: `Family dynamics that create ${emotion} feelings touch something very core in us.`,
    health: `Health concerns that make us feel ${emotion} can be especially frightening and isolating.`,
    financial: `Financial stress that leads to feeling ${emotion} affects every aspect of our lives.`,
    social: `Feeling ${emotion} in social situations touches our deepest need for connection and belonging.`,
    identity: `Questions about who we are that leave us feeling ${emotion} go to the heart of our existence.`
  };

  if (contextResponses[context]) {
    return contextResponses[context];
  }

  // Category-specific responses
  const categoryResponses = {
    sad: `I can hear the depth of ${emotion} in what you're sharing. That's a profound emotion to carry.`,
    angry: `That ${emotion} feeling is telling us something important about what matters to you.`,
    fearful: `Feeling ${emotion} is such a vulnerable place to be. What's making this feel so overwhelming right now?`,
    disgusted: `Those ${emotion} feelings often point to something that violates our core values.`,
    surprised: `Being ${emotion} can really shift our whole perspective on things.`,
    happy: `I hear the ${emotion} in your voice. What's contributing to this positive feeling?`
  };

  return categoryResponses[category] || `I hear that you're feeling ${emotion}. That's a significant emotion.`;
};

/**
 * Infer emotion from context when no explicit emotion is found
 */
const inferEmotionFromContext = (input: string): EmotionResult => {
  const lowerInput = input.toLowerCase();

  // Relationship loss/conflict patterns
  if (/left me|broke up|divorce|cheating|affair/i.test(input)) {
    return {
      primaryEmotion: 'abandoned',
      intensity: 'high',
      category: 'sad',
      confidence: 0.8,
      therapeuticContext: 'relationship',
      rogerResponse: 'Being left by someone you love creates such deep feelings of abandonment. That pain is very real.'
    };
  }

  // Job loss patterns
  if (/fired|laid off|lost my job|unemployed/i.test(input)) {
    return {
      primaryEmotion: 'rejected',
      intensity: 'high',
      category: 'sad',
      confidence: 0.8,
      therapeuticContext: 'work',
      rogerResponse: 'Losing a job can feel like such a rejection of who we are. That impacts our sense of worth.'
    };
  }

  // Death/loss patterns
  if (/died|death|passed away|funeral|grave/i.test(input)) {
    return {
      primaryEmotion: 'grief',
      intensity: 'high',
      category: 'sad',
      confidence: 0.9,
      therapeuticContext: 'family',
      rogerResponse: 'Grief is one of the most profound emotions we experience. That loss touches everything.'
    };
  }

  // Default for therapy context - assume distress
  return {
    primaryEmotion: 'distressed',
    intensity: 'medium',
    category: 'sad',
    confidence: 0.6,
    therapeuticContext: 'general',
    rogerResponse: 'I can sense there\'s something weighing on you. What would be helpful to explore right now?'
  };
};

/**
 * Create default response for therapy context - NEVER neutral
 */
const createDefaultTherapyResponse = (): EmotionResult => {
  return {
    primaryEmotion: 'seeking support',
    intensity: 'medium',
    category: 'fearful',
    confidence: 0.7,
    therapeuticContext: 'general',
    rogerResponse: 'I\'m here with you. What would you like to share about what you\'re experiencing?'
  };
};
