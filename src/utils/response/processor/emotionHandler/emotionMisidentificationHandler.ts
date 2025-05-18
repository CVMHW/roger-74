
/**
 * Emotion Misidentification Handler
 * 
 * Specialized handler for detecting and correcting emotion misidentification in responses
 * This is specifically for Rogerian/emotional responses, not logotherapy
 */

import { emotionsWheel, getEmotionFromWheel, detectSocialEmotionalContext } from '../../../emotions/emotionsWheel';

// Import everyday situation handlers
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
  
  // Improved detection of emotional content
  // Explicitly check for depression mentions first - highest priority
  if (/depress(ed|ion|ing)|sad|down|blue|low|hopeless|worthless|empty|numb/i.test(userInput)) {
    console.log("EMOTION DETECTION: Depression mentioned but not recognized");
    return true;
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
    console.log("EMOTION DETECTION: Explicit emotions mentioned:", mentionedEmotions);
    return true; // User explicitly mentioned an emotion but we said "neutral"
  }
  
  // Check for social emotional contexts
  const socialContext = detectSocialEmotionalContext(userInput);
  if (socialContext) {
    console.log("EMOTION DETECTION: Social emotional context detected:", socialContext);
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
    /rejected|turned down|stood up|ghosted|dumped|broke up/i
  ];
  
  // If input mentions any negative emotions but response claims neutral, it's a misidentification
  for (const pattern of negativeEmotionPatterns) {
    if (pattern.test(userInput)) {
      console.log("EMOTION DETECTION: Negative emotion pattern matched:", pattern);
      return true;
    }
  }
  
  return false;
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
  // Special case for depression - highest priority
  if (/depress(ed|ion|ing)|feeling down/i.test(userInput.toLowerCase())) {
    console.log("EMOTION CORRECTION: Fixing depression misidentification");
    
    // Create a compassionate response for depression
    return response
      .replace(/you('re| are) feeling neutral|I hear you're feeling neutral|From what you've shared, I hear you're feeling neutral/i, 
               "I hear that you're feeling depressed")
      .replace(/Would you like to tell me more about what happened\?/i, 
               "That sounds really difficult. Would you like to share more about what's been going on for you?");
  }
  
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
  
  // For sad emotions specifically (our most common case)
  if (/sad|down|upset|blue/i.test(userInput)) {
    console.log("EMOTION CORRECTION: Fixing sadness misidentification");
    return response
      .replace(/you('re| are) feeling neutral|I hear you're feeling neutral|From what you've shared, I hear you're feeling neutral/i, 
               "I hear that you're feeling sad")
      .replace(/Would you like to tell me more about what happened\?/i, 
               "I'm sorry to hear you're going through this. Would you like to share more about what's making you feel sad?");
  }
  
  // If we found an emotion entry, use it to correct the response
  if (emotionEntry) {
    console.log("EMOTION CORRECTION: Using emotion from wheel:", emotionEntry.name);
    return response
      .replace(/you('re| are) feeling neutral|I hear you're feeling neutral|From what you've shared, I hear you're feeling neutral/i, 
               `I hear that you're feeling ${emotionEntry.name}`)
      .replace(/Would you like to tell me more about what happened\?/i, 
               `Would you like to share more about what's making you feel ${emotionEntry.name}?`);
  }
  
  // For general negative emotions without specifics
  console.log("EMOTION CORRECTION: Using general negative emotion correction");
  return response
    .replace(/you('re| are) feeling neutral|I hear you're feeling neutral|From what you've shared, I hear you're feeling neutral/i, 
             "That sounds difficult")
    .replace(/Would you like to tell me more about what happened\?/i, 
             "Can you tell me more about how that made you feel?");
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
  
  // For depression or sadness
  if (/depress(ed|ion)|sad|down|blue|low|lonely/i.test(userInput)) {
    const empathyPhrases = [
      "I'm really sorry to hear that. ",
      "That sounds really tough. ",
      "That can be really hard to go through. "
    ];
    const randomPhrase = empathyPhrases[Math.floor(Math.random() * empathyPhrases.length)];
    response = randomPhrase + response;
  }
  
  // For social embarrassment
  else if (/spill(ed)?.*drink|spill(ed)?.*girl|embarrass/i.test(userInput)) {
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
