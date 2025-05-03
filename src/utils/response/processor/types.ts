
/**
 * Type definitions for response processor
 */

export interface AttentionResult {
  emotionalContext?: any;
  dominantTopics?: string[];
  relevantMemories?: any[];
}

export interface MemoryEnhancementParams {
  userInput: string;
  response: string;
  conversationHistory?: string[];
}
