/**
 * Unified Pipeline Router
 * 
 * Single routing system that integrates all legacy and modern routing logic
 * Uses sophisticated decision-making for optimal patient experience
 */

import { UnifiedPatientPipeline } from './UnifiedPatientPipeline';
import { UnifiedPatientContext } from './types/UnifiedTypes';

export interface UnifiedPatientResult {
  response: string;
  confidence: number;
  processingTimeMs: number;
  crisisDetected: boolean;
  systemsEngaged: string[];
  therapeuticQuality: number;
  pipelineRoute: 'crisis' | 'emotional' | 'complex' | 'greeting';
  memoryIntegration: any;
  legacyCompatible: boolean;
}

export interface UnifiedRoutingDecision {
  pipeline: 'unified';
  route: 'crisis' | 'emotional' | 'complex' | 'greeting';
  reason: string;
  estimatedProcessingTime: number;
  expectedQuality: number;
  sophisticationLevel: 'basic' | 'advanced' | 'expert';
}

/**
 * Unified Router - Single point of entry for all patient interactions
 */
export class UnifiedPipelineRouter {
  private unifiedPipeline: UnifiedPatientPipeline;
  private sessionMessageCount: number = 0;
  
  constructor() {
    this.unifiedPipeline = new UnifiedPatientPipeline();
  }

  /**
   * Route patient input through unified pipeline
   */
  async route(userInput: string, conversationHistory: string[] = []): Promise<UnifiedPatientResult> {
    this.sessionMessageCount++;
    
    const context: UnifiedPatientContext = {
      userInput,
      sessionId: `unified_session_${Date.now()}`,
      messageCount: this.sessionMessageCount,
      isNewSession: this.sessionMessageCount === 1,
      conversationHistory,
      timestamp: Date.now()
    };

    console.log(`UNIFIED ROUTER: Processing message ${this.sessionMessageCount} through unified pipeline`);
    
    const result = await this.unifiedPipeline.process(context);
    
    console.log(`UNIFIED ROUTER: Completed in ${result.processingTimeMs}ms with quality ${result.therapeuticQuality} via ${result.pipelineRoute} route`);
    
    return result;
  }

  /**
   * Make sophisticated routing decision
   */
  private makeUnifiedRoutingDecision(context: UnifiedPatientContext): UnifiedRoutingDecision {
    const userInput = context.userInput.toLowerCase();
    
    // Crisis always takes priority
    if (this.isCrisisContent(userInput)) {
      return {
        pipeline: 'unified',
        route: 'crisis',
        reason: 'Crisis content detected - immediate intervention required',
        estimatedProcessingTime: 300,
        expectedQuality: 0.95,
        sophisticationLevel: 'expert'
      };
    }
    
    // Greeting for new sessions or greeting patterns
    if (context.isNewSession || this.isGreetingContent(userInput)) {
      return {
        pipeline: 'unified',
        route: 'greeting',
        reason: 'New session or greeting detected',
        estimatedProcessingTime: 150,
        expectedQuality: 0.85,
        sophisticationLevel: 'basic'
      };
    }
    
    // Emotional route for emotional content
    if (this.isEmotionalContent(userInput)) {
      return {
        pipeline: 'unified',
        route: 'emotional',
        reason: 'Emotional content requiring therapeutic response',
        estimatedProcessingTime: 500,
        expectedQuality: 0.9,
        sophisticationLevel: 'advanced'
      };
    }
    
    // Complex route for sophisticated needs
    return {
      pipeline: 'unified',
      route: 'complex',
      reason: 'Complex therapeutic needs requiring full pipeline',
      estimatedProcessingTime: 800,
      expectedQuality: 0.88,
      sophisticationLevel: 'expert'
    };
  }

  /**
   * Sophisticated content analysis methods
   */
  private isCrisisContent(userInput: string): boolean {
    const crisisPatterns = [
      /\b(suicide|suicidal|kill myself|end my life|want to die)\b/i,
      /\b(harm myself|hurt myself|cut myself)\b/i,
      /\b(overdose|too many pills)\b/i,
      /\b(don't want to live|better off dead)\b/i
    ];
    
    return crisisPatterns.some(pattern => pattern.test(userInput));
  }

  private isGreetingContent(userInput: string): boolean {
    const greetingPatterns = [
      /\b(hello|hi|hey|good morning|good afternoon|good evening)\b/i,
      /\b(how are you|what's up|what's happening)\b/i,
      /^(hey|hi|hello)$/i
    ];
    
    return greetingPatterns.some(pattern => pattern.test(userInput)) || userInput.length < 20;
  }

  private isEmotionalContent(userInput: string): boolean {
    const emotionalPatterns = [
      /\b(feel|feeling|emotion|sad|happy|angry|anxious|depressed|frustrated)\b/i,
      /\b(upset|worried|scared|afraid|hopeless|overwhelmed)\b/i,
      /\b(crying|tears|breakdown|falling apart)\b/i
    ];
    
    return emotionalPatterns.some(pattern => pattern.test(userInput));
  }

  /**
   * Reset session for new patient
   */
  resetSession(): void {
    this.sessionMessageCount = 0;
  }

  /**
   * Get processing statistics
   */
  getSessionStats(): any {
    return {
      messageCount: this.sessionMessageCount,
      pipelineType: 'unified',
      sophisticationLevel: 'expert'
    };
  }
}

// Export singleton
export const unifiedPipelineRouter = new UnifiedPipelineRouter();
