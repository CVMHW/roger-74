
/**
 * Trauma Response Patterns based on Dr. Pete Walker's 4F model,
 * PCL5 evaluation criteria, and Polyvagal Theory
 */

// 4F Trauma Response Types from Walker's model
export interface FourFResponse {
  type: 'fight' | 'flight' | 'freeze' | 'fawn' | 'hybrid';
  intensity: 'mild' | 'moderate' | 'severe' | 'extreme';
  characteristics: string[];
  behaviouralSigns: string[];
  copingStrategies: string[];
}

export interface TraumaResponseAnalysis {
  dominant4F: FourFResponse;
  secondary4F?: FourFResponse;
  triggers: string[];
  polyvagalState?: 'social engagement' | 'mobilization' | 'immobilization' | 'hybrid';
  innerCriticType?: 'inner' | 'outer' | 'both' | 'none';
  angerLevel?: 'calm' | 'annoyed' | 'frustrated' | 'angry' | 'enraged';
  selfRegulationStrategies: string[];
}

// Fight response characteristics from Walker's model
const fightResponsePatterns = {
  keywords: [
    'control', 'angry', 'rage', 'bully', 'explosive', 'argumentative', 'controlling', 
    'criticism', 'perfectionist', 'entitlement', 'demanding', 'aggressive', 'dominating',
    'yell', 'attack', 'blame', 'confront', 'fight back', 'stand up', 'defend', 'power', 'authority'
  ],
  phrases: [
    'i need to control', 'makes me so angry', 'they should know better', 'put them in their place',
    'i won\'t let them', 'i need to be in charge', 'i have to defend myself', 'i know best',
    'they need to listen to me', 'won\'t back down', 'make them understand', 'set them straight',
    'prove i\'m right', 'can\'t let this go', 'won\'t be pushed around', 'show them who\'s boss'
  ],
  characteristics: [
    'Controlling behavior', 'Explosive anger', 'Criticism of others', 'Perfectionism',
    'Black and white thinking', 'Judgmental attitudes', 'Defensiveness', 'Difficulty with vulnerability',
    'Need to be right', 'Autocratic tendencies', 'Type A personality traits'
  ]
};

// Flight response characteristics from Walker's model
const flightResponsePatterns = {
  keywords: [
    'anxious', 'worry', 'perfectionist', 'workaholism', 'busy', 'hyperactive', 'overthinking', 
    'obsessing', 'panic', 'escape', 'avoid', 'run', 'flee', 'rush', 'hurry', 'leave', 
    'adrenaline', 'nervous', 'can\'t relax', 'on edge'
  ],
  phrases: [
    'i need to get away', 'can\'t stop thinking about', 'have to stay busy', 'need to prepare for',
    'what if something happens', 'need to be perfect', 'can\'t make mistakes', 'always on the go',
    'can\'t sit still', 'need to keep moving', 'too much to do', 'never enough time',
    'have to get this right', 'can\'t afford to fail', 'need to work harder'
  ],
  characteristics: [
    'Anxiety', 'Hyperactivity', 'Perfectionism', 'Obsessive thinking', 'Workaholism',
    'Driven behavior', 'Difficulty relaxing', 'Future-focused worry', 'Catastrophizing',
    'Achievement orientation', 'Micromanaging'
  ]
};

// Freeze response characteristics from Walker's model
const freezeResponsePatterns = {
  keywords: [
    'numb', 'shutdown', 'disconnect', 'dissociate', 'spaced out', 'blank', 'paralyzed', 
    'stuck', 'isolate', 'withdraw', 'hide', 'alone', 'avoid', 'escape', 'retreat', 'detach',
    'foggy', 'tired', 'exhausted', 'sleep', 'can\'t move', 'frozen'
  ],
  phrases: [
    'i just shut down', 'i go blank', 'i feel nothing', 'i disappear', 'i check out',
    'i just want to hide', 'i feel frozen', 'i can\'t think', 'my mind goes empty',
    'i feel paralyzed', 'i just want to sleep', 'i need to be alone', 'can\'t deal with this',
    'too overwhelming', 'need space', 'can\'t handle people right now'
  ],
  characteristics: [
    'Emotional numbness', 'Social withdrawal', 'Dissociation', 'Brain fog',
    'Fatigue', 'Difficulty making decisions', 'Procrastination', 'Isolation',
    'Avoidant behavior', 'Depression-like symptoms', 'Inaction'
  ]
};

