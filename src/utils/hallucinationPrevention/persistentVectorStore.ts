
/**
 * Persistent Vector Storage
 * 
 * Uses browser localStorage to persist vectors between sessions
 * for better cold-start performance and reduced redundant embeddings
 */

import { VectorRecord } from './vectorDatabase';
import { getEmbeddingSuccessRate } from './vectorEmbeddings';

// Interface for persisted vector records
interface PersistedVectorRecord {
  id: string;
  text: string;
  embedding: number[];
  metadata?: Record<string, any>;
  collectionName: string;
  timestamp: number;
}

// Storage keys
const STORAGE_KEYS = {
  VECTOR_DATA: 'roger_vector_store_data',
  INDEX_DATA: 'roger_vector_store_index',
  LAST_UPDATE: 'roger_vector_store_updated',
  COLLECTION_STATS: 'roger_vector_store_stats',
  EMBEDDINGS_META: 'roger_vector_embeddings_meta',
};

// Storage limits and configurations
const STORAGE_CONFIG = {
  MAX_RECORDS_TOTAL: 1000,  // Increased from 500
  MAX_RECORDS_PER_COLLECTION: 250,  // Increased from 100
  COMPRESSION_ENABLED: false, // Future: enable compression for larger storage
  EXPIRATION_DAYS: 14, // Extended from 7 to 14 days
  PRIORITY_COLLECTIONS: ['FACTS', 'ROGER_KNOWLEDGE'], // Collections to prioritize for persistence
};

/**
 * Check if localStorage is available and working
 */
