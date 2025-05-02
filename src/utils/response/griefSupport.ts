/**
 * Module for responding to grief and loss topics with an emphasis on 
 * existential perspective and the unique loneliness of spousal loss
 */

// Types of grief experiences that might need specialized responses
export type GriefType = 
  | 'spousal-loss'      // Loss of a spouse or long-term partner
  | 'family-loss'       // Loss of a family member
  | 'friend-loss'       // Loss of a close friend
  | 'pet-loss'          // Loss of a pet
  | 'meaning-loss'      // Loss of meaning or purpose (existential)
  | 'identity-loss'     // Loss of identity or role
  | 'anticipatory'      // Grief before an expected loss
  | 'general';          // Unspecified grief

// Types of existential loneliness that might be expressed
export type ExistentialLonelinessType =
  | 'intimacy-loneliness'     // Loss of deep knowing/being known
  | 'shared-history-loss'     // Loss of shared memories/experiences
  | 'witness-loss'            // Loss of someone who witnessed your life
  | 'identity-reflection-loss' // Loss of seeing yourself through another's eyes
  | 'general-loneliness';     // General existential loneliness

// Key themes related to grief and loneliness
const griefThemes = {
  spouseLoss: [
    'lost my spouse', 'lost my husband', 'lost my wife', 'lost my partner',
    'widow', 'widower', 'husband died', 'wife died', 'partner died',
    'after they died', 'years together', 'decades together',
    'marriage ended', 'died before', 'long marriage', 
    'nobody knows me', 'knew me best', 'knew everything about me'
  ],
  
  intimacyLoss: [
    'intimacy', 'deep connection', 'nobody knows me like', 
    'grew up together', 'shared everything', 'knew all my',
    'life together', 'built a life', 'shared history'
  ],
  
  existentialThemes: [
    'existential loneliness', 'alone in a different way',
    'lonely in a crowd', 'friends don\'t help', 'different kind of lonely',
    'nobody will ever know me', 'irreplaceable', 'can\'t be recreated',
    'not the same', 'unique relationship'
  ],
  
  identityLoss: [
    'lost myself', 'don\'t know who I am', 'part of me died',
    'identity', 'how they saw me', 'reflection', 'mirror',
    'who am i now', 'see myself', 'viewed me', 'their eyes'
  ],
  
  timeAndMemories: [
    'decades', 'years together', 'long relationship', 'memories',
    'remembered', 'history together', 'grew together', 'life together',
    'shared past', 'knowing everything about'
  ]
};

/**
 * Detects themes related to grief and existential loneliness in a message
 * @param message The user's message
 * @returns Object containing detected grief types and themes
 */
export const detectGriefThemes = (message: string): {
  griefType: GriefType | null,
  existentialLonelinessType: ExistentialLonelinessType | null,
  themeIntensity: number, // 0-10 scale of how intensely grief themes are present
  mentionsTimeFrame: boolean, // Whether long-term relationship is mentioned
  mentionsIrreplaceability: boolean // Whether irreplaceability is mentioned
} => {
  const lowerMessage = message.toLowerCase();
  
  // Default response object
  const result = {
    griefType: null as GriefType | null,
    existentialLonelinessType: null as ExistentialLonelinessType | null,
    themeIntensity: 0,
    mentionsTimeFrame: false,
    mentionsIrreplaceability: false
  };
  
  // Check for spouse/partner loss keywords
  const hasSpouseLossTheme = griefThemes.spouseLoss.some(theme => 
    lowerMessage.includes(theme));
  
  if (hasSpouseLossTheme) {
    result.griefType = 'spousal-loss';
    result.themeIntensity += 5; // Base intensity for spousal loss
  } else if (lowerMessage.includes('died') || lowerMessage.includes('passed away')) {
    result.griefType = 'general';
    result.themeIntensity += 3;
  }
  
  // Check for intimacy loss themes
  const hasIntimacyLossTheme = griefThemes.intimacyLoss.some(theme => 
    lowerMessage.includes(theme));
  
  if (hasIntimacyLossTheme) {
    result.existentialLonelinessType = 'intimacy-loneliness';
    result.themeIntensity += 2;
  }
  
  // Check for existential loneliness themes
  const hasExistentialThemes = griefThemes.existentialThemes.some(theme => 
    lowerMessage.includes(theme));
  
  if (hasExistentialThemes) {
    // If already has intimacy loneliness, keep it as it's more specific
    if (!result.existentialLonelinessType) {
      result.existentialLonelinessType = 'general-loneliness';
    }
    result.themeIntensity += 2;
  }
  
  // Check for identity loss themes
  const hasIdentityLossTheme = griefThemes.identityLoss.some(theme => 
    lowerMessage.includes(theme));
  
  if (hasIdentityLossTheme) {
    result.existentialLonelinessType = 'identity-reflection-loss';
    result.themeIntensity += 2;
  }
  
  // Check for shared history/time themes
  const hasTimeMemoriesTheme = griefThemes.timeAndMemories.some(theme => 
    lowerMessage.includes(theme));
  
  if (hasTimeMemoriesTheme) {
    // If already has intimacy loneliness, change to shared history which is more specific
    if (result.existentialLonelinessType === 'intimacy-loneliness' || 
        !result.existentialLonelinessType) {
      result.existentialLonelinessType = 'shared-history-loss';
    }
    result.mentionsTimeFrame = true;
    result.themeIntensity += 2;
  }
  
  // Check for irreplaceability themes
  if (lowerMessage.includes('irreplaceable') || 
      lowerMessage.includes('can\'t be replaced') || 
      lowerMessage.includes('nothing compares') || 
      lowerMessage.includes('never be the same')) {
    result.mentionsIrreplaceability = true;
    result.themeIntensity += 1;
  }
  
  // Additional intensity for combinations that indicate deep existential grief
  if (result.griefType === 'spousal-loss' && 
      (result.existentialLonelinessType === 'intimacy-loneliness' || 
       result.existentialLonelinessType === 'shared-history-loss')) {
    result.themeIntensity += 2;
  }
  
  // Cap intensity at 10
  result.themeIntensity = Math.min(result.themeIntensity, 10);
  
  return result;
};

