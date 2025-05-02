
/**
 * Feelings Wheel Lexicon
 * Based on the emotional wheel model that organizes emotions hierarchically
 * This structure helps understand the complexity and relationships between different emotions
 */

export interface FeelingWheelCategory {
  name: string;
  color: string; // CSS color for this category
  childFeelings: FeelingWheelEmotion[];
}

export interface FeelingWheelEmotion {
  name: string;
  synonyms: string[];
  parentEmotion?: string;  // Core emotion this relates to
  relatedEmotions?: string[]; // Related feelings in the same wedge
  intensity: number; // 1-3, with 3 being most intense/specific
  description?: string; // Optional description of this emotion
}

// Core emotions at the center of the wheel
export const coreEmotions = ["happy", "sad", "angry", "disgusted", "fearful", "surprised", "bad"];

// The complete feelings wheel structure
export const feelingsWheel: FeelingWheelCategory[] = [
  {
    name: "happy",
    color: "#F28C28", // Coral/orange for happy
    childFeelings: [
      // Playful branch
      { name: "playful", synonyms: ["lighthearted", "fun", "whimsical"], intensity: 2 },
      { name: "content", synonyms: ["satisfied", "fulfilled", "pleased"], intensity: 2 },
      { name: "interested", synonyms: ["engaged", "curious", "attentive"], intensity: 2 },
      { name: "proud", synonyms: ["accomplished", "successful", "confident"], intensity: 2 },
      { name: "accepted", synonyms: ["approved", "included", "valued"], intensity: 2 },
      { name: "powerful", synonyms: ["strong", "confident", "capable"], intensity: 2 },
      { name: "peaceful", synonyms: ["calm", "tranquil", "serene"], intensity: 2 },
      { name: "intimate", synonyms: ["close", "connected", "tender"], intensity: 2 },
      { name: "optimistic", synonyms: ["hopeful", "positive", "expectant"], intensity: 2 },
      { name: "trusting", synonyms: ["assured", "confident", "secure"], intensity: 2 },
      
      // Third level emotions - more specific
      { name: "aroused", synonyms: ["stimulated", "excited", "animated"], parentEmotion: "playful", intensity: 3 },
      { name: "cheeky", synonyms: ["mischievous", "impudent", "saucy"], parentEmotion: "playful", intensity: 3 },
      { name: "free", synonyms: ["liberated", "unrestricted", "autonomous"], parentEmotion: "playful", intensity: 3 },
      { name: "joyful", synonyms: ["delighted", "jubilant", "gleeful"], parentEmotion: "playful", intensity: 3 },
      { name: "curious", synonyms: ["inquisitive", "wondering", "questioning"], parentEmotion: "interested", intensity: 3 },
      { name: "inquisitive", synonyms: ["prying", "probing", "nosy"], parentEmotion: "interested", intensity: 3 },
      { name: "successful", synonyms: ["accomplished", "achieving", "triumphant"], parentEmotion: "proud", intensity: 3 },
      { name: "confident", synonyms: ["self-assured", "certain", "positive"], parentEmotion: "proud", intensity: 3 },
      { name: "respected", synonyms: ["admired", "revered", "esteemed"], parentEmotion: "accepted", intensity: 3 },
      { name: "valued", synonyms: ["appreciated", "cherished", "esteemed"], parentEmotion: "accepted", intensity: 3 },
      { name: "courageous", synonyms: ["brave", "daring", "bold"], parentEmotion: "powerful", intensity: 3 },
      { name: "creative", synonyms: ["innovative", "original", "inventive"], parentEmotion: "powerful", intensity: 3 },
      { name: "loving", synonyms: ["adoring", "affectionate", "fond"], parentEmotion: "intimate", intensity: 3 },
      { name: "thankful", synonyms: ["grateful", "appreciative", "indebted"], parentEmotion: "intimate", intensity: 3 },
      { name: "sensitive", synonyms: ["perceptive", "responsive", "empathetic"], parentEmotion: "intimate", intensity: 3 },
      { name: "hopeful", synonyms: ["expectant", "optimistic", "positive"], parentEmotion: "optimistic", intensity: 3 },
      { name: "inspired", synonyms: ["motivated", "stimulated", "encouraged"], parentEmotion: "optimistic", intensity: 3 }
    ]
  },
  {
    name: "sad",
    color: "#F59B9B", // Soft pink/salmon for sad
    childFeelings: [
      // Second level emotions
      { name: "lonely", synonyms: ["isolated", "abandoned", "solitary"], intensity: 2 },
      { name: "vulnerable", synonyms: ["exposed", "unprotected", "sensitive"], intensity: 2 },
      { name: "despair", synonyms: ["hopeless", "despondent", "inconsolable"], intensity: 2 },
      { name: "guilty", synonyms: ["culpable", "blameworthy", "remorseful"], intensity: 2 },
      { name: "depressed", synonyms: ["melancholic", "dejected", "gloomy"], intensity: 2 },
      { name: "hurt", synonyms: ["pained", "wounded", "distressed"], intensity: 2 },
      
      // Third level emotions - more specific
      { name: "isolated", synonyms: ["detached", "separated", "secluded"], parentEmotion: "lonely", intensity: 3 },
      { name: "abandoned", synonyms: ["deserted", "forsaken", "rejected"], parentEmotion: "lonely", intensity: 3 },
      { name: "victimized", synonyms: ["persecuted", "oppressed", "mistreated"], parentEmotion: "vulnerable", intensity: 3 },
      { name: "fragile", synonyms: ["delicate", "frail", "breakable"], parentEmotion: "vulnerable", intensity: 3 },
      { name: "grief", synonyms: ["heartbroken", "mournful", "sorrowful"], parentEmotion: "despair", intensity: 3 },
      { name: "powerless", synonyms: ["helpless", "impotent", "ineffective"], parentEmotion: "despair", intensity: 3 },
      { name: "ashamed", synonyms: ["embarrassed", "disgraced", "humiliated"], parentEmotion: "guilty", intensity: 3 },
      { name: "remorseful", synonyms: ["contrite", "apologetic", "regretful"], parentEmotion: "guilty", intensity: 3 },
      { name: "empty", synonyms: ["hollow", "vacant", "void"], parentEmotion: "depressed", intensity: 3 },
      { name: "inferior", synonyms: ["lesser", "inadequate", "deficient"], parentEmotion: "depressed", intensity: 3 }
    ]
  },
  {
    name: "fearful",
    color: "#60C5BA", // Teal for fearful
    childFeelings: [
      // Second level emotions
      { name: "scared", synonyms: ["frightened", "alarmed", "terrified"], intensity: 2 },
      { name: "anxious", synonyms: ["worried", "nervous", "distressed"], intensity: 2 },
      { name: "insecure", synonyms: ["uncertain", "doubtful", "hesitant"], intensity: 2 },
      { name: "weak", synonyms: ["feeble", "powerless", "incapable"], intensity: 2 },
      { name: "rejected", synonyms: ["refused", "turned down", "unwanted"], intensity: 2 },
      { name: "threatened", synonyms: ["endangered", "imperiled", "at risk"], intensity: 2 },
      
      // Third level emotions - more specific
      { name: "frightened", synonyms: ["scared", "afraid", "terrified"], parentEmotion: "scared", intensity: 3 },
      { name: "overwhelmed", synonyms: ["overloaded", "swamped", "buried"], parentEmotion: "scared", intensity: 3 },
      { name: "worried", synonyms: ["anxious", "concerned", "troubled"], parentEmotion: "anxious", intensity: 3 },
      { name: "inadequate", synonyms: ["deficient", "insufficient", "lacking"], parentEmotion: "insecure", intensity: 3 },
      { name: "inferior", synonyms: ["lesser", "secondary", "subordinate"], parentEmotion: "insecure", intensity: 3 },
      { name: "worthless", synonyms: ["useless", "valueless", "unimportant"], parentEmotion: "insecure", intensity: 3 },
      { name: "insignificant", synonyms: ["trivial", "unimportant", "minor"], parentEmotion: "rejected", intensity: 3 },
      { name: "excluded", synonyms: ["left out", "shut out", "ostracized"], parentEmotion: "rejected", intensity: 3 },
      { name: "persecuted", synonyms: ["victimized", "harassed", "bullied"], parentEmotion: "threatened", intensity: 3 },
      { name: "nervous", synonyms: ["anxious", "uneasy", "apprehensive"], parentEmotion: "threatened", intensity: 3 },
      { name: "exposed", synonyms: ["unprotected", "vulnerable", "at risk"], parentEmotion: "threatened", intensity: 3 }
    ]
  },
  {
    name: "angry",
    color: "#8B90CB", // Purple for angry
    childFeelings: [
      // Second level emotions
      { name: "betrayed", synonyms: ["deceived", "cheated", "tricked"], intensity: 2 },
      { name: "humiliated", synonyms: ["embarrassed", "ashamed", "disgraced"], intensity: 2 },
      { name: "bitter", synonyms: ["resentful", "cynical", "rancorous"], intensity: 2 },
      { name: "mad", synonyms: ["angry", "furious", "enraged"], intensity: 2 },
      { name: "aggressive", synonyms: ["hostile", "forceful", "combative"], intensity: 2 },
      { name: "frustrated", synonyms: ["thwarted", "foiled", "blocked"], intensity: 2 },
      { name: "distant", synonyms: ["aloof", "remote", "detached"], intensity: 2 },
      { name: "critical", synonyms: ["fault-finding", "judging", "disparaging"], intensity: 2 },
      
      // Third level emotions - more specific
      { name: "disrespected", synonyms: ["insulted", "disdained", "scorned"], parentEmotion: "betrayed", intensity: 3 },
      { name: "ridiculed", synonyms: ["mocked", "taunted", "derided"], parentEmotion: "humiliated", intensity: 3 },
      { name: "indignant", synonyms: ["offended", "aggrieved", "affronted"], parentEmotion: "bitter", intensity: 3 },
      { name: "violated", synonyms: ["infringed", "transgressed", "invaded"], parentEmotion: "bitter", intensity: 3 },
      { name: "furious", synonyms: ["enraged", "irate", "frenzied"], parentEmotion: "mad", intensity: 3 },
      { name: "jealous", synonyms: ["envious", "covetous", "resentful"], parentEmotion: "mad", intensity: 3 },
      { name: "provoked", synonyms: ["incited", "inflamed", "stimulated"], parentEmotion: "aggressive", intensity: 3 },
      { name: "hostile", synonyms: ["antagonistic", "unfriendly", "belligerent"], parentEmotion: "aggressive", intensity: 3 },
      { name: "infuriated", synonyms: ["enraged", "furious", "livid"], parentEmotion: "frustrated", intensity: 3 },
      { name: "annoyed", synonyms: ["irritated", "displeased", "vexed"], parentEmotion: "frustrated", intensity: 3 },
      { name: "withdrawn", synonyms: ["removed", "retreating", "pulled back"], parentEmotion: "distant", intensity: 3 },
      { name: "numb", synonyms: ["unfeeling", "deadened", "insensitive"], parentEmotion: "distant", intensity: 3 },
      { name: "skeptical", synonyms: ["doubting", "questioning", "suspicious"], parentEmotion: "critical", intensity: 3 },
      { name: "dismissive", synonyms: ["rejecting", "contemptuous", "disdainful"], parentEmotion: "critical", intensity: 3 }
    ]
  },
  {
    name: "disgusted",
    color: "#A975CF", // Light purple for disgusted
    childFeelings: [
      // Second level emotions
      { name: "disapproving", synonyms: ["condemning", "critical", "judgmental"], intensity: 2 },
      { name: "disappointed", synonyms: ["displeased", "let down", "disheartened"], intensity: 2 },
      { name: "awful", synonyms: ["terrible", "horrible", "dreadful"], intensity: 2 },
      { name: "repelled", synonyms: ["repulsed", "revolted", "nauseated"], intensity: 2 },
      
      // Third level emotions - more specific
      { name: "judgemental", synonyms: ["critical", "disapproving", "faultfinding"], parentEmotion: "disapproving", intensity: 3 },
      { name: "embarrassed", synonyms: ["mortified", "humiliated", "ashamed"], parentEmotion: "disapproving", intensity: 3 },
      { name: "appalled", synonyms: ["horrified", "dismayed", "shocked"], parentEmotion: "awful", intensity: 3 },
      { name: "revolted", synonyms: ["disgusted", "sickened", "repulsed"], parentEmotion: "repelled", intensity: 3 },
      { name: "nauseated", synonyms: ["queasy", "sick", "repulsed"], parentEmotion: "repelled", intensity: 3 },
      { name: "detestable", synonyms: ["hateful", "abhorrent", "loathsome"], parentEmotion: "repelled", intensity: 3 },
      { name: "hesitant", synonyms: ["uncertain", "tentative", "reluctant"], parentEmotion: "disappointed", intensity: 3 }
    ]
  },
  {
    name: "surprised",
    color: "#F9D867", // Yellow for surprised
    childFeelings: [
      // Second level emotions
      { name: "confused", synonyms: ["puzzled", "perplexed", "bewildered"], intensity: 2 },
      { name: "amazed", synonyms: ["astonished", "astounded", "stunned"], intensity: 2 },
      { name: "excited", synonyms: ["eager", "animated", "enthusiastic"], intensity: 2 },
      
      // Third level emotions - more specific
      { name: "stunned", synonyms: ["shocked", "dazed", "astounded"], parentEmotion: "confused", intensity: 3 },
      { name: "disillusioned", synonyms: ["disenchanted", "disappointed", "undeceived"], parentEmotion: "confused", intensity: 3 },
      { name: "perplexed", synonyms: ["puzzled", "baffled", "mystified"], parentEmotion: "confused", intensity: 3 },
      { name: "astonished", synonyms: ["amazed", "astounded", "staggered"], parentEmotion: "amazed", intensity: 3 },
      { name: "awe", synonyms: ["wonder", "reverence", "amazement"], parentEmotion: "amazed", intensity: 3 },
      { name: "eager", synonyms: ["keen", "enthusiastic", "avid"], parentEmotion: "excited", intensity: 3 },
      { name: "energetic", synonyms: ["lively", "animated", "vigorous"], parentEmotion: "excited", intensity: 3 }
    ]
  },
  {
    name: "bad",
    color: "#37A88B", // Green for the "bad" segment
    childFeelings: [
      // Second level emotions
      { name: "bored", synonyms: ["uninterested", "apathetic", "indifferent"], intensity: 2 },
      { name: "busy", synonyms: ["occupied", "engaged", "swamped"], intensity: 2 },
      { name: "stressed", synonyms: ["pressured", "strained", "tense"], intensity: 2 },
      { name: "tired", synonyms: ["fatigued", "exhausted", "weary"], intensity: 2 },
      
      // Third level emotions - more specific
      { name: "indifferent", synonyms: ["uninterested", "detached", "unconcerned"], parentEmotion: "bored", intensity: 3 },
      { name: "apathetic", synonyms: ["unfeeling", "listless", "impassive"], parentEmotion: "bored", intensity: 3 },
      { name: "rushed", synonyms: ["hurried", "hasty", "quick"], parentEmotion: "busy", intensity: 2 },
      { name: "overwhelmed", synonyms: ["swamped", "inundated", "buried"], parentEmotion: "stressed", intensity: 3 },
      { name: "out of control", synonyms: ["chaotic", "disorganized", "unmanaged"], parentEmotion: "stressed", intensity: 3 }
    ]
  }
];

