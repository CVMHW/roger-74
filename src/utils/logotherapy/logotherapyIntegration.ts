/**
 * Logotherapy Integration Module
 * 
 * Integrates Viktor Frankl's logotherapy with Roger's core systems
 * UNIVERSAL LAW: All of Roger's systems must incorporate meaning and purpose
 */

import { generateLogotherapyResponse } from './logotherapyResponses';
import { PersonalityMode, getRandomPersonality } from '../response/spontaneityGenerator';
import { getContextualMemory } from '../nlpProcessor';
import { getFiveResponseMemory } from '../memory/fiveResponseMemory';
import { retrieveRelevantMemories } from '../memory/memoryBank';
import { UNIVERSAL_LAW_MEMORY } from '../masterRules/universalLaws';

// Interface for memory entries to fix TypeScript errors
interface MemoryEntry {
  content: string;
  type: string;
  timestamp: number;
  importance: number;
}

interface MessageEntry {
  sender: string;
  content: string;
  timestamp?: number;
}

/**
 * Integrate logotherapy into the adaptive response system
 * Called when meaning/purpose themes are detected in user input
 */
export const integrateLogotherapyResponse = (
  userInput: string,
  baseResponse: string,
  personalityMode: PersonalityMode = getRandomPersonality()
): string => {
  // Generate a pure logotherapy-based response
  const logotherapyResponse = generateLogotherapyResponse(userInput);
  
  // Leverage memory systems for more personalized response
  const memories = leverageMemorySystems(userInput);
  
  // Determine integration approach based on response length and content
  if (baseResponse.length < 100) {
    // For shorter responses, simply append the logotherapy perspective
    return `${baseResponse} ${incorporateMemories(logotherapyResponse, memories)}`;
  } else {
    // For longer responses, blend the perspectives
    return blendResponses(baseResponse, logotherapyResponse, personalityMode, memories);
  }
};

/**
 * Leverage all memory systems for enhanced personalization
 */
const leverageMemorySystems = (userInput: string): string[] => {
  console.log("UNIVERSAL LAW COMPLIANCE: Leveraging memory systems for meaning enhancement", 
              UNIVERSAL_LAW_MEMORY.name);
  
  const memories: string[] = [];
  
  try {
    // Check FiveResponseMemory for recent context
    const fiveResponseMemory = getFiveResponseMemory();
    if (fiveResponseMemory.length > 0) {
      // Type safety: We need to check if these entries have a sender property
      // before treating them as MessageEntry objects
      const validMessageEntries = fiveResponseMemory.filter(
        (msg): msg is MessageEntry => 'sender' in msg && typeof msg.sender === 'string'
      );
      
      // Extract relevant patient statements from 5ResponseMemory
      const patientStatements = validMessageEntries
        .filter(msg => msg.sender === 'patient')
        .map(msg => msg.content);
      
      if (patientStatements.length > 0) {
        memories.push(patientStatements[Math.floor(Math.random() * patientStatements.length)]);
      }
    }
    
    // Check MemoryBank for deeper context
    const relevantMemories = retrieveRelevantMemories(userInput);
    if (relevantMemories.length > 0) {
      memories.push(relevantMemories[0].content);
    }
    
    // Check primary memory system
    const contextualMemory = getContextualMemory(userInput);
    if (contextualMemory.dominantTopics && contextualMemory.dominantTopics.length > 0) {
      memories.push(contextualMemory.dominantTopics[0]);
    }
  } catch (error) {
    console.error('Error accessing memory systems in logotherapy integration:', error);
  }
  
  return memories;
};

/**
 * Incorporate memories into logotherapy response
 */
