
/**
 * Topic detection and classification utilities
 */

/**
 * Enforces small talk attention for minor concerns
 * @param userInput The user's message
 * @returns Whether the input contains minor daily concerns that should be prioritized
 */
export const shouldPrioritizeSmallTalk = (userInput: string): boolean => {
  // Check for everyday concerns
  const everydayConcerns = [
    /traffic|commute|drive|driving|road|car/i,
    /weather|rain|snow|cold|hot|sunny|storm/i,
    /schedule|appointment|meeting|busy|late|waiting/i,
    /coffee|lunch|dinner|breakfast|meal|food|eat/i,
    /tired|sleep|rest|exhausted|nap/i,
    /clothes|shirt|pants|shoes|outfit|wear/i,
    /mess|clean|tidy|chore|housework/i,
    /kids|children|parenting|family|siblings/i
  ];
  
  return everydayConcerns.some(pattern => pattern.test(userInput));
};

/**
 * Detects if input relates to subclinical mental health concerns
 * (normal emotions that shouldn't be medicalized)
 */
export const isSubclinicalConcern = (userInput: string): boolean => {
  // Check for normal emotions that shouldn't be pathologized
  const normalEmotions = [
    // Normal sadness
    /(feel(ing)? (sad|down|blue)|been sad|little sad|bit sad)/i,
    // Normal anxiety
    /(nervous about|worried about|anxious about) (test|date|meeting|presentation|interview)/i,
    // Normal family friction
    /(annoyed|angry|mad) (with|at) (my|brother|sister|sibling|parent|mom|dad)/i,
    // Normal kid behavior
    /(child|kid|son|daughter) (won't|doesn't want to|refuses to) (clean|do chores|homework)/i
  ];
  
  return normalEmotions.some(pattern => pattern.test(userInput));
};

/**
 * Determines if a message is an introduction or greeting
 */
export const isIntroduction = (userInput: string): boolean => {
  const introductionPatterns = [
    /^(hi|hello|hey|good (morning|afternoon|evening)|howdy)/i,
    /^(what'?s up|how'?s it going|how are you)/i,
    /^(nice to meet you|pleased to meet you)/i,
    /^(greetings|salutations)/i
  ];
  
  return introductionPatterns.some(pattern => pattern.test(userInput.trim()));
};

/**
 * Determines if a message is small talk
 */
export const isSmallTalk = (userInput: string): boolean => {
  const smallTalkPatterns = [
    /weather|rain|snow|hot|cold|sunny|cloudy/i,
    /traffic|commute|drive|bus|train/i,
    /weekend|plans|movie|show|watched|seeing|concert/i,
    /game|match|team|play|score|win|lose/i,
    /news|heard about|did you see/i
  ];
  
  const userInputLower = userInput.toLowerCase();
  
  // Check for common small talk patterns
  if (smallTalkPatterns.some(pattern => pattern.test(userInputLower))) {
    // Make sure it's not about mental health concerns
    const mentalHealthPatterns = /anxiety|depression|stress|worry|concern|problem|issue|feel bad|sad|upset|angry/i;
    return !mentalHealthPatterns.test(userInputLower);
  }
  
  return false;
};

/**
 * Determines if a message contains personal sharing
 */
export const isPersonalSharing = (userInput: string): boolean => {
  const personalSharingPatterns = [
    /I feel|I am feeling|I'm feeling|makes me feel|feeling (sad|happy|anxious|worried|stressed|upset)/i,
    /my (life|situation|problem|issue|concern|family|relationship|partner|spouse)/i,
    /happened to me|going through|dealing with|struggling with/i,
    /been (sad|depressed|anxious|worried|stressed|upset)/i
  ];
  
  return personalSharingPatterns.some(pattern => pattern.test(userInput));
};
