
/**
 * Personality Variation System
 * 
 * Adds variety, creativity, and spontaneity to Roger's responses
 * UNIVERSAL LAW: All responses must demonstrate personality variation
 */

import { 
  PersonalityMode,
  generateEnhancedResponse,
  generateSpontaneousResponse
} from './spontaneityGenerator';

import { enhanceWithMeaningPerspective } from '../logotherapy/logotherapyIntegration';
import { getRogerPersonalityInsight } from '../reflection/rogerPersonality';

/**
 * Add variety to Roger's responses to prevent repetitive patterns
 * 
 * This function ensures responses have natural variation, spontaneity,
 * and authentic personality while incorporating meaning and purpose
 * as appropriate for the context.
 * 
 * @param responseText Base response to enhance
 * @param userInput User's input to consider for context
 * @param messageCount Number of messages in conversation
 * @param spontaneityLevel Level of spontaneity (0-100)
 * @param creativityLevel Level of creativity (0-100)
 */
export const addResponseVariety = (
  responseText: string,
  userInput: string,
  messageCount: number = 5,
  spontaneityLevel: number = 70,
  creativityLevel: number = 65
): string => {
  try {
    console.log("Adding personality variation and spontaneity to response");
    
    // Select a personality mode based on user input content - USING ROGER'S ESTABLISHED PERSONALITY
    let personalityMode: PersonalityMode = selectAppropriatePersonality(userInput);
    
    console.log(`Selected personality mode: ${personalityMode}`);
    
    // Determine if we need a completely spontaneous response to break patterns
    const needsHighSpontaneity = spontaneityLevel > 80;
    
    let enhancedResponse: string;
    
    if (needsHighSpontaneity) {
      // Generate a completely fresh, spontaneous response
      enhancedResponse = generateSpontaneousResponse(
        userInput,
        [],
        spontaneityLevel,
        creativityLevel,
        personalityMode
      );
      
      console.log("Generated high-spontaneity response to break patterns");
    } else {
      // Enhance the existing response with personality and variation
      enhancedResponse = generateEnhancedResponse(
        responseText,
        [],
        spontaneityLevel,
        creativityLevel,
        personalityMode
      );
      
      console.log("Enhanced response with moderate spontaneity");
    }
    
    // IMPORTANT: Only add meaning perspective for appropriate situations
    // Check if this is a casual/everyday situation
    const isCasualSituation = /spill(ed)?|embarrass|awkward|party|bar|drink|mess up|trip(ped)?|fall|fell|stumble|class|teacher|student|presentation/i.test(userInput.toLowerCase());
    const resistanceToDeeperMeaning = /what\?|all|that's all|just happened|it was just|how does.*reflect|are you insinuating|not that deep|too much|simple|regular|come on|get real/i.test(userInput.toLowerCase());
    
    // Add Roger's personality insight if appropriate and hasn't been added already
    if (!isCasualSituation && !resistanceToDeeperMeaning && messageCount > 3 && Math.random() > 0.7) {
      const personalityInsight = getRogerPersonalityInsight(userInput, '', messageCount > 30);
      if (personalityInsight && !enhancedResponse.includes(personalityInsight)) {
        enhancedResponse += personalityInsight;
      }
    }
    
    // Only apply meaning perspective to deeper conversations after initial exchange
    // AND only when not in casual situations AND when no resistance detected
    if (!isCasualSituation && !resistanceToDeeperMeaning && messageCount > 3) {
      enhancedResponse = enhanceWithMeaningPerspective(enhancedResponse, userInput);
    }
    
    return enhancedResponse;
  } catch (error) {
    console.error('Error in addResponseVariety:', error);
    
    // Ensure we always return at least the original response if there's an error
    return responseText;
  }
};

/**
 * Select appropriate personality based on user input content
 * Uses Roger's established personality traits from his background
 */
const selectAppropriatePersonality = (userInput: string): PersonalityMode => {
  const input = userInput.toLowerCase();
  
  // For casual/social situations, use warm-social personality
  if (/spill(ed)?|embarrass|awkward|party|bar|drink|girl|guy|cute|dating|trip(ped)?|fall|fell|stumble|class|teacher|student|presentation/i.test(input)) {
    return 'warm-social';
  }
  
  // For emotional content, use empathetic
  if (/sad|angry|upset|hurt|feel|emotion|pain/i.test(input)) {
    return 'empathetic';
  }
  
  // For deeper existential questions, use meaning-focused
  if (/meaning|purpose|life|exist|why am i|why are we|point of/i.test(input)) {
    return 'meaning-focused';
  }
  
  // For Cleveland or Ohio references, use warm personality
  if (/cleveland|ohio|midwest|cavs|browns|guardians/i.test(input)) {
    return 'warm';
  }
  
  // Default to balanced personality - NOT RANDOM
  return 'balanced' as PersonalityMode;
};

/**
 * Create a response with specific personality characteristics
 * 
 * @param responseText Base response to adapt
 * @param personalityMode Desired personality mode
 * @param userInput User's message for context
 * @returns Response with specified personality characteristics
 */
export const createPersonalityResponse = (
  responseText: string,
  personalityMode: PersonalityMode,
  userInput: string
): string => {
  try {
    // Check if casual situation first
    const isCasualSituation = /spill(ed)?|embarrass|awkward|party|bar|drink|mess up|trip(ped)?|fall|fell|stumble|class|teacher|student|presentation/i.test(userInput.toLowerCase());
    
    // Generate a response with the specific personality
    const personalityResponse = generateEnhancedResponse(
      responseText,
      [],
      isCasualSituation ? 90 : 75, // Higher spontaneity for casual situations
      isCasualSituation ? 85 : 70, // Higher creativity for casual situations
      personalityMode
    );
    
    // For casual situations, skip meaning enhancements
    if (isCasualSituation) {
      return personalityResponse;
    }
    
    // Only apply meaning perspective to deeper conversations
    return enhanceWithMeaningPerspective(personalityResponse, userInput);
  } catch (error) {
    console.error('Error creating personality response:', error);
    return responseText;
  }
};

// Re-export necessary functions from spontaneityGenerator for other modules
export { generateSpontaneousResponse, generateEnhancedResponse };
