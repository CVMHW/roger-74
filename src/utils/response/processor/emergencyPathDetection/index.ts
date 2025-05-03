
/**
 * Emergency Path Detection System
 * 
 * Identifies high-risk conversation patterns that may lead to hallucinations
 * and triggers immediate intervention with increased response spontaneity.
 */

// Re-export the types
export type { EmergencyPathResult, EmergencyPathFlag, SeverityLevel } from './types';

// Export public API
export { detectEmergencyPath, categorizeFlags } from './pathDetector';
export { applyEmergencyIntervention } from './interventionHandler';
export { isSeverityEqual, isSeverityAtLeast, getHigherSeverity } from './severityUtils';

// New pattern detection exports
export { detectPatternedResponses } from './patternDetector';
