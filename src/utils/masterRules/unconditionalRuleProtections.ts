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
 * Generates an appropriate introduction response
 */
export const generateIntroductionResponse = (): string => {
  const introResponses = [
    "Hello! I'm Roger, here to chat with you while you wait for Dr. Eric. How are you doing today?",
    "Hi there! I'm Roger. I'm here to help make your wait a bit more comfortable. How's your day going?",
    "Welcome! I'm Roger, and I'm here to chat with you while you wait to see Dr. Eric. How has your day been so far?",
    "Hey! I'm Roger. I'll be here with you until Dr. Eric is ready for your appointment. How are you feeling today?"
  ];
  
  return introResponses[Math.floor(Math.random() * introResponses.length)];
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

/**
 * Generates a response to personal sharing
 */
export const generatePersonalSharingResponse = (userInput: string): string => {
  // Detect emotional tone
  const emotions = {
    sad: /sad|down|depressed|unhappy|upset|disappointed|hurt/i,
    anxious: /anxious|worried|nervous|stress|concerned|scared|afraid/i,
    angry: /angry|mad|frustrated|annoyed|irritated|upset/i,
    happy: /happy|glad|excited|pleased|thrilled|delighted|joy/i,
    confused: /confused|unsure|uncertain|don't understand|don't know/i
  };
  
  let detectedEmotion = 'neutral';
  for (const [emotion, pattern] of Object.entries(emotions)) {
    if (pattern.test(userInput)) {
      detectedEmotion = emotion;
      break;
    }
  }
  
  // Generate appropriate response based on emotional tone
  const responses: Record<string, string[]> = {
    sad: [
      "I hear that you're feeling down. That sounds really difficult. Would you like to share more about what's been happening?",
      "I'm sorry to hear you're feeling sad. It's okay to have those feelings. What's been going on?"
    ],
    anxious: [
      "It sounds like you're feeling pretty anxious. That can be really uncomfortable. What's on your mind?",
      "I can understand feeling worried. Anxiety is something many people experience. Would you like to talk more about what's causing those feelings?"
    ],
    angry: [
      "I hear your frustration. It's completely okay to feel upset about things. Would it help to talk more about what's bothering you?",
      "It sounds like you're feeling pretty frustrated. That's totally understandable. What's been going on?"
    ],
    happy: [
      "It's great to hear you're feeling positive! What's been bringing you joy lately?",
      "I'm glad you're feeling good! Would you like to share more about what's making you happy?"
    ],
    confused: [
      "It sounds like things feel a bit unclear right now. That can be really disorienting. Would you like to talk through what's confusing you?",
      "I understand feeling uncertain can be challenging. What specifically has you feeling confused?"
    ],
    neutral: [
      "Thank you for sharing that with me. I'd be interested to hear more about your experience if you'd like to share.",
      "I appreciate you opening up. What else would be helpful for us to talk about today?"
    ]
  };
  
  const emotionResponses = responses[detectedEmotion];
  return emotionResponses[Math.floor(Math.random() * emotionResponses.length)];
};

/**
 * Emergency detection function
 * @param userInput The user's message
 * @returns Whether the input indicates an emergency situation
 */
export const isEmergency = (userInput: string): boolean => {
  const emergencyPatterns = [
    /emergency|urgent|crisis|critical|life.threatening|immediate danger/i,
    /need (immediate|urgent|emergency) (help|assistance|care)/i,
    /can'?t breathe|having (a|an) (heart attack|seizure|stroke)/i,
    /bleeding (heavily|severely|profusely|uncontrollably)/i,
    /dying|about to die|going to die/i
  ];
  
  return emergencyPatterns.some(pattern => pattern.test(userInput));
};

/**
 * Emergency handling function
 * @returns Emergency response with appropriate resources
 */
export const handleEmergency = (): string => {
  return "I detect this might be a medical emergency. If you or someone else is in immediate danger, please call 911 or your local emergency number right away. Don't wait. If you're able to safely get to an emergency room, please do so immediately. Your safety is the absolute priority right now.";
};

/**
 * Medical advice detection function
 * @param userInput The user's message
 * @returns Whether the input is asking for direct medical advice
 */
export const isDirectMedicalAdvice = (userInput: string): boolean => {
  const medicalAdvicePatterns = [
    /should I take|should I stop taking|should I switch|what (medication|medicine|drug|dosage)/i,
    /is it safe to (take|use|combine|mix)|drug interaction/i,
    /diagnosis|diagnose|medical condition|medical advice|treatment (for|plan|option)/i,
    /what (is|are) (the|my) (symptoms|condition|illness|disease|diagnosis)/i,
    /what (medication|medicine|drug|treatment|therapy) (should|would|could|can) (I|me|someone)/i
  ];
  
  return medicalAdvicePatterns.some(pattern => pattern.test(userInput));
};

/**
 * Direct medical advice handling function
 * @returns Medical advice disclaimer response
 */
export const handleDirectMedicalAdvice = (): string => {
  return "I notice you're asking about a medical issue. I'm not a medical professional and can't provide medical advice, diagnoses, or treatment recommendations. For specific medical questions, please consult with a qualified healthcare provider. Would it be helpful to discuss general wellness topics or stress management strategies instead?";
};

/**
 * Suicidal ideation detection function
 * @param userInput The user's message
 * @returns Whether the input indicates suicidal ideation
 */
export const isSuicidalIdeation = (userInput: string): boolean => {
  const suicidalIdeationPatterns = [
    /suicid(e|al)|kill (myself|me)|end (my|this) life|harm (myself|me)|cut (myself|me)|hurt (myself|me)/i,
    /don'?t want to (live|be alive)|take my (own )?life|killing myself|commit suicide|die by suicide/i,
    /fatal overdose|hang myself|jump off|i wish i was dead|i want to die|i might kill/i,
    /no (reason|point) (in|to) (living|life)|better off dead|can'?t go on/i,
    /plan to (kill|end|hurt|harm)/i
  ];
  
  return suicidalIdeationPatterns.some(pattern => pattern.test(userInput));
};

/**
 * Suicidal ideation handling function
 * @returns Crisis response with appropriate resources
 */
export const handleSuicidalIdeation = (): string => {
  return "I'm concerned about what you've shared. If you're having thoughts about harming yourself, please reach out for immediate help. The National Suicide Prevention Lifeline is available 24/7 at 988 or 1-800-273-8255. You can also text HOME to the Crisis Text Line at 741741. If you're in immediate danger, please call 911 or go to your nearest emergency room. Your life matters, and trained professionals are ready to support you through this difficult time.";
};
