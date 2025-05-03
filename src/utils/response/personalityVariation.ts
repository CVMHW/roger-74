
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
 * as a universal principle.
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
    
    // Select a personality mode, favoring existential modes occasionally
    let personalityMode: PersonalityMode = getRandomPersonality();
    
    // Increase chance of meaning-focused modes
    const shouldUseExistentialMode = Math.random() < 0.25; // 25% chance
    if (shouldUseExistentialMode) {
      personalityMode = Math.random() < 0.5 ? 'existential' : 'meaning-focused';
    }
    
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
    
    // UNIVERSAL LAW: Ensure meaning perspective is included
    const finalResponse = enhanceWithMeaningPerspective(enhancedResponse, userInput);
    
    return finalResponse;
  } catch (error) {
    console.error('Error in addResponseVariety:', error);
    
    // Ensure we always return at least the original response if there's an error
    return responseText;
  }
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
    
    // UNIVERSAL LAW: Ensure meaning perspective is included
    return enhanceWithMeaningPerspective(personalityResponse, userInput);
  } catch (error) {
    console.error('Error creating personality response:', error);
    return responseText;
  }
};

// Re-export necessary functions from spontaneityGenerator for other modules
export { generateSpontaneousResponse, generateEnhancedResponse };
