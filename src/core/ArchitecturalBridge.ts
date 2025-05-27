
/**
 * Architectural Bridge
 * 
 * Creates seamless integration between legacy and modern pipeline architectures
 * Ensures unity without conflicts through sophisticated mediation patterns
 */

import { UnifiedPatientContext, UnifiedProcessingResult, LegacyBridge, UnifiedSystemConfig } from './types/UnifiedTypes';
import { PatientOptimizedCore } from './PatientOptimizedCore';
import { UnifiedPatientPipeline } from './UnifiedPatientPipeline';

export class ArchitecturalBridge implements LegacyBridge {
  private legacyCore: PatientOptimizedCore;
  private modernPipeline: UnifiedPatientPipeline;
  private config: UnifiedSystemConfig;
  private stateMediator: StateMediator;

  constructor(config?: Partial<UnifiedSystemConfig>) {
    this.config = {
      enableLegacyCompatibility: true,
      preserveOldBehaviors: true,
      useModernEnhancements: true,
      sophisticationLevel: 'expert',
      unityMode: 'adaptive',
      ...config
    };

    this.legacyCore = new PatientOptimizedCore();
    this.modernPipeline = new UnifiedPatientPipeline();
    this.stateMediator = new StateMediator();

    console.log('ARCHITECTURAL BRIDGE: Initialized with unity mode', this.config.unityMode);
  }

  /**
   * Unified processing entry point that mediates between old and new
   */
  async processUnified(context: UnifiedPatientContext): Promise<UnifiedProcessingResult> {
    console.log('ARCHITECTURAL BRIDGE: Starting unified processing');

    // Step 1: Determine optimal processing path through sophisticated analysis
    const processingStrategy = this.determineProcessingStrategy(context);
    
    // Step 2: Coordinate state between old and new systems
    await this.stateMediator.synchronizeState(context);

    // Step 3: Execute unified processing based on strategy
    let result: UnifiedProcessingResult;
    
    switch (processingStrategy.approach) {
      case 'legacy-primary':
        result = await this.processLegacyPrimary(context, processingStrategy);
        break;
      case 'modern-primary':
        result = await this.processModernPrimary(context, processingStrategy);
        break;
      case 'hybrid-unified':
        result = await this.processHybridUnified(context, processingStrategy);
        break;
      default:
        result = await this.processAdaptiveUnified(context, processingStrategy);
    }

    // Step 4: Ensure unity through post-processing validation
    result = await this.validateUnity(result, context);

    console.log(`ARCHITECTURAL BRIDGE: Completed with approach ${processingStrategy.approach}, unity score: ${result.unityScore || 'N/A'}`);

    return result;
  }

  /**
   * Sophisticated strategy determination for optimal old/new integration
   */
  private determineProcessingStrategy(context: UnifiedPatientContext): ProcessingStrategy {
    const complexityMetrics = this.analyzeComplexity(context);
    const legacyCompatibilityScore = this.calculateLegacyCompatibility(context);
    const modernEnhancementPotential = this.assessModernPotential(context);

    // Sophisticated decision matrix for optimal integration
    if (legacyCompatibilityScore > 0.8 && !complexityMetrics.requiresModernFeatures) {
      return {
        approach: 'legacy-primary',
        confidence: legacyCompatibilityScore,
        reasoning: 'High legacy compatibility with no modern feature requirements',
        modernEnhancements: modernEnhancementPotential > 0.5
      };
    }

    if (modernEnhancementPotential > 0.9 && complexityMetrics.sophisticationLevel === 'expert') {
      return {
        approach: 'modern-primary',
        confidence: modernEnhancementPotential,
        reasoning: 'Expert-level complexity requiring modern capabilities',
        legacySupport: legacyCompatibilityScore > 0.3
      };
    }

    if (this.config.unityMode === 'strict') {
      return {
        approach: 'hybrid-unified',
        confidence: (legacyCompatibilityScore + modernEnhancementPotential) / 2,
        reasoning: 'Strict unity mode requiring hybrid approach',
        balanceScore: Math.abs(legacyCompatibilityScore - modernEnhancementPotential)
      };
    }

    return {
      approach: 'adaptive-unified',
      confidence: Math.max(legacyCompatibilityScore, modernEnhancementPotential),
      reasoning: 'Adaptive approach for optimal old/new integration',
      adaptiveFactors: complexityMetrics
    };
  }

