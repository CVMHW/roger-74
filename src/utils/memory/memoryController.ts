
/**
 * Memory Controller
 * 
 * Central interface for the Roger memory system that coordinates between
 * different memory components and ensures data integrity across systems
 */

import { MemoryItem, MemoryContext, MemorySearchParams, MemorySystemStatus } from './types';

// Import memory systems
import * as ShortTermMemory from './systems/shortTermMemory';
import * as WorkingMemory from './systems/workingMemory';
import * as LongTermMemory from './systems/longTermMemory';
import * as PatientProfileMemory from './systems/patientProfileMemory';
import * as BackupMemory from './systems/backupMemory';

// Import original memory system for backward compatibility
import { recordToMemory as recordToOriginalMemory } from '../nlpProcessor';
import { addToFiveResponseMemory as recordToFiveResponseMemory } from './fiveResponseMemory';

/**
 * Add a memory item to the appropriate memory stores
 */
export const addMemory = (
  content: string,
  role: 'patient' | 'roger',
  context?: MemoryContext,
  importance?: number
): void => {
  console.log("MEMORY CONTROLLER: Adding new memory");
  
  try {
    // Calculate default importance if not provided
    const defaultImportance = calculateImportance(content, context);
    const memoryImportance = importance ?? defaultImportance;
    
    // Always add to short-term memory
    const shortTermItem = ShortTermMemory.addToShortTermMemory(content, role, context);
    
    // Add to working memory if important enough
    if (memoryImportance >= 0.7 || hasHighEmotionalContent(context)) {
      WorkingMemory.addToWorkingMemory(content, role, memoryImportance, context);
    }
    
    // Add to long-term memory if very important
    if (memoryImportance >= 0.8 || hasSignificantContent(content, context)) {
      LongTermMemory.addToLongTermMemory(content, role, memoryImportance, context);
    }
    
    // Update patient profile if this is patient content
    if (role === 'patient') {
      // Update topics and emotions
      if (context?.topics) {
        PatientProfileMemory.updatePatientTopics(context.topics);
      }
      
      if (context?.emotions) {
        PatientProfileMemory.updatePatientEmotions(context.emotions);
      }
      
      // Add as significant event if important enough
      if (memoryImportance >= 0.9) {
        PatientProfileMemory.addSignificantEvent({
          ...shortTermItem,
          importance: memoryImportance
        });
      }
    }
    
    // Create periodic backups
    const now = Date.now();
    const fiveMinutesAgo = now - 5 * 60 * 1000;
    
    if (!lastBackupTimestamp || lastBackupTimestamp < fiveMinutesAgo) {
      // Create backups of all memory systems
      BackupMemory.createBackup(ShortTermMemory.getAllShortTermMemory(), 'shortTerm');
      BackupMemory.createBackup(LongTermMemory.getAllLongTermMemory(), 'longTerm');
      lastBackupTimestamp = now;
    }
    
    // Ensure compatibility with original memory systems
    recordToOriginalMemory(
      role === 'patient' ? content : '', 
      role === 'roger' ? content : '',
      context?.emotions,
      context?.topics,
      context?.problems
    );
    
    recordToFiveResponseMemory(role, content);
    
  } catch (error) {
    console.error("MEMORY CONTROLLER: Error adding memory", error);
    
    // Attempt recovery through legacy memory systems
    try {
      recordToOriginalMemory(
        role === 'patient' ? content : '', 
        role === 'roger' ? content : ''
      );
      
      recordToFiveResponseMemory(role, content);
      
      console.log("MEMORY CONTROLLER: Fallback to legacy memory systems successful");
    } catch (fallbackError) {
      console.error("MEMORY CONTROLLER: Critical failure - all memory systems failed", fallbackError);
    }
  }
};

// Track last backup timestamp
let lastBackupTimestamp: number | null = null;

/**
 * Calculate importance based on content and context
 */
const calculateImportance = (content: string, context?: MemoryContext): number => {
  let importance = 0.5; // Default
  
  // Adjust for content length (longer content might be more important)
  const words = content.split(/\s+/).length;
  if (words > 50) importance += 0.1;
  if (words > 100) importance += 0.1;
  
  // Adjust for emotional content
  if (context?.emotions && context.emotions.length > 0) {
    const highIntensityEmotions = ['angry', 'scared', 'anxious', 'devastated', 'grief', 'trauma'];
    if (context.emotions.some(e => highIntensityEmotions.includes(e))) {
      importance += 0.2;
    } else {
      importance += 0.1;
    }
  }
  
  // Adjust for problem content
  if (context?.problems && context.problems.length > 0) {
    importance += 0.2;
  }
  
  // Adjust for exclamation marks and question marks (might indicate intensity)
  const exclamationCount = (content.match(/!/g) || []).length;
  const questionCount = (content.match(/\?/g) || []).length;
  importance += Math.min(0.1, (exclamationCount + questionCount) * 0.02);
  
  // Ensure bounds
  return Math.min(1.0, Math.max(0.1, importance));
};

/**
 * Check if context has high emotional content
 */
const hasHighEmotionalContent = (context?: MemoryContext): boolean => {
  if (!context?.emotions || context.emotions.length === 0) {
    return false;
  }
  
  const highIntensityEmotions = ['angry', 'scared', 'anxious', 'devastated', 'grief', 'trauma'];
  return context.emotions.some(e => highIntensityEmotions.includes(e));
};

/**
 * Check if content has significant indicators
 */
