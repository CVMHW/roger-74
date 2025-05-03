/**
 * Core feeling detection utilities
 * Identifies feelings in user messages using various techniques
 */

import { FeelingCategory } from '../reflectionTypes';
import { feelingCategories } from '../feelingCategories';
import { findFeelingInWheel, getAllEmotionWords, getCoreEmotion, getRelatedFeelings } from '../feelingsWheel';
import { findEmotionInChildWheel, getAllChildEmotionWords, translateToChildFriendlyEmotion } from '../childEmotionsWheel';
import { detectDevelopmentalStage } from '../reflectionStrategies';
import { distinguishSadnessFromDepression } from '../../detectionUtils';
import { mapChildEmotionToCategory, mapWheelEmotionToCategory } from './emotionMappers';

/**
 * Enhanced structure for detected feelings that includes feelings wheel data
 */
export interface EnhancedFeelingResult {
  category: FeelingCategory;
  detectedWord: string;
  primaryFeeling?: string;
  allFeelings?: string[];
  topics?: string[];
  severity?: number;
  hasEmotionalContent?: boolean;
  wheelData?: {
    coreEmotion: string;
    intensity: number;
    relatedFeelings: string[];
    color?: string;
  };
  childFriendly?: {
    translation: string;
    category: string;
    color: string;
  };
  clinicalContext?: {
    isClinical: boolean;
    context: string;
  };
}

/**
 * Structure for the feeling detection result
 */
export interface FeelingDetectionResult {
  primaryFeeling: string;
  allFeelings: string[];
}

/**
 * Identifies potential feelings in a user's message with enhanced context awareness
 * Now leverages the Feelings Wheel for more nuanced emotional detection
 * @param userMessage The user's message text
 * @returns Object with primary feeling and array of all detected feelings
 */
export const identifyFeelings = (userMessage: string): FeelingDetectionResult => {
  const enhancedResults = identifyEnhancedFeelings(userMessage);
  const primaryFeeling = enhancedResults.length > 0 ? enhancedResults[0].category : 'neutral';
  const allFeelings = enhancedResults.map(result => result.category);
  return { primaryFeeling, allFeelings };
};

/**
 * Enhanced feeling identification that returns richer emotional data
 * @param userMessage The user's message text
 * @returns Array of enhanced feeling results with feelings wheel data
 */
export const identifyEnhancedFeelings = (userMessage: string): EnhancedFeelingResult[] => {
  if (!userMessage || typeof userMessage !== 'string') {
    return [];
  }
  
  const lowerMessage = userMessage.toLowerCase();
  const detectedFeelings: EnhancedFeelingResult[] = [];
  
  // Detect developmental stage to prioritize appropriate emotion detection
  const developmentalStage = detectDevelopmentalStage(userMessage);
  const isChild = developmentalStage && 
                  developmentalStage !== 'adult' && 
                  developmentalStage !== 'young_adult';
  
  // Get sadness vs. depression distinction
  const emotionalDistinction = distinguishSadnessFromDepression(userMessage);
  
  // If we're dealing with a child, prioritize the child emotions wheel first
  if (isChild) {
    const childEmotionWords = getAllChildEmotionWords();
    
    for (const word of childEmotionWords) {
      // Check for exact word matches with word boundaries
      const regex = new RegExp(`\\b${word}\\b`, 'i');
      if (regex.test(lowerMessage)) {
        const childEmotion = findEmotionInChildWheel(word);
        if (childEmotion) {
          // Map to our standard categories for compatibility
          const category = mapChildEmotionToCategory(childEmotion.category);
          
          if (category) {
            detectedFeelings.push({
              category,
              detectedWord: childEmotion.detectedFeeling,
              childFriendly: {
                translation: childEmotion.detectedFeeling,
                category: childEmotion.category,
                color: childEmotion.color
              }
            });
          }
        }
      }
    }
    
    // If we found child emotions, return those
    if (detectedFeelings.length > 0) {
      return detectedFeelings.slice(0, 2); // Limit to top 2 feelings
    }
  }
  
  // Get all emotion words from our feelings wheel
  const allEmotionWords = getAllEmotionWords();
  
  // Check for explicit mentions using the feelings wheel vocabulary (more comprehensive)
  for (const word of allEmotionWords) {
    // Check for exact word matches with word boundaries
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    if (regex.test(lowerMessage)) {
      const wheelFeeling = findFeelingInWheel(word);
      if (wheelFeeling) {
        const coreEmotion = getCoreEmotion(word) || wheelFeeling.parentEmotion || '';
        const relatedFeelings = getRelatedFeelings(word).map(f => f.name);
        
        // Map the wheel emotion to our existing categories
        const category = mapWheelEmotionToCategory(coreEmotion);
        
        if (category) {
          const result: EnhancedFeelingResult = {
            category,
            detectedWord: word,
            wheelData: {
              coreEmotion,
              intensity: wheelFeeling.intensity,
              relatedFeelings
            }
          };
          
          // For sadness, add clinical context if available
          if (category === 'sad' && (emotionalDistinction.isSadness || emotionalDistinction.isDepression)) {
            result.clinicalContext = {
              isClinical: emotionalDistinction.isDepression,
              context: emotionalDistinction.context
            };
          }
          
          // For children, include a child-friendly translation
          if (isChild) {
            const childFriendlyWord = translateToChildFriendlyEmotion(word);
            const childEmotion = findEmotionInChildWheel(childFriendlyWord);
            
            if (childEmotion) {
              result.childFriendly = {
                translation: childFriendlyWord,
                category: childEmotion.category,
                color: childEmotion.color
              };
            }
          }
          
          detectedFeelings.push(result);
        }
      }
    }
  }
  
  // If we found feelings using the wheel, return those
  if (detectedFeelings.length > 0) {
    // Sort by intensity (higher is more specific and takes precedence)
    return detectedFeelings
      .sort((a, b) => (b.wheelData?.intensity || 0) - (a.wheelData?.intensity || 0))
      .slice(0, 2); // Limit to top 2 feelings to avoid overwhelm
  }
  
  // Fall back to original approach if no wheel emotions detected
  for (const [category, words] of Object.entries(feelingCategories)) {
    if (words.some(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'i');
      return regex.test(lowerMessage);
    })) {
      const matchedWord = words.find(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'i');
        return regex.test(lowerMessage);
      }) || category;
      
      const result: EnhancedFeelingResult = {
        category: category as FeelingCategory,
        detectedWord: matchedWord
      };
      
      // For sadness, add clinical context if available
      if (category === 'sad' && (emotionalDistinction.isSadness || emotionalDistinction.isDepression)) {
        result.clinicalContext = {
          isClinical: emotionalDistinction.isDepression,
          context: emotionalDistinction.context
        };
      }
      
      // For children, include a child-friendly translation
      if (isChild) {
        const childFriendlyWord = translateToChildFriendlyEmotion(matchedWord);
        const childEmotion = findEmotionInChildWheel(childFriendlyWord);
        
        if (childEmotion) {
          result.childFriendly = {
            translation: childFriendlyWord,
            category: childEmotion.category,
            color: childEmotion.color
          };
        }
      }
      
      detectedFeelings.push(result);
    }
  }
  
  // Infer emotions from context if none were explicitly detected
  if (detectedFeelings.length === 0) {
    const contextualFeelings = inferEmotionsFromContext(lowerMessage, emotionalDistinction);
    detectedFeelings.push(...contextualFeelings);
  }
  
  return detectedFeelings.slice(0, 2); // Limit to top 2 feelings to avoid overwhelm
};

