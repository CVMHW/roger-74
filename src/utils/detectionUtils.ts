
/**
 * Utilities for detecting various concerns in user messages
 */

// Crisis keyword detection
export const detectCrisisKeywords = (message: string): boolean => {
  const crisisKeywords = [
    'suicide', 'kill myself', 'end my life', 'want to die', 'hopeless', 'worthless',
    'helpless', 'overwhelmed', 'panic attack', 'anxiety attack', 'self-harm', 'cutting',
    'abused', 'trauma', 'violent', 'assaulted', 'emergency', 'urgent', 'crisis',
    'mental breakdown'
  ];
  const lowerMessage = message.toLowerCase();
  return crisisKeywords.some(keyword => lowerMessage.includes(keyword));
};

// Medical concern detection
export const detectMedicalConcerns = (message: string): boolean => {
  const medicalKeywords = [
    'pain', 'hurt', 'ache', 'doctor', 'hospital', 'emergency', 'ambulance', 'injury', 
    'bleeding', 'wound', 'broken', 'fracture', 'concussion', 'dizzy', 'faint', 
    'fever', 'nausea', 'vomiting', 'chest pain', 'can\'t breathe', 'difficulty breathing',
    'heart attack', 'stroke', 'seizure', 'unconscious'
  ];
  const lowerMessage = message.toLowerCase();
  return medicalKeywords.some(keyword => lowerMessage.includes(keyword));
};

// Mental health concern detection with improved distinction between sadness and depression
export const detectMentalHealthConcerns = (message: string): boolean => {
  // Updated to focus on clinical depression indicators rather than normal sadness
  const mentalHealthKeywords = [
    'bipolar', 'manic', 'mania', 'hypomania', 'schizophrenia', 'hallucination', 'voices',
    'psychosis', 'delusion', 'paranoid', 'racing thoughts', 'not sleeping', 'can\'t sleep',
    'haven\'t slept', 'disoriented', 'confused', 'don\'t know who I am', 'don\'t know where I am',
    'hearing things', 'seeing things'
  ];
  
  // Clinical depression indicators (distinct from normal sadness)
  const clinicalDepressionKeywords = [
    'clinical depression', 'major depressive disorder', 'major depression',
    'depression medication', 'antidepressants', 'diagnosed with depression',
    'treatment resistant depression', 'suicidal thoughts', 'worthless',
    'can\'t feel anything', 'completely numb', 'lost all interest',
    'can\'t get out of bed for weeks', 'stopped eating', 'lost will to live',
    'constant depression', 'depression won\'t go away', 'persistent depression'
  ];
  
  const lowerMessage = message.toLowerCase();
  
  // Check for standard mental health concerns
  const hasStandardConcerns = mentalHealthKeywords.some(keyword => lowerMessage.includes(keyword));
  
  // Check for clinical depression specifically
  const hasClinicalDepression = clinicalDepressionKeywords.some(keyword => lowerMessage.includes(keyword));
  
  // Check for persistent timeframes that might indicate clinical vs. situational
  const persistentTimeframes = [
    'for weeks', 'for months', 'over a month', 'won\'t go away', 
    'can\'t shake it', 'every day', 'constantly', 'always'
  ];
  const hasPersistentTimeframe = persistentTimeframes.some(timeframe => 
    lowerMessage.includes(timeframe) && 
    (lowerMessage.includes('depress') || lowerMessage.includes('sad') || lowerMessage.includes('low'))
  );
  
  // Check for functional impact, a key difference between sadness and depression
  const functionalImpacts = [
    'can\'t work', 'stopped going out', 'missing work', 'failing classes',
    'can\'t concentrate', 'can\'t function', 'can\'t do basic tasks', 
    'stopped showering', 'neglecting myself', 'withdrawing from everyone'
  ];
  const hasFunctionalImpact = functionalImpacts.some(impact => lowerMessage.includes(impact));
  
  return hasStandardConcerns || hasClinicalDepression || 
         (hasPersistentTimeframe && hasFunctionalImpact);
};

// Eating disorder concern detection
export const detectEatingDisorderConcerns = (message: string): boolean => {
  const eatingDisorderKeywords = [
    'anorexia', 'bulimia', 'binge eating', 'purge', 'throwing up food', 'not eating',
    'too fat', 'too thin', 'hate my body', 'overweight', 'underweight', 'starving myself',
    'calories', 'diet', 'weight loss', 'body image', 'eating disorder', 
    'can\'t eat', 'won\'t eat'
  ];
  const lowerMessage = message.toLowerCase();
  return eatingDisorderKeywords.some(keyword => lowerMessage.includes(keyword));
};

/**
 * Enhanced substance use concern detection with severity assessment
 * @param message The user's message
 * @returns Object with detection result and severity level
 */
