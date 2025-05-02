
/**
 * Everyday Frustrations Handler
 * 
 * Helps Roger respond appropriately to common everyday complaints and frustrations
 * that aren't clinical but are important for validating the patient's experience.
 */

/**
 * Detects if the user input contains mention of an everyday frustration
 */
export const detectEverydayFrustration = (userInput: string): {
  isFrustration: boolean;
  topic: string | null;
  intensity: 'mild' | 'moderate' | 'strong' | null;
} => {
  const lowerInput = userInput.toLowerCase();
  
  // Check for food-related complaints
  if (/expired (food|meal)|cold (food|meal)|bad (food|meal)|food (sucks|is terrible)|awful (food|meal)|food quality|terrible (food|meal)|waste of money on food/i.test(userInput)) {
    const intensity = /waste of money|terrible|awful|sucks/i.test(userInput) ? 'strong' : 
                     /bad|poor|not good/i.test(userInput) ? 'moderate' : 'mild';
    return { isFrustration: true, topic: 'food', intensity };
  }
  
  // Check for service-related complaints
  if (/bad service|poor service|rude (staff|server|waiter|waitress)|terrible service|slow service|waited (forever|too long)|ignored by (staff|server|waiter|waitress)/i.test(userInput)) {
    const intensity = /terrible|forever|so long|completely ignored/i.test(userInput) ? 'strong' : 
                     /bad|poor|not good/i.test(userInput) ? 'moderate' : 'mild';
    return { isFrustration: true, topic: 'service', intensity };
  }
  
  // Check for money/cost-related complaints
  if (/too expensive|overpriced|waste of money|cost too much|not worth (it|the money|the price)|price|paid too much/i.test(userInput)) {
    const intensity = /complete waste|highway robbery|ridiculous price/i.test(userInput) ? 'strong' : 
                     /not worth it|too expensive/i.test(userInput) ? 'moderate' : 'mild';
    return { isFrustration: true, topic: 'cost', intensity };
  }
  
  // Check for traffic/commute complaints
  if (/traffic|commute|drive here|parking|bus|train|late|stuck in traffic|construction/i.test(userInput) && /bad|terrible|awful|nightmare|mess|hassle|problem|difficult/i.test(userInput)) {
    const intensity = /nightmare|terrible|awful/i.test(userInput) ? 'strong' : 
                     /bad|difficult|problem/i.test(userInput) ? 'moderate' : 'mild';
    return { isFrustration: true, topic: 'commute', intensity };
  }
  
  // Check for weather-related complaints
  if (/weather|rain|snow|cold|hot|humid|storm|freezing|heat|temperature/i.test(userInput) && /bad|terrible|awful|hate|annoying|miserable|sick of/i.test(userInput)) {
    const intensity = /hate|terrible|awful|miserable/i.test(userInput) ? 'strong' : 
                     /annoying|sick of|tired of/i.test(userInput) ? 'moderate' : 'mild';
    return { isFrustration: true, topic: 'weather', intensity };
  }
  
  // Check for minor inconveniences
  if (/annoying|hassle|nuisance|inconvenience|bother|irritating|frustrating/i.test(userInput)) {
    return { isFrustration: true, topic: 'general', intensity: 'mild' };
  }
  
  // No everyday frustration detected
  return { isFrustration: false, topic: null, intensity: null };
};

/**
 * Generates an appropriate response to an everyday frustration
 */
export const generateEverydayFrustrationResponse = (
  userInput: string, 
  frustrationInfo: { topic: string | null; intensity: 'mild' | 'moderate' | 'strong' | null; }
): string => {
  const { topic, intensity } = frustrationInfo;
  
  // Generate response based on the topic and intensity
  switch (topic) {
    case 'food':
      return handleFoodComplaints(userInput, intensity);
    case 'service':
      return handleServiceComplaints(userInput, intensity);
    case 'cost':
      return handleCostComplaints(userInput, intensity);
    case 'commute':
      return handleCommuteComplaints(userInput, intensity);
    case 'weather':
      return handleWeatherComplaints(userInput, intensity);
    case 'general':
    default:
      return handleGeneralComplaints(userInput, intensity);
  }
};

/**
 * Handles food-related complaints
 */
