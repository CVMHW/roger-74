
/**
 * Unified Pipeline Router
 * 
 * Single routing system that replaces all fragmented routing logic
 */

import { UnifiedIntegrationCoordinator, IntegratedResponse } from './UnifiedIntegrationCoordinator';

class UnifiedPipelineRouterClass {
  private coordinator: UnifiedIntegrationCoordinator;
  private sessionData = new Map<string, any>();

  constructor() {
    this.coordinator = new UnifiedIntegrationCoordinator();
  }

  /**
   * Main routing method - SINGLE ENTRY POINT for all responses
   */
  async route(
    userInput: string, 
    conversationHistory: string[] = [],
    sessionId: string = 'default'
  ): Promise<IntegratedResponse> {
    try {
      console.log(`UNIFIED ROUTER: Processing "${userInput.substring(0, 50)}..."`);
      
      // Route through unified coordinator
      const result = await this.coordinator.processUnified(userInput, conversationHistory, sessionId);
      
      // Update session data
      this.updateSessionData(sessionId, userInput, result);
      
      console.log(`UNIFIED ROUTER: Complete [${result.systemsUsed.join('+')}] ${result.processingTimeMs}ms (Efficiency: ${result.pipelineEfficiency.toFixed(2)})`);
      
      return result;
      
    } catch (error) {
      console.error('Unified router error:', error);
      
      // Fallback response
      return {
        text: "I'm here to listen and support you. What would you like to share?",
        confidence: 0.7,
        emotionDetected: false,
        hallucinationPrevented: false,
        personalityApplied: true,
        systemsUsed: ['fallback'],
        processingTimeMs: 0,
        pipelineEfficiency: 0.5
      };
    }
  }

  /**
   * Update session data for continuity
   */
  private updateSessionData(sessionId: string, userInput: string, result: IntegratedResponse): void {
    if (!this.sessionData.has(sessionId)) {
      this.sessionData.set(sessionId, {
        messageCount: 0,
        emotionHistory: [],
        hallucinationCount: 0,
        averageConfidence: 0
      });
    }
    
    const session = this.sessionData.get(sessionId);
    session.messageCount++;
    
    if (result.emotionDetected) {
      session.emotionHistory.push(userInput);
    }
    
    if (result.hallucinationPrevented) {
      session.hallucinationCount++;
    }
    
    session.averageConfidence = (session.averageConfidence * (session.messageCount - 1) + result.confidence) / session.messageCount;
  }

  /**
   * Reset session (for testing or new conversations)
   */
  resetSession(sessionId: string = 'default'): void {
    this.sessionData.delete(sessionId);
  }

  /**
   * Get system metrics
   */
  getMetrics() {
    return this.coordinator.getSystemMetrics();
  }

  /**
   * Health check
   */
  async isHealthy(): Promise<boolean> {
    return await this.coordinator.isHealthy();
  }
}

// Export singleton instance
export const unifiedPipelineRouter = new UnifiedPipelineRouterClass();
