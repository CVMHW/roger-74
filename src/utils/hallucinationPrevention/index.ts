
/**
 * Main hallucination prevention system
 * 
 * Enhanced with emotion-specific RAG retrieval strategies and
 * integrated vector database
 */

// Re-export from core.ts
export { analyzeConversation, isRAGSystemReady } from './core';

// Re-export from processor.ts
export { preventHallucinations } from './processor';

// Re-export from detector.ts
export { detectHallucinations } from './detector';

// Re-export from retrieval.ts
export { 
  retrieveAugmentation, 
  augmentResponseWithRetrieval,
  retrieveSimilarResponses,
  retrieveFactualGrounding
} from './retrieval';

// Re-export from conversationTracker.ts
export { addConversationExchange } from './conversationTracker';

// Re-export from initialization.ts
export { initializeRAGSystem } from './initialization';

// Re-export from ragEnhancement.ts
export { enhanceResponseWithRAG } from './ragEnhancement';
