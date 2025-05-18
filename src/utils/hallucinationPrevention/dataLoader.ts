
/**
 * Vector Database Data Loader
 * 
 * Loads data into the vector database from various sources
 */

import { v4 as uuidv4 } from 'uuid';
import vectorDB from './vectorDatabase';
import { generateEmbedding } from './vectorEmbeddings';
import { searchMemory } from '../memory/memoryController';

// Collection names
export const COLLECTIONS = {
  ROGER_KNOWLEDGE: 'roger_knowledge',
  USER_MESSAGES: 'user_messages',
  ROGER_RESPONSES: 'roger_responses',
  FACTS: 'facts'
};

// Interface for knowledge entries
export interface KnowledgeEntry {
  content: string;
  category: string;
  importance: number;
  source?: string;
}

// Roger therapeutic approach knowledge
const rogerTherapeuticKnowledge: KnowledgeEntry[] = [
  {
    content: "Rogerian therapy focuses on creating a supportive environment where clients feel understood and accepted.",
    category: "therapeutic_approach",
    importance: 1.0
  },
  {
    content: "Unconditional positive regard is a core principle of person-centered therapy, showing acceptance of clients without judgment.",
    category: "therapeutic_approach",
    importance: 0.9
  },
  {
    content: "Active listening involves fully concentrating, understanding, responding, and remembering what is being said.",
    category: "therapeutic_technique",
    importance: 0.9
  },
  {
    content: "Empathetic understanding means accurately perceiving the internal frame of reference of another person.",
    category: "therapeutic_technique",
    importance: 0.95
  },
  {
    content: "Reflection in counseling is mirroring back the client's thoughts and feelings to demonstrate understanding.",
    category: "therapeutic_technique",
    importance: 0.85
  },
  {
    content: "Person-centered therapy believes in the client's capacity for self-understanding and constructive change.",
    category: "therapeutic_approach",
    importance: 0.9
  },
  {
    content: "Genuineness in therapy means the therapist is authentic and transparent in the therapeutic relationship.",
    category: "therapeutic_principle",
    importance: 0.85
  },
  {
    content: "Logotherapy focuses on helping clients find meaning in their lives, even in difficult circumstances.",
    category: "therapeutic_approach",
    importance: 0.8
  },
  {
    content: "Existential therapy explores themes of meaning, freedom, isolation, and mortality in a person's life.",
    category: "therapeutic_approach",
    importance: 0.8
  },
  {
    content: "Motivational interviewing helps clients resolve ambivalent feelings to find internal motivation for change.",
    category: "therapeutic_technique",
    importance: 0.75
  },
  {
    content: "Open-ended questions encourage detailed responses rather than simple yes/no answers.",
    category: "therapeutic_technique",
    importance: 0.7
  },
  {
    content: "Validation in therapy acknowledges and accepts a person's emotional experience as valid and understandable.",
    category: "therapeutic_technique",
    importance: 0.85
  },
  {
    content: "The therapeutic alliance is the relationship of trust and rapport between therapist and client.",
    category: "therapeutic_principle",
    importance: 0.9
  }
];

// Mental health facts
const mentalHealthFacts: KnowledgeEntry[] = [
  {
    content: "Depression affects more than 264 million people worldwide according to the WHO.",
    category: "mental_health_facts",
    importance: 0.8,
    source: "WHO"
  },
  {
    content: "Anxiety disorders are the most common mental health condition, affecting about 18% of adults in the US.",
    category: "mental_health_facts",
    importance: 0.8,
    source: "NIMH"
  },
  {
    content: "Regular physical exercise has been shown to reduce symptoms of depression and anxiety.",
    category: "mental_health_facts",
    importance: 0.75,
    source: "Research studies"
  },
  {
    content: "Mindfulness meditation can help reduce stress and improve emotional regulation.",
    category: "coping_strategies",
    importance: 0.7,
    source: "Research studies"
  },
  {
    content: "Social connection is a key factor in maintaining good mental health and resilience.",
    category: "mental_health_facts",
    importance: 0.85,
    source: "Research studies"
  },
  {
    content: "Sleep plays a crucial role in mental health, with poor sleep linked to increased risk of depression and anxiety.",
    category: "mental_health_facts",
    importance: 0.8,
    source: "Research studies"
  }
];

/**
 * Initialize the vector database with core knowledge
 */
