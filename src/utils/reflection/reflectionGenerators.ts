/**
 * Utilities for generating reflections based on detected emotions
 */

import { FeelingCategory, ConversationStage, ContextAwareReflection } from './reflectionTypes';
import { reflectionPhrases, generalReflections, meaningReflections } from './reflectionPhrases';
import { extractContextualElements } from './feelingDetection';

/**
 * Extracts key context from a user message
 * @param userMessage The original user message
 * @returns Important contextual information
 */
export const extractContext = (userMessage: string): string => {
  // Extract nouns and proper nouns that might be important context
  const words = userMessage.split(' ');
  const contextKeywords: string[] = [];
  
  // Look for potential entities (capitalized words not at the beginning of sentences)
  words.forEach((word, index) => {
    // Check for capitalized words that aren't at the start of a sentence
    if (index > 0 && word.charAt(0) === word.charAt(0).toUpperCase() && word.charAt(0) !== word.charAt(0).toLowerCase()) {
      contextKeywords.push(word.replace(/[.,!?;:]$/, '')); // Remove punctuation
    }
  });
  
  // Look for specific topics/themes
  const topics = ['family', 'work', 'school', 'relationship', 'friend', 'health', 'money', 
                 'team', 'sport', 'game', 'music', 'art', 'politics', 'religion', 'browns', 
                 'cavaliers', 'cavs', 'guardians', 'indians', 'baltimore', 'cleveland', 
                 'moving', 'relocation', 'coach', 'player', 'season'];
  
  const lowerMessage = userMessage.toLowerCase();
  
  topics.forEach(topic => {
    if (lowerMessage.includes(topic)) {
      contextKeywords.push(topic);
    }
  });
  
  // Return unique contextual elements
  return [...new Set(contextKeywords)].join(' ');
};

/**
 * Creates a rich context-aware reflection by analyzing the user's message in depth
 * @param userMessage The user's message
 * @returns Contextual information for creating personalized reflections
 */
export const createRichContextReflection = (userMessage: string): ContextAwareReflection | null => {
  const feelings = identifyFeelings(userMessage);
  if (feelings.length === 0) return null;
  
  const primaryFeeling = feelings[0];
  const contextElements = extractContextualElements(userMessage);
  const significantPhrases = extractSignificantPhrases(userMessage);
  
  // Extract specific details about teams, locations, events
  const specificDetails = [];
  
  // Handle sports teams specifically
  if (contextElements.sportTeams.length > 0) {
    const team = contextElements.sportTeams[0];
    if (userMessage.toLowerCase().includes(`${team} moving`)) {
      specificDetails.push(`the ${team} relocating`);
    } else if (userMessage.toLowerCase().includes(`${team} lost`) || 
              userMessage.toLowerCase().includes(`${team} losing`)) {
      specificDetails.push(`the ${team} losing`);
    } else {
      specificDetails.push(`the ${team}`);
    }
  }
  
  // Add locations if mentioned
  if (contextElements.locations.length > 0) {
    specificDetails.push(contextElements.locations[0]);
  }
  
  // Create the reflection object
  const reflection: ContextAwareReflection = {
    feeling: primaryFeeling,
    context: extractContext(userMessage),
    reflection: '', // Will be populated by the calling function
    specificDetails: specificDetails.join(' and '),
    relationshipContext: contextElements.relationshipContext || undefined,
    timeContext: contextElements.timeContext || undefined,
    locationContext: contextElements.locations.length > 0 ? contextElements.locations[0] : undefined
  };
  
  return reflection;
};

/**
 * Enhanced function that identifies feelings in the text
 */
const identifyFeelings = (userMessage: string): FeelingCategory[] => {
  // Import here to avoid circular dependency
  const { identifyFeelings: detectFeelings } = require('./feelingDetection');
  return detectFeelings(userMessage);
};

/**
 * Generates a reflection of feeling based on detected emotions
 * @param feelings Array of identified feelings
 * @param userMessage The original user message
 * @returns A reflection of feeling response
 */
