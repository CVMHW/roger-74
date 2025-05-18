// This is a new file to handle emotion misidentification

/**
 * Checks for emotion misidentification in generated responses
 * @param responseText The generated response text
 * @param userInput The original user input
 * @returns Boolean indicating if misidentification was detected
 */
export const checkEmotionMisidentification = (responseText: string, userInput: string): boolean => {
  // ENHANCED: Prioritize checking for depression and serious negative emotions first
  // Check for depression or serious negative emotions specifically - HIGH PRIORITY
  const hasDepressionIndicators = /\b(depress(ed|ing|ion)?|sad|down|low|hopeless|worthless|empty|numb|feeling (bad|low|terrible|awful|horrible))\b/i.test(userInput.toLowerCase());
  
  if (hasDepressionIndicators) {
    // If depression is mentioned, any claim of neutrality or positive emotion is a misidentification
    const claimsNeutralOrPositive = /you'?re feeling (neutral|fine|good|okay|alright|well)/i.test(responseText);
    if (claimsNeutralOrPositive) {
      console.log("CRITICAL MISIDENTIFICATION: Depression mentioned but response claims neutral/positive emotion");
      return true;
    }
    
    // Check if depression is explicitly acknowledged
    const acknowledgesDepression = /\b(depress(ed|ing|ion)?|feeling down|difficult time|hard time|challenging|struggle)\b/i.test(responseText.toLowerCase());
    if (!acknowledgesDepression) {
      console.log("CRITICAL: Depression mentioned but not acknowledged");
      return true;
    }
  }
  
  // Check if response claims neutral when user expressed negative emotions
  const claimsNeutral = /you'?re feeling neutral|you seem neutral|neutral tone/i.test(responseText);
  
  // Check if user actually expressed negative emotions
  const hasNegativeEmotions = /\b(depress(ed|ing|ion)?|sad|upset|down|hurt|angry|anxious|stressed|worried|hopeless|worthless|empty|numb|feeling (bad|low|terrible|awful|horrible))\b/i.test(userInput.toLowerCase());
  
  // Check if user expressed positive emotions but we said negative
  const claimsNegative = /you'?re feeling (sad|upset|down|depressed|anxious|worried)/i.test(responseText);
  const hasPositiveEmotions = /\b(happy|excited|great|good|wonderful|amazing|fantastic|joyful|pleased|delighted|thrilled)\b/i.test(userInput.toLowerCase());
  
  // Check for direct emotion statements
  const directEmotionStatements = [
    /\bI'?m feeling (\w+)/i,
    /\bI feel (\w+)/i,
    /feeling (\w+)/i,
    /\bI'?m (\w+)/i
  ];
  
  // Extract directly stated emotions
  let statedEmotion: string | null = null;
  for (const pattern of directEmotionStatements) {
    const match = userInput.match(pattern);
    if (match && match[1]) {
      statedEmotion = match[1].toLowerCase();
      break;
    }
  }
  
  // Check if we acknowledged the stated emotion
  const acknowledgedStatedEmotion = statedEmotion ? 
    new RegExp(`feeling ${statedEmotion}|you'?re ${statedEmotion}|you feel ${statedEmotion}`, 'i').test(responseText) : 
    false;
  
  // NEW: Check for time-limited emotional statements that should still be acknowledged
  const temporalEmotionalStatements = /\b(terrible|awful|horrible|rough|bad|tough) (day|night|week|morning|evening)/i.test(userInput);
  const acknowledgedTemporalEmotion = temporalEmotionalStatements ? 
    /difficult|challenging|hard|tough|sorry to hear|sounds (difficult|challenging|hard|tough)/i.test(responseText) : 
    true; // Default to true if no temporal statement
  
  // Return true if any misidentification is detected
  return (
    (claimsNeutral && hasNegativeEmotions) || 
    (claimsNegative && hasPositiveEmotions && !hasNegativeEmotions) ||
    (statedEmotion && !acknowledgedStatedEmotion) ||
    (temporalEmotionalStatements && !acknowledgedTemporalEmotion)
  );
};

/**
 * Fixes emotion misidentification in responses
 * @param responseText The generated response text
 * @param userInput The original user input
 * @returns Fixed response text
 */
