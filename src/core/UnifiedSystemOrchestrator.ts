
/**
 * Unified System Orchestrator
 * 
 * Single entry point that orchestrates all old and new systems
 * through the architectural bridge for maximum unity and sophistication
 */

import { architecturalBridge } from './ArchitecturalBridge';
import { UnifiedPatientContext, UnifiedProcessingResult } from './types/UnifiedTypes';
import { patientRouter } from './PatientRouter';
import { unifiedPipelineRouter } from './UnifiedPipelineRouter';

export class UnifiedSystemOrchestrator {
  /**
   * Main orchestration method - single point of entry for all processing
   */
  async orchestrate(userInput: string, conversationHistory: string[] = []): Promise<UnifiedProcessingResult> {
    console.log('UNIFIED ORCHESTRATOR: Starting comprehensive system orchestration');

    // Create unified context from input
    const context: UnifiedPatientContext = {
      userInput,
      sessionId: `unified_${Date.now()}`,
      messageCount: conversationHistory.length / 2 + 1,
      isNewSession: conversationHistory.length === 0,
      conversationHistory,
      timestamp: Date.now()
    };

    // Process through architectural bridge for optimal old/new integration
    const result = await architecturalBridge.processUnified(context);

    console.log(`UNIFIED ORCHESTRATOR: Completed orchestration with ${result.systemsEngaged.length} systems engaged`);

    return result;
  }

  /**
   * Legacy compatibility method
   */
  async routeLegacy(userInput: string): Promise<any> {
    const result = await this.orchestrate(userInput, []);
    return architecturalBridge.convertToLegacy(result);
  }

  /**
   * Modern unified method
   */
  async routeUnified(userInput: string, conversationHistory: string[] = []): Promise<UnifiedProcessingResult> {
    return this.orchestrate(userInput, conversationHistory);
  }
}

// Export singleton for system-wide use
export const unifiedSystemOrchestrator = new UnifiedSystemOrchestrator();
