
/**
 * Utilities for generating responses to specific concerns
 */

// Import the teen response utilities
import { isLikelyTeenMessage, generateTeenResponse } from './response/teenResponseUtils';
import { detectCommonProblems } from './detectionUtils/problemDetection';

// Export existing functions
export * from './responseUtils/petHealthResponses';

// Function to generate de-escalation response for defensive reactions
export const generateDeescalationResponse = (
  reactionType: 'denial' | 'anger' | 'bargaining' | 'minimization',
  suggestedConcern: string
): string => {
  switch (reactionType) {
    case 'denial':
      return `I understand that labels or diagnoses can sometimes feel uncomfortable. It's completely okay to see your experiences in your own way. I'm here to listen and support you however feels right for you.`;
    case 'anger':
      return `I can hear that you feel frustrated by what might seem like oversimplification of your experience. Your feelings and perspective are valid, and I apologize if I've missed something important. I'm here to listen more carefully to what you're going through.`;
    case 'bargaining':
      return `I understand that you're looking for specific solutions rather than focusing on labels or diagnoses. Let's shift our conversation to what you feel would be most helpful right now.`;
    case 'minimization':
      return `I hear you saying that this might not be as serious as it sounds. It's completely up to you how to view your experiences, and I respect your perspective. I'm here to support you in whatever way feels most helpful.`;
    default:
      return `I appreciate you sharing your thoughts on this. Your perspective is what matters most, and I'm here to support you in whatever way feels right to you.`;
  }
};

// PTSD response functions
export const getPTSDMessage = (userMessage: string): string => {
  // Check if this is likely a teen message
  if (isLikelyTeenMessage(userMessage)) {
    return "I notice you're describing some intense reactions that can sometimes follow really difficult experiences. Many teens experience these kinds of responses after something scary or overwhelming happens. Would it help to talk more about what you're going through?";
  }
  
  // Standard adult PTSD message
  return "I notice you're describing some responses that can follow traumatic experiences. Many people develop these kinds of reactions after difficult events, and there are effective ways to work through them. Would you like to share more about what you're experiencing?";
};

export const getMildPTSDResponse = (userMessage: string): string => {
  // Check if this is likely a teen message
  if (isLikelyTeenMessage(userMessage)) {
    return "I notice that certain situations seem to bring up strong feelings or reactions for you. This is actually very common, especially for teens who've gone through difficult experiences. Our minds and bodies develop protective responses that can continue even when we're safe. Would it help to talk about what kinds of things might help you feel more grounded when these reactions happen?";
  }
  
  return "I'm hearing that you experience strong reactions in certain situations. This is actually very common after difficult life experiences - our minds and bodies develop protective responses that can continue even when we're safe. Would it help to explore what happens for you in these moments?";
};

export const getTraumaResponseMessage = (userMessage: string): string => {
  // Check if this is likely a teen message
  if (isLikelyTeenMessage(userMessage)) {
    return "The reactions you're describing make a lot of sense given what you've experienced. Our bodies and minds have natural ways of trying to protect us after something difficult happens. For many teens, understanding these responses can be a relief. Would it help to talk more about what you notice happening for you?";
  }
  
  return "The responses you're describing are actually normal reactions to abnormal events. Our nervous systems are designed to protect us, and they can continue these protective patterns even after danger has passed. Many people find it helpful to understand these reactions as survival responses rather than something 'wrong' with them. Would you like to explore this more?";
};

// Export other utility functions
export const getCrisisMessage = (userMessage: string): string => {
  // Check if this is likely a teen message
  if (isLikelyTeenMessage(userMessage)) {
    return "I notice that you're going through something really difficult right now. It takes courage to talk about these feelings. Many teens face similar struggles, and there are people who can help. Would you feel comfortable talking more about what's going on?";
  }
  
  // Standard adult crisis message
  return "I can hear that you're going through a really difficult time right now. Many people experience moments of crisis, and it's important to know that help is available. Would you like to talk more about what's happening?";
};

