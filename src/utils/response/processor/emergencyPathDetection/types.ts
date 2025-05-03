
/**
 * Types for emergency path detection system
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
}

export interface EmergencyPathFlags {
  [key: string]: EmergencyPathFlag;
}

export interface EmergencyPathResult {
  isEmergencyPath: boolean;
  severity: SeverityLevel;
  flags: EmergencyPathFlag[];
  requiresImmediateIntervention: boolean;
}
