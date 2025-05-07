
/**
 * Constants related to eating patterns detection
 */

// Keywords and phrases associated with potential eating disorders
export const eatingDisorderKeywords = [
  'fat', 'lose weight', 'diet', 'calories', 'burn', 'purge',
  'throw up', 'vomit', 'starve', 'binge', 'guilty', 'disgusting',
  'control', 'exercise', 'laxative', 'cleanse', 'clean eating',
  'restrict', 'hungry', 'thinner', 'skinny'
];

// Common eating disorder phrases to monitor (high sensitivity)
export const eatingDisorderPhrases = [
  /I feel fat/i,
  /I need to lose weight/i,
  /I haven'?t eaten (all day|today|since)/i,
  /I ate too much/i,
  /scared of (gaining|weight)/i,
  /hate my body/i,
  /I'?m not (hungry|eating)/i,
  /burn (off|these|the) calories/i,
  /can'?t stop eating/i,
  /feel guilty (after|about|when) eat/i,
  /trying to be (healthier|skinnier|thinner)/i,
  /[Oo]n a diet/i,
  /cutting (out|down) (carbs|food|calories|sugar)/i,
  /(doing|on) a cleanse/i,
  /eat(ing)? clean/i,
  /can'?t control (myself|around food)/i,
  /ate the whole/i,
  /(so|too) full[,]? but (keep|still) eat/i,
  /out of control when I eat/i,
  /make myself (throw|vomit|purge)/i,
  /use laxatives/i,
  /exercise (excessively|too much|after eating)/i,
  /look disgusting/i,
  /[Ii]'?m too (big|fat|heavy)/i,
  /wish I was (thinner|smaller|skinnier)/i,
  /count(ing)? (calories|points|macros)/i,
  /skip(ping|ped) (meals|breakfast|lunch|dinner)/i,
  /food (rules|ritual|routine)/i,
  /weighing myself/i,
  /body (check|checking)/i
];

// Patterns indicating positive/neutral food small talk
export const foodSmallTalkPatterns = [
  /love (food|eating|cooking|baking)/i,
  /favorite (food|meal|restaurant|dish|recipe)/i,
  /try(ing)? (a new|this) recipe/i,
  /cook(ing|ed) (dinner|lunch|breakfast)/i,
  /eat(ing)? out/i,
  /restaurant recommendation/i,
  /best place to eat/i,
  /food was (amazing|great|good|delicious)/i,
  /enjoy(ed)? (my meal|dinner|lunch|breakfast)/i,
  /what (should I|to) (eat|have|cook) for/i,
  /grocery shopping/i,
  /food (preference|allergy|sensitivity)/i,
  /vegetarian|vegan|pescatarian|omnivore/i,
  /gluten[- ]free|dairy[- ]free|nut[- ]free/i
];

// Cleveland-specific food contexts
export const clevelandFoodContexts = [
  /west side market/i,
  /little italy/i,
  /tremont/i, 
  /ohio city/i,
  /pierogi/i,
  /polish food/i,
  /corned beef/i,
  /slyman'?s/i,
  /great lakes brewing/i,
  /mitchell'?s ice cream/i,
  /melt/i,
  /cleveland food/i,
  /lakewood restaurant/i,
  /barrio/i,
  /sokolowski'?s/i,
  /tommy'?s/i,
  /hot sauce williams/i,
  /lido lounge/i,
  /east 4th/i
];

// Context markers that increase concern level
export const contextualRiskMarkers = [
  /always|every day|constantly|never/i, // Absolutist language
  /have to|need to|must|should/i,       // Rigid thinking
  /terrified|scared|afraid|anxious/i,   // Emotional distress
  /avoid|won't allow|can't have/i,      // Restriction language
  /obsess|fixate|think about|worry/i,   // Ruminative thoughts
  /punish|deserve|earn|reward/i,        // Punishment/earning mentality
  /failure|failed|messed up|bad/i,      // Self-criticism
  /weight (gain|loss|change)/i          // Direct weight focus
];
