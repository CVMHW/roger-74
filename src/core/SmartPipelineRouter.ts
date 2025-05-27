
/**
 * Smart Pipeline Router
 * 
 * Optimizes the sophisticated pipeline flow while maintaining complexity
 * Routes patients through appropriate sophistication levels based on interaction type
 */

import { PipelineContext } from './types';

export interface RouteDecision {
  route: 'simple' | 'emotional' | 'crisis' | 'complex';
  sophisticationLevel: 'basic' | 'enhanced' | 'full';
  systemsToEngage: string[];
  priorityLevel: number;
  estimatedProcessingTime: number;
}

export interface SmartRoutingConfig {
  enableAdvancedRouting: boolean;
  sophisticationThreshold: number;
  performanceOptimization: boolean;
  maintainComplexity: boolean;
}

/**
 * Smart Pipeline Router for sophisticated system optimization
 */
export class SmartPipelineRouter {
  private config: SmartRoutingConfig = {
    enableAdvancedRouting: true,
    sophisticationThreshold: 0.7,
    performanceOptimization: true,
    maintainComplexity: true
  };

  /**
   * Determine optimal route through sophisticated pipeline
   */
  public determineOptimalRoute(context: PipelineContext): RouteDecision {
    const { userInput, conversationHistory, clientPreferences } = context;
    
    // Crisis detection gets highest sophistication immediately
    if (this.detectsCrisisContent(userInput)) {
      return {
        route: 'crisis',
        sophisticationLevel: 'full',
        systemsToEngage: [
          'crisis-processor',
          'memory-integrator',
          'rag-enhancer',
          'personality-processor',
          'complex-memory-systems',
          'legacy-rag-integration'
        ],
        priorityLevel: 1000,
        estimatedProcessingTime: 500 // Fast for crisis
      };
    }

    // Emotional content gets enhanced sophistication
    if (this.detectsEmotionalContent(userInput)) {
      return {
        route: 'emotional',
        sophisticationLevel: 'enhanced',
        systemsToEngage: [
          'emotion-processor',
          'memory-integrator',
          'rag-enhancer',
          'personality-processor',
          'complex-memory-systems'
        ],
        priorityLevel: 800,
        estimatedProcessingTime: 1200
      };
    }

    // Complex queries get full sophisticated processing
    if (this.detectsComplexQuery(userInput, conversationHistory)) {
      return {
        route: 'complex',
        sophisticationLevel: 'full',
        systemsToEngage: [
          'emotion-processor',
          'memory-integrator',
          'rag-enhancer',
          'personality-processor',
          'complex-memory-systems',
          'legacy-rag-integration',
          'nervous-system-integration'
        ],
        priorityLevel: 700,
        estimatedProcessingTime: 2000
      };
    }

    // Simple interactions still get sophisticated processing but optimized
    return {
      route: 'simple',
      sophisticationLevel: 'basic',
      systemsToEngage: [
        'emotion-processor',
        'memory-integrator',
        'personality-processor'
      ],
      priorityLevel: 500,
      estimatedProcessingTime: 800
    };
  }

  /**
   * Execute sophisticated processing based on route decision
   */
  public async executeSophisticatedRoute(
    context: PipelineContext,
    routeDecision: RouteDecision
  ): Promise<{
    enhancedResponse: string;
    sophisticationMetrics: any;
    systemsEngaged: string[];
  }> {
    const startTime = Date.now();
    let enhancedResponse = '';
    const systemsEngaged: string[] = [];

    try {
      switch (routeDecision.route) {
        case 'crisis':
          return await this.executeCrisisSophistication(context, routeDecision);
        
        case 'emotional':
          return await this.executeEmotionalSophistication(context, routeDecision);
        
        case 'complex':
          return await this.executeComplexSophistication(context, routeDecision);
        
        case 'simple':
          return await this.executeOptimizedSophistication(context, routeDecision);
        
        default:
          return await this.executeComplexSophistication(context, routeDecision);
      }
    } catch (error) {
      console.error('Smart router sophisticated processing error:', error);
      
      // Fallback to complex sophistication
      return await this.executeComplexSophistication(context, routeDecision);
    }
  }

  /**
   * Execute crisis-level sophistication (highest priority)
   */
  private async executeCrisisSophistication(
    context: PipelineContext,
    routeDecision: RouteDecision
  ): Promise<any> {
    // Import sophisticated systems dynamically
    const { processRogerianNervousSystem } = await import('../utils/rogerianNervousSystem');
    const { complexMemoryIntegrator } = await import('../services/ComplexMemorySystemIntegrator');
    const { legacyRAGIntegrator } = await import('../services/LegacyRAGIntegrator');

    // Crisis gets full sophisticated processing
    const nervousSystemResult = await processRogerianNervousSystem(
      'Crisis detected - engaging full therapeutic support',
      context.userInput,
      context.conversationHistory,
      context.conversationHistory.length
    );

    const memoryResult = await complexMemoryIntegrator.processMemoryIntegration(
      context.userInput,
      context.conversationHistory,
      context.sessionId
    );

    const ragConfig = legacyRAGIntegrator.constructor.getOptimalConfig('enterprise');
    const ragResult = await legacyRAGIntegrator.integrateRAG(
      nervousSystemResult.enhancedResponse,
      context.userInput,
      context.conversationHistory,
      ragConfig
    );

    return {
      enhancedResponse: ragResult.enhancedResponse,
      sophisticationMetrics: {
        level: 'maximum',
        systemsEngaged: routeDecision.systemsToEngage.length,
        processingComplexity: 'crisis-optimized'
      },
      systemsEngaged: [
        ...nervousSystemResult.systemsEngaged,
        ...memoryResult.systemsEngaged,
        ...ragResult.systemsUsed
      ]
    };
  }

