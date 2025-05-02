
/**
 * Age-appropriate conversation starters and prompts
 * Based on developmental stages and conversation jar examples
 */

import { DevelopmentalStage } from './reflectionTypes';

export interface ConversationStarter {
  question: string;
  followUp?: string;
  category?: 'personal' | 'imagination' | 'reflection' | 'preferences' | 'values' | 'creativity';
}

// Young children (4-7) conversation starters
// Simple, concrete, present-focused questions
export const youngChildConversation: ConversationStarter[] = [
  { question: "What is your favorite animal?", category: 'preferences' },
  { question: "If you could be any animal, what would you be? Why?", category: 'imagination' },
  { question: "What is your favorite thing to do outside?", category: 'preferences' },
  { question: "What was the most surprising thing that happened to you today?", category: 'reflection' },
  { question: "What is your favorite food?", category: 'preferences' },
  { question: "If you had superpowers, what would they be?", followUp: "How would you use them to help people?", category: 'imagination' },
  { question: "What was one fun thing you hope to do this week?", category: 'imagination' },
  { question: "Who is your favorite storybook character? What do you imagine they feel thankful for?", category: 'imagination' },
  { question: "What is your favorite snack food?", category: 'preferences' },
  { question: "What is your favorite way to travel?", followUp: "Like car, on foot, plane, train?", category: 'preferences' }
];

// Middle childhood (8-12) conversation starters
// More logical, detailed questions, still concrete
export const middleChildConversation: ConversationStarter[] = [
  { question: "What subject at school do you think helps you the most in everyday life?", category: 'reflection' },
  { question: "What is the best compliment you've ever received?", category: 'reflection' },
  { question: "What is the one thing you couldn't live without?", category: 'reflection' },
  { question: "What is your favorite part of school this year?", category: 'preferences' },
  { question: "What are 3 things you have to do every day, whether you like them or not?", category: 'reflection' },
  { question: "What was the most surprising thing that happened to you this year?", category: 'reflection' },
  { question: "What was your favorite thing that you learned this year?", category: 'reflection' },
  { question: "Where do you feel most relaxed?", category: 'reflection' },
  { question: "What is your favorite piece of art?", category: 'preferences' },
  { question: "How do you define fairness?", category: 'values' },
  { question: "Do you think your name suits you?", category: 'reflection' }
];

// Adolescent (13-18) conversation starters
// More abstract, identity-focused, future-oriented
export const adolescentConversation: ConversationStarter[] = [
  { question: "Do you think it's possible to change the world? Why or why not?", category: 'values' },
  { question: "What do you think are the ideal characteristics for a life partner or spouse?", category: 'values' },
  { question: "Steven Spielberg said, 'All of us every single year, we're a different person. I don't think we're the same person all our lives.' Do you agree?", category: 'reflection' },
  { question: "In the book 'Alexander' and the Terrible, Horrible, No Good, Very Bad Day, Alexander has a really bad day. Have you ever had a bad day? Did it get better?", category: 'reflection' },
  { question: "What personally trait has gotten you into the most trouble?", category: 'reflection' },
  { question: "How would you describe yourself to someone who has never met you?", category: 'reflection' },
  { question: "Where in the world do you feel the most comfortable?", category: 'reflection' },
  { question: "What is your favorite childhood memory?", category: 'reflection' },
  { question: "Who is/was your favorite teacher? Why?", category: 'reflection' },
  { question: "If you were granted one wish that would change anything, what would it be?", category: 'imagination' }
];

// Young adult (19-25) conversation starters
// Complex, abstract, future and identity oriented
export const youngAdultConversation: ConversationStarter[] = [
  { question: "What does 'open-minded' mean? Do you know someone who is open-minded?", category: 'values' },
  { question: "How do you think the way we demonstrate loyalty changes as we get older?", category: 'values' },
  { question: "At this point in life, do you believe life is or isn't fair?", category: 'values' },
  { question: "Do you feel free to be yourself?", category: 'reflection' },
  { question: "What one word would you use to describe yourself?", category: 'reflection' },
  { question: "Maya Angelou once said, 'If you don't like something, change it. If you can't change it, change your attitude.' What do you think she meant by this? Have you ever had to do this?", category: 'reflection' },
  { question: "Margaret Mead said, 'Never doubt that a few committed people can't change the world. For, indeed, that's all who ever have.' Can you give an example of this from your lifetime?", category: 'reflection' },
  { question: "What's something you love to do and haven't done in a while because you were too busy?", category: 'reflection' },
  { question: "Give an example of a time you saw a friend, family member or stranger being treated unfairly. What did you do?", category: 'reflection' },
  { question: "Think of a time life didn't work out how you expected. How did you respond? Would you respond differently now?", category: 'reflection' }
];

