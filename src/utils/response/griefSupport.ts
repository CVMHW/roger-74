
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

// Levels of grief severity
export type GriefSeverity = 
  | 'very-mild'     // Minor disappointments or temporary losses
  | 'mild'          // Noticeable losses that cause discomfort but are manageable
  | 'moderate'      // Significant losses that disrupt emotional well-being
  | 'severe'        // Profound losses that significantly impair functioning
  | 'existential';  // Losses tied to meaning, purpose, or existence

// Grief metaphor models
export type GriefMetaphorModel = 
  | 'stages'        // Traditional Kübler-Ross 5 stages model
  | 'roller-coaster' // Non-linear up-and-down emotional journey
  | 'dual-process'  // Oscillation between loss and restoration
  | 'curve';        // U-shaped curve transitioning through emotions

// Key themes related to grief and loneliness
const griefThemes = {
  spouseLoss: [
    'lost my spouse', 'lost my husband', 'lost my wife', 'lost my partner',
    'widow', 'widower', 'husband died', 'wife died', 'partner died',
    'after they died', 'years together', 'decades together',
    'marriage ended', 'died before', 'long marriage', 
    'nobody knows me', 'knew me best', 'knew everything about me'
  ],
  
  familyLoss: [
    'lost my mother', 'lost my father', 'lost my son', 'lost my daughter',
    'mom died', 'dad died', 'child died', 'brother died', 'sister died',
    'grandparent died', 'funeral', 'buried', 'cremated'
  ],
  
  petLoss: [
    'pet died', 'dog died', 'cat died', 'put down my pet', 'euthanized',
    'lost my dog', 'lost my cat', 'miss my pet', 'animal died',
    'rainbow bridge', 'veterinarian', 'put to sleep'
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
  ],

  // New themes for different grief severity levels
  veryMildGrief: [
    'lost my pen', 'missed a party', 'bummed out', 'disappointed',
    'minor setback', 'small issue', 'annoying', 'frustrating',
    'missed opportunity', 'lost my chance'
  ],

  mildGrief: [
    'lost my favorite', 'broke my', 'friendship ended', 'missed deadline',
    'lost an opportunity', 'small loss', 'sad about', 'too bad',
    'messed up', 'failed at', 'didn\'t work out'
  ],

  moderateGrief: [
    'lost my job', 'broke up', 'relationship ended', 'pet died',
    'failed exam', 'moved away', 'going through breakup',
    'heartbroken', 'devastated', 'really hurting',
    'can\'t focus', 'having trouble sleeping'
  ],

  severeGrief: [
    'lost my parent', 'lost my child', 'divorce', 'terminal illness',
    'died suddenly', 'suicide', 'accident', 'tragedy',
    'can\'t go on', 'overwhelming loss', 'unbearable pain',
    'can\'t eat', 'can\'t sleep', 'can\'t function'
  ],

  existentialGrief: [
    'no meaning', 'what\'s the point', 'purpose in life',
    'why go on', 'everything is empty', 'nothing matters',
    'lost my faith', 'questioning everything', 'crisis of belief',
    'feel lost', 'identity crisis', 'who am I now'
  ],
  
  // New themes for roller coaster metaphor
  rollerCoasterMetaphor: [
    'roller coaster', 'ups and downs', 'twists and turns', 
    'emotional ride', 'back and forth', 'one day to the next',
    'emotional roller-coaster', 'sometimes up', 'sometimes down'
  ],
  
  // New Kubler-Ross curve stages from image
  curveStagesDownward: [
    'loss-hurt', 'shock', 'numbness', 'denial', 'emotional outbursts',
    'anger', 'fear', 'searchings', 'disorganization', 'panic',
    'loneliness', 'guilt', 'isolation'
  ],
  
  curveStagesUpward: [
    'depression', 're-entry troubles', 'new relationships', 
    'new strengths', 'new patterns', 'hope', 'affirmation',
    'helping others', 'loss adjustment', 'post-traumatic growth'
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
  griefSeverity: GriefSeverity | null,
  themeIntensity: number, // 0-10 scale of how intensely grief themes are present
  mentionsTimeFrame: boolean, // Whether long-term relationship is mentioned
  mentionsIrreplaceability: boolean, // Whether irreplaceability is mentioned
  griefMetaphorModel: GriefMetaphorModel | null, // Which grief model is referenced
  detectedGriefStages: string[] // Specific stages mentioned
} => {
  const lowerMessage = message.toLowerCase();
  
  // Default response object
  const result = {
    griefType: null as GriefType | null,
    existentialLonelinessType: null as ExistentialLonelinessType | null,
    griefSeverity: null as GriefSeverity | null,
    themeIntensity: 0,
    mentionsTimeFrame: false,
    mentionsIrreplaceability: false,
    griefMetaphorModel: null as GriefMetaphorModel | null,
    detectedGriefStages: [] as string[]
  };
  
  // Check for spouse/partner loss keywords
  const hasSpouseLossTheme = griefThemes.spouseLoss.some(theme => 
    lowerMessage.includes(theme));
  
  if (hasSpouseLossTheme) {
    result.griefType = 'spousal-loss';
    result.themeIntensity += 5; // Base intensity for spousal loss
    result.griefSeverity = 'severe'; // Default to severe for spousal loss
  } else if (griefThemes.familyLoss.some(theme => lowerMessage.includes(theme))) {
    result.griefType = 'family-loss';
    result.themeIntensity += 4;
    result.griefSeverity = 'severe';
  } else if (griefThemes.petLoss.some(theme => lowerMessage.includes(theme))) {
    result.griefType = 'pet-loss';
    result.themeIntensity += 3;
    result.griefSeverity = 'moderate';
  } else if (lowerMessage.includes('died') || lowerMessage.includes('passed away')) {
    result.griefType = 'general';
    result.themeIntensity += 3;
    result.griefSeverity = 'moderate';
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
    // If existential themes are present and no grief severity is set yet,
    // assume existential grief severity
    if (!result.griefSeverity) {
      result.griefSeverity = 'existential';
    }
  }
  
  // Check for identity loss themes
  const hasIdentityLossTheme = griefThemes.identityLoss.some(theme => 
    lowerMessage.includes(theme));
  
  if (hasIdentityLossTheme) {
    result.existentialLonelinessType = 'identity-reflection-loss';
    result.themeIntensity += 2;
    result.griefType = result.griefType || 'identity-loss';
    // If no grief severity is set yet but identity loss is present,
    // set to existential
    if (!result.griefSeverity) {
      result.griefSeverity = 'existential';
    }
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

  // Check for roller coaster metaphor
  const hasRollerCoasterMetaphor = griefThemes.rollerCoasterMetaphor.some(theme =>
    lowerMessage.includes(theme));
    
  if (hasRollerCoasterMetaphor || 
      lowerMessage.includes('not linear') || 
      lowerMessage.includes('back and forth') ||
      lowerMessage.includes('different every day')) {
    result.griefMetaphorModel = 'roller-coaster';
    result.themeIntensity += 2;
  }
  
  // Check for traditional stages metaphor
  if (lowerMessage.includes('stages of grief') || 
      lowerMessage.includes('kübler-ross') ||
      lowerMessage.includes('kubler-ross') ||
      (lowerMessage.includes('denial') && lowerMessage.includes('acceptance'))) {
    result.griefMetaphorModel = 'stages';
    result.themeIntensity += 1;
  }
  
  // Check for curve metaphor
  if (lowerMessage.includes('grief curve') || 
     (lowerMessage.includes('u-shaped') && lowerMessage.includes('grief'))) {
    result.griefMetaphorModel = 'curve';
    result.themeIntensity += 1;
  }
  
  // Detect specific grief stages mentioned
  // Check downward curve stages
  griefThemes.curveStagesDownward.forEach(stage => {
    if (lowerMessage.includes(stage.toLowerCase())) {
      result.detectedGriefStages.push(stage);
      result.themeIntensity += 0.5; // Small boost for each stage mentioned
    }
  });
  
  // Check upward curve stages
  griefThemes.curveStagesUpward.forEach(stage => {
    if (lowerMessage.includes(stage.toLowerCase())) {
      result.detectedGriefStages.push(stage);
      result.themeIntensity += 0.5; // Small boost for each stage mentioned
    }
  });

  // If no grief type or severity has been determined yet, check for different grief severity levels
  if (!result.griefSeverity) {
    // Check for very mild grief
    if (griefThemes.veryMildGrief.some(theme => lowerMessage.includes(theme))) {
      result.griefSeverity = 'very-mild';
      result.themeIntensity += 1;
      result.griefType = result.griefType || 'general';
    } 
    // Check for mild grief
    else if (griefThemes.mildGrief.some(theme => lowerMessage.includes(theme))) {
      result.griefSeverity = 'mild';
      result.themeIntensity += 2;
      result.griefType = result.griefType || 'general';
    }
    // Check for moderate grief
    else if (griefThemes.moderateGrief.some(theme => lowerMessage.includes(theme))) {
      result.griefSeverity = 'moderate';
      result.themeIntensity += 3;
      result.griefType = result.griefType || 'general';
    }
    // Check for severe grief
    else if (griefThemes.severeGrief.some(theme => lowerMessage.includes(theme))) {
      result.griefSeverity = 'severe';
      result.themeIntensity += 4;
      result.griefType = result.griefType || 'general';
    }
    // Check for existential grief
    else if (griefThemes.existentialGrief.some(theme => lowerMessage.includes(theme))) {
      result.griefSeverity = 'existential';
      result.themeIntensity += 4;
      result.griefType = result.griefType || 'meaning-loss';
    }
  }
  
  // Additional intensity for combinations that indicate deep existential grief
  if (result.griefType === 'spousal-loss' && 
      (result.existentialLonelinessType === 'intimacy-loneliness' || 
       result.existentialLonelinessType === 'shared-history-loss')) {
    result.themeIntensity += 2;
    result.griefSeverity = 'existential';
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
  
  // If roller coaster metaphor is detected, prioritize that in response
  if (themes.griefMetaphorModel === 'roller-coaster') {
    const rollerCoasterResponses = [
      "The roller coaster metaphor you mentioned really captures how grief works—it's rarely a straight line and can have unpredictable ups and downs from day to day or even hour to hour.",
      "That roller coaster description of grief is so apt. The way emotions can swing wildly and unexpectedly is something many people experience but don't always have words for.",
      "I hear you describing grief as more of a roller coaster than a set of neat stages. That matches what many people experience—a journey with unexpected turns and varying intensities.",
      "The way you're describing grief as a roller coaster really resonates with how unpredictable and non-linear this journey can be. Some days might feel manageable, while others bring you right back to intense feelings.",
      "That roller coaster metaphor for grief captures something important—how we can move between different emotions, sometimes experiencing several in the same day. It's a more accurate picture than thinking grief follows orderly stages."
    ];
    return rollerCoasterResponses[Math.floor(Math.random() * rollerCoasterResponses.length)];
  }
  
  // If specific grief stages are mentioned
  if (themes.detectedGriefStages.length > 0) {
    // Get first two stages to mention in response
    const mentionedStages = themes.detectedGriefStages.slice(0, 2);
    const stageResponses = [
      `I notice you mentioned experiencing ${mentionedStages.join(" and ")} in your grief journey. These different emotional states are common, though they rarely follow a predictable pattern.`,
      `The ${mentionedStages.join(" and ")} you're describing are recognized parts of grief, though most people find they move between these states rather than progressing linearly through them.`,
      `I hear you talking about ${mentionedStages.join(" and ")} as part of your grief experience. These are common aspects of grief, though they often appear more like a roller coaster than orderly stages.`,
      `Your mention of ${mentionedStages.join(" and ")} reflects the complex nature of grief. These experiences are valid and important parts of processing loss, even if they don't follow a neat timeline.`
    ];
    return stageResponses[Math.floor(Math.random() * stageResponses.length)];
  }
  
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
        "What you're sharing about losing your spouse suggests you're also experiencing that loss of being seen through the eyes of someone who knew you so completely. That creates a unique kind of existential loneliness that's hard to describe.",
        "I hear that beyond missing your spouse, there's also that profound loss of how you experienced yourself through their understanding of you. That's a form of existential loneliness that goes beyond just being alone."
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    if (themes.existentialLonelinessType === 'identity-reflection-loss') {
      const responses = [
        "I'm hearing how losing your spouse also means losing the person who reflected back to you who you are. That can be disorienting - losing that mirror that helped form your sense of self.",
        "The loneliness you're describing seems connected to losing not just your spouse, but also part of how you understood yourself through their eyes. That's a profound existential challenge.",
        "You're touching on something many grieving spouses experience - that disorientation of no longer being seen through the eyes of someone who knew you so completely. It can feel like losing part of your identity.",
        "What you're sharing about losing your spouse suggests you're feeling the absence of that special witness to your life - the person who saw the full arc of your experiences in a way no one else did or will.",
        "I hear that beyond the general grief, there's that profound loss of the person who witnessed your life so intimately. That creates an existential loneliness that's hard for others to fully understand."
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
  
  // Very mild grief responses
  if (themes.griefSeverity === 'very-mild') {
    const responses = [
      "I notice you're feeling a bit disappointed about that. It's okay to acknowledge even small letdowns.",
      "That sounds a bit frustrating. Even minor disappointments can affect our day.",
      "I hear that you're feeling a little down about that. Those small bumps can still matter.",
      "Sometimes those little disappointments can still affect us. How are you handling it?",
      "I understand that even small losses can cause some momentary sadness. Would you like to talk about it?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Mild grief responses
  if (themes.griefSeverity === 'mild') {
    const responses = [
      "I can hear that this loss is causing you some sadness. It's completely valid to feel that way.",
      "That kind of disappointment can stick with us for a while. How has it been affecting you?",
      "I understand this is bringing up some difficult feelings for you. Would it help to talk more about it?",
      "It sounds like you're processing a loss that matters to you. Even if others might see it as small, your feelings about it are important.",
      "I'm hearing how this situation has caused you some genuine sadness. Would you like to share more about what it meant to you?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Moderate grief responses (including pet loss)
  if (themes.griefSeverity === 'moderate') {
    // Special case for pet loss
    if (themes.griefType === 'pet-loss') {
      const responses = [
        "Losing a pet can be deeply painful. They're family members who offer unconditional love. I'm truly sorry for your loss.",
        "The grief of losing a pet is very real. They share our daily lives and create a special bond that's meaningful and significant.",
        "I hear how much your pet meant to you. That kind of love creates a special kind of grief when we lose them.",
        "Losing a pet can create a significant void in our lives. Their constant presence and unconditional love is irreplaceable in many ways.",
        "The loss of a pet is a genuine grief that deserves to be acknowledged. They're family members who touch our lives in profound ways."
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    const responses = [
      "This sounds like a significant loss that's really affecting you. It's completely understandable to be struggling with something this important.",
      "I can hear how deeply this is impacting you. Losses like this can really shake our sense of stability for a while.",
      "What you're going through sounds genuinely difficult. It makes sense that you'd be feeling the weight of this loss.",
      "I'm hearing how important this was to you, and how its loss has created a real sense of grief. That's entirely valid.",
      "This kind of significant change can create a genuine grief response. Your feelings make complete sense given what you're going through."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Severe grief responses (family loss, etc.)
  if (themes.griefSeverity === 'severe' && themes.griefType !== 'spousal-loss') {
    const responses = [
      "I'm so sorry for your profound loss. This kind of grief touches every part of our lives and can feel overwhelming.",
      "The loss you're describing is truly significant. I want to acknowledge the depth of what you're going through right now.",
      "I hear how devastating this loss has been. When someone this important to us is gone, it affects everything.",
      "This kind of profound loss creates grief that can feel all-consuming. I want you to know I'm here to listen as you navigate this difficult journey.",
      "What you're going through is one of life's most difficult experiences. The depth of this loss is something that takes time and support to process."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Existential grief responses
  if (themes.griefSeverity === 'existential' && themes.griefType !== 'spousal-loss') {
    const responses = [
      "I'm hearing how you're grappling with some of life's deepest questions. These existential questions often arise during significant transitions or losses.",
      "The questions you're asking about meaning and purpose are profound ones. Sometimes our foundations shift, and we need to rebuild our understanding of ourselves and the world.",
      "That sense of emptiness or questioning everything can be a deeply challenging space to be in. These existential concerns often emerge when our previous understandings no longer seem sufficient.",
      "I hear you questioning some fundamental aspects of life and meaning. These profound questions are part of the human experience, though they can feel isolating.",
      "The existential questions you're raising touch on our deepest needs for meaning and purpose. It takes courage to face these kinds of fundamental uncertainties."
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
 * Generates responses that acknowledge the non-linear roller coaster nature of grief
 * @param message The user's message
 * @returns A response that validates the unpredictable nature of grief
 */
export const generateRollerCoasterGriefResponse = (message: string): string => {
  const themes = detectGriefThemes(message);
  
  // If user specifically mentioned roller coaster metaphor
  if (themes.griefMetaphorModel === 'roller-coaster') {
    const responses = [
      "The roller coaster metaphor for grief that you mentioned really captures how emotions can fluctuate unpredictably. One day might feel manageable, and the next can bring you back to intense feelings of loss. This back-and-forth is completely normal in grief.",
      "I appreciate how you described grief as a roller coaster rather than neat stages. That's actually how most grief researchers now understand the process—it's rarely linear and can loop back through different emotions many times. How are you navigating these ups and downs?",
      "That roller coaster description of grief is so accurate. The way emotions can swing wildly from moment to moment reflects the complex reality of processing loss. What parts of this ride have been most challenging for you?",
      "You've touched on something important with the roller coaster metaphor. Grief rarely follows a predictable path, and many people find themselves moving between different emotional states—sometimes even in the same day. This unpredictability is actually a normal part of the healing process."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // For general non-linear grief responses
  const responses = [
    "Grief often feels less like orderly stages and more like a roller coaster ride with unexpected twists and turns. Some days might bring a sense of peace, while others can feel like you're starting over with the pain. This unpredictable pattern is actually quite normal.",
    "The journey through grief rarely follows a straight line. Many people experience it more like waves that come and go with varying intensity, or like a roller coaster with unexpected drops and climbs. How has your experience been shifting over time?",
    "What you're describing fits with how we now understand grief—not as a series of neat stages, but as a dynamic process that can move back and forth between different emotions and intensities. This seemingly chaotic nature of grief can be disorienting, but it's actually how most people experience it.",
    "Rather than moving smoothly from one stage to another, grief often takes us on something more like a roller coaster ride. You might find yourself cycling through different emotions—sometimes feeling stronger, other times returning to intense sadness. This pattern is a normal part of healing."
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
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
  if (themes.themeIntensity < 2) {
    return null;
  }
  
  let response;
  
  // First priority: Check if roller coaster metaphor was specifically mentioned
  if (themes.griefMetaphorModel === 'roller-coaster') {
    response = generateRollerCoasterGriefResponse(message);
  } 
  // Second priority: Check if specific grief stages were mentioned
  else if (themes.detectedGriefStages.length > 0) {
    // Start with a reflection
    response = generateGriefReflection(message);
    
    // Add validation of non-linear grief if multiple stages are mentioned
    if (themes.detectedGriefStages.length >= 2) {
      const nonLinearAdditions = [
        " Grief often doesn't follow a linear path through these experiences—many people find themselves moving between different states in an unpredictable way.",
        " Although these experiences are often presented as stages, most people find they don't progress neatly from one to another—rather, they might circle back through various emotions many times.",
        " These different aspects of grief don't usually appear in a fixed order. Most people move between them in various ways that can feel more like a roller coaster than a straight path."
      ];
      response += nonLinearAdditions[Math.floor(Math.random() * nonLinearAdditions.length)];
    }
  }
  // Default to standard grief reflection
  else {
    response = generateGriefReflection(message);
  }
  
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
  // For moderate intensity grief, add a supportive follow-up
  else if (themes.themeIntensity >= 4) {
    const followUps = [
      " Would you like to share more about how you've been coping?",
      " How have you been taking care of yourself during this difficult time?",
      " Is there anything that's been particularly helpful for you as you process this?",
      " Would it be helpful to talk about what this loss means for you?",
      " How has your day-to-day life been affected by this experience?"
    ];
    
    response += followUps[Math.floor(Math.random() * followUps.length)];
  }
  // For lower intensity grief, add a gentle acknowledgment
  else {
    const followUps = [
      " How are you managing with this?",
      " Would you like to talk more about it?",
      " How have you been feeling about this recently?",
      " Is there anything specific about this that's been on your mind?",
      " What thoughts have you been having about this situation?"
    ];
    
    response += followUps[Math.floor(Math.random() * followUps.length)];
  }
  
  return response;
};

