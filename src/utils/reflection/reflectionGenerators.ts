/**
 * Utilities for generating reflections based on detected emotions
 */

import { FeelingCategory, ContextAwareReflection } from './reflectionTypes';
import { reflectionPhrases, generalReflections, meaningReflections } from './reflectionPhrases';
import { extractContextualElements, identifyFeelings } from './feelingDetection';

/**
 * Extracts key context from a user message
 * @param userMessage The original user message
 * @returns Important contextual information
 */
export const extractContext = (userMessage: string): string => {
  if (!userMessage || typeof userMessage !== 'string') {
    return '';
  }
  
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
                 'moving', 'relocation', 'coach', 'player', 'season', 'rain', 'weather', 'outside'];
  
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
  if (!userMessage || typeof userMessage !== 'string') {
    return null;
  }
  
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
  
  // Handle weather context
  if (userMessage.toLowerCase().includes('rain') || 
      userMessage.toLowerCase().includes('weather')) {
    specificDetails.push('the rainy weather');
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
 * Extracts significant phrases from the user's message
 * @param userMessage The user's message
 * @returns A significant phrase or empty string
 */
export const extractSignificantPhrases = (userMessage: string): string => {
  if (!userMessage || typeof userMessage !== 'string') {
    return '';
  }
  
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
      let endIndex = userMessage.length;
      
      // Find the end of the phrase (next punctuation)
      const periodIndex = userMessage.indexOf('.', startIndex + indicator.length);
      const exclamIndex = userMessage.indexOf('!', startIndex + indicator.length);
      const quesIndex = userMessage.indexOf('?', startIndex + indicator.length);
      
      // Get the closest punctuation mark
      if (periodIndex !== -1) endIndex = Math.min(endIndex, periodIndex);
      if (exclamIndex !== -1) endIndex = Math.min(endIndex, exclamIndex);
      if (quesIndex !== -1) endIndex = Math.min(endIndex, quesIndex);
      
      // If we found a proper end to the phrase
      if (endIndex !== userMessage.length) {
        significantPhrase = userMessage.substring(startIndex, endIndex).trim();
        break;
      } else {
        // If no punctuation, just take a reasonable chunk
        significantPhrase = userMessage.substring(startIndex, Math.min(startIndex + 50, userMessage.length)).trim();
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
    } else {
      significantPhrase = userMessage; // Use the whole message if it's short
    }
  }
  
  return significantPhrase;
};

/**
 * Generates a reflection of feeling based on detected emotions
 * @param feelings Array of identified feelings
 * @param userMessage The original user message
 * @returns A reflection of feeling response
 */
export const createFeelingReflection = (feelings: FeelingCategory[], userMessage: string): string => {
  if (!userMessage || typeof userMessage !== 'string') {
    return "I'm here to listen. Could you share more about what's on your mind?";
  }
  
  // If no specific feelings were detected, return a general reflection
  if (!feelings || feelings.length === 0) {
    return createGeneralReflection(userMessage);
  }

  // Try to create a rich, context-aware reflection
  try {
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
        
        // Add time context if available
        if (richContext.timeContext) {
          personalizedReflection += ` This has been happening ${richContext.timeContext}.`;
        }
        
        // Add follow-up question based on the emotion - NEVER ASK WHAT EMOTION THEY'RE FEELING
        if (richContext.feeling === 'sad') {
          personalizedReflection += " What aspects of this situation have been most difficult for you?";
        } else if (richContext.feeling === 'angry') {
          personalizedReflection += " What specifically has been most frustrating about this situation?";
        } else if (richContext.feeling === 'anxious') {
          personalizedReflection += " What particular aspects have been causing you the most concern?";
        } else {
          personalizedReflection += " Would you like to share more about this?";
        }
        
        return personalizedReflection;
      }
    }
  } catch (error) {
    console.error("Error creating rich context reflection:", error);
    // Fall back to simpler reflection methods
  }
  
  // If rich context reflection fails, fall back to simpler methods
  
  // Select the most prominent feeling
  const primaryFeeling = feelings[0];
  
  // Extract context from the user message
  const context = extractContext(userMessage);
  
  // Get significant words from the user's message
  const significantPhrases = extractSignificantPhrases(userMessage);
  
  // Create a personalized reflection incorporating the context and the user's own words
  try {
    if (context || significantPhrases) {
      const phrases = reflectionPhrases[primaryFeeling] || [];
      
      if (phrases.length > 0) {
        const basePhrase = phrases[Math.floor(Math.random() * phrases.length)];
        
        // Incorporate context and/or significant phrases into the reflection
        if (context && significantPhrases) {
          return `${basePhrase} I notice you mentioned ${context} and ${significantPhrases}. What about this has been most significant for you?`;
        } else if (context) {
          return `${basePhrase} I notice you mentioned ${context}. Can you tell me more about how that's affecting you?`;
        } else if (significantPhrases) {
          return `${basePhrase} When you say "${significantPhrases}", what aspects of that are most difficult?`;
        }
      }
    }
  } catch (error) {
    console.error("Error creating personalized reflection:", error);
    // Fall back to standard phrases
  }
  
  // If we couldn't create a personalized reflection, use the standard reflection phrases
  try {
    const phrases = reflectionPhrases[primaryFeeling] || [];
    if (phrases.length > 0) {
      return phrases[Math.floor(Math.random() * phrases.length)];
    }
  } catch (error) {
    console.error("Error using standard reflection phrases:", error);
  }
  
  // Last resort - general reflection
  return createGeneralReflection(userMessage);
};

/**
 * Creates a reflection focused on meaning when specific feelings aren't identified
 * @param userMessage The user's message
 * @returns A reflection that attempts to capture meaning
 */
export const createMeaningReflection = (userMessage: string): string => {
  if (!userMessage || typeof userMessage !== 'string') {
    return "I'm here to listen. Could you share more about what's on your mind?";
  }
  
  try {
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
  } catch (error) {
    console.error("Error creating meaning reflection:", error);
    return "I'm trying to understand your experience. Could you share more about what this means to you?";
  }
};

/**
 * Creates a general reflection when specific feelings or meanings are unclear
 * @param userMessage The user's message
 * @returns A general reflection response
 */
export const createGeneralReflection = (userMessage: string): string => {
  if (!userMessage || typeof userMessage !== 'string') {
    return "I'm here to listen. Could you share more about what's on your mind?";
  }
  
  try {
    // Extract any potential context we can use
    const context = extractContext(userMessage);
    
    if (context) {
      return `I notice you mentioned ${context}. Could you tell me more about how that's affecting you?`;
    }
  } catch (error) {
    console.error("Error extracting context for general reflection:", error);
  }
  
  // Fall back to completely general reflection
  return generalReflections[Math.floor(Math.random() * generalReflections.length)];
};
