
/**
 * Strict Verification System - Main Exports
 * 
 * Provides tools for mathematical verification and prevention of problematic responses
 * with enhanced rollback visualization and 25% easier rollback thresholds
 */

export { 
  verifyResponseMathematically,
  calculateResponseDelay,
  shouldPreventResponse,
  generateFallbackResponse
} from './mathVerifier';

export type { VerificationResult } from './mathVerifier';
