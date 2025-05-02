
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

// Mental health concern detection
export const detectMentalHealthConcerns = (message: string): boolean => {
  const mentalHealthKeywords = [
    'bipolar', 'manic', 'mania', 'hypomania', 'schizophrenia', 'hallucination', 'voices',
    'psychosis', 'delusion', 'paranoid', 'racing thoughts', 'not sleeping', 'can\'t sleep',
    'haven\'t slept', 'disoriented', 'confused', 'don\'t know who I am', 'don\'t know where I am',
    'hearing things', 'seeing things'
  ];
  const lowerMessage = message.toLowerCase();
  return mentalHealthKeywords.some(keyword => lowerMessage.includes(keyword));
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

// Substance use concern detection
export const detectSubstanceUseConcerns = (message: string): boolean => {
  const substanceUseKeywords = [
    'alcohol', 'drunk', 'drinking', 'drugs', 'high', 'addiction', 'substance', 
    'heroin', 'cocaine', 'meth', 'opioid', 'overdose', 'withdrawal', 'relapse',
    'sober', 'gambling', 'betting', 'casino', 'lottery', 'scratch-offs'
  ];
  const lowerMessage = message.toLowerCase();
  return substanceUseKeywords.some(keyword => lowerMessage.includes(keyword));
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