/**
 * Finds a feeling in the wheel based on its name or synonyms
 * @param feelingName The name to look for
 * @returns The matching feeling or undefined if not found
 */
export const findFeelingInWheel = (feelingName: string): FeelingWheelEmotion | undefined => {
  const normalizedName = feelingName.toLowerCase().trim();
  
  for (const category of feelingsWheel) {
    for (const feeling of category.childFeelings) {
      if (feeling.name === normalizedName || feeling.synonyms.includes(normalizedName)) {
        return {
          ...feeling,
          parentEmotion: feeling.parentEmotion || category.name
        };
      }
    }
  }
  
  return undefined;
};

/**
 * Gets the core emotion associated with a specific feeling
 * @param feelingName The specific feeling to find the core emotion for
 * @returns The core emotion or undefined if not found
 */
export const getCoreEmotion = (feelingName: string): string | undefined => {
  const feeling = findFeelingInWheel(feelingName);
  if (!feeling) return undefined;
  
  // For second-level emotions, the category name is the core emotion
  // For third-level emotions, we need to find the core through the parent
  if (feeling.parentEmotion && !coreEmotions.includes(feeling.parentEmotion)) {
    // Find the second level emotion's category
    for (const category of feelingsWheel) {
      if (category.childFeelings.some(f => f.name === feeling.parentEmotion)) {
        return category.name;
      }
    }
  }
  
  // If it's a second-level emotion, return its direct parent (core emotion)
  return feeling.parentEmotion;
};

