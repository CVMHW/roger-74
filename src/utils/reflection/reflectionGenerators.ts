
import { identifyEnhancedFeelings } from './feelingDetection';
import { ContextAwareReflection, ConversationStage } from './reflectionTypes';

// Example reflections based on context
export const contextAwareReflections: ContextAwareReflection[] = [
  {
    trigger: ["anxiety", "worried", "nervous", "fear", "stress"],
    response: [
      "Sounds like anxiety is showing up for you. What's that like?",
      "I hear that worry coming through. What thoughts are popping up when you feel this way?",
      "Anxiety can be tough. What's been helping you manage it?"
    ],
    priority: 7,
    keywords: ["panic", "uneasy", "overwhelming", "tension"]
  },
  {
    trigger: ["lonely", "isolated", "alone", "disconnected"],
    response: [
      "Feeling lonely is really hard. How long has that been going on?",
      "That isolation sounds tough. What situations make you feel most disconnected?",
      "Being alone can be difficult. How do you usually cope with that feeling?"
    ],
    priority: 6,
    keywords: ["empty", "distant", "secluded", "abandoned"]
  },
  {
    trigger: ["sad", "unhappy", "down", "depressed", "blue"],
    response: [
      "I hear that sadness. What's been contributing to those feelings?",
      "Being down can affect everything. What's that been like for you?",
      "When you're feeling this way, what typically helps?"
    ],
    priority: 8,
    keywords: ["grief", "disappointed", "heartbroken", "miserable"]
  },
  {
    trigger: ["angry", "frustrated", "irritated", "annoyed", "furious"],
    response: [
      "I can hear that frustration. What tends to trigger those feelings?",
      "Being angry can be exhausting. How does it show up in your relationships?",
      "That sounds really frustrating. How do you usually handle those feelings?"
    ],
    priority: 5,
    keywords: ["rage", "resentment", "bitter", "outraged"]
  },
  {
    trigger: ["excited", "happy", "joyful", "enthusiastic", "thrilled"],
    response: [
      "You sound pretty excited! What's got you feeling that way?",
      "That happiness comes through in what you're saying. What's bringing you joy lately?",
      "I'm hearing some real enthusiasm there. What's sparked that?"
    ],
    priority: 4,
    keywords: ["delighted", "elated", "cheerful", "blissful"]
  },
  {
    trigger: ["confused", "uncertain", "unsure", "puzzled", "disoriented"],
    response: [
      "Sounds like you're trying to figure things out. What's feeling unclear?",
      "That uncertainty can be really challenging. How's it affecting your decisions?",
      "Being confused is tough. What helps you find clarity usually?"
    ],
    priority: 3,
    keywords: ["baffled", "perplexed", "bewildered", "mystified"]
  },
  {
    trigger: ["relieved", "calm", "peaceful", "relaxed", "content"],
    response: [
      "That sense of relief comes through. What's helped you find that calm?",
      "You sound pretty peaceful about that. What's contributing to that feeling?",
      "That contentment is nice to hear. What's helped you get to this place?"
    ],
    priority: 2,
    keywords: ["serene", "tranquil", "untroubled", "at ease"]
  },
  {
    trigger: ["overwhelmed", "stressed", "burdened", "pressured", "strained"],
    response: [
      "You sound pretty overwhelmed. What's contributing to that feeling?",
      "That stress comes through in what you're saying. How's that affecting your day-to-day?",
      "Being overwhelmed is exhausting. What's been most challenging?"
    ],
    priority: 9,
    keywords: ["exhausted", "drained", "overtaxed", "overworked"]
  },
  {
    trigger: ["tired", "exhausted", "sleepy", "drained", "fatigued"],
    response: [
      "Being tired affects everything. What's been going on with your sleep?",
      "I hear that exhaustion. What's been draining your energy lately?",
      "That fatigue comes through. What's that been like for you?"
    ],
    priority: 8,
    keywords: ["weary", "worn out", "beat", "spent"]
  },
  {
    trigger: ["guilty", "remorseful", "ashamed", "regretful", "contrite"],
    response: [
      "I can hear that guilt in what you're sharing. What's bringing that up?",
      "That shame can be really painful. How's it affecting you?",
      "Regret is tough to sit with. What's that experience like for you?"
    ],
    priority: 6,
    keywords: ["apologetic", "penitent", "rueful", "compunctious"]
  },
  {
    trigger: ["disappointed", "let down", "discouraged", "crestfallen", "dismayed"],
    response: [
      "It sounds like disappointment is something you're experiencing. What expectations were not met?",
      "I hear that you're feeling let down. How does this discouragement affect your motivation?",
      "The dismay you're describing seems disheartening. What do you usually do when you feel this way?"
    ],
    priority: 5,
    keywords: ["dejected", "disheartened", "saddened", "chagrined"]
  },
  {
    trigger: ["grateful", "thankful", "appreciative", "obliged", "indebted"],
    response: [
      "It sounds like gratitude is something you're feeling. What are you thankful for?",
      "I hear that you're feeling appreciative. How does this gratitude affect your perspective?",
      "The thankfulness you're describing seems uplifting. What makes you feel this way?"
    ],
    priority: 4,
    keywords: ["beholden", "obligated", "beholding", "appreciating"]
  },
  {
    trigger: ["jealous", "envious", "covetous", "resentful", "green-eyed"],
    response: [
      "It sounds like jealousy is something you're struggling with. What do you envy in others?",
      "I hear that you're feeling envious. How does this resentment affect your relationships?",
      "The covetousness you're describing seems challenging. What do you usually do when you feel this way?"
    ],
    priority: 7,
    keywords: ["begrudging", "grudging", "resenting", "envying"]
  },
  {
    trigger: ["rejected", "ostracized", "excluded", "alienated", "abandoned"],
    response: [
      "It sounds like rejection is something you're dealing with. What makes you feel excluded?",
      "I hear that you're feeling ostracized. How does this alienation affect your self-worth?",
      "The abandonment you're describing seems painful. What do you usually do when you feel this way?"
    ],
    priority: 8,
    keywords: ["forsaken", "deserted", "jettisoned", "repudiated"]
  },
  {
    trigger: ["insecure", "vulnerable", "fragile", "defenseless", "exposed"],
    response: [
      "It sounds like insecurity is something you're grappling with. What makes you feel vulnerable?",
      "I hear that you're feeling fragile. How does this defenselessness affect your interactions?",
      "The exposure you're describing seems daunting. What do you usually do when you feel this way?"
    ],
    priority: 6,
    keywords: ["unprotected", "susceptible", "unguarded", "unshielded"]
  },
  {
    trigger: ["optimistic", "hopeful", "positive", "upbeat", "sanguine"],
    response: [
      "It sounds like optimism is something you're embracing. What are you hopeful about?",
      "I hear that you're feeling positive. How does this upbeat attitude affect your outlook?",
      "The sanguinity you're describing seems uplifting. What makes you feel this way?"
    ],
    priority: 3,
    keywords: ["assured", "confident", "expectant", "trusting"]
  },
  {
    trigger: ["pessimistic", "cynical", "negative", "downbeat", "skeptical"],
    response: [
      "It sounds like pessimism is something you're struggling with. What makes you feel cynical?",
      "I hear that you're feeling negative. How does this downbeat attitude affect your motivation?",
      "The skepticism you're describing seems disheartening. What do you usually do when you feel this way?"
    ],
    priority: 7,
    keywords: ["doubtful", "distrustful", "unbelieving", "questioning"]
  },
  {
    trigger: ["nostalgic", "reminiscent", "wistful", "yearning", "longing"],
    response: [
      "It sounds like nostalgia is something you're experiencing. What memories are you cherishing?",
      "I hear that you're feeling reminiscent. How does this wistfulness affect your present?",
      "The yearning you're describing seems bittersweet. What do you usually do when you feel this way?"
    ],
    priority: 4,
    keywords: ["remembering", "recalling", "cherishing", "treasuring"]
  },
  {
    trigger: ["bored", "apathetic", "indifferent", "uninterested", "listless"],
    response: [
      "It sounds like boredom is something you're grappling with. What makes you feel apathetic?",
      "I hear that you're feeling indifferent. How does this uninterest affect your engagement?",
      "The listlessness you're describing seems stagnant. What do you usually do when you feel this way?"
    ],
    priority: 5,
    keywords: ["ennui", "tedium", "monotony", "weariness"]
  },
  {
    trigger: ["inspired", "motivated", "driven", "ambitious", "determined"],
    response: [
      "It sounds like inspiration is something you're embracing. What goals are you pursuing?",
      "I hear that you're feeling motivated. How does this drive affect your actions?",
      "The determination you're describing seems empowering. What makes you feel this way?"
    ],
    priority: 3,
    keywords: ["zealous", "passionate", "eager", "enthusiastic"]
  },
  {
    trigger: ["frustrated", "impatient", "irritated", "exasperated", "aggravated"],
    response: [
      "It sounds like frustration is something you're struggling with. What obstacles are you facing?",
      "I hear that you're feeling impatient. How does this irritation affect your progress?",
      "The exasperation you're describing seems challenging. What do you usually do when you feel this way?"
    ],
    priority: 6,
    keywords: ["annoyed", "vexed", "nettled", "peeved"]
  },
  {
    trigger: ["peaceful", "serene", "tranquil", "calm", "composed"],
    response: [
      "It sounds like peace is something you're experiencing. What brings you this sense of serenity?",
      "I hear that you're feeling tranquil. How does this calmness affect your perspective?",
      "The composure you're describing seems harmonious. What makes you feel this way?"
    ],
    priority: 2,
    keywords: ["placid", "quiet", "restful", "undisturbed"]
  },
  {
    trigger: ["stressed", "anxious", "tense", "uptight", "worried"],
    response: [
      "It sounds like stress is something you're grappling with. What pressures are you facing?",
      "I hear that you're feeling anxious. How does this tension affect your well-being?",
      "The worry you're describing seems overwhelming. What do you usually do when you feel this way?"
    ],
    priority: 8,
    keywords: ["overwhelmed", "strained", "burdened", "pressured"]
  },
  {
    trigger: ["supported", "cared for", "valued", "appreciated", "respected"],
    response: [
      "It sounds like you're feeling supported by others. Who makes you feel valued?",
      "I hear that you're feeling cared for. How does this appreciation affect your outlook?",
      "The respect you're describing seems uplifting. What makes you feel this way?"
    ],
    priority: 3,
    keywords: ["cherished", "esteemed", "regarded", "prized"]
  },
  {
    trigger: ["unsupported", "neglected", "unvalued", "unappreciated", "disrespected"],
    response: [
      "It sounds like you're feeling unsupported by others. Who makes you feel neglected?",
      "I hear that you're feeling unvalued. How does this lack of appreciation affect your self-worth?",
      "The disrespect you're describing seems disheartening. What do you usually do when you feel this way?"
    ],
    priority: 7,
    keywords: ["ignored", "overlooked", "slighted", "slighted"]
  }
];

