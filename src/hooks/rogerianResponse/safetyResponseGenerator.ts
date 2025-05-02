
import { ConcernType } from '../../utils/reflection/reflectionTypes';
import { detectWealthIndicators } from '../../utils/helpers/userInfoUtils';
import { generateSafetyConcernResponse } from '../../utils/safetyConcernManager';

// Define ClientPreferences interface
interface ClientPreferences {
  prefersFormalLanguage?: boolean;
  prefersDirectApproach?: boolean;
  isFirstTimeWithMentalHealth?: boolean;
  topics?: string[];
  locations?: string[];
  emotions?: string[];
  keyPhrases?: string[];
  people?: string[];
  [key: string]: any;
}

/**
 * Specialized response generator for safety concerns
 */
export const generateSafetyResponse = (
  userInput: string, 
  concernType: ConcernType,
  clientPreferences: ClientPreferences,
  conversationHistory: string[]
): string => {
  try {
    // Get wealth indicators
    const wealthIndicatorsString = detectWealthIndicators(userInput, conversationHistory);
    
    // Convert string value to boolean
    const isHighWealth = wealthIndicatorsString === 'high';
    
    // Generate response with properly formatted parameters
    return generateSafetyConcernResponse(userInput, concernType, {
      ...clientPreferences,
      wealthIndicators: isHighWealth,
      previousMentalHealthExperience: !clientPreferences.isFirstTimeWithMentalHealth
    });
  } catch (error) {
    console.error("Error in generateSafetyResponse:", error);
    
    // Fallback to ensure we NEVER fail to respond to safety concerns
    if (concernType === 'tentative-harm') {
      return "I'm concerned about what you're saying. If you're thinking of harming yourself, please know that you're not alone and there is help available. Would you like me to share some resources that can provide immediate support?";
    } else if (concernType === 'crisis') {
      return "It sounds like you're going through a really difficult time right now. Your safety is incredibly important. Would it be helpful to talk about some immediate support options?";
    } else {
      return "I'm here to listen and support you through whatever you're experiencing. Would it help to talk more about what's going on?";
    }
  }
};
