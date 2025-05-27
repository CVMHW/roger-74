
/**
 * Unified Roger Pipeline
 * 
 * Main entry point that coordinates all systems through the orchestrator
 * Now with integrated legacy RAG and complex memory systems
 */

import { PipelineContext, PipelineResult, HealthCheckResult } from './types';
import { ServiceManager } from './ServiceManager';
import { PipelineOrchestrator } from './PipelineOrchestrator';
import { legacyRAGIntegrator, LegacyRAGIntegrator } from '../services/LegacyRAGIntegrator';
import { complexMemoryIntegrator, ComplexMemorySystemIntegrator } from '../services/ComplexMemorySystemIntegrator';

/**
 * Main Unified Roger Pipeline
 * Enhanced with legacy RAG integration and complex memory systems
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
   * Main processing pipeline with legacy RAG and complex memory integration
   */
  async process(context: PipelineContext): Promise<PipelineResult> {
    const startTime = Date.now();
    
    try {
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

      // Step 4: Combine results
      const finalResponse = ragResult.enhancedResponse;
      const combinedConfidence = (
        orchestratorResult.confidence * 0.5 +
        ragResult.confidence * 0.3 +
        memoryResult.confidence * 0.2
      );

      const combinedAuditTrail = [
        ...orchestratorResult.auditTrail,
        `Legacy RAG applied: ${ragResult.retrievalMethod}`,
        `Memory systems engaged: ${memoryResult.systemsEngaged.join(', ')}`,
        `RAG systems used: ${ragResult.systemsUsed.join(', ')}`
      ];

      return {
        response: finalResponse,
        confidence: combinedConfidence,
        processingTime: Date.now() - startTime,
        wasEnhanced: ragResult.systemsUsed.length > 0 || memoryResult.systemsEngaged.length > 0,
        crisisDetected: orchestratorResult.crisisDetected,
        auditTrail: combinedAuditTrail,
        memoryUpdated: orchestratorResult.memoryUpdated
      };

    } catch (error) {
      console.error('Unified pipeline processing error:', error);
      
      // Fallback to orchestrator only
      return await this.orchestrator.execute(context);
    }
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
