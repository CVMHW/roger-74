
/**
 * Unified Integration Coordinator
 * 
 * Single source of truth that coordinates ALL legacy and modern systems
 * Eliminates redundancy and creates true unity
 */

import { detectEmotionConsolidated } from '../utils/emotions/consolidatedEmotionDetector';
import { preventHallucinations } from '../utils/memory/hallucination/preventionV2';
import { processPersonality } from '../utils/rogerianNervousSystem/processors/personalityProcessor';
import { processEmotions } from '../utils/rogerianNervousSystem/processors/emotionProcessor';
import { PatientOptimizedCore } from './PatientOptimizedCore';
import { UnifiedPatientPipeline } from './UnifiedPatientPipeline';

export interface IntegratedResponse {
  text: string;
  confidence: number;
  emotionDetected: boolean;
  hallucinationPrevented: boolean;
  personalityApplied: boolean;
  systemsUsed: string[];
  processingTimeMs: number;
  pipelineEfficiency: number;
}

/**
 * Master Integration Coordinator - eliminates all redundancy
 */
export class UnifiedIntegrationCoordinator {
  private legacyCore: PatientOptimizedCore;
  private modernPipeline: UnifiedPatientPipeline;
  private systemStats = {
    totalProcessed: 0,
    averageResponseTime: 0,
    hallucinationsPrevented: 0,
    emotionDetectionAccuracy: 0
  };

  constructor() {
    this.legacyCore = new PatientOptimizedCore();
    this.modernPipeline = new UnifiedPatientPipeline();
  }

  /**
   * Process through unified coordination - SINGLE ENTRY POINT
   */
  async processUnified(
    userInput: string,
    conversationHistory: string[] = [],
    sessionId: string = Date.now().toString()
  ): Promise<IntegratedResponse> {
    const startTime = Date.now();
    const systemsUsed: string[] = [];

    // Stage 1: Consolidated Emotion Detection (SINGLE CALL)
    const emotionResult = detectEmotionConsolidated(userInput);
    systemsUsed.push('unified-emotion-detection');

    // Stage 2: Create emotional context for personality system
    const emotionalContext = await processEmotions(userInput, conversationHistory);
    systemsUsed.push('nervous-system-emotion-processor');

    // Stage 3: Apply personality insights
    const personalityInsights = await processPersonality(userInput, emotionalContext);
    systemsUsed.push('personality-processor');

    // Stage 4: Route through appropriate pipeline based on sophistication
    let baseResponse: string;
    if (this.shouldUseLegacyPipeline(userInput, emotionResult)) {
      const legacyResult = await this.legacyCore.process({
        userInput,
        sessionId,
        messageCount: conversationHistory.length / 2,
        isNewSession: conversationHistory.length === 0
      });
      baseResponse = legacyResult.response;
      systemsUsed.push('legacy-pipeline');
    } else {
      const modernResult = await this.modernPipeline.process({
        userInput,
        sessionId,
        messageCount: conversationHistory.length / 2,
        isNewSession: conversationHistory.length === 0,
        conversationHistory,
        timestamp: Date.now()
      });
      baseResponse = modernResult.response;
      systemsUsed.push('modern-pipeline');
    }

    // Stage 5: Apply personality enhancement if needed
    let enhancedResponse = baseResponse;
    if (personalityInsights.shouldIncludeInsight && personalityInsights.insight) {
      enhancedResponse = this.integratePersonalityInsight(baseResponse, personalityInsights.insight);
      systemsUsed.push('personality-enhancement');
    }

    // Stage 6: Hallucination prevention (FINAL SAFETY CHECK)
    const hallucinationResult = preventHallucinations(
      enhancedResponse,
      userInput,
      conversationHistory
    );
    systemsUsed.push('hallucination-prevention');

    // Stage 7: Calculate efficiency metrics
    const processingTime = Date.now() - startTime;
    const efficiency = this.calculatePipelineEfficiency(systemsUsed, processingTime);

    // Update system statistics
    this.updateSystemStats(processingTime, hallucinationResult.wasModified, emotionResult.confidence);

    return {
      text: hallucinationResult.text,
      confidence: Math.min(emotionResult.confidence + (personalityInsights.confidence || 0), 1.0),
      emotionDetected: emotionResult.hasEmotion,
      hallucinationPrevented: hallucinationResult.wasModified,
      personalityApplied: personalityInsights.shouldIncludeInsight,
      systemsUsed,
      processingTimeMs: processingTime,
      pipelineEfficiency: efficiency
    };
  }

  /**
   * Intelligent pipeline selection
   */
  private shouldUseLegacyPipeline(userInput: string, emotionResult: any): boolean {
    // Use legacy for crisis situations (proven stability)
    if (emotionResult.isCrisis) return true;
    
    // Use legacy for simple greetings
    if (userInput.length < 20 && /^(hi|hello|hey)\b/i.test(userInput)) return true;
    
    // Use modern for complex emotional processing
    return false;
  }

  /**
   * Integrate personality insight without redundancy
   */
  private integratePersonalityInsight(baseResponse: string, personalityInsight: string): string {
    // Check if personality is already reflected in base response
    const keyWords = personalityInsight.toLowerCase().split(' ').slice(0, 3);
    const hasPersonalityAlready = keyWords.some(word => 
      baseResponse.toLowerCase().includes(word) && word.length > 3
    );

    if (hasPersonalityAlready) {
      return baseResponse; // No redundant enhancement needed
    }

    // Add personality insight naturally
    if (baseResponse.endsWith('.') || baseResponse.endsWith('?')) {
      return `${baseResponse} ${personalityInsight}`;
    }
    
    return `${personalityInsight} ${baseResponse}`;
  }

  /**
   * Calculate pipeline efficiency score
   */
  private calculatePipelineEfficiency(systemsUsed: string[], processingTime: number): number {
    const baseEfficiency = 1.0;
    
    // Penalty for excessive system usage
    const systemPenalty = Math.max(0, (systemsUsed.length - 4) * 0.1);
    
    // Penalty for slow processing
    const timePenalty = processingTime > 200 ? (processingTime - 200) / 1000 : 0;
    
    return Math.max(0.1, baseEfficiency - systemPenalty - timePenalty);
  }

  /**
   * Update system performance statistics
   */
  private updateSystemStats(processingTime: number, hallucinationPrevented: boolean, emotionConfidence: number): void {
    this.systemStats.totalProcessed++;
    this.systemStats.averageResponseTime = 
      (this.systemStats.averageResponseTime * (this.systemStats.totalProcessed - 1) + processingTime) / 
      this.systemStats.totalProcessed;
    
    if (hallucinationPrevented) {
      this.systemStats.hallucinationsPrevented++;
    }
    
    this.systemStats.emotionDetectionAccuracy = 
      (this.systemStats.emotionDetectionAccuracy * (this.systemStats.totalProcessed - 1) + emotionConfidence) / 
      this.systemStats.totalProcessed;
  }

  /**
   * Get system health and performance metrics
   */
  getSystemMetrics() {
    return {
      ...this.systemStats,
      hallucinationPreventionRate: this.systemStats.hallucinationsPrevented / this.systemStats.totalProcessed,
      efficiency: this.systemStats.averageResponseTime < 300 ? 'high' : 'medium'
    };
  }

  /**
   * Health check for all integrated systems
   */
  async isHealthy(): Promise<boolean> {
    try {
      const legacyHealthy = await this.legacyCore.isHealthy();
      const modernHealthy = await this.modernPipeline.isHealthy();
      
      return legacyHealthy && modernHealthy;
    } catch (error) {
      console.error('Integration coordinator health check failed:', error);
      return false;
    }
  }
}
