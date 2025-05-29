
/**
 * Secure Input Hook
 * 
 * Provides secure input handling with validation and sanitization
 */

import { useState, useCallback } from 'react';
import { inputValidator, ValidationResult } from '../security/InputValidator';
import { messageRateLimiter } from '../security/RateLimiter';
import { useToast } from '@/components/ui/use-toast';

export interface SecureInputOptions {
  maxLength?: number;
  minLength?: number;
  allowHTML?: boolean;
  strictMode?: boolean;
  enableRateLimit?: boolean;
  crisisContext?: boolean;
}

export interface SecureInputReturn {
  validateAndSanitize: (input: string) => ValidationResult;
  isRateLimited: boolean;
  rateLimitStatus: { requests: number; remaining: number; blocked: boolean };
  checkRateLimit: () => boolean;
}

export const useSecureInput = (options: SecureInputOptions = {}): SecureInputReturn => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const { toast } = useToast();

  const {
    enableRateLimit = true,
    ...validationOptions
  } = options;

  /**
   * Validate and sanitize input with comprehensive security checks
   */
  const validateAndSanitize = useCallback((input: string): ValidationResult => {
    // Input validation and sanitization
    const validationResult = inputValidator.validateInput(input, validationOptions);

    // Log security events for high-risk inputs
    if (validationResult.riskLevel === 'high') {
      console.warn('🚨 High-risk input detected:', {
        riskLevel: validationResult.riskLevel,
        errors: validationResult.errors,
        timestamp: new Date().toISOString()
      });

      toast({
        title: "Security Warning",
        description: "Your message contains potentially unsafe content and has been filtered.",
        variant: "destructive"
      });
    }

    return validationResult;
  }, [validationOptions, toast]);

  /**
   * Check rate limiting
   */
  const checkRateLimit = useCallback((): boolean => {
    if (!enableRateLimit) return true;

    const rateLimitResult = messageRateLimiter.checkLimit();
    
    if (!rateLimitResult.allowed) {
      setIsRateLimited(true);
      
      const resetTime = new Date(rateLimitResult.resetTime);
      toast({
        title: "Rate Limit Exceeded",
        description: `Please wait until ${resetTime.toLocaleTimeString()} before sending another message.`,
        variant: "destructive"
      });

      // Auto-reset rate limit flag after block duration
      setTimeout(() => {
        setIsRateLimited(false);
      }, rateLimitResult.resetTime - Date.now());

      return false;
    }

    setIsRateLimited(false);
    return true;
  }, [enableRateLimit, toast]);

  /**
   * Get current rate limit status
   */
  const rateLimitStatus = messageRateLimiter.getStatus();

  return {
    validateAndSanitize,
    isRateLimited,
    rateLimitStatus,
    checkRateLimit
  };
};
