
/**
 * Memory system types
 */

/**
 * Configuration for the memory system
 */
export interface MemorySystemConfig {
  // Capacity settings
  shortTermMemoryCapacity: number; 
  workingMemoryCapacity: number;
  longTermImportanceThreshold: number;
  
  // Feature toggles
  semanticSearchEnabled: boolean;

  // Hallucination prevention level
  hallucinationPreventionLevel: 'standard' | 'aggressive' | 'permissive';
  
  // Time thresholds (in milliseconds)
  newSessionThresholdMs: number;
  shortTermExpiryMs: number;
}
