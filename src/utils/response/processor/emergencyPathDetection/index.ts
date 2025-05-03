
/**
 * Emergency Path Detection System
 * 
 * Identifies high-risk conversation patterns that may lead to hallucinations
 * and triggers immediate intervention with increased response spontaneity.
 */

// Export public API
export { detectEmergencyPath } from './pathDetector';
export { applyEmergencyIntervention } from './interventionHandler';
export { EmergencyPathFlags, EmergencyPathResult } from './types';