export const fixEmotionMisidentification = (responseText: string, userInput: string): string => {
  // ENHANCED: Prioritize fixing depression misidentification first
  const hasDepressionIndicators = /\b(depress(ed|ing|ion)?|sad|down|low|hopeless|worthless|empty|numb|feeling (bad|low|terrible|awful|horrible))\b/i.test(userInput.toLowerCase());
  
  if (hasDepressionIndicators) {
    // If claims neutral or positive when depression is mentioned
    if (/you'?re feeling (neutral|fine|good|okay|alright|well)/i.test(responseText)) {
      console.log("FIXING CRITICAL MISIDENTIFICATION: Depression mentioned but response claims neutral/positive");
      
      // Replace with acknowledgment of depression
      responseText = responseText.replace(
        /you'?re feeling (neutral|fine|good|okay|alright|well)/i,
        "you're feeling depressed"
      );
    }
    
    // If depression isn't acknowledged anywhere, add an acknowledgment
    if (!/\b(depress(ed|ing|ion)?|feeling down|difficult time|hard time|challenging|struggle)\b/i.test(responseText.toLowerCase())) {
      // If the response starts with a greeting or acknowledgment, add after it
      if (/^(I hear|I understand|It sounds like|Thank you for sharing)/i.test(responseText)) {
        responseText = responseText.replace(
          /^(I hear|I understand|It sounds like|Thank you for sharing)([^.]*)\./i,
          `$1 that you're feeling depressed.`
        );
      } else {
        // Otherwise add at the beginning
        responseText = `I'm sorry to hear that you're feeling depressed. ${responseText}`;
      }
    }
    
    return responseText;
  }
  
  // Fix response that claims neutral when user expressed negative emotions
  if (/you'?re feeling neutral|you seem neutral|neutral tone/i.test(responseText)) {
    // Check for sadness
    if (/\b(sad|upset|hurt|down)\b/i.test(userInput.toLowerCase())) {
      return responseText.replace(
        /you'?re feeling neutral|you seem neutral|neutral tone/i,
        "you're feeling sad"
      );
    }
    
    // Check for anxiety
    if (/\b(anxious|worried|nervous|stressed|anxiety|scared|afraid)\b/i.test(userInput.toLowerCase())) {
      return responseText.replace(
        /you'?re feeling neutral|you seem neutral|neutral tone/i,
        "you're feeling anxious"
      );
    }
    
    // Generic negative emotion fallback
    if (/\b(bad|terrible|awful|horrible|not (good|great|okay|well|fine))\b/i.test(userInput.toLowerCase())) {
      return responseText.replace(
        /you'?re feeling neutral|you seem neutral|neutral tone/i,
        "you're not feeling well"
      );
    }
  }
  
  // Fix claims of negative emotion when user expressed positive emotions
  if (/you'?re feeling (sad|upset|down|depressed|anxious|worried)/i.test(responseText) && 
      /\b(happy|excited|great|good|wonderful|amazing|fantastic|joyful)\b/i.test(userInput.toLowerCase()) &&
      !/\b(sad|upset|down|depressed|anxious|worried|bad|negative)\b/i.test(userInput.toLowerCase())) {
    
    return responseText.replace(
      /you'?re feeling (sad|upset|down|depressed|anxious|worried)/i,
      "you're feeling positive"
    );
  }
  
  // Extract directly stated emotions
  let statedEmotion: string | null = null;
  const directEmotionStatements = [
    /\bI'?m feeling (\w+)/i,
    /\bI feel (\w+)/i,
    /feeling (\w+)/i,
    /\bI'?m (\w+)/i
  ];
  
  for (const pattern of directEmotionStatements) {
    const match = userInput.match(pattern);
    if (match && match[1]) {
      statedEmotion = match[1].toLowerCase();
      if (!/neutral|okay|fine|alright|so-so/i.test(statedEmotion)) {
        break;
      }
    }
  }
  
  // If we have a stated emotion that isn't acknowledged, fix it
  if (statedEmotion) {
    // Check if emotion is already acknowledged correctly
    if (!new RegExp(`feeling ${statedEmotion}|you'?re ${statedEmotion}|you feel ${statedEmotion}`, 'i').test(responseText)) {
      // Find a place to insert the acknowledgment
      if (/^I hear|^I understand|^It sounds like/i.test(responseText)) {
        // Replace existing acknowledgment
        return responseText.replace(
          /^(I hear|I understand|It sounds like)([^.]*)\./i,
          `$1 that you're feeling ${statedEmotion}.`
        );
      } else {
        // Add acknowledgment at beginning
        return `I hear that you're feeling ${statedEmotion}. ${responseText}`;
      }
    }
  }
  
  // NEW: Handle time-limited emotional statements that should still be acknowledged
  const temporalEmotionalMatch = userInput.match(/\b(terrible|awful|horrible|rough|bad|tough) (day|night|week|morning|evening)/i);
  if (temporalEmotionalMatch && 
      !/difficult|challenging|hard|tough|sorry to hear|sounds (difficult|challenging|hard|tough)/i.test(responseText)) {
    
    const emotionType = temporalEmotionalMatch[1].toLowerCase();
    const timeFrame = temporalEmotionalMatch[2].toLowerCase();
    
    // Find a place to insert the acknowledgment
    if (/^I hear|^I understand|^It sounds like/i.test(responseText)) {
      // Replace existing acknowledgment
      return responseText.replace(
        /^(I hear|I understand|It sounds like)([^.]*)\./i,
        `$1 you're having a ${emotionType} ${timeFrame}.`
      );
    } else {
      // Add acknowledgment at beginning
      return `I'm sorry to hear you're having a ${emotionType} ${timeFrame}. ${responseText}`;
    }
  }
  
  // Return original if no fixes were needed
  return responseText;
};

