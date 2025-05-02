
/**
 * Everyday Frustration Handler
 * 
 * Utilities for detecting and responding to everyday frustrations
 */

import { isSubclinicalConcern, validatesSubclinicalConcerns } from '../../masterRules/unconditionalRuleProtections';

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
