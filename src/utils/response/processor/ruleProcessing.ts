
/**
 * Rule Processing
 * 
 * Applies universal rules to responses
 */

import { checkAllRules } from '../../rulesEnforcement/rulesEnforcer';

/**
 * Apply response rules consistently
 */
export const applyResponseRules = (
  response: string,
  userInput: string,
  messageCount: number = 0,
  conversationHistory: string[] = []
): string => {
  try {
    // MANDATORY: Check all system rules first
    checkAllRules();
    
    // Start with the original response
    let processedResponse = response;
    
    // Apply universal rules
    processedResponse = applyUniversalRules(processedResponse, userInput);
    
    // Apply unconditional rules
    processedResponse = applyUnconditionalRules(processedResponse, userInput, messageCount);
    
    // Apply response-specific rules
    if (conversationHistory && conversationHistory.length > 0) {
      processedResponse = applyContextAwareRules(processedResponse, userInput, conversationHistory);
    }
    
    return processedResponse;
    
  } catch (error) {
    console.error("Error in applyResponseRules:", error);
    // Return original response if rule application fails
    return response;
  }
};

/**
 * Apply universal rules that should apply to all responses
 */
function applyUniversalRules(response: string, userInput: string): string {
  // Universal rule: No false claims of understanding
  const hasCertaintyStatement = /(I (completely|fully|totally) understand|I know exactly how|I get it completely)/i.test(response);
  
  if (hasCertaintyStatement) {
    response = response.replace(
      /(I (completely|fully|totally) understand|I know exactly how|I get it completely)/gi,
      "I'm trying to understand"
    );
  }
  
  // Universal rule: No assuming facts not in evidence
  const hasAssumption = /you must (be|feel|have|want)|I can tell you're|obviously you're|clearly you/i.test(response);
  
  if (hasAssumption) {
    response = response.replace(
      /you must (be|feel|have|want)/gi, 
      "you might $1"
    );
    
    response = response.replace(
      /(I can tell you're|obviously you're|clearly you)/gi,
      "it sounds like you might be"
    );
  }
  
  return response;
}

/**
 * Apply rules that can never be overridden
 */
function applyUnconditionalRules(response: string, userInput: string, messageCount: number = 0): string {
  // UNCONDITIONAL RULE: Roger will always answer inquiries with pinpoint accuracy
  const isQuestion = userInput.includes("?") || 
                     /^(what|who|where|when|why|how|could you|can you|will you)/i.test(userInput);
                     
  if (isQuestion && messageCount > 2) {
    // Ensure the response directly acknowledges the question
    if (!response.includes("?") && !/(here's|I can share|to answer your question|regarding your question|about your question)/i.test(response)) {
      response = `To answer your question: ${response}`;
    }
  }
  
  // UNCONDITIONAL RULE: Never promise or imply future capabilities
  response = response.replace(
    /I('ll| will) be able to (help|assist|provide) you with/gi,
    "I'm here to listen and support you with"
  );
  
  return response;
}

/**
 * Apply rules that depend on conversation context
 */
function applyContextAwareRules(response: string, userInput: string, conversationHistory: string[]): string {
  // Context-aware rule: Avoid repetitive phrasing
  const lastTwoResponses = conversationHistory.slice(-2);
  
  for (const lastResponse of lastTwoResponses) {
    // Check for repeated phrases of 4+ words
    const phrases = getSignificantPhrases(lastResponse, 4);
    
    for (const phrase of phrases) {
      if (response.includes(phrase)) {
        // Replace repeated phrase with alternative wording
        const alternatives = getAlternativePhrasing(phrase);
        if (alternatives.length > 0) {
          const replacement = alternatives[Math.floor(Math.random() * alternatives.length)];
          response = response.replace(phrase, replacement);
        }
      }
    }
  }
  
  return response;
}

/**
 * Get significant phrases from a text
 */
function getSignificantPhrases(text: string, minWords: number): string[] {
  const words = text.split(/\s+/);
  const phrases: string[] = [];
  
  // Extract phrases of significant length
  for (let i = 0; i <= words.length - minWords; i++) {
    const phrase = words.slice(i, i + minWords).join(' ');
    // Only include phrases that are meaningful
    if (!/^(I am|I'm|you are|you're|it is|it's) /i.test(phrase)) {
      phrases.push(phrase);
    }
  }
  
  return phrases;
}

/**
 * Get alternative phrasings for common expressions
 */
function getAlternativePhrasing(phrase: string): string[] {
  // This would be expanded in a real system
  const commonAlternatives: Record<string, string[]> = {
    "I understand how you feel": ["I can imagine this feels challenging", "That sounds really difficult"],
    "It sounds like you're": ["It seems you might be", "From what you're sharing, you're"],
    "That must be difficult": ["That sounds challenging", "It's understandable that would be hard"],
    "I'm here to listen": ["I'm listening to what you're sharing", "You can share what's on your mind"]
  };
  
  // Check for exact matches
  if (commonAlternatives[phrase]) {
    return commonAlternatives[phrase];
  }
  
  // Check for partial matches
  for (const [key, alternatives] of Object.entries(commonAlternatives)) {
    if (phrase.includes(key)) {
      return alternatives;
    }
  }
  
  return [];
}

export default {
  applyResponseRules
};