// Fawn response characteristics from Walker's model
const fawnResponsePatterns = {
  keywords: [
    'please', 'sorry', 'help', 'accommodate', 'nice', 'approval', 'validate', 'accept', 'agree',
    'codependent', 'doormat', 'people-pleaser', 'caretaker', 'rescuer', 'selfless',
    'sacrifice', 'peace', 'harmony', 'conflict-avoidant'
  ],
  phrases: [
    'i just want everyone to be happy', 'i hate conflict', 'i need to help them',
    'it\'s my fault', 'i\'m sorry', 'whatever you want', 'i don\'t mind', 'i\'ll do it',
    'don\'t worry about me', 'i\'ll take care of it', 'i shouldn\'t complain',
    'i don\'t want to be a burden', 'i need to make sure they\'re okay'
  ],
  characteristics: [
    'People-pleasing behavior', 'Difficulty saying no', 'Excessive apologizing',
    'Self-neglect', 'Caretaking role', 'Poor boundaries', 'Conflict avoidance',
    'Seeking approval', 'Self-blame', 'Placating others', 'Difficulty identifying own needs'
  ]
};

// Anger levels based on anger thermometer
export const angerLevels = {
  'calm': {
    indicators: ['calm', 'peaceful', 'relaxed', 'fine', 'good', 'okay'],
    physicalSigns: ['relaxed body', 'normal breathing', 'engaged', 'present'],
    copingStrategies: ['maintain mindfulness', 'continue positive activities', 'practice gratitude']
  },
  'annoyed': {
    indicators: ['annoyed', 'disappointed', 'upset', 'bothered', 'irritated'],
    physicalSigns: ['slight tension', 'sighing', 'eye rolling', 'raised voice'],
    copingStrategies: ['deep breathing', 'talk to trusted person', 'take a short break']
  },
  'frustrated': {
    indicators: ['frustrated', 'irritated', 'stressed', 'tense', 'agitated'],
    physicalSigns: ['clenched fists', 'foot tapping', 'pacing', 'negative attitude'],
    copingStrategies: ['count to 100', 'get a drink of water', 'physical exercise', 'journal feelings']
  },
  'angry': {
    indicators: ['angry', 'mad', 'hot', 'fuming', 'livid'],
    physicalSigns: ['loud voice', 'arguing', 'refusing', 'glaring', 'aggressive gestures'],
    copingStrategies: ['take a timeout', 'practice grounding techniques', 'engage in physical activity']
  },
  'enraged': {
    indicators: ['enraged', 'furious', 'explosive', 'out of control', 'violent'],
    physicalSigns: ['yelling', 'throwing things', 'destruction', 'physical aggression'],
    copingStrategies: ['remove from situation', 'crisis techniques', 'professional support']
  }
};

// From PCL5 PTSD criteria and Polyvagal theory
export const traumaTriggerPatterns = [
  // Intrusion symptoms
  {
    category: 'intrusion',
    keywords: ['flashback', 'nightmare', 'memory', 'reminder', 'triggered', 'remember', 'vision'],
    phrases: [
      'it feels like it\'s happening again',
      'i keep seeing it',
      'the memories won\'t stop',
      'i have nightmares about',
      'when i think about what happened',
      'something reminded me of'
    ],
    severity: 'moderate'
  },
  // Avoidance symptoms
  {
    category: 'avoidance',
    keywords: ['avoid', 'stay away', 'can\'t talk about', 'refuse', 'won\'t go', 'scared to'],
    phrases: [
      'i can\'t talk about what happened',
      'i try not to think about it',
      'i avoid anything that reminds me of',
      'i can\'t go back to',
      'i stay away from',
      'i don\'t want to remember'
    ],
    severity: 'moderate'
  },
  // Negative alterations in cognition and mood
  {
    category: 'negativeThoughts',
    keywords: ['blame', 'fault', 'guilt', 'bad person', 'can\'t trust', 'numb', 'detached'],
    phrases: [
      'it was my fault',
      'i should have done something',
      'i can\'t trust anyone anymore',
      'i feel nothing',
      'i don\'t enjoy anything',
      'i feel cut off from everyone',
      'the world is completely dangerous'
    ],
    severity: 'severe'
  },
  // Arousal and reactivity alterations
  {
    category: 'hyperarousal',
    keywords: ['jumpy', 'startle', 'alert', 'on guard', 'watchful', 'can\'t sleep', 'angry'],
    phrases: [
      'i\'m always on alert',
      'i get startled easily',
      'i can\'t sleep',
      'i\'m constantly watching for danger',
      'i get angry over small things',
      'i can\'t concentrate',
      'i feel like i have to watch my back'
    ],
    severity: 'moderate'
  }
];

