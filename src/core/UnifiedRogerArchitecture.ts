/**
 * Unified Roger Architecture
 * 
 * Master integration system that unifies all legacy and new systems
 * into a single, coherent processing pipeline for optimal patient care
 */

import { unifiedPipeline } from './UnifiedRogerPipeline';
import { unifiedRAGIntegrator } from '../integration/UnifiedRAGIntegrator';
import { unifiedMemoryProcessor } from '../memory/UnifiedMemoryProcessor';
import { educationalMemorySystem } from '../memory/EducationalMemorySystem';
import { ragEvaluationFramework } from '../evaluation/RAGEvaluationFramework';
import { userFeedbackSystem } from '../feedback/UserFeedbackSystem';
import { accessControlSystem } from '../security/AccessControlSystem';
import { processRogerianNervousSystem } from '../utils/rogerianNervousSystem/nervousSystemIntegrator';
import { masterMemory } from '../utils/memory/masterMemory';
import { processUnifiedRAGPipeline } from '../utils/rogerianNervousSystem/pipeline/ragPipelineIntegrator';

export interface UnifiedArchitectureContext {
  userInput: string;
  userId?: string;
  sessionId?: string;
  conversationHistory: string[];
  messageCount: number;
  isNewSession: boolean;
  clientPreferences?: any;
  emotionalContext?: any;
  timestamp: number;
}

export interface UnifiedArchitectureResult {
  response: string;
  confidence: number;
  processingTime: number;
  systemsEngaged: string[];
  memoryLayers: string[];
  ragEnhanced: boolean;
  crisisDetected: boolean;
  evaluationScore: number;
  auditTrail: string[];
  metadata: {
    nervousSystemContext?: any;
    ragData?: any;
    memoryStatus?: any;
    evaluationMetrics?: any;
    legacySystemsUsed?: string[];
    errorMessage?: string;
  };
}

export class UnifiedRogerArchitecture {
  private initialized = false;
  private processingStats = {
    totalRequests: 0,
    averageProcessingTime: 0,
    averageConfidence: 0,
    systemsEngagementCount: new Map<string, number>()
  };

  constructor() {
    this.initializeArchitecture();
  }

  /**
   * Initialize the unified architecture
   */
  private async initializeArchitecture(): Promise<void> {
    console.log("🏗️ UNIFIED ARCHITECTURE: Initializing comprehensive Roger system");
    
    try {
      // Verify all systems are operational
      const healthChecks = await Promise.all([
        unifiedPipeline.healthCheck(),
        this.verifyLegacySystems(),
        this.verifyAdvancedSystems()
      ]);

      const allHealthy = healthChecks.every(check => check.healthy);
      
      if (allHealthy) {
        this.initialized = true;
        console.log("🏗️ UNIFIED ARCHITECTURE: Successfully initialized all systems");
      } else {
        console.warn("🏗️ UNIFIED ARCHITECTURE: Some systems failed health checks", healthChecks);
      }
    } catch (error) {
      console.error("🏗️ UNIFIED ARCHITECTURE: Initialization error:", error);
    }
  }

