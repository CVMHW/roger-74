
/**
 * Logotherapeutic and existential techniques for supportive dialogues
 * Based on Viktor Frankl's principles and existential psychology
 */

// Types for existential techniques
export type TechniqueCategory = 'meaning' | 'values' | 'attitude' | 'responsibility' | 'self-transcendence';
export type TechniqueApproach = 'socratic' | 'dereflection' | 'paradoxical' | 'narrative' | 'experiential';

// Technique interface
interface ExistentialTechnique {
  name: string;
  description: string;
  category: TechniqueCategory;
  approach: TechniqueApproach;
  application: string;
  examples: string[];
}

// Collection of existential techniques
export const existentialTechniques: ExistentialTechnique[] = [
  {
    name: "Socratic Meaning Discovery",
    description: "Asking reflective questions to help uncover personal meaning",
    category: "meaning",
    approach: "socratic",
    application: "When someone is questioning purpose or meaning in their life",
    examples: [
      "What activities make you forget about time passing?",
      "When do you feel most alive or engaged?",
      "What would you want to be remembered for?",
      "What has given your life meaning in the past?"
    ]
  },
  {
    name: "Values Hierarchy Exploration",
    description: "Helping identify and prioritize personal values",
    category: "values",
    approach: "socratic",
    application: "When someone is unclear about their priorities or values",
    examples: [
      "If you could preserve just three values in your life, which would they be?",
      "What principles would you not compromise, even in difficult situations?",
      "What qualities do you admire most in others?"
    ]
  },
  {
    name: "Meaning-Focused Dereflection",
    description: "Redirecting attention from problems to meaningful engagement",
    category: "meaning",
    approach: "dereflection",
    application: "When someone is overthinking or too self-focused",
    examples: [
      "What matters to you that could use your attention right now?",
      "Who might benefit from your care or talents today?",
      "What meaningful activity helps you forget yourself for a while?"
    ]
  },
  {
    name: "Attitudinal Values Exploration",
    description: "Finding meaning through chosen attitudes toward unavoidable suffering",
    category: "attitude",
    approach: "socratic",
    application: "When someone faces unchangeable difficult circumstances",
    examples: [
      "What strengths have you discovered in yourself through this challenge?",
      "How might this experience change or deepen your perspective on life?",
      "What remains possible for you, even within these limitations?"
    ]
  },
  {
    name: "Mountain Range Exercise",
    description: "Identifying important people and shared values",
    category: "values",
    approach: "experiential",
    application: "For clarifying values through relationships",
    examples: [
      "Who would be on your mountain peaks of influence?",
      "What values do you share with those people?",
      "Whose mountain would you like to be on?"
    ]
  },
  {
    name: "Movies Exercise",
    description: "Creating mental films of one's life from past to present and present to future",
    category: "meaning",
    approach: "narrative",
    application: "For exploring life narrative and direction",
    examples: [
      "If your past were a movie, what would its title be?",
      "What kind of movie represents your future?",
      "Who are the main characters in your life story?"
    ]
  },
  {
    name: "Responsibility Awareness",
    description: "Highlighting freedom and responsibility in choices",
    category: "responsibility",
    approach: "socratic",
    application: "When someone feels trapped or without choices",
    examples: [
      "What choices remain available to you, even in this situation?",
      "What response feels most aligned with who you want to be?",
      "How might you exercise your freedom to choose your attitude?"
    ]
  },
  {
    name: "Self-Transcendence Focus",
    description: "Shifting focus from self to meaning beyond oneself",
    category: "self-transcendence",
    approach: "dereflection",
    application: "For those struggling with self-preoccupation or meaninglessness",
    examples: [
      "What cause matters to you beyond your personal concerns?",
      "Who might benefit from your care or attention?",
      "What gives you a sense of purpose beyond yourself?"
    ]
  },
  {
    name: "Paradoxical Intention for Anxiety",
    description: "Intentionally wishing for the feared symptom with humor",
    category: "attitude",
    approach: "paradoxical",
    application: "For anticipatory anxiety and phobias",
    examples: [
      "What would happen if you tried to show how nervous you can be?",
      "How might exaggerating your fear with humor change your experience?",
      "What if you tried to make the symptom happen on purpose?"
    ]
  },
  {
    name: "Legacy Perspective",
    description: "Considering life from the perspective of its end",
    category: "meaning",
    approach: "experiential",
    application: "For clarifying what matters most in life",
    examples: [
      "What would you want said about you at your 80th birthday celebration?",
      "What contribution would you like to make that outlasts you?",
      "How would you want to be remembered?"
    ]
  }
];

