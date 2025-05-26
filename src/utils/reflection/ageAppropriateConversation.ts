
import { DevelopmentalStage } from './reflectionTypes';

/**
 * Utilities for generating age-appropriate conversation starters
 */

// Function that checks whether we should use a conversation starter
export const shouldUseConversationStarter = (
  messageCount: number, 
  userInput: string
): boolean => {
  // Only use conversation starters occasionally, and more frequently in early messages
  const probability = messageCount < 5 ? 0.5 : messageCount < 10 ? 0.3 : 0.1;
  
  // Get the last sentence from user input
  const sentences = userInput.split(/[.!?]+/);
  const lastSentence = sentences[sentences.length - 1].trim();
  
  // If the last sentence is very short or empty, it might indicate the user is unsure what to say
  const isShortLastSentence = lastSentence.length < 15 && lastSentence.length > 0;
  
  // Words that might indicate the conversation has stalled
  const stallWords = ['ok', 'okay', 'sure', 'fine', 'alright', 'i see', 'got it', 'thanks'];
  
  // Check if the user's last message contains stall words
  const containsStallWord = stallWords.some(word => 
    lastSentence.toLowerCase().includes(word) && lastSentence.split(' ').length < 4);
  
  // Increase probability if the message seems to indicate a stalled conversation
  const adjustedProbability = (isShortLastSentence || containsStallWord) ? 
    Math.min(probability * 2, 0.8) : probability;
  
  // Randomly decide whether to use a conversation starter based on the adjusted probability
  return Math.random() < adjustedProbability;
};

// Generate a conversation starter appropriate for the user's developmental stage
export const generateConversationStarterResponse = (stage: DevelopmentalStage): string => {
  // Different conversation starter questions based on developmental stage
  const infantToddlerStarters = [
    "What's your favorite color?",
    "Do you like playing outside?",
    "What's your favorite animal?",
    "Do you like drawing?",
    "What makes you feel happy?"
  ];
  
  const youngChildStarters = [
    "What do you like to do for fun?",
    "Do you have a favorite book or story?",
    "What games do you like to play?",
    "What's your favorite thing to do at school?",
    "Do you have any pets?"
  ];
  
  const middleChildhoodStarters = [
    "What's your favorite subject in school?",
    "What kind of music or YouTube videos do you like?",
    "What's something cool you learned recently?",
    "What do you like to do with your friends?",
    "What activities or hobbies do you enjoy?"
  ];
  
  const adolescentStarters = [
    "What are you passionate about right now?",
    "What's something you're looking forward to?",
    "What kind of music or shows are you into?",
    "How do you like to spend time with your friends?",
    "Is there something you've been wanting to learn more about?"
  ];
  
  const youngAdultStarters = [
    "What are you focusing on in your life right now?",
    "What's something that's been on your mind lately?",
    "What are some of your goals for the near future?",
    "What's something that's been bringing you joy recently?",
    "Is there something you've been wanting to explore or try?"
  ];
  
  const adultStarters = [
    "What brought you here today?",
    "What's been on your mind lately?",
    "Is there something specific you'd like to talk about?",
    "What's something that's important to you right now?",
    "How have things been going for you recently?"
  ];
  
  // Select the appropriate set of starters based on stage
  let starters;
  
  switch (stage) {
    case 'infant_toddler':
      starters = infantToddlerStarters;
      break;
    case 'young_child':
      starters = youngChildStarters;
      break;
    case 'middle_childhood':
      starters = middleChildhoodStarters;
      break;
    case 'adolescent':
      starters = adolescentStarters;
      break;
    case 'young_adult':
    case 'young-adult':
      starters = youngAdultStarters;
      break;
    case 'child':
      starters = youngChildStarters; // Map child to young_child
      break;
    case 'older-adult':
      starters = adultStarters; // Use adult starters for older adults
      break;
    default:
      starters = adultStarters; // Default to adult
  }
  
  // Randomly select a conversation starter from the appropriate set
  return starters[Math.floor(Math.random() * starters.length)];
};
