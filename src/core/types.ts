
export interface PipelineContext {
  userInput: string;
  userId?: string;
  sessionId?: string;
  conversationHistory?: string[];
  emotionalContext?: any;
  clientPreferences?: any;
  timestamp?: number;
}

export interface PipelineResult {
  response: string;
  confidence: number;
  processingTime: number;
  wasEnhanced: boolean;
  crisisDetected: boolean;
  auditTrail: string[];
  memoryUpdated?: boolean;
  metadata?: any;
}

export interface HealthCheckResult {
  healthy: boolean;
  services: Record<string, boolean>;
  memoryStatus?: any;
  timestamp?: number;
}
