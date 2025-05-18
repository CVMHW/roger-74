
// This is a new file to handle emotion misidentification

/**
 * Checks for emotion misidentification in generated responses
 * @param responseText The generated response text
 * @param userInput The original user input
 * @returns Boolean indicating if misidentification was detected
 */
export const checkEmotionMisidentification = (responseText: string, userInput: string): boolean => {
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
  
  // Critical depression check
  const mentionsDepression = /\b(depress(ed|ing|ion)?|feeling down|feeling low)\b/i.test(userInput.toLowerCase());
  const acknowledgesDepression = /\b(depress(ed|ing|ion)?|feeling down|difficult time)\b/i.test(responseText.toLowerCase());
  
  if (mentionsDepression && !acknowledgesDepression) {
    console.log("CRITICAL: Depression mentioned but not acknowledged");
    return true;
  }
  
  // Return true if any misidentification is detected
  return (
    (claimsNeutral && hasNegativeEmotions) || 
    (claimsNegative && hasPositiveEmotions && !hasNegativeEmotions) ||
    (statedEmotion && !acknowledgedStatedEmotion)
  );
};

/**
 * Fixes emotion misidentification in responses
 * @param responseText The generated response text
 * @param userInput The original user input
 * @returns Fixed response text
 */
export const fixEmotionMisidentification = (responseText: string, userInput: string): string => {
  // Fix response that claims neutral when user expressed negative emotions
  if (/you'?re feeling neutral|you seem neutral|neutral tone/i.test(responseText)) {
    // Check for depression specifically
    if (/\b(depress(ed|ing|ion)?|feeling down|feeling low)\b/i.test(userInput.toLowerCase())) {
      return responseText.replace(
        /you'?re feeling neutral|you seem neutral|neutral tone/i,
        "you're feeling depressed"
      );
    }
    
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
  
  // Special handling for depression mentions that aren't acknowledged
  if (/\b(depress(ed|ing|ion)?|feeling down|feeling low)\b/i.test(userInput.toLowerCase()) &&
      !/\b(depress(ed|ing|ion)?|feeling down|difficult time)\b/i.test(responseText.toLowerCase())) {
    
    // Find a place to insert the acknowledgment
    if (/^I hear|^I understand|^It sounds like/i.test(responseText)) {
      // Replace existing acknowledgment
      return responseText.replace(
        /^(I hear|I understand|It sounds like)([^.]*)\./i,
        `$1 that you're feeling depressed.`
      );
    } else {
      // Add acknowledgment at beginning
      return `I'm sorry to hear that you're feeling depressed. ${responseText}`;
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
