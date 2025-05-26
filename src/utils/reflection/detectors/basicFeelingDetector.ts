
/**
 * Basic feeling detection functionality
 * Enhanced with developmental stage awareness and child-friendly translations
 */

import { FeelingCategory, DevelopmentalStage } from '../reflectionTypes';
import { FEELING_WORDS, feelingCategories } from '../core/feelingCategories';

export interface FeelingDetectionResult {
  primaryFeeling: FeelingCategory | null;
  allFeelings: FeelingCategory[];
  confidence: number;
}

export interface EnhancedFeelingResult {
  category: FeelingCategory;
  detectedWord: string;
  primaryFeeling?: string;
  allFeelings?: string[];
  topics?: string[];
  severity?: number;
  hasEmotionalContent?: boolean;
  childFriendly?: {
    translation: string;
    intensity: 'mild' | 'moderate' | 'strong';
  };
}

/**
 * Identify feelings in text input
 */
export const identifyFeelings = (text: string): FeelingDetectionResult => {
  const lowercaseText = text.toLowerCase();
  const detectedFeelings: FeelingCategory[] = [];
  
  // Check each feeling category
  Object.entries(FEELING_WORDS).forEach(([category, words]) => {
    const feelingCategory = category as FeelingCategory;
    
    // Check if any words from this category appear in the text
    const foundWords = words.filter(word => 
      lowercaseText.includes(word.toLowerCase())
    );
    
    if (foundWords.length > 0) {
      detectedFeelings.push(feelingCategory);
    }
  });
  
  // Return the first detected feeling as primary, or null if none found
  return {
    primaryFeeling: detectedFeelings[0] || null,
    allFeelings: detectedFeelings,
    confidence: detectedFeelings.length > 0 ? 0.8 : 0.0
  };
};

/**
 * Enhanced feeling identification with additional context
 */
export const identifyEnhancedFeelings = (text: string, stage?: DevelopmentalStage): EnhancedFeelingResult[] => {
  const lowercaseText = text.toLowerCase();
  const results: EnhancedFeelingResult[] = [];
  
  // Check each feeling category
  Object.entries(FEELING_WORDS).forEach(([category, words]) => {
    const feelingCategory = category as FeelingCategory;
    
    // Check if any words from this category appear in the text
    const foundWords = words.filter(word => 
      lowercaseText.includes(word.toLowerCase())
    );
    
    if (foundWords.length > 0) {
      const result: EnhancedFeelingResult = {
        category: feelingCategory,
        detectedWord: foundWords[0],
        primaryFeeling: feelingCategory,
        allFeelings: foundWords,
        hasEmotionalContent: true
      };
      
      // Add child-friendly translation if this is for a child
      if (stage && isChildStage(stage)) {
        result.childFriendly = {
          translation: getChildFriendlyTranslation(feelingCategory),
          intensity: determineIntensity(foundWords[0])
        };
      }
      
      results.push(result);
    }
  });
  
  return results;
};

/**
 * Check if a developmental stage is considered a child stage
 */
const isChildStage = (stage: DevelopmentalStage): boolean => {
  return stage === 'child' || 
         stage === 'adolescent' ||
         stage === 'infant_toddler' ||
         stage === 'young_child' ||
         stage === 'middle_childhood';
};

/**
 * Get child-friendly translation of feeling
 */
const getChildFriendlyTranslation = (feeling: FeelingCategory): string => {
  const translations: Record<FeelingCategory, string> = {
    angry: 'mad',
    happy: 'happy',
    sad: 'sad',
    anxious: 'worried',
    confused: 'mixed up',
    hurt: 'hurt',
    embarrassed: 'shy',
    guilty: 'sorry',
    ashamed: 'bad about myself',
    afraid: 'scared',
    hopeful: 'excited',
    lonely: 'alone',
    overwhelmed: 'too much',
    relieved: 'better',
    neutral: 'okay'
  };
  
  return translations[feeling] || feeling;
};

/**
 * Determine emotional intensity from word choice
 */
const determineIntensity = (word: string): 'mild' | 'moderate' | 'strong' => {
  const strongWords = ['furious', 'devastated', 'terrified', 'ecstatic', 'overwhelming'];
  const mildWords = ['slightly', 'somewhat', 'a bit', 'little'];
  
  if (strongWords.some(strong => word.includes(strong))) {
    return 'strong';
  }
  
  if (mildWords.some(mild => word.includes(mild))) {
    return 'mild';
  }
  
  return 'moderate';
};
