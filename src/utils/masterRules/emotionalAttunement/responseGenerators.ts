
/**
 * Generators for emotionally attuned responses
 */

import { EmotionInfo, EverydaySituationInfo } from './types';
import { detectMeaningThemes } from './detectors';

/**
 * Generates emotionally attuned response based on detected emotion
 * @param emotionInfo Detected emotion information
 * @param userInput Original user input
 * @returns Emotionally attuned response
 */
export const generateEmotionallyAttunedResponse = (
  emotionInfo: EmotionInfo,
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
  let response = emotionTemplates ? emotionTemplates[intensity as keyof typeof emotionTemplates] : "";
  
  // If no template found, provide a generic response
  if (!response) {
    response = "I hear that you're having some strong feelings about this. Would you like to share more about what's happening?";
  }
  
  // For implicit emotions, modify the response slightly
  if (isImplicit) {
    response = response.replace("I can tell you're feeling", "It sounds like you might be feeling");
    response = response.replace("I notice you're feeling", "You might be feeling");
    response = response.replace("I hear how", "It sounds like");
  }
  
  return response;
};

/**
 * Generates meaning-focused response based on user input content
 * This creates reflections of meaning rather than just reflecting feelings
 * @param userInput User's original message
 * @returns Meaning-focused reflection response
 */
export const generateMeaningFocusedResponse = (userInput: string): string => {
  const meaningThemes = detectMeaningThemes(userInput);
  
  if (!meaningThemes.hasMeaningTheme) {
    return "";
  }
  
  // Special handling for brief statements with temporal references
  if (/(terrible|awful|horrible|rough|bad|tough) (day|night|week|morning|evening)/i.test(userInput.toLowerCase())) {
    const timeFrame = userInput.match(/(day|night|week|morning|evening)/i)?.[0].toLowerCase();
    
    // Create responses that reflect meaning rather than just feelings
    const briefTimeResponses = [
      `These difficult moments often reveal what matters most to us. I wonder what about this ${timeFrame} has been particularly significant for you?`,
      `When we go through challenging ${timeFrame}s like this, it can make us reflect on what's truly important. What aspects of this experience stand out to you?`,
      `Difficult ${timeFrame}s can sometimes highlight the contrast between what we're experiencing and what we value or hope for. What's been weighing on your mind about this?`,
      `Challenging experiences often bring our priorities into focus. What about this ${timeFrame} feels most significant for you right now?`
    ];
    
    return briefTimeResponses[Math.floor(Math.random() * briefTimeResponses.length)];
  }
  
  // Choose appropriate reflection of meaning based on detected themes
  if (meaningThemes.conflictingValues && meaningThemes.conflictingValues.length > 0) {
    const conflictValue = meaningThemes.conflictingValues[0];
    
    if (conflictValue === "work-life balance") {
      return "It sounds like you're trying to balance what matters to you both professionally and personally. Finding that balance between work demands and personal needs can be challenging.";
    }
    
    if (conflictValue === "personal desires vs. responsibilities") {
      return "I'm hearing that you're struggling with what you want to do versus what you feel you should do. That tension between personal desires and responsibilities can be difficult to navigate.";
    }
    
    return "It seems like you're dealing with some competing priorities in your life right now. That kind of internal conflict can be really challenging.";
  }
  
  if (meaningThemes.themes.includes("seeking purpose")) {
    return "It sounds like you're searching for more meaning and purpose in what you're doing. Having a sense that your actions matter seems important to you.";
  }
  
  if (meaningThemes.themes.includes("questioning identity")) {
    return "I hear you questioning your role and place in all of this. Understanding who you are in relation to these challenges seems to be a significant concern.";
  }
  
  if (meaningThemes.themes.includes("aligning with values")) {
    return "It sounds like this situation is bringing up questions about what you truly value and believe in. These moments often reveal what matters most to us.";
  }
  
  if (meaningThemes.themes.includes("seeking connection")) {
    return "I hear that meaningful connection with others is important to you. These experiences seem to highlight your need for authentic relationships.";
  }
  
  if (meaningThemes.themes.includes("seeking autonomy")) {
    return "It seems like having a sense of control and choice in your situation matters a lot to you. Being able to direct your own path appears to be a significant value.";
  }
  
  if (meaningThemes.themes.includes("facing challenges") || 
      meaningThemes.themes.includes("reflecting on challenges")) {
    return "I'm hearing that you're facing some significant challenges right now. These difficult moments often reveal what truly matters to us and what we're capable of. What aspects feel most important to you?";
  }
  
  if (meaningThemes.themes.includes("processing difficult experiences")) {
    return "When we go through difficult times, it often reveals something about what matters to us or what we're struggling with on a deeper level. What's been most significant about this experience for you?";
  }
  
  // Default meaning response for other themes
  const theme = meaningThemes.themes[0];
  return `It seems like this situation is bringing up some important questions about ${theme} in your life. What aspects of this feel most significant to you?`;
};

