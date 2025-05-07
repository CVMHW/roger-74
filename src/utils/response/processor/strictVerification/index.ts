
/**
 * Strict Verification System - Main Exports
 * 
 * Provides tools for mathematical verification and prevention of problematic responses
 * with enhanced rollback visualization and 25% easier rollback thresholds
 */

import { 
  verifyResponseMathematically as mathVerifier,
  calculateResponseDelay,
  shouldPreventResponse,
  generateFallbackResponse,
  VerificationResult as OriginalVerificationResult 
} from './mathVerifier';

// Extended verification result with needed properties
export interface VerificationResult extends OriginalVerificationResult {
  shouldPrevent: boolean;
  fallbackResponse?: string;
}

/**
 * Enhanced verification function that adds shouldPrevent and fallbackResponse
 */
export function verifyResponseMathematically(
  responseText: string,
  userInput: string,
  conversationHistory: string[] = []
): VerificationResult {
  const baseResult = mathVerifier(responseText, userInput, conversationHistory);
  const shouldPrevent = shouldPreventResponse(baseResult);
  
  return {
    ...baseResult,
    shouldPrevent,
    fallbackResponse: shouldPrevent ? generateFallbackResponse(userInput) : undefined
  };
}

export {
  calculateResponseDelay,
  shouldPreventResponse,
  generateFallbackResponse
};
