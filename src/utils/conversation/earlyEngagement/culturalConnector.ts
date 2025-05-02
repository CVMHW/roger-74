
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
  },
  {
    category: "socioeconomic_sensitive",
    topics: ["community_resources", "local_activities", "accessible_entertainment", "practical_skills"]
  }
];

/**
 * Socioeconomic background indicators for culturally sensitive interaction
 * NOTE: These are used only to tailor conversation style, never to stereotype
 */
const socioeconomicIndicators = {
  blueCollar: [
    /work|job|shift|boss|coworkers|factory|construction|trade|tools|manual|labor/i,
    /plant|site|overtime|union|contractor|truck|machine|equipment|safety/i
  ],
  lowerEducation: [
    /didn't finish|dropped out|hard to understand|confusing|big words|school was tough/i,
    /learn better by doing|hands-on|practical|real world|street smart/i
  ],
  financialStress: [
    /expensive|afford|cost|price|money|budget|bills|debt|insurance/i,
    /cheap|discount|sale|pay|payment|coverage|copay/i
  ]
};

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
  
  // Check for socioeconomic indicators
  const isLikelyBlueCollar = socioeconomicIndicators.blueCollar.some(pattern => pattern.test(userInput));
  const isLikelyLowerEducation = socioeconomicIndicators.lowerEducation.some(pattern => pattern.test(userInput));
  const hasFinancialStressCues = socioeconomicIndicators.financialStress.some(pattern => pattern.test(userInput));
  
  // Prioritize connection prompts
  if (hasLocalReference) {
    return generateLocalConnectionPrompt(developmentalStage);
  }
  
  if (isLikelyBlueCollar) {
    return generateBlueCollarConnectionPrompt(developmentalStage);
  }
  
  if (hasGenerationalReference) {
    return generateGenerationalConnectionPrompt(developmentalStage);
  }
  
  if (isLikelyLowerEducation) {
    return generateAccessibleConnectionPrompt(developmentalStage);
  }
  
  if (hasFinancialStressCues) {
    return generateFinancialSensitivePrompt(developmentalStage);
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
      "Do you follow any of our local sports teams?",
      "Have you tried any cool spots for ice cream or pizza around here?"
    ];
    return childLocalPrompts[Math.floor(Math.random() * childLocalPrompts.length)];
  }
  
  // Adult-appropriate local prompts
  const adultLocalPrompts = [
    "Have you lived in the Cleveland area for long?",
    "Do you have any favorite spots in Cleveland that you enjoy?",
    "Cleveland has changed quite a bit over the years. What's your experience been like here?",
    "This Cleveland weather keeps us on our toes, doesn't it? How has it been affecting your week?",
    "The community centers around here offer some pretty cool stuff. Have you checked any of them out?"
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
      "Has anything exciting happened for you recently?",
      "What's something you enjoy that most adults don't get?"
    ];
    return childGenerationalPrompts[Math.floor(Math.random() * childGenerationalPrompts.length)];
  }
  
  // Young adult prompts
  if (developmentalStage === 'young_adult') {
    const youngAdultPrompts = [
      "What kinds of activities do you enjoy in your free time?",
      "Have you discovered any interesting places since you've been in Cleveland?",
      "What's been keeping you busy these days?",
      "Have you found any good spots around town to relax or enjoy yourself?",
      "Any music or shows you've been into lately?"
    ];
    return youngAdultPrompts[Math.floor(Math.random() * youngAdultPrompts.length)];
  }
  
  // Adult prompts
  const adultPrompts = [
    "Outside of work and other responsibilities, do you have any activities you particularly enjoy?",
    "Have you found any good balance between your various commitments lately?",
    "What aspects of life in this area have you found most agreeable?",
    "Has anything interesting or new been happening in your world recently?",
    "What's something you do to unwind after a long day?"
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
      "If you could visit anywhere, where would you want to go?",
      "What's something cool you've learned recently?"
    ];
    return childUniversalPrompts[Math.floor(Math.random() * childUniversalPrompts.length)];
  }
  
  // Adult universal prompts
  const adultUniversalPrompts = [
    "What kinds of activities or hobbies do you find most enjoyable?",
    "Are there particular things that help you relax when life gets busy?",
    "What's something you're looking forward to in the coming weeks?",
    "Has there been anything that's brought you a sense of satisfaction lately?",
    "What's something you enjoy that not many people know about?"
  ];
  return adultUniversalPrompts[Math.floor(Math.random() * adultUniversalPrompts.length)];
};

/**
 * Generates blue-collar and working-class appropriate connection prompts
 */
const generateBlueCollarConnectionPrompt = (developmentalStage: string | undefined): string => {
  // Youth-appropriate prompts
  if (developmentalStage === 'child' || developmentalStage === 'adolescent') {
    return "Do you have any hobbies or activities you enjoy outside of school?";
  }
  
  const blueCollarPrompts = [
    "What kind of work do you do? Sounds like you're probably good at practical problem-solving.",
    "Do you have any projects or things you enjoy working on outside of your job?",
    "What's something you've fixed or built that you're proud of?",
    "Any good spots around here where you like to grab a bite after work?",
    "What's a skill you've picked up that's come in really handy?"
  ];
  
  return blueCollarPrompts[Math.floor(Math.random() * blueCollarPrompts.length)];
};

/**
 * Generates accessible connection prompts for those who may have less formal education
 */
const generateAccessibleConnectionPrompt = (developmentalStage: string | undefined): string => {
  // Youth-appropriate prompts
  if (developmentalStage === 'child' || developmentalStage === 'adolescent') {
    return "What's something you're really good at that most people don't know about?";
  }
  
  const accessiblePrompts = [
    "What's something you're really good at in everyday life?",
    "Have you found any good places to hang out around the neighborhood?",
    "What's something you've learned just from life experience that's been valuable?",
    "Do you have any skills or talents that you've picked up over the years?",
    "What's something you enjoy doing when you have some free time?"
  ];
  
  return accessiblePrompts[Math.floor(Math.random() * accessiblePrompts.length)];
};

/**
 * Generates financial-stress sensitive prompts that avoid assumptions
 */
const generateFinancialSensitivePrompt = (developmentalStage: string | undefined): string => {
  // Avoid financial topics with youth
  if (developmentalStage === 'child' || developmentalStage === 'adolescent') {
    return generateUniversalConnectionPrompt(developmentalStage);
  }
  
  const financialSensitivePrompts = [
    "What activities do you enjoy that help you recharge?",
    "Have you discovered any good community resources or events in the area?",
    "What's something simple that brings you joy in your day-to-day life?",
    "Is there something you've been wanting to try or learn more about?",
    "What's a skill you have that most people might not realize?"
  ];
  
  return financialSensitivePrompts[Math.floor(Math.random() * financialSensitivePrompts.length)];
};

/**
 * Generates a simple, direct question that avoids complex language or phrasing
 */
export const generateSimplifiedQuestion = (messageCount: number): string => {
  const simplifiedQuestions = [
    "What's been on your mind lately?",
    "How's your day going so far?",
    "What do you like to do when you're not here?",
    "Got any questions about meeting with Dr. Eric?",
    "What's something good that happened this week?",
    "Is there anything specific bothering you right now?",
    "What helps you feel better when life gets tough?",
    "Have you been to this office before?"
  ];
  
  // Ensure we don't repeat questions
  const questionIndex = (messageCount % simplifiedQuestions.length);
  return simplifiedQuestions[questionIndex];
};

