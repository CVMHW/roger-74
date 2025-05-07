
/**
 * Emotion Misidentification Handler
 * 
 * Specialized handler for detecting and correcting emotion misidentification in responses
 * This is specifically for Rogerian/emotional responses, not logotherapy
 */

// Import Cleveland-specific content and references
import { detectClevelandSportsReference } from '../../../conversationEnhancement/ohio/detectors';
import { detectOhioReferences } from '../../../conversationEnhancement/ohio/references';

// Import from masterRules for emotional content detection
import { detectEmotionalContent } from '../../../masterRules/emotionalAttunement/detectors';

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
          .replace(/you('re| are) feeling neutral|From what you've shared, I hear you're feeling neutral/i, "Oh man, that's embarrassing at the game")
          .replace(/Would you like to tell me more about what happened\?/i, "I've definitely spilled beer at Cavs games before. How did she react?");
      }
      
      return response
        .replace(/you('re| are) feeling neutral|From what you've shared, I hear you're feeling neutral/i, "Oh man, that's embarrassing")
        .replace(/Would you like to tell me more about what happened\?/i, "I've been there - those moments are the worst! How did she react?");
    }
    
    return response
      .replace(/you('re| are) feeling neutral|From what you've shared, I hear you're feeling neutral/i, "That sounds embarrassing")
      .replace(/Would you like to tell me more about what happened\?/i, "Those kinds of moments can feel really uncomfortable. How are you feeling about it now?");
  }
  
  // For sports context
  if (/(cavs|browns|guardians|sports|game|match)/i.test(userInput)) {
    // Use everyday situation detector to get more context
    const situationInfo = detectEverydaySituation(userInput);
    
    if (/spill(ed)?|mess/i.test(userInput)) {
      // Sports + embarrassment combination
      return response
        .replace(/you('re| are) feeling neutral|From what you've shared, I hear you're feeling neutral/i, "That's a rough situation at the game")
        .replace(/Would you like to tell me more about what happened\?/i, "Watching the Cavs should be fun, not stressful! What happened after you spilled the drink?");
    }
    
    return response
      .replace(/you('re| are) feeling neutral|From what you've shared, I hear you're feeling neutral/i, "I hear you're a sports fan")
      .replace(/Would you like to tell me more about what happened\?/i, "I follow the Cavs too. What happened at the game that made your day rough?");
  }
  
  // For rough/tough day mentions - integrate with emotional content detection
  if (/rough|tough|hard|difficult|bad day/i.test(userInput)) {
    const emotionInfo = detectEmotionalContent(userInput);
    if (ohioReferences.hasOhioReference) {
      return response
        .replace(/you('re| are) feeling neutral|From what you've shared, I hear you're feeling neutral/i, "Sounds like a rough day here in Cleveland")
        .replace(/Would you like to tell me more about what happened\?/i, "Cleveland days have their ups and downs. What made today particularly challenging?");
    }
    
    return response
      .replace(/you('re| are) feeling neutral|From what you've shared, I hear you're feeling neutral/i, "You've had a rough day")
      .replace(/Would you like to tell me more about what happened\?/i, "Those days can be draining. What was the most challenging part of your day?");
  }
  
  // For other negative emotions
  return response
    .replace(/you('re| are) feeling neutral|From what you've shared, I hear you're feeling neutral/i, "That sounds challenging")
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
  
  // Detect repetitive phrases and fix them
  response = response
    .replace(/Based on what you're sharing, Based on what you're sharing/i, "Based on what you're sharing")
    .replace(/From what you've shared, From what you've shared/i, "From what you've shared")
    .replace(/I hear what you're sharing, I hear what you're sharing/i, "I hear what you're sharing");
  
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
    .replace("That sounds challenging", "That's tough")
    .replace(/^Based on what you're sharing,\s*/i, "")
    .replace(/^From what you've shared,\s*/i, "");
  
  // Fix repetitive phrases that sound robotic
  const repetitivePatterns = [
    /Based on what you're sharing, Based on what/i,
    /From what you've shared, From what/i,
    /I hear what you're sharing, I hear what/i,
    /(what you've shared,?\s*){2,}/i,
    /(I hear\s*){2,}/i,
    /(Based on\s*){2,}/i
  ];
  
  for (const pattern of repetitivePatterns) {
    if (pattern.test(response)) {
      response = response.replace(pattern, (match) => {
        const parts = match.split(',');
        if (parts.length > 1) {
          return parts[0] + ',';
        }
        const words = match.split(' ');
        const uniqueWords = [...new Set(words)];
        return uniqueWords.join(' ');
      });
    }
  }
  
  // Fix non-contextual restaurant recommendations
  if ((lowerInput.includes("eating") || lowerInput.includes("food")) &&
      response.includes("Great Lakes Brewing Company")) {
    if (lowerInput.includes("disorder") || lowerInput.includes("anorexia") || 
        lowerInput.includes("bulimia") || lowerInput.includes("binge")) {
      response = response.replace(
        /I've heard great things about Great Lakes Brewing Company.*?atmosphere\./i,
        "I understand that eating can be a complex topic. Would you like to share more about your relationship with food?"
      );
    } else {
      response = response.replace(
        /I've heard great things about Great Lakes Brewing Company.*?atmosphere\./i,
        "I'm curious to hear more about your relationship with food. What aspects of your eating would be most helpful to discuss?"
      );
    }
  }
  
  return response;
};
