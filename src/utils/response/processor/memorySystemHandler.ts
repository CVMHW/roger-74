
/**
 * Memory System Handler
 * 
 * Connects the response processor to memory systems
 */

import { addMemory } from '../../memory/memoryController';
import { addToFiveResponseMemory } from '../../memory/fiveResponseMemory';
import { storeStressorMemory } from '../../stressors/stressorMemory';
import { storeClevelandMemory } from '../../cleveland/clevelandMemory';
import { detectClevelandTopics } from '../../cleveland/clevelandTopics';
import { detectHarmfulRepetitions } from './repetitionPrevention';

/**
 * Record content to all memory systems
 * Now with repetition quality check before storing
 */
export const recordToMemorySystems = (
  content: string,
  context?: any,
  metadata?: any,
  importance: number = 0.5
): void => {
  try {
    // Skip storing responses with repetition issues (NEW)
    const repetitionCheck = detectHarmfulRepetitions(content);
    if (repetitionCheck.hasRepetition && repetitionCheck.repetitionScore > 0.6) {
      console.log("MEMORY: Skipping recording of response with repetition issues");
      return;
    }
    
    // Record to primary memory system
    addMemory(content, 'roger', context, importance);
    
    // Record to legacy memory system for redundancy
    addToFiveResponseMemory('roger', content);
    
    // Log recording to memory systems
    console.log("MEMORY: Recorded response to memory systems");
    
  } catch (error) {
    // Log error but don't crash
    console.error("ERROR: Failed to record to memory systems", error);
  }
};

/**
 * Record patient content to all memory systems
 * With enhanced memory integration for improved coherence
 */
export const recordPatientContentToMemorySystems = (
  content: string,
  context?: any,
  metadata?: any,
  importance: number = 0.5
): void => {
  try {
    // Record to primary memory system
    addMemory(content, 'patient', context, importance);
    
    // Record to legacy memory system for redundancy
    addToFiveResponseMemory('patient', content);
    
    // Check for special content types that need dedicated storage
    
    // Process for stressor detection and storage
    storeStressorMemory(content, 'patient');
    
    // Process for Cleveland-specific content
    const clevelandTopics = detectClevelandTopics(content);
    if (clevelandTopics.length > 0) {
      storeClevelandMemory(content, 'patient', clevelandTopics);
      
      // Boost importance for Cleveland-specific content
      if (context) {
        context.hasClevelandContent = true;
        context.clevelandTopics = clevelandTopics;
      }
    }
    
    // Track special content types for memory coherence
    const contentTypes = detectContentTypes(content);
    if (contentTypes.length > 0) {
      if (context) {
        context.contentTypes = contentTypes;
      }
    }
    
    // Log recording to memory systems
    console.log("MEMORY: Recorded patient content to memory systems");
    
  } catch (error) {
    // Log error but don't crash
    console.error("ERROR: Failed to record patient content to memory systems", error);
  }
};

/**
 * Detect content types for better memory organization
 */
const detectContentTypes = (content: string): string[] => {
  const contentTypes: string[] = [];
  
  if (/eat(ing)?|food|meal|diet|nutrition|weight/i.test(content)) {
    contentTypes.push('eating');
  }
  
  if (/depress(ed|ion)|anxious|anxiety|worry|stress|overwhelm/i.test(content)) {
    contentTypes.push('mentalHealth');
  }
  
  if (/friend|family|relationship|partner|spouse|husband|wife|boyfriend|girlfriend/i.test(content)) {
    contentTypes.push('relationships');
  }
  
  if (/job|work|career|boss|coworker|workplace/i.test(content)) {
    contentTypes.push('work');
  }
  
  return contentTypes;
};