export const detectSubstanceUseConcerns = (message: string): { detected: boolean; severity?: 'mild' | 'moderate' | 'severe' } => {
  if (!message) return { detected: false };
  
  const lowerMessage = message.toLowerCase();
  
  // Severe substance use keywords that indicate immediate concern
  const severeSubstanceKeywords = [
    'overdose', 'withdrawal', 'relapse', 'addicted', 'addiction', 'can\'t stop',
    'ruining my life', 'lost everything', 'desperate', 'out of control'
  ];
  
  // Moderate substance use keywords that indicate ongoing issues
  const moderateSubstanceKeywords = [
    'using again', 'drink too much', 'getting worse', 'worried about my',
    'problem with', 'dependency', 'dependent on', 'need help with'
  ];

  // Check for severe gambling indicators
  const severeGamblingKeywords = [
    'gambling debt', 'lost everything', 'maxed out', 'borrowed money to gamble', 
    'loan shark', 'can\'t stop gambling', 'gambling problem', 'lost my house',
    'lost my job', 'hiding gambling', 'lying about gambling', 'desperate', 
    'suicidal over gambling', 'gambling addiction'
  ];
  
  // Check for moderate gambling indicators
  const moderateGamblingKeywords = [
    'gamble too much', 'losing more than winning', 'spent rent money',
    'gambling more lately', 'chasing losses', 'spending more time gambling',
    'thinking about gambling constantly', 'gambling to escape', 'feel guilty about gambling'
  ];

  // Basic substance or gambling mentions (lower severity)
  const basicSubstanceKeywords = [
    'alcohol', 'drunk', 'drinking', 'drugs', 'high', 'substance', 
    'heroin', 'cocaine', 'meth', 'opioid', 'sober'
  ];
  
  const basicGamblingKeywords = [
    'gambling', 'betting', 'casino', 'lottery', 'scratch-offs', 'slots',
    'poker', 'blackjack', 'roulette', 'sports betting', 'bet on'
  ];
  
  // Check for financial context that might indicate relative severity
  const hasSevereFinancialLanguage = 
    lowerMessage.includes('debt') || 
    lowerMessage.includes('broke') || 
    lowerMessage.includes('can\'t pay') ||
    lowerMessage.includes('lost everything') ||
    lowerMessage.includes('all my money');
    
  const hasModerateFinancialLanguage =
    lowerMessage.includes('expensive') ||
    lowerMessage.includes('lot of money') ||
    lowerMessage.includes('more than I should') ||
    lowerMessage.includes('spent too much');
    
  const hasMildFinancialLanguage =
    lowerMessage.includes('a little money') ||
    lowerMessage.includes('small bet') ||
    lowerMessage.includes('not much') ||
    lowerMessage.includes('won\'t break me');
    
  // Check for emotional distress indicators to gauge severity
  const hasSevereDistress =
    lowerMessage.includes('desperate') ||
    lowerMessage.includes('hopeless') ||
    lowerMessage.includes('devastated') ||
    lowerMessage.includes('miserable') ||
    lowerMessage.includes('can\'t take it');
    
  const hasModerateDistress =
    lowerMessage.includes('worried') ||
    lowerMessage.includes('stressed') ||
    lowerMessage.includes('anxious') ||
    lowerMessage.includes('regret');
    
  const hasMildDistress =
    lowerMessage.includes('a bit sad') ||
    lowerMessage.includes('a little sad') ||
    lowerMessage.includes('disappointed') ||
    lowerMessage.includes('annoyed');
  
  // Detect severity based on keyword matches and context
  if (severeSubstanceKeywords.some(keyword => lowerMessage.includes(keyword)) ||
      severeGamblingKeywords.some(keyword => lowerMessage.includes(keyword)) ||
      (basicGamblingKeywords.some(keyword => lowerMessage.includes(keyword)) && 
       (hasSevereFinancialLanguage || hasSevereDistress))) {
    return { detected: true, severity: 'severe' };
  }
  
  if (moderateSubstanceKeywords.some(keyword => lowerMessage.includes(keyword)) ||
      moderateGamblingKeywords.some(keyword => lowerMessage.includes(keyword)) ||
      (basicGamblingKeywords.some(keyword => lowerMessage.includes(keyword)) && 
       (hasModerateFinancialLanguage || hasModerateDistress || !hasMildDistress))) {
    return { detected: true, severity: 'moderate' };
  }
  
  // Check for basic substance or gambling mentions with mild or no distress
  if (basicSubstanceKeywords.some(keyword => lowerMessage.includes(keyword)) ||
      basicGamblingKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return { detected: true, severity: 'mild' };
  }
  
  return { detected: false };
};

