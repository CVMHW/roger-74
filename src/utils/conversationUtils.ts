
import { MessageType } from '../components/Message';

// Store previously used responses to avoid repetition
let previousResponses: string[] = [];

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
  feedbackHistory?: {[messageId: string]: 'positive' | 'negative'},
  mentionedFamilyMembers?: string[],
  hobbies?: string[],
  sportTeams?: string[],
  religiousContext?: string,
  experiencedTrauma?: boolean,
  copingStrategies?: string[],
  identityFactors?: string[],
  lifestageContext?: string  // e.g., student, new parent, retiree
} = {
  personalDetails: {},
  previousTopics: [],
  culturalContext: {},
  feedbackHistory: {},
  mentionedFamilyMembers: [],
  hobbies: [],
  sportTeams: [],
  copingStrategies: []
};

// Extract cultural context from messages
export const extractCulturalContext = (message: string): void => {
  const lowerCaseMessage = message.toLowerCase();
  
  // Extract country of origin - greatly expanded list
  const countryKeywords = [
    'pakistan', 'india', 'china', 'japan', 'korea', 'mexico', 'syria', 
    'iraq', 'iran', 'afghanistan', 'ukraine', 'russia', 'somalia', 
    'ethiopia', 'nigeria', 'ghana', 'brazil', 'colombia', 'venezuela',
    'bangladesh', 'nepal', 'bhutan', 'myanmar', 'thailand', 'vietnam',
    'cambodia', 'laos', 'philippines', 'malaysia', 'indonesia',
    'egypt', 'morocco', 'algeria', 'tunisia', 'libya', 'sudan',
    'kenya', 'tanzania', 'uganda', 'rwanda', 'burundi',
    'poland', 'hungary', 'romania', 'bulgaria', 'czech',
    'slovakia', 'germany', 'france', 'italy', 'spain', 'portugal',
    'greece', 'turkey', 'azerbaijan', 'armenia', 'georgia',
    'kazakhstan', 'uzbekistan', 'turkmenistan', 'kyrgyzstan', 'tajikistan'
  ];
  
  for (const country of countryKeywords) {
    if (lowerCaseMessage.includes(country)) {
      if (conversationContext.culturalContext) {
        conversationContext.culturalContext.country = country;
      }
      break;
    }
  }
  
  // Extract food preferences - expanded
  const foodKeywords = [
    'spicy', 'curry', 'rice', 'noodle', 'bread', 'tortilla', 'spice',
    'masala', 'chili', 'hot', 'flavor', 'taste', 'bland', 'cooking',
    'dish', 'meal', 'breakfast', 'lunch', 'dinner', 'snack',
    'restaurant', 'home-cooked', 'recipe', 'ingredient', 'cuisine',
    'traditional', 'street food', 'feast', 'celebration food',
    'sweets', 'dessert', 'savory', 'bitter', 'sour', 'umami'
  ];
  
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
  
  // Extract religious context
  const religionKeywords = [
    'islam', 'muslim', 'mosque', 'quran', 'ramadan', 'eid', 
    'hindu', 'temple', 'buddhist', 'buddhism', 'christian', 'church', 
    'catholic', 'protestant', 'bible', 'pray', 'prayer', 'worship', 
    'faith', 'belief', 'god', 'spiritual', 'religion', 'religious',
    'jewish', 'judaism', 'synagogue', 'torah', 'sikh', 'sikhism', 'gurdwara',
    'jain', 'jainism', 'zoroastrian', 'zoroastrianism', 'baha\'i',
    'atheist', 'agnostic', 'secular'
  ];
  
  for (const religion of religionKeywords) {
    if (lowerCaseMessage.includes(religion)) {
      conversationContext.religiousContext = religion;
      if (conversationContext.culturalContext) {
        conversationContext.culturalContext.religion = religion;
      }
      break;
    }
  }
  
  // Extract language references
  const languageKeywords = [
    'language', 'speak', 'accent', 'understand', 'translation', 'translator',
    'english', 'spanish', 'hindi', 'urdu', 'mandarin', 'arabic', 
    'bengali', 'french', 'russian', 'portuguese', 'german',
    'japanese', 'punjabi', 'javanese', 'vietnamese', 'telugu', 
    'marathi', 'turkish', 'korean', 'tamil', 'italian',
    'persian', 'farsi', 'dari', 'pashto', 'ukrainian'
  ];
  
  for (const language of languageKeywords) {
    if (lowerCaseMessage.includes(language)) {
      if (conversationContext.culturalContext) {
        conversationContext.culturalContext.language = language;
      }
      break;
    }
  }
  
  // Extract family context
  const familyKeywords = [
    'family', 'mother', 'father', 'mom', 'dad', 'sister', 'brother',
    'aunt', 'uncle', 'cousin', 'grandmother', 'grandfather', 'grandma',
    'grandpa', 'wife', 'husband', 'spouse', 'child', 'children',
    'son', 'daughter', 'parent', 'parents', 'sibling', 'relatives'
  ];
  
  for (const familyMember of familyKeywords) {
    if (lowerCaseMessage.includes(familyMember) && 
        !conversationContext.mentionedFamilyMembers?.includes(familyMember)) {
      conversationContext.mentionedFamilyMembers = [
        ...(conversationContext.mentionedFamilyMembers || []),
        familyMember
      ];
    }
  }
  
  // Extract hobbies and activities
  const hobbyKeywords = [
    'hobby', 'cricket', 'soccer', 'football', 'basketball', 'baseball',
    'tennis', 'volleyball', 'swimming', 'dancing', 'singing', 'music',
    'reading', 'writing', 'art', 'painting', 'drawing', 'crafts',
    'cooking', 'baking', 'gardening', 'hiking', 'camping', 'fishing',
    'hunting', 'biking', 'running', 'yoga', 'meditation', 'exercise',
    'gym', 'workout', 'chess', 'game', 'gaming', 'video games',
    'movies', 'film', 'theater', 'play', 'concert', 'festival'
  ];
  
  for (const hobby of hobbyKeywords) {
    if (lowerCaseMessage.includes(hobby) && 
        !conversationContext.hobbies?.includes(hobby)) {
      conversationContext.hobbies = [
        ...(conversationContext.hobbies || []),
        hobby
      ];
    }
  }
  
  // Extract trauma indicators (to approach with care)
  const traumaKeywords = [
    'war', 'violence', 'attack', 'bomb', 'shooting', 'assault', 'abuse',
    'rape', 'trauma', 'ptsd', 'flashback', 'nightmare', 'scared', 'afraid',
    'forced', 'threat', 'threatened', 'unsafe', 'danger', 'torture',
    'persecution', 'flee', 'escape', 'refugee camp'
  ];
  
  if (traumaKeywords.some(keyword => lowerCaseMessage.includes(keyword))) {
    conversationContext.experiencedTrauma = true;
  }
  
  // Extract coping strategies
  const copingKeywords = [
    'cope', 'coping', 'manage', 'dealing', 'helps me', 'support',
    'therapy', 'medication', 'exercise', 'meditation', 'prayer',
    'talking', 'journal', 'music', 'breathing', 'techniques',
    'group', 'community', 'friend', 'family'
  ];
  
  for (const strategy of copingKeywords) {
    if (lowerCaseMessage.includes(strategy) && 
        !conversationContext.copingStrategies?.includes(strategy)) {
      conversationContext.copingStrategies = [
        ...(conversationContext.copingStrategies || []),
        strategy
      ];
    }
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
  
  // Cultural adaptation responses - greatly expanded
  if (topics.includes('cultural')) {
    // Homesickness responses - expanded variety
    if (lowerCaseMessage.includes('miss') && 
        (lowerCaseMessage.includes('home') || lowerCaseMessage.includes('country'))) {
      
      const culturalHomesicknessResponses = [
        `Being in a new place can feel really isolating sometimes. I've heard from others that missing home - the familiar sights, sounds, and especially people - can be really tough. What do you miss most about home? Some folks find that keeping small traditions from home helps, like cooking familiar foods or connecting with people who share your background.`,
        
        `It's so hard to be far from home, especially when you didn't fully choose to leave. The sense of missing everything familiar is really valid. Have you found any small ways to bring pieces of home into your life here? Sometimes even small things like music or foods can help bridge that gap a little.`,
        
        `I hear that homesickness in your voice. It's such a deep feeling - not just missing people but missing all those little things that make a place feel like home. The smells, the sounds, even the way the air feels. Is there something specific you've been missing most lately?`,
        
        `That homesickness is really tough to deal with. Being separated from everything that feels comfortable and familiar can be really disorienting. Some people I've talked to say finding others from their home country helps, while others say that actually makes them miss it more. What's been your experience?`,
        
        `Missing home is such a complex feeling. There's the obvious parts like family and friends, but then there are all these subtle things too - the rhythm of daily life, familiar foods, jokes that don't need explanation, cultural references that everyone gets. It's a lot to carry. What parts of home have been on your mind lately?`
      ];
      
      return getRandomResponse(culturalHomesicknessResponses);
    }
    
    // Food-related cultural adaptation - expanded variety
    if (topics.includes('food') && 
        (lowerCaseMessage.includes('spice') || lowerCaseMessage.includes('bland') || 
         lowerCaseMessage.includes('miss') || lowerCaseMessage.includes('cook'))) {
      
      const culturalFoodResponses = [
        `Food is such a core part of feeling at home somewhere. I've heard from many people that American food can seem really bland compared to the rich flavors from many other cultures. Have you found any restaurants or grocery stores that carry more familiar ingredients? Sometimes finding those small tastes of home can make a huge difference.`,
        
        `The food adjustment can be so hard! When the flavors around you don't match what your taste buds are expecting, it's like a daily reminder you're somewhere new. There's an international market on Cleveland Ave that some folks I've talked to really like - they say they can find spices and ingredients from back home. Have you had any luck finding places like that?`,
        
        `Oh yeah, the bland food struggle is real. One person I was talking with said they carry a little container of their favorite spice mix everywhere just to add to restaurant food! It's wild how important those familiar tastes become when everything else is new. Have you found any workarounds that help?`,
        
        `I get that completely. Food is so tied to memory and comfort. When you can't recreate those familiar tastes, it's like losing a connection to home. Some people I've talked with have found cooking communities where they can share recipes and techniques from their home countries. Would something like that interest you?`,
        
        `Food is such a direct line to our cultural identity. When you can't access the flavors and dishes that are meaningful to you, it really compounds that feeling of being out of place. Have you been able to cook any dishes from home? Or found any restaurants that come close to the real thing?`
      ];
      
      return getRandomResponse(culturalFoodResponses);
    }
    
    // Family separation responses
    if (conversationContext.mentionedFamilyMembers && conversationContext.mentionedFamilyMembers.length > 0) {
      const familySeparationResponses = [
        `Being separated from family is one of the hardest parts of moving to a new country. Those connections are so important. How often are you able to be in touch with them? I know sometimes technology helps bridge the gap a bit, but it's still not the same as being together.`,
        
        `I can hear how much you miss your family. That separation adds another layer to everything you're going through. Some people tell me they schedule regular video calls to maintain connection, but I know those can sometimes make you miss them even more. How has that been for you?`,
        
        `Family separation is such a difficult experience. Especially when there are important life events happening that you can't be present for. Have you found any ways to stay connected that help, even a little bit? Some people I talk with say they send voice messages back and forth throughout the day.`,
        
        `Missing family is such a deep ache. I've heard from others that holidays and special occasions can be particularly tough times. How have you been handling those moments? Some people try to connect with community here, while others prefer to honor their traditions in their own way.`,
        
        `When you mention missing your family, it reminds me how central those relationships are to our sense of belonging. Being physically distant from them while navigating a new culture is a lot to handle. What's been your experience with building a support network here? Some people find community through cultural or religious organizations.`
      ];
      
      return getRandomResponse(familySeparationResponses);
    }
    
    // Language barrier responses
    if (lowerCaseMessage.includes('language') || lowerCaseMessage.includes('speak') || 
        lowerCaseMessage.includes('english') || lowerCaseMessage.includes('understand')) {
      
      const languageBarrierResponses = [
        `Language barriers can be so frustrating and isolating. It's exhausting having to translate everything in your head all day. And sometimes the subtle meanings get lost even when you know the words. How has that been affecting your day-to-day interactions?`,
        
        `Dealing with language differences adds such a challenge to everything else you're navigating. I've heard from others that it can be really draining to communicate in a non-native language all day - like your brain is always working overtime. Has that been your experience too?`,
        
        `Language barriers can really impact how connected you feel to the people around you. It's hard to express your full personality, your humor, your intelligence when you're working with limited vocabulary. That must be really frustrating sometimes. What situations have been most challenging?`,
        
        `I can imagine how difficult it is when language gets in the way of expressing yourself fully. One person told me they felt like a different version of themselves in English - more simple, less nuanced. That's a lot to deal with on top of everything else. How has that affected your interactions here?`,
        
        `The language adjustment is such a significant hurdle. Some people tell me they get headaches from the mental effort of translating all day. Others say they avoid certain situations because the language barrier feels too overwhelming. Have you found any strategies that make communication a bit easier?`
      ];
      
      return getRandomResponse(languageBarrierResponses);
    }
    
    // Religious/spiritual practice changes
    if (conversationContext.religiousContext || lowerCaseMessage.includes('pray') || 
        lowerCaseMessage.includes('worship') || lowerCaseMessage.includes('religion')) {
      
      const religiousPracticeResponses = [
        `Maintaining religious or spiritual practices in a new country can be really challenging. Finding community, places of worship, or even the right foods for religious observances takes extra effort. How has that transition been for you?`,
        
        `I've heard from many people that their faith or spiritual practice becomes even more important during times of transition, but sometimes it's harder to maintain those practices in a new environment. Has that been true for your experience?`,
        
        `Religious and cultural practices are often so intertwined. When you're in a place with different dominant beliefs, it can feel isolating to maintain your traditions. Have you been able to find a community that shares your practices or beliefs?`,
        
        `For many people I talk with, religious practices provide stability and comfort during challenging transitions. But it can be difficult to find the right space or community for those practices in a new country. What has your experience been with maintaining those important traditions?`,
        
        `Spiritual and religious practices can be such an anchor during difficult times. Some people tell me they've had to adapt their practices to fit their new circumstances, while others work hard to maintain them exactly as they were at home. How have you been navigating that?`
      ];
      
      return getRandomResponse(religiousPracticeResponses);
    }
    
    // General cultural adaptation - expanded responses
    const culturalAdaptationResponses = [
      `Adapting to a new culture can be such a complex experience - there are the obvious challenges like language, but also so many subtle differences in how people interact. Some days it probably feels overwhelming, and other days maybe you notice small wins. What's something that's felt particularly difficult lately?`,
      
      `Moving between cultures is such a profound adjustment. There's a concept called "cultural bereavement" that recognizes we actually grieve for the culture we've left behind. It's not just about missing people, but missing a whole way of being in the world. How has that adjustment process been feeling for you?`,
      
      `Being in a new cultural environment means constantly navigating unfamiliar social rules and expectations. That takes so much mental energy! Some people describe it as feeling like they can never fully relax. Has that been part of your experience?`,
      
      `Navigating between cultures can feel like you're constantly code-switching - adjusting how you talk, act, even how you express emotions. Some people say they feel caught between worlds, not fully belonging in either place. Does that resonate with your experience at all?`,
      
      `When you're adapting to a new culture, it can be hard to know which parts of yourself to hold onto and which parts might need to flex. Some people I talk with worry about losing important pieces of their identity, while others are eager to adapt. Where do you find yourself on that spectrum?`,
      
      `Cultural transitions often come with these moments of disconnect - where something happens and you realize your assumptions about how things work just don't apply here. Those moments can be really disorienting. Have you had experiences like that lately?`,
      
      `Finding your place in a new culture often means building a new support network from scratch. That takes time and energy when you're already dealing with so many other challenges. How has the process of building connections been going for you?`,
      
      `When you move to a new country, sometimes the hardest part isn't the big obvious differences, but all the small daily things that just work differently - how to pay bills, where to shop, how the healthcare system works. Those practical challenges can really add up. What's been most confusing to navigate?`
    ];
    
    return getRandomResponse(culturalAdaptationResponses);
  }
  
  // Pet loss response - expanded variety
  if (topics.includes('pets') && topics.includes('grief')) {
    const petLossResponses = [
      `I'm really sorry about your pet. Losing a companion like that is genuinely hard - they're family members in every way that matters. It's completely normal to be grieving. When my neighbor lost her dog last year, she said the house felt empty for weeks. Give yourself permission to feel sad about this loss - it's important and real.`,
      
      `Losing a pet can hit so hard. They're there for all these intimate moments in our lives - they see us at our most authentic, you know? There's no replacing that kind of bond. My friend described it as losing a family member who never judged him, just offered unconditional love. That absence is really felt.`,
      
      `I'm so sorry to hear about your pet's passing. That's such a profound loss. Pets become so interwoven with our daily routines and emotional lives. Someone once told me that grief is really just love with nowhere to go, and that always stuck with me when thinking about pet loss. How long were you and your pet together?`,
      
      `Losing a pet can create this empty space that nothing else quite fills. They have such unique personalities and ways of connecting with us. One person I talked with said they missed even the annoying things their cat would do - like knocking things off counters at 5am. Those quirks become part of what we love. What things do you miss most?`,
      
      `I'm really sorry about your pet. That bond is so special and losing it can be devastating. Pets are witnesses to our lives in such an intimate way - they're there through breakups, moves, good days and bad days. And they love us through it all. It's completely understandable to be really hurting right now.`
    ];
    
    return getRandomResponse(petLossResponses);
  }
  
  // Combined pet loss and sleep issues - expanded variety
  if (topics.includes('pets') && topics.includes('sleep') && topics.includes('grief')) {
    const petLossSleepResponses = [
      `I'm so sorry about your loss. Pets are such important parts of our routines and comfort, especially at bedtime. That empty space beside you can make sleep really difficult. Have you tried keeping something of theirs nearby when you sleep? Some people find having their pet's favorite blanket or toy helps them feel connected.`,
      
      `Sleep disruption after losing a pet is so common. They're often such a comforting presence at night - their warmth, their breathing sounds, even just knowing they're there. It's hard when that comfort is suddenly gone. One person I talked with said they recorded the sound of their dog snoring before he passed, and playing that softly helped them fall asleep during those first difficult weeks.`,
      
      `That combination of grief and sleep troubles can be so hard. When you're already missing your pet, being awake at night gives your mind more time to feel that absence. And then being tired makes everything feel harder during the day. It's a tough cycle. Some people find that creating a new bedtime routine can help, even though it doesn't replace what you've lost.`,
      
      `I'm really sorry you're going through this. The sleep aspect of pet loss can be so difficult - they're often such a source of comfort and security at night. And when you're tired, everything else feels harder to cope with too. Have you found anything that helps, even a little bit, with sleep? Some people say even small changes to their sleeping environment helps create a new normal.`,
      
      `That's such a difficult combination - grieving your pet and struggling with sleep. They leave such a physical absence, especially at night when they would have been right there with you. And good sleep is so important for processing grief. It's like one problem compounds the other. Would it help to talk about what your sleep routine was like when your pet was with you?`
    ];
    
    return getRandomResponse(petLossSleepResponses);
  }

  // Waiting for therapist when frustrated - expanded variety
  if (lowerCaseMessage.includes('therapist') && 
      (lowerCaseMessage.includes('late') || lowerCaseMessage.includes('wait')) && 
      emotion === 'angry') {
    
    const therapistWaitingResponses = [
      `Yeah, I totally get the frustration of waiting when you've already set time aside for this appointment. It can feel disrespectful of your time. For what it's worth, sometimes therapists get caught in situations they can't easily step away from - like if someone's in crisis. But your time matters too, and it's completely valid to feel annoyed about this.`,
      
      `Waiting can be really frustrating, especially when you've mentally prepared yourself for this conversation. And therapy appointments often require some emotional preparation, so the wait can feel even more disruptive. Would you like me to check how much longer it might be? Or is there something specific that was on your mind to discuss today?`,
      
      `I hear that frustration. When you make the effort to show up - both physically and mentally - for an appointment, it's reasonable to expect the same from the professional you're meeting with. How long have you been working with this therapist? Has this been a recurring issue?`,
      
      `It's definitely frustrating when your time isn't respected. You made the effort to be here, and now you're stuck waiting. That would irritate me too. Sometimes there are unavoidable delays in healthcare settings, but that doesn't make the waiting any less annoying. Is there anything I can do that might help make the wait a bit more bearable?`,
      
      `You have every right to be annoyed about waiting. Your time is valuable. And there's something particularly frustrating about waiting for a mental health appointment - you've likely put yourself in a certain headspace for this conversation. Would it help to talk about what you were hoping to discuss today? Or would you prefer I check on how much longer the wait might be?`
    ];
    
    return getRandomResponse(therapistWaitingResponses);
  }

  // General responses based on emotion with authentic language - massively expanded
  switch (emotion) {
    case 'angry':
      const angryResponses = [
        "I can definitely tell this is frustrating for you. Sometimes it helps to just vent it out - I'm all ears if you want to talk more about what's going on. No judgment here.",
        
        "That sounds really infuriating. I can hear how upset you are about this, and honestly, it makes sense why you'd feel that way. Sometimes just naming exactly what's making you angry can help get it out of your system a bit.",
        
        "Yeah, that would make me mad too. When stuff like that happens, it's completely natural to feel frustrated and angry. Do you want to talk more about it, or would it be better to shift to something else for a bit?",
        
        "It sounds like you're dealing with some really frustrating circumstances. That kind of thing can really get under your skin. What do you think would help you process some of that anger right now?",
        
        "I'm picking up on some pretty understandable frustration in what you're saying. Sometimes anger is actually a really appropriate response to a situation - it can be a signal that something isn't right or that a boundary has been crossed. Does that resonate?",
        
        "That sounds really aggravating. When I'm feeling that kind of frustration, sometimes I need to vent and sometimes I need to problem-solve. Which would be more helpful for you right now?",
        
        "I hear that anger in your voice, and honestly, it makes complete sense given what you're describing. Anger often comes up when we feel something is unfair or when we're not being heard. Has that been your experience?",
        
        "That situation would frustrate anyone. Sometimes anger is actually protective - it's our mind's way of saying 'this isn't okay.' What parts of this situation feel most unfair to you?",
        
        "It's totally valid to feel angry about that. Anger is often a sign that something important to us is being threatened or disrespected. What values or needs of yours do you feel are being compromised in this situation?",
        
        "I can hear how irritated you are by this whole thing. Sometimes anger builds up when we've been patient for too long. How long has this situation been going on?"
      ];
      return getRandomResponse(angryResponses);
      
    case 'sad':
    case 'grief':
      const sadResponses = [
        "I'm really sorry you're going through this tough time. Sadness can be really heavy to carry around. Sometimes just having someone listen can help a little. What's been the hardest part for you lately?",
        
        "That sounds really hard. When sadness hits like that, it can color everything else in your day. I'm here to listen if you want to talk more about what's going on. No pressure though - we can also just sit with it.",
        
        "I'm sorry you're feeling down. Sadness is such a complex emotion - sometimes it comes in waves, other times it's more like a constant heaviness. How has it been showing up for you?",
        
        "It sounds like you're going through a really difficult time. Sometimes when we're in those low places, it can be hard to see a way forward. What has helped you navigate sad feelings in the past?",
        
        "I'm hearing a lot of sadness in what you're sharing. That's really tough to sit with. Sometimes it helps just to have those feelings acknowledged. Is there anything specific that triggered these feelings recently?",
        
        "That melancholy you're describing - I can really hear it in your words. It's hard when sadness settles in like that. Have you found anything that provides even small moments of relief from those feelings?",
        
        "I'm really sorry you're carrying this sadness right now. It can be so isolating when you're feeling down, even when you're physically around other people. Has that been your experience?",
        
        "When sadness hits deep like that, it can be really draining - like it takes extra energy just to do normal daily things. How has it been affecting your day-to-day life?",
        
        "I'm sorry you're feeling this way. Sadness deserves space too - it's often telling us something important about our needs or values. What do you think this sadness might be trying to tell you?",
        
        "That sounds really painful. Sometimes when we're in those really sad places, just getting through each day takes courage. I think there's strength in how you're navigating this, even though I know it doesn't always feel that way."
      ];
      return getRandomResponse(sadResponses);
      
    case 'anxious':
      const anxiousResponses = [
        "Anxiety is rough - I've definitely been there. When my mind starts racing, it's hard to slow it down. What kinds of things have helped you manage anxiety before, even if just a little bit?",
        
        "That anxious feeling can be so overwhelming sometimes. Like your thoughts are spinning faster than you can process them. Is that what you're experiencing right now? Sometimes naming the physical sensations can actually help reduce their intensity a bit.",
        
        "Anxiety can be so draining - that constant state of alertness takes a real toll. Is there anything specific that's triggering these feelings right now, or is it more of a general sense of unease?",
        
        "It sounds like you're dealing with some pretty intense anxiety. That's really tough. Sometimes our brains get stuck in these anxiety loops that are hard to break out of. Have you found anything that helps ground you when you're feeling this way?",
        
        "That anxious feeling can be so uncomfortable. Sometimes it shows up in our bodies in weird ways too - tension, stomach issues, trouble breathing. Have you noticed any physical symptoms along with the worried thoughts?",
        
        "When anxiety kicks in like that, it can make everything feel more urgent and overwhelming than it actually is. One thing that helps some people is asking 'what's the worst that could realistically happen?' and then 'how would I cope if it did?' Does that approach ever work for you?",
        
        "It sounds like your mind is working overtime right now with worry. That's exhausting. Sometimes anxiety tricks us into thinking we need to solve everything right away. What's one small thing you could do that might help you feel a tiny bit calmer in this moment?",
        
        "Anxiety can make us feel so alone with our thoughts, but actually it's one of the most common mental health experiences. That doesn't make your experience any less valid, but sometimes it helps to know others understand. What do your anxious thoughts tend to focus on most?",
        
        "That constant worry can be so intrusive. Anxiety often makes us focus on the future rather than the present. Would it be helpful to try a quick grounding exercise together? Sometimes just naming five things you can see right now can help bring you back to the present moment.",
        
        "Living with anxiety can feel like you're constantly waiting for something bad to happen. That's such a difficult way to move through the world. Have you found any strategies that help, even just a little bit?"
      ];
      return getRandomResponse(anxiousResponses);
      
    case 'happy':
      const happyResponses = [
        "It's awesome to hear something positive is happening for you! Those good moments are worth hanging onto. What's contributing to your good mood today?",
        
        "You sound like you're in a good place right now, and that's really great to hear! Sometimes when things are going well, it's a good time to reflect on what's working. What do you think has been making a positive difference for you lately?",
        
        "I'm glad you're feeling good! It's always nice to have those moments of positivity. Is this a general good mood, or is there something specific that's going well for you right now?",
        
        "That positive energy comes through even in your words! It's refreshing to hear. What's bringing you joy these days? Sometimes identifying those things can help us intentionally include more of them in our lives.",
        
        "I'm really glad to hear you're feeling good today! That's definitely worth celebrating. When things are going well, sometimes it can actually be a good time to think about what supports your mental health. Any insights about what's been helping lately?",
        
        "It's great to hear that positive tone! Good moments deserve just as much attention as the difficult ones. What's been brightening your days recently?",
        
        "I love hearing that you're in a good headspace! That's awesome. Sometimes those positive periods give us energy to tackle things we've been putting off. Anything you've been wanting to focus on during this good stretch?",
        
        "That's really great to hear! Sometimes we forget to acknowledge the good days when they come. Is this feeling a recent shift for you, or have things been going well for a while?",
        
        "I'm so glad things are looking up! Sometimes a good mood can feel like finally putting down a heavy backpack you didn't even realize you were carrying. What's feeling lighter for you these days?",
        
        "That's awesome to hear such positivity! Good moods are definitely worth acknowledging. Anything in particular that's making life feel good right now?"
      ];
      return getRandomResponse(happyResponses);
      
    case 'confused':
      const confusedResponses = [
        "Sounds like you're trying to make sense of some complicated stuff. Sometimes talking through things out loud can help sort through the mental clutter. Want to walk me through what you're trying to figure out?",
        
        "It can be really disorienting when you're trying to work through something confusing. Sometimes just verbalizing the different parts of what you're thinking can help make it clearer. Would it help to break down what's feeling most confusing right now?",
        
        "That feeling of confusion or uncertainty can be really uncomfortable. Like you can't quite get your bearings. Would it help to talk through what you do know for sure, and then identify the specific pieces that feel unclear?",
        
        "Being in that mental space where things don't quite make sense can be really frustrating. Sometimes writing things out or talking through them step by step can help bring some clarity. Would that be helpful to try?",
        
        "It sounds like you're dealing with some complex thoughts or situations that aren't easy to untangle. That can feel really overwhelming. Sometimes starting with 'what's the central question I'm trying to answer?' can help focus the thinking process. Does that resonate?",
        
        "When things feel confusing like that, sometimes our brains get stuck in loops trying to make sense of it all. Would it help to approach it from a different angle? Sometimes stepping back to look at the bigger picture (or zooming in on one specific detail) can break that cycle.",
        
        "That uncertainty sounds challenging to navigate. Sometimes confusion happens when we're trying to hold too many pieces of information in mind at once. Would it help to focus on just one aspect of this situation first?",
        
        "When you're feeling confused like this, sometimes it helps to ask 'what additional information would help me feel clearer about this?' Is there anything specific that might help resolve some of this uncertainty?",
        
        "It sounds like you're in that uncomfortable space of not having all the pieces fit together yet. That can be really frustrating. Sometimes it helps to talk through what you know and what you don't know, to see where the gaps might be. Would that be useful?",
        
        "Being confused about something important to you can be really distressing. Our brains naturally want clarity and resolution. Would it help to talk through the different possibilities you're considering, even if you're not sure which is right?"
      ];
      return getRandomResponse(confusedResponses);
      
    case 'distressed':
      const distressedResponses = [
        "That sounds really difficult. When I'm having trouble sleeping it affects everything else too. Have you found anything that helps you relax before bed, even just a little bit?",
        
        "I'm sorry things are feeling so overwhelming right now. That combination of emotional distress and sleep problems can create a really tough cycle. What's been the hardest part for you to manage lately?",
        
        "It sounds like you're going through a really challenging time. That level of distress can be so exhausting to carry. Is there anything specific that triggered these intense feelings, or has it been building up over time?",
        
        "The distress you're describing sounds really intense and difficult to manage. When things get to that overwhelming point, sometimes we need to focus on very basic coping strategies - even just taking one deep breath. What has helped you get through intense feelings in the past?",
        
        "I can hear how much you're struggling right now. That sounds really painful. Sometimes when we're in that much distress, our usual coping strategies don't seem to work as well. Have you noticed anything that provides even small moments of relief?",
        
        "What you're describing sounds really overwhelming. When distress gets that intense, it can be hard to see a way through it. But these feelings, even though they're incredibly painful, aren't permanent. What's one small thing that might help you feel even 5% better right now?",
        
        "That level of distress sounds really difficult to manage on your own. It makes sense that you'd be struggling with this. Sometimes when things get this intense, additional support can be really helpful. Have you thought about what kinds of support might help right now?",
        
        "The distress you're describing sounds all-consuming. Almost like you can't see past it right now. That's such a difficult place to be in. Would it help to focus on just getting through the next hour, rather than figuring everything out at once?",
        
        "When distress hits at that level, it can feel like it's taking over everything. Like you can't remember what it feels like to not be in this state. That's really tough. Sometimes in those moments, grounding techniques can help - like noticing five things you can see right now. Would something like that be helpful to try?",
        
        "I'm hearing how overwhelmed you're feeling right now. That sounds incredibly difficult. Sometimes when distress is that high, our nervous systems get stuck in overdrive. Have you found anything that helps your body feel calmer when you're in this state?"
      ];
      return getRandomResponse(distressedResponses);
      
    default:
      const defaultResponses = [
        "Thanks for sharing that with me. I'm curious to hear more about what's been on your mind today. Sometimes it helps to talk things through with someone while you wait for your therapist.",
        
        "I appreciate you opening up about that. What else has been going on for you lately? I'm here to listen and chat while you're waiting for your appointment.",
        
        "That's interesting to hear about. What other thoughts have been on your mind today? Sometimes just talking things through can help organize your thoughts before your therapy session.",
        
        "Thanks for sharing that perspective. Is there anything specific you were hoping to discuss with your therapist today? Sometimes it helps to gather your thoughts beforehand.",
        
        "I'm glad you brought that up. How have things been going overall lately? I'm here to chat about whatever's on your mind while you wait.",
        
        "That makes a lot of sense. What else has been going on in your life recently? Sometimes these conversations can be helpful preparation for your therapy session.",
        
        "I appreciate you telling me about that. What other things have been on your mind recently? I'm here to listen to whatever you'd like to talk about while you wait.",
        
        "That's really insightful. How have you been feeling about things in general lately? Sometimes just putting thoughts into words can help clarify what you want to focus on in therapy.",
        
        "Thanks for sharing that with me. What other aspects of this situation feel important to you right now? I'm here to listen while you're waiting for your appointment.",
        
        "I understand where you're coming from. What else has been occupying your thoughts lately? Sometimes talking through things can help you identify what's most important to discuss in your therapy session."
      ];
      return getRandomResponse(defaultResponses);
  }
};

// Function to get a random response that hasn't been used recently
const getRandomResponse = (responses: string[]): string => {
  // Filter out previously used responses if possible
  let availableResponses = responses.filter(r => !previousResponses.includes(r));
  
  // If all responses have been used, reset the history
  if (availableResponses.length === 0) {
    previousResponses = [];
    availableResponses = responses;
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

// Create varied responses to avoid repetition
export const getVariedResponse = (messageType: string): string => {
  const responses = {
    acknowledgment: [
      "I appreciate you sharing that.",
      "Thanks for telling me about this.",
      "That makes a lot of sense.",
      "I can see why you'd feel that way.",
      "Thanks for opening up about this stuff.",
      "I'm glad you felt comfortable sharing that.",
      "I value you sharing your perspective on this.",
      "That sounds really challenging.",
      "It takes courage to talk about these things.",
      "I'm listening, and what you're saying matters.",
      "That's completely understandable.",
      "It makes sense that you feel that way.",
      "That's a really important point.",
      "I'm following what you're saying.",
      "Thank you for being so open about this.",
      "I hear what you're saying.",
      "I appreciate your honesty about this.",
      "That's a really thoughtful perspective.",
      "Thank you for trusting me with that.",
      "I'm really glad you mentioned that."
    ],
    support: [
      "I'm here to chat while you wait for your therapist.",
      "I'm not a therapist, but I'm here to listen and support you.",
      "Sometimes it helps just having someone to talk to while you wait.",
      "I'm glad we can talk while your therapist becomes available.",
      "Feel free to share whatever's on your mind - that's what I'm here for.",
      "I'm here for you during this waiting time.",
      "Even though I'm not your therapist, I'm happy to be a listening ear.",
      "Sometimes talking through things can help sort your thoughts before your appointment.",
      "I'm here to support you until your therapist is available.",
      "Feel free to use this time to gather your thoughts before your session.",
      "I'm committed to supporting you through this conversation.",
      "This can be a good time to organize what you want to bring up in your session.",
      "I'm here for you during this waiting period.",
      "It's okay to just chat about whatever's on your mind while you wait.",
      "I'm here to provide whatever support feels helpful right now.",
      "Sometimes these conversations can help clarify what you want to focus on with your therapist.",
      "I'm here to listen without judgment while you wait.",
      "I'm glad I can be here for you during this time.",
      "I'm here for you as a supportive companion during this wait.",
      "Feel free to use this time however feels most helpful for you."
    ],
    exploration: [
      "What's been on your mind lately?",
      "How has this been affecting you day-to-day?",
      "What do you think would help most right now?",
      "Have you talked with anyone else about this?",
      "What aspect of this situation feels most important to you right now?",
      "How long has this been going on for you?",
      "What have you tried so far to address this?",
      "How do you typically handle situations like this?",
      "What would make the biggest difference for you right now?",
      "Is there a specific part of this that's been most difficult?",
      "What are your thoughts about that?",
      "How are you feeling about this situation right now?",
      "What would be helpful for us to discuss while you wait?",
      "How has your week been going overall?",
      "What's been working well for you lately?",
      "Is there anything specific you're hoping to get from talking today?",
      "How have you been managing these feelings so far?",
      "What support do you have in your life for dealing with this?",
      "What would a better situation look like for you?",
      "Is there anything else about this that feels important to mention?"
    ],
    transition: [
      "Speaking of which,",
      "That reminds me,",
      "On a related note,",
      "By the way,",
      "While we're on this topic,",
      "I'm curious,",
      "Something else I wanted to ask,",
      "If you don't mind me shifting gears slightly,",
      "This might be related,",
      "To go back to what you mentioned earlier,"
    ],
    reflection: [
      "It sounds like you're feeling...",
      "So from what I understand...",
      "It seems like a big part of this is...",
      "Correct me if I'm wrong, but it sounds like...",
      "I'm hearing that you...",
      "So you're saying that...",
      "It seems like you're experiencing...",
      "From what you've described...",
      "It sounds like this has been...",
      "The way you describe it makes me think..."
    ],
    empathy: [
      "That must be really difficult.",
      "I can imagine that would be frustrating.",
      "That sounds really challenging to deal with.",
      "I can see how that would be upsetting.",
      "That's a lot to handle on your own.",
      "That kind of situation would be hard for anyone.",
      "I can understand why you'd feel that way.",
      "That sounds like a really tough spot to be in.",
      "I'm sorry you're going through that.",
      "That must be taking a toll on you."
    ]
  };
  
  // Get a varied response that hasn't been used recently
  return getRandomResponse(responses[messageType as keyof typeof responses]);
};

// Initial messages from Roger
export const getInitialMessages = (): MessageType[] => {
  const initialMessages = [
    "Hey there! I'm Roger. I work with the team here at Cuyahoga Valley to provide some support while you wait for your therapist. How are you doing today?",
    
    "Hi! I'm Roger, one of the peer support team members. I'm here to chat while you're waiting for your therapist. What's been going on with you lately?",
    
    "Hello! My name is Roger, and I'm here to talk with you while you wait for your therapist appointment. How's your day been so far?",
    
    "Hi there, I'm Roger. I work as part of the support team here. I'm available to chat while you're waiting for your therapist. How are you feeling today?",
    
    "Hey! Roger here. I provide peer support while you're waiting for your therapist. What's on your mind today?"
  ];
  
  const followUpMessages = [
    "Just so you know, I'm not a therapist myself - I'm more like a peer support person. But I'm happy to chat about whatever's on your mind until your therapist is available.",
    
    "Quick heads up - I'm not a licensed therapist, but rather someone who's here to provide support during your wait. Feel free to share whatever you'd like to talk about.",
    
    "I should mention that I'm part of the peer support team, not a therapist. But I'm here to listen and chat about whatever would be helpful while you wait.",
    
    "Just to clarify, my role is peer support rather than therapy. But I'm here to talk through whatever's on your mind until your therapist is ready.",
    
    "To be clear about my role, I'm here as a supportive person to talk with, not as a therapist. But I'm glad to listen and chat while you wait for your appointment."
  ];
  
  // Choose a random initial message and follow-up
  const initialMessage = getRandomResponse(initialMessages);
  const followUpMessage = getRandomResponse(followUpMessages);
  
  return [
    createMessage(initialMessage, 'roger'),
    createMessage(followUpMessage, 'roger')
  ];
};

export const getIntroductionMessage = (): string => {
  const introMessages = [
    "Hey! I'm Roger, one of the peer support staff here. I'm here to chat while you're waiting to connect with your therapist. I'm not a therapist myself, but I'm happy to talk through whatever's on your mind. What's been going on with you lately?",
    
    "Hi there! My name's Roger - I work on the peer support team here at the clinic. I'm available to chat while you wait for your therapist. I'm not a therapist myself, but sometimes it helps to talk things through. What brings you in today?",
    
    "Hey, I'm Roger! I'm part of the peer support program here. While you're waiting for your therapist, I'm available to talk about whatever's on your mind. What's been happening in your world recently?",
    
    "Hello! I'm Roger from the peer support team. I'm here to provide some company and conversation while you wait for your therapist appointment. What would be helpful to talk about during this waiting time?",
    
    "Hi! My name is Roger, and I'm here to chat with you while we wait for your therapist to become available. I'm not a therapist myself, but I can definitely listen and talk through things with you. What's been on your mind today?",
    
    "Hey there! Roger here - I work with the clinic providing peer support. I'm available to talk with you while you're waiting for your therapist. Anything in particular you'd like to chat about today?",
    
    "Hello! I'm Roger, and I'm part of the peer support program. I'm here to talk with you while you wait for your therapist appointment. How has your day been going so far?",
    
    "Hi! I'm Roger, one of the peer support staff. While you're waiting to see your therapist, I'm here to chat about whatever might be helpful. What's been going on in your life lately?"
  ];
  
  return getRandomResponse(introMessages);
};

export const getCrisisMessage = (): string => {
  const crisisMessages = [
    "Hey, I notice you mentioned something that sounds pretty serious. If you're in a crisis situation, there are some really good resources I can connect you with right away. Your wellbeing is super important, and getting immediate professional support would be the best move right now. Would you like me to ask your therapist to contact you ASAP?",
    
    "I want to pause here because what you're describing sounds like it might be a crisis situation. There are immediate resources available that can help right now. Your safety and wellbeing are the top priority. Would it be helpful if I connected you with crisis support or asked your therapist to see you immediately?",
    
    "I'm concerned about what you just shared. This sounds like something that needs immediate professional attention. There are crisis resources available right now that can provide the right kind of support for this situation. Would you like me to connect you with those resources or see if your therapist can speak with you immediately?",
    
    "I need to check in with you about what you just mentioned. This sounds like a situation where immediate professional support would be really important. Your wellbeing matters a lot, and there are resources specifically designed to help with urgent situations like this. Would you like me to help connect you with crisis support?",
    
    "What you're describing sounds serious, and I think it would be best to connect you with immediate professional support. Your safety is really important. Would it be okay if I asked your therapist to see you right away, or would you prefer I connect you with crisis resources that can help immediately?"
  ];
  
  return getRandomResponse(crisisMessages);
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
  
  // Add casual language markers occasionally (30% chance)
  if (Math.random() < 0.3) {
    const casualMarkers = [
      "You know,",
      "I mean,",
      "Like,",
      "So,",
      "Well,",
      "Honestly,",
      "Actually,",
      "Basically,",
      "I get that,",
      "Look,",
      "The thing is,",
      "To be honest,",
      "I've noticed that",
      "It seems like",
      "In my experience,"
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
  
  // Sometimes add reflective statement (25% chance)
  if (Math.random() < 0.25 && !response.includes("?")) {
    const reflectionStatement = getVariedResponse('reflection');
    response += ` ${reflectionStatement.toLowerCase()}`;
  }
  
  // Sometimes add empathy statement (35% chance)
  if (Math.random() < 0.35) {
    const empathyStatement = getVariedResponse('empathy');
    
    // Place empathy statement at different positions
    if (Math.random() < 0.6) {
      // Add at the beginning
      response = `${empathyStatement} ${response}`;
    } else {
      // Add in the middle or end
      const sentences = response.split(/(?<=[.!?]) /);
      if (sentences.length > 2) {
        const insertPoint = Math.floor(Math.random() * (sentences.length - 1)) + 1;
        sentences.splice(insertPoint, 0, empathyStatement);
        response = sentences.join(" ");
      } else {
        response += ` ${empathyStatement.toLowerCase()}`;
      }
    }
  }
  
  return response;
};
