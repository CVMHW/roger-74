
/**
 * Type definitions for the memory enforcement system
 */

export interface MemoryItem {
  content: string;
  timestamp: number;
  type?: string;
}

export interface MemoryStorage {
  data: MemoryItem[];
}
