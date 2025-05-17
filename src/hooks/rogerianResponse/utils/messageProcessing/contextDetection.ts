
/**
 * Utility functions for detecting conversation context
 */

/**
 * Detects if a message is small talk
 * @param input User message 
 * @returns True if the message is small talk
 */
export const isSmallTalk = (input: string): boolean => {
  return /\bhello\b|\bhi\b|\bhey\b|\bgreetings\b|\bhowdy\b|\bweather\b|\bsports\b|\bweekend\b|\bplans\b/i.test(input.toLowerCase());
};

/**
 * Detects if a message is an introduction
 * @param input User message
 * @returns True if the message is an introduction
 */
export const isIntroduction = (input: string): boolean => {
  return /\bmy name is\b|\bi am\b|\bnice to meet\b|\bpleasure\b|\bintroduce\b|\bfirst time\b/i.test(input.toLowerCase());
};

/**
 * Detects if a message contains personal sharing
 * @param input User message
 * @returns True if the message contains personal sharing
 */
export const isPersonalSharing = (input: string): boolean => {
  return /\bi feel\b|\bi am feeling\b|\bi'm feeling\b|\bi've been\b|\bi have been\b|\bi'm going through\b|\bi am going through\b/i.test(input.toLowerCase());
};

/**
 * Detects if a message describes an everyday situation
 * @param input User message
 * @returns True if the message describes an everyday situation
 */
export const isEverydaySituation = (input: string): boolean => {
  return /trip(ped)?|spill(ed)?|embarrass(ing|ed)?|awkward|class|teacher|student|bar|drink|fall|fell|stumble|social|party|date/i.test(input);
};
