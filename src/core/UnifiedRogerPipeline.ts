
/**
 * Updated Unified Roger Pipeline
 * 
 * Now integrates all new systems including feedback and evaluation
 */

import { PipelineContext, PipelineResult, HealthCheckResult } from './types';
import { ServiceManager } from './ServiceManager';
import { PipelineOrchestrator } from './PipelineOrchestrator';
import { unifiedRAGIntegrator } from '../integration/UnifiedRAGIntegrator';
import { unifiedMemoryProcessor } from '../memory/UnifiedMemoryProcessor';
import { userFeedbackSystem } from '../feedback/UserFeedbackSystem';
import { ragEvaluationFramework } from '../evaluation/RAGEvaluationFramework';
import { accessControlSystem } from '../security/AccessControlSystem';

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
   * Main processing pipeline with full integration
   */
  async process(context: PipelineContext): Promise<PipelineResult> {
    const startTime = Date.now();
    
    try {
      console.log("🔄 UNIFIED PIPELINE: Starting fully integrated processing");
      
      // Step 1: Access control validation
      let sessionId = context.sessionId;
      if (!sessionId) {
        sessionId = await accessControlSystem.createUserSession(
          context.userId || `user_${Date.now()}`,
          { privacyLevel: 'private' }
        );
        context.sessionId = sessionId;
      }

      // Step 2: Process through orchestrator
      const orchestratorResult = await this.orchestrator.execute(context);
      
      // Step 3: Memory processing through unified processor
      await unifiedMemoryProcessor.addMemory(
        context.userInput,
        'patient',
        {
          sessionId: context.sessionId,
          orchestratorConfidence: orchestratorResult.confidence,
          emotionalContext: context.emotionalContext || {}
        },
        0.8,
        context.sessionId
      );

      // Step 4: Unified RAG processing
      const ragResult = await unifiedRAGIntegrator.processUnifiedRAG(
        orchestratorResult.response,
        {
          userInput: context.userInput,
          conversationHistory: context.conversationHistory || [],
          sessionId: context.sessionId,
          emotionalContext: context.emotionalContext || {},
          clientPreferences: context.clientPreferences
        }
      );

      // Step 5: Evaluation framework assessment
      const evaluationResult = await ragEvaluationFramework.evaluateResponse({
        query: context.userInput,
        retrievedDocuments: ragResult.retrievalResults.map(r => r.record?.text || ''),
        generatedResponse: ragResult.enhancedResponse,
        groundTruth: orchestratorResult.response,
        context: {
          conversationHistory: context.conversationHistory,
          sessionId: context.sessionId
        }
      });

      // Step 6: Feedback system integration
      if (evaluationResult.overallScore < 0.6) {
        await userFeedbackSystem.submitFeedback(
          context.sessionId,
          context.sessionId,
          {
            type: 'suggestion',
            content: `Pipeline performance below threshold: ${evaluationResult.overallScore}`,
            severity: 'medium',
            category: 'pipeline-performance'
          }
        );
      }

      // Step 7: Store enhanced response in memory
      await unifiedMemoryProcessor.addMemory(
        ragResult.enhancedResponse,
        'roger',
        {
          originalResponse: orchestratorResult.response,
          ragApplied: true,
          evaluationScore: evaluationResult.overallScore,
          systemsEngaged: ragResult.systemsEngaged
        },
        0.9,
        context.sessionId
      );

      // Step 8: Compile comprehensive result
      const finalResult: PipelineResult = {
        response: ragResult.enhancedResponse,
        confidence: Math.min(
          orchestratorResult.confidence,
          ragResult.confidence,
          evaluationResult.overallScore
        ),
        processingTime: Date.now() - startTime,
        wasEnhanced: ragResult.systemsEngaged.length > 0,
        crisisDetected: orchestratorResult.crisisDetected,
        auditTrail: [
          ...orchestratorResult.auditTrail,
          `Unified RAG applied: ${ragResult.chunkingStrategy}`,
          `Memory layers engaged: ${ragResult.memoryIntegration.layersUsed.join(', ')}`,
          `Evaluation score: ${evaluationResult.overallScore}`,
          `Systems engaged: ${ragResult.systemsEngaged.join(', ')}`
        ],
        memoryUpdated: true,
        metadata: {
          ragResult,
          evaluationResult,
          memoryStatus: unifiedMemoryProcessor.getMemoryStatus()
        }
      };

      console.log(`🔄 UNIFIED PIPELINE: Complete. Final confidence: ${finalResult.confidence}`);
      return finalResult;

    } catch (error) {
      console.error('🔄 UNIFIED PIPELINE: Processing error:', error);
      
      // Enhanced fallback with basic memory storage
      try {
        await unifiedMemoryProcessor.addMemory(
          context.userInput,
          'patient',
          { error: true, fallback: true },
          0.3,
          context.sessionId
        );
      } catch (memoryError) {
        console.error('Memory fallback also failed:', memoryError);
      }
      
      return await this.orchestrator.execute(context);
    }
  }

  /**
   * Enhanced health check including all new systems
   */
  async healthCheck(): Promise<HealthCheckResult> {
    const baseHealth = await this.serviceManager.healthCheck();
    
    const additionalServices = {
      unifiedMemory: true,
      unifiedRAG: true,
      feedbackSystem: true,
      evaluationFramework: true,
      accessControl: true
    };

    const allServices = {
      ...baseHealth.services,
      ...additionalServices
    };

    const healthy = Object.values(allServices).every(status => status);
    
    return { 
      healthy, 
      services: allServices,
      memoryStatus: unifiedMemoryProcessor.getMemoryStatus(),
      timestamp: Date.now()
    };
  }

  /**
   * Get comprehensive system status
   */
  async getSystemStatus() {
    const healthCheck = await this.healthCheck();
    const memoryStatus = unifiedMemoryProcessor.getMemoryStatus();
    const feedbackStatus = userFeedbackSystem.getFeedbackSystemStatus();
    
    return {
      health: healthCheck,
      memory: memoryStatus,
      feedback: feedbackStatus,
      timestamp: Date.now()
    };
  }
}

export const unifiedPipeline = new UnifiedRogerPipeline();
