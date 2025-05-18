/**
 * Advanced Memory Pruning System
 * 
 * Implements sophisticated pruning strategies for memory systems
 * to maintain optimal performance with limited browser resources
 */

import { MemoryItem } from '../memory/types';

/**
 * Memory pruning strategy options
 */
export interface MemoryPruningOptions {
  // Maximum items to keep in memory
  maxItems?: number;
  // Retention time in milliseconds
  retentionTimeMs?: number;
  // Importance threshold for pruning (items below this may be pruned)
  importanceThreshold?: number;
  // Whether to keep all important items regardless of other factors
  preserveImportantItems?: boolean;
  // What's considered an important item
  importanceMinValue?: number;
  // Whether to keep recent items regardless of other factors
  preserveRecentItems?: boolean;
  // Number of recent items to preserve
  recentItemsCount?: number;
  // Base scores for different factors
  recencyWeight?: number;
  importanceWeight?: number;
  accessWeight?: number;
  // Preserve items with specific roles
  preserveRoles?: string[];
}

/**
 * Calculate retention scores for memory items using a sophisticated
 * scoring algorithm that considers multiple factors
 */
export const calculateRetentionScores = (
  items: MemoryItem[],
  options: MemoryPruningOptions = {}
): Array<{ item: MemoryItem; score: number }> => {
  const {
    retentionTimeMs = 24 * 60 * 60 * 1000, // Default 24 hours
    importanceMinValue = 0.7,
    recencyWeight = 0.4,
    importanceWeight = 0.4,
    accessWeight = 0.2
  } = options;

  const now = Date.now();
  
  return items.map(item => {
    // Calculate recency factor (0-1)
    const ageMs = now - item.timestamp;
    const recencyScore = Math.max(0, 1 - (ageMs / retentionTimeMs));
    
    // Get importance score (default to 0.5 if not set)
    const importanceScore = typeof item.importance === 'number' 
      ? item.importance 
      : 0.5;
    
    // Calculate access pattern score
    const accessCount = item.metadata?.accessCount || 1;
    const lastAccessedMs = item.metadata?.lastAccessed || item.timestamp;
    const lastAccessAgeMs = now - lastAccessedMs;
    
    // Recent accesses are more valuable than old ones
    const accessRecencyFactor = Math.max(0.1, Math.min(1, 1 - (lastAccessAgeMs / (12 * 60 * 60 * 1000))));
    
    // Combine access count and recency
    const accessScore = Math.min(1, (Math.log(accessCount + 1) / Math.log(10)) * accessRecencyFactor);
    
    // Combine scores with weights
    const combinedScore = 
      (recencyScore * recencyWeight) +
      (importanceScore * importanceWeight) +
      (accessScore * accessWeight);
    
    return {
      item,
      score: combinedScore
    };
  });
};

/**
 * Prune memory items based on sophisticated retention scoring
 */
export const pruneMemoryItems = (
  items: MemoryItem[],
  options: MemoryPruningOptions = {}
): MemoryItem[] => {
  const {
    maxItems = 100,
    importanceThreshold = 0.3,
    preserveImportantItems = true,
    importanceMinValue = 0.7,
    preserveRecentItems = true,
    recentItemsCount = 10,
    preserveRoles = []
  } = options;
  
  // No pruning needed if under max items
  if (items.length <= maxItems) {
    return items;
  }
  
  // Calculate retention scores
  const scoredItems = calculateRetentionScores(items, options);
  
  // Sort by score (higher is better)
  scoredItems.sort((a, b) => b.score - a.score);
  
  // Create result array with preserved items
  const result: MemoryItem[] = [];
  const preservedItemIds = new Set<string>();
  
  // First pass: preserve important items
  if (preserveImportantItems) {
    scoredItems.forEach(({ item }) => {
      const isImportant = (typeof item.importance === 'number' && 
                          item.importance >= importanceMinValue);
      
      if (isImportant) {
        result.push(item);
        preservedItemIds.add(item.id);
      }
    });
  }
  
  // Second pass: preserve items with specific roles
  if (preserveRoles.length > 0) {
    scoredItems.forEach(({ item }) => {
      if (!preservedItemIds.has(item.id) && 
          item.role && 
          preserveRoles.includes(item.role)) {
        result.push(item);
        preservedItemIds.add(item.id);
      }
    });
  }
  
  // Third pass: preserve recent items
  if (preserveRecentItems) {
    const sortedByRecency = [...items]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, recentItemsCount);
      
    sortedByRecency.forEach(item => {
      if (!preservedItemIds.has(item.id)) {
        result.push(item);
        preservedItemIds.add(item.id);
      }
    });
  }
  
  // Final pass: add remaining items by score until we reach maxItems
  for (const { item } of scoredItems) {
    if (result.length >= maxItems) break;
    
    if (!preservedItemIds.has(item.id)) {
      result.push(item);
      preservedItemIds.add(item.id);
    }
  }
  
  return result;
};

