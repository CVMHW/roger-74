
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
    timestamp: new Date()
  };
};

// Track conversation context to avoid repetition
let previousTopics: string[] = [];
let previousResponses: string[] = [];
let conversationContext: {
  personalDetails?: {[key: string]: string},
  currentEmotion?: string,
  mentionedPets?: boolean,
  mentionedSleep?: boolean,
  waitingForTherapist?: boolean,
  topicHistory?: string[]
} = {
  personalDetails: {},
  topicHistory: []
};

// Get response based on detected emotion and conversation context
export const getResponseBasedOnEmotion = (message: string): string => {
  const emotion = detectEmotion(message);
  const lowerCaseMessage = message.toLowerCase();
  
  // Update conversation context
  if (conversationContext.topicHistory === undefined) {
    conversationContext.topicHistory = [];
  }
  
  // Detect pet-related context
  if (lowerCaseMessage.includes('dog') || lowerCaseMessage.includes('cat') || 
      lowerCaseMessage.includes('pet') || lowerCaseMessage.includes('animal')) {
    conversationContext.mentionedPets = true;
    conversationContext.topicHistory?.push('pets');
  }
  
  // Detect sleep issues
  if (lowerCaseMessage.includes('sleep') || lowerCaseMessage.includes('tired') || 
      lowerCaseMessage.includes('insomnia') || lowerCaseMessage.includes('rest')) {
    conversationContext.mentionedSleep = true;
    conversationContext.topicHistory?.push('sleep');
  }
  
  // Check for therapist-waiting context
  if (lowerCaseMessage.includes('therapist') && 
    (lowerCaseMessage.includes('late') || lowerCaseMessage.includes('wait'))) {
    conversationContext.waitingForTherapist = true;
  }
  
  // Update current emotional state
  conversationContext.currentEmotion = emotion;
  
  // Pet loss specific response
  if (conversationContext.mentionedPets && 
      (lowerCaseMessage.includes('died') || lowerCaseMessage.includes('passed') || 
       lowerCaseMessage.includes('lost') || lowerCaseMessage.includes('miss'))) {
    
    return `I'm really sorry about your pet. Losing a companion like that is genuinely hard - they're family members in every way that matters. It's completely normal to be grieving. When my neighbor lost her dog last year, she said the house felt empty for weeks. Give yourself permission to feel sad about this loss - it's important and real.`;
  }
  
  // Pet loss + sleep issues combined response
  if (conversationContext.mentionedPets && conversationContext.mentionedSleep && 
     (lowerCaseMessage.includes('died') || lowerCaseMessage.includes('miss'))) {
    
    return `I'm so sorry about your loss. Pets are such important parts of our routines and comfort, especially at bedtime. That empty space beside you can make sleep really difficult. Have you tried keeping something of theirs nearby when you sleep? Some people find having their pet's favorite blanket or toy helps them feel connected. Sleep disruption after loss is completely normal, but it definitely adds to the difficulty because everything feels harder when you're tired.`;
  }

  // Handle therapist being late context
  if (conversationContext.waitingForTherapist && emotion === 'angry') {
    return `Yeah, I totally get the frustration of waiting when you've already set time aside for this appointment. It can feel disrespectful of your time. For what it's worth, sometimes therapists get caught in situations they can't easily step away from - like if someone's in crisis. But your time matters too, and it's completely valid to feel annoyed about this. Would it help to talk about what's been on your mind lately while we wait, or would you prefer I check how much longer it might be?`;
  }

  // General responses based on emotion with more authentic language
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

// Function to generate more natural, conversational responses
export const generateConversationalResponse = (userMessage: string): string => {
  // Get base response for emotion
  let response = getResponseBasedOnEmotion(userMessage);
  
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