  /**
   * Execute emotional sophistication (enhanced complexity)
   */
  private async executeEmotionalSophistication(
    context: PipelineContext,
    routeDecision: RouteDecision
  ): Promise<any> {
    const { processRogerianNervousSystem } = await import('../utils/rogerianNervousSystem');
    const { complexMemoryIntegrator } = await import('../services/ComplexMemorySystemIntegrator');

    const nervousSystemResult = await processRogerianNervousSystem(
      'Processing emotional content with enhanced sophistication',
      context.userInput,
      context.conversationHistory,
      context.conversationHistory.length
    );

    const memoryResult = await complexMemoryIntegrator.processMemoryIntegration(
      context.userInput,
      context.conversationHistory,
      context.sessionId
    );

    return {
      enhancedResponse: nervousSystemResult.enhancedResponse,
      sophisticationMetrics: {
        level: 'enhanced',
        systemsEngaged: routeDecision.systemsToEngage.length,
        processingComplexity: 'emotion-optimized'
      },
      systemsEngaged: [
        ...nervousSystemResult.systemsEngaged,
        ...memoryResult.systemsEngaged
      ]
    };
  }

  /**
   * Execute complex sophistication (full system engagement)
   */
  private async executeComplexSophistication(
    context: PipelineContext,
    routeDecision: RouteDecision
  ): Promise<any> {
    const { processRogerianNervousSystem } = await import('../utils/rogerianNervousSystem');
    const { complexMemoryIntegrator } = await import('../services/ComplexMemorySystemIntegrator');
    const { legacyRAGIntegrator } = await import('../services/LegacyRAGIntegrator');

    // Full sophisticated processing for complex queries
    const nervousSystemResult = await processRogerianNervousSystem(
      'Engaging full sophisticated processing systems',
      context.userInput,
      context.conversationHistory,
      context.conversationHistory.length
    );

    const memoryResult = await complexMemoryIntegrator.processMemoryIntegration(
      context.userInput,
      context.conversationHistory,
      context.sessionId
    );

    const clientPriority = context.clientPreferences?.priorityLevel || 'enhanced';
    const ragConfig = legacyRAGIntegrator.constructor.getOptimalConfig(clientPriority);
    const ragResult = await legacyRAGIntegrator.integrateRAG(
      nervousSystemResult.enhancedResponse,
      context.userInput,
      context.conversationHistory,
      ragConfig
    );

    return {
      enhancedResponse: ragResult.enhancedResponse,
      sophisticationMetrics: {
        level: 'maximum',
        systemsEngaged: routeDecision.systemsToEngage.length,
        processingComplexity: 'full-sophisticated'
      },
      systemsEngaged: [
        ...nervousSystemResult.systemsEngaged,
        ...memoryResult.systemsEngaged,
        ...ragResult.systemsUsed
      ]
    };
  }

  /**
   * Execute optimized sophistication (streamlined but still complex)
   */
  private async executeOptimizedSophistication(
    context: PipelineContext,
    routeDecision: RouteDecision
  ): Promise<any> {
    const { processRogerianNervousSystem } = await import('../utils/rogerianNervousSystem');

    // Streamlined but sophisticated processing
    const nervousSystemResult = await processRogerianNervousSystem(
      'Optimized sophisticated processing for efficient therapeutic response',
      context.userInput,
      context.conversationHistory,
      context.conversationHistory.length
    );

    return {
      enhancedResponse: nervousSystemResult.enhancedResponse,
      sophisticationMetrics: {
        level: 'optimized',
        systemsEngaged: routeDecision.systemsToEngage.length,
        processingComplexity: 'streamlined-sophisticated'
      },
      systemsEngaged: nervousSystemResult.systemsEngaged
    };
  }

  // Detection methods for routing decisions
  private detectsCrisisContent(userInput: string): boolean {
    return /suicide|kill myself|self-harm|overdose|end my life|want to die/i.test(userInput);
  }

  private detectsEmotionalContent(userInput: string): boolean {
    return /feel|feeling|emotion|sad|happy|angry|anxious|depressed|upset|overwhelmed/i.test(userInput);
  }

  private detectsComplexQuery(userInput: string, history: string[]): boolean {
    return userInput.length > 100 || 
           history.length > 5 || 
           /therapy|counseling|help me understand|complex|relationship|trauma/i.test(userInput);
  }
}

export const smartPipelineRouter = new SmartPipelineRouter();