export const getMedicalConcernMessage = (userMessage: string): string => {
  // Check if this is likely a teen message
  if (isLikelyTeenMessage(userMessage)) {
    return "Health concerns can feel especially confusing as a teenager when your body is already going through so many changes. Many teens worry about similar things. Would you like to share more about what's concerning you?";
  }
  
  // Check if this is likely a child message (12-year-old)
  if (isLikelyChildMessage(userMessage)) {
    return "I understand that health stuff can feel scary or confusing, especially when your body is starting to change. Many kids your age have questions about these things. Would you like to talk more about what's been on your mind?";
  }
  
  // Standard adult medical message
  return "I understand you're experiencing some health concerns, which can be both physically and emotionally challenging. Many people find it helpful to talk through medical issues. Would you like to share more about what you're experiencing?";
};

// Similar teen-aware versions for other response types...
export const getMentalHealthConcernMessage = (userMessage: string): string => {
  // Check if this is likely a teen message and use teen-appropriate language
  if (isLikelyTeenMessage(userMessage)) {
    return "Mental health challenges can feel especially intense during the teen years when everything else is changing too. Many teens go through similar struggles, and it's brave of you to talk about this. Would you like to share more about what you're experiencing?";
  }
  
  // Check if this is likely a child message (12-year-old)
  if (isLikelyChildMessage(userMessage)) {
    return "It can be confusing when you're having big feelings that are hard to understand or deal with. Many kids your age experience these kinds of feelings too. Would you like to tell me more about what's been going on?";
  }
  
  return "I understand you may be experiencing some mental health challenges right now. These experiences are common and many people face similar struggles. Would you like to talk more about what you're going through?";
};

export const getEatingDisorderMessage = (userMessage: string): string => {
  if (isLikelyTeenMessage(userMessage)) {
    return "Body image and eating concerns are really common during the teen years when there's so much pressure to look a certain way. Many teens struggle with similar feelings. Would you like to talk more about what you're experiencing?";
  }
  
  // Check if this is likely a child message (12-year-old)
  if (isLikelyChildMessage(userMessage)) {
    return "I understand that sometimes feelings about food or how you look can be really complicated. Your body is going through lots of changes at your age, which can be confusing. Would you like to share more about what's been on your mind?";
  }

  return "I understand you may be experiencing some concerns related to eating or body image. These are complex issues that many people struggle with. Would you like to share more about what you're going through?";
};

export const getSubstanceUseMessage = (userMessage: string): string => {
  if (isLikelyTeenMessage(userMessage)) {
    return "Navigating situations involving substances can be really challenging as a teenager when there's a lot of peer pressure and curiosity. Many teens have questions or concerns about this. Would you feel comfortable sharing more about what's on your mind?";
  }
  
  // Check if this is likely a child message (12-year-old)
  if (isLikelyChildMessage(userMessage)) {
    return "It sounds like you might have some questions or concerns about substances that you've heard about or seen. Many kids your age start wondering about these things. Would you like to talk more about what's on your mind?";
  }

  return "I understand you may be experiencing some concerns related to substance use. Many people face similar challenges and find it helpful to talk through these issues. Would you like to share more about your situation?";
};

export const getTentativeHarmMessage = (userMessage: string): string => {
  if (isLikelyTeenMessage(userMessage)) {
    return "I notice you're expressing some thoughts that sound concerning. The teenage years can be incredibly difficult sometimes, and many teens have thoughts about harm when they're going through tough times. I'm here to listen if you'd like to talk more about these feelings.";
  }
  
  // Check if this is likely a child message (12-year-old)
  if (isLikelyChildMessage(userMessage)) {
    return "I notice you're sharing some thoughts that sound like you might be feeling really upset or hurt. Sometimes kids your age have big feelings that are hard to handle. I'm here to listen and help you find ways to feel better. Would you like to talk more about what's going on?";
  }

  return "I notice you're expressing some thoughts that sound concerning. Many people have thoughts about harm during difficult times. I'm here to listen if you'd like to talk more about what you're experiencing.";
};

/**
 * Function to detect if a message likely comes from a child (around 12 years old)
 */
