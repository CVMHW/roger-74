
/**
 * Response generators for different conversation scenarios
 */

import { EmotionType, ResponseRecord } from '../types/commonTypes';

/**
 * Generates an appropriate introduction response
 */
export const generateIntroductionResponse = (): string => {
  const introResponses = [
    "Hello! I'm Roger, here to chat with you while you wait for Dr. Eric. How are you doing today?",
    "Hi there! I'm Roger. I'm here to help make your wait a bit more comfortable. How's your day going?",
    "Welcome! I'm Roger, and I'm here to chat with you while you wait to see Dr. Eric. How has your day been so far?",
    "Hey! I'm Roger. I'll be here with you until Dr. Eric is ready for your appointment. How are you feeling today?"
  ];
  
  return introResponses[Math.floor(Math.random() * introResponses.length)];
};

/**
 * Generates a response to personal sharing
 */
export const generatePersonalSharingResponse = (userInput: string): string => {
  // Detect emotional tone
  const emotions = {
    sad: /sad|down|depressed|unhappy|upset|disappointed|hurt/i,
    anxious: /anxious|worried|nervous|stress|concerned|scared|afraid/i,
    angry: /angry|mad|frustrated|annoyed|irritated|upset/i,
    happy: /happy|glad|excited|pleased|thrilled|delighted|joy/i,
    confused: /confused|unsure|uncertain|don't understand|don't know/i
  };
  
  let detectedEmotion: EmotionType = 'neutral';
  for (const [emotion, pattern] of Object.entries(emotions)) {
    if (pattern.test(userInput)) {
      detectedEmotion = emotion as EmotionType;
      break;
    }
  }
  
  // Generate appropriate response based on emotional tone
  const responses: ResponseRecord = {
    sad: [
      "I hear that you're feeling down. That sounds really difficult. Would you like to share more about what's been happening?",
      "I'm sorry to hear you're feeling sad. It's okay to have those feelings. What's been going on?"
    ],
    anxious: [
      "It sounds like you're feeling pretty anxious. That can be really uncomfortable. What's on your mind?",
      "I can understand feeling worried. Anxiety is something many people experience. Would you like to talk more about what's causing those feelings?"
    ],
    angry: [
      "I hear your frustration. It's completely okay to feel upset about things. Would it help to talk more about what's bothering you?",
      "It sounds like you're feeling pretty frustrated. That's totally understandable. What's been going on?"
    ],
    happy: [
      "It's great to hear you're feeling positive! What's been bringing you joy lately?",
      "I'm glad you're feeling good! Would you like to share more about what's making you happy?"
    ],
    confused: [
      "It sounds like things feel a bit unclear right now. That can be really disorienting. Would you like to talk through what's confusing you?",
      "I understand feeling uncertain can be challenging. What specifically has you feeling confused?"
    ],
    neutral: [
      "Thank you for sharing that with me. I'd be interested to hear more about your experience if you'd like to share.",
      "I appreciate you opening up. What else would be helpful for us to talk about today?"
    ]
  };
  
  const emotionResponses = responses[detectedEmotion];
  return emotionResponses[Math.floor(Math.random() * emotionResponses.length)];
};
