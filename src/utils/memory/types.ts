
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

  // Hallucination prevention level (updated to match implementation)
  hallucinationPreventionLevel: 'low' | 'medium' | 'high' | 'aggressive';
  
  // Time thresholds (in milliseconds)
  newSessionThresholdMs: number;
  shortTermExpiryMs: number;
}

/**
 * Base memory item structure used across all memory systems
 */
export interface MemoryItem {
  id: string;
  content: string;
  timestamp: number;
  role: 'patient' | 'roger';
  type?: string;
  importance?: number;
  metadata?: Record<string, any>;
  embeddings?: number[];  // Vector embeddings for semantic search
  verificationStatus?: 'verified' | 'unverified' | 'flagged';
}

/**
 * Memory context information
 */
export interface MemoryContext {
  emotions?: string[];
  topics?: string[];
  problems?: string[];
  factualEntities?: FactualEntity[]; // Named entities with factual verification
}

/**
 * Factual entity with verification
 */
export interface FactualEntity {
  name: string;
  type: 'person' | 'location' | 'organization' | 'date' | 'other';
  value: string;
  confidence: number;
  source?: 'patient' | 'system';
}

/**
 * Memory search parameters
 */
export interface MemorySearchParams {
  keywords?: string[];
  topics?: string[];
  emotions?: string[];
  role?: 'patient' | 'roger';
  timeframe?: {
    start?: number;
    end?: number;
  };
  limit?: number;
  semanticQuery?: string; // For vector search
  minConfidence?: number; // Minimum confidence score for vector search
}

/**
 * Memory retrieval result
 */
export interface MemoryRetrievalResult {
  items: MemoryItem[];
  relevanceScores?: number[];
}

/**
 * Memory backup record
 */
export interface MemoryBackupRecord {
  timestamp: number;
  systemId: string;
  backupLocation: 'localStorage' | 'sessionStorage' | 'indexedDB';
  itemCount: number;
  status: 'success' | 'failed';
  error?: string;
}

/**
 * Memory status information
 */
export interface MemorySystemStatus {
  active: boolean;
  itemCount: number;
  lastUpdated: number;
  lastBackupTimestamp?: number;
  backupStatus?: 'success' | 'failed';
  // Additional optional fields for specific memory subsystems
  recordCount?: number;
  lastBackup?: number;
  topicsCount?: number;
  emotionsCount?: number;
  significantEventsCount?: number;
}

/**
 * Hallucination prevention status
 */
export interface HallucinationPreventionStatus {
  earlyConversation: boolean; // Whether in first 1-3 messages where higher caution is needed
  potentialMemoryReference: boolean; // Whether the response contains memory references
  correctionApplied: boolean; // Whether a correction was applied
  confidenceScore: number; // 0-1 confidence that no hallucination exists
}
