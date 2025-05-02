
/**
 * Patient Type Detectors for Ohio Context
 * 
 * Contains functions to detect specific patient types based on message content.
 */

/**
 * Detects if the user is likely a child patient
 */
export const detectChildPatient = (userInput: string): boolean => {
  const childSignals = [
    /\b(mom|mommy|dad|daddy)\b/i,
    /\b(school|teacher|homework|class|recess)\b/i,
    /\b(playdate|toy|game|playground)\b/i,
    /\b(cartoon|pokemon|minecraft|fortnite|roblox)\b/i,
    /\bi('m| am) (\d|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen)\b/i,
    /\b(drawing|coloring|crayon)\b/i,
    /\bcool\b|\bawesome\b|\bfun\b/i
  ];
  
  return childSignals.some(pattern => pattern.test(userInput));
};

/**
 * Detects if the user is likely a newcomer patient
 */
export const detectNewcomerPatient = (userInput: string): boolean => {
  const newcomerSignals = [
    /\bnew (to|in) (cleveland|ohio|america|usa|united states)\b/i,
    /\bmoved (here|to cleveland|to ohio|to america)\b/i,
    /\b(refugee|immigrant|newcomer)\b/i,
    /\b(learning english|english class|esl)\b/i,
    /\b(miss|missing) (home|country|family|homeland)\b/i,
    /\b(translator|translate|not understand)\b/i,
    /\b(in my country|where I( am)? from)\b/i
  ];
  
  return newcomerSignals.some(pattern => pattern.test(userInput));
};