/**
 * Detects potential trauma response patterns based on the 4F model
 * @param text The user's input to analyze
 * @returns Analysis of potential trauma response patterns
 */
export function detectTraumaResponsePatterns(text: string): TraumaResponseAnalysis | null {
  if (!text || typeof text !== 'string') return null;
  
  const lowerText = text.toLowerCase();
  
  // Score each 4F pattern
  const fightScore = scoreResponsePattern(lowerText, fightResponsePatterns);
  const flightScore = scoreResponsePattern(lowerText, flightResponsePatterns);
  const freezeScore = scoreResponsePattern(lowerText, freezeResponsePatterns);
  const fawnScore = scoreResponsePattern(lowerText, fawnResponsePatterns);
  
  // Get the highest and second highest scores
  const scores = [
    { type: 'fight', score: fightScore },
    { type: 'flight', score: flightScore },
    { type: 'freeze', score: freezeScore },
    { type: 'fawn', score: fawnScore }
  ].sort((a, b) => b.score - a.score);
  
  // If no significant pattern is detected, return null
  if (scores[0].score < 2) return null;
  
  // Extract triggers
  const triggers: string[] = [];
  traumaTriggerPatterns.forEach(pattern => {
    pattern.keywords.forEach(keyword => {
      if (lowerText.includes(keyword) && !triggers.includes(keyword)) {
        triggers.push(keyword);
      }
    });
  });
  
  // Determine anger level
  let angerLevel: 'calm' | 'annoyed' | 'frustrated' | 'angry' | 'enraged' = 'calm';
  let highestAngerScore = 0;
  
  Object.entries(angerLevels).forEach(([level, data]) => {
    const levelScore = data.indicators.filter(indicator => 
      lowerText.includes(indicator)
    ).length;
    
    if (levelScore > highestAngerScore) {
      highestAngerScore = levelScore;
      angerLevel = level as any;
    }
  });
  
  // Determine inner critic type
  const innerCriticIndicators = ['i\'m not good enough', 'i always fail', 'i can\'t do anything right', 'i hate myself'];
  const outerCriticIndicators = ['they always', 'people never', 'everyone is', 'nobody cares', 'they don\'t deserve'];
  
  const hasInnerCritic = innerCriticIndicators.some(phrase => lowerText.includes(phrase));
  const hasOuterCritic = outerCriticIndicators.some(phrase => lowerText.includes(phrase));
  
  let innerCriticType: 'inner' | 'outer' | 'both' | 'none' = 'none';
  if (hasInnerCritic && hasOuterCritic) innerCriticType = 'both';
  else if (hasInnerCritic) innerCriticType = 'inner';
  else if (hasOuterCritic) innerCriticType = 'outer';
  
  // Determine intensity based on score
  const intensityMap: {[key: number]: 'mild' | 'moderate' | 'severe' | 'extreme'} = {
    2: 'mild',
    3: 'mild',
    4: 'moderate',
    5: 'moderate',
    6: 'severe',
    7: 'severe',
    8: 'extreme',
    9: 'extreme',
    10: 'extreme'
  };
  
  const dominantIntensity = intensityMap[Math.min(Math.floor(scores[0].score), 10)] || 'mild';
  
  // Create response object
  const dominant4F = create4FResponse(scores[0].type as any, dominantIntensity);
  
  // Only include secondary if it's at least 70% of the dominant score
  let secondary4F: FourFResponse | undefined;
  if (scores[1].score >= scores[0].score * 0.7 && scores[1].score >= 2) {
    const secondaryIntensity = intensityMap[Math.min(Math.floor(scores[1].score), 10)] || 'mild';
    secondary4F = create4FResponse(scores[1].type as any, secondaryIntensity);
  }
  
  // Determine polyvagal state
  let polyvagalState: 'social engagement' | 'mobilization' | 'immobilization' | 'hybrid' | undefined;
  
  if (scores[0].type === 'fight' || scores[0].type === 'flight') {
    polyvagalState = 'mobilization';
  } else if (scores[0].type === 'freeze') {
    polyvagalState = 'immobilization';
  } else if (scores[0].type === 'fawn') {
    polyvagalState = 'social engagement'; // Though often a maladaptive version
  }
  
  // If strong hybrid between different systems, mark as hybrid
  if (secondary4F && 
      ((scores[0].type === 'fight' || scores[0].type === 'flight') && 
       (scores[1].type === 'freeze' || scores[1].type === 'fawn')) || 
      ((scores[0].type === 'freeze' || scores[0].type === 'fawn') && 
       (scores[1].type === 'fight' || scores[1].type === 'flight'))) {
    polyvagalState = 'hybrid';
  }
  
  // Generate self-regulation strategies based on dominant pattern
  const selfRegulationStrategies = generateSelfRegulationStrategies(
    scores[0].type as any, 
    angerLevel, 
    polyvagalState
  );
  
  return {
    dominant4F,
    secondary4F,
    triggers,
    polyvagalState,
    innerCriticType,
    angerLevel,
    selfRegulationStrategies
  };
}

