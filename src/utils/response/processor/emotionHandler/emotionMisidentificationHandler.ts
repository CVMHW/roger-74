
/**
 * Emotion Misidentification Handler
 * 
 * Specialized handler for detecting and correcting emotion misidentification in responses
 * This is specifically for Rogerian/emotional responses, not logotherapy
 */

import { emotionsWheel, getEmotionFromWheel, detectSocialEmotionalContext } from '../../../emotions/emotionsWheel';

// Import everyday situation handlers - using correct function names
import { 
  detectEverydayFrustration as detectEverydaySituation,
  generateEverydayFrustrationResponse 
} from '../../../conversation/theSmallStuff';

/**
 * Check for emotion misidentification in responses
 * Especially checks for "neutral" identification when negative emotions are present
 */
export const checkEmotionMisidentification = (
  response: string,
  userInput: string
): boolean => {
  // Check if response claims user is feeling neutral
  const claimsNeutral = /you('re| are) feeling neutral|feeling neutral|hear you're feeling neutral/i.test(response);
  
  if (!claimsNeutral) {
    return false;
  }
  
  // First check for explicit emotion mentions
  const emotionWords: string[] = [];
  
  // Collect all emotion words from the wheel
  for (const parentEmotion in emotionsWheel) {
    emotionWords.push(parentEmotion);
    for (const childEmotion in emotionsWheel[parentEmotion]) {
      const emotion = emotionsWheel[parentEmotion][childEmotion];
      emotionWords.push(emotion.name);
      emotionWords.push(...emotion.synonyms);
    }
  }
  
  const mentionedEmotions = emotionWords.filter(word => 
    new RegExp(`\\b${word}\\b`, 'i').test(userInput)
  );
  
  if (mentionedEmotions.length > 0) {
    return true; // User explicitly mentioned an emotion but we said "neutral"
  }
  
  // Check for social emotional contexts
  const socialContext = detectSocialEmotionalContext(userInput);
  if (socialContext) {
    return true;
  }
  
  // Check for other negative emotion indicators in user input
  const negativeEmotionPatterns = [
    /rough|tough|bad|difficult|hard|stressful|awful|terrible|worst|annoying/i,
    /embarrass(ing|ed)?|awkward|uncomfortable|cringe/i,
    /spill(ed)?|accident|mess(ed up)?|mistake/i,
    /sad|upset|depress(ed|ing)|down|blue|low|lonely/i,
    /anxious|nervous|worr(ied|y)|stress(ed|ful)/i,
    /frustrat(ed|ing)|annoy(ed|ing)|angry|mad|piss(ed)?|irritat(ed|ing)/i,
    // Add more casual expressions that indicate negative feelings
    /sucks|sucked|terrible|went wrong|not great|problem|wasn't good/i,
    /ruined|screwed up|messed up|failed|blew it|disaster/i,
    // Add social situation indicators
    /cute (girl|guy|person)|date|flirt|hitting on|talk to|first impression/i,
    /rejected|turned down|stood up|ghosted|dumped|broke up/i
  ];
  
  // If input mentions any negative emotions but response claims neutral, it's a misidentification
  return negativeEmotionPatterns.some(pattern => pattern.test(userInput));
};

/**
 * Fix emotion misidentification in responses
 * @param response Original response text
 * @param userInput User's input message
 * @returns Corrected response
 */
export const fixEmotionMisidentification = (
  response: string,
  userInput: string
): string => {
  // First check for explicitly mentioned emotions
  const emotionWords: string[] = [];
  
  // Collect all emotion words from the wheel
  for (const parentEmotion in emotionsWheel) {
    emotionWords.push(parentEmotion);
    for (const childEmotion in emotionsWheel[parentEmotion]) {
      const emotion = emotionsWheel[parentEmotion][childEmotion];
      emotionWords.push(emotion.name);
      emotionWords.push(...emotion.synonyms);
    }
  }
  
  let mentionedEmotion = '';
  for (const emotion of emotionWords) {
    if (new RegExp(`\\b${emotion}\\b`, 'i').test(userInput)) {
      // Found an explicit emotion mention
      mentionedEmotion = emotion;
      break;
    }
  }

  // Get the standardized emotion entry if one was mentioned
  let emotionEntry = mentionedEmotion ? getEmotionFromWheel(mentionedEmotion) : undefined;
  
  // If no explicit emotion was mentioned, check for social context
  if (!emotionEntry) {
    const socialContext = detectSocialEmotionalContext(userInput);
    if (socialContext) {
      emotionEntry = getEmotionFromWheel(socialContext.primaryEmotion);
    }
  }
  
  // For social embarrassment with spilling a drink
  if (/spill(ed)?.*drink.*girl|spill(ed)?.*on.*girl/i.test(userInput)) {
    return response
      .replace(/you('re| are) feeling neutral|From what you've shared, I hear you're feeling neutral/i, "That sounds really embarrassing")
      .replace(/Would you like to tell me more about what happened\?/i, "Social moments like that can be tough. How did she react when it happened?");
  }
  
  // For general embarrassment or social awkwardness
  if (/embarrass(ing|ed)?|awkward|uncomfortable/i.test(userInput)) {
    return response
      .replace(/you('re| are) feeling neutral|From what you've shared, I hear you're feeling neutral/i, "That sounds embarrassing")
      .replace(/Would you like to tell me more about what happened\?/i, "Those kinds of moments can make anyone feel self-conscious. How are you handling it?");
  }
  
  // If we found an emotion entry, use it to correct the response
  if (emotionEntry) {
    return response
      .replace(/you('re| are) feeling neutral|From what you've shared, I hear you're feeling neutral/i, `I hear that you're feeling ${emotionEntry.name}`)
      .replace(/Would you like to tell me more about what happened\?/i, `Would you like to share more about what's making you feel ${emotionEntry.name}?`);
  }
  
  // For sad emotions specifically (our main case)
  if (/sad|down|upset|blue/i.test(userInput)) {
    return response
      .replace(/you('re| are) feeling neutral|From what you've shared, I hear you're feeling neutral/i, "I hear that you're feeling sad")
      .replace(/Would you like to tell me more about what happened\?/i, "Would you like to share more about what's making you feel that way?");
  }
  
  // For general negative emotions without specifics
  return response
    .replace(/you('re| are) feeling neutral|From what you've shared, I hear you're feeling neutral/i, "That sounds difficult")
    .replace(/Would you like to tell me more about what happened\?/i, "Can you tell me more about how that made you feel?");
};

/**
 * Add humanizing touches to responses
 * Makes Roger's responses more natural and less robotic
 */
export const addHumanTouch = (
  response: string,
  userInput: string
): string => {
  // Check if the response is already sufficiently human-like
  if (/oh man|I've been there|Those days can be|totally get that/i.test(response)) {
    return response;
  }
  
  // For social embarrassment
  if (/spill(ed)?.*drink|spill(ed)?.*girl|embarrass/i.test(userInput)) {
    const socialPhrases = [
      "Oh man, that's definitely awkward. ",
      "I totally understand feeling embarrassed. ",
      "Those social mishaps can really stick with you. "
    ];
    const randomSocialPhrase = socialPhrases[Math.floor(Math.random() * socialPhrases.length)];
    response = randomSocialPhrase + response;
  }
  
  // Make responses less clinical for everyday situations
  response = response
    .replace("I understand that must be difficult", "That's rough")
    .replace("I hear what you're saying about", "Sounds like")
    .replace("Would you care to elaborate", "Want to tell me more")
    .replace("That sounds challenging", "That's tough")
    .replace(/^Based on what you're sharing,\s*/i, "")
    .replace(/^From what you've shared,\s*/i, "");
  
  return response;
};
