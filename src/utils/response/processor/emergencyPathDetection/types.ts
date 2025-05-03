
/**
 * Types for emergency path detection system
 */

// Severity levels for emergency paths
export enum SeverityLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  SEVERE = 'severe'
}

// Structure for an emergency path detection flag
export interface EmergencyPathFlag {
  type: string;
  description: string;
  severity: SeverityLevel;
  pattern?: string;
}

// Organized flags by category
export interface EmergencyPathFlags {
  repetitionPatterns: EmergencyPathFlag[];
  memoryInconsistencies: EmergencyPathFlag[];
  contextBreaks: EmergencyPathFlag[];
  nonsensePhrases: EmergencyPathFlag[];
  malformedResponses: EmergencyPathFlag[];
}

// Result from emergency path detection
export interface EmergencyPathResult {
  isEmergencyPath: boolean;
  severity: SeverityLevel;
  flags: EmergencyPathFlag[];
  recommendedAction: 'continue' | 'minor_intervention' | 'major_intervention' | 'reset_conversation';
  requiresImmediateIntervention: boolean;
}
