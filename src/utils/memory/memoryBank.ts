/**
 * MemoryBank - Advanced Multi-Level Memory System
 * 
 * Inspired by research on large language models with enhanced memory capabilities,
 * this system provides:
 * 1. Primary data repository for all interactions
 * 2. Memory retrieval for context-specific memory recollection
 * 3. Memory updater for retaining important information over time
 * 
 * The system incorporates principles from the Ebbinghaus Forgetting Curve
 * to determine when memories need reinforcement.
 */

import { recordToMemory, getAllMemory } from '../nlpProcessor';
import { addToFiveResponseMemory, getFiveResponseMemory, MemoryEntry } from './fiveResponseMemory';

// Define the structure of a memory piece
export interface MemoryPiece {
  id: string;
  timestamp: number;
  content: string;
  role: 'patient' | 'roger';
  emotionalContext?: string[];
  topicContext?: string[];
  importance: number; // 0-1 scale of importance
  lastAccessed: number; // timestamp of last access
  accessCount: number; // how often this memory has been accessed
  forgetFactor: number; // derived from Ebbinghaus forgetting curve
}

// Memory bank storage
export interface MemoryBank {
  shortTermMemory: MemoryPiece[]; // Recent interactions (last 24 hours)
  workingMemory: MemoryPiece[]; // Currently relevant memories being used
  longTermMemory: MemoryPiece[]; // Persistent important memories
  patientProfile: {
    dominantTopics: {[topic: string]: number};
    emotionalPatterns: {[emotion: string]: number};
    personalityTraits: {[trait: string]: number};
    preferences: {[preference: string]: any};
    significantEvents: MemoryPiece[];
    lastUpdated: number;
  };
}

// Initialize memory bank
const MEMORY_BANK: MemoryBank = {
  shortTermMemory: [],
  workingMemory: [],
  longTermMemory: [],
  patientProfile: {
    dominantTopics: {},
    emotionalPatterns: {},
    personalityTraits: {},
    preferences: {},
    significantEvents: [],
    lastUpdated: Date.now()
  }
};

// Maximum capacity limits to prevent excessive memory usage
const MAX_SHORT_TERM_CAPACITY = 50;
const MAX_WORKING_MEMORY_CAPACITY = 20;
const MAX_LONG_TERM_CAPACITY = 500;

/**
 * Apply the Ebbinghaus Forgetting Curve to determine memory retention
 * R = e^(-t/S), where:
 * - R is the memory retention
 * - t is time since learning
 * - S is the strength of the memory
 */
export const calculateRetentionFactor = (
  timeElapsedHours: number,
  importance: number,
  accessCount: number
): number => {
  // Memory strength increases with importance and access count
  const memoryStrength = 10 * importance * Math.log(accessCount + 1.5);
  
  // Calculate retention based on forgetting curve
  const retention = Math.exp(-timeElapsedHours / memoryStrength);
  
  // Return bounded retention factor (0-1)
  return Math.max(0, Math.min(1, retention));
};

/**
 * Add a new memory to the appropriate memory stores
 */