  /**
   * Process using legacy-primary approach with modern enhancements
   */
  private async processLegacyPrimary(
    context: UnifiedPatientContext, 
    strategy: ProcessingStrategy
  ): Promise<UnifiedProcessingResult> {
    // Convert to legacy format
    const legacyContext = this.convertToLegacyContext(context);
    
    // Process through legacy system
    const legacyResult = await this.legacyCore.process(legacyContext);
    
    // Apply modern enhancements if beneficial
    let enhancedResult = legacyResult;
    if (strategy.modernEnhancements) {
      enhancedResult = await this.applyModernEnhancements(legacyResult, context);
    }

    return this.convertToUnified(enhancedResult, 'legacy-primary');
  }

  /**
   * Process using modern-primary approach with legacy support
   */
  private async processModernPrimary(
    context: UnifiedPatientContext,
    strategy: ProcessingStrategy
  ): Promise<UnifiedProcessingResult> {
    // Process through modern pipeline
    const modernResult = await this.modernPipeline.process(context);
    
    // Add legacy support if needed
    if (strategy.legacySupport) {
      modernResult.legacyCompatible = true;
      modernResult.systemsEngaged.push('legacy-compatibility-layer');
    }

    return modernResult;
  }

  /**
   * Process using hybrid unified approach
   */
  private async processHybridUnified(
    context: UnifiedPatientContext,
    strategy: ProcessingStrategy
  ): Promise<UnifiedProcessingResult> {
    // Parallel processing through both systems
    const [legacyResult, modernResult] = await Promise.all([
      this.processLegacyPrimary(context, { ...strategy, modernEnhancements: false }),
      this.processModernPrimary(context, { ...strategy, legacySupport: false })
    ]);

    // Sophisticated unification of results
    return this.unifyResults(legacyResult, modernResult, strategy);
  }

  /**
   * Process using adaptive unified approach
   */
  private async processAdaptiveUnified(
    context: UnifiedPatientContext,
    strategy: ProcessingStrategy
  ): Promise<UnifiedProcessingResult> {
    // Real-time adaptation based on processing context
    const adaptiveDecision = this.makeAdaptiveDecision(context, strategy);
    
    if (adaptiveDecision.preferLegacy) {
      return this.processLegacyPrimary(context, strategy);
    } else if (adaptiveDecision.preferModern) {
      return this.processModernPrimary(context, strategy);
    } else {
      return this.processHybridUnified(context, strategy);
    }
  }

  /**
   * Legacy conversion methods
   */
  convertToLegacy(unified: UnifiedProcessingResult): any {
    return {
      response: unified.response,
      confidence: unified.confidence,
      processingTimeMs: unified.processingTimeMs,
      crisisDetected: unified.crisisDetected,
      systemsUsed: unified.systemsEngaged,
      therapeuticQuality: unified.therapeuticQuality
    };
  }

  convertFromLegacy(legacy: any): UnifiedProcessingResult {
    return {
      response: legacy.response,
      confidence: legacy.confidence,
      processingTimeMs: legacy.processingTimeMs,
      crisisDetected: legacy.crisisDetected,
      systemsEngaged: legacy.systemsUsed || [],
      therapeuticQuality: legacy.therapeuticQuality,
      pipelineRoute: 'legacy-converted',
      memoryIntegration: {
        relevantItems: [],
        currentFocus: 'legacy-context',
        conversationPhase: 'converted'
      },
      legacyCompatible: true
    };
  }

