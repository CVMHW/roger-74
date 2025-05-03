
/**
 * Stressor Data
 * 
 * Core data structures for common stressors mentioned by patients
 */

import { Stressor, StressorCategory, AgeRange, SeverityLevel, FrequencyLevel } from './stressorTypes';

// Stressor database
let stressorDataStore: Stressor[] = [
  // Academic stressors
  {
    id: 'stressor_001',
    name: 'Academic pressure',
    category: 'academic',
    description: 'Pressure to achieve high grades and academic success',
    ageRanges: ['child', 'early-teen', 'mid-teen', 'late-teen', 'young-adult'],
    severity: 'moderate',
    frequency: 'very-common',
    keywords: ['grades', 'school', 'test', 'exam', 'academics', 'college', 'university', 'gpa', 'studying'],
    factSheet: 'According to Pew Research, 61% of teens feel significant pressure to get good grades.',
    commonResponses: [
      "I'm so stressed about my grades",
      "My parents will kill me if I don't get an A",
      "I'm studying all the time but still not doing well"
    ]
  },
  {
    id: 'stressor_002',
    name: 'Test anxiety',
    category: 'academic',
    description: 'Anxiety specifically related to taking tests or exams',
    ageRanges: ['child', 'early-teen', 'mid-teen', 'late-teen', 'young-adult'],
    severity: 'moderate',
    frequency: 'common',
    keywords: ['test', 'exam', 'quiz', 'final', 'assessment', 'anxiety', 'panic', 'freeze', 'blank'],
    relatedStressors: ['stressor_001'],
    commonResponses: [
      "I freeze up during tests even when I know the material",
      "I get physically sick before exams",
      "I can't sleep the night before a big test"
    ]
  },
  {
    id: 'stressor_003',
    name: 'Homework overload',
    category: 'academic',
    description: 'Feeling overwhelmed by amount of homework assigned',
    ageRanges: ['child', 'early-teen', 'mid-teen', 'late-teen'],
    severity: 'mild',
    frequency: 'very-common',
    keywords: ['homework', 'assignment', 'project', 'workload', 'too much', 'overwhelmed', 'deadline', 'due'],
    relatedStressors: ['stressor_001', 'stressor_002'],
    commonResponses: [
      "I have so much homework I'm up until 2am every night",
      "There's not enough hours in the day for all my assignments",
      "I never have free time because of all the homework"
    ]
  },
  
  // Social stressors
  {
    id: 'stressor_004',
    name: 'Bullying',
    category: 'social',
    description: 'Being bullied physically, verbally, or online',
    ageRanges: ['child', 'early-teen', 'mid-teen'],
    severity: 'severe',
    frequency: 'common',
    keywords: ['bully', 'bullying', 'teasing', 'mean', 'picked on', 'cyberbully', 'harass', 'making fun', 'excluded'],
    factSheet: '36% of parents worry about their children being bullied according to RethinkFirst.',
    commonResponses: [
      "There's this group of kids that always picks on me",
      "They're spreading rumors about me online",
      "I don't want to go to school because of the bullying"
    ]
  },
  {
    id: 'stressor_005',
    name: 'Peer pressure',
    category: 'social',
    description: 'Pressure from peers to engage in certain behaviors',
    ageRanges: ['early-teen', 'mid-teen', 'late-teen'],
    severity: 'moderate',
    frequency: 'common',
    keywords: ['peer pressure', 'friends forcing', 'cool kids', 'fit in', 'popularity', 'conformity', 'influence'],
    commonResponses: [
      "Everyone's doing it and they'll think I'm lame if I don't",
      "My friends keep pressuring me to try it",
      "I don't want to, but I don't want to lose my friends"
    ]
  },
  {
    id: 'stressor_006',
    name: 'Social media pressure',
    category: 'social',
    description: 'Pressure related to social media presence and image',
    ageRanges: ['early-teen', 'mid-teen', 'late-teen', 'young-adult'],
    severity: 'moderate',
    frequency: 'very-common',
    keywords: ['instagram', 'tiktok', 'snapchat', 'followers', 'likes', 'comments', 'social media', 'online', 'influencer', 'viral'],
    relatedStressors: ['stressor_012'],
    commonResponses: [
      "Everyone's life looks perfect on Instagram and mine doesn't",
      "I didn't get enough likes on my post and felt horrible",
      "I'm always comparing myself to people online"
    ]
  },
  
  // Family stressors
  {
    id: 'stressor_007',
    name: 'Family financial stress',
    category: 'family',
    description: 'Stress related to family financial difficulties',
    ageRanges: ['child', 'early-teen', 'mid-teen', 'late-teen', 'young-adult', 'adult'],
    severity: 'severe',
    frequency: 'common',
    keywords: ['money', 'bills', 'financial', 'afford', 'poor', 'debt', 'job loss', 'unemployment', 'budget', 'expenses'],
    commonResponses: [
      "My parents are always fighting about money",
      "We might lose our house",
      "I can't afford the same things as my friends"
    ]
  },
  {
    id: 'stressor_008',
    name: 'Parental divorce/separation',
    category: 'family',
    description: 'Stress related to parents divorcing or separating',
    ageRanges: ['child', 'early-teen', 'mid-teen', 'late-teen'],
    severity: 'severe',
    frequency: 'common',
    keywords: ['divorce', 'separation', 'custody', 'split up', 'breakup', 'parents fighting', 'lawyer', 'court'],
    commonResponses: [
      "My parents just told me they're getting divorced",
      "I feel like the divorce is my fault",
      "I hate having to switch between two houses"
    ]
  },
  {
    id: 'stressor_009',
    name: 'Moving to a new school',
    category: 'family',
    description: 'Stress from relocating and attending a new school',
    ageRanges: ['child', 'early-teen', 'mid-teen', 'late-teen'],
    severity: 'moderate',
    frequency: 'occasional',
    keywords: ['new school', 'moving', 'relocation', 'transfer', 'different city', 'starting over', 'making friends'],
    relatedStressors: ['stressor_010'],
    commonResponses: [
      "I hate being the new kid",
      "I miss my old friends and school",
      "No one talks to me at my new school"
    ]
  },
  
  // Health stressors
  {
    id: 'stressor_010',
    name: 'Body image concerns',
    category: 'health',
    description: 'Stress related to physical appearance and body image',
    ageRanges: ['early-teen', 'mid-teen', 'late-teen', 'young-adult'],
    severity: 'moderate',
    frequency: 'very-common',
    keywords: ['fat', 'skinny', 'weight', 'ugly', 'appearance', 'body', 'looks', 'diet', 'exercise', 'mirror'],
    relatedStressors: ['stressor_006'],
    factSheet: '29% of teens report feeling pressure about their appearance according to Pew Research.',
    commonResponses: [
      "I hate how I look",
      "Everyone else is thinner/more attractive than me",
      "I avoid pools or beaches because I don't want people to see my body"
    ]
  },
  {
    id: 'stressor_011',
    name: 'Fear of illness',
    category: 'health',
    description: 'Anxiety about getting sick or having health issues',
    ageRanges: ['child', 'early-teen', 'mid-teen', 'late-teen', 'young-adult', 'adult'],
    severity: 'moderate',
    frequency: 'common',
    keywords: ['sick', 'illness', 'disease', 'cancer', 'covid', 'virus', 'infection', 'hospital', 'doctor', 'symptoms'],
    commonResponses: [
      "I'm always worried I have a serious illness",
      "I can't stop thinking about getting sick",
      "Every small symptom makes me panic"
    ]
  },
  {
    id: 'stressor_012',
    name: 'Mental health concerns',
    category: 'health',
    description: 'Concerns about own mental health',
    ageRanges: ['early-teen', 'mid-teen', 'late-teen', 'young-adult', 'adult'],
    severity: 'severe',
    frequency: 'common',
    keywords: ['depression', 'anxiety', 'mental health', 'therapy', 'counseling', 'psychiatrist', 'medications', 'diagnosis'],
    commonResponses: [
      "I think I might be depressed",
      "My anxiety is getting worse",
      "I don't know if I should be on medication"
    ]
  },
  
  // Safety stressors
  {
    id: 'stressor_013',
    name: 'Fear of school shootings',
    category: 'safety',
    description: 'Fear and anxiety about potential school violence',
    ageRanges: ['child', 'early-teen', 'mid-teen', 'late-teen'],
    severity: 'severe',
    frequency: 'common',
    keywords: ['school shooting', 'shooter', 'lockdown', 'drill', 'gun', 'violence', 'safety', 'threat'],
    commonResponses: [
      "I get scared during lockdown drills",
      "I worry about a shooting happening at my school",
      "Sometimes I'm afraid to go to school because of shootings on the news"
    ]
  },
  {
    id: 'stressor_014',
    name: 'Fear of crime',
    category: 'safety',
    description: 'Anxiety about being a victim of crime',
    ageRanges: ['early-teen', 'mid-teen', 'late-teen', 'young-adult', 'adult'],
    severity: 'moderate',
    frequency: 'common',
    keywords: ['crime', 'robbery', 'assault', 'attack', 'violence', 'danger', 'unsafe', 'neighborhood', 'security'],
    commonResponses: [
      "I don't feel safe in my neighborhood",
      "I'm afraid to walk home alone",
      "There was a robbery nearby and now I'm scared"
    ]
  },
  {
    id: 'stressor_015',
    name: 'Environmental anxiety',
    category: 'environmental',
    description: 'Anxiety about climate change and environmental issues',
    ageRanges: ['mid-teen', 'late-teen', 'young-adult'],
    severity: 'moderate',
    frequency: 'common',
    keywords: ['climate change', 'global warming', 'environment', 'pollution', 'extinction', 'future', 'planet', 'sustainability'],
    commonResponses: [
      "I'm scared about what's happening to the planet",
      "What's the point of planning for a future that might not exist?",
      "I feel guilty about my environmental impact"
    ]
  }
];

