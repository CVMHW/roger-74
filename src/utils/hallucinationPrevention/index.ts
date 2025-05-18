
/**
 * Hallucination Prevention System
 * 
 * This is the main entry point for the hallucination prevention system
 * which includes the RAG (Retrieval Augmented Generation) capabilities
 */

import { initializeRetrievalSystem } from './retrieval';
import { isUsingSimulatedEmbeddings, forceReinitializeEmbeddingModel, detectBestAvailableDevice } from './vectorEmbeddings';
import vectorDB from './vectorDatabase';

// Export all components
export * from './vectorEmbeddings';
export * from './vectorReranker';
export * from './retrieval';

// Sample knowledge base data for the vector database
const knowledgeBaseEntries = [
  {
    id: "concept-rogerian-therapy",
    text: "Rogerian therapy, also known as person-centered therapy, is a non-directive form of talk therapy developed by Carl Rogers in the 1940s and 1950s. The approach relies on the personal relationship between therapist and client, placing trust in the client to lead the therapeutic journey.",
    category: "core-concepts"
  },
  {
    id: "concept-unconditional-positive-regard",
    text: "Unconditional positive regard is a core principle in Rogerian therapy where the therapist demonstrates complete acceptance and support for the patient without judgment, regardless of what they say or do. This creates a safe environment for honest expression.",
    category: "core-concepts"
  },
  {
    id: "concept-empathetic-understanding",
    text: "Empathetic understanding involves the therapist actively trying to perceive the world from the client's perspective. This goes beyond sympathy to truly sensing the client's feelings as if they were the therapist's own, without losing the 'as if' quality.",
    category: "core-concepts"
  },
  {
    id: "technique-active-listening",
    text: "Active listening in Rogerian therapy involves fully concentrating, understanding, responding, and remembering what the client is saying. This demonstrates respect and builds trust by showing the client their thoughts and feelings are valued.",
    category: "techniques"
  },
  {
    id: "technique-reflection",
    text: "Reflection is a therapeutic technique where the therapist mirrors back the client's thoughts and feelings in their own words. This helps the client hear their own thoughts from another perspective and confirms the therapist's understanding.",
    category: "techniques"
  },
  {
    id: "application-anxiety",
    text: "When dealing with anxiety, a Rogerian therapist creates a safe space for clients to explore their fears without judgment. Through reflection and empathy, clients can understand their anxiety triggers and develop self-compassion.",
    category: "applications"
  },
  {
    id: "application-depression",
    text: "For depression, person-centered therapy helps clients express their feelings without fear of rejection. The therapist's unconditional positive regard helps counter negative self-perception that often accompanies depression.",
    category: "applications"
  },
  {
    id: "research-efficacy",
    text: "Research shows person-centered therapy is effective for various psychological conditions including anxiety, depression, and relationship issues. Studies demonstrate outcomes comparable to other therapeutic approaches, with particularly strong results for improving self-concept.",
    category: "research"
  }
];

/**
 * Get system diagnostics information
 */
export const getRAGSystemDiagnostics = async (): Promise<{
  usingSimulation: boolean;
  device: string;
  vectorStats: any;
  modelStatus: string;
  knowledgeBaseSize: number;
}> => {
  const usingSimulation = isUsingSimulatedEmbeddings();
  const device = await detectBestAvailableDevice();
  const vectorStats = vectorDB.stats();
  
  return {
    usingSimulation,
    device,
    vectorStats,
    modelStatus: usingSimulation ? 'simulation' : 'huggingface',
    knowledgeBaseSize: knowledgeBaseEntries.length
  };
};

/**
 * Populate the knowledge base with initial data
 */
const populateKnowledgeBase = async (): Promise<boolean> => {
  try {
    console.log("📚 Populating knowledge base with initial data...");
    
    // Get the knowledge collection
    const knowledgeCollection = vectorDB.collection('knowledge');
    
    // Skip if already populated
    if (knowledgeCollection.size() >= knowledgeBaseEntries.length) {
      console.log("Knowledge base already populated");
      return true;
    }
    
    // Clear existing data
    knowledgeCollection.clear();
    
    // Import all knowledge embeddings from sample data
    const { generateEmbeddings } = await import('./vectorEmbeddings');
    
    // Generate embeddings for all entries
    const embeddings = await generateEmbeddings(
      knowledgeBaseEntries.map(entry => entry.text),
      { batchSize: 3, timeoutMs: 15000 }
    );
    
    // Insert all entries with their embeddings
    embeddings.forEach((result, index) => {
      const entry = knowledgeBaseEntries[index];
      knowledgeCollection.insert({
        id: entry.id,
        text: entry.text,
        embedding: result.embedding,
        metadata: {
          category: entry.category,
          source: 'builtin-knowledge'
        }
      });
    });
    
    console.log(`✅ Knowledge base populated with ${embeddings.length} entries`);
    return true;
  } catch (error) {
    console.error("Error populating knowledge base:", error);
    return false;
  }
};

// Initialize the RAG system
export const initializeRAGSystem = async (): Promise<boolean> => {
  try {
    console.log("🌟 Initializing RAG system...");
    
    // Check device capabilities
    const device = await detectBestAvailableDevice();
    console.log(`🖥️ Using device: ${device} for RAG system`);
    
    // If using simulated embeddings, try to reinitialize the model
    if (isUsingSimulatedEmbeddings()) {
      console.log("Attempting to switch from simulated to real embeddings...");
      await forceReinitializeEmbeddingModel();
    }
    
    // Track memory usage if available
    if ('memory' in performance) {
      const memoryInfo = (performance as any).memory;
      console.log(`📊 Memory usage: ${Math.round(memoryInfo.usedJSHeapSize / (1024 * 1024))}MB / ${Math.round(memoryInfo.jsHeapSizeLimit / (1024 * 1024))}MB`);
    }
    
    // Initialize the retrieval system
    const success = await initializeRetrievalSystem();
    
    // Populate the knowledge base with initial data
    await populateKnowledgeBase();
    
    // Enable vector indexing for efficient search
    vectorDB.enableIndexing(16);
    
    // Get vector database stats
    const stats = vectorDB.stats();
    console.log(`Vector database stats: ${JSON.stringify(stats)}`);
    
    // Report final status
    console.log(`RAG system initialized - Using real embeddings: ${!isUsingSimulatedEmbeddings()}`);
    
    return success;
  } catch (error) {
    console.error("Failed to initialize RAG system:", error);
    return false;
  }
};

// Export the system initialization function
export default {
  initializeRAGSystem,
  isUsingSimulatedEmbeddings,
  getRAGSystemDiagnostics
};