const isLocalStorageAvailable = (): boolean => {
  try {
    const testKey = '__test_storage__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Get storage stats for vectors
 */
export const getVectorStorageStats = (): Record<string, any> => {
  try {
    if (!isLocalStorageAvailable()) return {};
    
    const statsStr = localStorage.getItem(STORAGE_KEYS.COLLECTION_STATS);
    if (!statsStr) return {};
    
    return JSON.parse(statsStr);
  } catch (error) {
    console.error('Error getting vector storage stats:', error);
    return {};
  }
};

/**
 * Update storage stats
 */
const updateStorageStats = (collections: Record<string, number>) => {
  try {
    if (!isLocalStorageAvailable()) return;
    
    const lastUpdate = Date.now();
    const stats = {
      collections,
      lastUpdate,
      totalRecords: Object.values(collections).reduce((sum, val) => sum + val, 0),
      embeddingsSuccessRate: getEmbeddingSuccessRate(),
    };
    
    localStorage.setItem(STORAGE_KEYS.COLLECTION_STATS, JSON.stringify(stats));
    localStorage.setItem(STORAGE_KEYS.LAST_UPDATE, lastUpdate.toString());
  } catch (error) {
    console.error('Error updating storage stats:', error);
  }
};

/**
 * Check if a vector should be persisted based on quality metrics
 */
const shouldPersistVector = (record: VectorRecord): boolean => {
  // Skip storing very short texts
  if (record.text.length < 10) return false;
  
  // Check if it's part of a priority collection
  if (record.metadata?.collectionName && 
      STORAGE_CONFIG.PRIORITY_COLLECTIONS.includes(record.metadata.collectionName)) {
    return true;
  }
  
  // For non-priority collections, check quality metrics
  const quality = record.metadata?.quality || 0;
  const importance = record.metadata?.importance || 0;
  
  // Higher threshold for non-priority items
  return quality > 0.7 || importance > 0.7;
}

/**
 * Persist vectors to localStorage
 */
export const persistVectors = (
  collectionName: string,
  records: VectorRecord[]
): void => {
  try {
    if (!isLocalStorageAvailable()) {
      console.warn('LocalStorage not available, skipping vector persistence');
      return;
    }
    
    // Get existing data
    const existingData = getPersistedVectors();
    
    // Filter out old records for this collection if too many
    const otherCollections = existingData.filter(
      record => record.collectionName !== collectionName
    );
    
    // Filter expired records
    const currentTime = Date.now();
    const expirationTime = STORAGE_CONFIG.EXPIRATION_DAYS * 24 * 60 * 60 * 1000; // days to ms
    const validOtherCollections = otherCollections.filter(
      record => (currentTime - record.timestamp) < expirationTime
    );
    
    // Filter records by quality before storing
    const filteredRecords = records.filter(shouldPersistVector);
    
    // Prepare to persist new records for this collection (up to max per collection)
    const collectionRecords = filteredRecords
      .slice(0, STORAGE_CONFIG.MAX_RECORDS_PER_COLLECTION)
      .map(record => ({
        id: record.id,
        text: record.text,
        embedding: record.embedding,
        metadata: {
          ...record.metadata,
          persistedAt: Date.now()
        },
        collectionName,
        timestamp: Date.now()
      }));
    
    // Combine records but limit total storage
    const combinedRecords = [...validOtherCollections, ...collectionRecords];
    
    // If combined size is too large, prioritize records
    let finalRecords = combinedRecords;
    if (combinedRecords.length > STORAGE_CONFIG.MAX_RECORDS_TOTAL) {
      // First sort by timestamp (recent first)
      const sortedByRecent = combinedRecords
        .sort((a, b) => b.timestamp - a.timestamp);
      
      // Reserve at least 50% of slots for priority collections
      const priorityRecords = sortedByRecent.filter(
        r => STORAGE_CONFIG.PRIORITY_COLLECTIONS.includes(r.collectionName)
      );
      
      const nonPriorityRecords = sortedByRecent.filter(
        r => !STORAGE_CONFIG.PRIORITY_COLLECTIONS.includes(r.collectionName)
      );
      
      // Calculate how many slots to allocate for each type
      const priorityLimit = Math.max(
        Math.floor(STORAGE_CONFIG.MAX_RECORDS_TOTAL * 0.5), 
        Math.min(priorityRecords.length, STORAGE_CONFIG.MAX_RECORDS_TOTAL * 0.8)
      );
      
      const nonPriorityLimit = STORAGE_CONFIG.MAX_RECORDS_TOTAL - priorityLimit;
      
      // Combine with proper limits
      finalRecords = [
        ...priorityRecords.slice(0, priorityLimit),
        ...nonPriorityRecords.slice(0, nonPriorityLimit)
      ];
    }
    
    // Store combined records
    localStorage.setItem(
      STORAGE_KEYS.VECTOR_DATA,
      JSON.stringify(finalRecords)
    );
    
    // Update storage stats
    const collectionCounts = finalRecords.reduce((counts, record) => {
      counts[record.collectionName] = (counts[record.collectionName] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);
    
    updateStorageStats(collectionCounts);
    
    console.log(`Persisted ${collectionRecords.length} vectors for ${collectionName} (${filteredRecords.length}/${records.length} passed quality filter)`);
  } catch (error) {
    console.error('Error persisting vectors:', error);
  }
};

/**
 * Retrieve persisted vectors from localStorage
 */
export const getPersistedVectors = (): PersistedVectorRecord[] => {
  try {
    if (!isLocalStorageAvailable()) return [];
    
    const storedData = localStorage.getItem(STORAGE_KEYS.VECTOR_DATA);
    if (!storedData) {
      return [];
    }
    
    return JSON.parse(storedData);
  } catch (error) {
    console.error('Error retrieving persisted vectors:', error);
    return [];
  }
};

/**
 * Get persisted vectors for a specific collection
 */
export const getPersistedVectorsForCollection = (
  collectionName: string
): PersistedVectorRecord[] => {
  try {
    return getPersistedVectors().filter(
      record => record.collectionName === collectionName
    );
  } catch (error) {
    console.error(`Error retrieving persisted vectors for ${collectionName}:`, error);
    return [];
  }
};

/**
 * Pre-load vectors from local storage
 * Loads vectors early in the page lifecycle for better performance
 */
export const preloadVectors = async (): Promise<boolean> => {
  try {
    if (!isLocalStorageAvailable()) return false;
    
    // Check if we have vectors stored
    const storedData = localStorage.getItem(STORAGE_KEYS.VECTOR_DATA);
    if (!storedData) return false;
    
    console.log("Preloading vectors from localStorage");
    
    // Just parse them to warm up the cache
    const vectors = JSON.parse(storedData);
    
    // Return success based on whether we found vectors
    return Array.isArray(vectors) && vectors.length > 0;
  } catch (error) {
    console.error("Error preloading vectors:", error);
    return false;
  }
};

/**
 * Load vectors from local storage into the vector database
 */
export const loadPersistedVectors = (
  collectionName: string,
  addToCollection: (records: VectorRecord[]) => void
): boolean => {
  try {
    // Check localStorage availability
    if (!isLocalStorageAvailable()) {
      console.warn('LocalStorage not available, skipping vector loading');
      return false;
    }
    
    // Get persisted vectors for this collection
    const persistedVectors = getPersistedVectorsForCollection(collectionName);
    
    if (persistedVectors.length === 0) {
      return false;
    }
    
    // Convert to vector records
    const vectorRecords: VectorRecord[] = persistedVectors.map(persisted => ({
      id: persisted.id,
      text: persisted.text,
      embedding: persisted.embedding,
      metadata: {
        ...persisted.metadata,
        persisted: true,
        persistedAt: persisted.timestamp,
        source: 'localStorage'
      },
      timestamp: persisted.timestamp
    }));
    
    // Add to collection
    addToCollection(vectorRecords);
    
    console.log(`Loaded ${vectorRecords.length} persisted vectors for ${collectionName}`);
    return true;
  } catch (error) {
    console.error(`Error loading persisted vectors for ${collectionName}:`, error);
    return false;
  }
};

/**
 * Clear persisted vectors
 */
export const clearPersistedVectors = (): void => {
  try {
    if (!isLocalStorageAvailable()) return;
    
    localStorage.removeItem(STORAGE_KEYS.VECTOR_DATA);
    localStorage.removeItem(STORAGE_KEYS.INDEX_DATA);
    localStorage.removeItem(STORAGE_KEYS.LAST_UPDATE);
    localStorage.removeItem(STORAGE_KEYS.COLLECTION_STATS);
    console.log('Cleared persisted vectors');
  } catch (error) {
    console.error('Error clearing persisted vectors:', error);
  }
};

/**
 * Check if we have recent persisted vectors
 */
export const hasRecentPersistedVectors = (): boolean => {
  try {
    if (!isLocalStorageAvailable()) return false;
    
    const lastUpdate = localStorage.getItem(STORAGE_KEYS.LAST_UPDATE);
    if (!lastUpdate) return false;
    
    const lastUpdateTime = parseInt(lastUpdate, 10);
    const currentTime = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    // Consider vectors recent if updated in the last day
    return (currentTime - lastUpdateTime) < oneDayMs;
  } catch (error) {
    console.error('Error checking for recent vectors:', error);
    return false;
  }
};

// Start preloading vectors as soon as possible
setTimeout(() => {
  preloadVectors().then(result => {
    if (result) {
      console.log("Successfully preloaded vectors");
    }
  });
}, 500); // Small delay to let page initialize first
