
/**
 * Personality Variation System
 * 
 * UNIVERSAL LAW: Adds variety, spontaneity and authentic personality to Roger's responses
 * to avoid formulaic and repetitive interactions
 */

// Import personality tools
import { 
  getRandomPersonality, 
  getSentenceStarters, 
  getTransitionPhrases, 
  getClosingPhrases, 
  getPersonalTouches,
  generateSpontaneousResponse as generateEnhancedSpontaneousResponse
} from './spontaneityGenerator';
import { PersonalityMode } from './spontaneityGenerator';

// Import reflection helpers
import { getRogerPersonalityInsight } from '../reflection/rogerPersonality';
import { identifyEnhancedFeelings } from '../reflection/feelingDetection';

// List of varied acknowledgment phrases to replace formulaic patterns
const acknowledgmentVariations = [
  "I understand what you're sharing about",
  "I'm following your experience with",
  "I can see how you felt about",
  "I appreciate you telling me about",
  "That makes sense about",
  "I'm hearing your perspective on",
  "Thanks for opening up about",
  "I'm connecting with what you said about",
  "I'm following your thoughts on",
  "I get what you mean about"
];

// List of varied question starters to replace repetitive questions
const questionVariations = [
  "What stands out to you most about this?",
  "How did that sit with you afterwards?",
  "What thoughts came up for you then?",
  "What felt most significant about that experience?",
  "How has this been affecting you?",
  "What's been on your mind since then?",
  "Where do you think these feelings are coming from?",
  "What would have felt better in that moment?",
  "What do you make of that situation now?",
  "How would you approach a similar situation next time?"
];

// List of empathic statements to add natural warmth
const empathicStatements = [
  "Those moments can really stick with us.",
  "Social situations like that can be tricky to navigate.",
  "It's natural to replay interactions and wonder about different approaches.",
  "That kind of experience can definitely make us feel self-conscious.",
  "It makes sense you're still thinking about this.",
  "Those awkward moments tend to feel bigger to us than they do to others.",
  "We often judge ourselves more harshly than others do.",
  "That kind of situation would make many people feel uncertain.",
  "It's completely normal to feel that way after something like that.",
  "It sounds like that really made an impression on you."
];

// List of authentic personal touches that reflect Roger's personality
const personalTouches = [
  "I've definitely been in similar situations myself.",
  "I remember spilling coffee all over myself before an important meeting once.",
  "Social moments can be tough - I still replay awkward interactions in my head sometimes.",
  "I've found that the things we worry most about often aren't as noticed by others as we think.",
  "I used to get really stuck on moments like these too.",
  "In my experience, giving ourselves a bit of grace helps in these situations.",
  "When I've felt embarrassed like that, I've tried to remind myself we all have these moments.",
  "I've learned that most people are too focused on themselves to remember our slip-ups.",
  "I've been working on not being so hard on myself in these situations.",
  "My own tendency is to overthink these moments too."
];

// List of follow-up encouragements 
const followUpEncouragements = [
  "I'd like to hear more about this if you're comfortable sharing.",
  "Feel free to tell me more about what happened.",
  "Would you like to explore this further?",
  "I'm here to listen if you want to share more details.",
  "What else about this experience would be helpful to talk about?",
  "Is there more to this you'd like to discuss?",
  "I'm interested in understanding more about this if you'd like to continue.",
  "Where would you like to take this conversation?",
  "What aspect of this feels most important to focus on?"
];

/**
 * Add variety to Roger's responses by replacing repetitive patterns with
 * more natural, varied phrasing
 * 
 * @param response The original response text
 * @param userInput The user's input for context
 * @param messageCount How many messages in the conversation
 * @param spontaneityLevel Level of spontaneity to apply (0-100)
 * @param creativityLevel Level of creativity to apply (0-100)
 * @returns Enhanced response with varied phrasing
 */
