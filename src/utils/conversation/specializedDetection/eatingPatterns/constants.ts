
/**
 * Constants for eating pattern detection
 */

// Keywords that might indicate eating disorder concerns
export const eatingDisorderKeywords = [
  'eating disorder', 'anorexia', 'bulimia', 'binge', 'purge', 'restrict',
  'calories', 'weight', 'fat', 'thin', 'skinny', 'diet', 'body image',
  'overweight', 'underweight', 'eating habits', 'food fear', 'starve',
  'eating issues', 'eating problems', 'body dysmorphia', 'exercise compulsion'
];

// Phrases more specific to eating disorders
export const eatingDisorderPhrases = [
  /can'?t (eat|keep food down)/i,
  /afraid (of|to) eat/i,
  /hate (my body|how I look)/i,
  /(obsessed|obsessing|fixated) (with|on) (weight|food|calories|appearance)/i,
  /eating disorder (concerns|issues|problems|thoughts)/i,
  /body (image|dysmorphia|hatred|loathing)/i,
  /feel (fat|disgusting|huge|bloated)/i,
  /(purge|purging|vomit|throw up) after (eating|meals)/i,
  /(restrict|restricting|cut|cutting) (calories|food)/i,
  /(binge|binging|overeating|overeat)/i
];

// Contexts that might indicate Cleveland-specific food talk
export const clevelandFoodContexts = [
  'west side market', 'little italy', 'tremont', 'ohio city',
  'great lakes brewing', 'market garden', 'melt bar and grilled',
  'pierogi', 'polish food', 'corned beef', 'slyman\'s',
  'mitchell\'s ice cream', 'cleveland food scene', 'lakewood restaurants'
];

// Patterns indicating small talk about food
export const foodSmallTalkPatterns = [
  /(like|enjoy|love) (to eat|food|eating|cooking)/i,
  /favorite (food|restaurant|dish|meal|cuisine)/i,
  /(good|great|best) place to eat/i,
  /(recommendation|recommend) for (food|restaurant|eating)/i,
  /try this new (restaurant|place|food)/i,
  /cooking (recipe|dinner|lunch|breakfast)/i,
  /food (festival|event|truck|market)/i
];

// Risk markers that might indicate more serious concerns
export const contextualRiskMarkers = [
  /(worry|worried|anxious|afraid|scared) about (eating|food|weight|body)/i,
  /(struggle|struggling|hard|difficult) (with|to) eat/i,
  /(control|controlling) (food|eating|intake|calories)/i,
  /(hate|hating|loathe|despise) (myself|my body|how I look)/i,
  /(avoid|avoiding|skip|skipping) (meals|food|eating)/i,
  /(guilty|shame|ashamed|disgusted) (after|about|when) (eating|food)/i
];
