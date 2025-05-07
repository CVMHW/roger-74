
/**
 * Specialized Topic Detection and Processing
 * 
 * Handles detection and enhanced processing for specialized clinical topics:
 * - Eating disorders
 * - Gambling addiction
 * - Substance abuse
 * - Crisis situations
 * - Logotherapy needs
 */

/**
 * Specialized topic detection result
 */
export interface TopicDetectionResult {
  topicDetected: boolean;
  topicType: 'eating_disorder' | 'gambling' | 'substance_abuse' | 'crisis' | 'meaning_focused' | 'general';
  confidenceScore: number;
  requiresSpecializedProcessing: boolean;
}

/**
 * Specialized concern detection patterns
 */
const topicPatterns = {
  eatingDisorder: [
    /eating habits|body image|weight concerns|food restriction|purging|bingeing/i,
    /anorexia|bulimia|binge eating|eating disorder/i,
    /calories|dieting|weight loss|food control/i
  ],
  gambling: [
    /gambling|betting|casino|slots|lottery|odds|wagering/i,
    /winning money|losing money|gambling debt|betting addiction/i,
    /gambling urges|sports betting|online gambling/i
  ],
  substanceAbuse: [
    /drinking|alcohol|drugs|substances|using|high|intoxicated/i,
    /recovery|sobriety|relapse|addiction|dependence|withdrawal/i,
    /cocaine|heroin|opioids|marijuana|weed|pills/i
  ],
  crisis: [
    /emergency|crisis|urgent help|immediate danger|critical situation/i,
    /suicidal|suicide|kill myself|end my life|don't want to live/i,
    /harm myself|hurt someone|violent thoughts|emergency situation/i
  ],
  meaningFocused: [
    /meaning|purpose|values|emptiness|meaningless|worthwhile/i,
    /existential|spiritual|life purpose|fulfillment|direction/i,
    /what matters|why am I here|reason to live|greater purpose/i
  ]
};

/**
 * Detect specialized topics that require careful handling
 */
export function detectSpecializedTopic(
  userInput: string
): TopicDetectionResult {
  // Initialize with general topic type
  const result: TopicDetectionResult = {
    topicDetected: false,
    topicType: 'general',
    confidenceScore: 0,
    requiresSpecializedProcessing: false
  };
  
  // Check for eating disorders
  if (topicPatterns.eatingDisorder.some(pattern => pattern.test(userInput))) {
    result.topicDetected = true;
    result.topicType = 'eating_disorder';
    result.confidenceScore = calculateConfidence(userInput, topicPatterns.eatingDisorder);
  }
  // Check for gambling
  else if (topicPatterns.gambling.some(pattern => pattern.test(userInput))) {
    result.topicDetected = true;
    result.topicType = 'gambling';
    result.confidenceScore = calculateConfidence(userInput, topicPatterns.gambling);
  }
  // Check for substance abuse
  else if (topicPatterns.substanceAbuse.some(pattern => pattern.test(userInput))) {
    result.topicDetected = true;
    result.topicType = 'substance_abuse';
    result.confidenceScore = calculateConfidence(userInput, topicPatterns.substanceAbuse);
  }
  // Check for crisis
  else if (topicPatterns.crisis.some(pattern => pattern.test(userInput))) {
    result.topicDetected = true;
    result.topicType = 'crisis';
    result.confidenceScore = calculateConfidence(userInput, topicPatterns.crisis);
    result.requiresSpecializedProcessing = true; // Always require special processing for crisis
  }
  // Check for meaning-focused concerns
  else if (topicPatterns.meaningFocused.some(pattern => pattern.test(userInput))) {
    result.topicDetected = true;
    result.topicType = 'meaning_focused';
    result.confidenceScore = calculateConfidence(userInput, topicPatterns.meaningFocused);
  }
  
  // Determine if specialized processing required
  if (result.topicDetected && result.confidenceScore > 0.5) {
    result.requiresSpecializedProcessing = true;
  }
  
  return result;
}

/**
 * Calculate confidence score for topic detection
 */
function calculateConfidence(
  userInput: string,
  patterns: RegExp[]
): number {
  // Count how many patterns match
  const matchCount = patterns.filter(pattern => pattern.test(userInput)).length;
  
  // Base confidence on number of matches and input length
  let confidence = Math.min(0.4 + (matchCount * 0.2), 0.9);
  
  // Adjust confidence based on input specificity
  if (userInput.length > 100) {
    confidence += 0.1; // More details usually means more confidence
  }
  
  return confidence;
}

/**
 * Process response for specialized topic
 */
export function processSpecializedTopicResponse(
  responseText: string,
  userInput: string,
  topicType: TopicDetectionResult['topicType']
): string {
  // If not a specialized topic, return original
  if (topicType === 'general') {
    return responseText;
  }
  
  // Add specialized topic warnings/resources if not already present
  let enhancedResponse = responseText;
  
  switch (topicType) {
    case 'crisis':
      if (!responseText.includes('immediate danger') && !responseText.includes('988')) {
        enhancedResponse += " If you're in immediate danger, please contact emergency services by calling 911 or the 988 Suicide & Crisis Lifeline (call or text 988).";
      }
      break;
      
    case 'eating_disorder':
      if (!responseText.includes('eating disorder') && !responseText.includes('NEDA')) {
        enhancedResponse += " For specialized eating disorder support, the National Eating Disorders Association (NEDA) helpline is available at 1-800-931-2237.";
      }
      break;
      
    case 'gambling':
      if (!responseText.includes('gambling') && !responseText.includes('problem gambling')) {
        enhancedResponse += " The National Problem Gambling Helpline Network (1-800-522-4700) offers confidential support for those experiencing gambling-related issues.";
      }
      break;
      
    case 'substance_abuse':
      if (!responseText.includes('substance') && !responseText.includes('SAMHSA')) {
        enhancedResponse += " The SAMHSA National Helpline (1-800-662-4357) provides information and treatment referrals for substance use disorders.";
      }
      break;
      
    case 'meaning_focused':
      // Add a logotherapy-focused enhancement
      if (!responseText.includes('meaning') && !responseText.includes('purpose')) {
        enhancedResponse += " Finding meaning in our experiences can help us navigate through difficult times. Would you like to explore what feels meaningful to you right now?";
      }
      break;
  }
  
  return enhancedResponse;
}
