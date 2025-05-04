
/**
 * Emotion Misidentification Handler
 * 
 * Specialized handler for detecting and correcting emotion misidentification in responses
 * This is specifically for Rogerian/emotional responses, not logotherapy
 */

/**
 * Check for emotion misidentification in responses
 * Especially checks for "neutral" identification when negative emotions are present
 */
export const checkEmotionMisidentification = (
  response: string,
  userInput: string
): boolean => {
  // Check if response claims user is feeling neutral
  const claimsNeutral = /you('re| are) feeling neutral/i.test(response);
  
  if (!claimsNeutral) {
    return false;
  }
  
  // Check for negative emotion indicators in user input
  const negativeEmotionPatterns = [
    /rough|tough|bad|difficult|hard|stressful|awful|terrible|worst|annoying/i,
    /embarrass(ing|ed)?|awkward|uncomfortable|cringe/i,
    /spill(ed)?|accident|mess(ed up)?|mistake/i,
    /sad|upset|depress(ed|ing)|down|blue|low|lonely/i,
    /anxious|nervous|worr(ied|y)|stress(ed|ful)/i,
    /frustrat(ed|ing)|annoy(ed|ing)|angry|mad|piss(ed)?|irritat(ed|ing)/i
  ];
  
  // If input mentions any negative emotions but response claims neutral, it's a misidentification
  return negativeEmotionPatterns.some(pattern => pattern.test(userInput));
};

/**
 * Fix emotion misidentification in responses
 */
export const fixEmotionMisidentification = (
  response: string,
  userInput: string
): string => {
  // For social situations and embarrassment
  if (/spill(ed)?|embarrass(ing|ed)?|awkward|mess(ed)?( up)?|accident/i.test(userInput)) {
    return response
      .replace(/you('re| are) feeling neutral/i, "that sounds embarrassing")
      .replace(/Would you like to tell me more about what happened\?/i, "Those kinds of moments can feel really uncomfortable. How are you feeling about it now?");
  }
  
  // For rough/tough day mentions
  if (/rough|tough|hard|difficult|bad day/i.test(userInput)) {
    return response
      .replace(/you('re| are) feeling neutral/i, "you've had a rough day")
      .replace(/Would you like to tell me more about what happened\?/i, "Those kinds of days can be draining. What was the most challenging part of your day?");
  }
  
  // For other negative emotions
  return response
    .replace(/you('re| are) feeling neutral/i, "that sounds challenging")
    .replace(/Would you like to tell me more about what happened\?/i, "Can you tell me more about how that made you feel?");
};
