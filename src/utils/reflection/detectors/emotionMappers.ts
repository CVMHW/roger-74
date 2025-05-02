
/**
 * Utility functions for mapping emotions between different classification systems
 */

import { FeelingCategory, ChildEmotionCategory } from '../reflectionTypes';

/**
 * Maps a feeling from the feelings wheel to our existing category system
 * @param wheelEmotion The emotion from the feelings wheel
 * @returns The matching category or undefined
 */
export const mapWheelEmotionToCategory = (wheelEmotion: string): FeelingCategory | undefined => {
  const emotionMappings: Record<string, FeelingCategory> = {
    'happy': 'happy',
    'sad': 'sad',
    'fearful': 'anxious',
    'angry': 'angry',
    'disgusted': 'confused', // Changed from 'embarrassed' to use a valid FeelingCategory
    'surprised': 'confused'
  };
  
  return emotionMappings[wheelEmotion] as FeelingCategory || undefined;
};

/**
 * Maps a child emotion category to our standard feeling categories
 * @param childCategory The child emotion category
 * @returns The standard feeling category
 */
export const mapChildEmotionToCategory = (childCategory: string): FeelingCategory => {
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