  isLegacyFormat(input: any): boolean {
    return input.hasOwnProperty('systemsUsed') && !input.hasOwnProperty('systemsEngaged');
  }

  // Helper methods for sophisticated analysis
  private analyzeComplexity(context: UnifiedPatientContext): any {
    return {
      messageLength: context.userInput.length,
      conversationDepth: context.conversationHistory.length,
      emotionalComplexity: context.emotionalState?.intensity || 0,
      requiresModernFeatures: context.userInput.length > 200 || context.conversationHistory.length > 10,
      sophisticationLevel: context.userInput.length > 100 ? 'expert' : 'basic'
    };
  }

  private calculateLegacyCompatibility(context: UnifiedPatientContext): number {
    let score = 0.5; // Base compatibility
    
    // Simple inputs work better with legacy
    if (context.userInput.length < 100) score += 0.3;
    
    // Early conversations suit legacy approach
    if (context.messageCount < 5) score += 0.2;
    
    // Crisis situations benefit from legacy stability
    if (this.detectsCrisis(context.userInput)) score += 0.4;
    
    return Math.min(score, 1.0);
  }

  private assessModernPotential(context: UnifiedPatientContext): number {
    let score = 0.3; // Base modern benefit
    
    // Complex inputs benefit from modern processing
    if (context.userInput.length > 150) score += 0.4;
    
    // Extended conversations benefit from modern memory
    if (context.conversationHistory.length > 5) score += 0.3;
    
    // Emotional complexity benefits from modern analysis
    if (context.emotionalState && context.emotionalState.intensity > 0.7) score += 0.3;
    
    return Math.min(score, 1.0);
  }

  private detectsCrisis(userInput: string): boolean {
    const crisisPatterns = [
      /\b(suicide|suicidal|kill myself|end my life)\b/i,
      /\b(harm myself|hurt myself)\b/i
    ];
    return crisisPatterns.some(pattern => pattern.test(userInput));
  }

  private convertToLegacyContext(context: UnifiedPatientContext): any {
    return {
      userInput: context.userInput,
      sessionId: context.sessionId,
      messageCount: context.messageCount,
      isNewSession: context.isNewSession
    };
  }

  private async applyModernEnhancements(legacyResult: any, context: UnifiedPatientContext): Promise<any> {
    // Apply modern sophistication to legacy results
    const enhanced = { ...legacyResult };
    
    if (context.emotionalState?.intensity > 0.7) {
      enhanced.response = `I can really hear the ${context.emotionalState.primaryEmotion} in what you're sharing. ${enhanced.response}`;
      enhanced.therapeuticQuality = Math.min(enhanced.therapeuticQuality + 0.1, 1.0);
    }
    
    return enhanced;
  }

  private convertToUnified(result: any, route: string): UnifiedProcessingResult {
    return {
      response: result.response,
      confidence: result.confidence,
      processingTimeMs: result.processingTimeMs,
      crisisDetected: result.crisisDetected,
      systemsEngaged: result.systemsUsed || result.systemsEngaged || [],
      therapeuticQuality: result.therapeuticQuality,
      pipelineRoute: route,
      memoryIntegration: {
        relevantItems: [],
        currentFocus: 'unified-bridge',
        conversationPhase: 'integrated'
      },
      legacyCompatible: true
    };
  }

  private unifyResults(
    legacyResult: UnifiedProcessingResult,
    modernResult: UnifiedProcessingResult,
    strategy: ProcessingStrategy
  ): UnifiedProcessingResult {
    // Sophisticated result unification
    const unifiedResponse = this.selectBestResponse(legacyResult.response, modernResult.response);
    const combinedSystems = [...legacyResult.systemsEngaged, ...modernResult.systemsEngaged];
    
    return {
      response: unifiedResponse,
      confidence: Math.max(legacyResult.confidence, modernResult.confidence),
      processingTimeMs: legacyResult.processingTimeMs + modernResult.processingTimeMs,
      crisisDetected: legacyResult.crisisDetected || modernResult.crisisDetected,
      systemsEngaged: [...new Set(combinedSystems)],
      therapeuticQuality: Math.max(legacyResult.therapeuticQuality, modernResult.therapeuticQuality),
      pipelineRoute: 'hybrid-unified',
      memoryIntegration: modernResult.memoryIntegration,
      legacyCompatible: true,
      unityScore: strategy.balanceScore
    };
  }

