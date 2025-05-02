
import { ConcernType } from '../../utils/reflection/reflectionTypes';
import { ClientPreferences } from './types';
import { detectWealthIndicators } from '../../utils/helpers/userInfoUtils';
import { generateSafetyConcernResponse } from '../../utils/response/specialConcernResponses';

/**
 * Specialized response generator for safety concerns
 */
export const generateSafetyResponse = (
  userInput: string, 
  concernType: ConcernType,
  clientPreferences: ClientPreferences,
  conversationHistory: string[]
): string => {
  return generateSafetyConcernResponse(userInput, concernType, {
    ...clientPreferences,
    wealthIndicators: detectWealthIndicators(userInput, conversationHistory),
    previousMentalHealthExperience: !clientPreferences.isFirstTimeWithMentalHealth
  });
};
