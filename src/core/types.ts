
/**
 * Core types for the Unified Roger Pipeline
 */

export interface PipelineContext {
  userInput: string;
  conversationHistory: string[];
  userId?: string;
  sessionId: string;
  timestamp: number;
  clientPreferences?: any;
  emergencyContext?: boolean;
}

export interface PipelineResult {
  response: string;
  confidence: number;
  processingTime: number;
  wasEnhanced: boolean;
  crisisDetected: boolean;
  auditTrail: string[];
  memoryUpdated: boolean;
}

export interface HealthCheckResult {
  healthy: boolean;
  services: Record<string, boolean>;
}
