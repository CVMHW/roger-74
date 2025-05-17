
/**
 * Types for crisis detection functionality
 */

export type CrisisType = 'suicide' | 'self-harm' | 'eating-disorder' | 'substance-use' | 'general-crisis';

/**
 * Result of crisis detection analysis
 */
export interface CrisisDetectionResult {
  isDetected: boolean;
  crisisTypes: CrisisType[];
  highestSeverityType?: CrisisType;
  patternMatches?: string[];
}
