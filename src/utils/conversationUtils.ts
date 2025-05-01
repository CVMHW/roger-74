import { MessageType } from '../components/Message';

// Detect potentially crisis-related keywords in user messages
export const detectCrisisKeywords = (message: string): boolean => {
  const crisisKeywords = [
    'suicide', 'kill myself', 'end my life', 'don\'t want to live',
    'hurt myself', 'self harm', 'cutting', 'harming myself',
    'want to die', 'kill', 'murder', 'hurt someone',
    'abuse', 'abusing', 'abused', 'violent', 'violence',
    'emergency', 'crisis', 'danger', 'dangerous',
    'overdose', 'overdosing'
  ];

  const lowerCaseMessage = message.toLowerCase();
  return crisisKeywords.some(keyword => lowerCaseMessage.includes(keyword));
};

// Improved topic detection with broader context understanding
export const detectTopics = (message: string): string[] => {
  const topics = {
    grief: ['died', 'death', 'passed away', 'loss', 'funeral', 'grave', 'miss', 'grief', 'mourning'],
    pets: ['dog', 'cat', 'pet', 'animal', 'vet', 'veterinarian'],
    sleep: ['sleep', 'tired', 'insomnia', 'rest', 'bed', 'nap', 'dream', 'nightmare'],
    family: ['family', 'mom', 'dad', 'mother', 'father', 'sister', 'brother', 'parent', 'child', 'grandparent'],
    relationships: ['relationship', 'partner', 'girlfriend', 'boyfriend', 'husband', 'wife', 'spouse', 'marriage', 'divorce', 'breakup'],
    work: ['job', 'career', 'work', 'boss', 'coworker', 'colleague', 'workplace', 'office', 'fired', 'hired', 'promotion'],
    cultural: ['culture', 'tradition', 'heritage', 'country', 'homeland', 'language', 'customs', 'immigrant', 'refugee', 'foreigner', 'migrated'],
    food: ['food', 'meal', 'cook', 'recipe', 'cuisine', 'dish', 'restaurant', 'spice', 'taste', 'flavor', 'ingredient'],
    religion: ['religion', 'faith', 'belief', 'god', 'spiritual', 'church', 'mosque', 'temple', 'pray', 'worship', 'ritual'],
    weather: ['weather', 'temperature', 'cold', 'hot', 'rain', 'snow', 'sun', 'humid', 'climate']
  };

  const lowerCaseMessage = message.toLowerCase();
  const detectedTopics: string[] = [];
  
  // Check for topics based on keywords
  for (const [topic, keywords] of Object.entries(topics)) {
    if (keywords.some(keyword => lowerCaseMessage.includes(keyword))) {
      detectedTopics.push(topic);
    }
  }
  
  // Check for cultural-specific contexts - immigration mentions
  if (lowerCaseMessage.includes('immigr') || 
      lowerCaseMessage.includes('refugee') || 
      lowerCaseMessage.includes('moved to this country') ||
      lowerCaseMessage.includes('new country')) {
    if (!detectedTopics.includes('cultural')) {
      detectedTopics.push('cultural');
    }
  }
  
  // Add home context when detecting homesickness
  if ((lowerCaseMessage.includes('miss') || lowerCaseMessage.includes('homesick')) && 
      (lowerCaseMessage.includes('home') || lowerCaseMessage.includes('country') || lowerCaseMessage.includes('homeland'))) {
    if (!detectedTopics.includes('cultural')) {
      detectedTopics.push('cultural');
    }
  }

  return detectedTopics;
};

