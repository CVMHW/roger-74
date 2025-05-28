
/**
 * Updated RAG Pipeline Integrator
 * 
 * Now uses all new unified systems and integrations
 */

import { unifiedRAGIntegrator } from '../../../integration/UnifiedRAGIntegrator';
import { unifiedMemoryProcessor } from '../../../memory/UnifiedMemoryProcessor';
import { processRogerianNervousSystem, RogerNervousSystemContext } from '../nervousSystemIntegrator';

/**
 * Updated unified RAG pipeline using new integrations
 */
export const processUnifiedRAGPipeline = async (
  originalResponse: string,
  userInput: string,
  conversationHistory: string[] = [],
  messageCount: number = 0,
  updateStage?: () => void
): Promise<{
  enhancedResponse: string;
  context: RogerNervousSystemContext;
  systemsEngaged: string[];
  ragData: {
    retrievalResults?: any[];
    augmentationApplied: boolean;
    vectorSearchResults?: any[];
    memoryIntegration?: any;
    evaluationMetrics?: any;
  };
}> => {
  console.log("🔄 UPDATED RAG PIPELINE: Starting with unified integrations");
  
  // Process through Roger's nervous system first
  const nervousSystemResult = await processRogerianNervousSystem(
    originalResponse,
    userInput,
    conversationHistory,
    messageCount,
    updateStage
  );
  
  // If crisis detected, return immediately
  if (nervousSystemResult.context.crisisContext.isCrisisDetected) {
    return {
      ...nervousSystemResult,
      ragData: {
        augmentationApplied: false,
        retrievalResults: [],
        vectorSearchResults: []
      }
    };
  }
  
  // Apply unified RAG integration
  try {
    console.log("🔄 UPDATED RAG PIPELINE: Applying unified RAG integration");
    
    const ragResult = await unifiedRAGIntegrator.processUnifiedRAG(
      nervousSystemResult.enhancedResponse,
      {
        userInput,
        conversationHistory,
        emotionalContext: nervousSystemResult.context.emotionalContext,
        memoryContext: nervousSystemResult.context.memoryContext
      }
    );
    
    return {
      enhancedResponse: ragResult.enhancedResponse,
      context: nervousSystemResult.context,
      systemsEngaged: [
        ...nervousSystemResult.systemsEngaged,
        ...ragResult.systemsEngaged
      ],
      ragData: {
        retrievalResults: ragResult.retrievalResults,
        augmentationApplied: ragResult.confidence > 0.5,
        vectorSearchResults: ragResult.retrievalResults,
        memoryIntegration: ragResult.memoryIntegration,
        evaluationMetrics: ragResult.evaluationMetrics
      }
    };
    
  } catch (ragError) {
    console.error("🔄 UPDATED RAG PIPELINE: Unified RAG error:", ragError);
    
    return {
      enhancedResponse: nervousSystemResult.enhancedResponse,
      context: nervousSystemResult.context,
      systemsEngaged: [...nervousSystemResult.systemsEngaged, 'rag-error-fallback'],
      ragData: {
        augmentationApplied: false,
        retrievalResults: [],
        vectorSearchResults: []
      }
    };
  }
};

/**
 * Enhanced access function with unified pipeline
 */
export const enhanceWithUnifiedPipeline = async (
  originalResponse: string,
  userInput: string,
  conversationHistory: string[] = [],
  messageCount: number = 0,
  updateStage?: () => void
): Promise<string> => {
  const result = await processUnifiedRAGPipeline(
    originalResponse,
    userInput,
    conversationHistory,
    messageCount,
    updateStage
  );
  
  console.log(`🔄 UPDATED PIPELINE: Enhanced with ${result.systemsEngaged.length} systems:`, 
    result.systemsEngaged.join(', '));
  
  return result.enhancedResponse;
};
