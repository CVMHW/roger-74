
/**
 * Memory storage implementation
 * Provides basic storage and retrieval for memory items
 */

import { MemoryItem, MemoryStorage } from './types';

// In-memory storage implementation
const MEMORY_STORAGE: MemoryStorage = { data: [] };

/**
 * Add a new item to memory storage
 */
export const addToMemoryStorage = (item: MemoryItem): void => {
  if (MEMORY_STORAGE && MEMORY_STORAGE.data) {
    MEMORY_STORAGE.data.push(item);
  }
};

/**
 * Retrieve all items from memory storage
 */
export const getFromMemoryStorage = (): MemoryItem[] => {
  return MEMORY_STORAGE && MEMORY_STORAGE.data ? MEMORY_STORAGE.data : [];
};

/**
 * Clear all items from memory storage
 */
export const clearMemoryStorage = (): void => {
  MEMORY_STORAGE.data = [];
};