// Adult (26+) conversation starters
export const adultConversation: ConversationStarter[] = [
  { question: "Javier Bardem said, 'I think we are living in selfish times...we live in the so-called 'first world,' and we may be first in a lot of things like technology, but we are behind in empathy.' Do you agree or disagree?", category: 'values' },
  { question: "'A person's a person no matter how small...' writes Dr. Seuss in Horton Hears a Who. What do you think he means by that?", category: 'values' },
  { question: "When athletes change teams or people change jobs and go to work for a competitor, is that disloyal? Why or why not?", category: 'values' },
  { question: "We use lots of words that aren't in the dictionary. What's your favorite made-up slang word?", category: 'creativity' },
  { question: "What is the greatest song ever written?", category: 'preferences' },
  { question: "Albert Camus said: 'In the midst of winter, I learned that there was in me an invincible summer.' What do you think he meant?", category: 'reflection' },
  { question: "Are you a 'summer' person? If not, what season do you think best represents you?", category: 'reflection' },
  { question: "'Don't judge a man until you have walked a mile in his shoes.' What does that phrase mean?", category: 'values' },
  { question: "If you could change one thing about your family or about school, what would it be?", category: 'imagination' },
  { question: "One of the Beatles' most famous songs is 'All You Need is Love.' Do you think that's true? What other necessities might you throw in there?", category: 'values' }
];

/**
 * Gets appropriate conversation starters based on developmental stage
 * @param stage The developmental stage to get conversation starters for
 * @returns Array of age-appropriate conversation starters
 */
export const getConversationStartersForStage = (stage: DevelopmentalStage): ConversationStarter[] => {
  switch (stage) {
    case 'infant_toddler':
      // For caregivers of infants/toddlers, not directly for the children
      return adultConversation.filter(starter => 
        starter.category === 'reflection' || starter.category === 'preferences');
    case 'young_child':
      return youngChildConversation;
    case 'middle_childhood':
      return middleChildConversation;
    case 'adolescent':
      return adolescentConversation;
    case 'young_adult':
      return youngAdultConversation;
    case 'adult':
    default:
      return adultConversation;
  }
};

/**
 * Gets a random conversation starter appropriate for the developmental stage
 * @param stage The developmental stage
 * @returns A random age-appropriate conversation starter
 */
export const getRandomConversationStarter = (stage: DevelopmentalStage): ConversationStarter => {
  const starters = getConversationStartersForStage(stage);
  return starters[Math.floor(Math.random() * starters.length)];
};

/**
 * Generates an age-appropriate conversation starter response
 * @param stage The developmental stage
 * @returns A conversation starter question suitable for the age group
 */
export const generateConversationStarterResponse = (stage: DevelopmentalStage): string => {
  const starter = getRandomConversationStarter(stage);
  
  if (starter.followUp) {
    return `${starter.question} ${starter.followUp}`;
  } else {
    return starter.question;
  }
};

/**
 * Checks if the conversation might benefit from a conversation starter
 * based on context and message count
 * @param messageCount Number of messages in the conversation so far
 * @param userMessage The user's message
 * @returns Boolean indicating if a conversation starter would be appropriate
 */
export const shouldUseConversationStarter = (messageCount: number, userMessage: string): boolean => {
  // More likely to use conversation starters in early conversation
  if (messageCount <= 3) return Math.random() < 0.7; // 70% chance early on
  
  // For later messages, check if the conversation seems stalled
  if (messageCount > 3 && messageCount <= 10) {
    const shortMessage = userMessage.split(' ').length <= 5;
    const hasQuestion = userMessage.includes('?');
    
    // If the message is short and doesn't contain a question, might be a good time for a starter
    if (shortMessage && !hasQuestion) return Math.random() < 0.4; // 40% chance
  }
  
  // Occasionally use starters in established conversations
  return Math.random() < 0.2; // 20% chance later in conversation
};