export const createFeelingReflection = (feelings: FeelingCategory[], userMessage: string): string => {
  // If no specific feelings were detected, return a general reflection
  if (feelings.length === 0) {
    return createGeneralReflection(userMessage);
  }

  // Try to create a rich, context-aware reflection
  const richContext = createRichContextReflection(userMessage);
  if (richContext) {
    const phrases = reflectionPhrases[richContext.feeling] || [];
    
    if (phrases.length > 0) {
      const basePhrase = phrases[Math.floor(Math.random() * phrases.length)];
      
      // Create a highly personalized reflection incorporating specific details
      let personalizedReflection = basePhrase;
      
      // Add specific details if available
      if (richContext.specificDetails) {
        personalizedReflection += ` I notice you mentioned ${richContext.specificDetails}.`;
      }
      
      // Add relationship context if available
      if (richContext.relationshipContext) {
        personalizedReflection += ` Your ${richContext.relationshipContext} seems important in this context.`;
      }
      
      // Add follow-up question based on the emotion
      if (richContext.feeling === 'sad') {
        personalizedReflection += " Would you like to share more about how this is affecting you?";
      } else if (richContext.feeling === 'angry') {
        personalizedReflection += " What aspects of this situation have been most frustrating for you?";
      } else if (richContext.feeling === 'anxious') {
        personalizedReflection += " What specifically has been causing you the most concern?";
      } else {
        personalizedReflection += " Would you like to talk more about this?";
      }
      
      return personalizedReflection;
    }
  }
  
  // Select the most prominent feeling
  const primaryFeeling = feelings[0];
  
  // Extract context from the user message
  const context = extractContext(userMessage);
  
  // Get significant words from the user's message
  const significantPhrases = extractSignificantPhrases(userMessage);
  
  // Create a personalized reflection incorporating the context and the user's own words
  if (context || significantPhrases) {
    const phrases = reflectionPhrases[primaryFeeling] || [];
    
    if (phrases.length > 0) {
      const basePhrase = phrases[Math.floor(Math.random() * phrases.length)];
      
      // Incorporate context and/or significant phrases into the reflection
      if (context && significantPhrases) {
        return `${basePhrase} I notice you mentioned ${context} and ${significantPhrases}. Would you like to talk more about that?`;
      } else if (context) {
        return `${basePhrase} I notice you mentioned ${context}. Can you tell me more about how that's affecting you?`;
      } else {
        return `${basePhrase} When you say "${significantPhrases}", what aspects of that are most difficult?`;
      }
    }
  }
  
  // If we couldn't create a personalized reflection, use the standard reflection phrases
  const phrases = reflectionPhrases[primaryFeeling] || [];
  if (phrases.length > 0) {
    return phrases[Math.floor(Math.random() * phrases.length)];
  }
  
  return createGeneralReflection(userMessage);
};

/**
 * Extracts significant phrases from the user's message
 * @param userMessage The user's message
 * @returns A significant phrase or empty string
 */
export const extractSignificantPhrases = (userMessage: string): string => {
  // Look for emotionally charged statements
  const emotionalIndicators = [
    "I feel", "I am", "I'm", "I've been", "I've felt",
    "I hate", "I love", "I miss", "I need", "I want", "I wish",
    "It makes me", "It's been", "It is"
  ];
  
  let significantPhrase = "";
  
  // Find phrases that follow emotional indicators
  for (const indicator of emotionalIndicators) {
    const lowerMessage = userMessage.toLowerCase();
    const index = lowerMessage.indexOf(indicator.toLowerCase());
    
    if (index !== -1) {
      // Extract the phrase starting with the indicator
      const startIndex = index;
      const endIndex = Math.min(
        userMessage.indexOf('.', startIndex + indicator.length),
        userMessage.indexOf('!', startIndex + indicator.length),
        userMessage.indexOf('?', startIndex + indicator.length)
      );
      
      // If we found a proper end to the phrase
      if (endIndex !== -1) {
        significantPhrase = userMessage.substring(startIndex, endIndex).trim();
        break;
      } else {
        // If no punctuation, just take a reasonable chunk
        significantPhrase = userMessage.substring(startIndex, startIndex + 50).trim();
        if (significantPhrase.length === 50) {
          significantPhrase += "..."; // Indicate it was truncated
        }
        break;
      }
    }
  }
  
  // If no emotional indicators, look for other significant content
  if (!significantPhrase) {
    const words = userMessage.split(' ');
    if (words.length > 3) {
      // Extract a meaningful chunk of the message
      const startIndex = Math.floor(words.length / 3);
      const endIndex = Math.min(startIndex + 5, words.length);
      significantPhrase = words.slice(startIndex, endIndex).join(' ');
    }
  }
  
  return significantPhrase;
};

/**
 * Creates a reflection focused on meaning when specific feelings aren't identified
 * @param userMessage The user's message
 * @returns A reflection that attempts to capture meaning
 */
export const createMeaningReflection = (userMessage: string): string => {
  // Select a random meaning reflection starter
  const reflectionStarter = meaningReflections[Math.floor(Math.random() * meaningReflections.length)];
  
  // Extract key phrases from the user message for the meaning reflection
  const significantPhrase = extractSignificantPhrases(userMessage);
  
  // If we found a significant phrase, use it
  if (significantPhrase) {
    return `${reflectionStarter} "${significantPhrase}". Is that close to what you're experiencing?`;
  }
  
  // Otherwise, use a portion of the message
  const words = userMessage.split(' ');
  const keyPhrase = words.length > 10 ? words.slice(0, 10).join(' ') + "..." : userMessage;
  
  return `${reflectionStarter} ${keyPhrase}. Is that close to what you're experiencing?`;
};

/**
 * Creates a general reflection when specific feelings or meanings are unclear
 * @param userMessage The user's message
 * @returns A general reflection response
 */
export const createGeneralReflection = (userMessage: string): string => {
  // Extract any potential context we can use
  const context = extractContext(userMessage);
  
  if (context) {
    return `I notice you mentioned ${context}. Could you tell me more about how that's affecting you?`;
  }
  
  return generalReflections[Math.floor(Math.random() * generalReflections.length)];
};
