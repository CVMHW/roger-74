
import { TraumaResponseAnalysis } from '../../reflection/reflectionTypes';

/**
 * Creates a trauma-informed response for users showing trauma response patterns
 * but not at clinical PTSD levels
 */
export const createTraumaResponseMessage = (userInput: string): string | null => {
  try {
    // Import the module synchronously
    const traumaModule = require('../../response/traumaResponsePatterns');
    
    const analysis = traumaModule.detectTraumaResponsePatterns(userInput);
    
    // If we have a valid analysis, generate a trauma-informed response
    if (analysis && analysis.dominant4F) {
      return traumaModule.generateTraumaInformedResponse(analysis);
    }
    return null;
  } catch (e) {
    console.log("Error in trauma response generation:", e);
    return null;
  }
};
