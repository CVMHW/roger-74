/**
 * Working Memory System
 * 
 * Handles currently relevant memories being used in the conversation
 * Maintains a limited set of highly salient information
 */

import { MemoryItem, MemoryContext, MemorySearchParams, MemoryRetrievalResult } from '../types';
import { DEFAULT_MEMORY_CONFIG } from '../config';
import { optimizeMemory } from '../../hallucinationPrevention/memoryPruning';

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
      accessCount: 1,
      lastAccessed: Date.now(),
      isActive: true
    }
  };
  
  // Add to memory store
  workingMemoryStore.unshift(newItem);
  
  // Keep within capacity limit with intelligent pruning
  if (workingMemoryStore.length > DEFAULT_MEMORY_CONFIG.workingMemoryCapacity) {
    intelligentPrune();
  }
  
  return newItem;
};

/**
 * Intelligent pruning of working memory using advanced pruning algorithm
 */
const intelligentPrune = (): void => {
  // Use our advanced memory pruning system
  workingMemoryStore = optimizeMemory(workingMemoryStore, {
    maxItems: DEFAULT_MEMORY_CONFIG.workingMemoryCapacity,
    preserveImportantItems: true,
    importanceMinValue: 0.7,
    preserveRecentItems: true,
    recentItemsCount: 5,
    preserveRoles: ['roger'],  // Prioritize keeping Roger's responses
    recencyWeight: 0.4,
    importanceWeight: 0.4,
    accessWeight: 0.2
  });
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
        item.metadata?.topics?.includes(topic)
      )
    );
  }
  
  // Filter by emotions
  if (params.emotions && params.emotions.length > 0) {
    results = results.filter(item => 
      item.metadata?.emotions && 
      params.emotions!.some(emotion => 
        item.metadata?.emotions?.includes(emotion)
      )
    );
  }
  
  // Apply limit if specified
  if (params.limit && results.length > params.limit) {
    results = results.slice(0, params.limit);
  }
  
  // Track access for each item
  results.forEach(item => {
    if (item.metadata) {
      item.metadata.accessCount = (item.metadata.accessCount || 0) + 1;
      item.metadata.lastAccessed = Date.now();
    } else {
      item.metadata = { accessCount: 1, lastAccessed: Date.now() };
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
 * Initialize working memory from storage if available
 */
export const initializeWorkingMemory = (): boolean => {
  try {
    const storedMemory = sessionStorage.getItem('rogerWorkingMemory');
    if (storedMemory) {
      workingMemoryStore = JSON.parse(storedMemory);
      console.log("WORKING MEMORY: Initialized from sessionStorage");
      return true;
    }
    return false;
  } catch (error) {
    console.error("WORKING MEMORY: Failed to initialize", error);
    return false;
  }
};

/**
 * Save working memory to storage
 */
const persistWorkingMemory = (): void => {
  try {
    sessionStorage.setItem('rogerWorkingMemory', JSON.stringify(workingMemoryStore));
  } catch (error) {
    console.error("WORKING MEMORY: Failed to persist", error);
  }
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

// Setup automatic persistence
const PERSISTENCE_INTERVAL = 30000; // 30 seconds
setInterval(persistWorkingMemory, PERSISTENCE_INTERVAL);
