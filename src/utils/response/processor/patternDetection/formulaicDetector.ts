
/**
 * Functions for detecting formulaic beginnings in responses
 */
import { formulaicPhrases } from './patterns';
import { FormulaicBeginningResult } from './types';

/**
 * Detect formulaic beginnings that make responses sound robotic
 */
export const detectFormulaicBeginnings = (response: string): FormulaicBeginningResult => {
  const result: FormulaicBeginningResult = {
    hasFormulaicBeginning: false,
    count: 0,
    enhancedResponse: undefined
  };
  
  let enhancedResponse = response;
  
  // Count occurrences of formulaic phrases
  for (const phrase of formulaicPhrases) {
    const matches = response.match(phrase);
    if (matches && matches.length > 0) {
      result.count += matches.length;
      
      // If we have more than one occurrence, flag it
      if (matches.length > 1) {
        result.hasFormulaicBeginning = true;
        
        // Replace all but the first occurrence
        let firstFound = false;
        enhancedResponse = enhancedResponse.replace(phrase, (match) => {
          if (!firstFound) {
            firstFound = true;
            return match;
          }
          return '';
        });
      }
    }
  }
  
  // Check for overly formal beginning
  if (
    /^(Based on what you're sharing|From what you've shared|I hear what you're sharing)/i.test(response) &&
    result.count > 0 && 
    Math.random() < 0.7 // 70% chance to remove formulaic beginning for variety
  ) {
    result.hasFormulaicBeginning = true;
    
    // Remove the beginning phrase
    enhancedResponse = enhancedResponse
      .replace(/^Based on what you're sharing,?\s*/i, '')
      .replace(/^From what you've shared,?\s*/i, '')
      .replace(/^I hear what you're sharing,?\s*/i, '')
      .replace(/^I understand that,?\s*/i, '');
      
    // Ensure sentence starts with capital letter
    if (enhancedResponse[0]) {
      enhancedResponse = enhancedResponse[0].toUpperCase() + enhancedResponse.slice(1);
    }
  }
  
  if (result.hasFormulaicBeginning) {
    result.enhancedResponse = enhancedResponse;
  }
  
  return result;
};