/**
 * Get an existential technique appropriate for the user's current concern
 * @param concernType - Type of existential concern expressed
 * @returns Appropriate technique with examples
 */
export const getSuggestedTechnique = (
  concernType: 'meaning' | 'values' | 'suffering' | 'freedom' | 'isolation' | 'mortality' | 'vacuum'
): ExistentialTechnique => {
  // Map concern types to technique categories
  const categoryMap: Record<string, TechniqueCategory> = {
    'meaning': 'meaning',
    'values': 'values',
    'suffering': 'attitude',
    'freedom': 'responsibility',
    'isolation': 'self-transcendence', 
    'mortality': 'meaning',
    'vacuum': 'meaning'
  };
  
  // Filter techniques by the appropriate category
  const category = categoryMap[concernType] || 'meaning';
  const relevantTechniques = existentialTechniques.filter(technique => 
    technique.category === category
  );
  
  // Return a random technique from the relevant ones
  return relevantTechniques[Math.floor(Math.random() * relevantTechniques.length)];
};

/**
 * Generate a Socratic question related to existential themes
 * @param concernType - Type of existential concern
 * @returns A meaningful Socratic question
 */
export const generateSocraticQuestion = (
  concernType: 'meaning' | 'values' | 'suffering' | 'freedom' | 'isolation' | 'mortality' | 'vacuum'
): string => {
  const meaningQuestions = [
    "What activities make you lose track of time?",
    "When do you feel most alive or engaged?",
    "What has given your life a sense of purpose in the past?",
    "What would you like your life to stand for?"
  ];
  
  const valuesQuestions = [
    "What principles guide your important decisions?",
    "What qualities do you most admire in others?",
    "What would you not compromise, even in difficult times?",
    "When do you feel most aligned with your core values?"
  ];
  
  const sufferingQuestions = [
    "How have difficult experiences shaped you in the past?",
    "What strengths have you discovered through challenges?",
    "What remains possible, even within this difficulty?",
    "What perspective helps you face hardship with dignity?"
  ];
  
  const freedomQuestions = [
    "What choices remain available to you, even now?",
    "How might you use your freedom to choose your attitude?",
    "What response feels most authentic to who you want to be?",
    "What small action could express your freedom today?"
  ];
  
  const isolationQuestions = [
    "When have you felt most genuinely connected to others?",
    "What helps bridge the gap between yourself and others?",
    "How might sharing your authentic experience create connection?",
    "What common human experiences might others relate to in your story?"
  ];
  
  const mortalityQuestions = [
    "How might awareness of life's finite nature clarify what matters?",
    "What would you want to be remembered for?",
    "What would you regret not having done or expressed?",
    "How might embracing life's temporality change how you live today?"
  ];
  
  const vacuumQuestions = [
    "When have you felt most fulfilled or purposeful?",
    "What activities give you a sense of meaning or contribution?",
    "What called to you before this emptiness appeared?",
    "What small meaningful action could you take today?"
  ];
  
  // Select question set based on concern
  let questionSet;
  switch(concernType) {
    case 'meaning': questionSet = meaningQuestions; break;
    case 'values': questionSet = valuesQuestions; break;
    case 'suffering': questionSet = sufferingQuestions; break;
    case 'freedom': questionSet = freedomQuestions; break;
    case 'isolation': questionSet = isolationQuestions; break;
    case 'mortality': questionSet = mortalityQuestions; break;
    case 'vacuum': questionSet = vacuumQuestions; break;
    default: questionSet = meaningQuestions;
  }
  
  // Return a random question from the appropriate set
  return questionSet[Math.floor(Math.random() * questionSet.length)];
};

export default {
  existentialTechniques,
  getSuggestedTechnique,
  generateSocraticQuestion
};
