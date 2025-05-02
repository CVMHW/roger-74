/**
 * Utilities for detecting feelings in user messages
 * Enhanced with the Feelings Wheel model for better emotional understanding
 */

import { FeelingCategory, DevelopmentalStage } from './reflectionTypes';
import { feelingCategories } from './feelingCategories';
import { findFeelingInWheel, getAllEmotionWords, getCoreEmotion, getRelatedFeelings } from './feelingsWheel';
import { findEmotionInChildWheel, getAllChildEmotionWords, translateToChildFriendlyEmotion } from './childEmotionsWheel';
import { detectDevelopmentalStage } from './reflectionStrategies';

/**
 * Enhanced structure for detected feelings that includes feelings wheel data
 */
export interface EnhancedFeelingResult {
  category: FeelingCategory;
  detectedWord: string;
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
}

/**
 * Identifies potential feelings in a user's message with enhanced context awareness
 * Now leverages the Feelings Wheel for more nuanced emotional detection
 * @param userMessage The user's message text
 * @returns Array of detected feelings
 */
export const identifyFeelings = (userMessage: string): FeelingCategory[] => {
  const enhancedResults = identifyEnhancedFeelings(userMessage);
  return enhancedResults.map(result => result.category);
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
  const isChild = developmentalStage && developmentalStage !== 'adult' && developmentalStage !== 'young_adult';
  
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
      detectedFeelings.push({
        category: 'sad',
        detectedWord: 'sad'
      });
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
  }
  
  return detectedFeelings.slice(0, 2); // Limit to top 2 feelings to avoid overwhelm
};

/**
 * Maps a feeling from the feelings wheel to our existing category system
 * @param wheelEmotion The emotion from the feelings wheel
 * @returns The matching category or undefined
 */
const mapWheelEmotionToCategory = (wheelEmotion: string): FeelingCategory | undefined => {
  const emotionMappings: Record<string, FeelingCategory> = {
    'happy': 'happy',
    'sad': 'sad',
    'fearful': 'anxious',
    'angry': 'angry',
    'disgusted': 'embarrassed',
    'surprised': 'confused'
  };
  
  return emotionMappings[wheelEmotion] as FeelingCategory || undefined;
};

/**
 * Maps a child emotion category to our standard feeling categories
 * @param childCategory The child emotion category
 * @returns The standard feeling category
 */
const mapChildEmotionToCategory = (childCategory: string): FeelingCategory => {
  const mappings: Record<string, FeelingCategory> = {
    'happy': 'happy',
    'excited': 'happy',
    'silly': 'happy',
    'calm': 'relieved',
    'hungry': 'confused', // Not a direct emotional match but closest
    'tired': 'overwhelmed',
    'worried': 'anxious',
    'confused': 'confused',
    'sad': 'sad',
    'scared': 'anxious',
    'mad': 'angry',
    'loved': 'happy'
  };
  
  return mappings[childCategory] as FeelingCategory || 'confused';
};

/**
 * Detects emotions from text with age-appropriate sensitivity
 * For children, focuses on simpler emotional concepts
 * @param text The text to analyze
 * @param stage The developmental stage of the user
 * @returns Appropriate emotions for the developmental stage
 */
export const detectAgeAppropriateEmotions = (text: string, stage: DevelopmentalStage): {
  emotions: string[];
  childFriendly: boolean;
} => {
  const isChild = stage !== 'adult' && stage !== 'young_adult';
  const enhancedFeelings = identifyEnhancedFeelings(text);
  
  if (isChild) {
    // For children, use simpler emotion terms from the child wheel
    const childEmotions = enhancedFeelings
      .filter(feeling => feeling.childFriendly)
      .map(feeling => feeling.childFriendly?.translation || translateToChildFriendlyEmotion(feeling.detectedWord));
    
    // If we detected emotions with child translations, use those
    if (childEmotions.length > 0) {
      return {
        emotions: childEmotions,
        childFriendly: true
      };
    }
    
    // Otherwise, translate adult emotions to child-friendly terms
    return {
      emotions: enhancedFeelings.map(feeling => 
        translateToChildFriendlyEmotion(feeling.detectedWord)),
      childFriendly: true
    };
  }
  
  // For adults, use the full emotion vocabulary
  return {
    emotions: enhancedFeelings.map(feeling => feeling.detectedWord),
    childFriendly: false
  };
};

/**
 * Extracts specific contextual information from a message
 * @param userMessage The user's message
 * @returns Object with extracted contextual elements
 */
export const extractContextualElements = (userMessage: string) => {
  if (!userMessage || typeof userMessage !== 'string') {
    return { sportTeams: [], locations: [], timeContext: null, relationshipContext: null };
  }
  
  const lowerMessage = userMessage.toLowerCase();
  
  // Extract sports teams or specific entities
  const sportTeams = [
    'browns', 'cavaliers', 'cavs', 'guardians', 'indians', 'monsters', 'charge',
    'yankees', 'steelers', 'ravens', 'bengals', 'packers', 'chiefs', 'lakers',
    'warriors', 'celtics', 'heat', 'red sox', 'cubs', 'cardinals'
  ];
  
  const foundTeams = sportTeams.filter(team => lowerMessage.includes(team));
  
  // Extract locations
  const locations = [
    'cleveland', 'akron', 'baltimore', 'pittsburgh', 'cincinnati', 'columbus',
    'ohio', 'cuyahoga', 'home', 'work', 'school', 'office', 'hospital', 'outside'
  ];
  
  const foundLocations = locations.filter(location => lowerMessage.includes(location));
  
  // Extract time references
  const timeRegex = /\b(yesterday|today|tomorrow|last week|next week|soon|later|morning|evening|night|afternoon|days|weeks)\b/i;
  const timeMatches = userMessage.match(timeRegex);
  const timeContext = timeMatches ? timeMatches[0] : null;
  
  // Extract relationship references
  const relationshipRegex = /\b(father|mother|dad|mom|husband|wife|partner|boss|coworker|friend|daughter|son|child|children|colleague|team|coach)\b/i;
  const relationshipMatches = userMessage.match(relationshipRegex);
  const relationshipContext = relationshipMatches ? relationshipMatches[0] : null;
  
  return {
    sportTeams: foundTeams,
    locations: foundLocations,
    timeContext,
    relationshipContext
  };
};
