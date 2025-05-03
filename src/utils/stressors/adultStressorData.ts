
/**
 * Adult Stressor Data
 * 
 * Core data structures for common stressors reported by working-age adults
 */

import { Stressor, StressorCategory, SeverityLevel, FrequencyLevel } from './stressorTypes';

// Adult stressor database
const adultStressorDataStore: Stressor[] = [
  // Financial stressors
  {
    id: 'adult_stressor_001',
    name: 'Debt',
    category: 'financial',
    description: 'Stress related to personal debt including credit cards, loans, or mortgages',
    ageRanges: ['young-adult', 'adult'],
    severity: 'severe',
    frequency: 'very-common',
    keywords: ['debt', 'bills', 'money', 'loan', 'mortgage', 'credit', 'payment', 'financial'],
    factSheet: 'According to APA Stress in America, 72% of adults report feeling stressed about money at least sometimes.',
    commonResponses: [
      "I'm drowning in debt",
      "I can't keep up with my payments",
      "My credit card bills are overwhelming me"
    ]
  },
  {
    id: 'adult_stressor_002',
    name: 'Insufficient income',
    category: 'financial',
    description: 'Stress from not earning enough to meet basic needs or desired lifestyle',
    ageRanges: ['young-adult', 'adult'],
    severity: 'severe',
    frequency: 'very-common',
    keywords: ['income', 'salary', 'pay', 'earnings', 'money', 'afford', 'bills', 'expenses'],
    relatedStressors: ['adult_stressor_001', 'adult_stressor_003'],
    commonResponses: [
      "I'm not making enough to cover my expenses",
      "My paycheck is gone before the month is over",
      "I can't afford basic necessities on my current salary"
    ]
  },
  {
    id: 'adult_stressor_003',
    name: 'High cost of living',
    category: 'financial',
    description: 'Stress due to rising costs of housing, food, healthcare, and other essentials',
    ageRanges: ['young-adult', 'adult'],
    severity: 'severe',
    frequency: 'very-common',
    keywords: ['expensive', 'inflation', 'prices', 'cost', 'afford', 'rent', 'housing', 'groceries'],
    relatedStressors: ['adult_stressor_001', 'adult_stressor_002'],
    factSheet: 'High housing costs are reported as a significant stressor by over 60% of adults in urban areas.',
    commonResponses: [
      "Everything is so expensive these days",
      "My rent keeps increasing but my pay doesn't",
      "I can barely afford groceries with these prices"
    ]
  },
  
  // Work stressors
  {
    id: 'adult_stressor_004',
    name: 'Heavy workload',
    category: 'work',
    description: 'Stress from excessive job responsibilities or tasks',
    ageRanges: ['young-adult', 'adult'],
    severity: 'moderate',
    frequency: 'very-common',
    keywords: ['workload', 'overwhelmed', 'busy', 'overworked', 'tasks', 'job', 'responsibilities', 'deadline'],
    factSheet: 'According to NIOSH, 40% of workers report their job is very or extremely stressful.',
    commonResponses: [
      "I have way too much on my plate at work",
      "I'm constantly overwhelmed with deadlines",
      "My workload is impossible to manage"
    ]
  },
  {
    id: 'adult_stressor_005',
    name: 'Job insecurity',
    category: 'work',
    description: 'Stress from fear of job loss or employment uncertainty',
    ageRanges: ['young-adult', 'adult'],
    severity: 'severe',
    frequency: 'common',
    keywords: ['layoff', 'fired', 'unemployment', 'job security', 'downsizing', 'restructuring', 'position'],
    relatedStressors: ['adult_stressor_001', 'adult_stressor_002'],
    commonResponses: [
      "I'm worried my company is going to let me go",
      "There are rumors about layoffs at work",
      "I don't know if my job will exist next month"
    ]
  },
  {
    id: 'adult_stressor_006',
    name: 'Poor work-life balance',
    category: 'work',
    description: 'Stress from inability to separate work from personal life',
    ageRanges: ['young-adult', 'adult'],
    severity: 'moderate',
    frequency: 'very-common',
    keywords: ['balance', 'boundaries', 'overtime', 'after-hours', 'weekend', 'vacation', 'time off', 'personal life'],
    relatedStressors: ['adult_stressor_004', 'adult_stressor_010'],
    commonResponses: [
      "I'm always working, even during evenings and weekends",
      "I never have time for myself or my family",
      "I can't remember the last time I took a real vacation"
    ]
  },
  
  // Health stressors
  {
    id: 'adult_stressor_007',
    name: 'Personal health problems',
    category: 'health',
    description: 'Stress related to personal illness, chronic conditions, or health concerns',
    ageRanges: ['young-adult', 'adult'],
    severity: 'severe',
    frequency: 'common',
    keywords: ['health', 'sick', 'illness', 'disease', 'diagnosis', 'chronic', 'condition', 'pain'],
    commonResponses: [
      "I just got diagnosed with a serious condition",
      "My chronic pain is getting worse",
      "I'm worried about my health deteriorating"
    ]
  },
  {
    id: 'adult_stressor_008',
    name: 'Family member health issues',
    category: 'health',
    description: 'Stress from illness or health problems affecting family members',
    ageRanges: ['young-adult', 'adult'],
    severity: 'severe',
    frequency: 'common',
    keywords: ['family', 'sick', 'illness', 'disease', 'parent', 'child', 'spouse', 'caregiver'],
    commonResponses: [
      "My parent was just diagnosed with cancer",
      "My child has a chronic illness that requires constant care",
      "My spouse's health is declining and I'm their caretaker"
    ]
  },
  {
    id: 'adult_stressor_009',
    name: 'Healthcare access',
    category: 'health',
    description: 'Stress related to insurance, medical costs, or access to care',
    ageRanges: ['young-adult', 'adult'],
    severity: 'moderate',
    frequency: 'common',
    keywords: ['insurance', 'medical bills', 'doctor', 'hospital', 'treatment', 'medication', 'afford', 'healthcare'],
    relatedStressors: ['adult_stressor_001', 'adult_stressor_003'],
    commonResponses: [
      "I can't afford the treatment I need",
      "My insurance denied coverage for my medication",
      "I'm avoiding going to the doctor because of the cost"
    ]
  },
  
  // Relationship stressors
  {
    id: 'adult_stressor_010',
    name: 'Marital/relationship conflict',
    category: 'relationship',
    description: 'Stress from conflicts, arguments, or problems with spouse or partner',
    ageRanges: ['young-adult', 'adult'],
    severity: 'severe',
    frequency: 'common',
    keywords: ['marriage', 'relationship', 'spouse', 'partner', 'argument', 'conflict', 'fight', 'divorce'],
    commonResponses: [
      "My partner and I are constantly fighting",
      "I think my marriage is falling apart",
      "We can't seem to communicate without arguing"
    ]
  },
  {
    id: 'adult_stressor_011',
    name: 'Parenting responsibilities',
    category: 'relationship',
    description: 'Stress related to raising and caring for children',
    ageRanges: ['young-adult', 'adult'],
    severity: 'moderate',
    frequency: 'very-common',
    keywords: ['parenting', 'children', 'kids', 'childcare', 'discipline', 'behavior', 'school', 'teenager'],
    commonResponses: [
      "I'm struggling to handle my child's behavior",
      "Balancing work and parenting is exhausting",
      "I worry I'm not a good enough parent"
    ]
  },
  {
    id: 'adult_stressor_012',
    name: 'Caregiving for aging parents',
    category: 'relationship',
    description: 'Stress from providing care for elderly or ill parents',
    ageRanges: ['adult'],
    severity: 'severe',
    frequency: 'common',
    keywords: ['parent', 'elderly', 'aging', 'caregiver', 'nursing home', 'dementia', 'elder care', 'senior'],
    relatedStressors: ['adult_stressor_008', 'adult_stressor_011'],
    commonResponses: [
      "Taking care of my aging parent is a full-time job",
      "I'm torn between caring for my kids and my parents",
      "My mother's dementia is getting worse and I don't know what to do"
    ]
  },
  
  // Social/societal stressors
  {
    id: 'adult_stressor_013',
    name: 'Political climate',
    category: 'societal',
    description: 'Stress related to political events, news, and divisiveness',
    ageRanges: ['young-adult', 'adult'],
    severity: 'moderate',
    frequency: 'very-common',
    keywords: ['politics', 'election', 'government', 'news', 'president', 'policy', 'congress', 'vote'],
    factSheet: 'According to APA, 77% of adults report the future of our nation as a significant source of stress.',
    commonResponses: [
      "The political situation is making me extremely anxious",
      "I can't even talk to family members who have different political views",
      "I feel helpless about the direction our country is heading"
    ]
  },
  {
    id: 'adult_stressor_014',
    name: 'Discrimination',
    category: 'societal',
    description: 'Stress from experiencing prejudice based on race, gender, age, etc.',
    ageRanges: ['young-adult', 'adult'],
    severity: 'severe',
    frequency: 'common',
    keywords: ['discrimination', 'racism', 'sexism', 'prejudice', 'bias', 'inequality', 'harassment', 'minority'],
    commonResponses: [
      "I'm constantly dealing with racism at work",
      "People treat me differently because of my gender",
      "I face discrimination because of my age"
    ]
  },
  {
    id: 'adult_stressor_015',
    name: 'Climate change concerns',
    category: 'societal',
    description: 'Anxiety about environmental issues and climate change',
    ageRanges: ['young-adult', 'adult'],
    severity: 'moderate',
    frequency: 'common',
    keywords: ['climate', 'environment', 'global warming', 'pollution', 'sustainability', 'future', 'planet', 'disaster'],
    commonResponses: [
      "I worry about what kind of planet we're leaving for our children",
      "The climate crisis keeps me up at night",
      "I feel helpless about addressing climate change"
    ]
  }
];

/**
 * Get all adult stressor data
 */
export const getAllAdultStressors = (): Stressor[] => {
  return [...adultStressorDataStore];
};

/**
 * Get adult stressors by category
 */
export const getAdultStressorsByCategory = (category: StressorCategory): Stressor[] => {
  return adultStressorDataStore.filter(stressor => stressor.category === category);
};

/**
 * Get adult stressor by ID
 */
export const getAdultStressorById = (id: string): Stressor | undefined => {
  return adultStressorDataStore.find(stressor => stressor.id === id);
};

/**
 * Find related adult stressors
 */
export const findRelatedAdultStressors = (stressorId: string): Stressor[] => {
  const stressor = getAdultStressorById(stressorId);
  if (!stressor || !stressor.relatedStressors || stressor.relatedStressors.length === 0) {
    return [];
  }
  
  return stressor.relatedStressors
    .map(id => getAdultStressorById(id))
    .filter(s => s !== undefined) as Stressor[];
};

// Export all adult stressor data functions
export default {
  getAllAdultStressors,
  getAdultStressorsByCategory,
  getAdultStressorById,
  findRelatedAdultStressors
};
