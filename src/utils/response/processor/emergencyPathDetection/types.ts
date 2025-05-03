
/**
 * Types for the Emergency Path Detection System
 */

export enum SeverityLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  SEVERE = 'severe'
}

export interface EmergencyPathFlag {
  type: string;
  description: string;
  severity: SeverityLevel;
  pattern?: string;
  location?: string;
}

export interface EmergencyPathFlags {
  repetitionPatterns: EmergencyPathFlag[];
  memoryInconsistencies: EmergencyPathFlag[];
  contextBreaks: EmergencyPathFlag[];
  nonsensePhrases: EmergencyPathFlag[];
  malformedResponses: EmergencyPathFlag[];
}

export interface EmergencyPathResult {
  isEmergencyPath: boolean;
  severity: SeverityLevel;
  flags: EmergencyPathFlag[];
  recommendedAction: 'continue' | 'minor_intervention' | 'major_intervention' | 'reset_conversation';
  requiresImmediateIntervention: boolean;
}