export const isLikelyChildMessage = (message: string): boolean => {
  if (!message) return false;
  
  const lowerMessage = message.toLowerCase();
  
  // Age indicators
  const childAgeIndicators = [
    'im 12', "i'm 12", 'im 11', "i'm 11", 'im 13', "i'm 13", 'im 10', "i'm 10",
    '12 year old', '12 years old', '12yo', '12-year-old', '12 yr old',
    'elementary school', 'middle school', '6th grade', '5th grade', '7th grade'
  ];
  
  // Child-specific contexts
  const childContexts = [
    'my parents', 'my mom', 'my dad', 'my teacher', 'elementary school', 'middle school',
    'recess', 'homework', 'allowance', 'bedtime', 'video games', 'cartoons',
    'my friends at school', 'playground'
  ];
  
  // Child-like language patterns
  const childLanguagePatterns = [
    'super cool', 'awesome', 'really mad', 'not fair', 'mean kids',
    'best friend', 'my teacher says', 'my mom won\'t let me', 'my dad said'
  ];
  
  // Check for direct age indicators
  for (const indicator of childAgeIndicators) {
    if (lowerMessage.includes(indicator)) {
      return true;
    }
  }
  
  // Check for multiple child contexts
  let contextMatches = 0;
  for (const context of childContexts) {
    if (lowerMessage.includes(context)) {
      contextMatches++;
    }
  }
  
  // Check for child-like language patterns
  let languageMatches = 0;
  for (const pattern of childLanguagePatterns) {
    if (lowerMessage.includes(pattern)) {
      languageMatches++;
    }
  }
  
  // If multiple child context markers are found, likely a child
  return contextMatches >= 2 || (contextMatches >= 1 && languageMatches >= 1);
};

// Additional helper functions
export const processTeenConcerns = (userMessage: string): {
  isTeenMessage: boolean;
  concernCategory?: string;
  specificIssue?: string | null;
  response?: string;
} => {
  const isTeenMessage = isLikelyTeenMessage(userMessage);
  
  if (isTeenMessage) {
    // Detect specific teen concerns
    const problemDetails = detectCommonProblems(userMessage);
    
    // Generate age-appropriate response
    const response = generateTeenResponse({
      ageGroup: 'teen',
      concernCategory: problemDetails.category || undefined,
      specificIssue: problemDetails.specificIssue,
      userMessage
    });
    
    return {
      isTeenMessage,
      concernCategory: problemDetails.category || undefined,
      specificIssue: problemDetails.specificIssue,
      response
    };
  }
  
  return { isTeenMessage };
};

export const processChildConcerns = (userMessage: string): {
  isChildMessage: boolean;
  concernCategory?: string;
  specificIssue?: string | null;
  response?: string;
} => {
  const isChildMessage = isLikelyChildMessage(userMessage);
  
  if (isChildMessage) {
    // Detect specific child concerns
    const problemDetails = detectCommonProblems(userMessage);
    
    // Generate age-appropriate response
    const response = generateChildResponse({
      ageGroup: 'child',
      concernCategory: problemDetails.category || undefined,
      specificIssue: problemDetails.specificIssue,
      userMessage
    });
    
    return {
      isChildMessage,
      concernCategory: problemDetails.category || undefined,
      specificIssue: problemDetails.specificIssue,
      response
    };
  }
  
  return { isChildMessage };
};

/**
 * Generate responses specific to child concerns (around 12 years old)
 */
