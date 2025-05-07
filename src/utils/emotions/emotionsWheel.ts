
/**
 * Emotions Wheel System
 * 
 * Provides a structured way to detect, classify, and respond to emotions
 * Integrates with memory, hallucination prevention, and therapeutic approaches
 */

// Define the structure for an emotion entry
export interface EmotionEntry {
  name: string;
  synonyms: string[];
  description: string;
  parentEmotion: string;
  intensity: string;
  color: string;
}

interface EmotionalContentResult {
  primaryEmotion: string;
  intensity: string;
  description: string;
  hasEmotion: boolean;
}

interface SocialEmotionalContext {
  primaryEmotion: string;
  intensity: string;
  description: string;
}

/**
 * Detects social-emotional context in user input
 * @param userInput The user's message
 * @returns Object containing detected emotion and intensity
 */
export const detectSocialEmotionalContext = (userInput: string): SocialEmotionalContext | null => {
  // Check for embarrassment
  if (/embarrass(ed|ing)?|awkward|cringe/i.test(userInput)) {
    return {
      primaryEmotion: 'embarrassed',
      intensity: 'medium',
      description: 'Feeling self-conscious or ashamed about a social situation'
    };
  }
  
  // Check for feeling excluded
  if (/left out|excluded|ignored|rejected/i.test(userInput)) {
    return {
      primaryEmotion: 'excluded',
      intensity: 'medium',
      description: 'Feeling left out or not included in a group or activity'
    };
  }
  
  // Check for feeling betrayed
  if (/betray(ed|al)?|deceived|stabbed in the back/i.test(userInput)) {
    return {
      primaryEmotion: 'betrayed',
      intensity: 'high',
      description: 'Feeling that someone has broken your trust'
    };
  }
  
  // Check for feeling guilty
  if (/guilty|remorseful|ashamed|regret/i.test(userInput)) {
    return {
      primaryEmotion: 'guilty',
      intensity: 'medium',
      description: 'Feeling responsible for something bad or wrong'
    };
  }
  
  // Check for feeling inadequate
  if (/inadequate|inferior|not good enough|worthless/i.test(userInput)) {
    return {
      primaryEmotion: 'inadequate',
      intensity: 'medium',
      description: 'Feeling not good enough or lacking in skills or qualities'
    };
  }
  
  return null;
};

/**
 * Detects emotional content in user input
 * @param userInput The user's message
 * @returns Object containing detected emotion and intensity
 */
export const detectEmotionalContent = (userInput: string): EmotionalContentResult | null => {
  // Check for happiness
  if (/happy|joyful|excited|delighted|cheerful/i.test(userInput)) {
    return {
      primaryEmotion: 'happy',
      intensity: 'medium',
      description: 'Feeling pleased or delighted',
      hasEmotion: true
    };
  }
  
  // Check for sadness
  if (/sad|unhappy|depressed|down|blue/i.test(userInput)) {
    return {
      primaryEmotion: 'sad',
      intensity: 'medium',
      description: 'Feeling sorrowful or dejected',
      hasEmotion: true
    };
  }
  
  // Check for anger
  if (/angry|mad|furious|irritated|annoyed/i.test(userInput)) {
    return {
      primaryEmotion: 'angry',
      intensity: 'medium',
      description: 'Feeling displeasure or hostility',
      hasEmotion: true
    };
  }
  
  // Check for fear
  if (/fearful|scared|afraid|terrified|anxious/i.test(userInput)) {
    return {
      primaryEmotion: 'fearful',
      intensity: 'medium',
      description: 'Feeling afraid or worried',
      hasEmotion: true
    };
  }
  
  // Check for surprise
  if (/surprised|amazed|astonished|shocked/i.test(userInput)) {
    return {
      primaryEmotion: 'surprised',
      intensity: 'medium',
      description: 'Feeling startled or astonished',
      hasEmotion: true
    };
  }
  
  // Check for disgust
  if (/disgusted|repulsed|sickened|revolted/i.test(userInput)) {
    return {
      primaryEmotion: 'disgusted',
      intensity: 'medium',
      description: 'Feeling revulsion or distaste',
      hasEmotion: true
    };
  }
  
  return null;
};

