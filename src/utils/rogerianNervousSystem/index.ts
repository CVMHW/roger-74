
/**
 * Roger's Comprehensive Nervous System
 * 
 * Main export point for the integrated system that connects:
 * - RAG (Retrieval Augmented Generation)
 * - Memory systems (short-term, long-term, episodic)
 * - Crisis detection and intervention
 * - Hallucination prevention
 * - Emotion detection and processing
 * - Personality integration (Roger's authentic voice)
 * - Master rules and universal rules
 * - Developmental stage awareness
 * - Logotherapy integration
 * - Small talk detection
 * - Scholarly materials and knowledge base
 * - Pattern detection and learning
 */

// Export the main nervous system processor
export { 
  processRogerianNervousSystem,
  type RogerNervousSystemContext 
} from './nervousSystemIntegrator';

// Export individual system components for direct access if needed
export { enhanceResponseWithRAG } from '../hallucinationPrevention/ragEnhancement';
export { processResponse } from '../response/processor';
export { integratedAnalysis } from '../masterRules/integration';
export { getRogerPersonalityInsight } from '../reflection/rogerPersonality';
export { identifyEnhancedFeelings } from '../reflection/feelingDetection';
export { extractEmotionsFromInput } from '../response/processor/emotions';
export { enhanceWithMeaningPerspective } from '../logotherapy/logotherapyIntegration';
export { masterMemory } from '../memory';
export { handleRefinedCrisisDetection } from '../../hooks/rogerianResponse/utils/messageProcessing/refinedCrisisDetection';

// Export types for comprehensive type safety
export type { 
  DevelopmentalStage, 
  SeverityLevel, 
  ConcernType,
  ReflectionPrinciple,
  TraumaResponseAnalysis 
} from '../reflection/reflectionTypes';

/**
 * Quick access function for the complete Roger experience
 * This is the main entry point that should be used by the chat system
 */
export const processWithRogerNervousSystem = async (
  originalResponse: string,
  userInput: string,
  conversationHistory: string[] = [],
  messageCount: number = 0,
  updateStage?: () => void
) => {
  const result = await processRogerianNervousSystem(
    originalResponse,
    userInput,
    conversationHistory,
    messageCount,
    updateStage
  );
  
  console.log(`🧠 ROGER'S NERVOUS SYSTEM: Processed with ${result.systemsEngaged.length} systems engaged:`, 
    result.systemsEngaged.join(', '));
  
  return result.enhancedResponse;
};