export const generateChildResponse = (params: {
  ageGroup: 'child' | 'teen' | 'adult' | null;
  concernCategory?: string;
  specificIssue?: string | null;
  userMessage: string;
}): string => {
  const { ageGroup, concernCategory, specificIssue, userMessage } = params;
  
  // If not a child or no clear category, return a general child-friendly response
  if (ageGroup !== 'child' || !concernCategory) {
    return "Thanks for sharing that with me. It can sometimes be hard to talk about things that are bothering you, and I think it's really brave. Would you like to tell me more about what's on your mind?";
  }
  
  // Generate category-specific responses for children
  switch (concernCategory) {
    case 'child_academic':
      return generateChildAcademicResponse(userMessage);
    case 'child_social':
      return generateChildSocialResponse(userMessage);
    case 'child_family':
      return generateChildFamilyResponse(userMessage);
    case 'child_emotional':
      return generateChildEmotionalResponse(userMessage);
    case 'mental_health':
      return "It sounds like you might be having some big feelings that are hard to understand. Many kids your age go through times when they feel sad, worried, or confused. Would it help to talk more about what you're feeling?";
    case 'physical_health':
      return "Our bodies can do all sorts of things that might feel confusing or worrying, especially when you're growing. Would you like to share more about what's been happening with your body that's concerning you?";
    default:
      return "Thanks for sharing that with me. Being your age comes with all kinds of challenges and new experiences. I'm here to listen if you want to talk more about what's going on.";
  }
};

/**
 * Generate responses for academic concerns specific to children
 */
export const generateChildAcademicResponse = (message: string): string => {
  const academicResponses = [
    "School can be really tough sometimes. It's normal to feel worried about tests or homework or not understanding something in class. What part of school has been hardest for you lately?",
    
    "I hear that school might be causing you some stress right now. Lots of kids feel pressure about grades or keeping up with work. Would you like to talk more about what's been difficult at school?",
    
    "School problems can feel really big, whether it's trouble with a subject, too much homework, or issues with teachers or other kids. I'm here to listen if you want to share more about what's been going on at school."
  ];
  
  return academicResponses[Math.floor(Math.random() * academicResponses.length)];
};

/**
 * Generate responses for social concerns specific to children
 */
export const generateChildSocialResponse = (message: string): string => {
  const socialResponses = [
    "Friendships can get complicated sometimes. It's really common to have ups and downs with friends or to feel left out. Would you like to talk more about what's been happening with your friends?",
    
    "Friend stuff can be really hard at your age. Sometimes friends change or say things that hurt our feelings. I'm here to listen if you want to tell me more about what's going on with your friends.",
    
    "Dealing with other kids can sometimes be tricky. Whether it's making friends, keeping friends, or handling mean behavior, these things are important. What's been happening in your friendships lately?"
  ];
  
  return socialResponses[Math.floor(Math.random() * socialResponses.length)];
};

/**
 * Generate responses for family concerns specific to children
 */
export const generateChildFamilyResponse = (message: string): string => {
  const familyResponses = [
    "Families can be complicated sometimes. Whether it's disagreements with parents, annoying siblings, or feeling like no one understands you, these feelings are normal. Would you like to share more about what's been happening at home?",
    
    "It sounds like there might be some tough stuff going on with your family. Many kids your age struggle with family rules or not feeling heard by their parents. I'm here to listen if you want to talk more about it.",
    
    "Home life can have its ups and downs. Sometimes we wish our family understood us better or gave us more space. What's been most challenging for you at home lately?"
  ];
  
  return familyResponses[Math.floor(Math.random() * familyResponses.length)];
};

/**
 * Generate responses for emotional concerns specific to children
 */
export const generateChildEmotionalResponse = (message: string): string => {
  const emotionalResponses = [
    "Big feelings can be really confusing sometimes. It's totally normal to feel happy one minute and sad or angry the next. Would you like to talk more about the feelings you've been having?",
    
    "Growing up comes with all kinds of new feelings and emotions. Sometimes these feelings can be overwhelming or confusing. I'm here to listen if you want to share more about how you've been feeling.",
    
    "It's okay to have all kinds of feelings - whether you're feeling sad, worried, angry, or confused. Everyone has these feelings sometimes. What kinds of emotions have been strongest for you lately?"
  ];
  
  return emotionalResponses[Math.floor(Math.random() * emotionalResponses.length)];
};

/**
 * Utilities for generating conversational responses
 */
import { generateRogerianResponse } from './rogerianPrinciples';
import { generateCVMHWInfoResponse } from './conversation/cvmhwResponseGenerator';
import { generateCollaborativeResponse } from './conversation/collaborativeResponseGenerator';
import { appropriateResponses } from './conversation/generalResponses';
import { adaptToneForClientPreference } from './safetySupport';
import { ConcernType } from './reflection/reflectionTypes';

