
/**
 * Quick check for potential hallucinations
 * 
 * A lightweight, fast check to quickly identify obvious hallucination patterns
 */

// Fix the import to use the type from the correct location
import { QuickCheckResult } from '../vectorDatabase/types';

/**
 * Performs a quick check for potential hallucinations
 * 
 * @param responseText Response text to check
 * @param userInput User input that triggered the response
 * @returns QuickCheckResult with basic assessment
 */
export const quickCheck = (responseText: string, userInput: string): QuickCheckResult => {
  let isPotentialHallucination = false;
  let confidence = 1.0;
  let reason: string | undefined;
  
  // Check for repetition patterns
  if (/(I hear|It sounds like) you('re| are) .{3,30}(I hear|It sounds like) you('re| are)/i.test(responseText)) {
    isPotentialHallucination = true;
    confidence = 0.8;
    reason = "Contains repeated phrases indicating model confusion";
  }
  
  // Check for false memory references
  if (/you mentioned before|you told me earlier|when we talked about|as we discussed|as you said/i.test(responseText)) {
    isPotentialHallucination = true;
    confidence = 0.85;
    reason = "Contains references to prior conversation that may not exist";
  }
  
  // Check for emotional misidentification
  if (/\b(depress(ed|ing|ion)?|sad|down|low|hopeless|worthless|empty|numb)\b/i.test(userInput) &&
      !(/\b(depress(ed|ing|ion)?|difficult|hard time|challenging|struggle)\b/i.test(responseText))) {
    isPotentialHallucination = true;
    confidence = 0.9;
    reason = "Depression mentioned but not acknowledged";
  }
  
  return {
    isRelevant: !isPotentialHallucination,
    confidence,
    reason: reason || "No hallucination detected",
    isPotentialHallucination
  };
};
