
/**
 * Context Detection for Logotherapy
 * 
 * Detects cultural and age-appropriate contexts to enhance
 * the relevance and effectiveness of logotherapy responses
 */

/**
 * Detect cultural context from user input
 * @returns 'collectivist', 'individualist', 'spiritual', or undefined
 */
export const getCulturalContext = (userInput: string): string | undefined => {
  const lowerInput = userInput.toLowerCase();
  
  // Indicators of collectivist cultural context
  const collectivistIndicators = [
    'family', 'community', 'tradition', 'duty', 'honor', 
    'respect', 'ancestors', 'harmony', 'group', 'together',
    'parents', 'elders', 'heritage', 'responsibility to others'
  ];
  
  // Indicators of individualist cultural context
  const individualistIndicators = [
    'individual', 'personal', 'self', 'independence', 'choice',
    'freedom', 'my own', 'myself', 'autonomy', 'unique',
    'achievement', 'success', 'ambition', 'career', 'my goals'
  ];
  
  // Indicators of spiritual cultural context
  const spiritualIndicators = [
    'faith', 'god', 'spirit', 'divine', 'religious', 'church',
    'belief', 'prayer', 'meditation', 'sacred', 'spiritual',
    'temple', 'mosque', 'worship', 'soul', 'higher power'
  ];
  
  // Count indicators for each context
  let collectivistScore = 0;
  let individualistScore = 0;
  let spiritualScore = 0;
  
  // Check for collectivist indicators
  collectivistIndicators.forEach(indicator => {
    if (lowerInput.includes(indicator)) {
      collectivistScore++;
    }
  });
  
  // Check for individualist indicators
  individualistIndicators.forEach(indicator => {
    if (lowerInput.includes(indicator)) {
      individualistScore++;
    }
  });
  
  // Check for spiritual indicators
  spiritualIndicators.forEach(indicator => {
    if (lowerInput.includes(indicator)) {
      spiritualScore++;
    }
  });
  
  // Determine predominant cultural context
  const maxScore = Math.max(collectivistScore, individualistScore, spiritualScore);
  
  if (maxScore === 0) {
    return undefined; // No clear cultural indicators
  }
  
  if (maxScore === collectivistScore) {
    return 'collectivist';
  } else if (maxScore === individualistScore) {
    return 'individualist';
  } else {
    return 'spiritual';
  }
};

/**
 * Detect age-appropriate context from user input
 * @returns 'youth', 'teen', 'adult', 'elder', or undefined
 */
export const getAgeAppropriateContext = (userInput: string): string | undefined => {
  const lowerInput = userInput.toLowerCase();
  
  // Indicators of youth context (children)
  const youthIndicators = [
    'school', 'homework', 'teacher', 'parents', 'mom', 'dad',
    'play', 'game', 'toys', 'playground', 'cartoon', 'child',
    'kids', 'elementary', 'bedtime', 'playdate', 'grades'
  ];
  
  // Indicators of teen context (adolescents)
  const teenIndicators = [
    'high school', 'college', 'university', 'friends', 'social media',
    'dating', 'relationship', 'grades', 'future', 'career', 'parents',
    'teen', 'adolescent', 'identity', 'peers', 'fitting in'
  ];
  
  // Indicators of adult context
  const adultIndicators = [
    'work', 'career', 'job', 'mortgage', 'marriage', 'children',
    'parenting', 'bills', 'responsibility', 'promotion', 'manager',
    'balance', 'professional', 'mortgage', 'partner', 'spouse'
  ];
  
  // Indicators of elder context
  const elderIndicators = [
    'retirement', 'grandchildren', 'aging', 'health', 'memory',
    'legacy', 'wisdom', 'social security', 'medicare', 'elderly',
    'senior', 'generation', 'lifetime', 'life story', 'experience'
  ];
  
  // Count indicators for each context
  let youthScore = 0;
  let teenScore = 0;
  let adultScore = 0;
  let elderScore = 0;
  
  // Check for youth indicators
  youthIndicators.forEach(indicator => {
    if (lowerInput.includes(indicator)) {
      youthScore++;
    }
  });
  
  // Check for teen indicators
  teenIndicators.forEach(indicator => {
    if (lowerInput.includes(indicator)) {
      teenScore++;
    }
  });
  
  // Check for adult indicators
  adultIndicators.forEach(indicator => {
    if (lowerInput.includes(indicator)) {
      adultScore++;
    }
  });
  
  // Check for elder indicators
  elderIndicators.forEach(indicator => {
    if (lowerInput.includes(indicator)) {
      elderScore++;
    }
  });
  
  // Determine predominant age context
  const maxScore = Math.max(youthScore, teenScore, adultScore, elderScore);
  
  if (maxScore === 0) {
    return undefined; // No clear age indicators
  }
  
  if (maxScore === youthScore) {
    return 'youth';
  } else if (maxScore === teenScore) {
    return 'teen';
  } else if (maxScore === adultScore) {
    return 'adult';
  } else {
    return 'elder';
  }
};

/**
 * Get a culturally appropriate response variation
 */
export const getCulturallyAppropriateVariation = (
  baseResponses: string[],
  userInput: string
): string => {
  const culturalContext = getCulturalContext(userInput);
  const ageContext = getAgeAppropriateContext(userInput);
  
  // If no specific context is detected, return a random base response
  if (!culturalContext && !ageContext) {
    return baseResponses[Math.floor(Math.random() * baseResponses.length)];
  }
  
  // Adjust language based on cultural context
  let adjustedResponses = [...baseResponses];
  
  if (culturalContext === 'collectivist') {
    // Make responses more family/community oriented
    adjustedResponses = adjustedResponses.map(response => 
      response
        .replace(/you/g, 'you and your loved ones')
        .replace(/your purpose/g, 'your role in your family and community')
        .replace(/individual/g, 'person within your community')
    );
  } else if (culturalContext === 'spiritual') {
    // Make responses more spiritually oriented
    adjustedResponses = adjustedResponses.map(response => 
      response
        .replace(/purpose/g, 'purpose or calling')
        .replace(/meaning/g, 'meaning or spiritual significance')
        .replace(/values/g, 'values and beliefs')
    );
  }
  
  // Adjust language based on age context
  if (ageContext === 'youth') {
    // Simplify language for younger users
    adjustedResponses = adjustedResponses.map(response => 
      response
        .replace(/meaning/g, 'what matters')
        .replace(/purpose/g, 'special role')
        .replace(/contribute/g, 'help others')
        .replace(/transcend/g, 'go beyond')
    );
  } else if (ageContext === 'elder') {
    // Focus on legacy and wisdom for older users
    adjustedResponses = adjustedResponses.map(response => 
      response
        .replace(/discover/g, 'reflect on')
        .replace(/finding/g, 'sharing')
        .replace(/future/g, 'legacy')
        .replace(/create/g, 'pass on')
    );
  }
  
  return adjustedResponses[Math.floor(Math.random() * adjustedResponses.length)];
};
