/**
 * Short-Term Memory System
 * 
 * Handles recent interactions (last 30 minutes to 1 hour)
 * Maintains high recall of recent conversation details
 */

import { MemoryItem, MemoryContext, MemorySearchParams, MemoryRetrievalResult } from '../types';

// Maximum capacity of short-term memory
const MAX_SHORT_TERM_CAPACITY = 50;

// In-memory storage for short-term memory
let shortTermMemoryStore: MemoryItem[] = [];

/**
 * Add a memory item to short-term memory
 */
export const addToShortTermMemory = (
  content: string,
  role: 'patient' | 'roger',
  context?: MemoryContext
): MemoryItem => {
  console.log("SHORT-TERM MEMORY: Adding new item");
  
  const newItem: MemoryItem = {
    id: `stm_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    content,
    timestamp: Date.now(),
    role,
    importance: 0.5, // Default importance
    metadata: {
      emotions: context?.emotions || [],
      topics: context?.topics || [],
      problems: context?.problems || []
    }
  };
  
  // Add to memory store
  shortTermMemoryStore.unshift(newItem);
  
  // Keep within capacity limit
  if (shortTermMemoryStore.length > MAX_SHORT_TERM_CAPACITY) {
    shortTermMemoryStore = shortTermMemoryStore.slice(0, MAX_SHORT_TERM_CAPACITY);
  }
  
  // Persist to session storage for resilience
  try {
    sessionStorage.setItem('rogerShortTermMemory', JSON.stringify(shortTermMemoryStore));
  } catch (error) {
    console.error("SHORT-TERM MEMORY: Failed to persist to sessionStorage", error);
  }
  
  return newItem;
};

/**
 * Retrieve all items from short-term memory
 */
export const getAllShortTermMemory = (): MemoryItem[] => {
  return [...shortTermMemoryStore];
};

/**
 * Search short-term memory based on parameters
 */
export const searchShortTermMemory = (
  params: MemorySearchParams
): MemoryRetrievalResult => {
  let results = [...shortTermMemoryStore];
  
  // Filter by role if specified
  if (params.role) {
    results = results.filter(item => item.role === params.role);
  }
  
  // Filter by timeframe if specified
  if (params.timeframe) {
    if (params.timeframe.start) {
      results = results.filter(item => item.timestamp >= params.timeframe.start!);
    }
    if (params.timeframe.end) {
      results = results.filter(item => item.timestamp <= params.timeframe.end!);
    }
  }
  
  // Simple keyword matching
  if (params.keywords && params.keywords.length > 0) {
    results = results.filter(item => 
      params.keywords!.some(keyword => 
        item.content.toLowerCase().includes(keyword.toLowerCase())
      )
    );
  }
  
  // Apply limit if specified
  if (params.limit && results.length > params.limit) {
    results = results.slice(0, params.limit);
  }
  
  return { items: results };
};

/**
 * Clear short-term memory
 */
export const clearShortTermMemory = (): void => {
  shortTermMemoryStore = [];
  try {
    sessionStorage.removeItem('rogerShortTermMemory');
  } catch (error) {
    console.error("SHORT-TERM MEMORY: Failed to clear from sessionStorage", error);
  }
};

/**
 * Initialize short-term memory from session storage if available
 */
export const initializeShortTermMemory = (): boolean => {
  try {
    const storedMemory = sessionStorage.getItem('rogerShortTermMemory');
    if (storedMemory) {
      const parsedMemory = JSON.parse(storedMemory);
      if (Array.isArray(parsedMemory)) {
        shortTermMemoryStore = parsedMemory;
        console.log("SHORT-TERM MEMORY: Initialized from sessionStorage");
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error("SHORT-TERM MEMORY: Failed to initialize from sessionStorage", error);
    return false;
  }
};

/**
 * Get system status
 */
export const getShortTermMemoryStatus = () => {
  return {
    active: true,
    itemCount: shortTermMemoryStore.length,
    lastUpdated: shortTermMemoryStore.length > 0 
      ? shortTermMemoryStore[0].timestamp 
      : Date.now()
  };
};

// Initialize on module load
initializeShortTermMemory();
