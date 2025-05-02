
/**
 * Unconditional Rule Protections
 * 
 * These rules MUST be followed in ALL Roger interactions without exception.
 * They are the foundation of the therapeutic relationship and cannot be overridden.
 */

/**
 * Core unconditional rules that must be followed in all interactions
 * These are ranked in order of priority
 */
export const UNCONDITIONAL_RULES = [
  "Follow the patient's concerns and stories completely in early conversation",
  "Prioritize deep engagement with non-clinical concerns to build rapport",
  "Only crisis concerns take precedence over following the patient's narrative",
  "Acknowledge everyday frustrations before redirecting to clinical topics",
  "Respond to the emotion behind the content before the content itself",
  "Cultural attunement takes precedence over clinical formulation"
];

/**
 * Early engagement mandate - enforces focus on rapport building in first interactions
 * @returns Guidance for early conversation focus
 */
export const getEarlyEngagementMandate = (): string => {
  return "The first 5-10 responses are critical for building trust. Prioritize acknowledging small talk, everyday frustrations, and minor concerns over clinical redirection.";
};

/**
 * Checks if the interaction should follow cultural attunement principles
 * @param userInput The user's message
 * @returns Whether cultural attunement should be prioritized
 */
export const shouldPrioritizeCulturalAttunement = (userInput: string): boolean => {
  // Check for cultural references
  const culturalReferences = /family|tradition|community|background|culture|heritage|customs|values|beliefs|language|immigrant|generation/i;
  return culturalReferences.test(userInput);
};

/**
 * Validates that a response follows the unconditional rules
 * @param response The candidate response
 * @param userInput The original user input
 * @param messageCount Current message count in the conversation
 * @returns Whether the response meets the unconditional requirements
 */
export const validateUnconditionalRules = (
  response: string,
  userInput: string,
  messageCount: number
): boolean => {
  // Early conversation requires acknowledging everyday concerns first
  if (messageCount <= 10) {
    const hasAcknowledgment = /sounds|seems|understand|hear you|that's|frustrating|challenging|difficult|tough|stressful/i.test(response);
    const hasPersonalTouch = response.includes("club soda") || 
      response.includes("stinks") || 
      response.includes("been there") || 
      response.includes("happens to") ||
      response.includes("get that");
      
    if (!hasAcknowledgment && !hasPersonalTouch) {
      return false;
    }
  }
  
  // For all conversations, check if response follows the patient's lead
  const userTopics = extractTopics(userInput);
  const responseAddressesUserTopics = userTopics.some(topic => 
    response.toLowerCase().includes(topic.toLowerCase())
  );
  
  return responseAddressesUserTopics;
};

/**
 * Extracts key topics from user input
 * @param input The user's message
 * @returns List of key topics mentioned
 */
const extractTopics = (input: string): string[] => {
  const topics: string[] = [];
  
  // Extract potential topics (nouns and noun phrases)
  const sentences = input.split(/[.!?]+/);
  
  for (const sentence of sentences) {
    const words = sentence.trim().split(/\s+/);
    for (const word of words) {
      const cleaned = word.replace(/[^a-zA-Z]/g, '').toLowerCase();
      if (cleaned.length > 3 && !commonWords.includes(cleaned)) {
        topics.push(cleaned);
      }
    }
  }
  
  return topics;
};

// Common words to filter out from topic extraction
const commonWords = [
  "about", "after", "again", "also", "always", "another", "because", 
  "before", "being", "between", "both", "could", "doesn", "doing", 
  "don't", "during", "each", "either", "enough", "every", "everyone", 
  "everything", "from", "getting", "have", "having", "here", "himself", 
  "just", "know", "like", "more", "most", "much", "myself", "never", 
  "only", "other", "over", "same", "some", "something", "such", "take", 
  "taking", "than", "that", "their", "them", "then", "there", "these", 
  "they", "this", "those", "through", "very", "want", "well", "were", 
  "what", "when", "where", "which", "while", "will", "with", "would", 
  "your", "you're", "should", "could", "would"
];

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
 * Checks if the response appropriately validates subclinical concerns
 * without pathologizing normal emotions
 */
export const validatesSubclinicalConcerns = (response: string): boolean => {
  const pathologizingLanguage = /(clinical|disorder|diagnosis|symptom|treatment|therapy|mental health issue)/i;
  const normalizingLanguage = /(normal|common|we all|everyone feels|natural|understandable|makes sense)/i;
  
  return !pathologizingLanguage.test(response) && normalizingLanguage.test(response);
};