const incorporateMemories = (response: string, memories: string[]): string => {
  if (!memories || memories.length === 0) return response;
  
  const memory = memories[Math.floor(Math.random() * memories.length)];
  
  // Avoid direct reference if the memory content isn't substantive
  if (!memory || memory.length < 5) return response;
  
  const memoryReferences = [
    `This connects to what you shared earlier about ${memory.substring(0, 15)}...`,
    `I remember you mentioned ${memory.substring(0, 15)}... which relates to this idea of meaning.`,
    `Considering what you said about ${memory.substring(0, 15)}..., this perspective might be helpful.`,
    `This meaning-centered approach seems relevant to your experience with ${memory.substring(0, 15)}...`
  ];
  
  const reference = memoryReferences[Math.floor(Math.random() * memoryReferences.length)];
  
  // Insert the memory reference at a natural point in the response
  const sentences = response.split(/(?<=[.?!])\s+/);
  
  if (sentences.length <= 2) {
    return `${reference} ${response}`;
  }
  
  const insertPoint = Math.floor(sentences.length / 2);
  const firstPart = sentences.slice(0, insertPoint).join(' ');
  const secondPart = sentences.slice(insertPoint).join(' ');
  
  return `${firstPart} ${reference} ${secondPart}`;
};

/**
 * Blend a base response with logotherapy perspective
 */
const blendResponses = (
  baseResponse: string, 
  logotherapyResponse: string, 
  personalityMode: PersonalityMode,
  memories: string[] = []
): string => {
  // Extract key sentences/parts from each response
  const baseSentences = baseResponse.split(/(?<=[.?!])\s+/);
  const logoSentences = logotherapyResponse.split(/(?<=[.?!])\s+/);
  
  // Get transition phrases appropriate for personality
  const transitions = getLogotherapyTransitions(personalityMode);
  const transition = transitions[Math.floor(Math.random() * transitions.length)];
  
  // Select a key insight from the logotherapy response
  const keyLogoSentence = logoSentences[Math.floor(Math.random() * logoSentences.length)];
  
  // Add memory-enhanced content if available
  const memoryEnhancement = memories.length > 0 ? 
    ` I remember you mentioned ${memories[0].substring(0, 15)}... which relates to this.` : '';
  
  // Create a blended response based on length
  if (baseSentences.length <= 2) {
    // For very short base responses, add logotherapy perspective after
    return `${baseResponse} ${transition} ${keyLogoSentence}${memoryEnhancement}`;
  } else {
    // For longer responses, insert logotherapy perspective before conclusion
    const openingPart = baseSentences.slice(0, Math.ceil(baseSentences.length * 0.7)).join(' ');
    const closingPart = baseSentences.slice(Math.ceil(baseSentences.length * 0.7)).join(' ');
    
    return `${openingPart} ${transition} ${keyLogoSentence}${memoryEnhancement} ${closingPart}`;
  }
};

/**
 * Get appropriate transitions for blending logotherapy insights
 */