// Detect emotions in user messages with broader context understanding
export const detectEmotion = (message: string): string => {
  const emotions = {
    angry: ['angry', 'mad', 'furious', 'upset', 'annoyed', 'frustrated', 'irritated', 'outraged', 'fed up'],
    sad: ['sad', 'depressed', 'unhappy', 'miserable', 'down', 'blue', 'gloomy', 'heartbroken', 'disappointed', 'grief', 'loss', 'miss', 'lost', 'died', 'passed away'],
    anxious: ['anxious', 'worried', 'nervous', 'scared', 'frightened', 'stressed', 'overwhelmed', 'panicked', 'uneasy'],
    happy: ['happy', 'glad', 'excited', 'joyful', 'pleased', 'delighted', 'thrilled', 'content', 'cheerful'],
    confused: ['confused', 'unsure', 'uncertain', 'puzzled', 'perplexed', 'lost', 'bewildered', 'disoriented']
  };

  const lowerCaseMessage = message.toLowerCase();
  
  // Check for context clues beyond just keywords
  if (lowerCaseMessage.includes('died') || lowerCaseMessage.includes('passed away') || 
      lowerCaseMessage.includes('miss') || lowerCaseMessage.includes('lost someone')) {
    return 'grief';
  }
  
  for (const [emotion, keywords] of Object.entries(emotions)) {
    if (keywords.some(keyword => lowerCaseMessage.includes(keyword))) {
      return emotion;
    }
  }

  // Try to infer emotion from context if no explicit keywords
  if (lowerCaseMessage.includes('can\'t sleep') || lowerCaseMessage.includes('tired')) {
    return 'distressed';
  }

  return 'neutral';
};

// Generate a unique ID for messages
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};

// Create a new message object
export const createMessage = (text: string, sender: 'user' | 'roger'): MessageType => {
  return {
    id: generateId(),
    text,
    sender,
    timestamp: new Date(),
    feedback: null
  };
};

// Enhanced conversation context to track more topics
let conversationContext: {
  personalDetails?: {[key: string]: string},
  currentEmotion?: string,
  mentionedPets?: boolean,
  mentionedSleep?: boolean,
  waitingForTherapist?: boolean,
  previousTopics?: string[],
  culturalContext?: {
    country?: string,
    foodPreferences?: string[],
    religion?: string,
    language?: string
  },
  feedbackHistory?: {[messageId: string]: 'positive' | 'negative'}
} = {
  personalDetails: {},
  previousTopics: [],
  culturalContext: {},
  feedbackHistory: {}
};

// Extract cultural context from messages
export const extractCulturalContext = (message: string): void => {
  const lowerCaseMessage = message.toLowerCase();
  
  // Extract country of origin
  const countryKeywords = [
    'pakistan', 'india', 'china', 'japan', 'korea', 'mexico', 'syria', 
    'iraq', 'iran', 'afghanistan', 'ukraine', 'russia', 'somalia', 
    'ethiopia', 'nigeria', 'ghana', 'brazil', 'colombia', 'venezuela'
  ];
  
  for (const country of countryKeywords) {
    if (lowerCaseMessage.includes(country)) {
      if (conversationContext.culturalContext) {
        conversationContext.culturalContext.country = country;
      }
      break;
    }
  }
  
  // Extract food preferences
  const foodKeywords = ['spicy', 'curry', 'rice', 'noodle', 'bread', 'tortilla', 'spice'];
  const detectedFoods: string[] = [];
  
  for (const food of foodKeywords) {
    if (lowerCaseMessage.includes(food)) {
      detectedFoods.push(food);
    }
  }
  
  if (detectedFoods.length > 0 && conversationContext.culturalContext) {
    conversationContext.culturalContext.foodPreferences = [
      ...(conversationContext.culturalContext.foodPreferences || []),
      ...detectedFoods
    ];
  }
};

// Store feedback on messages
export const storeFeedback = (messageId: string, feedback: 'positive' | 'negative'): void => {
  if (!conversationContext.feedbackHistory) {
    conversationContext.feedbackHistory = {};
  }
  
  conversationContext.feedbackHistory[messageId] = feedback;
};