// PTSD concern detection
export const detectPTSDConcerns = (message: string): { detected: boolean; severity: 'mild' | 'moderate' | 'severe' } => {
  if (!message) return { detected: false, severity: 'mild' };
  
  const lowerMessage = message.toLowerCase();
  
  // Severe PTSD indicators based on PCL-5 and clinical literature
  const severePTSDKeywords = [
    'flashback', 'reliving trauma', 'can\'t sleep at all', 'severe nightmares', 
    'always on guard', 'completely numb', 'extreme anger', 'suicidal thoughts',
    'can\'t function', 'lost control', 'completely avoid', 'completely cut off',
    'constant nightmares', 'constant fear', 'extreme reactions', 'unable to work',
    'cant live like this', 'traumatized', 'can\'t escape the memories'
  ];
  
  // Moderate PTSD indicators
  const moderatePTSDKeywords = [
    'ptsd', 'post traumatic', 'traumatic stress', 'nightmares', 'flashbacks',
    'triggered', 'avoid places', 'avoid people', 'hypervigilant', 'jumpy',
    'trouble sleeping', 'bad dreams', 'memory problems', 'feeling unsafe',
    'combat', 'assault', 'military trauma', 'trauma', 'sexual assault',
    'physically attacked', 'started after'
  ];
  
  // Mild or general trauma indicators
  const mildTraumaKeywords = [
    'bad experience', 'difficult event', 'upsetting memory', 'stressful situation',
    'uncomfortable around', 'bothered by', 'reminded me of', 'thinking about it',
    'hard to forget', 'disturbing'
  ];
  
  // Sleep disturbance indicators (particularly relevant for PTSD)
  const sleepDisturbanceKeywords = [
    'night sweats', 'wake up scared', 'trouble falling asleep', 'wake up frequently',
    'nightmares', 'dream about it', 'can\'t sleep', 'disrupted sleep',
    'insomnia', 'scream in sleep', 'night terror', 'thrash in sleep',
    'act out dreams', 'violent dreams'
  ];
  
  // New: Anxiety comorbidity indicators specific to PTSD vs GAD differentiation
  const anxietyComorbidityKeywords = [
    'worried all the time', 'constant worry', 'excessive worry',
    'generalized anxiety', 'gad', 'worry about everything',
    'can\'t stop worrying', 'anxious thoughts', 'ruminating'
  ];
  
  // Check if anxiety appears to be primary concern (GAD) vs trauma-related
  const hasGeneralAnxietyFocus = anxietyComorbidityKeywords.some(keyword => lowerMessage.includes(keyword)) &&
                               !moderatePTSDKeywords.some(keyword => lowerMessage.includes(keyword));
  
  // If anxiety appears to be primary without trauma indicators, don't classify as PTSD
  if (hasGeneralAnxietyFocus) {
    return { detected: false, severity: 'mild' };
  }
  
  // Check for severity based on quantity and quality of symptoms described
  // If severe PTSD keywords are present or many moderate ones
  if (severePTSDKeywords.some(keyword => lowerMessage.includes(keyword)) ||
      (moderatePTSDKeywords.filter(keyword => lowerMessage.includes(keyword)).length >= 3)) {
    return { detected: true, severity: 'severe' };
  }
  
  // If moderate PTSD keywords are present or combination with sleep disturbances
  if (moderatePTSDKeywords.some(keyword => lowerMessage.includes(keyword)) ||
      (mildTraumaKeywords.some(keyword => lowerMessage.includes(keyword)) && 
       sleepDisturbanceKeywords.some(keyword => lowerMessage.includes(keyword)))) {
    return { detected: true, severity: 'moderate' };
  }
  
  // If only mild trauma indicators are present
  if (mildTraumaKeywords.some(keyword => lowerMessage.includes(keyword)) ||
      sleepDisturbanceKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return { detected: true, severity: 'mild' };
  }
  
  return { detected: false, severity: 'mild' };
};

// Tentative harmful language detection
export const detectTentativeHarmLanguage = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();
  
  // Detect tentative language combined with harmful content
  const tentativeMarkers = [
    'maybe', 'perhaps', 'i think', 'possibly', 'might', 'could', 
    'i guess', 'not sure if', 'potentially', 'sort of', 
    'kind of', 'thinking about', 'considering', 
    'wondering if', 'what if', 'probably', 
    'weighing', 'contemplating'
  ];
  
  const harmfulActions = [
    'hurt', 'harm', 'kill', 'shoot', 'stab', 'attack', 
    'gun', 'weapon', 'knife', 'violence', 'violent', 
    'hit', 'beat', 'suicide', 'self-harm', 'die', 'dying',
    'end my life', 'take my life', 'take their life',
    'murder', 'bomb', 'explode', 'strangle', 'assault',
    'molest', 'abuse', 'rape'
  ];
  
  // Check for phrases that combine tentative language with harmful actions
  for (const tentative of tentativeMarkers) {
    for (const harmful of harmfulActions) {
      // Look for phrases within 10 words of each other
      const pattern = new RegExp(`${tentative}[^.!?]{0,80}${harmful}|${harmful}[^.!?]{0,80}${tentative}`, 'i');
      if (pattern.test(lowerMessage)) {
        return true;
      }
    }
  }
  
  // Also check for specific patterns of tentative harmful language
  const tentativeHarmPhrases = [
    'not sure if i should hurt', 
    'thinking about hurting', 
    'might harm', 
    'could kill', 
    'wondering if i should end',
    'what if i hurt',
    'maybe i will get a gun',
    'i think there is potential',
    'not sure if i will',
    'or maybe i won\'t',
    'haven\'t decided',
    'still deciding',
    'might do something bad',
    'could do something harmful'
  ];
  
  return tentativeHarmPhrases.some(phrase => lowerMessage.includes(phrase));
};

