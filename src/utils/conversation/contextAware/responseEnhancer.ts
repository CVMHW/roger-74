
import { getCurrentWorkdayContext, detectWorkStressIndicators, generateWorkdayPhrases } from './workdayContext';
import { detectSocioeconomicIndicators, adaptLanguageStyle } from './socioeconomicContext';

/**
 * Enhanced response generator that incorporates contextual awareness
 */
export const enhanceResponseWithContext = (
  baseResponse: string,
  userInput: string,
  conversationHistory: string[]
): string => {
  try {
    // Get current time context
    const workdayContext = getCurrentWorkdayContext();
    
    // Detect work stress indicators in user input
    const workStress = detectWorkStressIndicators(userInput);
    
    // Detect socioeconomic context clues
    const socioeconomicIndicators = detectSocioeconomicIndicators(userInput, conversationHistory);
    
    // Generate appropriate phrases based on workday context
    const { workEndingSoon, weekendComing, generalTimePhrases } = generateWorkdayPhrases(workdayContext);
    
    // Only enhance response if work stress is detected and it's relevant to add time context
    if (workStress.hasWorkStress) {
      // Create enhanced response by adding time context
      let enhancedResponse = baseResponse;
      
      // For high stress with boss mentions on Friday afternoon/evening
      if (workStress.stressLevel === 'high' && 
          workStress.mentions.boss && 
          workdayContext.isEndOfWeek &&
          (workdayContext.timeOfDay === 'afternoon' || workdayContext.timeOfDay === 'evening')) {
        
        // Add weekend context first (highest priority for Friday)
        if (weekendComing.length > 0) {
          const weekendPhrase = weekendComing[Math.floor(Math.random() * weekendComing.length)];
          enhancedResponse = enhancedResponse.replace(/\.$/, `. ${weekendPhrase}`);
        }
      } 
      // For end of workday with moderate to high stress
      else if (workdayContext.isEndOfWorkday && workStress.stressLevel !== 'low') {
        if (workEndingSoon.length > 0) {
          const endingPhrase = workEndingSoon[Math.floor(Math.random() * workEndingSoon.length)];
          enhancedResponse = enhancedResponse.replace(/\.$/, `. ${endingPhrase}`);
        }
      }
      // For moderate stress with no specific time-related enhancement yet
      else if (workStress.stressLevel === 'moderate' && 
               !enhancedResponse.includes(workdayContext.timeOfDay) &&
               !enhancedResponse.includes(workdayContext.dayOfWeek)) {
        
        // Occasionally add a general time-aware phrase
        if (Math.random() < 0.6 && generalTimePhrases.length > 0) {
          const timePhrase = generalTimePhrases[Math.floor(Math.random() * generalTimePhrases.length)];
          enhancedResponse = enhancedResponse.replace(/\?$/, `? ${timePhrase}`);
        }
      }
      
      // Finally, adapt language style based on socioeconomic indicators
      return adaptLanguageStyle(enhancedResponse, socioeconomicIndicators);
    }
    
    // If no work stress is detected, just adapt the language style
    return adaptLanguageStyle(baseResponse, socioeconomicIndicators);
    
  } catch (error) {
    console.error("Error enhancing response with context:", error);
    return baseResponse; // Return original response if any error occurs
  }
};
