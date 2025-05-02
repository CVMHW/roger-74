
/**
 * Responses specifically designed for young adults (18-29)
 */

import { ConcernType } from '../reflection/reflectionTypes';

export interface YoungAdultConcernInfo {
  category: string;
  specificIssue?: string | null;
  severity?: 'mild' | 'moderate' | 'severe';
}

/**
 * Detect concerns specific to young adults in their mid-20s
 * @param userInput The user message to analyze
 * @returns Object with concern details
 */
export const detectYoungAdultConcerns = (userInput: string): YoungAdultConcernInfo | null => {
  if (!userInput) return null;
  
  const lowerInput = userInput.toLowerCase();
  
  // Financial concerns common to young adults
  const financialKeywords = [
    'student loan', 'college debt', 'can\'t afford', 'rent is too high', 'housing costs',
    'can\'t save', 'credit card debt', 'living paycheck', 'underpaid', 'job market',
    'entry level', 'insurance costs', 'car payment', 'medical bills'
  ];
  
  // Career concerns common to young adults
  const careerKeywords = [
    'hate my job', 'career path', 'wrong field', 'stuck at work', 'office politics',
    'bad boss', 'promotion', 'got passed over', 'interview anxiety', 'resume',
    'networking', 'professional development', 'work-life balance', 'burnout',
    'toxic workplace', 'remote work'
  ];
  
  // Relationship concerns common to young adults
  const relationshipKeywords = [
    'dating apps', 'ghosting', 'commitment issues', 'moving in together',
    'long distance', 'ex', 'broke up', 'marriage pressure', 'wedding stress',
    'in-laws', 'friends having kids', 'losing touch with friends'
  ];
  
  // Identity concerns common to young adults
  const identityKeywords = [
    'purpose in life', 'quarter life crisis', 'compare myself', 'behind in life',
    'adulting', 'growing up', 'priorities', 'life direction', 'self discovery',
    'imposter syndrome', 'social media comparison'
  ];
  
  // Check for financial concerns
  if (financialKeywords.some(word => lowerInput.includes(word))) {
    return {
      category: 'financial',
      specificIssue: financialKeywords.find(word => lowerInput.includes(word)) || null
    };
  }
  
  // Check for career concerns
  if (careerKeywords.some(word => lowerInput.includes(word))) {
    return {
      category: 'career',
      specificIssue: careerKeywords.find(word => lowerInput.includes(word)) || null
    };
  }
  
  // Check for relationship concerns
  if (relationshipKeywords.some(word => lowerInput.includes(word))) {
    return {
      category: 'relationship',
      specificIssue: relationshipKeywords.find(word => lowerInput.includes(word)) || null
    };
  }
  
  // Check for identity concerns
  if (identityKeywords.some(word => lowerInput.includes(word))) {
    return {
      category: 'identity',
      specificIssue: identityKeywords.find(word => lowerInput.includes(word)) || null
    };
  }
  
  return null;
};

/**
 * Generate responses specific to young adult (18-29) concerns
 * @param params Object containing information about the concern and message
 * @returns A response tailored to the young adult concern
 */
export const generateYoungAdultResponse = (params: {
  concernInfo: YoungAdultConcernInfo;
  userMessage: string;
  concernType?: ConcernType | null;
}): string => {
  const { concernInfo, userMessage } = params;
  
  // If we have a safety concern detected, let that take precedence
  if (params.concernType && ['crisis', 'tentative-harm', 'mental-health'].includes(params.concernType)) {
    return ""; // Return empty string to let the primary concern handler take over
  }
  
  switch (concernInfo.category) {
    case 'financial':
      return generateFinancialResponse(concernInfo.specificIssue, userMessage);
    case 'career':
      return generateCareerResponse(concernInfo.specificIssue, userMessage);
    case 'relationship':
      return generateRelationshipResponse(concernInfo.specificIssue, userMessage);
    case 'identity':
      return generateIdentityResponse(concernInfo.specificIssue, userMessage);
    default:
      return "I notice you're dealing with some challenges that many people in their twenties face. Would it help to explore what's most on your mind right now?";
  }
};

/**
 * Generate responses for financial concerns
 */