export const addToMemoryBank = (
  content: string,
  role: 'patient' | 'roger',
  emotions: string[] = [],
  topics: string[] = [],
  importance: number = 0.5
): void => {
  try {
    console.log("MEMORYBANK: Adding new memory");
    
    // Create memory piece
    const newMemory: MemoryPiece = {
      id: `mem_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      timestamp: Date.now(),
      content,
      role,
      emotionalContext: emotions,
      topicContext: topics,
      importance,
      lastAccessed: Date.now(),
      accessCount: 1,
      forgetFactor: 1.0 // New memories start at maximum retention
    };
    
    // Add to short-term memory
    MEMORY_BANK.shortTermMemory.unshift(newMemory);
    
    // Maintain capacity limit
    if (MEMORY_BANK.shortTermMemory.length > MAX_SHORT_TERM_CAPACITY) {
      MEMORY_BANK.shortTermMemory = MEMORY_BANK.shortTermMemory.slice(0, MAX_SHORT_TERM_CAPACITY);
    }
    
    // Add to working memory if important enough
    if (importance > 0.7 || emotions.some(e => ['angry', 'sad', 'anxious', 'scared'].includes(e))) {
      MEMORY_BANK.workingMemory.unshift(newMemory);
      
      // Maintain capacity limit
      if (MEMORY_BANK.workingMemory.length > MAX_WORKING_MEMORY_CAPACITY) {
        MEMORY_BANK.workingMemory = MEMORY_BANK.workingMemory.slice(0, MAX_WORKING_MEMORY_CAPACITY);
      }
    }
    
    // Add to long-term memory if very important or has strong emotional content
    if (importance > 0.8 || emotions.some(e => ['trauma', 'crisis', 'grief'].includes(e))) {
      MEMORY_BANK.longTermMemory.unshift(newMemory);
      
      // Maintain capacity limit with intelligent pruning
      if (MEMORY_BANK.longTermMemory.length > MAX_LONG_TERM_CAPACITY) {
        // Sort by importance * retention factor and prune least important
        MEMORY_BANK.longTermMemory.sort((a, b) => {
          const aRetention = calculateRetentionFactor(
            (Date.now() - a.timestamp) / (1000 * 60 * 60), 
            a.importance,
            a.accessCount
          );
          
          const bRetention = calculateRetentionFactor(
            (Date.now() - b.timestamp) / (1000 * 60 * 60), 
            b.importance,
            b.accessCount
          );
          
          return (b.importance * bRetention) - (a.importance * aRetention);
        });
        
        // Keep only the capacity limit
        MEMORY_BANK.longTermMemory = MEMORY_BANK.longTermMemory.slice(0, MAX_LONG_TERM_CAPACITY);
      }
    }
    
    // Update patient profile
    if (role === 'patient') {
      // Update topics
      topics.forEach(topic => {
        MEMORY_BANK.patientProfile.dominantTopics[topic] = 
          (MEMORY_BANK.patientProfile.dominantTopics[topic] || 0) + 1;
      });
      
      // Update emotions
      emotions.forEach(emotion => {
        MEMORY_BANK.patientProfile.emotionalPatterns[emotion] = 
          (MEMORY_BANK.patientProfile.emotionalPatterns[emotion] || 0) + 1;
      });
      
      // Update last modified timestamp
      MEMORY_BANK.patientProfile.lastUpdated = Date.now();
    }
    
    // Persist memory bank to localStorage
    try {
      localStorage.setItem('rogerMemoryBank', JSON.stringify(MEMORY_BANK));
      console.log("MEMORYBANK: Successfully persisted to localStorage");
    } catch (storageError) {
      console.error('MEMORYBANK: Failed to persist to localStorage', storageError);
    }
    
    // Always ensure synchronization with existing memory systems for redundancy
    recordToMemory(role === 'patient' ? content : '', role === 'roger' ? content : '', emotions, topics);
    addToFiveResponseMemory(role, content);
    
  } catch (error) {
    console.error('MEMORYBANK: Failed to add memory', error);
    
    // Fallback to existing memory systems
    if (role === 'patient') {
      recordToMemory(content);
      addToFiveResponseMemory('patient', content);
    } else {
      recordToMemory('', content);
      addToFiveResponseMemory('roger', content);
    }
  }
};

/**
 * Retrieve relevant memories for a given user input using multi-head attention
 */
export const retrieveRelevantMemories = (
  userInput: string,
  topicFilter?: string[],
  emotionFilter?: string[],
  maxResults: number = 5
): MemoryPiece[] => {
  try {
    console.log("MEMORYBANK: Retrieving relevant memories");
    
    // Extract keywords from user input
    const keywords = userInput.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3 && 
        !['this', 'that', 'with', 'have', 'what', 'when', 'where', 'would', 'could'].includes(word)
      );
    
    // Prepare memory sources (multi-head attention concept)
    const memorySources = [
      ...MEMORY_BANK.workingMemory,  // Head 1: Working memory (most relevant current context)
      ...MEMORY_BANK.shortTermMemory.slice(0, 10), // Head 2: Recent short-term memories
      ...MEMORY_BANK.longTermMemory.filter(m => m.importance > 0.7) // Head 3: Important long-term memories
    ];
    
    // Score memories based on relevance to current input
    const scoredMemories = memorySources.map(memory => {
      // Calculate time-based decay factor using forgetting curve
      const hoursElapsed = (Date.now() - memory.timestamp) / (1000 * 60 * 60);
      const retentionFactor = calculateRetentionFactor(
        hoursElapsed,
        memory.importance,
        memory.accessCount
      );
      
      // Calculate keyword match score
      let keywordMatchScore = 0;
      keywords.forEach(keyword => {
        if (memory.content.toLowerCase().includes(keyword)) {
          keywordMatchScore += 1;
        }
      });
      keywordMatchScore = keywords.length > 0 ? keywordMatchScore / keywords.length : 0;
      
      // Calculate context match score
      let contextMatchScore = 0;
      if (memory.topicContext && topicFilter) {
        const topicMatches = memory.topicContext.filter(t => topicFilter.includes(t)).length;
        contextMatchScore += topicFilter.length > 0 ? topicMatches / topicFilter.length : 0;
      }
      
      if (memory.emotionalContext && emotionFilter) {
        const emotionMatches = memory.emotionalContext.filter(e => emotionFilter.includes(e)).length;
        contextMatchScore += emotionFilter.length > 0 ? emotionMatches / emotionFilter.length : 0;
      }
      
      // Combine scores with appropriate weights
      const relevanceScore = (
        (keywordMatchScore * 0.5) + 
        (contextMatchScore * 0.3) + 
        (retentionFactor * 0.2)
      ) * memory.importance;
      
      return {
        memory,
        relevanceScore
      };
    });
    
    // Sort by relevance score and get top results
    const topMemories = scoredMemories
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, maxResults)
      .map(item => {
        // Update access statistics for retrieved memories
        item.memory.lastAccessed = Date.now();
        item.memory.accessCount += 1;
        return item.memory;
      });
    
    return topMemories;
    
  } catch (error) {
    console.error('MEMORYBANK: Failed to retrieve memories', error);
    return [];
  }
};

/**
 * Update patient personality profile based on memory patterns
 */
export const updatePatientProfile = (): void => {
  try {
    console.log("MEMORYBANK: Updating patient profile");
    
    // Extract top topics
    const topTopics = Object.entries(MEMORY_BANK.patientProfile.dominantTopics)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([topic]) => topic);
    
    // Extract emotional patterns
    const emotionalTrends = Object.entries(MEMORY_BANK.patientProfile.emotionalPatterns)
      .sort((a, b) => b[1] - a[1])
      .reduce((acc, [emotion, count]) => {
        acc[emotion] = count;
        return acc;
      }, {} as {[key: string]: number});
    
    // Infer personality traits from patterns (simplified)
    if (emotionalTrends['anxious'] > 3) {
      MEMORY_BANK.patientProfile.personalityTraits['anxious-tendency'] = 
        (MEMORY_BANK.patientProfile.personalityTraits['anxious-tendency'] || 0) + 1;
    }
    
    if (emotionalTrends['sad'] > 3) {
      MEMORY_BANK.patientProfile.personalityTraits['melancholic-tendency'] = 
        (MEMORY_BANK.patientProfile.personalityTraits['melancholic-tendency'] || 0) + 1;
    }
    
    // Update last modified timestamp
    MEMORY_BANK.patientProfile.lastUpdated = Date.now();
    
    // Persist memory bank to localStorage
    try {
      localStorage.setItem('rogerMemoryBank', JSON.stringify(MEMORY_BANK));
    } catch (storageError) {
      console.error('MEMORYBANK: Failed to persist to localStorage', storageError);
    }
    
  } catch (error) {
    console.error('MEMORYBANK: Failed to update patient profile', error);
  }
};

/**
 * Apply memory consolidation process
 * This mimics the human memory process of consolidating short-term memories to long-term storage
 */
export const consolidateMemories = (): void => {
  try {
    console.log("MEMORYBANK: Running memory consolidation");
    
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);
    
    // Find memories in short-term that are older than a day but important
    const memoriesToConsolidate = MEMORY_BANK.shortTermMemory.filter(memory => 
      memory.timestamp < oneDayAgo && memory.importance > 0.6
    );
    
    // Move eligible memories to long-term storage
    memoriesToConsolidate.forEach(memory => {
      // Only add if not already in long-term memory
      if (!MEMORY_BANK.longTermMemory.some(m => m.id === memory.id)) {
        MEMORY_BANK.longTermMemory.push({
          ...memory,
          // Boost importance slightly during consolidation
          importance: Math.min(1.0, memory.importance * 1.1)
        });
      }
    });
    
    // Clean up short-term memory older than a day
    MEMORY_BANK.shortTermMemory = MEMORY_BANK.shortTermMemory.filter(memory => 
      memory.timestamp >= oneDayAgo
    );
    
    // Update forget factors based on Ebbinghaus curve
    MEMORY_BANK.longTermMemory.forEach(memory => {
      const hoursElapsed = (now - memory.timestamp) / (1000 * 60 * 60);
      memory.forgetFactor = calculateRetentionFactor(
        hoursElapsed,
        memory.importance,
        memory.accessCount
      );
    });
    
    // Persist memory bank to localStorage
    try {
      localStorage.setItem('rogerMemoryBank', JSON.stringify(MEMORY_BANK));
    } catch (storageError) {
      console.error('MEMORYBANK: Failed to persist to localStorage', storageError);
    }
    
  } catch (error) {
    console.error('MEMORYBANK: Failed to consolidate memories', error);
  }
};

/**
 * Initialize memory bank from localStorage or create if not exists
 */
export const initializeMemoryBank = (): boolean => {
  try {
    console.log("MEMORYBANK: Initializing");
    
    // Try to load from localStorage
    const storedBank = localStorage.getItem('rogerMemoryBank');
    if (storedBank) {
      try {
        const parsedBank = JSON.parse(storedBank);
        
        // Validate structure before assignment
        if (
          parsedBank.shortTermMemory && 
          parsedBank.workingMemory && 
          parsedBank.longTermMemory &&
          parsedBank.patientProfile
        ) {
          Object.assign(MEMORY_BANK, parsedBank);
          console.log("MEMORYBANK: Successfully restored from localStorage");
          return true;
        }
      } catch (parseError) {
        console.error('MEMORYBANK: Failed to parse stored memory bank', parseError);
      }
    }
    
    // Initialize with existing memory sources if new or invalid stored data
    try {
      // Get data from primary memory system
      const primaryMemory = getAllMemory();
      
      // Get data from 5ResponseMemory system
      const fiveResponseMemory = getFiveResponseMemory();
      
      // Initialize from existing memory sources for redundancy
      if (primaryMemory.patientStatements.length > 0) {
        primaryMemory.patientStatements.forEach((statement, index) => {
          addToMemoryBank(
            statement, 
            'patient',
            [], 
            [], 
            0.5 + (index / primaryMemory.patientStatements.length * 0.3) // More recent = more important
          );
        });
      }
      
      if (primaryMemory.rogerResponses.length > 0) {
        primaryMemory.rogerResponses.forEach((response, index) => {
          addToMemoryBank(
            response, 
            'roger',
            [], 
            [], 
            0.4 + (index / primaryMemory.rogerResponses.length * 0.3)
          );
        });
      }
      
      if (fiveResponseMemory.length > 0) {
        fiveResponseMemory.forEach((entry: MemoryEntry) => {
          addToMemoryBank(
            entry.content,
            entry.role,
            [],
            [],
            0.6
          );
        });
      }
      
      console.log("MEMORYBANK: Initialized with existing memory data");
      return true;
      
    } catch (initError) {
      console.error('MEMORYBANK: Failed to initialize from existing memory', initError);
      return false;
    }
    
  } catch (error) {
    console.error('MEMORYBANK: Failed to initialize', error);
    return false;
  }
};

// Periodic memory consolidation
setInterval(() => {
  try {
    consolidateMemories();
    updatePatientProfile();
  } catch (error) {
    console.error('MEMORYBANK: Error in periodic maintenance', error);
  }
}, 60 * 1000); // Run every minute

// Initialize on load
initializeMemoryBank();

export default {
  addToMemoryBank,
  retrieveRelevantMemories,
  updatePatientProfile,
  consolidateMemories,
  initializeMemoryBank,
  getMemoryBank: () => MEMORY_BANK
};
