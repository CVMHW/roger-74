
/**
 * Categories of feeling words to help identify emotions in text
 */

import { FeelingCategory } from './reflectionTypes';

// Define feeling categories with associated words
export const feelingCategories: Record<FeelingCategory, string[]> = {
  sad: [
    'sad', 'down', 'unhappy', 'depressed', 'devastated', 'miserable', 'disappointed', 
    'discouraged', 'hopeless', 'heartbroken', 'grief', 'blue', 'gloomy', 'melancholy',
    'sorrowful', 'upset', 'hurt', 'pained', 'troubled', 'missing', 'mourning', 'homesick'
  ],
  angry: [
    'angry', 'frustrated', 'irritated', 'annoyed', 'upset', 'furious', 'outraged', 'mad',
    'resentful', 'bitter', 'hostile', 'infuriated', 'enraged', 'indignant', 'offended', 
    'fuming', 'incensed', 'irate', 'agitated', 'exasperated', 'disgruntled', 'heated'
  ],
  anxious: [
    'anxious', 'worried', 'nervous', 'afraid', 'scared', 'terrified', 'panicked', 'uneasy',
    'tense', 'apprehensive', 'concerned', 'fearful', 'jittery', 'restless', 'troubled', 
    'disturbed', 'fretting', 'dreading', 'alarmed', 'distressed', 'on edge', 'stressed'
  ],
  happy: [
    'happy', 'glad', 'excited', 'pleased', 'delighted', 'joyful', 'content', 'satisfied',
    'cheerful', 'elated', 'thrilled', 'ecstatic', 'overjoyed', 'euphoric', 'blissful', 
    'gleeful', 'jubilant', 'merry', 'upbeat', 'carefree', 'lighthearted', 'grateful'
  ],
  confused: [
    'confused', 'unsure', 'uncertain', 'puzzled', 'perplexed', 'torn', 'conflicted', 
    'ambivalent', 'mixed feelings', 'undecided', 'bewildered', 'disoriented', 'baffled', 
    'muddled', 'foggy', 'unclear', 'doubtful', 'hesitant', 'second-guessing', 'lost'
  ],
  relieved: [
    'relieved', 'at ease', 'calm', 'relaxed', 'reassured', 'unburdened', 'comforted', 
    'peaceful', 'tranquil', 'soothed', 'settled', 'composed', 'collected', 'serene',
    'freed', 'lightened', 'rested', 'secure', 'untroubled', 'unwound'
  ],
  embarrassed: [
    'embarrassed', 'ashamed', 'humiliated', 'guilty', 'remorseful', 'regretful', 
    'self-conscious', 'mortified', 'uncomfortable', 'awkward', 'exposed', 'disgraced',
    'flustered', 'sheepish', 'foolish', 'silly', 'red-faced', 'discomforted'
  ],
  overwhelmed: [
    'overwhelmed', 'stressed', 'pressured', 'burdened', 'strained', 'swamped', 'exhausted',
    'drained', 'overloaded', 'snowed under', 'buried', 'flooded', 'inundated', 'crushed', 
    'drowning', 'suffocated', 'at the end of my rope', 'stretched thin', 'worn out'
  ],
  lonely: [
    'lonely', 'isolated', 'abandoned', 'rejected', 'alone', 'disconnected', 'alienated', 
    'unwanted', 'neglected', 'forgotten', 'set aside', 'invisible', 'left out', 'excluded',
    'unnoticed', 'overlooked', 'solitary', 'forsaken', 'deserted', 'estranged'
  ],
  hopeful: [
    'hopeful', 'optimistic', 'encouraged', 'motivated', 'inspired', 'determined', 'confident',
    'enthusiastic', 'positive', 'expectant', 'anticipating', 'looking forward', 'eager', 
    'assured', 'buoyant', 'sanguine', 'uplifted', 'heartened', 'promising', 'trusting'
  ]
};
