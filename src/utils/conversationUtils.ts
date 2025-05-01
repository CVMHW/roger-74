
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