/**
 * Helper function to create a 4F Response object
 */
function create4FResponse(type: 'fight' | 'flight' | 'freeze' | 'fawn', intensity: 'mild' | 'moderate' | 'severe' | 'extreme'): FourFResponse {
  const characteristicsMap = {
    'fight': fightResponsePatterns.characteristics,
    'flight': flightResponsePatterns.characteristics,
    'freeze': freezeResponsePatterns.characteristics,
    'fawn': fawnResponsePatterns.characteristics
  };
  
  // Map behavioral signs based on type
  const behavioralSignsMap = {
    'fight': ['assertiveness', 'boundary-setting', 'leadership', 'determination', 'directness'],
    'flight': ['efficiency', 'preparation', 'thoroughness', 'alertness', 'productivity'],
    'freeze': ['mindfulness', 'observation', 'reflection', 'calm presence', 'patience'],
    'fawn': ['empathy', 'compromise', 'listening', 'peacemaking', 'service']
  };
  
  // Get appropriate coping strategies based on type and intensity
  const copingStrategiesMap = {
    'fight': {
      'mild': ['mindful breathing', 'count to 10 before responding', 'use "I" statements'],
      'moderate': ['physical exercise', 'journaling angry thoughts', 'progressive muscle relaxation'],
      'severe': ['time-out from triggering situations', 'anger management techniques', 'professional support'],
      'extreme': ['crisis support', 'safety planning', 'immediate professional intervention']
    },
    'flight': {
      'mild': ['grounding exercises', 'mindful breathing', 'scheduled worry time'],
      'moderate': ['progressive muscle relaxation', 'realistic perspective taking', 'limiting caffeine'],
      'severe': ['regular meditation practice', 'cognitive restructuring', 'professional support'],
      'extreme': ['crisis support', 'medication evaluation', 'structured treatment plan']
    },
    'freeze': {
      'mild': ['gentle physical movement', 'sensory stimulation', 'social connection'],
      'moderate': ['body scan meditation', 'structured daily routine', 'expressive arts'],
      'severe': ['somatic experiencing techniques', 'trauma-informed yoga', 'professional support'],
      'extreme': ['crisis support', 'medication evaluation', 'specialized trauma treatment']
    },
    'fawn': {
      'mild': ['practice saying no', 'identify personal needs', 'set small boundaries'],
      'moderate': ['assertiveness training', 'journaling true feelings', 'self-care practices'],
      'severe': ['boundary reinforcement', 'codependency support', 'professional guidance'],
      'extreme': ['intensive therapy', 'relationship restructuring', 'trauma-focused treatment']
    }
  };
  
  return {
    type,
    intensity,
    characteristics: characteristicsMap[type] || [],
    behaviouralSigns: behavioralSignsMap[type] || [],
    copingStrategies: copingStrategiesMap[type][intensity] || []
  };
}

/**
 * Scores how strongly a text matches a response pattern
 */
function scoreResponsePattern(text: string, pattern: any): number {
  let score = 0;
  
  // Check for keywords
  pattern.keywords.forEach((keyword: string) => {
    if (text.includes(keyword)) {
      score += 0.5;
    }
  });
  
  // Check for phrases (weighted more heavily)
  pattern.phrases.forEach((phrase: string) => {
    if (text.includes(phrase)) {
      score += 1;
    }
  });
  
  return score;
}

/**
 * Generates appropriate self-regulation strategies based on detected patterns
 */