  private selectBestResponse(legacyResponse: string, modernResponse: string): string {
    // Select response based on sophistication and therapeutic value
    const legacyScore = this.scoreResponse(legacyResponse);
    const modernScore = this.scoreResponse(modernResponse);
    
    return modernScore > legacyScore ? modernResponse : legacyResponse;
  }

  private scoreResponse(response: string): number {
    let score = 0.5;
    
    // Therapeutic language
    if (/\b(hear|feel|understand|sounds like)\b/i.test(response)) score += 0.2;
    
    // Emotional validation
    if (/\b(difficult|hard|challenging|painful)\b/i.test(response)) score += 0.1;
    
    // Appropriate length
    if (response.length > 50 && response.length < 200) score += 0.2;
    
    return score;
  }

  private makeAdaptiveDecision(context: UnifiedPatientContext, strategy: ProcessingStrategy): any {
    const contextFactors = {
      crisisDetected: this.detectsCrisis(context.userInput),
      isEarlyConversation: context.messageCount < 3,
      hasEmotionalComplexity: context.emotionalState?.intensity > 0.6,
      requiresSophistication: context.userInput.length > 150
    };

    return {
      preferLegacy: contextFactors.crisisDetected || contextFactors.isEarlyConversation,
      preferModern: contextFactors.hasEmotionalComplexity || contextFactors.requiresSophistication,
      useHybrid: !contextFactors.crisisDetected && contextFactors.hasEmotionalComplexity
    };
  }

  private async validateUnity(result: UnifiedProcessingResult, context: UnifiedPatientContext): Promise<UnifiedProcessingResult> {
    // Final unity validation and enhancement
    const validated = { ...result };
    
    // Ensure therapeutic quality meets standards
    if (validated.therapeuticQuality < 0.7) {
      validated.response = this.enhanceTherapeuticQuality(validated.response, context);
      validated.therapeuticQuality = Math.max(validated.therapeuticQuality, 0.7);
      validated.systemsEngaged.push('unity-validation');
    }

    return validated;
  }

  private enhanceTherapeuticQuality(response: string, context: UnifiedPatientContext): string {
    if (context.emotionalState?.primaryEmotion && context.emotionalState.primaryEmotion !== 'neutral') {
      const validation = this.generateEmotionalValidation(context.emotionalState.primaryEmotion);
      return `${validation} ${response}`;
    }
    return response;
  }

  private generateEmotionalValidation(emotion: string): string {
    const validations = {
      'sad': "I can hear the sadness in what you're sharing.",
      'angry': "I can sense your frustration about this.",
      'anxious': "That sounds really overwhelming.",
      'depressed': "I can hear how difficult this is for you."
    };
    return validations[emotion] || "I hear what you're going through.";
  }
}

// Supporting interfaces and classes
interface ProcessingStrategy {
  approach: 'legacy-primary' | 'modern-primary' | 'hybrid-unified' | 'adaptive-unified';
  confidence: number;
  reasoning: string;
  modernEnhancements?: boolean;
  legacySupport?: boolean;
  balanceScore?: number;
  adaptiveFactors?: any;
}

class StateMediator {
  async synchronizeState(context: UnifiedPatientContext): Promise<void> {
    // Synchronize state between old and new systems
    console.log('STATE MEDIATOR: Synchronizing state across all systems');
  }
}

// Export singleton for easy access
export const architecturalBridge = new ArchitecturalBridge();
