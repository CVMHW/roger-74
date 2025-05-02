
/**
 * Cultural Connector Utilities
 * 
 * Tools for establishing cultural rapport in early conversations
 * without making assumptions or overstepping boundaries
 */

import { detectDevelopmentalStage } from '../../reflection/reflectionStrategies';

/**
 * Cultural connection topics that can be used to establish rapport
 */
const culturalConnectionTopics = [
  {
    category: "cleveland_local",
    topics: ["weather", "sports", "local_events", "neighborhoods", "food_scene"]
  },
  {
    category: "generational",
    topics: ["technology", "music", "entertainment", "education", "work_life"]
  },
  {
    category: "universal",
    topics: ["family", "hobbies", "travel", "health", "learning"]
  }
];

/**
 * Generates a culturally sensitive connection question based on detected patterns
 * without making assumptions or stereotyping
 */
export const generateCulturalConnectionPrompt = (
  userInput: string,
  messageCount: number
): string | null => {
  // Only use in early conversation
  if (messageCount > 10) return null;
  
  // Detect developmental stage for age-appropriate connections
  const developmentalStage = detectDevelopmentalStage(userInput);
  
  // Look for cultural indicators
  const hasLocalReference = /cleveland|ohio|midwest|lake erie|cuyahoga|rock hall|browns|guardians|cavs/i.test(userInput);
  const hasGenerationalReference = /school|college|work|retirement|kids|children|parents/i.test(userInput);
  
  if (hasLocalReference) {
    return generateLocalConnectionPrompt(developmentalStage);
  }
  
  if (hasGenerationalReference) {
    return generateGenerationalConnectionPrompt(developmentalStage);
  }
  
  // If no specific cultural markers, only use universal prompts in very early messages
  if (messageCount <= 5) {
    return generateUniversalConnectionPrompt(developmentalStage);
  }
  
  return null;
};

/**
 * Generates Cleveland-specific connection prompts
 */
const generateLocalConnectionPrompt = (developmentalStage: string | undefined): string => {
  // Child-appropriate local prompts
  if (developmentalStage === 'child' || developmentalStage === 'adolescent') {
    const childLocalPrompts = [
      "Do you have a favorite place to visit in Cleveland?",
      "Have you been to the Cleveland zoo or aquarium?",
      "What do you like most about living in this area?",
      "Do you follow any of our local sports teams?"
    ];
    return childLocalPrompts[Math.floor(Math.random() * childLocalPrompts.length)];
  }
  
  // Adult-appropriate local prompts
  const adultLocalPrompts = [
    "Have you lived in the Cleveland area for long?",
    "Do you have any favorite spots in Cleveland that you enjoy?",
    "Cleveland has changed quite a bit over the years. What's your experience been like here?",
    "This Cleveland weather keeps us on our toes, doesn't it? How has it been affecting your week?"
  ];
  return adultLocalPrompts[Math.floor(Math.random() * adultLocalPrompts.length)];
};

/**
 * Generates age-appropriate generational connection prompts
 */
const generateGenerationalConnectionPrompt = (developmentalStage: string | undefined): string => {
  // Child-appropriate generational prompts
  if (developmentalStage === 'child' || developmentalStage === 'adolescent') {
    const childGenerationalPrompts = [
      "What kinds of activities do you enjoy doing after school?",
      "Do you have any favorite games or hobbies?",
      "What subjects in school do you find most interesting?",
      "Has anything exciting happened for you recently?"
    ];
    return childGenerationalPrompts[Math.floor(Math.random() * childGenerationalPrompts.length)];
  }
  
  // Young adult prompts
  if (developmentalStage === 'young_adult') {
    const youngAdultPrompts = [
      "What kinds of activities do you enjoy in your free time?",
      "Have you discovered any interesting places since you've been in Cleveland?",
      "What's been keeping you busy these days?",
      "Have you found any good spots around town to relax or enjoy yourself?"
    ];
    return youngAdultPrompts[Math.floor(Math.random() * youngAdultPrompts.length)];
  }
  
  // Adult prompts
  const adultPrompts = [
    "Outside of work and other responsibilities, do you have any activities you particularly enjoy?",
    "Have you found any good balance between your various commitments lately?",
    "What aspects of life in this area have you found most agreeable?",
    "Has anything interesting or new been happening in your world recently?"
  ];
  return adultPrompts[Math.floor(Math.random() * adultPrompts.length)];
};

/**
 * Generates universal connection prompts that work across cultural backgrounds
 */
const generateUniversalConnectionPrompt = (developmentalStage: string | undefined): string => {
  // Child-appropriate universal prompts
  if (developmentalStage === 'child' || developmentalStage === 'adolescent') {
    const childUniversalPrompts = [
      "What kinds of things make you happy?",
      "Do you have any favorite animals or creatures?",
      "What do you enjoy doing for fun?",
      "If you could visit anywhere, where would you want to go?"
    ];
    return childUniversalPrompts[Math.floor(Math.random() * childUniversalPrompts.length)];
  }
  
  // Adult universal prompts
  const adultUniversalPrompts = [
    "What kinds of activities or hobbies do you find most enjoyable?",
    "Are there particular things that help you relax when life gets busy?",
    "What's something you're looking forward to in the coming weeks?",
    "Has there been anything that's brought you a sense of satisfaction lately?"
  ];
  return adultUniversalPrompts[Math.floor(Math.random() * adultUniversalPrompts.length)];
};
