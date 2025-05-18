
/**
 * Knowledge Loader
 * 
 * Functions to load knowledge data into vector database
 */

import { v4 as uuidv4 } from 'uuid';
import vectorDB from '../vectorDatabase';
import { generateEmbedding } from '../vectorEmbeddings';
import { KnowledgeEntry, COLLECTIONS } from './types';

/**
 * Load knowledge entries into a collection
 */
export const loadKnowledge = async (entries: KnowledgeEntry[], collectionName: string): Promise<void> => {
  const collection = vectorDB.collection(collectionName);
  
  for (const entry of entries) {
    try {
      // Generate embedding for content
      const embedding = await generateEmbedding(entry.content);
      
      // Add to collection
      collection.insert({
        id: uuidv4(),
        text: entry.content,
        embedding,
        metadata: {
          category: entry.category,
          importance: entry.importance,
          source: entry.source || 'internal'
        }
      });
    } catch (error) {
      console.error(`Error loading knowledge entry: ${entry.content}`, error);
    }
  }
  
  console.log(`✅ Loaded ${entries.length} entries into ${collectionName}`);
};
