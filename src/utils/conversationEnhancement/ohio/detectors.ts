
/**
 * Ohio Context Detectors
 * 
 * Functions to detect various Ohio-specific content in user messages.
 */

// Re-export the patient type detectors and Ohio references detector for easier access
export { detectChildPatient, detectNewcomerPatient } from './patientTypes';
export { detectOhioReferences } from './references';

/**
 * Detects if user message contains Cleveland sports references
 */
export const detectClevelandSportsReference = (userInput: string): boolean => {
  const sportsPatterns = [
    /\b(browns|cavaliers|cavs|guardians|indians|monsters)\b/i,
    /\b(football|basketball|baseball|hockey)\b/i,
    /\b(game|stadium|arena|field|fan|team)\b/i
  ];
  
  return sportsPatterns.some(pattern => pattern.test(userInput));
};

/**
 * Detects if user message contains Cleveland weather references
 */
export const detectClevelandWeatherReference = (userInput: string): boolean => {
  const weatherPatterns = [
    /\b(weather|rain|snow|cold|hot|sunny|cloudy|lake effect)\b/i,
    /\b(winter|summer|spring|fall|autumn)\b/i,
    /\b(temperature|degrees|forecast)\b/i
  ];
  
  return weatherPatterns.some(pattern => pattern.test(userInput));
};

/**
 * Detects if user message contains Cleveland cultural attractions
 */
export const detectClevelandCulturalReference = (userInput: string): boolean => {
  const culturalPatterns = [
    /\b(rock hall|rock and roll|museum|west side market)\b/i,
    /\b(playhouse square|severance|orchestra|theater|theatre)\b/i,
    /\b(art museum|botanical garden|science center)\b/i
  ];
  
  return culturalPatterns.some(pattern => pattern.test(userInput));
};
