
/**
 * RAG Pipeline Integrator
 * 
 * Unifies the existing RAG pipeline with the comprehensive nervous system
 * Integrates retrieval, enhancement, memory, and all Roger's systems
 */

import { 
  enhanceResponseWithRAG,
  retrieveAugmentation,
  augmentResponseWithRetrieval,
  addConversationExchange
} from '../../hallucinationPrevention';
import { processRogerianNervousSystem, RogerNervousSystemContext } from '../nervousSystemIntegrator';
import { initializeRAGSystem } from '../../hallucinationPrevention/initialization';

/**
 * Unified RAG Pipeline that integrates all Roger's systems
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
  };
}> => {
  console.log("UNIFIED RAG PIPELINE: Starting comprehensive processing");
  
  // Initialize RAG system if not already done
  try {
    await initializeRAGSystem();
  } catch (error) {
    console.warn("RAG system initialization warning:", error);
  }
  
  // Process through Roger's comprehensive nervous system first
  const nervousSystemResult = await processRogerianNervousSystem(
    originalResponse,
    userInput,
    conversationHistory,
    messageCount,
    updateStage
  );
  
  // If crisis was detected, return immediately without further RAG processing
  if (nervousSystemResult.context.crisisContext.isCrisisDetected) {
    return {
      ...nervousSystemResult,
      ragData: {
        augmentationApplied: false
      }
    };
  }
  
  // Apply advanced RAG processing if appropriate
  let finalResponse = nervousSystemResult.enhancedResponse;
  let ragData = {
    augmentationApplied: false,
    retrievalResults: undefined as any[] | undefined,
    vectorSearchResults: undefined as any[] | undefined
  };
  
  if (nervousSystemResult.context.ragContext.shouldApplyRAG) {
    try {
      console.log("UNIFIED RAG PIPELINE: Applying advanced RAG processing");
      
      // Retrieve relevant information using the existing RAG system
      const retrievalResult = await retrieveAugmentation(
        nervousSystemResult.context.ragContext.queryAugmentation || userInput,
        conversationHistory
      );
      
      if (retrievalResult.retrievedContent && retrievalResult.retrievedContent.length > 0) {
        // Augment the response with retrieved content
        finalResponse = await augmentResponseWithRetrieval(
          finalResponse,
          userInput,
          retrievalResult
        );
        
        ragData = {
          augmentationApplied: true,
          retrievalResults: retrievalResult.retrievedContent,
          vectorSearchResults: retrievalResult.vectorResults
        };
        
        nervousSystemResult.systemsEngaged.push('advanced-rag-pipeline');
      }
      
      // Record the conversation exchange for future retrieval
      await addConversationExchange(userInput, finalResponse);
      
    } catch (ragError) {
      console.error("UNIFIED RAG PIPELINE: Advanced RAG error:", ragError);
      // Continue with nervous system response if RAG fails
    }
  }
  
  return {
    enhancedResponse: finalResponse,
    context: nervousSystemResult.context,
    systemsEngaged: nervousSystemResult.systemsEngaged,
    ragData
  };
};

/**
 * Quick access function for the unified pipeline
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
  
  console.log(`🧠 UNIFIED PIPELINE: Enhanced with ${result.systemsEngaged.length} systems:`, 
    result.systemsEngaged.join(', '));
  
  return result.enhancedResponse;
};
