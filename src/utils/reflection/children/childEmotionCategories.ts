
/**
 * Child-specific emotion categories and helper functions
 */

import { ChildEmotionCategory, ChildWheelEmotionData } from '../core/types';

// Child emotion wheel section structure
export interface ChildEmotionSection {
  name: ChildEmotionCategory;
  color: string;
  emotions: {
    name: string;
    synonyms: string[];
    description?: string;
  }[];
}

// Basic emotion categories for children with appropriate colors
export const childEmotionBasicCategories: {
  category: ChildEmotionCategory;
  color: string;
  description: string;
}[] = [
  { category: "happy", color: "#FFD166", description: "Feeling good inside" },
  { category: "excited", color: "#FF9F1C", description: "Having lots of energy and feeling really good" },
  { category: "silly", color: "#E5D4C0", description: "Feeling playful and funny" },
  { category: "calm", color: "#9EE493", description: "Feeling peaceful and relaxed" },
  { category: "hungry", color: "#70AE6E", description: "Needing some food" },
  { category: "tired", color: "#4C9F70", description: "Feeling like you need to rest" },
  { category: "worried", color: "#8A508F", description: "Thinking something bad might happen" },
  { category: "confused", color: "#553772", description: "Not understanding what's happening" },
  { category: "sad", color: "#3066BE", description: "Feeling down inside" },
  { category: "scared", color: "#774936", description: "Feeling like something bad might happen" },
  { category: "mad", color: "#EF476F", description: "Feeling upset about something" }
];

/**
 * Translates an adult emotion into a child-friendly equivalent
 * @param adultEmotion The adult emotion term
 * @returns A child-friendly equivalent or the original if no match
 */
export const translateToChildFriendlyEmotion = (adultEmotion: string): string => {
  // Mapping of adult emotions to child-friendly alternatives
  const emotionMap: Record<string, string> = {
    // Happy category
    'joyful': 'happy',
    'pleased': 'happy',
    'content': 'happy',
    'delighted': 'happy',
    'ecstatic': 'excited',
    'enthusiastic': 'excited',
    
    // Sad category
    'melancholy': 'sad',
    'depressed': 'sad',
    'grief': 'sad',
    'heartbroken': 'sad',
    'devastated': 'sad',
    'gloomy': 'sad',
    'sorrowful': 'sad',
    
    // Angry category
    'frustrated': 'mad',
    'irritated': 'mad',
    'furious': 'mad',
    'outraged': 'mad',
    'resentful': 'mad',
    'annoyed': 'annoyed',
    'infuriated': 'mad',
    
    // Anxious category
    'anxious': 'worried',
    'afraid': 'scared',
    'terrified': 'scared',
    'uneasy': 'worried',
    'apprehensive': 'worried',
    'concerned': 'worried',
    'fearful': 'scared',
    'jittery': 'nervous',
    
    // Confused category
    'perplexed': 'confused',
    'uncertain': 'confused',
    'bewildered': 'confused',
    'disoriented': 'confused',
    'mixed up': 'confused'
  };
  
  return emotionMap[adultEmotion.toLowerCase()] || adultEmotion;
};

/**
 * Creates a child-friendly explanation of an emotion
 * @param emotion The emotion to explain
 * @returns A simple explanation suitable for children
 */
export const getChildFriendlyEmotionExplanation = (emotion: string): string => {
  // Default explanations if not found in the wheel
  const defaultExplanations: Record<string, string> = {
    'happy': 'Feeling good inside',
    'sad': 'Feeling down or unhappy',
    'mad': 'Feeling upset about something',
    'scared': 'Feeling afraid of something',
    'worried': 'Thinking something bad might happen',
    'excited': 'Feeling really happy about something',
    'confused': 'Not understanding what\'s happening',
    'tired': 'Needing some rest',
    'bored': 'Nothing feels fun right now',
    'loved': 'Feeling that people care about you'
  };
  
  return defaultExplanations[emotion.toLowerCase()] || `How ${emotion} makes your body and heart feel`;
};
