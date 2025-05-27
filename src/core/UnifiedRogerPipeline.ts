
/**
 * Unified Roger Pipeline
 * 
 * Main entry point that coordinates all systems through the orchestrator
 */

import { PipelineContext, PipelineResult, HealthCheckResult } from './types';
import { ServiceManager } from './ServiceManager';
import { PipelineOrchestrator } from './PipelineOrchestrator';

/**
 * Main Unified Roger Pipeline
 * Simplified entry point that delegates to the orchestrator
 */
export class UnifiedRogerPipeline {
  private serviceManager: ServiceManager;
  private orchestrator: PipelineOrchestrator;

  constructor() {
    this.serviceManager = new ServiceManager();
    this.orchestrator = new PipelineOrchestrator(
      this.serviceManager.crisisService,
      this.serviceManager.emotionService,
      this.serviceManager.memoryService,
      this.serviceManager.ragService,
      this.serviceManager.personalityService,
      this.serviceManager.responseService,
      this.serviceManager.hipaaCompliance
    );
  }

  /**
   * Main processing pipeline
   */
  async process(context: PipelineContext): Promise<PipelineResult> {
    return await this.orchestrator.execute(context);
  }

  /**
   * Health check for all pipeline components
   */
  async healthCheck(): Promise<HealthCheckResult> {
    return await this.serviceManager.healthCheck();
  }
}

// Export singleton instance
export const unifiedPipeline = new UnifiedRogerPipeline();
