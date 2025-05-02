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
  
  // PCL5-based symptom clusters
  const intrusionSymptoms = [
    'flashback', 'nightmare', 'dream about', 'keeps coming back', 'intrusive',
    'memories of', 'reminded of', 'triggered', 'reliving'
  ];
  
  const avoidanceSymptoms = [
    'avoid', 'stay away from', 'can\'t talk about', 'don\'t want to remember',
    'trying not to think about', 'refuse to', 'won\'t go near', 'can\'t face'
  ];
  
  const negativeAlterations = [
    'can\'t feel anything', 'numb', 'disconnected', 'detached', 'the world isn\'t real',
    'blame myself', 'no one can understand', 'can\'t trust anyone', 'always on guard',
    'never safe', 'permanently damaged', 'never be the same'
  ];
  
  const arousalSymptoms = [
    'hypervigilant', 'jumpy', 'startle easily', 'can\'t sleep', 'nightmares',
    'on edge', 'irritable', 'angry outbursts', 'self-destructive', 'can\'t concentrate',
    'can\'t focus', 'always watching', 'checking for danger'
  ];
  
  // Specific trauma types mentioned
  const traumas = [
    'trauma', 'ptsd', 'assault', 'attack', 'accident', 'combat', 'war', 'disaster',
    'shooting', 'violent', 'abuse', 'neglect', 'witness', 'threatened', 
    'sexual assault', 'rape', 'military', 'veteran'
  ];
  
  // 4F responses (from Walker's model)
  const fight4F = [
    'rage', 'anger issues', 'can\'t control anger', 'lash out', 'explode',
    'yell at people', 'always fighting', 'conflict', 'aggressive'
  ];
  
  const flight4F = [
    'can\'t sit still', 'always busy', 'workaholic', 'can\'t relax', 'anxious',
    'panic', 'obsessing', 'overthinking', 'planning escape routes'
  ];
  
  const freeze4F = [
    'freeze up', 'shut down', 'dissociate', 'space out', 'numb out',
    'can\'t move', 'paralyzed', 'blank mind', 'brain fog', 'hiding'
  ];
  
  const fawn4F = [
    'people pleaser', 'can\'t say no', 'always apologizing', 'caretaking',
    'put others first', 'fear rejection', 'codependent', 'need approval'
  ];
  
  // Check for matches in each category
  const intrusions = intrusionSymptoms.filter(symptom => lowerMessage.includes(symptom)).length;
  const avoidances = avoidanceSymptoms.filter(symptom => lowerMessage.includes(symptom)).length;
  const negatives = negativeAlterations.filter(symptom => lowerMessage.includes(symptom)).length;
  const arousal = arousalSymptoms.filter(symptom => lowerMessage.includes(symptom)).length;
  const traumaTypes = traumas.filter(trauma => lowerMessage.includes(trauma)).length;
  
  // Check for 4F patterns
  const fightPatterns = fight4F.filter(pattern => lowerMessage.includes(pattern)).length;
  const flightPatterns = flight4F.filter(pattern => lowerMessage.includes(pattern)).length;
  const freezePatterns = freeze4F.filter(pattern => lowerMessage.includes(pattern)).length;
  const fawnPatterns = fawn4F.filter(pattern => lowerMessage.includes(pattern)).length;
  
  // Total up the scores
  const symptomScore = intrusions + avoidances + negatives + arousal;
  const traumaMentioned = traumaTypes > 0;
  const fourFScore = fightPatterns + flightPatterns + freezePatterns + fawnPatterns;
  
  // Determine if PTSD is likely present and at what severity
  let detected = false;
  let severity: 'mild' | 'moderate' | 'severe' = 'mild';
  
  // PCL5-based detection criteria
  if ((symptomScore >= 4 && traumaMentioned) || (symptomScore >= 6)) {
    detected = true;
    
    if (symptomScore >= 10 || (symptomScore >= 6 && traumaMentioned)) {
      severity = 'severe';
    } else if (symptomScore >= 6 || (symptomScore >= 4 && traumaMentioned)) {
      severity = 'moderate';
    }
  }
  // 4F model detection criteria
  else if (fourFScore >= 3) {
    detected = true;
    
    if (fourFScore >= 6 || (fourFScore >= 4 && traumaMentioned)) {
      severity = 'moderate';
    } else {
      severity = 'mild';
    }
  }
  // Lower threshold with explicit trauma mention
  else if (traumaMentioned && symptomScore >= 2) {
    detected = true;
    severity = 'mild';
  }
  // Check for PTSD explicit mention
  else if (lowerMessage.includes('ptsd') || lowerMessage.includes('post traumatic') || lowerMessage.includes('post-traumatic')) {
    detected = true;
    severity = 'mild';
  }
  
  return { detected, severity };
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

