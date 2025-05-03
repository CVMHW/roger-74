/**
 * Working Memory System
 * 
 * Handles currently relevant memories being used in the conversation
 * Maintains a limited set of highly salient information
 */

import { MemoryItem, MemoryContext, MemorySearchParams, MemoryRetrievalResult } from '../types';

// Maximum capacity of working memory
const MAX_WORKING_MEMORY_CAPACITY = 20;

// In-memory storage for working memory
let workingMemoryStore: MemoryItem[] = [];

/**
 * Add a memory item to working memory
 */
export const addToWorkingMemory = (
  content: string,
  role: 'patient' | 'roger',
  importance: number = 0.7,
  context?: MemoryContext
): MemoryItem => {
  console.log("WORKING MEMORY: Adding new item");
  
  const newItem: MemoryItem = {
    id: `wm_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    content,
    timestamp: Date.now(),
    role,
    importance,
    metadata: {
      emotions: context?.emotions || [],
      topics: context?.topics || [],
      problems: context?.problems || [],
      accessCount: 1
    }
  };
  
  // Add to memory store
  workingMemoryStore.unshift(newItem);
  
  // Keep within capacity limit with intelligent pruning
  if (workingMemoryStore.length > MAX_WORKING_MEMORY_CAPACITY) {
    // Sort by importance and keep most important items
    workingMemoryStore.sort((a, b) => (b.importance || 0) - (a.importance || 0));
    workingMemoryStore = workingMemoryStore.slice(0, MAX_WORKING_MEMORY_CAPACITY);
  }
  
  return newItem;
};

/**
 * Retrieve all items from working memory
 */
export const getAllWorkingMemory = (): MemoryItem[] => {
  return [...workingMemoryStore];
};

/**
 * Search working memory based on parameters
 */
export const searchWorkingMemory = (
  params: MemorySearchParams
): MemoryRetrievalResult => {
  let results = [...workingMemoryStore];
  
  // Filter by role if specified
  if (params.role) {
    results = results.filter(item => item.role === params.role);
  }
  
  // Filter by keywords
  if (params.keywords && params.keywords.length > 0) {
    results = results.filter(item => 
      params.keywords!.some(keyword => 
        item.content.toLowerCase().includes(keyword.toLowerCase())
      )
    );
  }
  
  // Filter by topics
  if (params.topics && params.topics.length > 0) {
    results = results.filter(item => 
      item.metadata?.topics && 
      params.topics!.some(topic => 
        item.metadata?.topics.includes(topic)
      )
    );
  }
  
  // Filter by emotions
  if (params.emotions && params.emotions.length > 0) {
    results = results.filter(item => 
      item.metadata?.emotions && 
      params.emotions!.some(emotion => 
        item.metadata?.emotions.includes(emotion)
      )
    );
  }
  
  // Apply limit if specified
  if (params.limit && results.length > params.limit) {
    results = results.slice(0, params.limit);
  }
  
  // Track access for each item
  results.forEach(item => {
    if (item.metadata && item.metadata.accessCount) {
      item.metadata.accessCount += 1;
    } else if (item.metadata) {
      item.metadata.accessCount = 1;
    } else {
      item.metadata = { accessCount: 1 };
    }
  });
  
  return { items: results };
};

/**
 * Clear working memory
 */
export const clearWorkingMemory = (): void => {
  workingMemoryStore = [];
};

/**
 * Get system status
 */
export const getWorkingMemoryStatus = () => {
  return {
    active: true,
    itemCount: workingMemoryStore.length,
    lastUpdated: workingMemoryStore.length > 0 
      ? workingMemoryStore[0].timestamp 
      : Date.now()
  };
};