/**
 * Generates practical everyday support responses
 * @param situationInfo Information about the everyday situation
 * @returns Practical support response
 */
export const generatePracticalSupportResponse = (
  situationInfo: EverydaySituationInfo
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

/**
 * Determines whether to use reflection of feeling or meaning
 * @param userInput User's message
 * @param emotionInfo Detected emotion information
 * @returns The appropriate type of reflection
 */
export const determineReflectionType = (userInput: string, emotionInfo: EmotionInfo): 'feeling' | 'meaning' => {
  // Check for specific indicators that meaning reflection would be better
  const meaningIndicators = [
    /why (am|is|are|does)/i, // Questions about reasons
    /purpose|meaning|point|reason|understand|make sense/i, // Explicit meaning-making language
    /value|important|matters|significance/i, // Value language
    /struggle|conflict|dilemma|torn|between|choice/i, // Internal conflict language
    /always|never|every time|pattern|keep|constantly|repeatedly/i, // Pattern language
    /should|must|have to|supposed to|expected/i, // Obligation language
    /life|existential|bigger picture/i // Existential language
  ];
  
  // Check if content is simple vs complex
  // Simple: Today was tough.
  // Complex: I'm struggling with balancing my work and family commitments.
  const isComplexContent = userInput.length > 20;
  
  // Check if message contains meaning indicators
  const hasMeaningIndicators = meaningIndicators.some(pattern => pattern.test(userInput));
  
  // Check for deeper meaning themes
  const meaningThemes = detectMeaningThemes(userInput);
  
  // NEW: Special handling for brief emotional statements - PRIORITIZE MEANING for these
  const isBriefEmotionalStatement = userInput.split(/\s+/).length <= 5 && 
    /(terrible|awful|horrible|rough|bad|tough|difficult) (day|night|week|morning|evening|time)/i.test(userInput);
  
  // Use reflection of meaning when:
  // 1. Content is complex AND has meaning indicators, OR
  // 2. Has clear meaning themes detected, OR
  // 3. Is a brief emotional statement about a time period (new rule)
  if ((isComplexContent && hasMeaningIndicators) || meaningThemes.hasMeaningTheme || isBriefEmotionalStatement) {
    return 'meaning';
  }
  
  // Default to reflection of feeling for shorter messages or when emotion is primary focus
  return 'feeling';
};

/**
 * Generate an appropriate response based on reflection type determination
 * @param userInput User's message
 * @param emotionInfo Detected emotion information
 * @returns The most appropriate response
 */
export const generateAppropriateReflection = (userInput: string, emotionInfo: EmotionInfo): string => {
  const reflectionType = determineReflectionType(userInput, emotionInfo);
  
  if (reflectionType === 'meaning') {
    return generateMeaningFocusedResponse(userInput);
  } else {
    return generateEmotionallyAttunedResponse(emotionInfo, userInput);
  }
};
