
/**
 * Quick preliminary hallucination check
 * More efficient than running full detection on every response
 */

import { QuickCheckResult } from './types';
import { calculateStringSimilarity, commonPrefix } from './similarity-utils';

/**
 * Quick preliminary check for potential hallucinations
 * More efficient than running full detection on every response
 * Enhanced with detection for repeated sentences
 */
export const quickHallucinationCheck = (
  responseText: string,
  conversationHistory: string[]
): QuickCheckResult => {
  // New conversation check - very strict about memory claims
  if (conversationHistory.length <= 2) {
    // In new conversations, ANY memory claim is suspect
    if (/I remember|you mentioned|you told me|you said|earlier you|previously you|we talked about/i.test(responseText)) {
      return { 
        potentialIssue: true, 
        reason: 'Memory claims in new conversation' 
      };
    }
  }
  
  // Check for repeated sentences
  const sentences = responseText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  let hasRepeatedSentences = false;
  
  if (sentences.length >= 2) {
    for (let i = 0; i < sentences.length; i++) {
      for (let j = i + 1; j < sentences.length; j++) {
        const similarity = calculateStringSimilarity(
          sentences[i].toLowerCase(), 
          sentences[j].toLowerCase()
        );
        
        if (similarity > 0.7) {
          hasRepeatedSentences = true;
          return { 
            potentialIssue: true, 
            reason: 'Repeated sentences detected',
            hasRepeatedSentences: true
          };
        }
      }
    }
  }
  
  // Repetition check - quick scan for near-duplicate content
  if (sentences.length >= 3) { // Only check longer responses
    for (let i = 0; i < sentences.length; i++) {
      for (let j = i + 1; j < sentences.length; j++) {
        // If two sentences start with the same 10+ characters, flag for deeper inspection
        const minLength = Math.min(sentences[i].length, sentences[j].length);
        if (minLength > 15) {
          const commonStart = commonPrefix(sentences[i].toLowerCase(), sentences[j].toLowerCase());
          if (commonStart.length > 10) {
            return { 
              potentialIssue: true, 
              reason: 'Potential repetition detected',
              hasRepeatedSentences: true
            };
          }
        }
      }
    }
  }
  
  // Check for excessive "I remember" phrases
  let rememberCount = 0;
  const rememberPattern = /I remember/gi;
  let match;
  while ((match = rememberPattern.exec(responseText)) !== null) {
    rememberCount++;
  }
  
  if (rememberCount > 1) {
    return { 
      potentialIssue: true, 
      reason: 'Multiple memory claims',
      hasRepeatedSentences: false
    };
  }
  
  return { potentialIssue: false, hasRepeatedSentences: false };
};
