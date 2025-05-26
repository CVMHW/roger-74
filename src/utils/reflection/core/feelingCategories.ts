
/**
 * Core feeling categories used across the reflection system
 */

// Define the FeelingCategory type as a union of string literals
export type FeelingCategory = 
  | "angry" | "happy" | "sad" | "anxious" | "confused" 
  | "hurt" | "embarrassed" | "guilty" | "ashamed" | "afraid" 
  | "hopeful" | "lonely" | "overwhelmed" | "relieved" | "neutral";

// Define the feeling categories and their associated words
export const FEELING_WORDS: Record<FeelingCategory, string[]> = {
  angry: ["angry", "mad", "furious", "annoyed", "irritated", "frustrated"],
  happy: ["happy", "glad", "content", "excited", "joyful", "pleased"],
  sad: ["sad", "unhappy", "depressed", "down", "melancholy", "gloomy"],
  anxious: ["anxious", "worried", "nervous", "stressed", "tense", "concerned"],
  confused: ["confused", "puzzled", "perplexed", "unsure", "uncertain", "bewildered"],
  hurt: ["hurt", "pained", "wounded", "damaged", "injured", "harmed"],
  embarrassed: ["embarrassed", "ashamed", "humiliated", "mortified", "self-conscious"],
  guilty: ["guilty", "remorseful", "sorry", "regretful", "apologetic"],
  ashamed: ["ashamed", "disgraced", "humiliated", "embarrassed", "self-conscious"],
  afraid: ["afraid", "scared", "terrified", "fearful", "frightened", "panicked"],
  hopeful: ["hopeful", "optimistic", "encouraged", "positive", "expectant"],
  lonely: ["lonely", "isolated", "abandoned", "forsaken", "solitary", "alone"],
  overwhelmed: ["overwhelmed", "swamped", "overloaded", "stressed", "burdened", "flooded"],
  relieved: ["relieved", "unburdened", "calmed", "reassured", "eased", "comforted"],
  neutral: ["neutral", "calm", "okay", "fine", "stable", "balanced"]
};

// Export for backward compatibility
export const feelingCategories = FEELING_WORDS;
