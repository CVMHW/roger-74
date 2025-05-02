
/**
 * Children's Emotions Wheel
 * A simplified, age-appropriate emotions wheel for younger users
 * Based on the image provided by AbbyVanMuijen
 */

import { ChildEmotionCategory, ChildWheelEmotionData } from './reflectionTypes';

// Structure to represent the children's emotion wheel
export interface ChildEmotionSection {
  name: ChildEmotionCategory;
  color: string;
  emotions: {
    name: string;
    synonyms: string[];
    description?: string;
  }[];
}

// Children's emotion wheel data inspired by the provided image
export const childEmotionsWheel: ChildEmotionSection[] = [
  {
    name: 'happy',
    color: '#FFD166', // Yellow/orange
    emotions: [
      { name: 'happy', synonyms: ['glad', 'good', 'pleased'], description: 'Feeling good inside' },
      { name: 'proud', synonyms: ['accomplished', 'did a good job'], description: 'Feeling good about something you did' },
      { name: 'grateful', synonyms: ['thankful', 'appreciate'], description: 'Feeling thankful for something' },
      { name: 'loved', synonyms: ['cared for', 'liked'], description: 'Feeling that people care about you' }
    ]
  },
  {
    name: 'excited',
    color: '#FF9F1C', // Orange
    emotions: [
      { name: 'excited', synonyms: ['thrilled', 'eager'], description: 'Feeling really happy about something' },
      { name: 'hyper', synonyms: ['energetic', 'bouncy', 'wiggly'], description: 'Having lots of energy' },
      { name: 'curious', synonyms: ['interested', 'want to know'], description: 'Wanting to learn about something' }
    ]
  },
  {
    name: 'silly',
    color: '#E5D4C0', // Light beige
    emotions: [
      { name: 'silly', synonyms: ['goofy', 'funny', 'weird'], description: 'Feeling playful and funny' },
      { name: 'weird', synonyms: ['strange', 'different'], description: 'Feeling a bit unusual' }
    ]
  },
  {
    name: 'calm',
    color: '#9EE493', // Light green
    emotions: [
      { name: 'calm', synonyms: ['relaxed', 'peaceful', 'quiet'], description: 'Feeling peaceful and relaxed' },
      { name: 'safe', synonyms: ['protected', 'secure'], description: 'Feeling like nothing bad will happen to you' }
    ]
  },
  {
    name: 'hungry',
    color: '#70AE6E', // Green
    emotions: [
      { name: 'hungry', synonyms: ['want food', 'empty tummy'], description: 'Needing some food' }
    ]
  },
  {
    name: 'tired',
    color: '#4C9F70', // Dark green
    emotions: [
      { name: 'tired', synonyms: ['sleepy', 'exhausted', 'need rest'], description: 'Feeling like you need to rest' },
      { name: 'bored', synonyms: ['nothing to do', 'not interested'], description: 'Nothing feels interesting right now' }
    ]
  },
  {
    name: 'worried',
    color: '#8A508F', // Purple
    emotions: [
      { name: 'worried', synonyms: ['nervous', 'concerned', 'unsure'], description: 'Thinking something bad might happen' },
      { name: 'overwhelmed', synonyms: ['too much', 'too busy'], description: 'Feeling like there's too much happening' },
      { name: 'shy', synonyms: ['quiet', 'timid'], description: 'Feeling nervous around others' }
    ]
  },
  {
    name: 'confused',
    color: '#553772', // Dark purple
    emotions: [
      { name: 'confused', synonyms: ['mixed up', 'don\'t understand', 'lost'], description: 'Not understanding what's happening' },
      { name: 'surprised', synonyms: ['shocked', 'didn\'t expect'], description: 'Something unexpected happened' }
    ]
  },
  {
    name: 'sad',
    color: '#3066BE', // Blue
    emotions: [
      { name: 'sad', synonyms: ['unhappy', 'blue', 'down'], description: 'Feeling down inside' },
      { name: 'lonely', synonyms: ['alone', 'no friends'], description: 'Feeling like you have no one to talk to' },
      { name: 'disappointed', synonyms: ['let down', 'upset'], description: 'Something didn't go how you wanted' }
    ]
  },
  {
    name: 'scared',
    color: '#774936', // Brown
    emotions: [
      { name: 'scared', synonyms: ['afraid', 'frightened'], description: 'Feeling like something bad might happen' },
      { name: 'nervous', synonyms: ['butterflies', 'jittery'], description: 'Feeling shaky inside' }
    ]
  },
  {
    name: 'mad',
    color: '#EF476F', // Pink/Red
    emotions: [
      { name: 'mad', synonyms: ['angry', 'upset', 'frustrated'], description: 'Feeling upset about something' },
      { name: 'annoyed', synonyms: ['bothered', 'irritated'], description: 'Something is bothering you' },
      { name: 'cranky', synonyms: ['grumpy', 'grouchy'], description: 'Feeling easily bothered by things' }
    ]
  }
];

// Child Wheel Emotion Detection Methods

/**
 * Finds an emotion in the children's emotions wheel
 * @param emotionName The emotion to look for
 * @returns The matching emotion data or undefined
 */
export const findEmotionInChildWheel = (emotionName: string): ChildWheelEmotionData | undefined => {
  const normalizedName = emotionName.toLowerCase().trim();
  
  for (const section of childEmotionsWheel) {
    // Check if it's the section name
    if (section.name === normalizedName) {
      return {
        detectedFeeling: normalizedName,
        category: section.name,
        relatedFeelings: section.emotions.map(e => e.name),
        color: section.color
      };
    }
    
    // Check emotions within the section
    for (const emotion of section.emotions) {
      if (emotion.name === normalizedName || emotion.synonyms.includes(normalizedName)) {
        return {
          detectedFeeling: emotion.name,
          category: section.name,
          relatedFeelings: section.emotions
            .filter(e => e.name !== emotion.name)
            .map(e => e.name),
          color: section.color,
          simpleDescription: emotion.description
        };
      }
    }
  }
  
  return undefined;
};

/**
 * Gets all emotion words from the children's wheel including synonyms
 * @returns Array of all child-friendly emotion words
 */
export const getAllChildEmotionWords = (): string[] => {
  const words: string[] = [];
  
  for (const section of childEmotionsWheel) {
    words.push(section.name);
    
    for (const emotion of section.emotions) {
      words.push(emotion.name);
      words.push(...emotion.synonyms);
    }
  }
  
  return [...new Set(words)]; // Remove duplicates
};

/**
 * Gets related emotions for a given child emotion
 * @param emotionName The emotion to find related emotions for
 * @returns Array of related emotion names
 */
export const getRelatedChildEmotions = (emotionName: string): string[] => {
  const emotion = findEmotionInChildWheel(emotionName);
  if (!emotion) return [];
  
  return emotion.relatedFeelings;
};

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
  const emotionData = findEmotionInChildWheel(emotion);
  
  if (emotionData && emotionData.simpleDescription) {
    return emotionData.simpleDescription;
  }
  
  // Default explanations if not found in the wheel
  const defaultExplanations: Record<string, string> = {
    'happy': 'Feeling good inside',
    'sad': 'Feeling down or unhappy',
    'mad': 'Feeling upset about something',
    'scared': 'Feeling afraid of something',
    'worried': 'Thinking something bad might happen',
    'excited': 'Feeling really happy about something',
    'confused': 'Not understanding what's happening',
    'tired': 'Needing some rest',
    'bored': 'Nothing feels fun right now',
    'loved': 'Feeling that people care about you'
  };
  
  return defaultExplanations[emotion.toLowerCase()] || `How ${emotion} makes your body and heart feel`;
};
