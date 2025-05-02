
/**
 * Emotional Attunement Rules
 * 
 * Rules governing Roger's ability to attune to emotional content
 * and respond with appropriate emotional immediacy
 */

/**
 * Detects emotional content in user input
 * @param input User message
 * @returns Information about detected emotions
 */
export const detectEmotionalContent = (input: string): {
  hasEmotion: boolean;
  primaryEmotion: string | null;
  intensity: 'low' | 'medium' | 'high' | null;
  isImplicit: boolean;
} => {
  // Check for explicit emotion words
  const emotionPatterns = {
    sadness: {
      high: /(devastated|heartbroken|despair|miserable|hopeless)/i,
      medium: /(sad|down|depressed|blue|unhappy|upset)/i,
      low: /(disappointed|bummed|bit sad|little down)/i
    },
    anxiety: {
      high: /(terrified|panicking|freaking out|can't breathe|panic)/i,
      medium: /(anxious|nervous|worried|stressed|afraid|on edge)/i,
      low: /(concerned|uneasy|unsettled|little nervous|slight worry)/i
    },
    anger: {
      high: /(furious|enraged|livid|seething|outraged)/i,
      medium: /(angry|mad|frustrated|irritated|annoyed)/i,
      low: /(bothered|irked|peeved|bugged|rubbed wrong)/i
    },
    joy: {
      high: /(thrilled|elated|overjoyed|ecstatic|over the moon)/i,
      medium: /(happy|glad|pleased|delighted|content)/i,
      low: /(content|satisfied|okay|fine|alright)/i
    },
    shame: {
      high: /(mortified|humiliated|ashamed|disgraced)/i,
      medium: /(embarrassed|guilty|regretful|foolish)/i,
      low: /(awkward|silly|sheepish|bit embarrassed)/i
    }
  };
  
  // Check for explicit emotions first
  for (const [emotion, intensities] of Object.entries(emotionPatterns)) {
    for (const [level, pattern] of Object.entries(intensities)) {
      if (pattern.test(input)) {
        return {
          hasEmotion: true,
          primaryEmotion: emotion,
          intensity: level as 'low' | 'medium' | 'high',
          isImplicit: false
        };
      }
    }
  }
  
  // Check for implicit emotional content through situations
  const implicitEmotionPatterns = [
    { situation: /(lost|died|passed away|death|funeral)/i, emotion: 'sadness', intensity: 'medium' as const },
    { situation: /(broke up|divorce|separated|left me|ending relationship)/i, emotion: 'sadness', intensity: 'medium' as const },
    { situation: /(fired|laid off|unemployed|lost job|can't find work)/i, emotion: 'sadness', intensity: 'medium' as const },
    { situation: /(test|exam|interview|presentation|deadline|meeting)/i, emotion: 'anxiety', intensity: 'medium' as const },
    { situation: /(fight|argument|disagreement|conflict|confrontation)/i, emotion: 'anger', intensity: 'medium' as const },
    { situation: /(promotion|succeeded|accomplished|achieved|won|graduated)/i, emotion: 'joy', intensity: 'medium' as const },
    { situation: /(mistake|error|forgot|failed to|didn't mean to|accident)/i, emotion: 'shame', intensity: 'low' as const }
  ];
  
  for (const pattern of implicitEmotionPatterns) {
    if (pattern.situation.test(input)) {
      return {
        hasEmotion: true,
        primaryEmotion: pattern.emotion,
        intensity: pattern.intensity,
        isImplicit: true
      };
    }
  }
  
  return {
    hasEmotion: false,
    primaryEmotion: null,
    intensity: null,
    isImplicit: false
  };
};

/**
 * Generates emotionally attuned response based on detected emotion
 * @param emotionInfo Detected emotion information
 * @returns Emotionally attuned response
 */
export const generateEmotionallyAttunedResponse = (
  emotionInfo: ReturnType<typeof detectEmotionalContent>,
  userInput: string
): string => {
  if (!emotionInfo.hasEmotion) {
    return "";
  }
  
  const { primaryEmotion, intensity, isImplicit } = emotionInfo;
  
  // Template for responses
  const responseTemplates = {
    sadness: {
      high: "I hear how deeply upset you are. That sounds really painful. Would you like to tell me more about what's happened?",
      medium: "I can tell you're feeling sad about this. That's completely understandable. What's been the hardest part for you?",
      low: "It sounds like you're feeling a bit down about that. These things can definitely affect our mood. Would you like to talk more about it?"
    },
    anxiety: {
      high: "I can hear how intense your worry is right now. That must be really overwhelming. What's feeling most pressing in this moment?",
      medium: "I notice you're feeling anxious about this situation. That makes a lot of sense. What's your biggest concern right now?",
      low: "Sounds like there's a bit of worry there. It's natural to feel concerned about these things. What are you thinking might happen?"
    },
    anger: {
      high: "I can tell you're really upset about this. That level of frustration is completely understandable given what you're describing. What's been most infuriating about the situation?",
      medium: "I hear your frustration coming through. That would be irritating for most people. What aspect of this has been most bothersome?",
      low: "It seems like this has been a bit annoying for you. Little things can definitely add up. What part of it has been bothering you most?"
    },
    joy: {
      high: "That's wonderful news! I can tell you're really thrilled about this. What's been the best part of this experience?",
      medium: "I'm happy to hear that! Sounds like things are going well. What about this has made you feel good?",
      low: "That's nice to hear. It's good when things work out. What's made this a positive experience for you?"
    },
    shame: {
      high: "What you're describing sounds really difficult to talk about. Many people would feel the same way in that situation. Would it help to share more about what happened?",
      medium: "I can understand feeling embarrassed about something like that. We all have moments we wish had gone differently. How have you been processing this?",
      low: "Those awkward moments happen to everyone. It's completely normal to feel a bit self-conscious. Has this been on your mind a lot?"
    }
  };
  
  // Get the appropriate template
  const emotionTemplates = responseTemplates[primaryEmotion as keyof typeof responseTemplates];
  let response = emotionTemplates[intensity as keyof typeof emotionTemplates];
  
  // For implicit emotions, modify the response slightly
  if (isImplicit) {
    response = response.replace("I can tell you're feeling", "It sounds like you might be feeling");
    response = response.replace("I notice you're feeling", "You might be feeling");
    response = response.replace("I hear how", "It sounds like");
  }
  
  return response;
};

/**
 * Detects everyday situations that require practical support response
 * @param input User message
 * @returns Information about everyday situation
 */
export const detectEverydaySituation = (input: string): {
  isEverydaySituation: boolean;
  situationType: string | null;
  practicalSupportNeeded: boolean;
} => {
  const everydaySituations = [
    { type: "spill_or_stain", pattern: /(spill|stain|mess|dirt|clean)/i, needsSupport: true },
    { type: "traffic_commute", pattern: /(traffic|commute|drive|late|stuck)/i, needsSupport: false },
    { type: "weather_issue", pattern: /(rain|snow|storm|weather|forecast|cold|hot)/i, needsSupport: true },
    { type: "minor_injury", pattern: /(cut|bruise|scratch|bump|hurt)/i, needsSupport: true },
    { type: "lost_item", pattern: /(lost|misplaced|can't find|where is|looking for)/i, needsSupport: true },
    { type: "minor_conflict", pattern: /(argument|disagreement|fight|mad at|angry with)/i, needsSupport: true },
    { type: "schedule_issue", pattern: /(schedule|appointment|meeting|calendar|forgot)/i, needsSupport: false },
    { type: "tired_sleep", pattern: /(tired|exhausted|sleep|nap|rest|fatigue)/i, needsSupport: true }
  ];
  
  for (const situation of everydaySituations) {
    if (situation.pattern.test(input)) {
      return {
        isEverydaySituation: true,
        situationType: situation.type,
        practicalSupportNeeded: situation.needsSupport
      };
    }
  }
  
  return {
    isEverydaySituation: false,
    situationType: null,
    practicalSupportNeeded: false
  };
};

/**
 * Generates practical everyday support responses
 * @param situationInfo Information about the everyday situation
 * @returns Practical support response
 */
export const generatePracticalSupportResponse = (
  situationInfo: ReturnType<typeof detectEverydaySituation>
): string => {
  if (!situationInfo.isEverydaySituation || !situationInfo.practicalSupportNeeded) {
    return "";
  }
  
  const practicalResponses = {
    spill_or_stain: "Oh no, that stinks! For fresh stains, club soda can really work wonders. For coffee or tea stains, a bit of vinegar and water might help. Did it get on anything important?",
    weather_issue: "The weather in Cleveland can be so unpredictable! Did you get caught without the right gear for today's conditions?",
    minor_injury: "Those small injuries can be surprisingly painful and annoying. Do you have what you need to take care of it?",
    lost_item: "Losing things is so frustrating. Sometimes retracing your steps mentally can help. Where do you remember having it last?",
    minor_conflict: "Those kinds of conflicts can really put a damper on your day. What do you think led to the disagreement?",
    tired_sleep: "Being tired makes everything else harder to deal with. Have you been having trouble sleeping lately or is it just been an extra busy time?"
  };
  
  return practicalResponses[situationInfo.situationType as keyof typeof practicalResponses] || 
    "That kind of everyday challenge can be really frustrating. How has it been affecting your day?";
};
