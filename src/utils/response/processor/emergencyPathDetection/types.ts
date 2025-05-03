

/**
 * Emergency path detection types
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
  requiresImmediateIntervention?: boolean;
}

export interface EmergencyPathResult {
  isEmergencyPath: boolean;
  severity: SeverityLevel;
  flags: EmergencyPathFlag[];
  requiresImmediateIntervention: boolean;
  suggestedAction?: string;
}

export enum EmergencyType {
  CRISIS = 'crisis',
  HARM = 'harm',
  SUICIDAL = 'suicidal',
  DANGEROUS = 'dangerous',
  MODERATE = 'moderate'
}