/**
 * Load stressor data
 */
export const loadStressorData = (): void => {
  try {
    console.log("STRESSOR DATA: Loading stressor database");
    // In the future, this could load from storage or API
    
    // For now, just use the static data defined above
    console.log(`STRESSOR DATA: Loaded ${stressorDataStore.length} stressors`);
  } catch (error) {
    console.error("STRESSOR DATA: Failed to load", error);
  }
};

/**
 * Get all stressor data
 */
export const getAllStressors = (): Stressor[] => {
  return [...stressorDataStore];
};

/**
 * Get stressors by category
 */
export const getStressorsByCategory = (category: StressorCategory): Stressor[] => {
  return stressorDataStore.filter(stressor => stressor.category === category);
};

/**
 * Get stressors by age range
 */
export const getStressorsByAgeRange = (ageRange: AgeRange): Stressor[] => {
  return stressorDataStore.filter(stressor => 
    stressor.ageRanges.includes(ageRange) || stressor.ageRanges.includes('all')
  );
};

/**
 * Get stressor by ID
 */
export const getStressorById = (id: string): Stressor | undefined => {
  return stressorDataStore.find(stressor => stressor.id === id);
};

/**
 * Find related stressors
 */
export const findRelatedStressors = (stressorId: string): Stressor[] => {
  const stressor = getStressorById(stressorId);
  if (!stressor || !stressor.relatedStressors || stressor.relatedStressors.length === 0) {
    return [];
  }
  
  return stressor.relatedStressors
    .map(id => getStressorById(id))
    .filter(s => s !== undefined) as Stressor[];
};

// Initialize on module load
loadStressorData();