/**
 * Adds a human touch to responses in specific social contexts
 * @param responseText The original response text
 * @param userInput The user's input
 * @returns Enhanced response with human touch
 */
export const addHumanTouch = (responseText: string, userInput: string): string => {
  // Check for social embarrassment specifically
  const isEmbarrassment = /\b(embarrass(ed|ing)|awkward|humiliat(ed|ing))\b/i.test(userInput.toLowerCase());
  
  if (isEmbarrassment) {
    // If response doesn't already acknowledge embarrassment
    if (!/embarrass|awkward|humiliat/i.test(responseText.toLowerCase())) {
      // Add empathetic acknowledgment for embarrassment
      return `I understand that feeling embarrassed can be really difficult. ${responseText}`;
    }
  }
  
  // Add more social context handling as needed
  
  return responseText;
};

/**
 * Performs a final verification on responses to ensure emotional consistency
 * This is called at the very end of the response pipeline
 * 
 * @param responseText The final response text
 * @param userInput The original user input
 * @param emotionContext Optional emotion context from earlier processing
 * @returns Verified response text, with any final fixes applied
 */
export const performFinalEmotionVerification = (
  responseText: string, 
  userInput: string,
  emotionContext?: {
    hasDetectedEmotion?: boolean;
    primaryEmotion?: string | null;
    isDepressionMentioned?: boolean;
  }
): string => {
  // CRITICAL: Check for depression acknowledgment as highest priority
  const hasDepressionIndicators = emotionContext?.isDepressionMentioned || 
    /\b(depress(ed|ing|ion)?|sad|down|low|hopeless|worthless|empty|numb|feeling (bad|low|terrible|awful|horrible))\b/i.test(userInput.toLowerCase());
  
  if (hasDepressionIndicators) {
    // If depression isn't acknowledged anywhere in the final response, add an acknowledgment
    if (!/\b(depress(ed|ing|ion)?|feeling down|difficult time|hard time|challenging|struggle)\b/i.test(responseText.toLowerCase())) {
      console.log("FINAL VERIFICATION: Adding missing depression acknowledgment");
      return `I hear that you're feeling depressed. ${responseText}`;
    }
  }
  
  // Check for any remaining emotion misidentifications
  if (checkEmotionMisidentification(responseText, userInput)) {
    console.log("FINAL VERIFICATION: Fixing emotion misidentification");
    return fixEmotionMisidentification(responseText, userInput);
  }
  
  // Return the original response if no issues found
  return responseText;
};

/**
 * Creates an emotion context object for integration with other systems
 * 
 * @param userInput The user's input message
 * @returns Emotion context object for use in memory and RAG systems
 */
export const createEmotionContext = (userInput: string): any => {
  // Check for depression specifically
  const isDepressionMentioned = /\b(depress(ed|ing|ion)?|sad|down|low|hopeless|worthless|empty|numb|feeling (bad|low|terrible|awful|horrible))\b/i.test(userInput.toLowerCase());
  
  // Check for direct emotion statements
  const directEmotionStatements = [
    /\bI'?m feeling (\w+)/i,
    /\bI feel (\w+)/i,
    /feeling (\w+)/i,
    /\bI'?m (\w+)/i
  ];
  
  // Extract directly stated emotions
  let statedEmotion: string | null = null;
  for (const pattern of directEmotionStatements) {
    const match = userInput.match(pattern);
    if (match && match[1]) {
      statedEmotion = match[1].toLowerCase();
      break;
    }
  }
  
  // Create context object
  return {
    hasDetectedEmotion: isDepressionMentioned || !!statedEmotion,
    primaryEmotion: isDepressionMentioned ? 'depressed' : statedEmotion,
    isDepressionMentioned,
    emotionalIntensity: isDepressionMentioned ? 'high' : 'medium',
    timestamp: new Date().toISOString(),
    requiredAcknowledgment: isDepressionMentioned || !!statedEmotion
  };
};
