
/**
 * Utility functions for working with severity levels
 */

import { SeverityLevel } from './types';

/**
 * Safe comparison function for severity levels
 * Works around TypeScript comparison issues with string enums
 */
export const isSeverityEqual = (a: SeverityLevel, b: SeverityLevel): boolean => {
  return a === b;
};

/**
 * Check if severity is at least the specified level (or higher)
 */
export const isSeverityAtLeast = (severity: SeverityLevel, threshold: SeverityLevel): boolean => {
  const levels = [SeverityLevel.LOW, SeverityLevel.MEDIUM, SeverityLevel.HIGH, SeverityLevel.SEVERE];
  const severityIndex = levels.indexOf(severity);
  const thresholdIndex = levels.indexOf(threshold);
  
  return severityIndex >= thresholdIndex;
};

/**
 * Get the higher of two severity levels
 */
export const getHigherSeverity = (a: SeverityLevel, b: SeverityLevel): SeverityLevel => {
  if (isSeverityAtLeast(a, b)) {
    return a;
  }
  return b;
};
