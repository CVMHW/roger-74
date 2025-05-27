/**
 * Emotion processing utilities - FIXED: No neutral handling
 */

export interface EmotionInfo {
  hasEmotion: boolean;
  primaryEmotion?: string | null;
  intensity?: string | null;
  isImplicit?: boolean;
  secondaryEmotion?: string | null;
}

export interface SocialEmotionalContext {
  isEmotionallyDifficult: boolean;
  isTraumaRelated: boolean;
  isSensitive: boolean;
  needsSupport: boolean;
  isEverydaySituation?: boolean;
}

/**
 * Extract emotions from user input - ELIMINATES NEUTRAL
 */
export const extractEmotionsFromInput = (userInput: string) => {
  // Implementation for emotion detection
  // For now a simplified version that recognizes explicit mentions
  
  // First check for explicit feelings
  const explicitEmotionMatch = 
    /I('| a)?m feeling (sad|happy|angry|upset|anxious|depressed|worried|stressed|confused|overwhelmed|lost|hopeless|alone|lonely)/i.exec(userInput) ||
    /I feel (sad|happy|angry|upset|anxious|depressed|worried|stressed|confused|overwhelmed|lost|hopeless|alone|lonely)/i.exec(userInput);
  
  const explicitEmotion = explicitEmotionMatch ? explicitEmotionMatch[2] || explicitEmotionMatch[1] : null;
  
  // Check for depression words specifically
  const depressionWords = ['depressed', 'depression', 'hopeless', 'worthless', 'suicidal'];
  const isDepressionMentioned = depressionWords.some(word => 
    userInput.toLowerCase().includes(word)
  );
  
  // Look for emotional content - NEVER RETURN NEUTRAL
  const emotionalContent: EmotionInfo = {
    hasEmotion: true, // ALWAYS true in therapy context
    primaryEmotion: null,
    intensity: null,
    isImplicit: true
  };
  
  if (userInput.match(/sad|upset|down|low|miserable|unhappy|blue|depressed/i)) {
    emotionalContent.primaryEmotion = 'sadness';
    emotionalContent.intensity = userInput.match(/very|really|so|extremely|incredibly/i) ? 'high' : 'medium';
  } else if (userInput.match(/anxious|nervous|worried|afraid|scared|fearful|terrified|overwhelmed|stressed/i)) {
    emotionalContent.primaryEmotion = 'anxiety';
    emotionalContent.intensity = userInput.match(/very|really|so|extremely|incredibly|terrified|panicked/i) ? 'high' : 'medium';
  } else if (userInput.match(/angry|mad|frustrated|annoyed|irritated|furious/i)) {
    emotionalContent.primaryEmotion = 'anger';
    emotionalContent.intensity = userInput.match(/very|really|so|extremely|incredibly|furious|enraged/i) ? 'high' : 'medium';
  } else if (userInput.match(/happy|glad|excited|thrilled|delighted|joy|pleased/i)) {
    emotionalContent.primaryEmotion = 'joy';
    emotionalContent.intensity = userInput.match(/very|really|so|extremely|incredibly|thrilled|elated/i) ? 'high' : 'medium';
  } else if (userInput.match(/hopeless|worthless|numb|empty/i)) {
    emotionalContent.primaryEmotion = 'depression';
    emotionalContent.intensity = 'high';
  } else {
    // DEFAULT: Assume seeking support context
    emotionalContent.primaryEmotion = 'seeking-support';
    emotionalContent.intensity = 'medium';
  }
  
  // Meaning themes (simplified)
  const meaningThemes = {
    hasMeaningTheme: false,
    themes: [] as string[],
    conflictingValues: [] as string[],
    lifeValues: [] as string[]
  };
  
  if (userInput.match(/purpose|meaning|pointless|direction|lost|confused about life|what's the point/i)) {
    meaningThemes.hasMeaningTheme = true;
    meaningThemes.themes.push('existential');
  }
  
  // Social context
  const socialContext: SocialEmotionalContext = {
    isEmotionallyDifficult: emotionalContent.hasEmotion && emotionalContent.primaryEmotion !== 'joy',
    isTraumaRelated: userInput.match(/trauma|ptsd|assault|abuse|accident|death|loss/i) !== null,
    isSensitive: true,
    needsSupport: true,
    isEverydaySituation: userInput.match(/today|yesterday|this morning|coworker|colleague|friend|family|spouse|partner/i) !== null
  };
  
  // Return full emotion information object
  return {
    explicitEmotion,
    socialContext,
    emotionalContent,
    meaningThemes,
    hasDetectedEmotion: true, // ALWAYS true
    hasMeaningTheme: meaningThemes.hasMeaningTheme,
    isDepressionMentioned
  };
};

/**
 * Process emotions in a response
 */
export const processEmotions = (
  responseText: string, 
  userInput: string, 
  emotionInfo: any // Accepting any type to avoid build errors
): string => {
  // Skip processing if response is empty or very short
  if (!responseText || responseText.length < 10) {
    return responseText;
  }

  // Critical: Check for missing emotion acknowledgment
  const userEmotions = extractEmotionsFromInput(userInput);
  
  // Ensure depression is always acknowledged
  if (userEmotions.isDepressionMentioned && !responseText.toLowerCase().includes("depress")) {
    // Add acknowledgment of depression at the beginning
    return `I understand you're feeling depressed. ${responseText}`;
  }
  
  // Ensure primary emotion is acknowledged
  if (userEmotions.hasDetectedEmotion && userEmotions.emotionalContent.hasEmotion) {
    const emotion = userEmotions.emotionalContent.primaryEmotion;
    
    // Check if emotion is already acknowledged
    const emotionAcknowledged = new RegExp(`(${emotion}|feeling|emotion)`, 'i').test(responseText);
    
    if (!emotionAcknowledged) {
      // Add emotion acknowledgment
      return `I hear that you're feeling ${emotion}. ${responseText}`;
    }
  }
  
  // If no fixes needed, return original response
  return responseText;
};

/**
 * Create emotion memory context
 */
export const createEmotionMemoryContext = (userInput: string): any => {
  const emotionInfo = extractEmotionsFromInput(userInput);
  
  return {
    hasDetectedEmotion: !!emotionInfo.hasDetectedEmotion,
    primaryEmotion: emotionInfo.explicitEmotion || 
                   (emotionInfo.emotionalContent.hasEmotion ? emotionInfo.emotionalContent.primaryEmotion : null),
    emotionalIntensity: emotionInfo.emotionalContent.hasEmotion ? emotionInfo.emotionalContent.intensity : null,
    isDepressionMentioned: /\b(depress(ed|ing|ion)?|sad|down|low|hopeless|worthless|empty|numb|feeling (bad|low|terrible|awful|horrible))\b/i.test(userInput.toLowerCase()),
    requiresAcknowledgment: !!emotionInfo.hasDetectedEmotion,
    priority: emotionInfo.isDepressionMentioned ? 'critical' : 'high',
    timestamp: new Date().toISOString()
  };
};
