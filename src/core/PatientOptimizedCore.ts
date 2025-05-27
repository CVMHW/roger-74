
/**
 * Patient Optimized Core - Unified Integration
 * 
 * Now integrates with the unified pipeline system
 * Eliminates redundancy while maintaining all therapeutic capabilities
 */

import { UnifiedPatientPipeline, UnifiedPatientContext, UnifiedPatientResult } from './UnifiedPatientPipeline';

export interface PatientContext {
  userInput: string;
  sessionId: string;
  messageCount: number;
  isNewSession: boolean;
}

export interface OptimizedResult {
  response: string;
  confidence: number;
  processingTimeMs: number;
  crisisDetected: boolean;
  systemsUsed: string[];
  therapeuticQuality: number;
}

/**
 * Patient Optimized Core - Now uses unified pipeline
 */
export class PatientOptimizedCore {
  private unifiedPipeline: UnifiedPatientPipeline;

  constructor() {
    this.unifiedPipeline = new UnifiedPatientPipeline();
  }

  /**
   * Process through unified pipeline (maintains legacy interface)
   */
  async process(context: PatientContext): Promise<OptimizedResult> {
    const unifiedContext: UnifiedPatientContext = {
      userInput: context.userInput,
      sessionId: context.sessionId,
      messageCount: context.messageCount,
      isNewSession: context.isNewSession,
      conversationHistory: [],
      timestamp: Date.now()
    };

    const result = await this.unifiedPipeline.process(unifiedContext);

    // Convert to legacy format for backward compatibility
    return {
      response: result.response,
      confidence: result.confidence,
      processingTimeMs: result.processingTimeMs,
      crisisDetected: result.crisisDetected,
      systemsUsed: result.systemsEngaged,
      therapeuticQuality: result.therapeuticQuality
    };
  }

  /**
   * Health check
   */
  async isHealthy(): Promise<boolean> {
    return await this.unifiedPipeline.isHealthy();
  }
}