/**
 * Enhanced PTSD detection using PCL5 criteria and 4F trauma model
 * @param text User input to analyze
 * @returns Object with detection result and severity
 */
export function detectPTSDConcerns(text: string): { detected: boolean; severity: 'mild' | 'moderate' | 'severe' } {
  if (!text) return { detected: false, severity: 'mild' };
  
  const lowerText = text.toLowerCase();
  
  // PCL5-based symptom clusters
  const intrusionSymptoms = [
    'flashback', 'nightmare', 'dream about', 'keeps coming back', 'intrusive',
    'memories of', 'reminded of', 'triggered', 'reliving'
  ];
  
  const avoidanceSymptoms = [
    'avoid', 'stay away from', 'can\'t talk about', 'don\'t want to remember',
    'trying not to think about', 'refuse to', 'won\'t go near', 'can\'t face'
  ];
  
  const negativeAlterations = [
    'can\'t feel anything', 'numb', 'disconnected', 'detached', 'the world isn\'t real',
    'blame myself', 'no one can understand', 'can\'t trust anyone', 'always on guard',
    'never safe', 'permanently damaged', 'never be the same'
  ];
  
  const arousalSymptoms = [
    'hypervigilant', 'jumpy', 'startle easily', 'can\'t sleep', 'nightmares',
    'on edge', 'irritable', 'angry outbursts', 'self-destructive', 'can\'t concentrate',
    'can\'t focus', 'always watching', 'checking for danger'
  ];
  
  // Specific trauma types mentioned
  const traumas = [
    'trauma', 'ptsd', 'assault', 'attack', 'accident', 'combat', 'war', 'disaster',
    'shooting', 'violent', 'abuse', 'neglect', 'witness', 'threatened', 
    'sexual assault', 'rape', 'military', 'veteran'
  ];
  
  // 4F responses (from Walker's model)
  const fight4F = [
    'rage', 'anger issues', 'can\'t control anger', 'lash out', 'explode',
    'yell at people', 'always fighting', 'conflict', 'aggressive'
  ];
  
  const flight4F = [
    'can\'t sit still', 'always busy', 'workaholic', 'can\'t relax', 'anxious',
    'panic', 'obsessing', 'overthinking', 'planning escape routes'
  ];
  
  const freeze4F = [
    'freeze up', 'shut down', 'dissociate', 'space out', 'numb out',
    'can\'t move', 'paralyzed', 'blank mind', 'brain fog', 'hiding'
  ];
  
  const fawn4F = [
    'people pleaser', 'can\'t say no', 'always apologizing', 'caretaking',
    'put others first', 'fear rejection', 'codependent', 'need approval'
  ];
  
  // Check for matches in each category
  const intrusions = intrusionSymptoms.filter(symptom => lowerText.includes(symptom)).length;
  const avoidances = avoidanceSymptoms.filter(symptom => lowerText.includes(symptom)).length;
  const negatives = negativeAlterations.filter(symptom => lowerText.includes(symptom)).length;
  const arousal = arousalSymptoms.filter(symptom => lowerText.includes(symptom)).length;
  const traumaTypes = traumas.filter(trauma => lowerText.includes(trauma)).length;
  
  // Check for 4F patterns
  const fightPatterns = fight4F.filter(pattern => lowerText.includes(pattern)).length;
  const flightPatterns = flight4F.filter(pattern => lowerText.includes(pattern)).length;
  const freezePatterns = freeze4F.filter(pattern => lowerText.includes(pattern)).length;
  const fawnPatterns = fawn4F.filter(pattern => lowerText.includes(pattern)).length;
  
  // Total up the scores
  const symptomScore = intrusions + avoidances + negatives + arousal;
  const traumaMentioned = traumaTypes > 0;
  const fourFScore = fightPatterns + flightPatterns + freezePatterns + fawnPatterns;
  
  // Determine if PTSD is likely present and at what severity
  let detected = false;
  let severity: 'mild' | 'moderate' | 'severe' = 'mild';
  
  // PCL5-based detection criteria
  if ((symptomScore >= 4 && traumaMentioned) || (symptomScore >= 6)) {
    detected = true;
    
    if (symptomScore >= 10 || (symptomScore >= 6 && traumaMentioned)) {
      severity = 'severe';
    } else if (symptomScore >= 6 || (symptomScore >= 4 && traumaMentioned)) {
      severity = 'moderate';
    }
  }
  // 4F model detection criteria
  else if (fourFScore >= 3) {
    detected = true;
    
    if (fourFScore >= 6 || (fourFScore >= 4 && traumaMentioned)) {
      severity = 'moderate';
    } else {
      severity = 'mild';
    }
  }
  // Lower threshold with explicit trauma mention
  else if (traumaMentioned && symptomScore >= 2) {
    detected = true;
    severity = 'mild';
  }
  // Check for PTSD explicit mention
  else if (lowerText.includes('ptsd') || lowerText.includes('post traumatic') || lowerText.includes('post-traumatic')) {
    detected = true;
    severity = 'mild';
  }
  
  return { detected, severity };
}