/**
 * Intelligently merge similar memory items to reduce redundancy
 */
export const mergeSimilarMemories = (
  items: MemoryItem[],
  similarityThreshold: number = 0.85
): MemoryItem[] => {
  // Group potential candidates by role for more efficient comparison
  const groupedByRole: Record<string, MemoryItem[]> = {};
  
  items.forEach(item => {
    const role = item.role || 'unknown';
    if (!groupedByRole[role]) {
      groupedByRole[role] = [];
    }
    groupedByRole[role].push(item);
  });
  
  const result: MemoryItem[] = [];
  const processedIds = new Set<string>();
  
  // Process each role group
  Object.values(groupedByRole).forEach(group => {
    // Sort by timestamp (newest first) within each group
    group.sort((a, b) => b.timestamp - a.timestamp);
    
    for (let i = 0; i < group.length; i++) {
      const item = group[i];
      
      // Skip if already processed
      if (processedIds.has(item.id)) continue;
      
      // Mark as processed
      processedIds.add(item.id);
      
      // Look for similar items
      const similarItems: MemoryItem[] = [];
      
      for (let j = i + 1; j < group.length; j++) {
        const otherItem = group[j];
        if (processedIds.has(otherItem.id)) continue;
        
        // Calculate similarity (for now a simple string comparison)
        // In a real implementation, we'd use proper embeddings
        const similarity = calculateTextSimilarity(
          item.content,
          otherItem.content
        );
        
        if (similarity >= similarityThreshold) {
          similarItems.push(otherItem);
          processedIds.add(otherItem.id);
        }
      }
      
      // If we found similar items, merge them
      if (similarItems.length > 0) {
        // Use the most recent item as the base
        const mergedItem = {...item};
        
        // Combine metadata from similar items
        mergedItem.metadata = mergedItem.metadata || {};
        mergedItem.metadata.merged = true;
        mergedItem.metadata.mergedCount = similarItems.length + 1;
        mergedItem.metadata.mergedIds = [
          item.id,
          ...similarItems.map(i => i.id)
        ];
        
        // Take the highest importance
        const allImportances = [
          item.importance || 0,
          ...similarItems.map(i => i.importance || 0)
        ];
        mergedItem.importance = Math.max(...allImportances);
        
        // Combine access counts if available
        const accessCounts = [
          item.metadata?.accessCount || 0,
          ...similarItems.map(i => i.metadata?.accessCount || 0)
        ];
        mergedItem.metadata.accessCount = accessCounts.reduce((sum, count) => sum + count, 0);
        
        result.push(mergedItem);
      } else {
        // No similar items, keep as is
        result.push(item);
      }
    }
  });
  
  return result;
};

/**
 * Calculate text similarity between two strings
 * This is a simple implementation - would be better with embeddings
 */
const calculateTextSimilarity = (text1: string, text2: string): number => {
  // Simple word overlap calculation
  const words1 = new Set(text1.toLowerCase().split(/\W+/).filter(w => w.length > 2));
  const words2 = new Set(text2.toLowerCase().split(/\W+/).filter(w => w.length > 2));
  
  // Count matching words
  let matches = 0;
  for (const word of words2) {
    if (words1.has(word)) matches++;
  }
  
  // Calculate Jaccard similarity
  const union = new Set([...words1, ...words2]);
  return matches / union.size;
};

/**
 * Apply a complete memory optimization strategy
 * combining pruning and merging
 */
export const optimizeMemory = (
  items: MemoryItem[],
  options: MemoryPruningOptions = {}
): MemoryItem[] => {
  try {
    // First merge similar items to reduce redundancy
    const mergedItems = mergeSimilarMemories(items, 0.8);
    
    // Then prune to stay within limits
    return pruneMemoryItems(mergedItems, options);
  } catch (error) {
    console.error("Error in memory optimization:", error);
    // Fallback to simple pruning on error
    return items.slice(0, options.maxItems || 100);
  }
};