const getLogotherapyTransitions = (personalityMode: PersonalityMode): string[] => {
  const commonTransitions = [
    "Looking at this through the lens of meaning and purpose,",
    "Considering how this relates to what gives your life meaning,",
    "Thinking about the deeper purpose behind this,",
    "From a meaning-centered perspective,",
    "When we consider the importance of meaning in our lives,"
  ];
  
  // Get mode-specific transitions
  const modeTransitions: Record<PersonalityMode, string[]> = {
    'curious': [
      "I wonder how this connects to your search for meaning?",
      "What if we explored how this relates to your deeper purpose?"
    ],
    'empathetic': [
      "I sense this might connect to your deeper search for meaning.",
      "These feelings often relate to our need for purpose and meaning."
    ],
    'reflective': [
      "Reflecting on how this relates to your life's meaning,",
      "Taking a step back to see how this connects to your values and purpose,"
    ],
    'direct': [
      "This directly connects to your search for meaning by",
      "Looking at the purpose behind this situation,"
    ],
    'analytical': [
      "Analyzing how this connects to meaning and purpose,",
      "When we break down how this relates to your values,"
    ],
    'warm': [
      "I appreciate how this journey relates to your search for meaning.",
      "It's meaningful to see how this connects to your deeper purpose."
    ],
    'thoughtful': [
      "I've been thinking about how this relates to your life's meaning.",
      "This reminds me of how we all search for purpose in our experiences."
    ],
    'conversational': [
      "You know, this really connects to finding meaning in your situation.",
      "So, this actually ties into your deeper purpose in an interesting way."
    ],
    'gentle': [
      "Perhaps we might consider how this relates to your search for meaning.",
      "Maybe there's a connection here to your deeper values and purpose."
    ],
    'grounded': [
      "Based on what you've shared, this clearly connects to your values and purpose.",
      "From a practical perspective, this relates to finding meaning by"
    ],
    'existential': [
      "This existential situation invites us to consider your deeper purpose.",
      "The meaning dimension of this experience suggests"
    ],
    'meaning-focused': [
      "Through the lens of meaning and purpose,",
      "Considering the deeper values at play here,"
    ]
  };
  
  // Combine common with mode-specific transitions
  const allTransitions = [...commonTransitions];
  
  // Add mode-specific transitions if available
  if (modeTransitions[personalityMode]) {
    allTransitions.push(...modeTransitions[personalityMode]);
  }
  
  return allTransitions;
};

/**
 * Enhance any response with a meaning-oriented perspective
 * Used as a universal rule to ensure meaning integration
 * Now with age/cultural appropriateness checks
 */
export const enhanceWithMeaningPerspective = (
  response: string,
  userInput: string
): string => {
  // Check if response already has meaning-oriented language
  if (hasMeaningOrientation(response)) {
    return response;
  }
  
  // Detect appropriate enhancement based on user input context
  const enhancement = getAppropriateEnhancement(userInput);
  
  // Add the enhancement at an appropriate point in the response
  const sentences = response.split(/(?<=[.?!])\s+/);
  
  if (sentences.length <= 2) {
    // For short responses, simply append
    return `${response} ${enhancement}`;
  } else {
    // For longer responses, insert before conclusion
    const insertPoint = Math.max(Math.floor(sentences.length * 0.75), sentences.length - 2);
    
    const beginning = sentences.slice(0, insertPoint).join(' ');
    const end = sentences.slice(insertPoint).join(' ');
    
    return `${beginning} ${enhancement} ${end}`;
  }
};

// Export this function explicitly for use in universalLaws.ts
export const enhanceWithLogotherapyPerspective = enhanceWithMeaningPerspective;

/**
 * Check if a response already has meaning-oriented language
 */
const hasMeaningOrientation = (response: string): boolean => {
  const meaningWords = [
    'meaning', 'purpose', 'value', 'values', 'meaningful', 'purposeful',
    'contribution', 'legacy', 'transcend', 'significance', 'calling',
    'mission', 'fulfillment', 'authentic', 'genuine', 'worthy'
  ];
  
  const lowerResponse = response.toLowerCase();
  
  return meaningWords.some(word => lowerResponse.includes(word));
};

/**
 * Get a culturally and age-appropriate meaning enhancement
 */
const getAppropriateEnhancement = (userInput: string): string => {
  // Detect language and cultural indicators from user input
  const hasChildIndicators = /school|homework|parents|mom|dad|teacher|game|play/i.test(userInput);
  const hasTeenIndicators = /college|university|friends|social|dating|career|school|homework|teacher/i.test(userInput);
  const hasProfessionalIndicators = /work|career|colleague|office|business|professional|job/i.test(userInput);
  const hasElderlyIndicators = /retirement|grandchildren|aging|health|memory|legacy/i.test(userInput);
  const hasSpiritualIndicators = /faith|god|religion|spiritual|belief|pray|meditation/i.test(userInput);
  
  // Select an appropriate enhancement based on detected indicators
  if (hasChildIndicators) {
    return getChildAppropriateEnhancement();
  } else if (hasTeenIndicators) {
    return getTeenAppropriateEnhancement();
  } else if (hasProfessionalIndicators) {
    return getProfessionalEnhancement();
  } else if (hasElderlyIndicators) {
    return getElderlyAppropriateEnhancement();
  } else if (hasSpiritualIndicators) {
    return getSpiritualEnhancement();
  }
  
  // Default to general enhancements
  return getGeneralMeaningEnhancement();
};