  /**
   * Main unified processing method - single entry point for all Roger interactions
   */
  async processUnified(context: UnifiedArchitectureContext): Promise<UnifiedArchitectureResult> {
    const startTime = Date.now();
    const systemsEngaged: string[] = [];
    const auditTrail: string[] = [];
    
    if (!this.initialized) {
      await this.initializeArchitecture();
    }

    try {
      console.log(`🏗️ UNIFIED ARCHITECTURE: Processing request for session ${context.sessionId}`);
      auditTrail.push(`Started unified processing at ${new Date().toISOString()}`);

      // Step 1: Legacy Memory System Integration
      console.log("🏗️ Stage 1: Legacy memory integration");
      systemsEngaged.push('legacy-memory');
      
      // Add to legacy memory systems
      masterMemory.addMemory(context.userInput, 'patient', {
        sessionId: context.sessionId,
        messageCount: context.messageCount,
        timestamp: context.timestamp
      }, 0.8);
      
      auditTrail.push("Legacy memory systems engaged");

      // Step 2: Advanced Memory Processing
      console.log("🏗️ Stage 2: Advanced memory processing");
      systemsEngaged.push('unified-memory');
      
      await unifiedMemoryProcessor.addMemory(
        context.userInput,
        'patient',
        {
          conversationHistory: context.conversationHistory,
          emotionalContext: context.emotionalContext,
          messageCount: context.messageCount
        },
        0.8,
        context.sessionId
      );
      
      auditTrail.push("Advanced memory layers updated");

      // Step 3: Nervous System Integration (Legacy + New)
      console.log("🏗️ Stage 3: Nervous system integration");
      systemsEngaged.push('nervous-system');
      
      const nervousSystemResult = await processRogerianNervousSystem(
        context.userInput, // Base response starts with user input
        context.userInput,
        context.conversationHistory,
        context.messageCount
      );
      
      auditTrail.push(`Nervous system processed with ${nervousSystemResult.systemsEngaged.length} subsystems`);

      // Step 4: Crisis Detection Priority Check
      if (nervousSystemResult.context.crisisContext.isCrisisDetected) {
        console.log("🏗️ CRISIS DETECTED: Prioritizing crisis response");
        systemsEngaged.push('crisis-priority');
        
        const crisisResult: UnifiedArchitectureResult = {
          response: nervousSystemResult.enhancedResponse,
          confidence: 0.95, // High confidence for crisis responses
          processingTime: Date.now() - startTime,
          systemsEngaged,
          memoryLayers: ['working', 'crisis'],
          ragEnhanced: false,
          crisisDetected: true,
          evaluationScore: 0.9,
          auditTrail: [...auditTrail, "Crisis response prioritized"],
          metadata: {
            nervousSystemContext: nervousSystemResult.context,
            legacySystemsUsed: ['crisis-detection', 'safety-protocols']
          }
        };
        
        // Store crisis response in memory
        await unifiedMemoryProcessor.addMemory(
          crisisResult.response,
          'roger',
          { crisis: true, priority: 'high' },
          0.95,
          context.sessionId
        );
        
        return crisisResult;
      }

      // Step 5: Unified Pipeline Processing
      console.log("🏗️ Stage 5: Unified pipeline processing");
      systemsEngaged.push('unified-pipeline');
      
      const pipelineResult = await unifiedPipeline.process({
        userInput: context.userInput,
        userId: context.userId,
        sessionId: context.sessionId,
        conversationHistory: context.conversationHistory,
        emotionalContext: context.emotionalContext,
        clientPreferences: context.clientPreferences,
        timestamp: context.timestamp
      });
      
      auditTrail.push(`Unified pipeline completed with confidence ${pipelineResult.confidence}`);

      // Step 6: RAG Enhancement (if pipeline response needs enhancement)
      console.log("🏗️ Stage 6: RAG enhancement evaluation");
      let ragEnhanced = false;
      let ragData = null;
      
      if (pipelineResult.confidence < 0.8) {
        systemsEngaged.push('rag-enhancement');
        
        const ragResult = await processUnifiedRAGPipeline(
          pipelineResult.response,
          context.userInput,
          context.conversationHistory,
          context.messageCount
        );
        
        if (ragResult.ragData.augmentationApplied) {
          pipelineResult.response = ragResult.enhancedResponse;
          ragEnhanced = true;
          ragData = ragResult.ragData;
          auditTrail.push("RAG enhancement applied successfully");
        }
      }

      // Step 7: Educational Memory Integration
      console.log("🏗️ Stage 7: Educational memory integration");
      systemsEngaged.push('educational-memory');
      
      const educationalContext = await educationalMemorySystem.getAdaptiveLearningContext(
        context.sessionId || 'global',
        context.userInput
      );
      
      if (educationalContext.adaptationNeeded) {
        auditTrail.push("Educational memory adaptations applied");
      }

      // Step 8: Response Evaluation
      console.log("🏗️ Stage 8: Response evaluation");
      systemsEngaged.push('evaluation');
      
      const evaluationResult = await ragEvaluationFramework.evaluateRAGResponse({
        query: context.userInput,
        retrievedDocuments: ragData?.retrievalResults?.map(r => r.record?.text || '') || [],
        generatedResponse: pipelineResult.response,
        groundTruth: nervousSystemResult.enhancedResponse,
        context: {
          conversationHistory: context.conversationHistory,
          sessionId: context.sessionId
        }
      });
      
      auditTrail.push(`Response evaluated with score ${evaluationResult.overallScore}`);

      // Step 9: Final Memory Storage
      console.log("🏗️ Stage 9: Final memory storage");
      
      await unifiedMemoryProcessor.addMemory(
        pipelineResult.response,
        'roger',
        {
          originalResponse: nervousSystemResult.enhancedResponse,
          pipelineEnhanced: true,
          ragEnhanced,
          evaluationScore: evaluationResult.overallScore,
          systemsEngaged: systemsEngaged
        },
        evaluationResult.overallScore,
        context.sessionId
      );

      // Legacy memory update
      masterMemory.addMemory(pipelineResult.response, 'roger', {
        unified: true,
        confidence: pipelineResult.confidence
      });

      // Step 10: Feedback Integration
      if (evaluationResult.overallScore < 0.6) {
        systemsEngaged.push('feedback-system');
        await userFeedbackSystem.submitFeedback(
          context.sessionId || 'system',
          context.sessionId || 'system',
          {
            type: 'suggestion',
            content: `Low unified architecture performance: ${evaluationResult.overallScore}`,
            severity: 'medium',
            category: 'unified-architecture'
          }
        );
      }

      // Update processing stats
      this.updateProcessingStats(systemsEngaged, Date.now() - startTime, pipelineResult.confidence);

      // Compile final result
      const finalResult: UnifiedArchitectureResult = {
        response: pipelineResult.response,
        confidence: Math.min(pipelineResult.confidence, evaluationResult.overallScore),
        processingTime: Date.now() - startTime,
        systemsEngaged,
        memoryLayers: ['working', 'short-term', 'long-term', 'educational'],
        ragEnhanced,
        crisisDetected: false,
        evaluationScore: evaluationResult.overallScore,
        auditTrail,
        metadata: {
          nervousSystemContext: nervousSystemResult.context,
          ragData,
          memoryStatus: unifiedMemoryProcessor.getMemoryStatus(),
          evaluationMetrics: evaluationResult,
          legacySystemsUsed: ['master-memory', 'nervous-system', 'personality-insights']
        }
      };

      console.log(`🏗️ UNIFIED ARCHITECTURE: Completed in ${finalResult.processingTime}ms with ${systemsEngaged.length} systems`);
      return finalResult;

    } catch (error) {
      console.error("🏗️ UNIFIED ARCHITECTURE: Processing error:", error);
      auditTrail.push(`Error occurred: ${error.message}`);
      
      // Fallback to nervous system result
      return {
        response: "I'm here to listen and support you. What would you like to share?",
        confidence: 0.5,
        processingTime: Date.now() - startTime,
        systemsEngaged: [...systemsEngaged, 'error-fallback'],
        memoryLayers: ['working'],
        ragEnhanced: false,
        crisisDetected: false,
        evaluationScore: 0.5,
        auditTrail,
        metadata: {
          errorMessage: error.message,
          legacySystemsUsed: ['fallback']
        }
      };
    }
  }

