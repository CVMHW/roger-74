
/**
 * Response Approach Selector
 * 
 * Determines the appropriate approach for each response based on context,
 * balancing different aspects of Roger's training
 */

import { detectSmallTalkCategory } from '../../conversation/theSmallStuff';
import { identifyEnhancedFeelings } from '../../reflection/feelingDetection';

/**
 * Approach configuration defining how heavily to apply different aspects
 * of Roger's training
 */
export interface ResponseApproach {
  // How much to apply logotherapy/meaning principles (0-1)
  logotherapyStrength: number;
  // How much spontaneity to use (0-100)
  spontaneityLevel: number;
  // How much creativity to use (0-100)
  creativityLevel: number;
  // Primary approach type
  type: 'smalltalk' | 'everydayFrustration' | 'rogerian' | 'trauma' | 'existential' | 'cultural' | 'practical';
}

/**
 * Select the most appropriate approach based on conversation context
 */
export const selectResponseApproach = (
  userInput: string,
  conversationHistory: string[] = []
): ResponseApproach => {
  const input = userInput.toLowerCase();
  
  // Detect if this is smalltalk
  const smallTalkCategory = detectSmallTalkCategory(input);
  if (smallTalkCategory) {
    return {
      logotherapyStrength: 0.1, // Very little meaning focus
      spontaneityLevel: 80,     // Higher spontaneity for natural smalltalk
      creativityLevel: 75,      // Higher creativity
      type: 'smalltalk'
    };
  }
  
  // Detect everyday frustrations
  if (/spill(ed)?|embarrass(ed|ing)?|awkward|screw(ed)? up|mistake|mess(ed)? up/i.test(input)) {
    return {
      logotherapyStrength: 0.2, // Little meaning focus for everyday issues
      spontaneityLevel: 70,     // Higher spontaneity
      creativityLevel: 65,      // Moderate creativity
      type: 'everydayFrustration'
    };
  }
  
  // Detect cultural/class references
  if (/college|education|class|worker|labor|job|social class|rich|poor|privilege/i.test(input)) {
    return {
      logotherapyStrength: 0.3, // Moderate meaning focus
      spontaneityLevel: 60,     // Moderate spontaneity
      creativityLevel: 65,      // Moderate creativity
      type: 'cultural'
    };
  }
  
  // Detect trauma indicators
  if (/abuse|trauma|hurt|attack|assault|violent|rape|molest/i.test(input)) {
    return {
      logotherapyStrength: 0.5, // Balanced meaning focus
      spontaneityLevel: 40,     // Lower spontaneity for sensitive topics
      creativityLevel: 40,      // Lower creativity for serious topics
      type: 'trauma'
    };
  }
  
  // Detect explicit existential/meaning questions
  if (/meaning|purpose|life|exist|why am i|why are we|point of|reason for/i.test(input)) {
    return {
      logotherapyStrength: 0.9, // Very high meaning focus
      spontaneityLevel: 50,     // Moderate spontaneity
      creativityLevel: 60,      // Moderate-high creativity
      type: 'existential'
    };
  }
  
  // Detect practical problems
  if (/how (do|can|should) i|what should i do|steps to|way to|help me/i.test(input)) {
    return {
      logotherapyStrength: 0.4, // Moderate meaning focus
      spontaneityLevel: 60,     // Moderate spontaneity
      creativityLevel: 55,      // Moderate creativity
      type: 'practical'
    };
  }
  
  // Check emotional content for default approach
  const emotions = identifyEnhancedFeelings(input);
  if (emotions.length > 0) {
    // Adjust based on emotional tone
    const primaryEmotion = emotions[0].category;
    
    if (['sad', 'depressed', 'grieving'].includes(primaryEmotion)) {
      return {
        logotherapyStrength: 0.6, // Higher meaning focus for sadness
        spontaneityLevel: 45,     // Lower spontaneity for serious emotion
        creativityLevel: 50,      // Moderate creativity
        type: 'rogerian'
      };
    }
    
    if (['anxious', 'scared', 'worried'].includes(primaryEmotion)) {
      return {
        logotherapyStrength: 0.5, // Moderate meaning focus
        spontaneityLevel: 40,     // Lower spontaneity for anxiety
        creativityLevel: 45,      // Lower creativity
        type: 'rogerian'
      };
    }
    
    if (['angry', 'frustrated', 'irritated'].includes(primaryEmotion)) {
      return {
        logotherapyStrength: 0.3, // Lower meaning focus for anger
        spontaneityLevel: 50,     // Moderate spontaneity
        creativityLevel: 55,      // Moderate creativity
        type: 'rogerian'
      };
    }
  }
  
  // Default balanced approach
  return {
    logotherapyStrength: 0.4, // Moderate meaning focus
    spontaneityLevel: 60,     // Moderate spontaneity
    creativityLevel: 60,      // Moderate creativity
    type: 'rogerian'
  };
};

/**
 * Adjust approach based on conversation progression
 */
export const adjustApproachForConversationFlow = (
  approach: ResponseApproach,
  conversationHistory: string[],
  messageCount: number
): ResponseApproach => {
  const adjustedApproach = { ...approach };
  
  // Early in conversation - more conventional
  if (messageCount < 3) {
    adjustedApproach.logotherapyStrength = Math.min(adjustedApproach.logotherapyStrength, 0.3);
    adjustedApproach.spontaneityLevel = Math.min(adjustedApproach.spontaneityLevel, 50);
  }
  
  // Multiple short user responses may indicate disengagement
  const hasMultipleShortResponses = conversationHistory
    .slice(-3)
    .filter(msg => msg.split(/\s+/).length < 5)
    .length >= 2;
  
  if (hasMultipleShortResponses) {
    adjustedApproach.logotherapyStrength = Math.min(adjustedApproach.logotherapyStrength, 0.2);
    adjustedApproach.spontaneityLevel = Math.min(70, adjustedApproach.spontaneityLevel + 10);
  }
  
  return adjustedApproach;
};
