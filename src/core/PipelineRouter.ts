
/**
 * Smart Pipeline Router
 * 
 * Routes requests to the most appropriate pipeline based on context
 * Optimizes for patient care while maintaining system efficiency
 */

import { OptimizedPatientPipeline, OptimizedPipelineContext } from './OptimizedPatientPipeline';
import { unifiedPipeline } from './UnifiedRogerPipeline';

export interface RoutingDecision {
  pipeline: 'optimized' | 'unified' | 'emergency';
  reason: string;
  estimatedProcessingTime: number;
  expectedQuality: number;
}

/**
 * Smart Pipeline Router for optimal patient experience
 */
export class PipelineRouter {
  private optimizedPipeline: OptimizedPatientPipeline;

  constructor() {
    this.optimizedPipeline = new OptimizedPatientPipeline();
  }

  /**
   * Route request to optimal pipeline
   */
  async route(context: OptimizedPipelineContext): Promise<any> {
    const decision = this.makeRoutingDecision(context);
    
    console.log(`PIPELINE ROUTER: Using ${decision.pipeline} pipeline - ${decision.reason}`);
    
    switch (decision.pipeline) {
      case 'optimized':
        return await this.optimizedPipeline.process(context);
      
      case 'emergency':
        return await this.handleEmergency(context);
      
      default:
        return await unifiedPipeline.process(context);
    }
  }

  /**
   * Make intelligent routing decision
   */
  private makeRoutingDecision(context: OptimizedPipelineContext): RoutingDecision {
    const userInput = context.userInput.toLowerCase();
    
    // Emergency routing for crisis
    if (this.isCrisisContent(userInput)) {
      return {
        pipeline: 'emergency',
        reason: 'Crisis content detected',
        estimatedProcessingTime: 500,
        expectedQuality: 0.95
      };
    }
    
    // Optimized pipeline for most therapeutic content
    if (this.isTherapeuticContent(userInput) || context.messageCount < 10) {
      return {
        pipeline: 'optimized',
        reason: 'Therapeutic content or early conversation',
        estimatedProcessingTime: 1000,
        expectedQuality: 0.9
      };
    }
    
    // Unified pipeline for complex cases
    return {
      pipeline: 'unified',
      reason: 'Complex processing required',
      estimatedProcessingTime: 2000,
      expectedQuality: 0.85
    };
  }

  /**
   * Check for crisis content
   */
  private isCrisisContent(userInput: string): boolean {
    const crisisPatterns = [
      /\b(suicide|suicidal|kill myself|end my life)\b/i,
      /\b(want to die|don't want to live)\b/i,
      /\b(harm myself|hurt myself)\b/i
    ];
    
    return crisisPatterns.some(pattern => pattern.test(userInput));
  }

  /**
   * Check for therapeutic content
   */
  private isTherapeuticContent(userInput: string): boolean {
    const therapeuticPatterns = [
      /\b(feel|feeling|emotion|sad|happy|angry|anxious|depressed)\b/i,
      /\b(relationship|family|work|stress|problem)\b/i,
      /\b(help|support|talk|share|tell)\b/i
    ];
    
    return therapeuticPatterns.some(pattern => pattern.test(userInput));
  }

  /**
   * Handle emergency cases with immediate response
   */
  private async handleEmergency(context: OptimizedPipelineContext): Promise<any> {
    const crisisResponse = "I'm very concerned about what you're sharing. Your safety is the most important thing right now. Please call 988 (Suicide & Crisis Lifeline) immediately or go to your nearest emergency room.";
    
    return {
      response: crisisResponse,
      confidence: 0.95,
      processingTime: 100,
      systemsEngaged: ['emergency-response'],
      crisisDetected: true,
      therapeuticQuality: 0.95,
      wasOptimized: true
    };
  }
}

// Export singleton instance
export const pipelineRouter = new PipelineRouter();
