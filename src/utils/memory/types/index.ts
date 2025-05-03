
/**
 * Core memory system types
 */

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
}

/**
 * Memory context information
 */
export interface MemoryContext {
  emotions?: string[];
  topics?: string[];
  problems?: string[];
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

