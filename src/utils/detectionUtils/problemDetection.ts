
import { ConcernType } from '../reflection/reflectionTypes';

/**
 * Problem category mapping to help with classification
 */
export const problemCategories = {
  PHYSICAL_HEALTH: 'physical_health',
  MENTAL_HEALTH: 'mental_health',
  FINANCIAL: 'financial',
  SOCIAL: 'social',
  ENVIRONMENTAL: 'environmental',
  WORK_EDUCATION: 'work_education',
  TECHNOLOGY: 'technology',
  LIFESTYLE: 'lifestyle',
  PET_HEALTH: 'pet_health'
};

/**
 * Maps problem categories to concern types for response generation
 */
export const mapCategoryToConcernType = (category: string): ConcernType | null => {
  switch (category) {
    case problemCategories.PHYSICAL_HEALTH:
      return 'medical';
    case problemCategories.MENTAL_HEALTH:
      return 'mental-health';
    case problemCategories.PET_HEALTH:
      return 'pet-illness';
    default:
      return null;
  }
};

/**
 * Advanced problem detection system using the comprehensive problem database
 * @param message User message to analyze
 * @returns Object with detected problems and relevant concern type
 */
export const detectCommonProblems = (message: string): {
  detected: boolean;
  category: string | null;
  specificIssue: string | null;
  concernType: ConcernType | null;
} => {
  if (!message) return { detected: false, category: null, specificIssue: null, concernType: null };
  
  const lowerMessage = message.toLowerCase();
  
  // Physical health detection
  const physicalHealthTerms = [
    'pain', 'chronic', 'obesity', 'weight', 'sleep', 'insomnia', 'fatigue',
    'healthcare', 'medical', 'diagnosis', 'medication', 'disease', 'diabetes',
    'hypertension', 'allergies', 'dental', 'vision', 'hearing', 'infertility',
    'arthritis', 'vaccine', 'epidemic', 'pandemic', 'genetic'
  ];
  
  // Mental health detection
  const mentalHealthTerms = [
    'stress', 'anxiety', 'depression', 'lonely', 'loneliness', 'isolated',
    'self-esteem', 'confidence', 'burnout', 'grief', 'trauma', 'ptsd',
    'anger', 'purpose', 'meaning', 'fear', 'failure', 'rejection', 'body image',
    'phobia', 'guilt', 'shame', 'overwhelmed', 'adhd', 'focus'
  ];
  
  // Pet health detection - enhanced with more terms
  const petHealthTerms = [
    'pet', 'dog', 'cat', 'animal', 'puppy', 'kitten', 'veterinarian', 'vet',
    'pet food', 'pet health', 'pet insurance', 'pet medication', 'pet surgery',
    'pet cancer', 'pet illness', 'pet dying', 'pet death', 'put down',
    'euthanasia', 'animal hospital', 'pet emergency', 'pet suffering'
  ];
  
  // Check for co-occurrence of health issues with pets
  const healthIssues = [
    'sick', 'ill', 'pain', 'suffering', 'disease', 'cancer', 'tumor',
    'dying', 'death', 'euthanize', 'put down', 'not eating', 'treatment',
    'medication', 'operation', 'surgery'
  ];
  
  // Check which category has the most matches
  const physicalMatches = physicalHealthTerms.filter(term => lowerMessage.includes(term)).length;
  const mentalMatches = mentalHealthTerms.filter(term => lowerMessage.includes(term)).length;
  
  // Special check for pet health - requires both pet term and health term
  const hasPetTerm = petHealthTerms.some(term => lowerMessage.includes(term));
  const hasHealthIssue = healthIssues.some(term => lowerMessage.includes(term));
  const isPetHealth = hasPetTerm && hasHealthIssue;
  
  // Determine category based on matches
  let category = null;
  let specificIssue = null;

  if (isPetHealth) {
    category = problemCategories.PET_HEALTH;
    
    // Try to determine specific pet type
    const petTypes = ['dog', 'cat', 'puppy', 'kitten', 'bird', 'hamster', 'rabbit', 'fish'];
    for (const petType of petTypes) {
      if (lowerMessage.includes(petType)) {
        specificIssue = `${petType} health issue`;
        break;
      }
    }
    if (!specificIssue) specificIssue = 'pet health issue';
  } else if (physicalMatches > mentalMatches) {
    category = problemCategories.PHYSICAL_HEALTH;
    // Extract specific health issue if possible
    for (const term of physicalHealthTerms) {
      if (lowerMessage.includes(term)) {
        specificIssue = term;
        break;
      }
    }
  } else if (mentalMatches > 0) {
    category = problemCategories.MENTAL_HEALTH;
    // Extract specific mental health issue if possible
    for (const term of mentalHealthTerms) {
      if (lowerMessage.includes(term)) {
        specificIssue = term;
        break;
      }
    }
  }
  
  // Map to concern type
  const concernType = category ? mapCategoryToConcernType(category) : null;
  
  return {
    detected: !!category,
    category,
    specificIssue,
    concernType
  };
};

/**
 * Integrated problem detection that combines all detection methods
 * @param message The user input to analyze
 * @returns The appropriate concern type or null
 */
export const detectAllProblems = (message: string): ConcernType | null => {
  // First check using existing detection methods
  const detectionUtils = require('../detectionUtils');
  
  // Check for existing detection methods
  if (detectionUtils.detectCrisisKeywords(message)) {
    return 'crisis';
  }
  
  if (detectionUtils.detectTentativeHarmLanguage(message)) {
    return 'tentative-harm';
  }
  
  if (detectionUtils.detectPetIllnessConcerns(message)) {
    return 'pet-illness';
  }
  
  // Check for specific illness
  const illnessDetails = detectionUtils.detectSpecificIllness(message);
  if (illnessDetails.detected) {
    if (illnessDetails.context === 'pet') {
      return 'pet-illness';
    }
    return 'medical';
  }
  
  if (detectionUtils.detectMedicalConcerns(message)) {
    return 'medical';
  }
  
  if (detectionUtils.detectMentalHealthConcerns(message)) {
    return 'mental-health';
  }
  
  if (detectionUtils.detectEatingDisorderConcerns(message)) {
    return 'eating-disorder';
  }
  
  const substanceResults = detectionUtils.detectSubstanceUseConcerns(message);
  if (substanceResults.detected) {
    return 'substance-use';
  }
  
  const ptsdResults = detectionUtils.detectPTSDConcerns(message);
  if (ptsdResults.detected) {
    return ptsdResults.severity === 'severe' ? 'trauma-response' : 'ptsd';
  }
  
  // If nothing detected by specialized methods, use the comprehensive detection
  const commonProblems = detectCommonProblems(message);
  if (commonProblems.detected && commonProblems.concernType) {
    return commonProblems.concernType;
  }
  
  return null;
};
