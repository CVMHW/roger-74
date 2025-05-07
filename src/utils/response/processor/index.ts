
/**
 * Response Processor
 * 
 * Unified system for processing responses through all handlers
 */

// Import core processor
import { processCompleteResponse } from './core/mainProcessor';

// Re-export core processor functions
export { processCompleteResponse };
export { enhanceWithMemoryBank } from './memoryEnhancement';
export { handlePotentialHallucinations } from './hallucinationHandler';
export { applyEarlyConversationRAG } from '../earlyConversation';

// Export type definitions
export interface ProcessedResponse {
  text: string;
  wasModified: boolean;
  reason?: string;
}
