/**
 * Persistent Vector Storage
 * 
 * Uses browser localStorage to persist vectors between sessions
 * for better cold-start performance and reduced redundant embeddings
 */

import { VectorRecord } from './vectorDatabase';

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
};

/**
 * Persist vectors to localStorage
 */
export const persistVectors = (
  collectionName: string,
  records: VectorRecord[]
): void => {
  try {
    // Get existing data
    const existingData = getPersistedVectors();
    
    // Filter out old records for this collection if too many
    const otherCollections = existingData.filter(
      record => record.collectionName !== collectionName
    );
    
    // Prepare to persist new records for this collection (up to 100 per collection)
    const collectionRecords = records.slice(0, 100).map(record => ({
      id: record.id,
      text: record.text,
      embedding: record.embedding,
      metadata: record.metadata,
      collectionName,
      timestamp: Date.now()
    }));
    
    // Combine records but limit total storage
    const combinedRecords = [...otherCollections, ...collectionRecords];
    
    // If combined size is too large, keep only the most recent records
    const MAX_RECORDS = 500;
    const finalRecords = combinedRecords.length > MAX_RECORDS
      ? combinedRecords
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, MAX_RECORDS)
      : combinedRecords;
    
    // Store combined records
    localStorage.setItem(
      STORAGE_KEYS.VECTOR_DATA,
      JSON.stringify(finalRecords)
    );
    
    // Update last update timestamp
    localStorage.setItem(
      STORAGE_KEYS.LAST_UPDATE,
      Date.now().toString()
    );
    
    console.log(`Persisted ${collectionRecords.length} vectors for ${collectionName}`);
  } catch (error) {
    console.error('Error persisting vectors:', error);
  }
};

/**
 * Retrieve persisted vectors from localStorage
 */
export const getPersistedVectors = (): PersistedVectorRecord[] => {
  try {
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
 * Load vectors from local storage into the vector database
 */
export const loadPersistedVectors = (
  collectionName: string,
  addToCollection: (records: VectorRecord[]) => void
): boolean => {
  try {
    // Get persisted vectors for this collection
    const persistedVectors = getPersistedVectorsForCollection(collectionName);
    
    if (persistedVectors.length === 0) {
      return false;
    }
    
    // Convert to vector records
    const vectorRecords = persistedVectors.map(persisted => ({
      id: persisted.id,
      text: persisted.text,
      embedding: persisted.embedding,
      metadata: {
        ...persisted.metadata,
        persisted: true,
        persistedAt: persisted.timestamp
      }
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
    localStorage.removeItem(STORAGE_KEYS.VECTOR_DATA);
    localStorage.removeItem(STORAGE_KEYS.INDEX_DATA);
    localStorage.removeItem(STORAGE_KEYS.LAST_UPDATE);
    console.log('Cleared persisted vectors');
  } catch (error) {
    console.error('Error clearing persisted vectors:', error);
  }
};
