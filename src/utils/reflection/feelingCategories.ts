
/**
 * Categories of feeling words to help identify emotions in text
 */

import { FeelingCategory } from './reflectionTypes';

// Define feeling categories with associated words
export const feelingCategories: Record<FeelingCategory, string[]> = {
  sad: ['sad', 'down', 'unhappy', 'depressed', 'devastated', 'miserable', 'disappointed', 'discouraged', 'hopeless', 'heartbroken', 'grief'],
  angry: ['angry', 'frustrated', 'irritated', 'annoyed', 'upset', 'furious', 'outraged', 'mad', 'resentful', 'bitter', 'hostile'],
  anxious: ['anxious', 'worried', 'nervous', 'afraid', 'scared', 'terrified', 'panicked', 'uneasy', 'tense', 'apprehensive', 'concerned'],
  happy: ['happy', 'glad', 'excited', 'pleased', 'delighted', 'joyful', 'content', 'satisfied', 'cheerful', 'elated', 'thrilled'],
  confused: ['confused', 'unsure', 'uncertain', 'puzzled', 'perplexed', 'torn', 'conflicted', 'ambivalent', 'mixed feelings', 'undecided'],
  relieved: ['relieved', 'at ease', 'calm', 'relaxed', 'reassured', 'unburdened', 'comforted', 'peaceful', 'tranquil'],
  embarrassed: ['embarrassed', 'ashamed', 'humiliated', 'guilty', 'remorseful', 'regretful', 'self-conscious'],
  overwhelmed: ['overwhelmed', 'stressed', 'pressured', 'burdened', 'strained', 'swamped', 'exhausted', 'drained'],
  lonely: ['lonely', 'isolated', 'abandoned', 'rejected', 'alone', 'disconnected', 'alienated', 'unwanted'],
  hopeful: ['hopeful', 'optimistic', 'encouraged', 'motivated', 'inspired', 'determined', 'confident', 'enthusiastic']
};