export const initializeVectorDatabase = async (): Promise<boolean> => {
  try {
    console.log("🔄 Initializing vector database with core knowledge...");
    
    // Create collections if they don't exist
    const rogerCollection = vectorDB.collection(COLLECTIONS.ROGER_KNOWLEDGE);
    const factsCollection = vectorDB.collection(COLLECTIONS.FACTS);
    const userCollection = vectorDB.collection(COLLECTIONS.USER_MESSAGES);
    const responseCollection = vectorDB.collection(COLLECTIONS.ROGER_RESPONSES);
    
    // Skip if already populated
    if (rogerCollection.size() > 0) {
      console.log("✅ Vector database already initialized");
      return true;
    }
    
    // Load Roger therapeutic knowledge
    await loadKnowledge(rogerTherapeuticKnowledge, COLLECTIONS.ROGER_KNOWLEDGE);
    
    // Load mental health facts
    await loadKnowledge(mentalHealthFacts, COLLECTIONS.FACTS);
    
    // Load from memory system
    await loadFromMemorySystem();
    
    console.log("✅ Vector database initialized successfully");
    const stats = vectorDB.stats();
    console.log(`📊 Vector database stats: ${JSON.stringify(stats)}`);
    
    return true;
  } catch (error) {
    console.error("❌ Error initializing vector database:", error);
    return false;
  }
};

/**
 * Load knowledge entries into a collection
 */
const loadKnowledge = async (entries: KnowledgeEntry[], collectionName: string): Promise<void> => {
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

/**
 * Load data from the memory system into vector database
 */
const loadFromMemorySystem = async (): Promise<void> => {
  try {
    console.log("🔄 Loading from memory system...");
    
    // Get all memories
    const memories = searchMemory({ limit: 50 });
    
    // Process patient memories
    const patientMemories = memories.filter(memory => memory.role === 'patient');
    const userCollection = vectorDB.collection(COLLECTIONS.USER_MESSAGES);
    
    for (const memory of patientMemories) {
      try {
        const embedding = await generateEmbedding(memory.content);
        userCollection.insert({
          id: uuidv4(),
          text: memory.content,
          embedding,
          metadata: {
            timestamp: memory.timestamp || Date.now(),
            importance: memory.importance || 0.5,
            role: 'patient'
          }
        });
      } catch (error) {
        console.error("Error loading patient memory:", error);
      }
    }
    
    // Process Roger memories
    const rogerMemories = memories.filter(memory => memory.role === 'roger');
    const responseCollection = vectorDB.collection(COLLECTIONS.ROGER_RESPONSES);
    
    for (const memory of rogerMemories) {
      try {
        const embedding = await generateEmbedding(memory.content);
        responseCollection.insert({
          id: uuidv4(),
          text: memory.content,
          embedding,
          metadata: {
            timestamp: memory.timestamp || Date.now(),
            importance: memory.importance || 0.5,
            role: 'roger'
          }
        });
      } catch (error) {
        console.error("Error loading roger memory:", error);
      }
    }
    
    console.log(`✅ Loaded ${patientMemories.length} patient memories and ${rogerMemories.length} Roger memories`);
  } catch (error) {
    console.error("❌ Error loading from memory system:", error);
  }
};

/**
 * Add a new user message to the vector database
 */
export const addUserMessage = async (content: string): Promise<string | null> => {
  try {
    const collection = vectorDB.collection(COLLECTIONS.USER_MESSAGES);
    const embedding = await generateEmbedding(content);
    
    const id = collection.insert({
      id: uuidv4(),
      text: content,
      embedding,
      metadata: {
        timestamp: Date.now(),
        role: 'patient'
      }
    });
    
    return id;
  } catch (error) {
    console.error("Error adding user message to vector database:", error);
    return null;
  }
};

/**
 * Add a Roger response to the vector database
 */
export const addRogerResponse = async (content: string): Promise<string | null> => {
  try {
    const collection = vectorDB.collection(COLLECTIONS.ROGER_RESPONSES);
    const embedding = await generateEmbedding(content);
    
    const id = collection.insert({
      id: uuidv4(),
      text: content,
      embedding,
      metadata: {
        timestamp: Date.now(),
        role: 'roger'
      }
    });
    
    return id;
  } catch (error) {
    console.error("Error adding Roger response to vector database:", error);
    return null;
  }
};
