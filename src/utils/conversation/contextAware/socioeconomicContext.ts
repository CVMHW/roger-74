
/**
 * Helper functions for detecting and responding to socioeconomic context clues
 */

export interface SocioeconomicIndicators {
  likelihood: 'low' | 'medium' | 'high';
  occupationType?: 'blue-collar' | 'white-collar' | 'service' | 'unknown';
  educationLevel?: 'basic' | 'technical' | 'higher-education' | 'unknown';
  languageStyle?: 'casual' | 'formal' | 'technical' | 'colloquial';
}

/**
 * Detect socioeconomic indicators from language patterns
 */
export const detectSocioeconomicIndicators = (userInput: string, conversationHistory: string[]): SocioeconomicIndicators => {
  const lowerInput = userInput.toLowerCase();
  const combinedText = [userInput, ...conversationHistory.slice(-3)].join(' ').toLowerCase();
  
  // Blue collar occupation indicators
  const blueCollarTerms = /\b(construction|factory|warehouse|labor|laborer|manual|tool|tools|machine|machinery|foreman|shift|plant|site|ppe|safety gear|helmet|boots|trade|craft|contractor|operator|driver|mechanic|technician|maintenance)\b/i;
  
  // White collar occupation indicators
  const whiteCollarTerms = /\b(office|desk|computer|meeting|presentation|client|report|manager|executive|supervisor|ceo|cfo|director|board|project|deadline|budget|analyst|consultant|marketing|finance|accounting|sales)\b/i;
  
  // Service industry indicators
  const serviceTerms = /\b(customer|retail|store|shop|register|cashier|manager|shift|schedule|table|server|waiter|waitress|tip|tips|kitchen|restaurant|bar|hotel|guest|patient|client)\b/i;
  
  // Education level indicators
  const basicEducationTerms = /\b(didn'?t finish|dropped out|GED|high school|trade school)\b/i;
  const technicalEducationTerms = /\b(certification|certificate|license|qualified|trained|apprentice|journeyman)\b/i;
  const higherEducationTerms = /\b(college|university|degree|bachelor'?s|master'?s|phd|major|student loan|professor|campus|thesis|research)\b/i;
  
  // Casual language patterns
  const casualLanguage = /\b(ya know|ya no|ain'?t|dunno|gonna|wanna|gotta|idk|tbh|lol|like,|u|ur|r u|nah|yep|cool|dude|bro|man)\b/i;
  const colloquialPattern = /\b(ain'?t|y'?all|fixin'? to|reckon|folks|yonder|whatcha|gimme|lemme|wanna|gonna|gotta|oughta|kinda|sorta)\b/i;
  const informalSentenceStructure = /^\s*[^A-Z]|[.?!]\s+[^A-Z]|[^\.\?\!]\s*$/;
  const abbreviatedWords = /\b(nite|thru|tho|cuz|prolly|def|probs|kinda|sorta)\b/i;
  
  // Analyze language patterns
  const usesBlueCollarTerms = blueCollarTerms.test(combinedText);
  const usesWhiteCollarTerms = whiteCollarTerms.test(combinedText);
  const usesServiceTerms = serviceTerms.test(combinedText);
  const usesCasualLanguage = casualLanguage.test(lowerInput) || informalSentenceStructure.test(userInput) || abbreviatedWords.test(lowerInput);
  const usesColloquialLanguage = colloquialPattern.test(lowerInput);
  
  // Determine occupation type
  let occupationType: 'blue-collar' | 'white-collar' | 'service' | 'unknown' = 'unknown';
  if (usesBlueCollarTerms && !usesWhiteCollarTerms) {
    occupationType = 'blue-collar';
  } else if (usesWhiteCollarTerms && !usesBlueCollarTerms) {
    occupationType = 'white-collar';
  } else if (usesServiceTerms) {
    occupationType = 'service';
  }
  
  // Determine education level
  let educationLevel: 'basic' | 'technical' | 'higher-education' | 'unknown' = 'unknown';
  if (higherEducationTerms.test(combinedText)) {
    educationLevel = 'higher-education';
  } else if (technicalEducationTerms.test(combinedText)) {
    educationLevel = 'technical';
  } else if (basicEducationTerms.test(combinedText)) {
    educationLevel = 'basic';
  }
  
  // Determine language style
  let languageStyle: 'casual' | 'formal' | 'technical' | 'colloquial' = 'formal';
  if (usesColloquialLanguage) {
    languageStyle = 'colloquial';
  } else if (usesCasualLanguage) {
    languageStyle = 'casual';
  }
  
  // Determine likelihood of blue-collar socioeconomic background
  let likelihood: 'low' | 'medium' | 'high' = 'low';
  
  // Blue collar indicators
  if ((occupationType === 'blue-collar' || occupationType === 'service') && 
      (languageStyle === 'casual' || languageStyle === 'colloquial')) {
    likelihood = 'high';
  } else if (occupationType === 'blue-collar' || languageStyle === 'colloquial') {
    likelihood = 'medium';
  }
  
  return {
    likelihood,
    occupationType,
    educationLevel,
    languageStyle
  };
};

/**
 * Generate appropriate language style based on detected socioeconomic context
 */
export const adaptLanguageStyle = (
  baseResponse: string,
  indicators: SocioeconomicIndicators
): string => {
  // If we have high confidence in socioeconomic indicators, adapt language
  if (indicators.likelihood === 'high' || 
      (indicators.likelihood === 'medium' && indicators.languageStyle === 'colloquial')) {
    
    // For blue-collar workers using colloquial language
    if ((indicators.occupationType === 'blue-collar' || indicators.occupationType === 'service') && 
        indicators.languageStyle === 'colloquial') {
      return adaptToColloquialStyle(baseResponse);
    }
    
    // For casual language users
    if (indicators.languageStyle === 'casual') {
      return adaptToCasualStyle(baseResponse);
    }
  }
  
  // Default case - return original response
  return baseResponse;
};

/**
 * Helper function to adapt formal language to more colloquial style
 */
const adaptToColloquialStyle = (text: string): string => {
  let adapted = text;
  
  // Replace formal phrases with more colloquial ones
  adapted = adapted
    .replace(/I understand/g, "I hear ya")
    .replace(/I would like to/g, "I'd like to")
    .replace(/you are/g, "you're")
    .replace(/What has been/g, "What's been")
    .replace(/What is/g, "What's")
    .replace(/it is/g, "it's")
    .replace(/That is/g, "That's")
    .replace(/I am/g, "I'm")
    .replace(/Could you/g, "Can you")
    .replace(/Would you/g, "Would ya")
    .replace(/going to/g, "gonna")
    .replace(/want to/g, "wanna")
    .replace(/got to/g, "gotta")
    .replace(/mind\?$/g, "mind?")
    .replace(/explore together\?/g, "talk about?");
  
  return adapted;
};

/**
 * Helper function to adapt formal language to more casual style
 */
const adaptToCasualStyle = (text: string): string => {
  let adapted = text;
  
  // Replace formal phrases with more casual ones
  adapted = adapted
    .replace(/I understand/g, "I get that")
    .replace(/I would like to/g, "I'd like to")
    .replace(/What has been/g, "What's been")
    .replace(/most significant/g, "most important")
    .replace(/What aspect of this would be most helpful to explore together\?/g, "What would help most to talk about?");
  
  return adapted;
};
