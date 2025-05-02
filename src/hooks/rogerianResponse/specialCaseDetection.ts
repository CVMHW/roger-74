
import { ConcernType } from '../../utils/reflection/reflectionTypes';

/**
 * Detects special case patterns in user input that require custom handling
 */
export const detectSpecialCasePatterns = (userInput: string): {
  isInpatientQuestion: boolean,
  isWeatherRelated: boolean,
  isCulturalAdjustment: boolean,
  hasContextToAcknowledge: boolean,
  isPolitical: boolean,
  isRogerNameQuestion: boolean
} => {
  // Check for inpatient questions
  const inpatientQuestionPatterns = [
    /how long (is|are) inpatient/i,
    /what (is|are|happens in) inpatient/i,
    /(will|would) I be locked up/i,
    /how long (would|will) they keep me/i,
    /(don't|do not) want to (be|get) committed/i,
    /stay in (hospital|psych ward|mental hospital)/i,
    /(worried|concerned|scared) about (inpatient|hospitalization)/i
  ];
  
  const isInpatientQuestion = inpatientQuestionPatterns.some(pattern => pattern.test(userInput));
  
  // Check for weather-related concerns
  const isWeatherRelated = /\b(snow|blizzard|storm|hurricane|tornado|flood|ice|weather|power outage|electricity)\b/i.test(userInput.toLowerCase()) &&
    /\b(stuck|trapped|can'?t leave|unable to leave|days|inside|home|house|isolated|cabin fever|bored|frustrat)\b/i.test(userInput.toLowerCase());
  
  // Check for cultural adjustment concerns
  const isCulturalAdjustment = /\b(moved|came) from|pakistan|immigrant|refugee|language barrier|don'?t speak|different culture|adjustment|homesick|miss (home|my country)/i.test(userInput.toLowerCase());
  
  // Check if there is specific context to acknowledge
  const hasContextToAcknowledge = false; // This will be determined by conversation context in the main hook
  
  // Check for political emotions
  const { detectPoliticalEmotions } = require('../../utils/conversationalUtils');
  const politicalInfo = detectPoliticalEmotions(userInput);
  const isPolitical = politicalInfo.isPolitical;
  
  // Check if asking if Roger is Drew
  const isRogerNameQuestion = userInput.toLowerCase().includes("are you drew") || 
    userInput.toLowerCase().includes("is your name drew") ||
    userInput.toLowerCase().includes("your name is drew") ||
    userInput.toLowerCase().includes("you're drew") ||
    userInput.toLowerCase().includes("youre drew") ||
    userInput.toLowerCase().includes("you are drew");
  
  return {
    isInpatientQuestion,
    isWeatherRelated,
    isCulturalAdjustment,
    hasContextToAcknowledge,
    isPolitical,
    isRogerNameQuestion
  };
};

/**
 * Determines the response time multiplier based on message content
 */
export const determineResponseTimeMultiplier = async (
  userInput: string, 
  concernType: ConcernType | null
): Promise<number> => {
  let responseTimeMultiplier = 1.0;
  
  // Check for grief themes to adjust response time
  const { detectGriefThemes } = require('../../utils/response/griefSupport');
  const griefThemes = detectGriefThemes(userInput);
  
  // For safety concerns, increase response time
  if (concernType && 
      ['crisis', 'tentative-harm', 'mental-health', 'ptsd', 'trauma-response', 'pet-illness'].includes(concernType)) {
    // For safety concerns, use our enhanced safety response generator
    responseTimeMultiplier = 1.3;
  }
  
  // If grief themes are detected, adjust response time based on severity and metaphor
  else if (griefThemes.themeIntensity >= 2) {
    // Adjust response time based on grief severity
    responseTimeMultiplier = 
      griefThemes.griefSeverity === 'existential' ? 1.5 :
      griefThemes.griefSeverity === 'severe' ? 1.5 :
      griefThemes.griefSeverity === 'moderate' ? 1.3 :
      griefThemes.griefSeverity === 'mild' ? 1.2 : 1.0;
    
    // Further adjust for metaphor complexity - roller coaster metaphors need more time
    if (griefThemes.griefMetaphorModel === 'roller-coaster') {
      responseTimeMultiplier += 0.2;
    }
    
    // If many grief stages are mentioned, add more time for a thoughtful response
    if (griefThemes.detectedGriefStages.length >= 3) {
      responseTimeMultiplier += 0.1;
    }
  }
  
  // Check for trauma response patterns to adjust response time
  let traumaResponsePatterns = null;
  try {
    const traumaModule = await import('../../utils/response/traumaResponsePatterns').catch(() => null);
    if (traumaModule && traumaModule.detectTraumaResponsePatterns) {
      traumaResponsePatterns = traumaModule.detectTraumaResponsePatterns(userInput);
    }
  } catch (e) {
    console.log("Trauma module not available for response timing:", e);
  }
  
  // Adjust response time for trauma responses
  if (traumaResponsePatterns && traumaResponsePatterns.dominant4F) {
    const intensityMap = {
      'mild': 1.1,
      'moderate': 1.3,
      'severe': 1.4,
      'extreme': 1.5
    };
    
    // Base multiplier on intensity
    const intensityMultiplier = intensityMap[traumaResponsePatterns.dominant4F.intensity] || 1.0;
    
    // If the current multiplier from grief is lower, use the trauma multiplier
    if (intensityMultiplier > responseTimeMultiplier) {
      responseTimeMultiplier = intensityMultiplier;
    }
    
    // Add extra time for hybrid responses (multiple strong patterns)
    if (traumaResponsePatterns.secondary4F) {
      responseTimeMultiplier += 0.1;
    }
  }
  
  return responseTimeMultiplier;
};
