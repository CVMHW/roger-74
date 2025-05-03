
/**
 * Memory System Configuration
 * 
 * Central configuration for the memory system, optimized for brief patient interactions (30s - 5min)
 */

import { MemorySystemConfig } from './types';

/**
 * Default memory system configuration
 */
export const DEFAULT_MEMORY_CONFIG: MemorySystemConfig = {
  // Capacity settings
  shortTermMemoryCapacity: 25, // Reduced from 50 for faster processing
  workingMemoryCapacity: 15,   // Focused on most relevant items
  longTermImportanceThreshold: 0.8,
  
  // Feature toggles
  semanticSearchEnabled: true,

  // Hallucination prevention (set to aggressive for brief interactions)
  hallucinationPreventionLevel: 'aggressive',
  
  // Time thresholds (in milliseconds)
  newSessionThresholdMs: 15 * 60 * 1000, // 15 minutes (reduced from 30)
  shortTermExpiryMs: 10 * 60 * 1000,    // 10 minutes
};

/**
 * Importance calculation weights
 */
export const IMPORTANCE_WEIGHTS = {
  EMOTIONAL_CONTENT: 0.35,
  PROBLEM_MENTION: 0.30,
  LENGTH: 0.15,
  RECENCY: 0.20
};

/**
 * Recency decay function parameters
 * Models the Ebbinghaus Forgetting Curve
 */
export const RECENCY_DECAY = {
  INITIAL_STRENGTH: 1.0,
  DECAY_RATE: 0.07,
  MINIMUM_STRENGTH: 0.3
};
