
/**
 * Input Validation and Sanitization System
 * 
 * Provides comprehensive input validation and XSS protection
 */

import DOMPurify from 'dompurify';

export interface ValidationResult {
  isValid: boolean;
  sanitizedInput: string;
  errors: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

export interface ValidationOptions {
  maxLength?: number;
  minLength?: number;
  allowHTML?: boolean;
  strictMode?: boolean;
  crisisContext?: boolean;
}

export class InputValidator {
  private static instance: InputValidator;
  private readonly maxMessageLength = 2000;
  private readonly suspiciousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /data:text\/html/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
    /eval\s*\(/gi,
    /setTimeout\s*\(/gi,
    /setInterval\s*\(/gi
  ];

  private constructor() {}

  static getInstance(): InputValidator {
    if (!InputValidator.instance) {
      InputValidator.instance = new InputValidator();
    }
    return InputValidator.instance;
  }

  /**
   * Validate and sanitize user input
   */
  validateInput(input: string, options: ValidationOptions = {}): ValidationResult {
    const {
      maxLength = this.maxMessageLength,
      minLength = 1,
      allowHTML = false,
      strictMode = true,
      crisisContext = false
    } = options;

    const errors: string[] = [];
    let riskLevel: 'low' | 'medium' | 'high' = 'low';

    // Basic validation
    if (!input || typeof input !== 'string') {
      return {
        isValid: false,
        sanitizedInput: '',
        errors: ['Invalid input provided'],
        riskLevel: 'high'
      };
    }

    // Length validation
    if (input.length < minLength) {
      errors.push(`Input too short (minimum ${minLength} characters)`);
    }

    if (input.length > maxLength) {
      errors.push(`Input too long (maximum ${maxLength} characters)`);
      riskLevel = 'medium';
    }

    // Check for suspicious patterns
    const suspiciousFound = this.suspiciousPatterns.some(pattern => pattern.test(input));
    if (suspiciousFound) {
      errors.push('Potentially malicious content detected');
      riskLevel = 'high';
    }

    // Sanitize input
    let sanitizedInput = this.sanitizeInput(input, allowHTML);

    // Additional validation for crisis context
    if (crisisContext) {
      sanitizedInput = this.sanitizeCrisisInput(sanitizedInput);
    }

    // Rate limiting check (placeholder - would be implemented with actual rate limiting)
    if (strictMode && input.length > 1000) {
      riskLevel = riskLevel === 'high' ? 'high' : 'medium';
    }

    return {
      isValid: errors.length === 0 && riskLevel !== 'high',
      sanitizedInput,
      errors,
      riskLevel
    };
  }

  /**
   * Sanitize input using DOMPurify
   */
  private sanitizeInput(input: string, allowHTML: boolean = false): string {
    if (!allowHTML) {
      // Strip all HTML tags for text-only content
      return DOMPurify.sanitize(input, { 
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
        KEEP_CONTENT: true
      });
    }

    // Allow only safe HTML tags if HTML is permitted
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u'],
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true
    });
  }

  /**
   * Additional sanitization for crisis-related inputs
   */
  private sanitizeCrisisInput(input: string): string {
    // Remove potential code injection attempts while preserving crisis content
    return input
      .replace(/javascript:/gi, '')
      .replace(/data:/gi, '')
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .trim();
  }

  /**
   * Validate file uploads (for future use)
   */
  validateFileUpload(file: File): ValidationResult {
    const errors: string[] = [];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'text/plain'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      errors.push('File type not allowed');
    }

    if (file.size > maxSize) {
      errors.push('File size too large');
    }

    return {
      isValid: errors.length === 0,
      sanitizedInput: file.name,
      errors,
      riskLevel: errors.length > 0 ? 'medium' : 'low'
    };
  }

  /**
   * Check for potential SQL injection patterns (defensive)
   */
  checkSQLInjection(input: string): boolean {
    const sqlPatterns = [
      /(\bUNION\b|\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b)/gi,
      /(\bOR\b|\bAND\b)\s+[\w\s]*\s*=\s*[\w\s]*/gi,
      /['"]\s*(OR|AND)\s+['"]?\d+['"]?\s*=\s*['"]?\d+['"]?/gi
    ];

    return sqlPatterns.some(pattern => pattern.test(input));
  }
}

export const inputValidator = InputValidator.getInstance();
