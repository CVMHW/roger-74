/**
 * Memory storage implementation
 * Provides basic storage and retrieval for memory items
 * Now leverages the refactored memory system
 */

import { MemoryItem, MemoryStorage } from './types';
import { addMemory, searchMemory } from '../../memory/memoryController';

// In-memory storage implementation for backward compatibility
const MEMORY_STORAGE: MemoryStorage = { data: [] };

/**
 * Add a new item to memory storage
 */
export const addToMemoryStorage = (item: MemoryItem): void => {
  // Add to local compatibility storage
  if (MEMORY_STORAGE && MEMORY_STORAGE.data) {
    MEMORY_STORAGE.data.push(item);
  }
  
  // Add to refactored memory system
  addMemory(
    item.content,
    item.type === 'roger' ? 'roger' : 'patient',
    undefined,
    0.7 // Default importance for rule enforcement items
  );
};

/**
 * Retrieve all items from memory storage
 */
export const getFromMemoryStorage = (): MemoryItem[] => {
  // If we have items in local storage, return those for backward compatibility
  if (MEMORY_STORAGE && MEMORY_STORAGE.data && MEMORY_STORAGE.data.length > 0) {
    return MEMORY_STORAGE.data;
  }
  
  // Otherwise fetch from refactored memory system
  const memoryItems = searchMemory({
    limit: 50 // Reasonable limit for compatibility
  });
  
  // Convert to expected format
  return memoryItems.map(item => ({
    content: item.content,
    timestamp: item.timestamp,
    type: item.role === 'roger' ? 'roger' : undefined
  }));
};

/**
 * Clear all items from memory storage
 */
export const clearMemoryStorage = (): void => {
  MEMORY_STORAGE.data = [];
  // Note: We don't clear the refactored memory system here
  // as that would be handled through the memory controller's resetMemory function
};