// Generate a context-aware reflection based on user input
export const generateContextAwareReflection = (input: string): string | null => {
  const lowerInput = input.toLowerCase();
  
  // First, identify enhanced feelings
  const enhancedFeelings = identifyEnhancedFeelings(input);
  
  // If no specific feelings are detected, check for minimal responses (tiredness, etc.)
  if (enhancedFeelings.length === 0) {
    // Check for common minimal expressions
    if (/\b(tired|exhausted|sleepy)\b/i.test(lowerInput)) {
      return "I hear you're feeling tired. What's been going on?";
    }
    if (/\bjust.*tired\b/i.test(lowerInput) || /\ba little tired\b/i.test(lowerInput)) {
      return "Yeah, those tired days can be tough. What's been happening?";
    }
    return null;
  }
  
  // For each detected feeling, find a matching reflection
  for (const feelingData of enhancedFeelings) {
    const { detectedWord, category } = feelingData;
    
    // Find reflections that match the detected feeling
    const matchingReflections = contextAwareReflections.filter(reflection =>
      reflection.trigger.some(triggerWord => lowerInput.includes(triggerWord))
    );
    
    // If no matching reflections are found, continue to the next feeling
    if (matchingReflections.length === 0) {
      continue;
    }
    
    // Select a random reflection from the matching reflections
    const selectedReflection = matchingReflections[Math.floor(Math.random() * matchingReflections.length)];
    
    // Select a random response from the selected reflection
    const selectedResponse = selectedReflection.response[Math.floor(Math.random() * selectedReflection.response.length)];
    
    return selectedResponse;
  }
  
  // If no matching reflections are found for any feelings, return null
  return null;
};

// Add the missing generateReflectionResponse function
export const generateReflectionResponse = (
  userInput: string,
  conversationStage: ConversationStage,
  messageCount: number
): string | null => {
  // Try to generate a context-aware reflection first
  const contextReflection = generateContextAwareReflection(userInput);
  
  if (contextReflection) {
    return contextReflection;
  }
  
  // If no context-specific reflection was generated, return null
  // This will allow the calling code to fall back to other response types
  return null;
};