/**
 * Infers emotions from contextual clues in the message
 */
const inferEmotionsFromContext = (
  lowerMessage: string, 
  emotionalDistinction: any
): EnhancedFeelingResult[] => {
  const detectedFeelings: EnhancedFeelingResult[] = [];

  // Check for sad context
  if (lowerMessage.includes('miss') || 
      lowerMessage.includes('lost') || 
      lowerMessage.includes('gone') || 
      lowerMessage.includes('moving') || 
      lowerMessage.includes('leaving') ||
      lowerMessage.includes('away') ||
      lowerMessage.includes('bad') ||
      lowerMessage.includes('don\'t get to') ||
      lowerMessage.includes('rain')) {
    
    const result: EnhancedFeelingResult = {
      category: 'sad',
      detectedWord: 'sad'
    };
    
    // Add clinical context if available
    if (emotionalDistinction.isSadness || emotionalDistinction.isDepression) {
      result.clinicalContext = {
        isClinical: emotionalDistinction.isDepression,
        context: emotionalDistinction.context
      };
    }
    
    detectedFeelings.push(result);
  }
  
  // Check for anxious context
  if (lowerMessage.includes('worried about') || 
      lowerMessage.includes('not sure if') ||
      lowerMessage.includes('what if') ||
      lowerMessage.includes('might happen')) {
    detectedFeelings.push({
      category: 'anxious',
      detectedWord: 'anxious'
    });
  }
  
  // Check for angry context
  if (lowerMessage.includes('unfair') || 
      lowerMessage.includes('shouldn\'t have') ||
      lowerMessage.includes('wrong') ||
      lowerMessage.includes('hate when')) {
    detectedFeelings.push({
      category: 'angry',
      detectedWord: 'angry'
    });
  }
  
  // Check for positive context
  if (lowerMessage.includes('great') || 
      lowerMessage.includes('wonderful') ||
      lowerMessage.includes('awesome') ||
      lowerMessage.includes('love it')) {
    detectedFeelings.push({
      category: 'happy',
      detectedWord: 'happy'
    });
  }
  
  // Enhanced sports context detection
  if ((lowerMessage.includes('team') || 
       lowerMessage.includes('game') || 
       lowerMessage.includes('play') || 
       lowerMessage.includes('season') ||
       lowerMessage.includes('browns') ||
       lowerMessage.includes('cavs') ||
       lowerMessage.includes('guardians') ||
       lowerMessage.includes('sport')) && 
      (lowerMessage.includes('lost') || 
       lowerMessage.includes('moving') || 
       lowerMessage.includes('bad') ||
       lowerMessage.includes('sad') ||
       lowerMessage.includes('disappointing'))) {
    detectedFeelings.push({
      category: 'sad',
      detectedWord: 'disappointed'
    });
  }

  return detectedFeelings;
};