export const addResponseVariety = (
  response: string, 
  userInput: string, 
  messageCount: number,
  spontaneityLevel: number = 65,
  creativityLevel: number = 60
): string => {
  let enhancedResponse = response;

  // Randomly choose a personality mode based on spontaneity level
  const personalityMode = getRandomPersonality();
  
  // CRITICAL: Check for and replace the problematic "It seems like you shared that" pattern
  // This pattern is a major hallucination trigger
  if (/It seems like you shared that/i.test(enhancedResponse)) {
    const match = enhancedResponse.match(/It seems like you shared that ([^.]+)\./i);
    
    if (match && match[1]) {
      const topic = match[1];
      const randomAcknowledgment = acknowledgmentVariations[Math.floor(Math.random() * acknowledgmentVariations.length)];
      
      enhancedResponse = enhancedResponse.replace(
        /It seems like you shared that ([^.]+)\./i,
        `${randomAcknowledgment} ${topic}.`
      );
    }
  }
  
  // Replace "I hear you're feeling" pattern with more varied expressions
  if (/I hear you('re| are) feeling/i.test(enhancedResponse)) {
    const match = enhancedResponse.match(/I hear you('re| are) feeling ([^.]+)\./i);
    
    if (match && match[2]) {
      const feeling = match[2];
      const replacements = [
        `It sounds like you're feeling ${feeling}.`,
        `You seem to be experiencing ${feeling}.`,
        `I'm picking up that you feel ${feeling}.`,
        `From what you've shared, you're feeling ${feeling}.`,
        `It makes sense that you'd feel ${feeling} in that situation.`,
        `That kind of experience often brings up feelings of ${feeling}.`
      ];
      const replacement = replacements[Math.floor(Math.random() * replacements.length)];
      
      enhancedResponse = enhancedResponse.replace(
        /I hear you('re| are) feeling ([^.]+)\./i,
        replacement
      );
    }
  }
  
  // Replace repetitive questions at the end
  if (/Would you like to (tell|share) more about what happened\?$/i.test(enhancedResponse)) {
    const randomQuestion = questionVariations[Math.floor(Math.random() * questionVariations.length)];
    
    enhancedResponse = enhancedResponse.replace(
      /Would you like to (tell|share) more about what happened\?$/i,
      randomQuestion
    );
  }
  
  // Replace pattern-breaking language with more natural variations
  if (/I notice I may have been repeating myself/i.test(enhancedResponse)) {
    const replacements = [
      "Let me approach this from a different angle.",
      "I want to make sure I'm understanding what matters most to you here.",
      "Let's focus more specifically on your experience.",
      "I'd like to explore this from a fresh perspective.",
      "Let me try a different approach to better understand your experience."
    ];
    const replacement = replacements[Math.floor(Math.random() * replacements.length)];
    
    enhancedResponse = enhancedResponse.replace(
      /I notice I may have been repeating myself[^.]*\./i,
      replacement
    );
  }
  
  // Replace generic "I'd like to focus specifically on" pattern
  if (/I'd like to focus specifically on/i.test(enhancedResponse)) {
    const replacements = [
      "What stands out to me is",
      "I'm particularly interested in",
      "Let's explore",
      "I'm curious about",
      "What seems important here is"
    ];
    const replacement = replacements[Math.floor(Math.random() * replacements.length)];
    
    enhancedResponse = enhancedResponse.replace(
      /I'd like to focus specifically on/i,
      replacement
    );
  }
  
  // Add occasional empathic statement based on spontaneity level
  if (Math.random() * 100 < spontaneityLevel && !enhancedResponse.includes("feeling")) {
    const randomEmpathy = empathicStatements[Math.floor(Math.random() * empathicStatements.length)];
    
    // Look for a good place to insert the empathic statement
    const sentences = enhancedResponse.split(/(?<=[.!?])\s+/);
    if (sentences.length > 1) {
      // Insert after the first sentence
      sentences.splice(1, 0, randomEmpathy);
      enhancedResponse = sentences.join(" ");
    } else {
      // Just append it
      enhancedResponse = `${enhancedResponse} ${randomEmpathy}`;
    }
  }
  
  // Add personal touches based on spontaneity and message count
  // Higher probability after a few messages for natural rapport building
  if ((messageCount > 3 && Math.random() * 100 < spontaneityLevel) || 
      (userInput.toLowerCase().includes("embarrass") && Math.random() * 100 < spontaneityLevel)) {
    
    // Get personality-specific touches
    const availableTouches = getPersonalTouches(personalityMode);
    const randomPersonalTouch = availableTouches[Math.floor(Math.random() * availableTouches.length)];
    
    // Find a good place to insert the personal touch
    if (enhancedResponse.includes(". ")) {
      const parts = enhancedResponse.split(". ");
      // Insert somewhere in the middle
      const insertPosition = Math.min(parts.length - 1, Math.floor(parts.length / 2));
      parts.splice(insertPosition, 0, randomPersonalTouch);
      enhancedResponse = parts.join(". ");
    } else {
      enhancedResponse = `${enhancedResponse} ${randomPersonalTouch}`;
    }
  }
  
  // Add varied follow-up encouragements instead of repeating the same question
  if (/Would you like to tell me more\?$|Can you tell me more\?$/i.test(enhancedResponse)) {
    // Get personality-specific closings
    const availableClosings = getClosingPhrases(personalityMode);
    const randomFollowUp = availableClosings[Math.floor(Math.random() * availableClosings.length)];
    
    enhancedResponse = enhancedResponse.replace(
      /Would you like to tell me more\?$|Can you tell me more\?$/i,
      randomFollowUp
    );
  }
  
  // Add spontaneous thought transitions based on spontaneity level
  if (Math.random() * 100 < spontaneityLevel / 2) {
    const transitions = getTransitionPhrases(personalityMode);
    const randomTransition = transitions[Math.floor(Math.random() * transitions.length)];
    
    // Only add if response doesn't already have too many sentences
    const sentenceCount = (enhancedResponse.match(/[.!?]/g) || []).length;
    
    if (sentenceCount < 4) {
      // Find a good spot to insert the transition
      const sentences = enhancedResponse.split(/(?<=[.!?])\s+/);
      if (sentences.length > 1) {
        // Create a transition thought
        const transitionThought = `${randomTransition}, ${getRandomThought(userInput, personalityMode)}`;
        
        // Insert near the end but before any questions
        let insertPosition = sentences.length - 1;
        if (sentences[sentences.length - 1].includes('?')) {
          insertPosition = sentences.length - 2;
        }
        insertPosition = Math.max(0, insertPosition);
        
        sentences.splice(insertPosition, 0, transitionThought);
        enhancedResponse = sentences.join(" ");
      }
    }
  }
  
  return enhancedResponse;
};

/**
 * Generate a random thought related to the user's input
 */
const getRandomThought = (userInput: string, personality: PersonalityMode): string => {
  const lowerInput = userInput.toLowerCase();
  
  // Social situation thoughts
  if (lowerInput.includes('embarrass') || lowerInput.includes('awkward') || 
      lowerInput.includes('spill') || lowerInput.includes('bar')) {
      
    const socialThoughts = [
      "these social moments often feel bigger to us than to others",
      "most people are usually more focused on themselves than on our mistakes",
      "even confident people have these kinds of awkward moments",
      "it's how we respond to these situations that often matters most",
      "our self-judgment can be harsher than how others actually see us"
    ];
    
    return socialThoughts[Math.floor(Math.random() * socialThoughts.length)];
  }
  
  // Generic thoughts based on personality
  switch (personality) {
    case 'curious':
      return "I'm interested in understanding how this fits into your broader experience";
      
    case 'empathetic':
      return "it makes sense that this experience would bring up these feelings";
      
    case 'reflective':
      return "experiences like these often reveal something about what matters to us";
      
    case 'direct':
      return "it might help to focus on what specific aspects of this situation you'd like to address";
      
    case 'analytical':
      return "looking at patterns in these situations can sometimes provide helpful insights";
      
    case 'warm':
      return "I appreciate you sharing something that clearly matters to you";
      
    case 'thoughtful':
      return "I wonder what meaning this experience holds for you";
      
    case 'conversational':
      return "these kinds of situations happen to all of us at some point";
      
    case 'gentle':
      return "it might be worth considering what would feel most supportive right now";
      
    case 'grounded':
      return "focusing on what's within your control might be helpful";
      
    default:
      return "everyone processes experiences differently";
  }
};

/**
 * Generate a completely spontaneous response when detecting a repetition loop
 * This function creates a fresh response that breaks any detected patterns
 */
export const generateSpontaneousResponse = (
  userInput: string, 
  recentResponses: string[] = [],
  spontaneityLevel: number = 75,
  creativityLevel: number = 70,
  personalityMode: PersonalityMode = getRandomPersonality()
): string => {
  // Use the enhanced spontaneous response generator
  return generateEnhancedSpontaneousResponse(
    userInput, 
    recentResponses, 
    spontaneityLevel, 
    creativityLevel,
    personalityMode
  );
};

// Helper function to detect key topics in user input
const detectTopics = (userInput: string): string[] => {
  const input = userInput.toLowerCase();
  const topics: string[] = [];
  
  if (/embarrass|awkward|nervous|spill|stumble|clumsy/i.test(input)) {
    topics.push('embarrassment');
  }
  
  if (/friend|girl|date|bar|social|people|conversation/i.test(input)) {
    topics.push('socialSituation');
  }
  
  if (/regret|wish|missed|opportunity/i.test(input)) {
    topics.push('regret');
  }
  
  if (/could have|should have|would have|better|differently/i.test(input)) {
    topics.push('shouldHave');
  }
  
  return topics;
};

// Helper function to detect common phrases between responses
const hasCommonPhrases = (text1: string, text2: string): boolean => {
  const words1 = text1.toLowerCase().split(/\s+/);
  const words2 = text2.toLowerCase().split(/\s+/);
  
  // Check for 4-word sequences
  for (let i = 0; i <= words1.length - 4; i++) {
    const phrase = words1.slice(i, i + 4).join(' ');
    if (words2.join(' ').includes(phrase)) {
      return true;
    }
  }
  
  return false;
};
