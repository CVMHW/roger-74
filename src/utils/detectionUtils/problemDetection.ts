import { ConcernType } from '../reflection/reflectionTypes';

/**
 * Unified problem detection system
 * This combines all specialized detection functions into one
 */
export const detectAllProblems = (message: string): ConcernType | null => {
  try {
    // First check for specialized concerns in order of priority
    const commonProblems = detectCommonProblems(message);
    if (commonProblems && commonProblems.category) {
      // Map common problems to ConcernType
      switch (commonProblems.category) {
        case 'crisis':
          return 'crisis';
        case 'medical':
        case 'physical_health':
          return 'medical';
        case 'mental_health':
          return 'mental-health';
        case 'eating_disorder':
          return 'eating-disorder';
        case 'substance_abuse':
          return 'substance-use';
        case 'mild_gambling':
          return 'mild-gambling';
        case 'teen_academic':
        case 'teen_social':
        case 'teen_identity':
        case 'teen_family':
          // For teen-specific concerns, we'll still use their general categories
          // but can process them differently in response generation
          return 'mental-health';
        case 'child_academic':
        case 'child_social':
        case 'child_family':
        case 'child_emotional':
          // For child-specific concerns, use general categories
          // but process them differently in response generation
          return 'mental-health';
        case 'ptsd_severe':
          return 'ptsd';
        case 'ptsd_mild':
          return 'ptsd-mild';
        case 'trauma_response':
          return 'trauma-response';
        case 'pet_illness':
          return 'pet-illness';
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error in problem detection:", error);
    return null;
  }
};

/**
 * Detect common problems across age groups
 * @param message The user message to analyze
 * @returns Object with detection results
 */
export const detectCommonProblems = (message: string): {
  category: string | null;
  specificIssue: string | null;
  ageGroup: 'teen' | 'adult' | 'child' | null;
} => {
  if (!message) {
    return { category: null, specificIssue: null, ageGroup: null };
  }
  
  const lowerMessage = message.toLowerCase();
  
  // Try to determine age group first
  const ageGroup = detectAgeGroup(message);
  
  // If it's a teen, check for teen-specific issues
  if (ageGroup === 'teen') {
    // Check teen categories
    if (isTeenAcademicIssue(lowerMessage)) {
      return { 
        category: 'teen_academic', 
        specificIssue: detectSpecificTeenAcademicIssue(lowerMessage),
        ageGroup 
      };
    }
    if (isTeenSocialIssue(lowerMessage)) {
      return { 
        category: 'teen_social', 
        specificIssue: detectSpecificTeenSocialIssue(lowerMessage),
        ageGroup 
      };
    }
    if (isTeenIdentityIssue(lowerMessage)) {
      return { 
        category: 'teen_identity', 
        specificIssue: detectSpecificTeenIdentityIssue(lowerMessage),
        ageGroup 
      };
    }
    if (isTeenFamilyIssue(lowerMessage)) {
      return { 
        category: 'teen_family', 
        specificIssue: detectSpecificTeenFamilyIssue(lowerMessage),
        ageGroup 
      };
    }
  }
  
  // If it's a child, check for child-specific issues
  if (ageGroup === 'child') {
    // Check child categories
    if (isChildAcademicIssue(lowerMessage)) {
      return { 
        category: 'child_academic', 
        specificIssue: detectSpecificChildAcademicIssue(lowerMessage),
        ageGroup 
      };
    }
    if (isChildSocialIssue(lowerMessage)) {
      return { 
        category: 'child_social', 
        specificIssue: detectSpecificChildSocialIssue(lowerMessage),
        ageGroup 
      };
    }
    if (isChildFamilyIssue(lowerMessage)) {
      return { 
        category: 'child_family', 
        specificIssue: detectSpecificChildFamilyIssue(lowerMessage),
        ageGroup 
      };
    }
    if (isChildEmotionalIssue(lowerMessage)) {
      return { 
        category: 'child_emotional', 
        specificIssue: detectSpecificChildEmotionalIssue(lowerMessage),
        ageGroup 
      };
    }
  }
  
  // Continue with general categories that apply to all age groups
  
  // Crisis detection
  const crisisPatterns = [
    /suicide|kill myself|want to die|end my life/i,
    /can'?t live|no reason to live|life is pointless/i
  ];
  if (crisisPatterns.some(pattern => pattern.test(lowerMessage))) {
    return { 
      category: 'crisis', 
      specificIssue: 'suicidal_ideation',
      ageGroup 
    };
  }
  
  // Medical concerns
  if (/cancer|tumor|disease|illness|sick|pain|ache|hurt/i.test(lowerMessage)) {
    return { 
      category: 'medical', 
      specificIssue: detectSpecificMedicalIssue(lowerMessage),
      ageGroup 
    };
  }
  
  // Pet illness concerns
  if ((/pet|dog|cat|animal/i.test(lowerMessage)) && 
      (/sick|ill|dying|cancer|vet|put down/i.test(lowerMessage))) {
    return { 
      category: 'pet_illness', 
      specificIssue: detectSpecificPetIssue(lowerMessage),
      ageGroup 
    };
  }
  
  // Mental health concerns
  if (/depress|anxiety|panic|sad|worry|afraid|scared|nervous/i.test(lowerMessage)) {
    return { 
      category: 'mental_health', 
      specificIssue: detectSpecificMentalHealthIssue(lowerMessage),
      ageGroup 
    };
  }
  
  // PTSD and trauma responses
  if (/ptsd|trauma|flashback|nightmare|trigger/i.test(lowerMessage)) {
    // Check for severity
    const severityScore = (
      (lowerMessage.includes('severe') ? 2 : 0) +
      (lowerMessage.includes('extreme') ? 2 : 0) +
      (lowerMessage.includes('diagnosed') ? 2 : 0) +
      (lowerMessage.includes('therapy') ? 1 : 0)
    );
    
    if (severityScore >= 2) {
      return { 
        category: 'ptsd_severe', 
        specificIssue: 'clinical_ptsd',
        ageGroup 
      };
    } else {
      return { 
        category: 'ptsd_mild', 
        specificIssue: 'trauma_response',
        ageGroup 
      };
    }
  }
  
  // Mild gambling detection
  if (/gambl|bet|wager|casino|slots|poker/i.test(lowerMessage)) {
    return { 
      category: 'mild_gambling', 
      specificIssue: detectSpecificGamblingIssue(lowerMessage),
      ageGroup 
    };
  }
  
  // If no specific category matched
  return { category: null, specificIssue: null, ageGroup };
};

/**
 * Detect likely age group based on language patterns
 */
export const detectAgeGroup = (message: string): 'teen' | 'adult' | 'child' | null => {
  const lowerMessage = message.toLowerCase();
  
  // Teen age indicators
  const teenAgeIndicators = [
    'im 16', "i'm 16", 'im 15', "i'm 15", 'im 17', "i'm 17", 'im 14', "i'm 14",
    'im 18', "i'm 18", '16 year old', '16 years old', '16yo', 'high school',
    'sophomore', 'junior', 'senior', 'freshman', 'teenager', 'teen'
  ];
  
  // Child age indicators
  const childAgeIndicators = [
    'im 12', "i'm 12", 'im 11', "i'm 11", 'im 13', "i'm 13", 'im 10', "i'm 10",
    '12 year old', '12 years old', '12yo', '12-year-old', '12 yr old',
    'elementary school', 'middle school', '6th grade', '5th grade', '7th grade'
  ];
  
  // Check for direct age indicators
  for (const indicator of teenAgeIndicators) {
    if (lowerMessage.includes(indicator)) {
      return 'teen';
    }
  }
  
  for (const indicator of childAgeIndicators) {
    if (lowerMessage.includes(indicator)) {
      return 'child';
    }
  }
  
  // Child-specific contexts
  const childContexts = [
    'my parents', 'my mom', 'my dad', 'my teacher', 'elementary school',
    'middle school', 'recess', 'homework', 'allowance', 'bedtime', 
    'my friends at school', 'playground', 'other kids'
  ];
  
  // Teen-specific contexts
  const teenContexts = [
    'my parents', 'my mom', 'my dad', 'my teacher', 'high school',
    'homework', 'grade', 'class', 'popular', 'crush', 'prom', 'homecoming'
  ];
  
  // Count context matches
  let teenContextMatches = 0;
  let childContextMatches = 0;
  
  for (const context of teenContexts) {
    if (lowerMessage.includes(context)) {
      teenContextMatches++;
    }
  }
  
  for (const context of childContexts) {
    if (lowerMessage.includes(context)) {
      childContextMatches++;
    }
  }
  
  // If multiple context markers are found, assign the age group
  if (teenContextMatches >= 2) {
    return 'teen';
  }
  
  if (childContextMatches >= 2) {
    return 'child';
  }
  
  // Default to adult if no clear indicators
  return 'adult';
};

// Teen issue detection functions
function isTeenAcademicIssue(message: string): boolean {
  const academicKeywords = [
    'school', 'grade', 'homework', 'test', 'exam', 'college', 'class',
    'teacher', 'study', 'fail', 'passing', 'assignment', 'gpa'
  ];
  
  return academicKeywords.some(keyword => message.includes(keyword));
}

function detectSpecificTeenAcademicIssue(message: string): string | null {
  // Implementation for specific teen academic issues
  if (message.includes('college')) return 'college_pressure';
  if (message.includes('test') || message.includes('exam')) return 'test_anxiety';
  if (message.includes('homework')) return 'homework_overload';
  if (message.includes('fail')) return 'fear_of_failure';
  
  return 'general_academic_pressure';
}

function isTeenSocialIssue(message: string): boolean {
  const socialKeywords = [
    'friend', 'popular', 'social media', 'instagram', 'tiktok',
    'snapchat', 'follower', 'like', 'comment', 'bully', 'drama'
  ];
  
  return socialKeywords.some(keyword => message.includes(keyword));
}

function detectSpecificTeenSocialIssue(message: string): string | null {
  if (message.includes('bully')) return 'bullying';
  if (message.includes('social media') || message.includes('instagram') || 
      message.includes('snapchat') || message.includes('tiktok')) 
    return 'social_media_pressure';
  if (message.includes('popular')) return 'popularity_concerns';
  if (message.includes('drama')) return 'friend_drama';
  
  return 'general_social_pressure';
}

function isTeenIdentityIssue(message: string): boolean {
  const identityKeywords = [
    'who am i', 'identity', 'future', 'career', 'college',
    'sexuality', 'gender', 'purpose', 'meaning', 'belong'
  ];
  
  return identityKeywords.some(keyword => message.includes(keyword));
}

function detectSpecificTeenIdentityIssue(message: string): string | null {
  if (message.includes('sexuality') || message.includes('gay') || 
      message.includes('lesbian') || message.includes('bi')) 
    return 'sexual_identity';
  if (message.includes('gender') || message.includes('trans')) 
    return 'gender_identity';
  if (message.includes('future') || message.includes('career') || message.includes('college')) 
    return 'future_concerns';
  if (message.includes('purpose') || message.includes('meaning')) 
    return 'existential_questions';
  
  return 'general_identity_exploration';
}

function isTeenFamilyIssue(message: string): boolean {
  const familyKeywords = [
    'mom', 'dad', 'parent', 'brother', 'sister', 'sibling', 'family',
    'divorce', 'argue', 'fight', 'understand', 'rules', 'curfew'
  ];
  
  return familyKeywords.some(keyword => message.includes(keyword));
}

function detectSpecificTeenFamilyIssue(message: string): string | null {
  if (message.includes('divorce') || message.includes('splitting up')) 
    return 'parents_divorcing';
  if (message.includes('understand') || message.includes('listen')) 
    return 'misunderstood_by_parents';
  if (message.includes('rules') || message.includes('strict')) 
    return 'strict_parents';
  if (message.includes('sibling') || message.includes('brother') || message.includes('sister')) 
    return 'sibling_rivalry';
  
  return 'general_family_conflict';
}

// Child issue detection functions
function isChildAcademicIssue(message: string): boolean {
  const academicKeywords = [
    'school', 'grade', 'homework', 'test', 'class', 'teacher', 'study',
    'fail', 'wrong answer', 'report card', 'reading', 'math', 'science'
  ];
  
  return academicKeywords.some(keyword => message.includes(keyword));
}

function detectSpecificChildAcademicIssue(message: string): string | null {
  if (message.includes('math')) return 'math_difficulties';
  if (message.includes('reading')) return 'reading_difficulties';
  if (message.includes('test') || message.includes('exam')) return 'test_anxiety';
  if (message.includes('homework')) return 'homework_struggles';
  if (message.includes('teacher')) return 'teacher_issues';
  if (message.includes('wrong answer') || message.includes('mistake')) return 'embarrassment';
  
  return 'general_school_stress';
}

function isChildSocialIssue(message: string): boolean {
  const socialKeywords = [
    'friend', 'bully', 'teasing', 'left out', 'lonely', 'no one likes me',
    'mean kids', 'excluded', 'picked on', 'popular', 'recess', 'lunch table'
  ];
  
  return socialKeywords.some(keyword => message.includes(keyword));
}

function detectSpecificChildSocialIssue(message: string): string | null {
  if (message.includes('bully') || message.includes('picked on') || message.includes('teasing')) 
    return 'bullying';
  if (message.includes('left out') || message.includes('excluded')) 
    return 'social_exclusion';
  if (message.includes('no friends') || message.includes('make friends')) 
    return 'friendship_difficulties';
  if (message.includes('popular') || message.includes('cool kids')) 
    return 'popularity_concerns';
  
  return 'general_peer_issues';
}

function isChildFamilyIssue(message: string): boolean {
  const familyKeywords = [
    'mom', 'dad', 'parent', 'brother', 'sister', 'sibling', 'family',
    'rules', 'chores', 'allowance', 'bedtime', 'grounded', 'yelled at'
  ];
  
  return familyKeywords.some(keyword => message.includes(keyword));
}

function detectSpecificChildFamilyIssue(message: string): string | null {
  if (message.includes('divorce') || message.includes('fighting')) 
    return 'family_conflict';
  if (message.includes('rules') || message.includes('strict')) 
    return 'strict_parents';
  if (message.includes('sibling') || message.includes('brother') || message.includes('sister')) 
    return 'sibling_issues';
  if (message.includes('chores') || message.includes('cleaning')) 
    return 'chores_complaints';
  
  return 'general_family_issues';
}

function isChildEmotionalIssue(message: string): boolean {
  const emotionalKeywords = [
    'sad', 'angry', 'mad', 'upset', 'scared', 'afraid', 'nervous',
    'worry', 'embarrassed', 'confused', 'lonely', 'feels weird'
  ];
  
  return emotionalKeywords.some(keyword => message.includes(keyword));
}

function detectSpecificChildEmotionalIssue(message: string): string | null {
  if (message.includes('sad') || message.includes('cry')) 
    return 'sadness';
  if (message.includes('angry') || message.includes('mad')) 
    return 'anger_issues';
  if (message.includes('scared') || message.includes('afraid') || message.includes('nervous')) 
    return 'anxiety_or_fear';
  if (message.includes('embarrassed')) 
    return 'embarrassment';
  if (message.includes('confused') || message.includes('weird')) 
    return 'confusion_about_feelings';
  
  return 'general_emotional_concerns';
}

function detectSpecificMedicalIssue(message: string): string | null {
  if (message.includes('cancer')) return 'cancer';
  if (message.includes('pain')) return 'chronic_pain';
  if (message.includes('headache') || message.includes('migraine')) return 'headache';
  if (message.includes('stomach') || message.includes('digest')) return 'stomach_issues';
  
  return 'general_health_concern';
}

function detectSpecificPetIssue(message: string): string | null {
  if (message.includes('cancer')) return 'pet_cancer';
  if (message.includes('dying') || message.includes('put down') || message.includes('euthan')) 
    return 'pet_end_of_life';
  if (message.includes('sick') || message.includes('ill')) 
    return 'pet_illness';
  
  return 'general_pet_health_concern';
}

function detectSpecificMentalHealthIssue(message: string): string | null {
  if (message.includes('depress')) return 'depression';
  if (message.includes('anxiety') || message.includes('worry')) return 'anxiety';
  if (message.includes('panic')) return 'panic_attacks';
  if (message.includes('bipolar') || message.includes('mood swing')) return 'bipolar';
  
  return 'general_mental_health';
}

function detectSpecificGamblingIssue(message: string): string | null {
  if (message.includes('sport') || message.includes('game') || message.includes('match')) 
    return 'sports_betting';
  if (message.includes('poker') || message.includes('card')) 
    return 'card_games';
  if (message.includes('casino') || message.includes('slot')) 
    return 'casino_gambling';
  
  return 'general_gambling';
}