function generateSelfRegulationStrategies(
  dominantType: 'fight' | 'flight' | 'freeze' | 'fawn',
  angerLevel: 'calm' | 'annoyed' | 'frustrated' | 'angry' | 'enraged',
  polyvagalState?: 'social engagement' | 'mobilization' | 'immobilization' | 'hybrid'
): string[] {
  const strategies: string[] = [];
  
  // Add basic strategies based on dominant type
  switch (dominantType) {
    case 'fight':
      strategies.push(
        'Practice deep breathing before responding',
        'Count to 10 when feeling reactive',
        'Use physical exercise to discharge energy',
        'Write down thoughts before expressing them'
      );
      break;
    case 'flight':
      strategies.push(
        'Practice grounding techniques',
        'Schedule worry time to contain anxious thoughts',
        'Use progressive muscle relaxation',
        'Limit stimulants like caffeine'
      );
      break;
    case 'freeze':
      strategies.push(
        'Gentle physical movement to reconnect with the body',
        'Use sensory stimulation (smells, textures, sounds)',
        'Practice small social interactions',
        'Create predictable routines and structures'
      );
      break;
    case 'fawn':
      strategies.push(
        'Practice saying "no" to small requests',
        'Take time to identify personal needs and preferences',
        'Journal about true feelings',
        'Practice assertiveness in low-risk situations'
      );
      break;
  }
  
  // Add strategies based on anger level
  if (angerLevel === 'frustrated' || angerLevel === 'angry' || angerLevel === 'enraged') {
    strategies.push(
      ...angerLevels[angerLevel].copingStrategies
    );
  }
  
  // Add polyvagal-informed strategies
  if (polyvagalState) {
    switch (polyvagalState) {
      case 'mobilization':
        strategies.push(
          'Use physical activity to discharge activation energy',
          'Practice 4-7-8 breathing to activate the parasympathetic nervous system',
          'Use bilateral stimulation (tapping, walking) to process activation'
        );
        break;
      case 'immobilization':
        strategies.push(
          'Gentle movement to restore connection with the body',
          'Use sensory stimulation to re-orient to the present moment',
          'Social engagement with safe people to activate ventral vagal system'
        );
        break;
      case 'hybrid':
        strategies.push(
          'Recognize conflicting activation patterns',
          'Practice naming and tracking internal states',
          'Pendulate between activation and relaxation states mindfully'
        );
        break;
    }
  }
  
  // Return a reasonable number of strategies
  return strategies.slice(0, 5);
}

/**
 * Generates a supportive response for someone experiencing trauma responses
 * based on detected 4F pattern
 */
export function generateTraumaInformedResponse(analysis: TraumaResponseAnalysis): string {
  if (!analysis) return '';
  
  const { dominant4F, secondary4F, angerLevel, innerCriticType, selfRegulationStrategies } = analysis;
  
  // Build response with self-awareness component
  let response = '';
  
  // Add validation based on dominant response type
  switch (dominant4F.type) {
    case 'fight':
      response = "I notice there might be some strong protective energy in your response. It's completely understandable to feel the need to stand up for yourself or establish control when facing challenges.";
      break;
    case 'flight':
      response = "I sense there might be some anxiety or urgency in what you're sharing. It's completely natural to want to plan, prepare, or find quick solutions when feeling overwhelmed.";
      break;
    case 'freeze':
      response = "I notice there might be some overwhelm or disconnection in your experience. It's completely understandable when situations feel too much to process that we might need to step back or find some space.";
      break;
    case 'fawn':
      response = "I notice you might be focusing on others' needs or feelings. It's completely natural to care deeply about maintaining harmony and supporting others, though your needs matter too.";
      break;
  }
  
  // Add acknowledgment of hybrid response if applicable
  if (secondary4F && secondary4F.type !== dominant4F.type) {
    switch (secondary4F.type) {
      case 'fight':
        response += " I also sense some protective energy that might be trying to establish control or boundaries in this situation.";
        break;
      case 'flight':
        response += " I also notice some anxiety that might be driving planning or quick movement away from discomfort.";
        break;
      case 'freeze':
        response += " I also sense some overwhelm that might make it difficult to process everything that's happening.";
        break;
      case 'fawn':
        response += " I also notice a focus on maintaining harmony or meeting others' needs in this situation.";
        break;
    }
  }
  
  // Add validation about inner/outer critic if detected
  if (innerCriticType === 'inner') {
    response += " I'm hearing some self-judgment in your words. These inner critical thoughts are common protective mechanisms but can be painful to experience.";
  } else if (innerCriticType === 'outer') {
    response += " I notice some judgment toward others in your words. These outer critical thoughts often emerge when we've been hurt or are trying to protect ourselves.";
  } else if (innerCriticType === 'both') {
    response += " I'm hearing both self-judgment and judgment of others, which often happens when we're trying to make sense of difficult experiences.";
  }
  
  // Add supportive strategies
  response += " Would it be helpful to explore some ways to work with these feelings? ";
  
  // Add 1-2 specific strategies from the self-regulation list
  if (selfRegulationStrategies.length > 0) {
    const selectedStrategies = selfRegulationStrategies.slice(0, 2);
    response += "Some people find it helpful to " + selectedStrategies.join(", or to ");
    response += ". What feels most supportive for you right now?";
  } else {
    response += "What would feel most supportive for you right now?";
  }
  
  return response;
}
