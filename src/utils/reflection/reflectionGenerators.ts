import { identifyEnhancedFeelings } from './feelingDetection';
import { ContextAwareReflection } from './reflectionTypes';

// Example reflections based on context
export const contextAwareReflections: ContextAwareReflection[] = [
  {
    trigger: ["anxiety", "worried", "nervous", "fear", "stress"],
    response: [
      "It sounds like anxiety is something you're experiencing right now. How does it affect your daily life?",
      "I hear that worry is present for you. What specific thoughts come up when you feel this way?",
      "The anxiety you're describing seems significant. What strategies have you found helpful in managing it?"
    ],
    priority: 7,
    keywords: ["panic", "uneasy", "overwhelming", "tension"]
  },
  {
    trigger: ["lonely", "isolated", "alone", "disconnected"],
    response: [
      "I hear that you're feeling lonely. How long have you been feeling this way?",
      "It sounds like isolation is a challenge for you right now. What makes you feel most disconnected?",
      "The loneliness you're describing seems difficult. What do you usually do when you feel this way?"
    ],
    priority: 6,
    keywords: ["empty", "distant", "secluded", "abandoned"]
  },
  {
    trigger: ["sad", "unhappy", "down", "depressed", "blue"],
    response: [
      "It sounds like sadness is present for you. What has been contributing to these feelings?",
      "I hear that you're feeling down. How does this sadness manifest in your daily life?",
      "The unhappiness you're describing seems significant. What do you usually do to cope with these feelings?"
    ],
    priority: 8,
    keywords: ["grief", "disappointed", "heartbroken", "miserable"]
  },
  {
    trigger: ["angry", "frustrated", "irritated", "annoyed", "furious"],
    response: [
      "It sounds like anger is something you're dealing with. What triggers these feelings for you?",
      "I hear that frustration is present. How does this anger affect your relationships?",
      "The anger you're describing seems intense. What strategies have you found helpful in managing it?"
    ],
    priority: 5,
    keywords: ["rage", "resentment", "bitter", "outraged"]
  },
  {
    trigger: ["excited", "happy", "joyful", "enthusiastic", "thrilled"],
    response: [
      "It sounds like you're feeling excited about something. What are you looking forward to?",
      "I hear that happiness is present for you. How does this joy manifest in your daily life?",
      "The enthusiasm you're describing seems contagious. What makes you feel this way?"
    ],
    priority: 4,
    keywords: ["delighted", "elated", "cheerful", "blissful"]
  },
  {
    trigger: ["confused", "uncertain", "unsure", "puzzled", "disoriented"],
    response: [
      "It sounds like confusion is something you're experiencing. What aspects are unclear to you?",
      "I hear that uncertainty is present. How does this confusion affect your decision-making?",
      "The disorientation you're describing seems challenging. What do you usually do when you feel this way?"
    ],
    priority: 3,
    keywords: ["baffled", "perplexed", "bewildered", "mystified"]
  },
  {
    trigger: ["relieved", "calm", "peaceful", "relaxed", "content"],
    response: [
      "It sounds like you're feeling relieved about something. What has brought you this sense of calm?",
      "I hear that peace is present for you. How does this relaxation manifest in your daily life?",
      "The contentment you're describing seems wonderful. What makes you feel this way?"
    ],
    priority: 2,
    keywords: ["serene", "tranquil", "untroubled", "at ease"]
  },
  {
    trigger: ["overwhelmed", "stressed", "burdened", "pressured", "strained"],
    response: [
      "It sounds like you're feeling overwhelmed by something. What aspects are contributing to this feeling?",
      "I hear that stress is present for you. How does this pressure affect your daily life?",
      "The strain you're describing seems significant. What strategies have you found helpful in managing it?"
    ],
    priority: 9,
    keywords: ["exhausted", "drained", "overtaxed", "overworked"]
  },
  {
    trigger: ["guilty", "remorseful", "ashamed", "regretful", "contrite"],
    response: [
      "It sounds like guilt is something you're grappling with. What actions or thoughts are causing these feelings?",
      "I hear that remorse is present for you. How does this regret affect your self-perception?",
      "The shame you're describing seems difficult. What do you usually do when you feel this way?"
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
  
  // If no specific feelings are detected, return null
  if (enhancedFeelings.length === 0) {
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