const hasSignificantContent = (content: string, context?: MemoryContext): boolean => {
  // Check for markers of significant content
  const significantPatterns = [
    /\b(trauma|abuse|suicide|crisis|emergency|urgent)\b/i,
    /\b(never|always|first time|last time)\b/i,
    /\b(died|passed away|death|loss|grief)\b/i,
    /\b(important|significant|critical|key|vital)\b/i
  ];
  
  return significantPatterns.some(pattern => pattern.test(content)) ||
         (context?.problems && context.problems.length > 0);
};

/**
 * Search memory across all systems
 */
export const searchMemory = (
  query: MemorySearchParams
): MemoryItem[] => {
  console.log("MEMORY CONTROLLER: Searching memory");
  
  try {
    // Search each memory system
    const shortTermResults = ShortTermMemory.searchShortTermMemory(query).items;
    const workingResults = WorkingMemory.searchWorkingMemory(query).items;
    const longTermResults = LongTermMemory.searchLongTermMemory(query).items;
    
    // Combine results and deduplicate by ID
    const combinedResults = [...shortTermResults, ...workingResults, ...longTermResults];
    const uniqueResults = deduplicateById(combinedResults);
    
    // Sort by relevance
    const sortedResults = sortByRelevance(uniqueResults, query);
    
    // Apply limit if specified
    if (query.limit && sortedResults.length > query.limit) {
      return sortedResults.slice(0, query.limit);
    }
    
    return sortedResults;
    
  } catch (error) {
    console.error("MEMORY CONTROLLER: Error searching memory", error);
    return [];
  }
};

/**
 * Deduplicate memory items by ID
 */
const deduplicateById = (items: MemoryItem[]): MemoryItem[] => {
  const uniqueIds = new Set<string>();
  return items.filter(item => {
    if (!uniqueIds.has(item.id)) {
      uniqueIds.add(item.id);
      return true;
    }
    return false;
  });
};

/**
 * Sort memory items by relevance to query
 */
const sortByRelevance = (items: MemoryItem[], query: MemorySearchParams): MemoryItem[] => {
  return items.sort((a, b) => {
    // Prioritize recent items
    const timeRelevance = b.timestamp - a.timestamp;
    
    // Prioritize high importance items
    const importanceRelevance = ((b.importance || 0.5) - (a.importance || 0.5)) * 10000;
    
    // Combine factors
    return importanceRelevance + timeRelevance;
  });
};

/**
 * Get memory system status
 */
export const getMemoryStatus = (): Record<string, MemorySystemStatus> => {
  return {
    shortTerm: ShortTermMemory.getShortTermMemoryStatus(),
    working: WorkingMemory.getWorkingMemoryStatus(),
    longTerm: LongTermMemory.getLongTermMemoryStatus(),
    backup: BackupMemory.getBackupStatus(),
    patientProfile: {
      active: true,
      itemCount: PatientProfileMemory.getPatientProfileStatus().significantEventsCount,
      lastUpdated: PatientProfileMemory.getPatientProfileStatus().lastUpdated,
      topicsCount: PatientProfileMemory.getPatientProfileStatus().topicsCount,
      emotionsCount: PatientProfileMemory.getPatientProfileStatus().emotionsCount,
      significantEventsCount: PatientProfileMemory.getPatientProfileStatus().significantEventsCount
    }
  };
};

/**
 * Reset memory for new conversation
 */
export const resetMemory = (): void => {
  console.log("MEMORY CONTROLLER: Resetting memory for new conversation");
  
  try {
    // Create backups before clearing
    BackupMemory.createBackup(ShortTermMemory.getAllShortTermMemory(), 'shortTerm_preReset');
    BackupMemory.createBackup(WorkingMemory.getAllWorkingMemory(), 'working_preReset');
    
    // Clear memory systems
    ShortTermMemory.clearShortTermMemory();
    WorkingMemory.clearWorkingMemory();
    
    // Do not clear long-term memory or patient profile
    // Those should persist across conversations
    
    console.log("MEMORY CONTROLLER: Memory reset successful");
  } catch (error) {
    console.error("MEMORY CONTROLLER: Error resetting memory", error);
  }
};

/**
 * Detect if this is a new conversation based on time gap
 */
export const isNewConversation = (userInput: string): boolean => {
  const shortTermStatus = ShortTermMemory.getShortTermMemoryStatus();
  
  // If no items, it's a new conversation
  if (shortTermStatus.itemCount === 0) {
    return true;
  }
  
  // Check for time gap (30+ minutes indicates new conversation)
  const timeSinceLastUpdate = Date.now() - shortTermStatus.lastUpdated;
  const thirtyMinutesMs = 30 * 60 * 1000;
  
  if (timeSinceLastUpdate > thirtyMinutesMs) {
    return true;
  }
  
  // Check for introduction patterns
  const introductionPatterns = [
    /\b(hi|hello|hey)\b/i,
    /\bhow are you\b/i,
    /\bnice to meet you\b/i
  ];
  
  const isIntroduction = introductionPatterns.some(pattern => pattern.test(userInput));
  
  // If it's an introduction and we have existing messages, likely new conversation
  return isIntroduction && shortTermStatus.itemCount > 3;
};

/**
 * Initialize all memory systems
 */
export const initializeMemory = (): void => {
  console.log("MEMORY CONTROLLER: Initializing all memory systems");
  
  ShortTermMemory.initializeShortTermMemory();
  LongTermMemory.initializeLongTermMemory();
  PatientProfileMemory.initializePatientProfile();
  BackupMemory.initializeBackupRecords();
  
  console.log("MEMORY CONTROLLER: Initialization complete");
};

// Initialize memory systems when module loads
initializeMemory();
