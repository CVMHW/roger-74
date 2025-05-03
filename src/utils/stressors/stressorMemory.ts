
/**
 * Stressor Memory Integration
 * 
 * Integrates stressor knowledge into Roger's memory systems
 */

import { addMemory, searchMemory } from '../memory/memoryController';
import { detectStressors, getPrimaryStressor } from './stressorDetection';
import { DetectedStressor } from './stressorTypes';

/**
 * Store stressor-related memory from conversation
 */
export const storeStressorMemory = (
  content: string,
  role: 'patient' | 'roger'
): void => {
  // Only process patient messages for stressor detection
  if (role !== 'patient') return;
  
  try {
    // Detect stressors in the content
    const detectedStressors = detectStressors(content);
    
    if (detectedStressors.length === 0) return;
    
    // Create context with stressor information
    const context = {
      emotions: [], // Will be filled by emotion detection system
      topics: detectedStressors.map(ds => ds.stressor.category),
      problems: detectedStressors.map(ds => ds.stressor.name),
      stressors: detectedStressors.map(ds => ({
        id: ds.stressor.id,
        name: ds.stressor.name,
        category: ds.stressor.category,
        confidence: ds.confidence,
        intensity: ds.intensity
      }))
    };
    
    // Store with high importance for stressor content
    const importance = calculateStressorImportance(detectedStressors);
    addMemory(content, role, context, importance);
    
    console.log(`STRESSOR MEMORY: Stored ${detectedStressors.length} stressors with importance ${importance}`);
  } catch (error) {
    console.error("Error storing stressor memory:", error);
  }
};

/**
 * Calculate memory importance based on detected stressors
 */
const calculateStressorImportance = (detectedStressors: DetectedStressor[]): number => {
  if (detectedStressors.length === 0) return 0.5;
  
  // Base importance on severity and confidence
  let totalImportance = 0;
  
  for (const ds of detectedStressors) {
    let severityScore = 0.5; // Default moderate severity
    
    if (ds.intensity === 'mild') severityScore = 0.3;
    if (ds.intensity === 'moderate') severityScore = 0.5;
    if (ds.intensity === 'severe') severityScore = 0.8;
    
    // Combine severity with confidence
    const stressorScore = severityScore * ds.confidence;
    totalImportance += stressorScore;
  }
  
  // Average and normalize to 0.5-0.9 range
  const avgImportance = totalImportance / detectedStressors.length;
  const normalizedImportance = 0.5 + (avgImportance * 0.4);
  
  return Math.min(0.9, normalizedImportance);
};

/**
 * Find relevant stressor memories
 */
export const findStressorMemories = (userInput: string): string[] => {
  const memories: string[] = [];
  
  try {
    // Get primary stressor if any
    const primaryStressor = getPrimaryStressor(userInput);
    
    if (!primaryStressor) return memories;
    
    // Search for relevant memories about this stressor
    const searchResults = searchMemory({
      keywords: primaryStressor.stressor.keywords,
      limit: 2
    });
    
    if (searchResults && searchResults.length > 0) {
      for (const result of searchResults) {
        if (result.role === 'patient' && result.metadata?.stressors) {
          memories.push(`You mentioned struggling with ${primaryStressor.stressor.name.toLowerCase()} when you said "${result.content.substring(0, 40)}..."`);
        }
      }
    }
    
    return memories;
  } catch (error) {
    console.error("Error finding stressor memories:", error);
    return memories;
  }
};

/**
 * Check if patient has discussed specific stressor category before
 */
export const hasDiscussedStressorCategory = (category: string): boolean => {
  try {
    const searchResults = searchMemory({
      limit: 10
    });
    
    if (!searchResults || searchResults.length === 0) return false;
    
    // Check if any memory has this stressor category
    return searchResults.some(memory => 
      memory.metadata?.topics?.includes(category) ||
      memory.metadata?.stressors?.some((s: any) => s.category === category)
    );
  } catch (error) {
    console.error("Error checking stressor history:", error);
    return false;
  }
};

