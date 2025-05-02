
import { FeelingCategory } from './reflectionTypes';

/**
 * Basic feeling categories and their associated words
 */
export const feelingCategories: Record<FeelingCategory, string[]> = {
  'angry': [
    'angry', 'mad', 'upset', 'furious', 'outraged', 'irritated',
    'annoyed', 'frustrated', 'agitated', 'hostile', 'enraged',
    'irate', 'livid', 'indignant', 'bitter', 'resentful',
    'exasperated', 'irked', 'vexed', 'cross', 'incensed'
  ],
  'happy': [
    'happy', 'glad', 'joyful', 'pleased', 'delighted', 'cheerful', 
    'content', 'satisfied', 'thrilled', 'excited', 'elated',
    'ecstatic', 'overjoyed', 'pleased', 'jubilant', 'blissful',
    'merry', 'upbeat', 'chipper', 'gleeful', 'jolly'
  ],
  'sad': [
    'sad', 'unhappy', 'sorrowful', 'depressed', 'gloomy', 'downcast',
    'miserable', 'blue', 'down', 'low', 'melancholy', 'heartbroken',
    'forlorn', 'despondent', 'disheartened', 'dejected', 'crestfallen',
    'inconsolable', 'grief', 'wistful', 'dismal'
  ],
  'anxious': [
    'anxious', 'worried', 'nervous', 'tense', 'uneasy', 'afraid',
    'fearful', 'scared', 'panicky', 'apprehensive', 'concerned',
    'distressed', 'troubled', 'fretful', 'agitated', 'alarmed',
    'terrified', 'dread', 'frantic', 'jittery', 'stressed'
  ],
  'confused': [
    'confused', 'puzzled', 'perplexed', 'bewildered', 'baffled',
    'uncertain', 'unsure', 'disoriented', 'muddled', 'befuddled',
    'mystified', 'lost', 'unclear', 'ambivalent', 'doubtful',
    'undecided', 'torn', 'hesitant', 'dubious', 'skeptical', 'embarrassed'
  ],
  'relieved': [
    'relieved', 'eased', 'reassured', 'unburdened', 'comforted',
    'calmed', 'relaxed', 'soothed', 'at ease', 'freed', 'unburdened', 
    'pacified', 'placated', 'grateful', 'thankful', 'unburdened',
    'alleviated', 'settled', 'secure', 'safe', 'liberated'
  ],
  'overwhelmed': [
    'overwhelmed', 'overloaded', 'swamped', 'flooded', 'snowed under',
    'buried', 'inundated', 'bombarded', 'stressed', 'overworked',
    'stretched', 'exhausted', 'drained', 'depleted', 'worn out',
    'spent', 'taxed', 'burdened', 'crushed', 'besieged', 'powerless'
  ]
};
