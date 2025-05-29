
/**
 * Security Module - Main Entry Point
 * 
 * Exports all security-related functionality
 */

// Core security systems
export { InputValidator, inputValidator } from './InputValidator';
export { SecurityHeaders } from './SecurityHeaders';
export { RateLimiter, messageRateLimiter, feedbackRateLimiter } from './RateLimiter';
export { accessControlSystem } from './AccessControlSystem';

// Security hooks
export { useSecureInput } from '../hooks/useSecureInput';

// Security types
export type { ValidationResult, ValidationOptions } from './InputValidator';
export type { SecurityConfig } from './SecurityHeaders';
export type { RateLimitConfig, RateLimitResult } from './RateLimiter';

// Initialize security on module load
import { SecurityHeaders } from './SecurityHeaders';

// Apply security headers when the module is imported
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      SecurityHeaders.applySecurityHeaders();
    });
  } else {
    SecurityHeaders.applySecurityHeaders();
  }
}
