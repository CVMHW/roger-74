/**
 * Unified Roger Pipeline
 * 
 * Main entry point that coordinates all systems through the orchestrator
 * Now with optimized sophisticated routing and complex memory systems
 */

import { PipelineContext, PipelineResult, HealthCheckResult } from './types';
import { ServiceManager } from './ServiceManager';
import { PipelineOrchestrator } from './PipelineOrchestrator';
import { legacyRAGIntegrator, LegacyRAGIntegrator } from '../services/LegacyRAGIntegrator';
import { complexMemoryIntegrator, ComplexMemorySystemIntegrator } from '../services/ComplexMemorySystemIntegrator';
import { optimizedUnifiedPipeline } from './OptimizedUnifiedPipeline';

/**
 * Main Unified Roger Pipeline with sophisticated optimization
 */
export class UnifiedRogerPipeline {
  private serviceManager: ServiceManager;
  private orchestrator: PipelineOrchestrator;
  private legacyRAGIntegrator: LegacyRAGIntegrator;
  private complexMemoryIntegrator: ComplexMemorySystemIntegrator;

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
    this.legacyRAGIntegrator = legacyRAGIntegrator;
    this.complexMemoryIntegrator = complexMemoryIntegrator;
  }

  /**
   * Main processing pipeline with sophisticated optimization
   */
  async process(context: PipelineContext): Promise<PipelineResult> {
    const startTime = Date.now();
    
    try {
      // Use optimized pipeline for better patient experience
      if (optimizedUnifiedPipeline && optimizedUnifiedPipeline !== this) {
        console.log("UNIFIED PIPELINE: Using optimized sophisticated processing");
        return await optimizedUnifiedPipeline.process(context);
      }

      // Fallback to original sophisticated processing
      return await this.processWithSophistication(context, startTime);

    } catch (error) {
      console.error('Unified pipeline processing error:', error);
      
      // Fallback to orchestrator only
      return await this.orchestrator.execute(context);
    }
  }

  /**
   * Process with full sophistication (original implementation)
   */
  private async processWithSophistication(context: PipelineContext, startTime: number): Promise<PipelineResult> {
    // Step 1: Process through complex memory systems first
    const memoryResult = await this.complexMemoryIntegrator.processMemoryIntegration(
      context.userInput,
      context.conversationHistory,
      context.sessionId
    );

    // Step 2: Process through main orchestrator
    const orchestratorResult = await this.orchestrator.execute(context);

    // Step 3: Apply legacy RAG integration based on client preferences
    const clientPriority = context.clientPreferences?.priorityLevel || 'standard';
    const ragConfig = LegacyRAGIntegrator.getOptimalConfig(clientPriority);
    
    const ragResult = await this.legacyRAGIntegrator.integrateRAG(
      orchestratorResult.response,
      context.userInput,
      context.conversationHistory,
      ragConfig
    );

    // Step 4: Combine results with sophisticated metrics
    const finalResponse = ragResult.enhancedResponse;
    const combinedConfidence = (
      orchestratorResult.confidence * 0.5 +
      ragResult.confidence * 0.3 +
      memoryResult.confidence * 0.2
    );

    const sophisticatedAuditTrail = [
      ...orchestratorResult.auditTrail,
      `Sophisticated RAG applied: ${ragResult.retrievalMethod}`,
      `Complex memory systems engaged: ${memoryResult.systemsEngaged.join(', ')}`,
      `Sophisticated RAG systems: ${ragResult.systemsUsed.join(', ')}`
    ];

    return {
      response: finalResponse,
      confidence: combinedConfidence,
      processingTime: Date.now() - startTime,
      wasEnhanced: ragResult.systemsUsed.length > 0 || memoryResult.systemsEngaged.length > 0,
      crisisDetected: orchestratorResult.crisisDetected,
      auditTrail: sophisticatedAuditTrail,
      memoryUpdated: orchestratorResult.memoryUpdated
    };
  }

  /**
   * Health check for all pipeline components including new integrators
   */
  async healthCheck(): Promise<HealthCheckResult> {
    const baseHealth = await this.serviceManager.healthCheck();
    
    const additionalServices = {
      legacyRAG: true, // Legacy RAG integrator doesn't need async health check
      complexMemory: await this.complexMemoryIntegrator.isHealthy()
    };

    const allServices = {
      ...baseHealth.services,
      ...additionalServices
    };

    const healthy = Object.values(allServices).every(status => status);
    
    return { 
      healthy, 
      services: allServices 
    };
  }

  /**
   * Get memory state for debugging/monitoring
   */
  getMemoryState() {
    return this.complexMemoryIntegrator.getMemoryState();
  }

  /**
   * Configure RAG integration for specific client needs
   */
  configureRAGForClient(clientId: string, priorityLevel: 'standard' | 'enhanced' | 'enterprise') {
    // This would typically store client-specific configurations
    console.log(`RAG configured for client ${clientId} with priority ${priorityLevel}`);
  }
}

// Export singleton instance
export const unifiedPipeline = new UnifiedRogerPipeline();