/**
 * Age and culturally appropriate meaning enhancements
 */
const getChildAppropriateEnhancement = (): string => {
  const enhancements = [
    "The things that make you smile or feel proud can tell you what's special about you.",
    "When you help others or create something, it can make you feel really good inside.",
    "The way you handle tough situations shows your unique strengths.",
    "Everyone has special talents that help them make a difference in their own way.",
    "The activities you enjoy most might be clues to what makes you unique."
  ];
  
  return enhancements[Math.floor(Math.random() * enhancements.length)];
};

const getTeenAppropriateEnhancement = (): string => {
  const enhancements = [
    "Finding what genuinely matters to you, beyond what others expect, is part of discovering who you are.",
    "Your unique perspective and voice matter in ways you might not even realize yet.",
    "The challenges you face now are helping shape your values and what you stand for.",
    "Sometimes the activities that feel most meaningful give us clues about our future path.",
    "Your unique contribution to the world might start with what you're passionate about right now."
  ];
  
  return enhancements[Math.floor(Math.random() * enhancements.length)];
};

const getProfessionalEnhancement = (): string => {
  const enhancements = [
    "Connecting your daily work to your core values often reveals deeper purpose in professional life.",
    "Even routine tasks can gain meaning when they align with what you fundamentally value.",
    "Finding purpose often involves seeing how your work connects to something larger than yourself.",
    "Your unique professional contributions reflect values that are important to you.",
    "Work becomes more fulfilling when it expresses your authentic strengths and values."
  ];
  
  return enhancements[Math.floor(Math.random() * enhancements.length)];
};

const getElderlyAppropriateEnhancement = (): string => {
  const enhancements = [
    "The wisdom you've gained through life's experiences offers unique value to others.",
    "Your life story and the legacy you create reflect what has mattered most to you.",
    "The meaning we find in later chapters of life often connects to how we've influenced others.",
    "Your journey and the values you've lived by continue to create ripples of meaning.",
    "The perspective gained through life's journey offers unique insights about what truly matters."
  ];
  
  return enhancements[Math.floor(Math.random() * enhancements.length)];
};

const getSpiritualEnhancement = (): string => {
  const enhancements = [
    "Our spiritual beliefs often guide us toward what gives life its deepest meaning.",
    "Connecting with something greater than ourselves can illuminate our unique purpose.",
    "Many find that their faith provides a framework for understanding life's meaning.",
    "Spiritual practices often help us connect with what matters most in our lives.",
    "The values central to your spiritual beliefs can guide you toward meaningful choices."
  ];
  
  return enhancements[Math.floor(Math.random() * enhancements.length)];
};

/**
 * General meaning enhancements (default)
 */
const getGeneralMeaningEnhancement = (): string => {
  const enhancements = [
    "This experience might reveal something about what matters most to you.",
    "How we respond to situations like this often reflects our deeper values.",
    "These moments often connect to our search for what gives life meaning.",
    "Finding your authentic response to this situation can reveal your unique purpose.",
    "The meaning we find in these experiences often comes from how they connect to our values.",
    "Sometimes these situations invite us to reflect on what gives our lives purpose.",
    "The way forward often becomes clearer when we connect with what matters most to us.",
    "Our responses to challenges often reveal what we truly value.",
    "Finding meaning in this situation might involve connecting it to your larger life purpose.",
    "What makes experiences meaningful is often how they connect to what we value most."
  ];
  
  return enhancements[Math.floor(Math.random() * enhancements.length)];
};