// Define the emotions wheel as a structured object
export const emotionsWheel: Record<string, Record<string, EmotionEntry>> = {
  joy: {
    ecstasy: {
      name: 'ecstasy',
      synonyms: ['bliss', 'euphoria', 'intense joy'],
      description: 'Overwhelming happiness and delight',
      parentEmotion: 'joy',
      intensity: 'high',
      color: '#FFD700'
    },
    joyful: {
      name: 'joyful',
      synonyms: ['happy', 'cheerful', 'merry'],
      description: 'Feeling or expressing great pleasure and happiness',
      parentEmotion: 'joy',
      intensity: 'medium',
      color: '#FFD34E'
    },
    content: {
      name: 'content',
      synonyms: ['satisfied', 'pleased', 'gratified'],
      description: 'State of peaceful happiness and satisfaction',
      parentEmotion: 'joy',
      intensity: 'low',
      color: '#FFD966'
    }
  },
  sadness: {
    grief: {
      name: 'grief',
      synonyms: ['sorrow', 'anguish', 'heartache'],
      description: 'Intense sorrow, especially caused by someone\'s death',
      parentEmotion: 'sadness',
      intensity: 'high',
      color: '#A9A9A9'
    },
    sad: {
      name: 'sad',
      synonyms: ['unhappy', 'dejected', 'melancholy'],
      description: 'Feeling or showing sorrow; unhappy',
      parentEmotion: 'sadness',
      intensity: 'medium',
      color: '#C0C0C0'
    },
    lonely: {
      name: 'lonely',
      synonyms: ['isolated', 'alone', 'forsaken'],
      description: 'Sad because one has no friends or company',
      parentEmotion: 'sadness',
      intensity: 'low',
      color: '#D3D3D3'
    }
  },
  anger: {
    rage: {
      name: 'rage',
      synonyms: ['fury', 'wrath', 'outrage'],
      description: 'Violent, uncontrollable anger',
      parentEmotion: 'anger',
      intensity: 'high',
      color: '#B22222'
    },
    angry: {
      name: 'angry',
      synonyms: ['mad', 'irate', 'furious'],
      description: 'Feeling or showing strong annoyance, displeasure, or hostility',
      parentEmotion: 'anger',
      intensity: 'medium',
      color: '#CD5C5C'
    },
    irritated: {
      name: 'irritated',
      synonyms: ['annoyed', 'exasperated', 'aggravated'],
      description: 'Slightly annoyed; impatient or angry',
      parentEmotion: 'anger',
      intensity: 'low',
      color: '#F08080'
    }
  },
  fear: {
    terror: {
      name: 'terror',
      synonyms: ['horror', 'panic', 'alarm'],
      description: 'Extreme fear',
      parentEmotion: 'fear',
      intensity: 'high',
      color: '#483D8B'
    },
    fearful: {
      name: 'fearful',
      synonyms: ['afraid', 'apprehensive', 'nervous'],
      description: 'Feeling afraid; showing fear or anxiety',
      parentEmotion: 'fear',
      intensity: 'medium',
      color: '#6A5ACD'
    },
    worried: {
      name: 'worried',
      synonyms: ['anxious', 'concerned', 'uneasy'],
      description: 'Feeling or showing anxiety and concern about actual or potential problems',
      parentEmotion: 'fear',
      intensity: 'low',
      color: '#7B68EE'
    }
  },
  surprise: {
    amazement: {
      name: 'amazement',
      synonyms: ['wonder', 'astonishment', 'awe'],
      description: 'Great surprise and wonder',
      parentEmotion: 'surprise',
      intensity: 'high',
      color: '#3CB371'
    },
    surprised: {
      name: 'surprised',
      synonyms: ['astonished', 'startled', 'shocked'],
      description: 'Feeling or showing surprise',
      parentEmotion: 'surprise',
      intensity: 'medium',
      color: '#90EE90'
    },
    distracted: {
      name: 'distracted',
      synonyms: ['sidetracked', 'diverted', 'preoccupied'],
      description: 'Having one\'s attention diverted',
      parentEmotion: 'surprise',
      intensity: 'low',
      color: '#ADFF2F'
    }
  },
  disgust: {
    revulsion: {
      name: 'revulsion',
      synonyms: ['repulsion', 'abhorrence', 'loathing'],
      description: 'A sense of disgust and loathing',
      parentEmotion: 'disgust',
      intensity: 'high',
      color: '#800000'
    },
    disgusted: {
      name: 'disgusted',
      synonyms: ['repulsed', 'sickened', 'revolted'],
      description: 'Feeling or showing revulsion or strong disapproval',
      parentEmotion: 'disgust',
      intensity: 'medium',
      color: '#A52A2A'
    },
    disappointed: {
      name: 'disappointed',
      synonyms: ['let down', 'discouraged', 'dismayed'],
      description: 'Sad or displeased because someone or something has failed to fulfill one\'s hopes or expectations',
      parentEmotion: 'disgust',
      intensity: 'low',
      color: '#BDB76B'
    }
  },
  trust: {
    admiration: {
      name: 'admiration',
      synonyms: ['respect', 'esteem', 'approval'],
      description: 'A feeling of respect and liking for someone or something',
      parentEmotion: 'trust',
      intensity: 'high',
      color: '#4682B4'
    },
    trusting: {
      name: 'trusting',
      synonyms: ['believing', 'confident', 'assured'],
      description: 'Having or showing a belief in the reliability, truth, ability, or strength of someone or something',
      parentEmotion: 'trust',
      intensity: 'medium',
      color: '#ADD8E6'
    },
    acceptance: {
      name: 'acceptance',
      synonyms: ['approval', 'agreement', 'support'],
      description: 'The action or process of being received as adequate, valid, or suitable',
      parentEmotion: 'trust',
      intensity: 'low',
      color: '#B0E0E6'
    }
  },
  anticipation: {
    eagerness: {
      name: 'eagerness',
      synonyms: ['enthusiasm', 'keenness', 'ardor'],
      description: 'Enthusiasm to do or have something; keenness',
      parentEmotion: 'anticipation',
      intensity: 'high',
      color: '#98FB98'
    },
    anticipating: {
      name: 'anticipating',
      synonyms: ['expecting', 'awaiting', 'foreseeing'],
      description: 'Look forward to something',
      parentEmotion: 'anticipation',
      intensity: 'medium',
      color: '#90EE90'
    },
    interested: {
      name: 'interested',
      synonyms: ['curious', 'attentive', 'concerned'],
      description: 'Showing curiosity or concern about something or someone',
      parentEmotion: 'anticipation',
      intensity: 'low',
      color: '#3CB371'
    }
  },
  love: {
    adoration: {
      name: 'adoration',
      synonyms: ['devotion', 'worship', 'reverence'],
      description: 'Deep love and respect',
      parentEmotion: 'love',
      intensity: 'high',
      color: '#FF69B4'
    },
    affectionate: {
      name: 'affectionate',
      synonyms: ['loving', 'caring', 'tender'],
      description: 'Readily feeling or showing fondness or tenderness',
      parentEmotion: 'love',
      intensity: 'medium',
      color: '#FFB6C1'
    },
    friendly: {
      name: 'friendly',
      synonyms: ['amiable', 'genial', 'approachable'],
      description: 'Kind and pleasant',
      parentEmotion: 'love',
      intensity: 'low',
      color: '#FFE4E1'
    }
  },
  remorse: {
    guilt: {
      name: 'guilt',
      synonyms: ['contrition', 'regret', 'remorse'],
      description: 'A feeling of having done wrong or failed in an obligation',
      parentEmotion: 'remorse',
      intensity: 'high',
      color: '#708090'
    },
    shameful: {
      name: 'shameful',
      synonyms: ['disgraceful', 'humiliating', 'ignominious'],
      description: 'Worthy of or causing shame or disgrace',
      parentEmotion: 'remorse',
      intensity: 'medium',
      color: '#808080'
    },
    apologetic: {
      name: 'apologetic',
      synonyms: ['remorseful', 'contrite', 'regretful'],
      description: 'Expressing or showing regretful acknowledgment of an offense or failure',
      parentEmotion: 'remorse',
      intensity: 'low',
      color: '#A9A9A9'
    }
  },
  submission: {
    awed: {
      name: 'awed',
      synonyms: ['reverential', 'impressed', 'humbled'],
      description: 'Filled with reverence or wonder',
      parentEmotion: 'submission',
      intensity: 'high',
      color: '#8A2BE2'
    },
    respectful: {
      name: 'respectful',
      synonyms: ['deferential', 'polite', 'courteous'],
      description: 'Feeling or showing deferential regard',
      parentEmotion: 'submission',
      intensity: 'medium',
      color: '#9370DB'
    },
    docile: {
      name: 'docile',
      synonyms: ['compliant', 'obedient', 'manageable'],
      description: 'Ready to accept control or instruction; submissive',
      parentEmotion: 'submission',
      intensity: 'low',
      color: '#BA55D3'
    }
  },
  aggressiveness: {
    hostility: {
      name: 'hostility',
      synonyms: ['animosity', 'enmity', 'rancor'],
      description: 'Hostile behavior; unfriendliness or opposition',
      parentEmotion: 'aggressiveness',
      intensity: 'high',
      color: '#DC143C'
    },
    aggressive: {
      name: 'aggressive',
      synonyms: ['assertive', 'combative', 'belligerent'],
      description: 'Ready or likely to attack or confront; characterized by or resulting from aggression',
      parentEmotion: 'aggressiveness',
      intensity: 'medium',
      color: '#E9967A'
    },
    frustrated: {
      name: 'frustrated',
      synonyms: ['disappointed', 'thwarted', 'aggravated'],
      description: 'Feeling or expressing distress and annoyance resulting from an inability to change or achieve something',
      parentEmotion: 'aggressiveness',
      intensity: 'low',
      color: '#F08080'
    }
  },
  outrage: {
    scornful: {
      name: 'scornful',
      synonyms: ['contemptuous', 'derisive', 'mocking'],
      description: 'Feeling or expressing contempt or derision',
      parentEmotion: 'outrage',
      intensity: 'high',
      color: '#8B4513'
    },
    outraged: {
      name: 'outraged',
      synonyms: ['indignant', 'resentful', 'affronted'],
      description: 'Arouse fierce anger, shock, or indignation in (someone)',
      parentEmotion: 'outrage',
      intensity: 'medium',
      color: '#A0522D'
    },
    jealous: {
      name: 'jealous',
      synonyms: ['envious', 'covetous', 'possessive'],
      description: 'Feeling or showing envy of someone or their achievements and advantages',
      parentEmotion: 'outrage',
      intensity: 'low',
      color: '#D2691E'
    }
  },
  optimism: {
    hopeful: {
      name: 'hopeful',
      synonyms: ['optimistic', 'confident', 'positive'],
      description: 'Feeling or inspiring optimism about a future event',
      parentEmotion: 'optimism',
      intensity: 'high',
      color: '#00FA9A'
    },
    enchanted: {
      name: 'enchanted',
      synonyms: ['delighted', 'captivated', 'charmed'],
      description: 'Filled with delight; captivated',
      parentEmotion: 'optimism',
      intensity: 'medium',
      color: '#32CD32'
    },
    peaceful: {
      name: 'peaceful',
      synonyms: ['serene', 'tranquil', 'placid'],
      description: 'Free from disturbance; tranquil',
      parentEmotion: 'optimism',
      intensity: 'low',
      color: '#00FF7F'
    }
  },
  curiosity: {
    eager: {
      name: 'eager',
      synonyms: ['keen', 'enthusiastic', 'impatient'],
      description: 'Having or showing keen interest or enthusiasm',
      parentEmotion: 'curiosity',
      intensity: 'high',
      color: '#DA70D6'
    },
    inquisitive: {
      name: 'inquisitive',
      synonyms: ['curious', 'questioning', 'probing'],
      description: 'Unduly curious about the affairs of others; prying',
      parentEmotion: 'curiosity',
      intensity: 'medium',
      color: '#EE82EE'
    },
    interested: {
      name: 'interested',
      synonyms: ['concerned', 'attentive', 'affected'],
      description: 'Showing curiosity or concern about something or someone',
      parentEmotion: 'curiosity',
      intensity: 'low',
      color: '#D8BFD8'
    }
  },
  anxiety: {
    stressed: {
      name: 'stressed',
      synonyms: ['strained', 'pressured', 'overwhelmed'],
      description: 'Feeling worried or unable to cope with pressure',
      parentEmotion: 'anxiety',
      intensity: 'high',
      color: '#696969'
    },
    nervous: {
      name: 'nervous',
      synonyms: ['anxious', 'apprehensive', 'restless'],
      description: 'Easily agitated or alarmed',
      parentEmotion: 'anxiety',
      intensity: 'medium',
      color: '#808080'
    },
    uneasy: {
      name: 'uneasy',
      synonyms: ['uncomfortable', 'restless', 'disturbed'],
      description: 'Causing or feeling anxiety; troubled or uncomfortable',
      parentEmotion: 'anxiety',
      intensity: 'low',
      color: '#A9A9A9'
    }
  },
  boredom: {
    apathy: {
      name: 'apathy',
      synonyms: ['indifference', 'lethargy', 'passivity'],
      description: 'Lack of interest, enthusiasm, or concern',
      parentEmotion: 'boredom',
      intensity: 'high',
      color: '#BC8F8F'
    },
    bored: {
      name: 'bored',
      synonyms: ['uninterested', 'listless', 'weary'],
      description: 'Feeling weary because one is unoccupied or lacks interest in one\'s current activity',
      parentEmotion: 'boredom',
      intensity: 'medium',
      color: '#CD853F'
    },
    distracted: {
      name: 'distracted',
      synonyms: ['diverted', 'preoccupied', 'inattentive'],
      description: 'Having one\'s attention diverted',
      parentEmotion: 'boredom',
      intensity: 'low',
      color: '#DEB887'
    }
  },
  shame: {
    humiliated: {
      name: 'humiliated',
      synonyms: ['degraded', 'disgraced', 'mortified'],
      description: 'Made to feel ashamed and foolish by injury to one\'s self-respect',
      parentEmotion: 'shame',
      intensity: 'high',
      color: '#4B0082'
    },
    embarrassed: {
      name: 'embarrassed',
      synonyms: ['ashamed', 'self-conscious', 'uncomfortable'],
      description: 'Feeling or showing embarrassment',
      parentEmotion: 'shame',
      intensity: 'medium',
      color: '#483D8B'
    },
    shy: {
      name: 'shy',
      synonyms: ['bashful', 'timid', 'reserved'],
      description: 'Being reserved or having or showing nervousness or timidity in the company of other people',
      parentEmotion: 'shame',
      intensity: 'low',
      color: '#6A5ACD'
    }
  },
  confusion: {
    bewildered: {
      name: 'bewildered',
      synonyms: ['perplexed', 'baffled', 'puzzled'],
      description: 'Puzzled or confused',
      parentEmotion: 'confusion',
      intensity: 'high',
      color: '#D8BFD8'
    },
    confused: {
      name: 'confused',
      synonyms: ['disoriented', 'muddled', 'addled'],
      description: 'Unable to think clearly; bewildered',
      parentEmotion: 'confusion',
      intensity: 'medium',
      color: '#E6E6FA'
    },
    uncertain: {
      name: 'uncertain',
      synonyms: ['unsure', 'doubtful', 'hesitant'],
      description: 'Not able to be relied on; not known or definite',
      parentEmotion: 'confusion',
      intensity: 'low',
      color: '#F8F8FF'
    }
  },
  hurt: {
    devastated: {
      name: 'devastated',
      synonyms: ['shattered', 'destroyed', 'ruined'],
      description: 'Feeling extreme emotional pain',
      parentEmotion: 'hurt',
      intensity: 'high',
      color: '#8B0000'
    },
    hurt: {
      name: 'hurt',
      synonyms: ['wounded', 'injured', 'damaged'],
      description: 'Experiencing emotional pain or distress',
      parentEmotion: 'hurt',
      intensity: 'medium',
      color: '#B22222'
    },
    disappointed: {
      name: 'disappointed',
      synonyms: ['let down', 'discouraged', 'dismayed'],
      description: 'Sad or displeased because someone or something has failed to fulfill one\'s hopes or expectations',
      parentEmotion: 'hurt',
      intensity: 'low',
      color: '#CD5C5C'
    }
  }
};

