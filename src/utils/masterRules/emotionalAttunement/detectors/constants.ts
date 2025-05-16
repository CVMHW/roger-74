
/**
 * Constants for emotional detection patterns
 */

// Explicit emotion patterns
export const explicitEmotionPatterns = [
  /i feel (.*?)(?:\.|,|\?|$)/i,
  /i am feeling (.*?)(?:\.|,|\?|$)/i,
  /i('m| am) (.*?)(?:\.|,|\?|$)/i,
  /feeling (.*?)(?:\.|,|\?|$)/i,
  /makes me feel (.*?)(?:\.|,|\?|$)/i,
  /leaving me feeling (.*?)(?:\.|,|\?|$)/i
];

// Implicit emotion patterns with intensity markers
export const implicitEmotionPatterns = [
  // Anxiety patterns
  { situation: /can'?t stop (worrying|thinking) about/i, emotion: 'anxious', intensity: 'medium' as "low" | "medium" | "high" },
  { situation: /(worried|concerned|nervous|anxious) about/i, emotion: 'anxious', intensity: 'medium' as "low" | "medium" | "high" },
  { situation: /what if (.*?) happens/i, emotion: 'anxious', intensity: 'medium' as "low" | "medium" | "high" },
  { situation: /(afraid|scared|terrified) (of|that|about)/i, emotion: 'fearful', intensity: 'high' as "low" | "medium" | "high" },
  
  // Sadness patterns
  { situation: /i miss/i, emotion: 'sad', intensity: 'medium' as "low" | "medium" | "high" },
  { situation: /lost (my|a|the)/i, emotion: 'grief', intensity: 'high' as "low" | "medium" | "high" },
  { situation: /(tired of|exhausted by|can't deal with)/i, emotion: 'overwhelmed', intensity: 'medium' as "low" | "medium" | "high" },
  { situation: /(nobody|no one) (understands|cares|listens)/i, emotion: 'lonely', intensity: 'high' as "low" | "medium" | "high" },
  
  // Anger patterns
  { situation: /(hate|can't stand) (it when|that|how)/i, emotion: 'angry', intensity: 'high' as "low" | "medium" | "high" },
  { situation: /(unfair|not fair|unjust)/i, emotion: 'angry', intensity: 'medium' as "low" | "medium" | "high" },
  { situation: /(fed up|had enough) (with|of)/i, emotion: 'frustrated', intensity: 'high' as "low" | "medium" | "high" },
  
  // Joy patterns
  { situation: /(excited|looking forward) (about|for|to)/i, emotion: 'excited', intensity: 'high' as "low" | "medium" | "high" },
  { situation: /(grateful|thankful) (for|that)/i, emotion: 'grateful', intensity: 'medium' as "low" | "medium" | "high" },
  { situation: /(proud of|accomplished|achieved)/i, emotion: 'proud', intensity: 'medium' as "low" | "medium" | "high" },
  
  // Crisis patterns - high priority detection
  { situation: /(suicidal|kill myself|end my life|don't want to live)/i, emotion: 'crisis', intensity: 'high' as "low" | "medium" | "high" },
  { situation: /(hurt|harm|cut) myself/i, emotion: 'self-harm', intensity: 'high' as "low" | "medium" | "high" },
  
  // Eating disorder patterns - high priority detection
  { situation: /(eating disorder|anorexia|bulimia|binge eating|purging|restricting food)/i, emotion: 'eating-disorder-concern', intensity: 'high' as "low" | "medium" | "high" },
  { situation: /(hate my body|body image|too fat|too heavy|weight obsession|calories|diet)/i, emotion: 'body-image-concern', intensity: 'medium' as "low" | "medium" | "high" },
  { situation: /eating (concern|problem|issue|disorder)/i, emotion: 'eating-disorder-concern', intensity: 'high' as "low" | "medium" | "high" },
  { situation: /(starving myself|not eating|skipping meals|food fear|afraid to eat)/i, emotion: 'eating-disorder-concern', intensity: 'high' as "low" | "medium" | "high" },
  
  // Subtle emotion markers
  { situation: /(sigh|anyway|whatever|doesn't matter)/i, emotion: 'resigned', intensity: 'low' as "low" | "medium" | "high" },
  { situation: /(trying to|been trying|struggling)/i, emotion: 'struggling', intensity: 'medium' as "low" | "medium" | "high" },
  { situation: /not (myself|my usual self) (lately|recently|these days)/i, emotion: 'disconnected', intensity: 'medium' as "low" | "medium" | "high" }
];

// Everyday situation patterns
export const everydaySituationPatterns = [
  // Work situations
  { pattern: /(job interview|performance review|presentation|work project)/i, type: 'work' },
  { pattern: /(boss|coworker|manager|workplace|office|job|career)/i, type: 'work' },
  
  // Relationship situations
  { pattern: /(break ?up|divorce|dating|relationship problem|argument with)/i, type: 'relationship' },
  { pattern: /(partner|spouse|boyfriend|girlfriend|husband|wife|significant other)/i, type: 'relationship' },
  
  // Social situations
  { pattern: /(party|gathering|meeting new people|social event|public speaking)/i, type: 'social' },
  { pattern: /(friend|awkward situation|social anxiety|small talk)/i, type: 'social' },
  
  // Family situations
  { pattern: /(parents|siblings|family dinner|holiday|family gathering)/i, type: 'family' },
  { pattern: /(mother|father|mom|dad|brother|sister|grandparent|in-laws)/i, type: 'family' },
  
  // Health situations
  { pattern: /(doctor's? appointment|medical test|health concern|diagnosis|symptoms)/i, type: 'health' },
  { pattern: /(sick|ill|pain|chronic|disease|condition|recovery)/i, type: 'health' },
  
  // Cleveland-specific contexts - For proper regional awareness
  { pattern: /(cleveland clinic|university hospitals|metrohealth|ohio health|cuyahoga)/i, type: 'cleveland-healthcare' },
  { pattern: /(lake erie|cuyahoga river|rock hall|terminal tower|public square)/i, type: 'cleveland-location' }
];
