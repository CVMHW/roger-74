
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

// Detect emotions in user messages
export const detectEmotion = (message: string): string => {
  const emotions = {
    angry: ['angry', 'mad', 'furious', 'upset', 'annoyed', 'frustrated', 'irritated', 'outraged', 'fed up'],
    sad: ['sad', 'depressed', 'unhappy', 'miserable', 'down', 'blue', 'gloomy', 'heartbroken', 'disappointed'],
    anxious: ['anxious', 'worried', 'nervous', 'scared', 'frightened', 'stressed', 'overwhelmed', 'panicked', 'uneasy'],
    happy: ['happy', 'glad', 'excited', 'joyful', 'pleased', 'delighted', 'thrilled', 'content', 'cheerful'],
    confused: ['confused', 'unsure', 'uncertain', 'puzzled', 'perplexed', 'lost', 'bewildered', 'disoriented']
  };

  const lowerCaseMessage = message.toLowerCase();
  
  for (const [emotion, keywords] of Object.entries(emotions)) {
    if (keywords.some(keyword => lowerCaseMessage.includes(keyword))) {
      return emotion;
    }
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

// Get response based on detected emotion and message content
export const getResponseBasedOnEmotion = (message: string): string => {
  const emotion = detectEmotion(message);
  const lowerCaseMessage = message.toLowerCase();
  
  // Check if the message mentions the therapist being late
  const mentionsTherapistLate = lowerCaseMessage.includes('late') && 
    (lowerCaseMessage.includes('therapist') || lowerCaseMessage.includes('doctor') || 
     lowerCaseMessage.includes('appointment') || lowerCaseMessage.includes('waiting'));
  
  if (mentionsTherapistLate) {
    if (emotion === 'angry') {
      return "I completely understand your frustration. It's perfectly normal to feel upset when you've set aside time for your appointment and now you're waiting. Would you like to share more about what's on your mind today while we wait, or would you prefer I check on the status of your therapist?";
    } else {
      return "I see you're waiting for your therapist who's running a bit behind schedule. These things happen sometimes, though I know it can be inconvenient. Is there anything specific you'd like to talk about while you wait, or anything I can help with?";
    }
  }

  // General responses based on emotion
  switch (emotion) {
    case 'angry':
      return "I can tell this is really frustrating for you, and your feelings are completely valid. Sometimes it helps to talk through what's making you feel this way. Would you like to share more about what's going on?";
    case 'sad':
      return "I hear that you're feeling down right now, and I want you to know that's completely okay. These feelings are part of our human experience. Would you like to talk more about what's contributing to how you're feeling?";
    case 'anxious':
      return "It sounds like you're dealing with some anxiety, which can be really challenging. Taking a moment to acknowledge these feelings is an important step. What specific concerns are on your mind right now?";
    case 'happy':
      return "It's wonderful to hear that you're feeling positive! These moments are worth celebrating. What's contributing to your good mood today?";
    case 'confused':
      return "It seems like you're trying to make sense of some things, which can be difficult. Sometimes talking through our thoughts can help bring clarity. Would you like to explore this topic more together?";
    default:
      return "Thank you for sharing that with me. I'm here to listen and support you while you wait for your therapist. Would you like to tell me more about what's on your mind today?";
  }
};

// Create varied responses to avoid repetition
export const getVariedResponse = (messageType: string): string => {
  const responses = {
    acknowledgment: [
      "I appreciate you sharing that with me.",
      "Thank you for opening up about this.",
      "I'm glad you felt comfortable telling me about that.",
      "That's really insightful, thank you for sharing.",
      "I value you sharing your perspective on this."
    ],
    support: [
      "I'm here to listen and support you while you wait for your therapist.",
      "While I'm not a licensed therapist, I'm here to provide support and a listening ear.",
      "I'm here for you during this waiting time, as a supportive companion.",
      "You can count on me for support while your therapist becomes available.",
      "I'm committed to supporting you through this conversation."
    ],
    exploration: [
      "Would you like to tell me more about what's on your mind?",
      "How are you feeling about this situation right now?",
      "What aspects of this are most important to you?",
      "How has this been affecting your daily life?",
      "What would be helpful for us to discuss while you wait?"
    ]
  };
  
  // Get random response from the category
  const category = responses[messageType as keyof typeof responses];
  return category[Math.floor(Math.random() * category.length)];
};

// Initial messages from Roger
export const getInitialMessages = (): MessageType[] => {
  return [
    createMessage(
      "Hello! I'm Roger, a peer support companion at Cuyahoga Valley Mindful Health and Wellness. How are you feeling today?",
      'roger'
    ),
    createMessage(
      "I'm here to chat while you wait for your therapist. I'm not a licensed therapist, but I can listen and provide support. What's on your mind?",
      'roger'
    )
  ];
};

export const getIntroductionMessage = (): string => {
  return "I'm Roger, a peer support companion. I'm here to provide a listening ear and supportive perspective while you wait to connect with your therapist. I'm not a licensed therapist and don't provide clinical advice, but I'm happy to chat about what's on your mind and help you explore your thoughts. What would you like to talk about today?";
};

export const getCrisisMessage = (): string => {
  return "I notice you've mentioned something that sounds serious. If you're in crisis or need immediate help, please consider reaching out to one of the crisis resources below. Your wellbeing is important, and connecting with professional support right away is the best step. Would you like me to have your therapist contact you as soon as possible?";
};