/**
 * Distinguishes between normal sadness and clinical depression
 * @param message The user's message
 * @returns Object with detection results and context
 */
export const distinguishSadnessFromDepression = (message: string): {
  isSadness: boolean;
  isDepression: boolean;
  context: string;
} => {
  if (!message) return { isSadness: false, isDepression: false, context: '' };
  
  const lowerMessage = message.toLowerCase();
  
  // Normal sadness indicators (situational, temporary)
  const sadnessKeywords = [
    'feeling sad', 'feeling low', 'feeling down', 'feeling blue', 
    'disappointed', 'upset', 'lost', 'grieving', 'miss', 'heartbroken'
  ];
  
  // Clinical depression indicators
  const depressionKeywords = [
    'clinical depression', 'major depression', 'persistent depression',
    'diagnosed with depression', 'on medication for depression',
    'treatment resistant', 'tried multiple medications',
    'seeing a psychiatrist', 'depression treatment'
  ];
  
  // Context factors that help distinguish
  const situationalContext = [
    'because', 'after', 'since', 'when', 'broke up', 
    'lost my', 'died', 'passed away', 'failing', 'fired',
    'argument', 'fight', 'broke up'
  ];
  
  // Timeframe indicators
  const temporaryTimeframes = [
    'today', 'yesterday', 'this week', 'lately', 
    'since', 'after', 'recently'
  ];
  
  const persistentTimeframes = [
    'always', 'constantly', 'for months', 'for years',
    'never ends', 'won\'t go away', 'every day'
  ];
  
  // Functional impact indicators
  const functionalImpacts = [
    'can\'t get out of bed', 'stopped showering', 'missed work',
    'can\'t focus', 'can\'t concentrate', 'can\'t function',
    'lost interest', 'don\'t enjoy', 'no pleasure'
  ];
  
  // Calculate indicators
  const hasSadnessKeywords = sadnessKeywords.some(word => lowerMessage.includes(word));
  const hasDepressionKeywords = depressionKeywords.some(word => lowerMessage.includes(word));
  const hasSituationalContext = situationalContext.some(word => lowerMessage.includes(word));
  const hasTemporaryTimeframe = temporaryTimeframes.some(word => lowerMessage.includes(word));
  const hasPersistentTimeframe = persistentTimeframes.some(word => lowerMessage.includes(word));
  const hasFunctionalImpacts = functionalImpacts.some(word => lowerMessage.includes(word));
  
  // Determine if this is likely sadness vs depression
  const likelySadness = hasSadnessKeywords && 
                        (hasSituationalContext || hasTemporaryTimeframe) && 
                        !hasFunctionalImpacts && 
                        !hasPersistentTimeframe;
                        
  const likelyDepression = (hasDepressionKeywords || 
                          (hasSadnessKeywords && hasPersistentTimeframe && hasFunctionalImpacts));
  
  // Extract context
  let context = '';
  if (likelySadness) {
    context = 'situational';
    // Look for specific triggers
    if (lowerMessage.includes('loss') || lowerMessage.includes('lost') || 
        lowerMessage.includes('passed away') || lowerMessage.includes('died')) {
      context = 'grief';
    } else if (lowerMessage.includes('breakup') || lowerMessage.includes('broke up') ||
               lowerMessage.includes('left me') || lowerMessage.includes('relationship')) {
      context = 'relationship';
    } else if (lowerMessage.includes('job') || lowerMessage.includes('work') || 
               lowerMessage.includes('fired') || lowerMessage.includes('laid off')) {
      context = 'work';
    }
  } else if (likelyDepression) {
    context = 'clinical';
    if (hasFunctionalImpacts) {
      context += '-functional-impact';
    }
    if (hasPersistentTimeframe) {
      context += '-persistent';
    }
  }
  
  return {
    isSadness: likelySadness,
    isDepression: likelyDepression,
    context
  };
};