// Get response based on detected topic and conversation context
export const getResponseBasedOnTopic = (message: string): string => {
  const topics = detectTopics(message);
  const emotion = detectEmotion(message);
  const lowerCaseMessage = message.toLowerCase();
  
  // Update conversation context with detected topics
  if (!conversationContext.previousTopics) {
    conversationContext.previousTopics = [];
  }
  
  conversationContext.previousTopics = [
    ...conversationContext.previousTopics,
    ...topics.filter(topic => !conversationContext.previousTopics?.includes(topic))
  ];
  
  // Extract any cultural context
  extractCulturalContext(message);
  
  // Update emotional state
  conversationContext.currentEmotion = emotion;
  
  // Cultural adaptation responses
  if (topics.includes('cultural')) {
    // Homesickness and cultural adjustment
    if (lowerCaseMessage.includes('miss') && 
        (lowerCaseMessage.includes('home') || lowerCaseMessage.includes('country'))) {
      
      return `Being in a new place can feel really isolating sometimes. I've heard from others that missing home - the familiar sights, sounds, and especially people - can be really tough. What do you miss most about home? Some folks find that keeping small traditions from home helps, like cooking familiar foods or connecting with people who share your background. What's helped you feel connected so far?`;
    }
    
    // Food-related cultural adaptation
    if (topics.includes('food') && 
        (lowerCaseMessage.includes('spice') || lowerCaseMessage.includes('bland') || 
         lowerCaseMessage.includes('miss') || lowerCaseMessage.includes('cook'))) {
      
      return `Food is such a core part of feeling at home somewhere. I've heard from many people that American food can seem really bland compared to the rich flavors from many other cultures. Have you found any restaurants or grocery stores that carry more familiar ingredients? Sometimes finding those small tastes of home can make a huge difference. What dishes do you miss the most?`;
    }
    
    // General cultural adaptation
    return `Adapting to a new culture can be such a complex experience - there are the obvious challenges like language, but also so many subtle differences in how people interact. Some days it probably feels overwhelming, and other days maybe you notice small wins. What's something that's felt particularly difficult lately? Or have you had any positive experiences connecting with people here?`;
  }
  
  // Pet loss response
  if (topics.includes('pets') && topics.includes('grief')) {
    return `I'm really sorry about your pet. Losing a companion like that is genuinely hard - they're family members in every way that matters. It's completely normal to be grieving. When my neighbor lost her dog last year, she said the house felt empty for weeks. Give yourself permission to feel sad about this loss - it's important and real.`;
  }
  
  // Combined pet loss and sleep issues
  if (topics.includes('pets') && topics.includes('sleep') && topics.includes('grief')) {
    return `I'm so sorry about your loss. Pets are such important parts of our routines and comfort, especially at bedtime. That empty space beside you can make sleep really difficult. Have you tried keeping something of theirs nearby when you sleep? Some people find having their pet's favorite blanket or toy helps them feel connected. Sleep disruption after loss is completely normal, but it definitely adds to the difficulty because everything feels harder when you're tired.`;
  }

  // Waiting for therapist when frustrated
  if (lowerCaseMessage.includes('therapist') && 
      (lowerCaseMessage.includes('late') || lowerCaseMessage.includes('wait')) && 
      emotion === 'angry') {
    
    return `Yeah, I totally get the frustration of waiting when you've already set time aside for this appointment. It can feel disrespectful of your time. For what it's worth, sometimes therapists get caught in situations they can't easily step away from - like if someone's in crisis. But your time matters too, and it's completely valid to feel annoyed about this. Would it help to talk about what's been on your mind lately while we wait, or would you prefer I check how much longer it might be?`;
  }

  // General responses based on emotion with authentic language
  switch (emotion) {
    case 'angry':
      return "I can definitely tell this is frustrating for you. Sometimes it helps to just vent it out - I'm all ears if you want to talk more about what's going on. No judgment here.";
    case 'sad':
    case 'grief':
      return "I'm really sorry you're going through this tough time. Sadness can be really heavy to carry around. Sometimes just having someone listen can help a little. What's been the hardest part for you lately?";
    case 'anxious':
      return "Anxiety is rough - I've definitely been there. When my mind starts racing, it's hard to slow it down. What kinds of things have helped you manage anxiety before, even if just a little bit?";
    case 'happy':
      return "It's awesome to hear something positive is happening for you! Those good moments are worth hanging onto. What's contributing to your good mood today?";
    case 'confused':
      return "Sounds like you're trying to make sense of some complicated stuff. Sometimes talking through things out loud can help sort through the mental clutter. Want to walk me through what you're trying to figure out?";
    case 'distressed':
      return "That sounds really difficult. When I'm having trouble sleeping it affects everything else too. Have you found anything that helps you relax before bed, even just a little bit?";
    default:
      return "Thanks for sharing that with me. I'm curious to hear more about what's been on your mind today. Sometimes it helps to talk things through with someone while you wait for your therapist.";
  }
};