// Export all the imported functionality
export * from './conversation/cvmhwInfo';
export * from './conversation/collaborativeSupportPrinciples';
export * from './conversation/clientCenteredApproach';
export * from './conversation/cvmhwResponseGenerator';
export * from './conversation/collaborativeResponseGenerator';
export * from './conversation/generalResponses';
export * from './safetySupport';

// Function to detect if the conversation suggests client-specific preferences
export const detectClientPreferences = (userInput: string, conversationHistory: string[] = []) => {
  const combinedText = [userInput, ...conversationHistory].join(" ").toLowerCase();
  
  const formalLanguageIndicators = [
    'formal', 'professional', 'business', 'proper', 'corporate',
    'respectful', 'sir', 'madam', 'mr.', 'ms.', 'mrs.', 'dr.'
  ];
  
  const directApproachIndicators = [
    'straight to the point', 'direct', 'concrete', 'specifically',
    'exactly', 'precisely', 'no nonsense', 'bottom line', 'get to the point'
  ];
  
  const firstTimeIndicators = [
    'first time', 'never before', 'new to this', 'never tried', 
    'finally decided', 'took the step', 'never spoken', 'never talked'
  ];
  
  return {
    prefersFormalLanguage: formalLanguageIndicators.some(word => combinedText.includes(word)),
    prefersDirectApproach: directApproachIndicators.some(word => combinedText.includes(word)),
    isFirstTimeWithMentalHealth: firstTimeIndicators.some(phrase => combinedText.includes(phrase))
  };
};

// Function to generate appropriate conversational responses based on user input context
export const generateConversationalResponse = (
  userInput: string, 
  conversationHistory: string[] = [],
  concernType?: ConcernType | null
): string => {
  // Detect client preferences from conversation
  const clientPreferences = detectClientPreferences(userInput, conversationHistory);
  
  // Check if this is likely a child message
  if (isLikelyChildMessage(userInput)) {
    const childResponse = processChildConcerns(userInput);
    if (childResponse.response) {
      return childResponse.response;
    }
  }
  
  // First check if this is likely a teen message
  if (isLikelyTeenMessage(userInput)) {
    const teenResponse = processTeenConcerns(userInput);
    if (teenResponse.response) {
      return teenResponse.response;
    }
  }
  
  // First check if the user is asking about CVMHW specifically
  const cvmhwResponse = generateCVMHWInfoResponse(userInput);
  if (cvmhwResponse) {
    return adaptToneForClientPreference(cvmhwResponse, clientPreferences);
  }
  
  // Next check if the user is asking about the collaborative approach
  const collaborativeResponse = generateCollaborativeResponse(userInput);
  if (collaborativeResponse) {
    return adaptToneForClientPreference(collaborativeResponse, clientPreferences);
  }
  
  // Check if a Rogerian-specific response is appropriate
  const rogerianResponse = generateRogerianResponse(userInput);
  if (rogerianResponse) {
    return adaptToneForClientPreference(rogerianResponse, clientPreferences);
  }
  
  // For safety concerns, always ensure deescalation approach
  if (concernType && ['crisis', 'tentative-harm', 'substance-use'].includes(concernType)) {
    // Get an appropriate response from the general responses
    const baseResponse = appropriateResponses[Math.floor(Math.random() * appropriateResponses.length)];
    
    // Always adapt tone for safety concerns based on client preferences
    return adaptToneForClientPreference(baseResponse, {
      ...clientPreferences,
      // For safety concerns, always add extra care for first-time mental health engagement
      isFirstTimeWithMentalHealth: true
    });
  }
  
  // If no specific pattern is matched, use the general human-like responses
  // with adaptation for detected preferences
  const baseResponse = appropriateResponses[Math.floor(Math.random() * appropriateResponses.length)];
  return adaptToneForClientPreference(baseResponse, clientPreferences);
};