/**
 * Gets related feelings to the provided feeling
 * @param feelingName The feeling to find related emotions for
 * @returns Array of related feelings
 */
export const getRelatedFeelings = (feelingName: string): FeelingWheelEmotion[] => {
  const feeling = findFeelingInWheel(feelingName);
  if (!feeling) return [];
  
  const relatedFeelings: FeelingWheelEmotion[] = [];
  
  // Find the category this feeling belongs to
  let category;
  for (const cat of feelingsWheel) {
    if (cat.childFeelings.some(f => f.name === feeling.name)) {
      category = cat;
      break;
    }
  }
  
  if (!category) return [];
  
  // For third-level emotions, get other emotions with the same parent
  if (feeling.intensity === 3 && feeling.parentEmotion) {
    for (const f of category.childFeelings) {
      if (f.name !== feeling.name && f.parentEmotion === feeling.parentEmotion) {
        relatedFeelings.push(f);
      }
    }
  } 
  // For second-level emotions, get their children
  else if (feeling.intensity === 2) {
    for (const f of category.childFeelings) {
      if (f.parentEmotion === feeling.name) {
        relatedFeelings.push(f);
      }
    }
  }
  
  return relatedFeelings;
};

/**
 * Creates a complete list of all emotion words in the feelings wheel
 * @returns Array of all emotion words including synonyms
 */
export const getAllEmotionWords = (): string[] => {
  const allWords: string[] = [];
  
  for (const category of feelingsWheel) {
    allWords.push(category.name);
    
    for (const feeling of category.childFeelings) {
      allWords.push(feeling.name);
      allWords.push(...feeling.synonyms);
    }
  }
  
  return [...new Set(allWords)]; // Remove duplicates
};

