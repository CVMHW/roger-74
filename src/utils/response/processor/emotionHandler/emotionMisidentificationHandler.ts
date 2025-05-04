
/**
 * Emotion Misidentification Handler
 * 
 * Specialized handler for detecting and correcting emotion misidentification in responses
 * This is specifically for Rogerian/emotional responses, not logotherapy
 */

// Import Cleveland-specific content and references
import { detectClevelandSportsReference } from '../../../conversationEnhancement/ohio/detectors';
import { detectOhioReferences } from '../../../conversationEnhancement/ohio/references';

// Import emotion data from reflection system
import { 
  getFeelingCategories, 
  detectEmotionalContent 
} from '../../../reflection';

// Import everyday situation handlers
import { 
  detectEverydaySituation,
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
  const claimsNeutral = /you('re| are) feeling neutral/i.test(response);
  
  if (!claimsNeutral) {
    return false;
  }
  
  // Check for negative emotion indicators in user input
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
    /rejected|turned down|stood up|ghosted|dumped|broke up/i,
    // Sports context indicators often tied to emotions
    /(cavs|browns|guardians) (game|match|lost|won)/i
  ];
  
  // If input mentions any negative emotions but response claims neutral, it's a misidentification
  return negativeEmotionPatterns.some(pattern => pattern.test(userInput));
};

/**
 * Fix emotion misidentification in responses
 * Returns a more human, conversational response that acknowledges the emotional context
 */
export const fixEmotionMisidentification = (
  response: string,
  userInput: string
): string => {
  // Check for Cleveland references for better localized response
  const ohioReferences = detectOhioReferences(userInput);
  const isClevelandSports = detectClevelandSportsReference(userInput);
  
  // For social situations and embarrassment
  if (/spill(ed)?|embarrass(ing|ed)?|awkward|mess(ed)?( up)?|accident/i.test(userInput)) {
    if (/cute (girl|guy|woman|man|date)/i.test(userInput)) {
      // Dating/attraction context with Cleveland sports if applicable
      if (isClevelandSports) {
        return response
          .replace(/you('re| are) feeling neutral/i, "oh man, that's embarrassing at the game")
          .replace(/Would you like to tell me more about what happened\?/i, "I've definitely spilled beer at Cavs games before. How did she react?");
      }
      
      return response
        .replace(/you('re| are) feeling neutral/i, "oh man, that's embarrassing")
        .replace(/Would you like to tell me more about what happened\?/i, "I've been there - those moments are the worst! How did she react?");
    }
    
    return response
      .replace(/you('re| are) feeling neutral/i, "that sounds embarrassing")
      .replace(/Would you like to tell me more about what happened\?/i, "Those kinds of moments can feel really uncomfortable. How are you feeling about it now?");
  }
  
  // For sports context
  if (/(cavs|browns|guardians|sports|game|match)/i.test(userInput)) {
    // Use everyday situation detector to get more context
    const situationInfo = detectEverydaySituation(userInput);
    
    if (/spill(ed)?|mess/i.test(userInput)) {
      // Sports + embarrassment combination
      return response
        .replace(/you('re| are) feeling neutral/i, "that's a rough situation at the game")
        .replace(/Would you like to tell me more about what happened\?/i, "Watching the Cavs should be fun, not stressful! What happened after you spilled the drink?");
    }
    
    return response
      .replace(/you('re| are) feeling neutral/i, "I hear you're a sports fan")
      .replace(/Would you like to tell me more about what happened\?/i, "I follow the Cavs too. What happened at the game that made your day rough?");
  }
  
  // For rough/tough day mentions - integrate with emotional content detection
  if (/rough|tough|hard|difficult|bad day/i.test(userInput)) {
    const emotionInfo = detectEmotionalContent(userInput);
    if (ohioReferences.hasOhioReference) {
      return response
        .replace(/you('re| are) feeling neutral/i, "sounds like a rough day here in Cleveland")
        .replace(/Would you like to tell me more about what happened\?/i, "Cleveland days have their ups and downs. What made today particularly challenging?");
    }
    
    return response
      .replace(/you('re| are) feeling neutral/i, "you've had a rough day")
      .replace(/Would you like to tell me more about what happened\?/i, "Those days can be draining. What was the most challenging part of your day?");
  }
  
  // For other negative emotions
  return response
    .replace(/you('re| are) feeling neutral/i, "that sounds challenging")
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
  const lowerInput = userInput.toLowerCase();
  
  // Check from memory system if user has mentioned Cleveland before
  const isFromCleveland = true; // Default assumption for Roger
  
  // Only apply humanizing touches if not already humanized
  if (/oh man|I've been there|Those days can be|totally get that/i.test(response)) {
    return response;
  }
  
  // For Cleveland sports fans - integrate with Cleveland detectors
  if (/(cavs|browns|guardians)/i.test(lowerInput)) {
    const sportsPhrases = [
      "As a Cleveland guy myself, I definitely understand the sports rollercoaster. ",
      "Cleveland sports, right? Always an adventure. ",
      "I'm a Cavs fan too - this season has had its moments! "
    ];
    const randomSportsPhrase = sportsPhrases[Math.floor(Math.random() * sportsPhrases.length)];
    response = randomSportsPhrase + response;
  }
  
  // For social embarrassment
  if (/spill(ed)?|embarrass/i.test(lowerInput) && /social|people|girl|guy|date|bar/i.test(lowerInput)) {
    // Use conversation enhancement system for appropriate response
    const situationInfo = detectEverydaySituation(userInput);
    
    const socialPhrases = [
      "Oh man, social mishaps are the worst. ",
      "I totally get that feeling. ",
      "Social stuff can be so tricky sometimes. "
    ];
    const randomSocialPhrase = socialPhrases[Math.floor(Math.random() * socialPhrases.length)];
    response = randomSocialPhrase + response;
  }
  
  // Make responses less clinical for everyday situations
  response = response
    .replace("I understand that must be difficult", "That's rough")
    .replace("I hear what you're saying about", "Sounds like")
    .replace("Would you care to elaborate", "Want to tell me more")
    .replace("That sounds challenging", "That's tough");
  
  return response;
};