/**
 * Generate an appropriate reflection for grief and existential loneliness
 * @param message The user's message
 * @returns A reflective response addressing grief and loneliness themes
 */
export const generateGriefReflection = (message: string): string => {
  const themes = detectGriefThemes(message);
  
  // High intensity spousal loss with existential loneliness
  if (themes.griefType === 'spousal-loss' && 
      themes.existentialLonelinessType && 
      themes.themeIntensity >= 7) {
    
    // Specific responses based on the type of existential loneliness
    if (themes.existentialLonelinessType === 'intimacy-loneliness') {
      const responses = [
        "I hear that you're experiencing a profound and unique loneliness after losing your spouse. That deep intimacy built over years is something that can't simply be replaced by other relationships.",
        "The loneliness you're describing after losing your spouse sounds so profound - that loss of someone who truly knew you in a way no one else did. That's a very particular kind of existential loneliness.",
        "You're touching on something so significant - that special kind of loneliness that comes from losing someone who knew you completely. Even with friends around, the absence of that deep knowing is felt differently.",
        "What you're describing speaks to the irreplaceable nature of a spouse who shared so much of your life journey. That kind of intimate knowing can't be easily substituted, creating a unique form of loneliness.",
        "I'm hearing how the loneliness after losing your spouse is different from just being alone. It's about losing that person who held your history, who knew you in ways nobody else ever could."
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    if (themes.existentialLonelinessType === 'shared-history-loss') {
      const responses = [
        "I'm hearing how the years of shared history with your spouse created something irreplaceable. That loss of someone who witnessed so much of your life journey creates a very particular kind of loneliness.",
        "The loneliness you're describing seems connected to losing that shared history - all those years of memories and experiences that were witnessed together. That creates a void that's hard to articulate.",
        "You're touching on something profound - how losing your spouse means losing the person who carried your shared history. That creates an existential loneliness that's different from simply being alone.",
        "What you're describing about losing decades of shared life with your spouse resonates with what many have called 'existential loneliness' - that unique emptiness of no longer having the person who witnessed your journey.",
        "I hear that you're grappling with the loss of not just your spouse, but all the years of shared experiences and memories that you built together. That creates a very special kind of loneliness."
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    if (themes.existentialLonelinessType === 'identity-reflection-loss') {
      const responses = [
        "I'm hearing how losing your spouse also means losing the person who reflected back to you who you are. That can be disorienting - losing that mirror that helped form your sense of self.",
        "The loneliness you're describing seems connected to losing not just your spouse, but also part of how you understood yourself through their eyes. That's a profound existential challenge.",
        "You're touching on something many grieving spouses experience - that disorientation of no longer being seen through the eyes of someone who knew you so completely. It can feel like losing part of your identity.",
        "What you're sharing about losing your spouse suggests you're also experiencing that loss of being known and reflected back to yourself. That creates a unique kind of existential loneliness that's hard to describe.",
        "I hear that beyond missing your spouse, there's also that profound loss of how you experienced yourself through their understanding of you. That's a form of existential loneliness that goes beyond just being alone."
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    if (themes.existentialLonelinessType === 'witness-loss') {
      const responses = [
        "I'm hearing how profound it is to lose your spouse who was the witness to so much of your life. There's a special kind of loneliness in no longer having that person who carried parts of your story with you.",
        "The loneliness you're describing connects to losing your spouse who witnessed so many chapters of your life. That absence creates an existential void that's different from other forms of loneliness.",
        "You're touching on something many who've lost spouses describe - the loss of the primary witness to your life journey. That creates a unique kind of existential loneliness, even when surrounded by others.",
        "What you're sharing about your spouse suggests you're feeling the absence of that special witness to your life - the person who saw the full arc of your experiences in a way no one else did or will.",
        "I hear that beyond the general grief, there's that profound loss of the person who witnessed your life so intimately. That creates an existential loneliness that's hard for others to fully understand."
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }
  
  // General spousal loss with some existential elements
  if (themes.griefType === 'spousal-loss' && themes.themeIntensity >= 5) {
    const responses = [
      "I hear how losing your spouse has created a very particular kind of loneliness - one that exists even when you're not alone. That speaks to the unique bond you shared.",
      "The grief of losing a spouse seems to carry this existential quality that you're describing - a loneliness that exists regardless of who else is in your life.",
      "You're touching on something profound about the unique loneliness that comes with losing a spouse - it's not just about being alone, but about losing that special kind of connection.",
      "What you're describing about losing your spouse resonates with what many call the 'existential loneliness' of grief - that sense that something irreplaceable has been lost.",
      "I'm hearing how the absence of your spouse creates a loneliness that's different in quality from other kinds of aloneness. That deep connection you had created something unique that can't simply be substituted."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Responses that emphasize the irreplaceability aspect
  if (themes.mentionsIrreplaceability) {
    const responses = [
      "I hear you expressing how irreplaceable your relationship was. That recognition of something that can't be recreated brings its own kind of grief.",
      "You're touching on something profound about the uniqueness of your relationship and how it can't simply be replaced or recreated. That realization carries its own weight in grief.",
      "What you're describing about the irreplaceable nature of your relationship speaks to how singular and unique your connection was.",
      "I'm hearing how you're grappling with the reality that what you had cannot be recreated or replaced. That's a profound aspect of grief that's often hard to articulate.",
      "The way you're describing the irreplaceable quality of your relationship shows how deeply you recognize the unique bond you shared."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Responses that emphasize the time frame aspect
  if (themes.mentionsTimeFrame) {
    const responses = [
      "I hear how the decades you spent together created something profound and irreplaceable. That kind of shared history and deep knowing takes years to build.",
      "You're touching on how time builds a unique kind of intimacy and knowing - those years together created something that can't quickly be substituted.",
      "What you're describing about the years spent together speaks to how time creates a depth of connection that's truly unique to long-term relationships.",
      "I'm hearing how those many years together built layers of connection and understanding that feel irreplaceable now.",
      "The way you describe that long journey together highlights how time creates a special kind of knowing and being known that becomes part of who we are."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // General grief responses if no specific pattern matches
  const generalResponses = [
    "I hear the grief in what you're sharing. The loss you're describing seems to have created a very particular kind of loneliness.",
    "The loneliness you're describing in your grief sounds profound. Would you like to tell me more about the relationship you're missing?",
    "You're touching on the deeply personal nature of grief and how it creates its own kind of loneliness. Each loss is unique in how it affects us.",
    "What you're sharing about your grief resonates with how losing someone important creates a void that isn't easily filled by other relationships.",
    "I'm hearing how your grief has created a unique kind of loneliness, one that exists regardless of who else is in your life."
  ];
  
  return generalResponses[Math.floor(Math.random() * generalResponses.length)];
};

/**
 * Generate an appropriate response for different stages of grief
 * @param message The user's message 
 * @returns A response tailored to the grief experience expressed
 */
export const generateGriefResponse = (message: string): string | null => {
  // Detect grief themes
  const themes = detectGriefThemes(message);
  
  // Only respond if grief themes are present with sufficient intensity
  if (themes.themeIntensity < 3) {
    return null;
  }
  
  // Start with a reflection
  let response = generateGriefReflection(message);
  
  // For high intensity grief, add a follow-up question or validation
  if (themes.themeIntensity >= 7) {
    const followUps = [
      " Would it help to share more about that unique relationship and what made it so special?",
      " I'm here to listen if you'd like to tell me more about your experience with this particular kind of loneliness.",
      " How have you been navigating this unique form of loneliness?",
      " Has anyone in your life been able to understand or acknowledge this specific kind of loneliness?",
      " What aspects of that connection do you find yourself missing most deeply?"
    ];
    
    response += followUps[Math.floor(Math.random() * followUps.length)];
  }
  
  return response;
};
