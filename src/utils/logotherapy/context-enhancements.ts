
/**
 * Age and culturally appropriate meaning enhancements
 */

/**
 * Get a culturally and age-appropriate meaning enhancement
 */
export const getAppropriateEnhancement = (userInput: string): string => {
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
export const getChildAppropriateEnhancement = (): string => {
  const enhancements = [
    "The things that make you smile or feel proud can tell you what's special about you.",
    "When you help others or create something, it can make you feel really good inside.",
    "The way you handle tough situations shows your unique strengths.",
    "Everyone has special talents that help them make a difference in their own way.",
    "The activities you enjoy most might be clues to what makes you unique."
  ];
  
  return enhancements[Math.floor(Math.random() * enhancements.length)];
};

export const getTeenAppropriateEnhancement = (): string => {
  const enhancements = [
    "Finding what genuinely matters to you, beyond what others expect, is part of discovering who you are.",
    "Your unique perspective and voice matter in ways you might not even realize yet.",
    "The challenges you face now are helping shape your values and what you stand for.",
    "Sometimes the activities that feel most meaningful give us clues about our future path.",
    "Your unique contribution to the world might start with what you're passionate about right now."
  ];
  
  return enhancements[Math.floor(Math.random() * enhancements.length)];
};

export const getProfessionalEnhancement = (): string => {
  const enhancements = [
    "Connecting your daily work to your core values often reveals deeper purpose in professional life.",
    "Even routine tasks can gain meaning when they align with what you fundamentally value.",
    "Finding purpose often involves seeing how your work connects to something larger than yourself.",
    "Your unique professional contributions reflect values that are important to you.",
    "Work becomes more fulfilling when it expresses your authentic strengths and values."
  ];
  
  return enhancements[Math.floor(Math.random() * enhancements.length)];
};

export const getElderlyAppropriateEnhancement = (): string => {
  const enhancements = [
    "The wisdom you've gained through life's experiences offers unique value to others.",
    "Your life story and the legacy you create reflect what has mattered most to you.",
    "The meaning we find in later chapters of life often connects to how we've influenced others.",
    "Your journey and the values you've lived by continue to create ripples of meaning.",
    "The perspective gained through life's journey offers unique insights about what truly matters."
  ];
  
  return enhancements[Math.floor(Math.random() * enhancements.length)];
};

export const getSpiritualEnhancement = (): string => {
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
export const getGeneralMeaningEnhancement = (): string => {
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
