/**
 * Constants and shared patterns for emotion detection
 */

/**
 * Emotion intensity types
 */
export type EmotionIntensity = 'low' | 'medium' | 'high';

/**
 * Patterns for detecting implicit emotions
 */
export const implicitEmotionPatterns = [
  // Existing patterns
  { situation: /(lost|died|passed away|death|funeral)/i, emotion: 'sad', intensity: 'medium' as EmotionIntensity },
  { situation: /(broke up|divorce|separated|left me|ending relationship)/i, emotion: 'sad', intensity: 'medium' as EmotionIntensity },
  { situation: /(fired|laid off|unemployed|lost job|can't find work)/i, emotion: 'sad', intensity: 'medium' as EmotionIntensity },
  { situation: /(test|exam|interview|presentation|deadline|meeting)/i, emotion: 'anxious', intensity: 'medium' as EmotionIntensity },
  { situation: /(fight|argument|disagreement|conflict|confrontation)/i, emotion: 'angry', intensity: 'medium' as EmotionIntensity },
  { situation: /(promotion|succeeded|accomplished|achieved|won|graduated)/i, emotion: 'happy', intensity: 'medium' as EmotionIntensity },
  { situation: /(mistake|error|forgot|failed to|didn't mean to|accident)/i, emotion: 'embarrassed', intensity: 'medium' as EmotionIntensity },
  { situation: /(spill|mess|dropped|broke something)/i, emotion: 'embarrassed', intensity: 'medium' as EmotionIntensity },
  
  // Temporal descriptions with meaning implications
  { situation: /(terrible|awful|horrible|rough) (day|night|week|morning|evening)/i, emotion: 'sad', intensity: 'high' as EmotionIntensity },
  { situation: /(bad|rough|tough) (day|night|week|morning|evening)/i, emotion: 'sad', intensity: 'medium' as EmotionIntensity },
  { situation: /(great|amazing|wonderful) (day|night|week|morning|evening)/i, emotion: 'happy', intensity: 'high' as EmotionIntensity },
  
  // New subtle emotion patterns
  // Subtle sadness
  { situation: /(not feeling (myself|great)|under the weather|meh|blah|down|blue)/i, emotion: 'sad', intensity: 'low' as EmotionIntensity },
  { situation: /(miss|missing|longing for|wish I could see)/i, emotion: 'sad', intensity: 'low' as EmotionIntensity },
  { situation: /(nothing (seems|feels) right|don't enjoy|lost interest)/i, emotion: 'sad', intensity: 'medium' as EmotionIntensity },
  
  // Subtle anxiety
  { situation: /(butterflies|pit in (my |the )?stomach|knot in (my |the )?stomach)/i, emotion: 'anxious', intensity: 'low' as EmotionIntensity },
  { situation: /(can't focus|distracted|restless|on edge|jittery)/i, emotion: 'anxious', intensity: 'low' as EmotionIntensity },
  { situation: /(what if|hope nothing goes wrong|overthinking|mind racing)/i, emotion: 'anxious', intensity: 'medium' as EmotionIntensity },
  
  // Subtle frustration
  { situation: /(not working( out)?|keeps happening|again and again|every time)/i, emotion: 'frustrated', intensity: 'low' as EmotionIntensity },
  { situation: /(trying|attempted|keep trying) (but|and) (can't|couldn't|won't)/i, emotion: 'frustrated', intensity: 'medium' as EmotionIntensity },
  { situation: /(ugh|argh|sigh|ughhh|why (does|do) (this|these))/i, emotion: 'frustrated', intensity: 'low' as EmotionIntensity },
  
  // Subtle happiness/contentment
  { situation: /(little things|small victory|made my day|picked me up|brightened my day)/i, emotion: 'happy', intensity: 'low' as EmotionIntensity },
  { situation: /(peaceful|relaxing|nice|pleasant|enjoyable) (moment|time|experience)/i, emotion: 'content', intensity: 'low' as EmotionIntensity },
  { situation: /(looking forward to|excited about|can't wait for)/i, emotion: 'happy', intensity: 'medium' as EmotionIntensity },
  
  // Subtle pride
  { situation: /(worked hard|put effort|did my best|tried my hardest)/i, emotion: 'proud', intensity: 'low' as EmotionIntensity },
  { situation: /(figured out|solved|managed to|able to|finally)/i, emotion: 'proud', intensity: 'low' as EmotionIntensity },
  
  // Subtle embarrassment/shame
  { situation: /(face (turned|went) red|cheeks burning|wanted to hide|everyone (saw|noticed))/i, emotion: 'embarrassed', intensity: 'medium' as EmotionIntensity },
  { situation: /(shouldn't have|regret|wish I hadn't|feel foolish|feel silly)/i, emotion: 'embarrassed', intensity: 'low' as EmotionIntensity },
  
  // Subtle disappointment
  { situation: /(not what I expected|let down|wasn't (great|good|nice)|didn't work out)/i, emotion: 'disappointed', intensity: 'low' as EmotionIntensity },
  { situation: /(had high hopes|was looking forward|expected better|thought it would be)/i, emotion: 'disappointed', intensity: 'medium' as EmotionIntensity },
  
  // Subtle confusion
  { situation: /(not sure what|don't understand|can't figure out|confused about|lost track)/i, emotion: 'confused', intensity: 'low' as EmotionIntensity },
  { situation: /(mixed signals|unclear|ambiguous|vague|cryptic)/i, emotion: 'confused', intensity: 'medium' as EmotionIntensity },
  
  // Subtle surprise
  { situation: /(didn't (expect|think|anticipate)|caught me off guard|out of nowhere)/i, emotion: 'surprised', intensity: 'medium' as EmotionIntensity },
  { situation: /(that's new|that's different|changed|not the usual|unlike)/i, emotion: 'surprised', intensity: 'low' as EmotionIntensity },
  
  // Subtle gratitude
  { situation: /(appreciate|thankful for|grateful for|means a lot|helped me)/i, emotion: 'grateful', intensity: 'medium' as EmotionIntensity },
  
  // Mixed emotions and nuanced states
  { situation: /(bittersweet|mixed feelings|conflicted|torn between)/i, emotion: 'conflicted', intensity: 'medium' as EmotionIntensity },
  { situation: /(numb|empty|hollow|void|nothing)/i, emotion: 'numb', intensity: 'medium' as EmotionIntensity },
  { situation: /(overwhelmed|too much|can't handle|overloaded|bombarded)/i, emotion: 'overwhelmed', intensity: 'medium' as EmotionIntensity }
];

/**
 * Patterns for detecting everyday situations
 */
export const everydaySituationPatterns = [
  { type: "spill_or_stain", pattern: /(spill|stain|mess|dirt|clean)/i, needsSupport: true },
  { type: "traffic_commute", pattern: /(traffic|commute|drive|late|stuck)/i, needsSupport: false },
  { type: "weather_issue", pattern: /(rain|snow|storm|weather|forecast|cold|hot)/i, needsSupport: true },
  { type: "minor_injury", pattern: /(cut|bruise|scratch|bump|hurt)/i, needsSupport: true },
  { type: "lost_item", pattern: /(lost|misplaced|can't find|where is|looking for)/i, needsSupport: true },
  { type: "minor_conflict", pattern: /(argument|disagreement|fight|mad at|angry with)/i, needsSupport: true },
  { type: "schedule_issue", pattern: /(schedule|appointment|meeting|calendar|forgot)/i, needsSupport: false },
  { type: "tired_sleep", pattern: /(tired|exhausted|sleep|nap|rest|fatigue)/i, needsSupport: true },
  { type: "social_embarrassment", pattern: /(embarrassing|awkward|uncomfortable|spill)/i, needsSupport: true }
];

/**
 * Patterns for detecting explicit emotion statements
 */
export const explicitEmotionPatterns = [
  /\bI\s+(?:feel|am|was|got|become|became)\s+(\w+)/i,
  /\bfeeling\s+(\w+)/i,
  /\bJust\s+(?:feeling|feel)\s+(\w+)/i,
  // New patterns for more subtle explicit emotions
  /\bI've\s+been\s+(?:feeling|feeling\s+kind\s+of|feeling\s+a\s+bit)\s+(\w+)/i,
  /\bI\s+(?:feel\s+sort\s+of|feel\s+a\s+little|feel\s+somewhat|feel\s+kind\s+of)\s+(\w+)/i,
  /\bkind\s+of\s+(?:feel|feeling)\s+(\w+)/i,
  /\ba\s+bit\s+(?:of\s+)?(\w+)/i,
  /\bslightly\s+(\w+)/i
];
