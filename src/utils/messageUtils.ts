
/**
 * Utilities for creating and managing messages
 */
import { MessageType } from '../components/Message';
import { ConcernType } from './reflection/reflectionTypes';

// Create a new message with the given text and sender
export const createMessage = (
  text: string, 
  sender: 'user' | 'roger', 
  concernType: ConcernType | null = null
): MessageType => {
  return {
    id: Date.now().toString(),
    text,
    sender,
    timestamp: new Date(),
    concernType,
    locationData: null // Initialize location data as null
  };
};

// Initial messages for the chat
export const getInitialMessages = (): MessageType[] => [
  {
    id: '1',
    text: "Hi, I'm Roger, your peer support companion. I'm here to listen and offer support. How can I help you today?",
    sender: 'roger',
    timestamp: new Date(),
    locationData: null
  },
];

// Store feedback (this is a placeholder - replace with actual implementation)
export const storeFeedback = (messageId: string, feedback: 'positive' | 'negative') => {
  console.log(`Feedback for message ${messageId}: ${feedback}`);
  // In a real application, you would store this feedback in a database or other persistent storage
};

// Function to check if location data is needed for a specific concern type
export const isLocationDataNeeded = (concernType: ConcernType | null): boolean => {
  if (!concernType) return false;
  
  // These concern types benefit most from location-specific resources
  const concernsRequiringLocation: ConcernType[] = [
    'crisis', 
    'substance-use',
    'mental-health',
    'ptsd',
    'tentative-harm'
  ];
  
  return concernsRequiringLocation.includes(concernType);
};

// Generate appropriate location request message based on concern type
export const generateLocationRequestMessage = (concernType: ConcernType): string => {
  const baseMessage = "To help connect you with the most relevant support resources, could you let me know what area you're located in? Even just your state or nearest city would be helpful.";
  
  switch (concernType) {
    case 'crisis':
      return `I want to make sure you get immediate help. ${baseMessage} This will help me provide specific crisis resources near you.`;
    case 'substance-use':
      return `${baseMessage} There are excellent substance use treatment options that vary by location, and I'd like to share the most relevant ones for you.`;
    case 'mental-health':
      return `${baseMessage} Mental health services can vary by region, and I want to ensure you have access to appropriate support.`;
    case 'ptsd':
    case 'ptsd-mild':
      return `${baseMessage} There are specialized trauma-informed providers in many areas, and knowing your general location would help me suggest relevant options.`;
    case 'tentative-harm':
      return `I'm concerned about your safety and want to make sure you have access to immediate support. ${baseMessage} This information will help me provide you with the most relevant resources.`;
    default:
      return baseMessage;
  }
};

// Update location data for a specific message
export const updateMessageWithLocation = (
  messages: MessageType[],
  messageId: string,
  locationData: { state?: string; city?: string; }
): MessageType[] => {
  return messages.map(message => 
    message.id === messageId 
      ? { ...message, locationData } 
      : message
  );
};

// Extract possible location mentions from text
export const extractPossibleLocation = (text: string): { state?: string; city?: string; } | null => {
  // This is a simplified implementation - in a real application,
  // you would use a more comprehensive list of locations and NLP techniques
  
  // Common US states and abbreviations
  const states = [
    'alabama', 'alaska', 'arizona', 'arkansas', 'california', 'colorado',
    'connecticut', 'delaware', 'florida', 'georgia', 'hawaii', 'idaho',
    'illinois', 'indiana', 'iowa', 'kansas', 'kentucky', 'louisiana',
    'maine', 'maryland', 'massachusetts', 'michigan', 'minnesota',
    'mississippi', 'missouri', 'montana', 'nebraska', 'nevada',
    'new hampshire', 'new jersey', 'new mexico', 'new york',
    'north carolina', 'north dakota', 'ohio', 'oklahoma', 'oregon',
    'pennsylvania', 'rhode island', 'south carolina', 'south dakota',
    'tennessee', 'texas', 'utah', 'vermont', 'virginia', 'washington',
    'west virginia', 'wisconsin', 'wyoming',
    'al', 'ak', 'az', 'ar', 'ca', 'co', 'ct', 'de', 'fl', 'ga', 
    'hi', 'id', 'il', 'in', 'ia', 'ks', 'ky', 'la', 'me', 'md', 
    'ma', 'mi', 'mn', 'ms', 'mo', 'mt', 'ne', 'nv', 'nh', 'nj', 
    'nm', 'ny', 'nc', 'nd', 'oh', 'ok', 'or', 'pa', 'ri', 'sc', 
    'sd', 'tn', 'tx', 'ut', 'vt', 'va', 'wa', 'wv', 'wi', 'wy'
  ];
  
  // Major US cities
  const cities = [
    'new york', 'los angeles', 'chicago', 'houston', 'phoenix', 
    'philadelphia', 'san antonio', 'san diego', 'dallas', 'san jose',
    'austin', 'jacksonville', 'fort worth', 'columbus', 'san francisco',
    'charlotte', 'indianapolis', 'seattle', 'denver', 'washington',
    'boston', 'el paso', 'detroit', 'nashville', 'portland',
    'memphis', 'oklahoma city', 'las vegas', 'louisville', 'baltimore',
    'milwaukee', 'albuquerque', 'tucson', 'fresno', 'sacramento',
    'kansas city', 'mesa', 'atlanta', 'omaha', 'colorado springs',
    'raleigh', 'miami', 'long beach', 'virginia beach', 'oakland',
    'minneapolis', 'tampa', 'tulsa', 'arlington', 'cleveland'
  ];
  
  const lowerText = text.toLowerCase();
  let foundState: string | undefined;
  let foundCity: string | undefined;
  
  // Check for states
  for (const state of states) {
    // Use word boundaries to avoid partial matches
    const regex = new RegExp(`\\b${state}\\b`, 'i');
    if (regex.test(lowerText)) {
      foundState = state;
      break;
    }
  }
  
  // Check for cities
  for (const city of cities) {
    // Use word boundaries to avoid partial matches
    const regex = new RegExp(`\\b${city}\\b`, 'i');
    if (regex.test(lowerText)) {
      foundCity = city;
      break;
    }
  }
  
  if (foundState || foundCity) {
    return {
      state: foundState,
      city: foundCity
    };
  }
  
  return null;
};
