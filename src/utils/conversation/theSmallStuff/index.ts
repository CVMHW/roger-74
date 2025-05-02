/**
 * theSmallStuff: Everyday Frustrations and Small Talk
 * 
 * This module focuses on detecting and responding to minor, everyday
 * frustrations and engaging in appropriate small talk.
 * 
 * It helps Roger build rapport by acknowledging the "little things"
 * and engaging in light conversation.
 */

import {
  isSubclinicalConcern,
  validatesSubclinicalConcerns,
  shouldPrioritizeSmallTalk
} from '../../masterRules/unconditionalRuleProtections';

/**
 * Detects everyday frustrations in user input
 * @param input User message
 * @returns Information about detected frustrations
 */
export const detectEverydayFrustration = (input: string): {
  isFrustration: boolean;
  frustrationType: string | null;
} => {
  const frustrationTriggers = [
    { type: "technology", pattern: /(computer|internet|phone|app|software) (slow|crash|freeze|broken|glitch)/i },
    { type: "errand", pattern: /(waiting in line|long queue|store was out|forgot my wallet)/i },
    { type: "housework", pattern: /(cleaning|laundry|dishes) (pile up|never ends|so much)/i },
    { type: "cooking", pattern: /(burnt|overcooked|undercooked|recipe failed)/i },
    { type: "weather", pattern: /(rainy day|too hot|too cold|windy) (ruined my plans|stuck inside)/i },
    { type: "traffic", pattern: /(traffic jam|late because of traffic|missed the bus)/i },
    { type: "noise", pattern: /(noisy neighbors|loud construction|can't concentrate)/i },
    { type: "junk_mail", pattern: /(spam|junk mail|too many emails)/i },
    { type: "lost_item", pattern: /(lost my keys|can't find my phone|misplaced my glasses)/i },
    { type: "annoying_person", pattern: /(rude customer|obnoxious coworker|noisy seatmate)/i }
  ];
  
  for (const trigger of frustrationTriggers) {
    if (trigger.pattern.test(input)) {
      return {
        isFrustration: true,
        frustrationType: trigger.type
      };
    }
  }
  
  return {
    isFrustration: false,
    frustrationType: null
  };
};

/**
 * Generates responses to everyday frustrations
 * @param input User message
 * @param frustrationInfo Information about the detected frustration
 * @returns Appropriate response to the frustration
 */
export const generateEverydayFrustrationResponse = (
  input: string,
  frustrationInfo: { isFrustration: boolean; frustrationType: string | null }
): string => {
  if (!frustrationInfo.isFrustration) {
    return "";
  }
  
  const { frustrationType } = frustrationInfo;
  
  const frustrationResponses = {
    technology: [
      "Ugh, technology frustrations are the worst! It always seems to happen at the least convenient time. What were you trying to do when it glitched out?",
      "Oh man, tech issues can be such a pain. I totally get how frustrating that is. Did you lose any important work?",
      "Tech problems, am I right? It's like they have a sixth sense for when you're already stressed. What exactly went wrong?"
    ],
    errand: [
      "Ugh, errands are the worst sometimes. It's like the universe conspires to make them take longer. What errand were you trying to run?",
      "Oh no, that's so annoying! I hate when errands turn into a whole ordeal. What were you trying to get done?",
      "Ugh, I feel your pain. Errands can be such a time suck. What was on your list?"
    ],
    housework: [
      "Housework is the never-ending story, isn't it? It's like you clean one thing and three more messes pop up. What's the most annoying chore for you?",
      "Oh man, I feel you. Housework can be so draining. What are you tackling today?",
      "Housework, the gift that keeps on giving... said no one ever. What's on your cleaning agenda?"
    ],
    cooking: [
      "Oh no! Cooking mishaps can be so frustrating, especially when you're hungry. What were you trying to make?",
      "Ugh, cooking fails are the worst. I totally get how annoying that is. What went wrong?",
      "Cooking can be so unpredictable! What were you hoping to create?"
    ],
    weather: [
      "Ugh, weather ruining plans is the worst! It's like Mother Nature has a personal vendetta. What did you have planned?",
      "Oh man, I feel you. Weather can be so disappointing. What were you hoping to do?",
      "Weather, the ultimate mood killer. What were you looking forward to?"
    ],
    traffic: [
      "Traffic jams are the absolute worst! It's like time just stops. Where were you headed?",
      "Oh man, I feel you. Traffic can be so stressful. Where were you trying to go?",
      "Traffic, the ultimate time thief. What was your destination?"
    ],
    noise: [
      "Ugh, noise distractions are the worst when you're trying to focus! It's like the world is conspiring against you. What were you trying to concentrate on?",
      "Oh man, I feel you. Noise can be so disruptive. What were you trying to get done?",
      "Noise, the ultimate concentration killer. What were you working on?"
    ],
    junk_mail: [
      "Junk mail is such a waste of time and paper! It's like they're personally attacking your mailbox. What kind of spam did you get?",
      "Oh man, I feel you. Junk mail can be so annoying. What's the worst kind you get?",
      "Junk mail, the ultimate inbox invader. What's clogging up your mailbox?"
    ],
    lost_item: [
      "Losing things is so frustrating! It's like they vanish into thin air. What did you lose?",
      "Oh man, I feel you. Losing things can be so stressful. What are you looking for?",
      "Losing things, the ultimate hide-and-seek game. What's missing?"
    ],
    annoying_person: [
      "Ugh, dealing with annoying people is the worst! It's like they're deliberately trying to push your buttons. Who were you dealing with?",
      "Oh man, I feel you. Annoying people can be so draining. What happened?",
      "Annoying people, the ultimate patience testers. What did they do?"
    ]
  };
  
  const normalizingResponses = [
    "Oh no, that stinks!",
    "Ugh, that's the worst!",
    "Oh man, I feel you.",
    "That's so frustrating!",
    "I totally get how annoying that is."
  ];
  
  const specificResponses = frustrationResponses[frustrationType as keyof typeof frustrationResponses] || [];
  
  // Combine normalizing and specific responses
  const combinedResponses = [...normalizingResponses, ...specificResponses];
  
  // Select a random response
  const selectedResponse = combinedResponses[Math.floor(Math.random() * combinedResponses.length)];
  
  // Add normalizing language for subclinical concerns
  if (isSubclinicalConcern(input) && !validatesSubclinicalConcerns(selectedResponse)) {
    return `${selectedResponse} It's normal to feel that way sometimes.`;
  }
  
  return selectedResponse;
};

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
 * Enhances rapport in early conversation by adding personal touch
 * @param response The generated response
 * @param userInput The original user input
 * @param messageCount Current message count
 * @returns Enhanced response with rapport-building elements
 */
export const enhanceRapportInEarlyConversation = (
  response: string,
  userInput: string,
  messageCount: number
): string => {
  // Add personal touch for minor concerns
  if (messageCount <= 5 && detectEverydayFrustration(userInput).isFrustration) {
    const personalTouches = [
      "I've been there!",
      "That happens to me too!",
      "I get that!",
      "That stinks!"
    ];
    
    const selectedTouch = personalTouches[Math.floor(Math.random() * personalTouches.length)];
    return `${selectedTouch} ${response}`;
  }
  
  // Add follow-up questions to encourage sharing
  if (messageCount <= 3 && !response.includes("?")) {
    return `${response} What else has been going on?`;
  }
  
  return response;
};