// Fix the duplicate 'confused' key
// Only including the part that needs to be changed

// Replace the duplicate key with 'puzzled'
const emotionAtIndex268 = { 
  name: 'puzzled', 
  synonyms: ['confused', 'perplexed', 'bewildered'], 
  description: 'Feeling uncertain about how to understand or interpret something',
  parentEmotion: 'confused',
  intensity: 'medium',
  color: '#E5D4C0' 
};

/**
 * Get emotion entry from the wheel by name
 * @param emotionName The name of the emotion to retrieve
 * @returns EmotionEntry or undefined if not found
 */
export const getEmotionFromWheel = (emotionName: string): EmotionEntry | undefined => {
  const lowerName = emotionName.toLowerCase();
  
  for (const parentEmotion in emotionsWheel) {
    if (emotionsWheel.hasOwnProperty(parentEmotion)) {
      const parent = emotionsWheel[parentEmotion];
      
      for (const emotion in parent) {
        if (parent.hasOwnProperty(emotion)) {
          const entry = parent[emotion];
          if (entry.name.toLowerCase() === lowerName || entry.synonyms.some(synonym => synonym.toLowerCase() === lowerName)) {
            return entry;
          }
        }
      }
    }
  }
  
  return undefined;
};

/**
 * Extract emotions from user input
 * @param userInput The user's message
 * @returns Object containing explicit emotion, detected emotion, and social context
 */
