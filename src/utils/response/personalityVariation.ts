
/**
 * Personality Variation System
 * 
 * Adds variety, creativity, and spontaneity to Roger's responses
 * UNIVERSAL LAW: All responses must demonstrate personality variation
 */

import { 
  PersonalityMode,
  getRandomPersonality, 
  generateEnhancedResponse,
  generateSpontaneousResponse
} from './spontaneityGenerator';

import { enhanceWithMeaningPerspective } from '../logotherapy/logotherapyIntegration';

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
    
    // Select a personality mode based on user input content
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
    
    if (!isCasualSituation && messageCount > 3) {
      // Only apply meaning perspective to deeper conversations after initial exchange
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
  
  // Default to a random personality
  return getRandomPersonality();
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
    // Generate a response with the specific personality
    const personalityResponse = generateEnhancedResponse(
      responseText,
      [],
      75, // Higher spontaneity 
      70, // Higher creativity
      personalityMode
    );
    
    // For casual situations, skip meaning enhancements
    const isCasualSituation = /spill(ed)?|embarrass|awkward|party|bar|drink|mess up|trip(ped)?|fall|fell|stumble|class|teacher|student|presentation/i.test(userInput.toLowerCase());
    
    if (!isCasualSituation) {
      // Only apply meaning perspective to deeper conversations
      return enhanceWithMeaningPerspective(personalityResponse, userInput);
    }
    
    return personalityResponse;
  } catch (error) {
    console.error('Error creating personality response:', error);
    return responseText;
  }
};

// Re-export necessary functions from spontaneityGenerator for other modules
export { generateSpontaneousResponse, generateEnhancedResponse };
