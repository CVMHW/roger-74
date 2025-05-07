
import { calculateMinimumResponseTime } from '../../../utils/masterRules';
import { detectGriefThemes } from '../../../utils/response/griefSupport';
import { extractEmotionsFromInput } from '../../../utils/response/processor/emotions';

/**
 * Calculate appropriate response time based on message content
 * Ensures that Roger doesn't respond too quickly to emotional or complex messages
 * @param userInput User message text
 * @returns Delay time in milliseconds
 */
export const calculateResponseTime = (userInput: string): number => {
  // Extract emotions to gauge emotional weight
  const emotions = extractEmotionsFromInput(userInput);
  
  // Check for grief themes which require more thoughtful responses
  const griefThemes = detectGriefThemes(userInput);
  
  // Estimate complexity based on message length and content
  const estimatedComplexity = calculateComplexity(userInput);
  
  // Estimate emotional weight based on detected emotions
  const estimatedEmotionalWeight = calculateEmotionalWeight(emotions, griefThemes);
  
  // Use the masterRules function for consistent timing
  return calculateMinimumResponseTime(estimatedComplexity, estimatedEmotionalWeight);
};

/**
 * Alias for calculateResponseTime to maintain backward compatibility
 * @param userInput User message text
 * @param concernType Optional concern type information
 * @returns Delay time in milliseconds
 */
export const calculateMessageResponseTime = (userInput: string, concernType?: any): number => {
  return calculateResponseTime(userInput);
};

/**
 * Calculate complexity score based on message characteristics
 * @param text User message
 * @returns Complexity score (0-9)
 */
const calculateComplexity = (text: string): number => {
  // Base complexity on length
  let score = 0;
  
  if (text.length > 15) score += 1;
  if (text.length > 30) score += 1;
  if (text.length > 60) score += 1;
  if (text.length > 120) score += 1;
  if (text.length > 240) score += 2;
  
  // Complexity based on question marks
  const questionCount = (text.match(/\?/g) || []).length;
  if (questionCount >= 1) score += 1;
  if (questionCount >= 3) score += 1;
  
  // Complexity based on sentence count
  const sentenceCount = text.split(/[.!?]+/).filter(Boolean).length;
  if (sentenceCount >= 3) score += 1;
  if (sentenceCount >= 5) score += 1;
  
  return Math.min(9, score);
};

/**
 * Calculate emotional weight based on detected emotions
 * @param emotions Detected emotions
 * @param griefThemes Detected grief themes
 * @returns Emotional weight score (0-9)
 */
const calculateEmotionalWeight = (
  emotions: ReturnType<typeof extractEmotionsFromInput>,
  griefThemes: ReturnType<typeof detectGriefThemes>
): number => {
  let score = 0;
  
  // Base score on explicit emotion
  if (emotions.explicitEmotion) score += 2;
  
  // Add weight for social context
  if (emotions.socialContext) {
    score += emotions.socialContext.intensity === 'high' ? 3 : 
             emotions.socialContext.intensity === 'medium' ? 2 : 1;
  }
  
  // Add weight for general emotional content
  if (emotions.emotionalContent.hasEmotion) {
    score += emotions.emotionalContent.intensity === 'high' ? 2 : 
             emotions.emotionalContent.intensity === 'medium' ? 1 : 0;
  }
  
  // Add significant weight for grief themes
  if (griefThemes.themeIntensity > 0) {
    score += Math.min(3, griefThemes.themeIntensity);
  }
  
  return Math.min(9, score);
};
