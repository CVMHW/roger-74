
/**
 * Optimized Unified Pipeline
 * 
 * Maintains sophisticated complexity while optimizing flowchart efficiency
 * Uses smart routing to engage appropriate sophistication levels
 */

import { PipelineContext, PipelineResult } from './types';
import { UnifiedRogerPipeline } from './UnifiedRogerPipeline';
import { smartPipelineRouter, SmartPipelineRouter } from './SmartPipelineRouter';

/**
 * Optimized Unified Pipeline with sophisticated smart routing
 */
export class OptimizedUnifiedPipeline extends UnifiedRogerPipeline {
  private smartRouter: SmartPipelineRouter;

  constructor() {
    super();
    this.smartRouter = smartPipelineRouter;
  }

  /**
   * Process with optimized sophisticated routing
   */
  async process(context: PipelineContext): Promise<PipelineResult> {
    const startTime = Date.now();
    
    try {
      // Step 1: Smart routing decision with sophistication analysis
      const routeDecision = this.smartRouter.determineOptimalRoute(context);
      console.log(`OPTIMIZED PIPELINE: Route ${routeDecision.route} with ${routeDecision.sophisticationLevel} sophistication`);

      // Step 2: Execute sophisticated processing based on optimal route
      const sophisticatedResult = await this.smartRouter.executeSophisticatedRoute(
        context,
        routeDecision
      );

      // Step 3: Apply additional sophisticated enhancements if needed
      const finalResponse = await this.applySophisticatedEnhancements(
        sophisticatedResult.enhancedResponse,
        context,
        routeDecision
      );

      const processingTime = Date.now() - startTime;
      
      return {
        response: finalResponse,
        confidence: this.calculateSophisticatedConfidence(routeDecision, sophisticatedResult),
        processingTime,
        wasEnhanced: sophisticatedResult.systemsEngaged.length > 0,
        crisisDetected: routeDecision.route === 'crisis',
        auditTrail: [
          `Smart route: ${routeDecision.route}`,
          `Sophistication level: ${routeDecision.sophisticationLevel}`,
          `Systems engaged: ${sophisticatedResult.systemsEngaged.join(', ')}`,
          `Processing complexity: ${sophisticatedResult.sophisticationMetrics.processingComplexity}`
        ],
        memoryUpdated: true
      };

    } catch (error) {
      console.error('Optimized unified pipeline error:', error);
      
      // Fallback to full sophisticated processing
      return await super.process(context);
    }
  }

  /**
   * Apply sophisticated enhancements based on route decision
   */
  private async applySophisticatedEnhancements(
    response: string,
    context: PipelineContext,
    routeDecision: any
  ): Promise<string> {
    let enhancedResponse = response;

    // Apply sophisticated personality integration for all routes
    try {
      const { getRogerPersonalityInsight } = await import('../utils/reflection/rogerPersonality');
      const personalityInsight = getRogerPersonalityInsight(context.userInput);
      
      if (personalityInsight && personalityInsight.trim().length > 0) {
        enhancedResponse += ` ${personalityInsight}`;
      }
    } catch (error) {
      console.warn('Sophisticated personality enhancement error:', error);
    }

    // Apply sophisticated memory enhancements for complex routes
    if (routeDecision.sophisticationLevel === 'enhanced' || routeDecision.sophisticationLevel === 'full') {
      try {
        const { masterMemory } = await import('../utils/memory');
        const memoryInsight = masterMemory.getRelevantMemories(context.userInput);
        
        if (memoryInsight.length > 0) {
          const recentMemory = memoryInsight[0];
          if (recentMemory.content && !enhancedResponse.includes(recentMemory.content)) {
            enhancedResponse = `Remembering our conversation about ${recentMemory.type}, ${enhancedResponse}`;
          }
        }
      } catch (error) {
        console.warn('Sophisticated memory enhancement error:', error);
      }
    }

    return enhancedResponse;
  }

  /**
   * Calculate sophisticated confidence based on systems engaged
   */
  private calculateSophisticatedConfidence(routeDecision: any, result: any): number {
    const baseConfidence = 0.7;
    const sophisticationBonus = {
      'basic': 0.1,
      'enhanced': 0.15,
      'full': 0.2
    };
    
    const systemsBonus = Math.min(result.systemsEngaged.length * 0.05, 0.2);
    const routeBonus = routeDecision.route === 'crisis' ? 0.3 : 0.1;
    
    return Math.min(baseConfidence + sophisticationBonus[routeDecision.sophisticationLevel] + systemsBonus + routeBonus, 1.0);
  }

  /**
   * Health check with sophisticated routing metrics
   */
  async healthCheck(): Promise<any> {
    const baseHealth = await super.healthCheck();
    
    return {
      ...baseHealth,
      sophisticatedRouting: {
        smartRouter: true,
        optimizationLevel: 'sophisticated',
        routingComplexity: 'advanced'
      }
    };
  }
}

// Export optimized instance
export const optimizedUnifiedPipeline = new OptimizedUnifiedPipeline();
