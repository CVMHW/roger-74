
/**
 * Master Memory System Integration
 * 
 * Unifies all memory systems and hallucination prevention into a single coherent system
 * optimized for brief patient interactions (30s-5min)
 */

import { MemorySystemConfig } from './types';
import { DEFAULT_MEMORY_CONFIG } from './config';
import { 
  addMemory, 
  searchMemory,
  resetMemory,
  isNewConversation,
  processResponse,
  getConversationMessageCount
} from './memoryController';
import { preventHallucinations } from './hallucination/preventionV2';
import { isEarlyConversation } from './systems/earlyConversationHandler';
import { 
  getFiveResponseMemory, 
  addToFiveResponseMemory 
} from './fiveResponseMemory';

/**
 * Integrated memory system for brief patient interactions
 */
export class MasterMemorySystem {
  private config: MemorySystemConfig;
  
  constructor(config?: Partial<MemorySystemConfig>) {
    this.config = { ...DEFAULT_MEMORY_CONFIG, ...config };
    console.log("MASTER MEMORY SYSTEM: Initialized with config", this.config);
  }
  
  /**
   * Add memory to all systems
   */
  public addMemory(
    content: string,
    role: 'patient' | 'roger',
    context?: any,
    importance?: number
  ): void {
    addMemory(content, role, context, importance);
    
    // Also add to legacy system for redundancy
    addToFiveResponseMemory(role, content);
  }
  
  /**
   * Search across all memory systems
   */
  public searchMemory(query: any): any[] {
    return searchMemory(query);
  }
  
  /**
   * Process response to prevent hallucinations
   */
  public processResponse(
    responseText: string,
    userInput: string,
    conversationHistory: string[] = []
  ): string {
    // Check if we're in early conversation (first few messages)
    const isEarly = isEarlyConversation();
    
    // Apply more aggressive prevention for early conversations
    const preventionLevel = isEarly ? 'aggressive' : this.config.hallucinationPreventionLevel;
    
    // Create configuration for this specific response
    const responseConfig = {
      ...this.config,
      hallucinationPreventionLevel: preventionLevel
    };
    
    // Apply hallucination prevention with specific configuration
    const result = preventHallucinations(
      responseText,
      userInput,
      conversationHistory,
      responseConfig
    );
    
    // If modified, log the modification
    if (result.wasModified) {
      console.log("MASTER MEMORY: Hallucination prevented", {
        confidence: result.confidence,
        original: responseText.substring(0, 40) + "...",
        modified: result.text.substring(0, 40) + "..."
      });
    }
    
    return result.text;
  }
  
  /**
   * Check if this is a new conversation
   */
  public isNewConversation(userInput: string): boolean {
    return isNewConversation(userInput);
  }
  
  /**
   * Get current conversation message count
   */
  public getMessageCount(): number {
    return getConversationMessageCount();
  }
  
  /**
   * Reset memory for new conversation
   */
  public resetMemory(): void {
    resetMemory();
  }
}

// Create default instance for easy import
export const masterMemory = new MasterMemorySystem();

// Re-export core functions for backward compatibility
export {
  addMemory,
  searchMemory,
  resetMemory,
  isNewConversation,
  processResponse,
  getConversationMessageCount,
  preventHallucinations,
  isEarlyConversation,
  getFiveResponseMemory,
  addToFiveResponseMemory
};
