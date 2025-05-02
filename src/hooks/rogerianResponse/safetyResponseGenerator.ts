
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
  // Get wealth indicators as boolean value instead of string
  const wealthIndicators = detectWealthIndicators(userInput, conversationHistory);
  
  return generateSafetyConcernResponse(userInput, concernType, {
    ...clientPreferences,
    wealthIndicators: wealthIndicators === 'high', // Convert to boolean based on value
    previousMentalHealthExperience: !clientPreferences.isFirstTimeWithMentalHealth
  });
};
