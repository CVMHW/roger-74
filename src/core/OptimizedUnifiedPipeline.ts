
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
      // Use optimized response processor for better performance
      const { processOptimizedResponse } = await import('../utils/response/optimizedResponseProcessor');
      
      const optimizedResult = await processOptimizedResponse(
        context.userInput,
        context.conversationHistory
      );

      // If it's a simple greeting, return immediately
      if (optimizedResult.routeType === 'greeting') {
        return {
          response: optimizedResult.response,
          confidence: optimizedResult.confidence,
          processingTime: optimizedResult.processingTime,
          wasEnhanced: false,
          crisisDetected: false,
          auditTrail: [`Optimized ${optimizedResult.routeType} route: ${optimizedResult.processingTime}ms`],
          memoryUpdated: false
        };
      }

      // For crisis, emotional, and complex - continue with original sophisticated processing
      const routeDecision = this.smartRouter.determineOptimalRoute(context);
      console.log(`OPTIMIZED PIPELINE: Route ${routeDecision.route} with ${routeDecision.sophisticationLevel} sophistication`);

      const sophisticatedResult = await this.smartRouter.executeSophisticatedRoute(
        context,
        routeDecision
      );

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
          `Optimized route: ${optimizedResult.routeType} -> ${routeDecision.route}`,
          `Sophistication level: ${routeDecision.sophisticationLevel}`,
          `Systems engaged: ${sophisticatedResult.systemsEngaged.join(', ')}`,
          `Total processing: ${processingTime}ms`
        ],
        memoryUpdated: true
      };

    } catch (error) {
      console.error('Optimized unified pipeline error:', error);
      
      // Fallback to original processing
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
        const memoryResults = masterMemory.searchMemory({ query: context.userInput, limit: 3 });
        
        if (memoryResults.length > 0) {
          const recentMemory = memoryResults[0];
          if (recentMemory.content && !enhancedResponse.includes(recentMemory.content)) {
            enhancedResponse = `Remembering our conversation about ${recentMemory.type || 'your concerns'}, ${enhancedResponse}`;
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
