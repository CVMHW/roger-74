
/**
 * Utilities for detecting meaning-oriented content
 */

/**
 * Check if response already contains meaning-oriented language
 */
export const hasMeaningOrientation = (response: string): boolean => {
  const meaningWords = [
    'meaning', 'purpose', 'value', 'values', 'meaningful', 'purposeful',
    'contribution', 'legacy', 'transcend', 'significance', 'calling',
    'mission', 'fulfillment', 'authentic', 'genuine', 'worthy'
  ];
  
  const lowerResponse = response.toLowerCase();
  
  return meaningWords.some(word => lowerResponse.includes(word));
};
