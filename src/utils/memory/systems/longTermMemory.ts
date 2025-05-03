/**
 * Long-Term Memory System
 * 
 * Handles persistent important memories
 * Applies forgetting curve to simulate natural memory processes
 */

import { MemoryItem, MemoryContext, MemorySearchParams, MemoryRetrievalResult } from '../types';

// Maximum capacity of long-term memory
const MAX_LONG_TERM_CAPACITY = 500;

// In-memory storage for long-term memory
let longTermMemoryStore: MemoryItem[] = [];

/**
 * Apply forgetting curve to calculate retention
 * R = e^(-t/S), where:
 * - R is the memory retention
 * - t is time since learning in hours
 * - S is the memory strength
 */
const calculateRetention = (
  timeElapsedHours: number, 
  importance: number = 0.5, 
  accessCount: number = 1
): number => {
  // Memory strength increases with importance and access count
  const memoryStrength = 10 * importance * Math.log(accessCount + 1.5);
  
  // Calculate retention based on forgetting curve
  const retention = Math.exp(-timeElapsedHours / memoryStrength);
  
  // Return bounded retention factor (0-1)
  return Math.max(0, Math.min(1, retention));
};

/**
 * Add a memory item to long-term memory
 */
export const addToLongTermMemory = (
  content: string,
  role: 'patient' | 'roger',
  importance: number = 0.8,
  context?: MemoryContext
): MemoryItem => {
  console.log("LONG-TERM MEMORY: Adding new item");
  
  const newItem: MemoryItem = {
    id: `ltm_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
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
      forgetFactor: 1.0 // Initial retention is maximum
    }
  };
  
  // Add to memory store
  longTermMemoryStore.unshift(newItem);
  
  // Apply intelligent pruning if over capacity
  if (longTermMemoryStore.length > MAX_LONG_TERM_CAPACITY) {
    // Update retention factors for all items
    const now = Date.now();
    longTermMemoryStore.forEach(item => {
      const hoursElapsed = (now - item.timestamp) / (1000 * 60 * 60);
      const accessCount = item.metadata?.accessCount || 1;
      const forgetFactor = calculateRetention(
        hoursElapsed,
        item.importance || 0.5,
        accessCount
      );
      
      if (item.metadata) {
        item.metadata.forgetFactor = forgetFactor;
      } else {
        item.metadata = { forgetFactor };
      }
    });
    
    // Sort by importance * retention and prune least valuable
    longTermMemoryStore.sort((a, b) => {
      const aValue = (a.importance || 0.5) * (a.metadata?.forgetFactor || 0.5);
      const bValue = (b.importance || 0.5) * (b.metadata?.forgetFactor || 0.5);
      return bValue - aValue;
    });
    
    // Keep only within capacity
    longTermMemoryStore = longTermMemoryStore.slice(0, MAX_LONG_TERM_CAPACITY);
  }
  
  // Persist to localStorage
  try {
    localStorage.setItem('rogerLongTermMemory', JSON.stringify(longTermMemoryStore));
    console.log("LONG-TERM MEMORY: Successfully persisted to localStorage");
  } catch (error) {
    console.error("LONG-TERM MEMORY: Failed to persist to localStorage", error);
  }
  
  return newItem;
};

/**
 * Retrieve all items from long-term memory
 */
export const getAllLongTermMemory = (): MemoryItem[] => {
  return [...longTermMemoryStore];
};

/**
 * Search long-term memory based on parameters
 */
export const searchLongTermMemory = (
  params: MemorySearchParams
): MemoryRetrievalResult => {
  const now = Date.now();
  let results = [...longTermMemoryStore];
  let relevanceScores: number[] = [];
  
  // Apply basic filters
  if (params.role) {
    results = results.filter(item => item.role === params.role);
  }
  
  if (params.timeframe) {
    if (params.timeframe.start) {
      results = results.filter(item => item.timestamp >= params.timeframe.start!);
    }
    if (params.timeframe.end) {
      results = results.filter(item => item.timestamp <= params.timeframe.end!);
    }
  }
  
  // Calculate relevance scores for each item
  results.forEach(item => {
    let score = 0;
    
    // Base score from importance
    score += (item.importance || 0.5) * 0.4;
    
    // Add retention factor (time decay)
    const hoursElapsed = (now - item.timestamp) / (1000 * 60 * 60);
    const accessCount = item.metadata?.accessCount || 1;
    const retention = calculateRetention(
      hoursElapsed,
      item.importance || 0.5,
      accessCount
    );
    
    score += retention * 0.2;
    
    // Keyword matching
    if (params.keywords && params.keywords.length > 0) {
      const keywordMatches = params.keywords.filter(keyword => 
        item.content.toLowerCase().includes(keyword.toLowerCase())
      ).length;
      
      score += (keywordMatches / params.keywords.length) * 0.3;
    }
    
    // Topic matching
    if (params.topics && params.topics.length > 0 && item.metadata?.topics) {
      const topicMatches = params.topics.filter(topic =>
        item.metadata?.topics.includes(topic)
      ).length;
      
      score += (topicMatches / params.topics.length) * 0.1;
    }
    
    relevanceScores.push(score);
  });
  
  // Combine results with scores and sort
  const scoredResults = results.map((item, index) => ({ 
    item, 
    score: relevanceScores[index] 
  }));
  
  scoredResults.sort((a, b) => b.score - a.score);
  
  // Update access counts for retrieved items
  scoredResults.forEach(({ item }) => {
    if (item.metadata) {
      item.metadata.accessCount = (item.metadata.accessCount || 0) + 1;
      item.metadata.lastAccessed = now;
    }
  });
  
  // Extract sorted items and scores
  results = scoredResults.map(r => r.item);
  relevanceScores = scoredResults.map(r => r.score);
  
  // Apply limit if specified
  if (params.limit && results.length > params.limit) {
    results = results.slice(0, params.limit);
    relevanceScores = relevanceScores.slice(0, params.limit);
  }
  
  // Store back updates to the items
  longTermMemoryStore = longTermMemoryStore.map(storeItem => {
    const updatedItem = results.find(r => r.id === storeItem.id);
    return updatedItem || storeItem;
  });
  
  return { 
    items: results,
    relevanceScores
  };
};

/**
 * Consolidate memories based on forgetting curve and importance
 */
export const consolidateMemories = (): void => {
  console.log("LONG-TERM MEMORY: Consolidating memories");
  
  const now = Date.now();
  
  // Update forget factors for all items
  longTermMemoryStore.forEach(item => {
    const hoursElapsed = (now - item.timestamp) / (1000 * 60 * 60);
    const accessCount = item.metadata?.accessCount || 1;
    const forgetFactor = calculateRetention(
      hoursElapsed,
      item.importance || 0.5,
      accessCount
    );
    
    if (item.metadata) {
      item.metadata.forgetFactor = forgetFactor;
    } else {
      item.metadata = { forgetFactor };
    }
  });
  
  // Persist to localStorage
  try {
    localStorage.setItem('rogerLongTermMemory', JSON.stringify(longTermMemoryStore));
    console.log("LONG-TERM MEMORY: Successfully persisted consolidated memories");
  } catch (error) {
    console.error("LONG-TERM MEMORY: Failed to persist consolidated memories", error);
  }
};

/**
 * Clear long-term memory
 */
export const clearLongTermMemory = (): void => {
  longTermMemoryStore = [];
  try {
    localStorage.removeItem('rogerLongTermMemory');
  } catch (error) {
    console.error("LONG-TERM MEMORY: Failed to clear from localStorage", error);
  }
};

/**
 * Initialize long-term memory from localStorage
 */
export const initializeLongTermMemory = (): boolean => {
  try {
    const storedMemory = localStorage.getItem('rogerLongTermMemory');
    if (storedMemory) {
      const parsedMemory = JSON.parse(storedMemory);
      if (Array.isArray(parsedMemory)) {
        longTermMemoryStore = parsedMemory;
        console.log("LONG-TERM MEMORY: Initialized from localStorage");
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error("LONG-TERM MEMORY: Failed to initialize from localStorage", error);
    return false;
  }
};

/**
 * Get system status
 */
export const getLongTermMemoryStatus = () => {
  return {
    active: true,
    itemCount: longTermMemoryStore.length,
    lastUpdated: longTermMemoryStore.length > 0 
      ? Math.max(...longTermMemoryStore.map(item => item.timestamp))
      : Date.now(),
    lastBackupTimestamp: longTermMemoryStore.length > 0 ? Date.now() : undefined
  };
};

// Initialize on module load
initializeLongTermMemory();

// Set up periodic consolidation
setInterval(consolidateMemories, 5 * 60 * 1000); // Every 5 minutes