// Create varied responses to avoid repetition
export const getVariedResponse = (messageType: string): string => {
  const responses = {
    acknowledgment: [
      "I appreciate you sharing that.",
      "Thanks for telling me about this.",
      "That makes a lot of sense.",
      "I can see why you'd feel that way.",
      "Thanks for opening up about this stuff."
    ],
    support: [
      "I'm here to chat while you wait for your therapist.",
      "I'm not a therapist, but I'm here to listen and support you.",
      "Sometimes it helps just having someone to talk to while you wait.",
      "I'm glad we can talk while your therapist becomes available.",
      "Feel free to share whatever's on your mind - that's what I'm here for."
    ],
    exploration: [
      "What's been on your mind lately?",
      "How has this been affecting you day-to-day?",
      "What do you think would help most right now?",
      "Have you talked with anyone else about this?",
      "What aspect of this situation feels most important to you right now?"
    ]
  };
  
  // Get response that hasn't been used recently
  const category = responses[messageType as keyof typeof responses];
  let availableResponses = category.filter(r => !previousResponses.includes(r));
  
  // If all responses have been used, reset the history
  if (availableResponses.length === 0) {
    previousResponses = [];
    availableResponses = category;
  }
  
  // Choose a random response from available ones
  const chosenResponse = availableResponses[Math.floor(Math.random() * availableResponses.length)];
  
  // Add to used responses
  previousResponses.push(chosenResponse);
  if (previousResponses.length > 10) {
    previousResponses.shift(); // Keep the history manageable
  }
  
  return chosenResponse;
};

// Initial messages from Roger
export const getInitialMessages = (): MessageType[] => {
  return [
    createMessage(
      "Hey there! I'm Roger. I work with the team here at Cuyahoga Valley to provide some support while you wait for your therapist. How are you doing today?",
      'roger'
    ),
    createMessage(
      "Just so you know, I'm not a therapist myself - I'm more like a peer support person. But I'm happy to chat about whatever's on your mind until your therapist is available.",
      'roger'
    )
  ];
};

export const getIntroductionMessage = (): string => {
  return "Hey! I'm Roger, one of the peer support staff here. I'm here to chat while you're waiting to connect with your therapist. I'm not a therapist myself, but I'm happy to talk through whatever's on your mind. What's been going on with you lately?";
};

export const getCrisisMessage = (): string => {
  return "Hey, I notice you mentioned something that sounds pretty serious. If you're in a crisis situation, there are some really good resources I can connect you with right away. Your wellbeing is super important, and getting immediate professional support would be the best move right now. Would you like me to ask your therapist to contact you ASAP?";
};

// Function to generate more natural, conversational responses with cultural awareness
export const generateConversationalResponse = (userMessage: string): string => {
  // Get base response for topic
  let response = getResponseBasedOnTopic(userMessage);
  
  // Add natural speech patterns and avoid formulaic structure
  // Don't always use the same structure of acknowledgment + support + question
  
  // Randomly decide if we should add an acknowledgment (70% chance)
  if (Math.random() < 0.7) {
    const acknowledgment = getVariedResponse('acknowledgment');
    
    // Don't always put acknowledgment at the beginning
    if (Math.random() < 0.3 && !response.includes("?")) {
      response = `${response} ${acknowledgment.toLowerCase()}`;
    } else {
      response = `${acknowledgment} ${response}`;
    }
  }
  
  // Only sometimes add a support statement (40% chance)
  if (Math.random() < 0.4) {
    const supportStatement = getVariedResponse('support');
    
    // Place support statement at different positions
    if (Math.random() < 0.5) {
      response = `${response} ${supportStatement}`;
    } else {
      const sentences = response.split(/(?<=[.!?]) /);
      if (sentences.length > 1) {
        sentences.splice(1, 0, supportStatement);
        response = sentences.join(" ");
      } else {
        response = `${response} ${supportStatement}`;
      }
    }
  }
  
  // Add casual language markers occasionally
  if (Math.random() < 0.3) {
    const casualMarkers = [
      "You know,",
      "I mean,",
      "Like,",
      "So,",
      "Well,"
    ];
    const casualMarker = casualMarkers[Math.floor(Math.random() * casualMarkers.length)];
    if (Math.random() < 0.5) {
      response = `${casualMarker} ${response.charAt(0).toLowerCase()}${response.slice(1)}`;
    } else {
      const sentences = response.split(/(?<=[.!?]) /);
      if (sentences.length > 1) {
        const randomIndex = Math.floor(Math.random() * (sentences.length - 1)) + 1;
        sentences[randomIndex] = `${casualMarker} ${sentences[randomIndex].charAt(0).toLowerCase()}${sentences[randomIndex].slice(1)}`;
        response = sentences.join(" ");
      }
    }
  }
  
  return response;
};
