
/**
 * Personality Variation System
 * 
 * Adds variety, spontaneity and authentic personality to Roger's responses
 * to avoid formulaic and repetitive interactions
 */

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
 */
export const addResponseVariety = (response: string, userInput: string, messageCount: number): string => {
  let enhancedResponse = response;
  
  // Replace the problematic "It seems like you shared that" pattern 
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
  
  // Replace "I hear you're feeling" pattern
  if (/I hear you('re| are) feeling/i.test(enhancedResponse)) {
    const match = enhancedResponse.match(/I hear you('re| are) feeling ([^.]+)\./i);
    
    if (match && match[2]) {
      const feeling = match[2];
      const replacements = [
        `It sounds like you're feeling ${feeling}.`,
        `You seem to be experiencing ${feeling}.`,
        `I'm picking up that you feel ${feeling}.`,
        `From what you've shared, you're feeling ${feeling}.`
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
  
  // Add occasional empathic statement
  if (Math.random() < 0.7 && !enhancedResponse.includes("feeling")) {
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
  
  // Add personal touches occasionally but especially after message #3 
  // to increase personality and connection after initial rapport
  if ((messageCount > 3 && Math.random() < 0.4) || 
      (userInput.toLowerCase().includes("embarrass") && Math.random() < 0.7)) {
    const randomPersonalTouch = personalTouches[Math.floor(Math.random() * personalTouches.length)];
    
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
    const randomFollowUp = followUpEncouragements[Math.floor(Math.random() * followUpEncouragements.length)];
    
    enhancedResponse = enhancedResponse.replace(
      /Would you like to tell me more\?$|Can you tell me more\?$/i,
      randomFollowUp
    );
  }
  
  return enhancedResponse;
};

/**
 * Generate a completely spontaneous response when detecting a repetition loop
 * This function creates a fresh response that breaks any detected patterns
 */
export const generateSpontaneousResponse = (userInput: string, recentResponses: string[]): string => {
  // Detect key topics in the user's input
  const topics = detectTopics(userInput);
  
  // Choose a fresh perspective based on the topics
  if (topics.includes('socialSituation') || topics.includes('embarrassment')) {
    const socialResponses = [
      "These social moments that feel awkward to us often aren't as noticed by others as we might think. What do you think the other person might have been feeling in that moment?",
      "It's interesting how our brains can replay embarrassing moments on a loop. What would you say to a friend who experienced the same situation?",
      "Social interactions can be complex! I'm curious - what would have felt like a better outcome for you in that moment?",
      "Those split-second decisions in awkward situations can be really tough. Looking back now, what would have felt more authentic to you?"
    ];
    return socialResponses[Math.floor(Math.random() * socialResponses.length)];
  }
  
  if (topics.includes('regret') || topics.includes('shouldHave')) {
    const regretResponses = [
      "It's natural to think about what we could have done differently. What would you have preferred to say or do in that moment?",
      "Replaying situations and thinking 'I should have' is something most of us do. What would the most compassionate response to yourself be right now?", 
      "If you could go back to that moment with what you know now, what might you do differently?",
      "I wonder if there's something from this experience that might be useful next time you're in a similar situation?"
    ];
    return regretResponses[Math.floor(Math.random() * regretResponses.length)];
  }
  
  // Default spontaneous responses that avoid patterns detected in recent responses
  const defaultResponses = [
    "Let's take a different angle on this - what's the most important aspect of this experience for you?",
    "I'm curious about what this situation tells you about what matters to you?",
    "Sometimes talking about these moments helps us see them differently. Has your perspective shifted at all as we've been talking?",
    "What would feel most helpful to focus on right now as we continue our conversation?",
    "I'm wondering what stood out to you most about how you handled that situation?"
  ];
  
  // If we have recent responses, make sure we're not repeating patterns
  if (recentResponses.length > 0) {
    // Find responses that don't contain phrases from recent responses
    const uniqueResponses = defaultResponses.filter(potential => 
      !recentResponses.some(recent => 
        // Check if any 4-word sequence from recent appears in potential
        hasCommonPhrases(recent, potential)
      )
    );
    
    // If we have unique responses, choose one
    if (uniqueResponses.length > 0) {
      return uniqueResponses[Math.floor(Math.random() * uniqueResponses.length)];
    }
  }
  
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
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