/**
 * Generate a mild PTSD response that's trauma-informed but not clinical
 * Based on 4F model and polyvagal theory
 */
export function getMildPTSDResponse(userInput: string): string {
  // Import trauma response patterns module
  let traumaResponseModule;
  try {
    traumaResponseModule = require('./response/traumaResponsePatterns');
  } catch (e) {
    console.log("Trauma response module not available yet");
    // Fallback response if module not loaded
    return "I notice you're describing some challenging experiences that might be related to past difficult events. It's common for our bodies and minds to develop protective responses to help us cope. Would you like to talk more about what you're experiencing, or perhaps explore some ways that others have found helpful in similar situations?";
  }
  
  // If module is available, use it for advanced analysis
  if (traumaResponseModule && traumaResponseModule.detectTraumaResponsePatterns) {
    const analysis = traumaResponseModule.detectTraumaResponsePatterns(userInput);
    
    if (analysis) {
      return traumaResponseModule.generateTraumaInformedResponse(analysis);
    }
  }
  
  // Default responses based on common themes if detailed analysis not available
  const lowerInput = userInput.toLowerCase();
  
  // Check for hyperarousal symptoms
  if (lowerInput.includes('jumpy') || 
      lowerInput.includes('startle') || 
      lowerInput.includes('alert') || 
      lowerInput.includes('vigilant') ||
      lowerInput.includes('on guard')) {
    return "I notice you're describing feeling on high alert or easily startled. This is often our body's way of trying to keep us safe after difficult experiences. Many people find that grounding techniques and slowly building a sense of safety can help. Would you like to explore what might help your nervous system feel more at ease?";
  }
  
  // Check for avoidance
  if (lowerInput.includes('avoid') || 
      lowerInput.includes('can\'t go') || 
      lowerInput.includes('stay away') || 
      lowerInput.includes('scared to')) {
    return "I hear that there are situations or memories that feel too difficult to approach right now. Avoidance is a natural protective response. Many people find that gradually approaching difficult situations with support can be helpful, but only when you feel ready. What do you think might be a small step that would feel manageable?";
  }
  
  // Check for intrusive thoughts/memories
  if (lowerInput.includes('flashback') || 
      lowerInput.includes('memory') || 
      lowerInput.includes('keeps coming back') || 
      lowerInput.includes('triggered')) {
    return "It sounds like you're experiencing memories or feelings that keep returning, which can be really challenging. This is a common response to significant stress or difficult experiences. Many people find that grounding in the present moment can help remind your brain and body that you're safe now. Would you like to talk about what might help when these experiences arise?";
  }
  
  // Check for numbing/disconnection
  if (lowerInput.includes('numb') || 
      lowerText.includes('disconnected') || 
      lowerText.includes('don\'t feel anything') || 
      lowerText.includes('spaced out')) {
    return "I notice you're describing feeling disconnected or numb, which is often the mind's way of protecting us when emotions feel too intense. This is a common response to overwhelming experiences. Many people find that gentle sensory activities can help reconnect with the present moment. What helps you feel more present and connected?";
  }
  
  // General trauma-informed response
  return "I hear you describing some challenging reactions that can follow difficult life experiences. Our bodies and minds develop these responses to try to protect us, though sometimes they continue even when the danger has passed. Would it be helpful to explore some approaches that others have found supportive in similar situations?";
}