const handleFoodComplaints = (userInput: string, intensity: 'mild' | 'moderate' | 'strong' | null): string => {
  if (intensity === 'strong') {
    return "That sounds really frustrating about the food experience. Paying for something that doesn't meet expectations can be particularly disappointing. Would you like to tell me more about what happened, or would you prefer to talk about something else?";
  } else if (intensity === 'moderate') {
    return "I understand your frustration about the food situation. It's disappointing when meals don't meet your expectations, especially when you're paying for them. Is this something that happened recently?";
  } else {
    return "That's unfortunate about the food. Those small disappointments can add up sometimes. Is there anything else on your mind today that you'd like to talk about?";
  }
};

/**
 * Handles service-related complaints
 */
const handleServiceComplaints = (userInput: string, intensity: 'mild' | 'moderate' | 'strong' | null): string => {
  if (intensity === 'strong') {
    return "It sounds like you had a really frustrating experience with that service. It can be particularly upsetting when you feel disrespected or ignored. Would you like to share more about what happened?";
  } else if (intensity === 'moderate') {
    return "Poor service can certainly be frustrating. It's reasonable to expect to be treated with respect and consideration. Was this a recent experience?";
  } else {
    return "Service issues can definitely be annoying. Sometimes these small interactions can affect our whole day. Is there something else you'd like to talk about today?";
  }
};

/**
 * Handles cost/money-related complaints
 */
const handleCostComplaints = (userInput: string, intensity: 'mild' | 'moderate' | 'strong' | null): string => {
  if (intensity === 'strong') {
    return "I hear your frustration about the cost. It can be really aggravating when you feel like you're not getting value for your money. Would you like to talk more about this, or is there something else on your mind today?";
  } else if (intensity === 'moderate') {
    return "Cost issues can definitely be disappointing. It's reasonable to expect fair value for what you pay. Has this been on your mind a lot lately?";
  } else {
    return "I understand that feeling when something seems overpriced. Those everyday concerns can sometimes add up. Is there anything else you'd like to discuss today?";
  }
};

/**
 * Handles commute/traffic-related complaints
 */
const handleCommuteComplaints = (userInput: string, intensity: 'mild' | 'moderate' | 'strong' | null): string => {
  if (intensity === 'strong') {
    return "That commute situation sounds really frustrating. Cleveland traffic can be particularly challenging sometimes, and it's understandable to be upset when your time gets wasted like that. I appreciate you making it here despite those difficulties.";
  } else if (intensity === 'moderate') {
    return "Commuting issues can certainly be a hassle. Getting around Cleveland isn't always easy, especially with all the construction lately. I'm glad you made it here despite those challenges.";
  } else {
    return "Transportation hiccups can definitely add stress to your day. Thanks for making the effort to come in today despite that. How are you feeling now that you're here?";
  }
};

/**
 * Handles weather-related complaints
 */
const handleWeatherComplaints = (userInput: string, intensity: 'mild' | 'moderate' | 'strong' | null): string => {
  if (intensity === 'strong') {
    return "The Cleveland weather can be really frustrating, I agree. When it's like this, it can affect your whole mood and day. I appreciate you coming in despite the weather challenges.";
  } else if (intensity === 'moderate') {
    return "The weather here can definitely be a pain sometimes. It's one of those small things that can impact how we feel throughout the day. How are you doing now that you're inside?";
  } else {
    return "Weather issues can add a little extra challenge to the day. Thanks for making it in despite that. Is there something specific you'd like to talk about during your time here today?";
  }
};

/**
 * Handles general complaints and minor inconveniences
 */
const handleGeneralComplaints = (userInput: string, intensity: 'mild' | 'moderate' | 'strong' | null): string => {
  if (intensity === 'strong') {
    return "That sounds really frustrating. Those kinds of situations can really impact your day. Would you like to tell me more about what happened, or would you prefer to focus on something else today?";
  } else if (intensity === 'moderate') {
    return "I understand how annoying those situations can be. Sometimes it's the small frustrations that build up. Is there anything specific about it you'd like to discuss?";
  } else {
    return "Those little everyday hassles can definitely add up. Is this something that's been bothering you lately, or is there something else on your mind today?";
  }
};