export const extractEmotionsFromInput = (userInput: string) => {
  const lowerInput = userInput.toLowerCase();
  
  let explicitEmotion = '';
  let hasDetectedEmotion = false;
  
  // Check for explicit emotion mentions
  const explicitEmotionPatterns = [
    /i feel (.*)/i,
    /i'm feeling (.*)/i,
    /i am feeling (.*)/i,
    /i've been feeling (.*)/i,
    /i was feeling (.*)/i,
    /feeling (.*)/i,
    /i'm (.*)/i,
    /i am (.*)/i
  ];
  
  for (const pattern of explicitEmotionPatterns) {
    const match = lowerInput.match(pattern);
    if (match && match[1]) {
      explicitEmotion = match[1].trim();
      hasDetectedEmotion = true;
      break;
    }
  }
  
  // Detect emotional content
  const emotionalContent = detectEmotionalContent(userInput) || {
    primaryEmotion: null,
    intensity: null,
    description: null,
    hasEmotion: false
  };
  
  // Detect social-emotional context
  const socialContext = detectSocialEmotionalContext(userInput) || {
    primaryEmotion: null,
    intensity: null,
    description: null
  };
  
  return {
    explicitEmotion,
    hasDetectedEmotion,
    emotionalContent,
    socialContext
  };
};
