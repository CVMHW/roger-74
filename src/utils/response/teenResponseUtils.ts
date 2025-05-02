
/**
 * Specialized response generation for teenage concerns
 * This module helps generate age-appropriate responses for teens
 */

import { ConcernType } from '../reflection/reflectionTypes';

interface TeenResponseParams {
  ageGroup: 'teen' | 'adult' | 'child' | null;
  concernCategory?: string;
  specificIssue?: string | null;
  userMessage: string;
}

/**
 * Generate responses for academic concerns
 * @param message User's message
 * @returns Supportive response for academic issues
 */
export const generateAcademicResponse = (message: string): string => {
  const academicResponses = [
    "It sounds like school is putting a lot of pressure on you right now. Many teens feel overwhelmed with academic expectations. What part of your school experience feels most challenging to you?",
    
    "I can hear that you're dealing with some school-related stress. It's really common to feel pressure around grades, tests, or just keeping up with everything. Would it help to talk more about what specifically feels most difficult?",
    
    "Academic pressure can feel really intense at your age - the expectations from teachers, parents, and even yourself can build up quickly. I'm here to listen if you want to talk more about what you're experiencing."
  ];
  
  return academicResponses[Math.floor(Math.random() * academicResponses.length)];
};

/**
 * Generate responses for social concerns
 * @param message User's message
 * @returns Supportive response for social issues
 */
export const generateSocialResponse = (message: string): string => {
  const socialResponses = [
    "Friend drama and social pressure can be really tough to deal with. Many teens find social relationships one of the most challenging parts of this age. Would you like to talk more about what's happening with your friends?",
    
    "It sounds like you're navigating some difficult social situations. Friendships and peer relationships can get complicated, and it's normal to feel confused or hurt sometimes. What's been going on with your social circle lately?",
    
    "Social connections are so important, and it can be really hard when there's conflict or you're feeling left out. I'm here to listen if you want to share more about what you're experiencing with your friends or classmates."
  ];
  
  return socialResponses[Math.floor(Math.random() * socialResponses.length)];
};

/**
 * Generate responses for identity concerns
 * @param message User's message
 * @returns Supportive response for identity issues
 */
export const generateIdentityResponse = (message: string): string => {
  const identityResponses = [
    "Figuring out who you are and what you believe in is a huge part of being a teenager. It's completely normal to have questions about your identity, values, or future. What aspects of this journey feel most confusing right now?",
    
    "Many teens describe this time in life as one big question mark - questions about who you are, what you believe, and where you're headed. These are important questions to explore. What's been on your mind about your identity or future?",
    
    "It takes courage to explore questions about who you are and what matters to you. This is actually one of the most important parts of being a teenager - starting to define yourself on your own terms. What parts of your identity are you thinking about lately?"
  ];
  
  return identityResponses[Math.floor(Math.random() * identityResponses.length)];
};

/**
 * Generate responses for family concerns
 * @param message User's message
 * @returns Supportive response for family issues
 */
export const generateFamilyResponse = (message: string): string => {
  const familyResponses = [
    "Family relationships can get complicated during the teen years. Many people your age feel caught between wanting independence and still needing family support. What's been happening with your family situation?",
    
    "I hear that there might be some tension or challenges with your family right now. That's actually very common - this is a time when many teens start redefining their relationship with parents and family. Would you like to talk more about what's going on at home?",
    
    "Navigating family relationships as a teen can be really challenging. You're growing and changing, and sometimes parents or other family members have trouble adjusting to that. What's been most difficult about your family dynamics lately?"
  ];
  
  return familyResponses[Math.floor(Math.random() * familyResponses.length)];
};

/**
 * Generates age-appropriate responses for teen concerns
 */
export const generateTeenResponse = (params: TeenResponseParams): string => {
  const { ageGroup, concernCategory, specificIssue, userMessage } = params;
  
  // If not a teen or no clear category, return a general teen-friendly response
  if (ageGroup !== 'teen' || !concernCategory) {
    return "Thanks for sharing that with me. Being a teenager comes with a lot of unique challenges. I'm here to listen if you want to talk more about what's on your mind.";
  }
  
  // Generate category-specific responses
  switch (concernCategory) {
    case 'teen_academic':
      return generateAcademicResponse(userMessage);
    case 'teen_social':
      return generateSocialResponse(userMessage);
    case 'teen_identity':
      return generateIdentityResponse(userMessage);
    case 'teen_family':
      return generateFamilyResponse(userMessage);
    case 'mental_health':
      return "It sounds like you might be dealing with some difficult emotions or thoughts right now. Many teens go through periods of feeling overwhelmed, anxious, or down. Would it help to talk more about what you're experiencing?";
    case 'physical_health':
      return "Physical changes and health concerns are a big part of being a teenager. Your body is going through a lot right now, and it's normal to have questions or concerns. Would you like to share more about what's on your mind?";
    default:
      return "Thanks for sharing that with me. The teenage years can bring up all kinds of questions and challenges. I'm here to listen if you want to talk more about what's going on.";
  }
};

/**
 * Check if a message likely comes from a teen based on content analysis
 */
export const isLikelyTeenMessage = (message: string): boolean => {
  if (!message) return false;
  
  const lowerMessage = message.toLowerCase();
  
  // Age indicators
  const teenAgeIndicators = [
    'im 16', "i'm 16", 'im 15', "i'm 15", 'im 17', "i'm 17", 'im 14', "i'm 14",
    'im 18', "i'm 18", '16 year old', '16 years old', '16yo', '16-year-old', '16 yr old',
    'high school', 'sophomore', 'junior', 'teenager', 'teen'
  ];
  
  // Teen-specific contexts
  const teenContexts = [
    'my parents', 'my mom', 'my dad', 'my teacher', 'high school',
    'homework', 'grade', 'class', 'popular', 'crush', 'prom', 'homecoming'
  ];
  
  // Check for direct age indicators
  for (const indicator of teenAgeIndicators) {
    if (lowerMessage.includes(indicator)) {
      return true;
    }
  }
  
  // Check for multiple teen contexts
  let contextMatches = 0;
  for (const context of teenContexts) {
    if (lowerMessage.includes(context)) {
      contextMatches++;
    }
  }
  
  // If multiple teen context markers are found, likely a teen
  return contextMatches >= 2;
};