const generateFinancialResponse = (specificIssue: string | null | undefined, userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase();
  
  if (specificIssue?.includes('student loan') || lowerMessage.includes('student loan')) {
    return "Managing student loan debt can feel overwhelming, especially when you're just establishing yourself professionally. Many young adults struggle with this balance. What has been the most challenging aspect of handling your student loans?";
  }
  
  if (specificIssue?.includes('rent') || lowerMessage.includes('rent') || lowerMessage.includes('housing')) {
    return "Housing costs are a major pressure point for many people in their twenties. The gap between wages and rent can make independent living really challenging. How has this situation been affecting your daily life or decisions?";
  }
  
  if (specificIssue?.includes('save') || lowerMessage.includes('save') || lowerMessage.includes('saving')) {
    return "Building savings in your twenties can be particularly difficult with competing financial priorities. Many people feel caught between paying off debt, covering living expenses, and trying to save for the future. What savings goals feel most important to you right now?";
  }
  
  // General financial response
  return "Financial pressures can be especially intense in your twenties when you're building foundations while potentially dealing with debt, career establishment, and increasing responsibilities. What aspect of your financial situation feels most pressing right now?";
};

/**
 * Generate responses for career concerns
 */
const generateCareerResponse = (specificIssue: string | null | undefined, userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase();
  
  if (specificIssue?.includes('hate my job') || lowerMessage.includes('hate my job') || lowerMessage.includes('hate work')) {
    return "Feeling stuck in a job that doesn't feel right can be really draining. Many people in their twenties go through periods of career uncertainty or dissatisfaction. What aspects of your current work situation feel most challenging?";
  }
  
  if (specificIssue?.includes('burnout') || lowerMessage.includes('burnout') || lowerMessage.includes('exhausted from work')) {
    return "Burnout is increasingly common, especially among young professionals trying to establish themselves. Finding that balance between working hard and maintaining wellbeing can be challenging. How has this burnout been showing up for you?";
  }
  
  if (specificIssue?.includes('career path') || lowerMessage.includes('career path') || lowerMessage.includes('wrong field')) {
    return "Questioning your career path is actually a very common experience in your twenties. Many people discover that their initial career choices don't align with their evolving values or interests. What's making you reconsider your current direction?";
  }
  
  // General career response
  return "Career development comes with unique challenges in your twenties as you navigate workplace dynamics, consider your long-term path, and balance professional growth with personal wellbeing. What's been on your mind regarding your professional life?";
};

/**
 * Generate responses for relationship concerns
 */
const generateRelationshipResponse = (specificIssue: string | null | undefined, userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase();
  
  if (specificIssue?.includes('dating app') || lowerMessage.includes('dating app') || lowerMessage.includes('online dating')) {
    return "Navigating dating apps and online connections can be both exciting and exhausting. Many people find the experience doesn't always align with what they're hoping for in relationships. What has your experience been like?";
  }
  
  if (specificIssue?.includes('broke up') || lowerMessage.includes('broke up') || lowerMessage.includes('breakup')) {
    return "Breakups can be particularly challenging when you're also navigating other life transitions. It's normal to feel a complex mix of emotions during this time. How have you been coping with this change?";
  }
  
  if (specificIssue?.includes('friends') || lowerMessage.includes('losing friends') || lowerMessage.includes('friendship')) {
    return "Friendship dynamics often shift significantly during our twenties as life paths diverge - with some friends moving, starting families, or changing priorities. These transitions can feel surprising and sometimes painful. How have your friendships been evolving?";
  }
  
  // General relationship response
  return "Relationships in your twenties often involve navigating new territory - whether that's serious partnerships, changing friendships, or evolving family dynamics. What relationship area has been most on your mind lately?";
};

/**
 * Generate responses for identity concerns
 */
const generateIdentityResponse = (specificIssue: string | null | undefined, userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase();
  
  if (specificIssue?.includes('purpose') || lowerMessage.includes('purpose') || lowerMessage.includes('meaning')) {
    return "Questioning your purpose or life's meaning is actually a significant part of personal development in your twenties. Many people find themselves reevaluating what truly matters to them. What kinds of things bring you a sense of meaning when you engage with them?";
  }
  
  if (specificIssue?.includes('behind') || lowerMessage.includes('behind in life') || lowerMessage.includes('everyone else is')) {
    return "That feeling of being 'behind' compared to peers or expectations is incredibly common, though rarely discussed openly. Social media can amplify these comparisons. What specific areas make you feel this way?";
  }
  
  if (specificIssue?.includes('imposter') || lowerMessage.includes('imposter') || lowerMessage.includes('fake it')) {
    return "Imposter syndrome affects many accomplished people, especially in their twenties when taking on new professional and personal roles. That feeling that you don't belong or aren't qualified is actually very common. How has this shown up for you?";
  }
  
  // General identity response
  return "Your twenties are often a time of significant self-discovery and identity development, sometimes called a 'quarter-life crisis.' Many people navigate questions about their values, purpose, and authentic self during this time. What aspects of your identity or life direction have you been reflecting on?";
};
