
/**
 * Small Talk Handler
 * 
 * Utilities for detecting and responding to small talk
 */

import { shouldPrioritizeSmallTalk } from '../../masterRules/unconditionalRuleProtections';

/**
 * Detects small talk categories in user input
 * @param input User message
 * @returns Information about detected small talk category
 */
export const detectSmallTalkCategory = (input: string): {
  isSmallTalk: boolean;
  category: string | null;
} => {
  const smallTalkCategories = [
    { category: "greeting", pattern: /^(hi|hello|hey|good morning|good afternoon|good evening)/i },
    { category: "weather", pattern: /(weather|rain|snow|sun|cloudy|windy)/i },
    { category: "current_events", pattern: /(news|headlines|what's happening)/i },
    { category: "hobbies", pattern: /(hobbies|interests|what do you do for fun)/i },
    { category: "weekend_plans", pattern: /(weekend plans|what are you doing this weekend)/i },
    { category: "sports", pattern: /(sports|football|basketball|baseball|game)/i },
    { category: "travel", pattern: /(travel|vacation|where have you been)/i },
    { category: "food", pattern: /(food|eating|cooking|restaurants)/i },
    { category: "music", pattern: /(music|bands|concerts|songs)/i },
    { category: "movies", pattern: /(movies|films|what have you seen)/i }
  ];
  
  if (shouldPrioritizeSmallTalk(input)) {
    for (const category of smallTalkCategories) {
      if (category.pattern.test(input)) {
        return {
          isSmallTalk: true,
          category: category.category
        };
      }
    }
  }
  
  return {
    isSmallTalk: false,
    category: null
  };
};

/**
 * Generates responses to small talk
 * @param userInput User message
 * @param smallTalkCategory Detected small talk category
 * @param messageCount Current message count
 * @returns Appropriate small talk response
 */
export const generateSmallTalkResponse = (
  userInput: string,
  smallTalkCategory: string,
  messageCount: number
): string => {
  const smallTalkResponses = {
    greeting: [
      "Hi there! How's your day going?",
      "Hello! What's been keeping you busy today?",
      "Hey! Anything interesting happen to you today?"
    ],
    weather: [
      "The weather's been a bit crazy lately, hasn't it? What do you think of it?",
      "I hope you're enjoying the weather today. What are you planning to do?",
      "The weather's been quite something. How has it affected your plans?"
    ],
    current_events: [
      "Have you been following any interesting news lately? What's caught your attention?",
      "What's been the most interesting thing you've heard about recently?",
      "Anything newsworthy on your radar?"
    ],
    hobbies: [
      "What do you like to do for fun? Any hobbies you're passionate about?",
      "What are your favorite ways to unwind and relax?",
      "What activities bring you the most joy?"
    ],
    weekend_plans: [
      "Do you have any exciting plans for the weekend? What are you looking forward to?",
      "What's on your agenda for the weekend? Anything fun in store?",
      "What are you hoping to do this weekend?"
    ],
    sports: [
      "Are you following any sports teams right now? What games have you been watching?",
      "What's your favorite sport to watch or play?",
      "What sporting events have you been keeping up with?"
    ],
    travel: [
      "Have you been on any interesting trips lately? Where have you traveled?",
      "What's your favorite place to visit?",
      "Where are you hoping to travel next?"
    ],
    food: [
      "What's your favorite food to eat or cook? Any restaurants you'd recommend?",
      "What have you been cooking lately?",
      "What are your favorite places to eat?"
    ],
    music: [
      "What kind of music do you enjoy listening to? Any bands or concerts you'd recommend?",
      "What's been on your playlist lately?",
      "What kind of music do you find most enjoyable?"
    ],
    movies: [
      "Have you seen any good movies lately? What films would you recommend?",
      "What are your favorite movies of all time?",
      "What movies have you been watching recently?"
    ]
  };
  
  const normalizingResponses = [
    "Oh, that's interesting!",
    "That's cool!",
    "I can relate to that.",
    "I understand.",
    "That makes sense."
  ];
  
  const specificResponses = smallTalkResponses[smallTalkCategory as keyof typeof smallTalkResponses] || [];
  
  // Combine normalizing and specific responses
  const combinedResponses = [...normalizingResponses, ...specificResponses];
  
  // Select a random response
  const selectedResponse = combinedResponses[Math.floor(Math.random() * combinedResponses.length)];
  
  return selectedResponse;
};

/**
 * Generates an appropriate transition from small talk to more meaningful conversation
 */
export const generateSmallTalkTransition = (messageCount: number): string | null => {
  // Only generate transitions after a few messages of small talk
  if (messageCount < 3) return null;
  
  // Only use occasionally (30% chance after message 3)
  if (Math.random() > 0.3) return null;
  
  const transitions = [
    "While we're waiting for Dr. Eric, is there anything specific that brought you in today that you'd feel comfortable sharing?",
    "I'm here to chat about whatever you'd like. Is there something particular on your mind today beyond what we've been discussing?",
    "Thanks for the conversation so far. Is there anything specific you're hoping to talk with Dr. Eric about today?",
    "I appreciate you chatting with me. Sometimes people find it helpful to gather their thoughts before seeing Dr. Eric. Is there anything in particular you're hoping to address today?",
    "It's been nice talking about everyday things. If you'd like, we could also touch on what brought you in today, but only if you're comfortable with that."
  ];
  
  return transitions[Math.floor(Math.random() * transitions.length)];
};
