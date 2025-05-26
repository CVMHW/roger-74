
/**
 * Unified Memory Processor
 * 
 * Processes memory context using standardized types and interfaces
 */

import { MemoryContext, EmotionalContext, MemoryPiece, MemoryRole } from '../core/types';
import { masterMemory } from '../../memory';

/**
 * Process memory context with unified types
 */
export const processMemory = async (
  userInput: string,
  emotionalContext: EmotionalContext,
  messageCount: number
): Promise<MemoryContext> => {
  console.log("MEMORY PROCESSOR: Processing memory context");
  
  try {
    // Check for new conversation - Fixed: using correct number of arguments
    const isNewConversation = masterMemory.isNewConversation(userInput);
    
    if (isNewConversation) {
      console.log("MEMORY PROCESSOR: New conversation detected, resetting memory");
      masterMemory.resetMemory();
    }
    
    // Store current interaction with emotional context
    const memoryMetadata = {
      emotions: emotionalContext.primaryEmotion ? [emotionalContext.primaryEmotion] : undefined,
      isDepressionMentioned: emotionalContext.isDepressionMentioned,
      emotionalIntensity: emotionalContext.emotionalIntensity,
      timestamp: Date.now()
    };
    
    const importance = emotionalContext.isDepressionMentioned ? 1.0 : 
                      emotionalContext.hasDetectedEmotion ? 0.8 : 0.6;
    
    // Fixed: Changed 'user' to 'patient' to match MemoryRole type
    masterMemory.addMemory(userInput, 'patient', memoryMetadata, importance);
    
    // Retrieve relevant memories - Fixed: using correct number of arguments
    const rawMemories = masterMemory.searchMemory({
      query: userInput,
      limit: 5,
      minImportance: 0.3
    });
    
    // Convert to unified MemoryPiece format
    const relevantMemories: MemoryPiece[] = rawMemories.map(memory => ({
      id: memory.id || `memory_${Date.now()}_${Math.random()}`,
      content: memory.content,
      role: (memory.role as MemoryRole) || 'system',
      timestamp: memory.timestamp || Date.now(),
      importance: memory.importance || 0.5,
      metadata: memory.metadata || {},
      embedding: memory.embedding
    }));
    
    // Extract conversation themes
    const conversationThemes = extractConversationThemes(userInput, relevantMemories);
    
    const memoryContext: MemoryContext = {
      relevantMemories,
      isNewConversation,
      conversationThemes,
      memoryCoherence: calculateMemoryCoherence(relevantMemories)
    };
    
    console.log("MEMORY PROCESSOR: Processing complete", {
      memoriesFound: relevantMemories.length,
      themes: conversationThemes,
      isNew: isNewConversation
    });
    
    return memoryContext;
    
  } catch (error) {
    console.error("MEMORY PROCESSOR: Error processing memory:", error);
    return {
      relevantMemories: [],
      isNewConversation: false,
      conversationThemes: []
    };
  }
};

/**
 * Extract conversation themes from memory pieces
 */
const extractConversationThemes = (userInput: string, memories: MemoryPiece[]): string[] => {
  const themes: string[] = [];
  const allText = [userInput, ...memories.map(m => m.content)].join(' ').toLowerCase();
  
  const themePatterns = {
    'depression': /\b(depress(ed|ing|ion)?|sad|down|low|hopeless|worthless)\b/i,
    'anxiety': /\b(anxious|anxiety|worry|worried|stress|panic|nervous)\b/i,
    'relationships': /\b(relationship|partner|spouse|family|friend|love)\b/i,
    'work': /\b(work|job|career|boss|colleague|employment)\b/i,
    'health': /\b(health|medical|doctor|hospital|illness|sick)\b/i,
    'trauma': /\b(trauma|abuse|ptsd|flashback|nightmare)\b/i,
    'grief': /\b(grief|loss|death|died|mourning|funeral)\b/i
  };
  
  Object.entries(themePatterns).forEach(([theme, pattern]) => {
    if (pattern.test(allText)) {
      themes.push(theme);
    }
  });
  
  return themes;
};

/**
 * Calculate memory coherence score
 */
const calculateMemoryCoherence = (memories: MemoryPiece[]): number => {
  if (memories.length === 0) return 0;
  
  // Simple coherence based on recency and importance
  const averageImportance = memories.reduce((sum, mem) => sum + mem.importance, 0) / memories.length;
  const recentMemories = memories.filter(mem => 
    mem.timestamp && (Date.now() - mem.timestamp) < 24 * 60 * 60 * 1000 // Last 24 hours
  ).length;
  
  const recencyScore = recentMemories / memories.length;
  
  return (averageImportance * 0.7) + (recencyScore * 0.3);
};
