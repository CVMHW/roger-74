
/**
 * System Integration Coordinator
 * 
 * Coordinates all RAG and memory systems while maintaining client prioritization
 * Ensures no conflicts between legacy and new systems
 */

import { unifiedPipeline } from '../core/UnifiedRogerPipeline';
import { legacyRAGIntegrator } from './LegacyRAGIntegrator';
import { complexMemoryIntegrator } from './ComplexMemorySystemIntegrator';

export interface IntegrationConfig {
  clientPriorityLevel: 'standard' | 'enhanced' | 'enterprise';
  enableLegacyRAG: boolean;
  enableComplexMemory: boolean;
  preserveClientExperience: boolean;
  hipaaCompliance: boolean;
  performanceOptimization: boolean;
}

export interface IntegrationResult {
  response: string;
  systemsUsed: string[];
  performanceMetrics: {
    processingTime: number;
    memoryUsage: string;
    systemsEngaged: number;
  };
  clientSatisfaction: {
    prioritizationMaintained: boolean;
    responseQuality: number;
    systemReliability: number;
  };
}

/**
 * System Integration Coordinator
 * Ensures seamless integration without client impact
 */
export class SystemIntegrationCoordinator {
  private defaultConfig: IntegrationConfig = {
    clientPriorityLevel: 'standard',
    enableLegacyRAG: true,
    enableComplexMemory: true,
    preserveClientExperience: true,
    hipaaCompliance: true,
    performanceOptimization: true
  };

  /**
   * Coordinate all systems for optimal client experience
   */
  async coordinateIntegration(
    userInput: string,
    conversationHistory: string[],
    sessionId: string,
    config?: Partial<IntegrationConfig>
  ): Promise<IntegrationResult> {
    const finalConfig = { ...this.defaultConfig, ...config };
    const startTime = Date.now();
    const systemsUsed: string[] = [];

    try {
      // Create pipeline context
      const pipelineContext = {
        userInput,
        conversationHistory,
        sessionId,
        timestamp: Date.now(),
        clientPreferences: {
          priorityLevel: finalConfig.clientPriorityLevel
        }
      };

      // Process through unified pipeline
      const result = await unifiedPipeline.process(pipelineContext);
      systemsUsed.push('unified-pipeline');

      const processingTime = Date.now() - startTime;

      // Assess client satisfaction metrics
      const clientSatisfaction = this.assessClientSatisfaction(
        result,
        finalConfig,
        processingTime
      );

      return {
        response: result.response,
        systemsUsed: [...systemsUsed, ...result.auditTrail],
        performanceMetrics: {
          processingTime,
          memoryUsage: this.calculateMemoryUsage(),
          systemsEngaged: systemsUsed.length
        },
        clientSatisfaction
      };

    } catch (error) {
      console.error('System integration coordination error:', error);
      
      return {
        response: "I'm here to listen. What would you like to share?",
        systemsUsed: ['fallback-system'],
        performanceMetrics: {
          processingTime: Date.now() - startTime,
          memoryUsage: 'minimal',
          systemsEngaged: 1
        },
        clientSatisfaction: {
          prioritizationMaintained: true,
          responseQuality: 0.7,
          systemReliability: 0.8
        }
      };
    }
  }

  /**
   * Assess client satisfaction with integration
   */
  private assessClientSatisfaction(
    result: any,
    config: IntegrationConfig,
    processingTime: number
  ): {
    prioritizationMaintained: boolean;
    responseQuality: number;
    systemReliability: number;
  } {
    // Assess if prioritization was maintained
    const prioritizationMaintained = processingTime < this.getMaxProcessingTime(config.clientPriorityLevel);
    
    // Assess response quality based on confidence and enhancement
    const responseQuality = Math.min(
      result.confidence + (result.wasEnhanced ? 0.1 : 0),
      1.0
    );
    
    // Assess system reliability
    const systemReliability = result.crisisDetected ? 1.0 : 0.9;
    
    return {
      prioritizationMaintained,
      responseQuality,
      systemReliability
    };
  }

  /**
   * Get maximum processing time based on client priority
   */
  private getMaxProcessingTime(priorityLevel: string): number {
    switch (priorityLevel) {
      case 'enterprise': return 3000; // 3 seconds
      case 'enhanced': return 2000;   // 2 seconds
      default: return 1500;           // 1.5 seconds
    }
  }

  /**
   * Calculate current memory usage
   */
  private calculateMemoryUsage(): string {
    // Simplified memory usage calculation
    const memoryState = complexMemoryIntegrator.getMemoryState();
    const components = [
      memoryState.working.currentContext.length,
      memoryState.shortTerm.recentExchanges.length,
      memoryState.longTerm.persistentPatterns.size,
      memoryState.activeConversation.participantProfiles.size,
      memoryState.vectoredEducational.knowledgeVectors.size
    ];
    
    const totalComponents = components.reduce((sum, count) => sum + count, 0);
    
    if (totalComponents > 100) return 'high';
    if (totalComponents > 50) return 'medium';
    return 'low';
  }

  /**
   * Health check for all integrated systems
   */
  async performSystemHealthCheck(): Promise<{
    overall: boolean;
    details: Record<string, boolean>;
    recommendations: string[];
  }> {
    const healthCheck = await unifiedPipeline.healthCheck();
    const recommendations: string[] = [];
    
    if (!healthCheck.healthy) {
      recommendations.push('Some systems need attention');
    }
    
    if (!healthCheck.services.legacyRAG) {
      recommendations.push('Legacy RAG system needs maintenance');
    }
    
    if (!healthCheck.services.complexMemory) {
      recommendations.push('Complex memory system needs attention');
    }
    
    return {
      overall: healthCheck.healthy,
      details: healthCheck.services,
      recommendations
    };
  }

  /**
   * Optimize systems for specific client needs
   */
  optimizeForClient(clientId: string, requirements: {
    responseTime: 'fast' | 'standard' | 'comprehensive';
    memoryDepth: 'minimal' | 'standard' | 'extensive';
    ragComplexity: 'basic' | 'enhanced' | 'advanced';
  }): IntegrationConfig {
    let priorityLevel: 'standard' | 'enhanced' | 'enterprise' = 'standard';
    
    if (requirements.responseTime === 'comprehensive' && 
        requirements.memoryDepth === 'extensive' &&
        requirements.ragComplexity === 'advanced') {
      priorityLevel = 'enterprise';
    } else if (requirements.responseTime === 'standard' &&
               requirements.memoryDepth === 'standard' &&
               requirements.ragComplexity === 'enhanced') {
      priorityLevel = 'enhanced';
    }
    
    return {
      clientPriorityLevel: priorityLevel,
      enableLegacyRAG: requirements.ragComplexity !== 'basic',
      enableComplexMemory: requirements.memoryDepth !== 'minimal',
      preserveClientExperience: true,
      hipaaCompliance: true,
      performanceOptimization: requirements.responseTime === 'fast'
    };
  }
}

// Export singleton instance
export const systemIntegrationCoordinator = new SystemIntegrationCoordinator();