  /**
   * Verify legacy systems are operational
   */
  private async verifyLegacySystems(): Promise<{ healthy: boolean }> {
    try {
      // Check legacy memory system
      const memoryStatus = masterMemory.getMessageCount();
      
      // Check if nervous system components are available
      const nervousSystemHealthy = typeof processRogerianNervousSystem === 'function';
      
      return {
        healthy: nervousSystemHealthy && typeof memoryStatus === 'number'
      };
    } catch (error) {
      console.error("Legacy systems verification failed:", error);
      return { healthy: false };
    }
  }

  /**
   * Verify advanced systems are operational
   */
  private async verifyAdvancedSystems(): Promise<{ healthy: boolean }> {
    try {
      const healthChecks = await Promise.all([
        unifiedRAGIntegrator ? Promise.resolve(true) : Promise.resolve(false),
        unifiedMemoryProcessor ? Promise.resolve(true) : Promise.resolve(false),
        educationalMemorySystem ? Promise.resolve(true) : Promise.resolve(false)
      ]);
      
      return {
        healthy: healthChecks.every(check => check)
      };
    } catch (error) {
      console.error("Advanced systems verification failed:", error);
      return { healthy: false };
    }
  }

  /**
   * Update processing statistics
   */
  private updateProcessingStats(systems: string[], processingTime: number, confidence: number): void {
    this.processingStats.totalRequests++;
    
    // Update average processing time
    this.processingStats.averageProcessingTime = 
      (this.processingStats.averageProcessingTime * (this.processingStats.totalRequests - 1) + processingTime) / 
      this.processingStats.totalRequests;
    
    // Update average confidence
    this.processingStats.averageConfidence = 
      (this.processingStats.averageConfidence * (this.processingStats.totalRequests - 1) + confidence) / 
      this.processingStats.totalRequests;
    
    // Update system engagement counts
    systems.forEach(system => {
      const current = this.processingStats.systemsEngagementCount.get(system) || 0;
      this.processingStats.systemsEngagementCount.set(system, current + 1);
    });
  }

  /**
   * Get comprehensive system status
   */
  async getSystemStatus() {
    const unifiedStatus = await unifiedPipeline.getSystemStatus();
    
    return {
      unified: unifiedStatus,
      architecture: {
        initialized: this.initialized,
        stats: this.processingStats,
        systemEngagement: Object.fromEntries(this.processingStats.systemsEngagementCount)
      },
      memory: {
        unified: unifiedMemoryProcessor.getMemoryStatus(),
        legacy: {
          messageCount: masterMemory.getMessageCount(),
          isNewConversation: masterMemory.isNewConversation("")
        },
        educational: educationalMemorySystem.getEducationalMemoryStatus()
      },
      timestamp: Date.now()
    };
  }

  /**
   * Reset for new conversation
   */
  async resetForNewConversation(): Promise<void> {
    console.log("🏗️ UNIFIED ARCHITECTURE: Resetting for new conversation");
    
    // Reset legacy systems
    masterMemory.resetMemory();
    
    // Reset stats for this conversation
    this.processingStats.systemsEngagementCount.clear();
    
    console.log("🏗️ UNIFIED ARCHITECTURE: Reset complete");
  }
}

// Export singleton instance
export const unifiedRogerArchitecture = new UnifiedRogerArchitecture();
