/**
 * Communication Style Detection
 * 
 * Utilities for detecting communication styles from user messages
 */

/**
 * Detects communication style from user's message
 */
export const detectCommunicationStyle = (userInput: string): string => {
  const lowerInput = userInput.toLowerCase();
  
  if (lowerInput.includes('technical') || /\b(code|programming|algorithm|function)\b/i.test(userInput)) {
    return 'technical';
  } else if (userInput.length > 200 && /\b(feel|feeling|felt|emotion|sad|happy|angry)\b/i.test(userInput)) {
    return 'emotional';
  } else if (userInput.length < 50 && !userInput.includes('?')) {
    return 'brief';
  } else if (userInput.includes('?') && userInput.split('?').length > 2) {
    return 'inquisitive';
  }
  
  return 'standard';
};

/**
 * Detects demographic patterns in user messages
 */
export const detectDemographicPatterns = (userInput: string): {
  likelyAge?: 'teen' | 'young_adult' | 'adult' | 'senior';
  likelyBackground?: 'technical' | 'medical' | 'general';
} => {
  const result: {
    likelyAge?: 'teen' | 'young_adult' | 'adult' | 'senior';
    likelyBackground?: 'technical' | 'medical' | 'general';
  } = {};
  
  // Age detection
  if (/\b(school|homework|mom|dad|teacher)\b/i.test(userInput)) {
    result.likelyAge = 'teen';
  } else if (/\b(college|university|dorm|roommate|dating|apartment)\b/i.test(userInput)) {
    result.likelyAge = 'young_adult';
  } else if (/\b(mortgage|kids|career|promotion|marriage)\b/i.test(userInput)) {
    result.likelyAge = 'adult';
  } else if (/\b(retirement|grandchildren|arthritis|medicare)\b/i.test(userInput)) {
    result.likelyAge = 'senior';
  }
  
  // Background detection
  if (/\b(code|program|engineer|developer|software|tech)\b/i.test(userInput)) {
    result.likelyBackground = 'technical';
  } else if (/\b(patient|doctor|nurse|diagnosis|symptom|treatment)\b/i.test(userInput)) {
    result.likelyBackground = 'medical';
  } else {
    result.likelyBackground = 'general';
  }
  
  return result;
};

/**
 * Adapts response style based on user's communication preferences
 */
export const adaptResponseStyle = (
  baseResponse: string, 
  style: string
): string => {
  switch (style) {
    case 'technical':
      return baseResponse.replace(/feelings/g, 'psychological state')
                         .replace(/worried/g, 'concerned')
                         .replace(/happy/g, 'satisfied');
    case 'emotional':
      return baseResponse + " How are you feeling about that?";
    case 'brief':
      // For brief communicators, keep responses concise
      return baseResponse.split('. ').slice(0, 2).join('. ');
    case 'inquisitive':
      // For question-askers, add thoughtful questions
      return baseResponse + " What are your thoughts on this?";
    default:
      return baseResponse;
  }
};
