
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
  PET_HEALTH: 'pet_health',
  TEEN_ACADEMIC: 'teen_academic',
  TEEN_SOCIAL: 'teen_social',
  TEEN_IDENTITY: 'teen_identity',
  TEEN_FAMILY: 'teen_family'
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
    case problemCategories.TEEN_SOCIAL:
    case problemCategories.TEEN_IDENTITY:
    case problemCategories.TEEN_ACADEMIC:
    case problemCategories.TEEN_FAMILY:
      return 'mental-health'; // Map teen concerns to mental health for now
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
  ageGroup?: 'teen' | 'adult' | 'child' | null;
} => {
  if (!message) return { detected: false, category: null, specificIssue: null, concernType: null };
  
  const lowerMessage = message.toLowerCase();
  
  // Physical health detection
  const physicalHealthTerms = [
    'pain', 'chronic', 'obesity', 'weight', 'sleep', 'insomnia', 'fatigue',
    'healthcare', 'medical', 'diagnosis', 'medication', 'disease', 'diabetes',
    'hypertension', 'allergies', 'dental', 'vision', 'hearing', 'infertility',
    'arthritis', 'vaccine', 'epidemic', 'pandemic', 'genetic', 'acne', 'skin issues',
    'braces', 'puberty', 'period', 'periods', 'growing pains'
  ];
  
  // Mental health detection
  const mentalHealthTerms = [
    'stress', 'anxiety', 'depression', 'lonely', 'loneliness', 'isolated',
    'self-esteem', 'confidence', 'burnout', 'grief', 'trauma', 'ptsd',
    'anger', 'purpose', 'meaning', 'fear', 'failure', 'rejection', 'body image',
    'phobia', 'guilt', 'shame', 'overwhelmed', 'adhd', 'focus', 'mood swings',
    'irritability', 'misunderstood', 'comparison', 'fomo', 'overthinking'
  ];
  
  // Teen-specific academic terms
  const teenAcademicTerms = [
    'grades', 'homework', 'exam', 'test', 'sat', 'act', 'college', 'application',
    'study', 'teacher', 'school', 'class', 'assignment', 'project', 'presentation',
    'gpa', 'course', 'tutor', 'major', 'scholarship', 'lecture', 'essay', 
    'failing', 'cheating', 'academic', 'education', 'university'
  ];
  
  // Teen social issues
  const teenSocialTerms = [
    'friends', 'popular', 'cool', 'left out', 'excluded', 'gossip', 'drama', 
    'clique', 'judged', 'bully', 'teased', 'peer pressure', 'awkward', 
    'crush', 'breakup', 'dating', 'reputation', 'party', 'hangout', 'bestie',
    'fake friends', 'follower', 'likes', 'post', 'snapchat', 'instagram',
    'tiktok', 'social media'
  ];
  
  // Teen identity issues
  const teenIdentityTerms = [
    'who am i', 'identity', 'fitting in', 'values', 'beliefs', 'future', 'career',
    'sexuality', 'gender', 'gay', 'lesbian', 'bi', 'trans', 'queer', 'lgbt',
    'coming out', 'religion', 'culture', 'growing up', 'independence', 'adult',
    'mature', 'purpose', 'passion', 'hobby', 'talent'
  ];
  
  // Teen family issues
  const teenFamilyTerms = [
    'parents', 'mom', 'dad', 'mother', 'father', 'sibling', 'brother', 'sister',
    'grounded', 'rules', 'curfew', 'chores', 'privacy', 'phone taken', 'punishment',
    'strict', 'overprotective', 'divorce', 'fighting', 'argument', 'yelling',
    'expectations', 'pressure', 'disappointed', 'move', 'moving', 'family'
  ];
  
  // Pet health detection - enhanced with more terms
  const petHealthTerms = [
    'pet', 'dog', 'cat', 'animal', 'puppy', 'kitten', 'veterinarian', 'vet',
    'pet food', 'pet health', 'pet insurance', 'pet medication', 'pet surgery',
    'pet cancer', 'pet illness', 'pet dying', 'pet death', 'put down',
    'euthanasia', 'animal hospital', 'pet emergency', 'pet suffering'
  ];
  
  // Age indicators to help identify teens
  const teenAgeIndicators = [
    '16 year old', '16 years old', '16yo', '16-year-old', '16 yr old',
    'high school', 'sophomore', 'junior', 'teenager', 'teen', 'adolescent',
    'im 16', "i'm 16", 'im 15', "i'm 15", 'im 17', "i'm 17", 'im 14', "i'm 14",
    'im 18', "i'm 18", "i'm in high school", "im in high school"
  ];
  
  // Check for health issues with pets
  const healthIssues = [
    'sick', 'ill', 'pain', 'suffering', 'disease', 'cancer', 'tumor',
    'dying', 'death', 'euthanize', 'put down', 'not eating', 'treatment',
    'medication', 'operation', 'surgery'
  ];
  
  // Check for co-occurrence of pet terms and health terms
  const hasPetTerm = petHealthTerms.some(term => lowerMessage.includes(term));
  const hasHealthIssue = healthIssues.some(term => lowerMessage.includes(term));
  const isPetHealth = hasPetTerm && hasHealthIssue;
  
  // Check for teen age indicators
  const isLikelyTeen = teenAgeIndicators.some(term => lowerMessage.includes(term));
  
  // Check which category has the most matches
  const physicalMatches = physicalHealthTerms.filter(term => lowerMessage.includes(term)).length;
  const mentalMatches = mentalHealthTerms.filter(term => lowerMessage.includes(term)).length;
  const teenAcademicMatches = teenAcademicTerms.filter(term => lowerMessage.includes(term)).length;
  const teenSocialMatches = teenSocialTerms.filter(term => lowerMessage.includes(term)).length;
  const teenIdentityMatches = teenIdentityTerms.filter(term => lowerMessage.includes(term)).length;
  const teenFamilyMatches = teenFamilyTerms.filter(term => lowerMessage.includes(term)).length;
  
  // Determine category based on matches and age indicators
  let category = null;
  let specificIssue = null;
  let ageGroup: 'teen' | 'adult' | 'child' | null = null;

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
  } 
  // For teen users, prioritize teen-specific concerns
  else if (isLikelyTeen) {
    ageGroup = 'teen';
    
    // Find the dominant teen concern category
    const teenCategoryCounts = [
      { category: problemCategories.TEEN_ACADEMIC, count: teenAcademicMatches },
      { category: problemCategories.TEEN_SOCIAL, count: teenSocialMatches },
      { category: problemCategories.TEEN_IDENTITY, count: teenIdentityMatches },
      { category: problemCategories.TEEN_FAMILY, count: teenFamilyMatches },
      { category: problemCategories.MENTAL_HEALTH, count: mentalMatches },
      { category: problemCategories.PHYSICAL_HEALTH, count: physicalMatches }
    ];
    
    // Sort by count descending and get the top category
    teenCategoryCounts.sort((a, b) => b.count - a.count);
    const topCategory = teenCategoryCounts[0];
    
    // Only assign if we have at least one match
    if (topCategory.count > 0) {
      category = topCategory.category;
      
      // Extract specific issue based on the category
      switch (category) {
        case problemCategories.TEEN_ACADEMIC:
          for (const term of teenAcademicTerms) {
            if (lowerMessage.includes(term)) {
              specificIssue = term;
              break;
            }
          }
          break;
        case problemCategories.TEEN_SOCIAL:
          for (const term of teenSocialTerms) {
            if (lowerMessage.includes(term)) {
              specificIssue = term;
              break;
            }
          }
          break;
        case problemCategories.TEEN_IDENTITY:
          for (const term of teenIdentityTerms) {
            if (lowerMessage.includes(term)) {
              specificIssue = term;
              break;
            }
          }
          break;
        case problemCategories.TEEN_FAMILY:
          for (const term of teenFamilyTerms) {
            if (lowerMessage.includes(term)) {
              specificIssue = term;
              break;
            }
          }
          break;
        case problemCategories.MENTAL_HEALTH:
          for (const term of mentalHealthTerms) {
            if (lowerMessage.includes(term)) {
              specificIssue = term;
              break;
            }
          }
          break;
        case problemCategories.PHYSICAL_HEALTH:
          for (const term of physicalHealthTerms) {
            if (lowerMessage.includes(term)) {
              specificIssue = term;
              break;
            }
          }
          break;
      }
    }
  } 
  // Standard adult concerns
  else if (physicalMatches > mentalMatches) {
    category = problemCategories.PHYSICAL_HEALTH;
    ageGroup = 'adult';
    // Extract specific health issue if possible
    for (const term of physicalHealthTerms) {
      if (lowerMessage.includes(term)) {
        specificIssue = term;
        break;
      }
    }
  } else if (mentalMatches > 0) {
    category = problemCategories.MENTAL_HEALTH;
    ageGroup = 'adult';
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
    concernType,
    ageGroup
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
