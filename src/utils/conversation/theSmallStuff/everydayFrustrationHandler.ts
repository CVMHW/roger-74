
/**
 * Everyday Frustration Handler
 * 
 * Detects and responds to minor everyday frustrations that people commonly experience
 */

/**
 * Detect if the user is expressing an everyday frustration
 */
export const detectEverydayFrustration = (userInput: string): {
  isFrustration: boolean;
  frustrationType: string;
} => {
  const lowerInput = userInput.toLowerCase();
  
  // Initialize result
  const result = {
    isFrustration: false,
    frustrationType: ''
  };
  
  // Check for social embarrassment
  if (/spill(ed)?|trip(ped)?|fall|fell|embarrass(ing|ed)?|awkward/i.test(lowerInput)) {
    if (/social|date|girl|guy|party|bar|drink|restaurant|friend/i.test(lowerInput)) {
      result.isFrustration = true;
      result.frustrationType = 'social_embarrassment';
      return result;
    }
  }
  
  // Check for work/school stress
  if (/work|job|boss|coworker|deadline|presentation|meeting|project/i.test(lowerInput)) {
    if (/stress(ed|ful)?|anxious|worry|concern|frustrat(ing|ed)/i.test(lowerInput)) {
      result.isFrustration = true;
      result.frustrationType = 'work_stress';
      return result;
    }
  }
  
  // Check for technology problems
  if (/computer|laptop|phone|device|internet|wifi|connection|app|software/i.test(lowerInput)) {
    if (/slow|crash|error|problem|not working|broken|frustrat(ing|ed)/i.test(lowerInput)) {
      result.isFrustration = true;
      result.frustrationType = 'tech_problem';
      return result;
    }
  }
  
  // Check for personal organizational issues
  if (/lost|misplaced|forgot|can't find|looking for|where is|missing/i.test(lowerInput)) {
    if (/key|wallet|phone|purse|item|thing/i.test(lowerInput)) {
      result.isFrustration = true;
      result.frustrationType = 'lost_item';
      return result;
    }
  }
  
  // Check for weather-related frustrations
  if (/rain|snow|storm|weather|cold|hot|humid|forecast|temperature/i.test(lowerInput)) {
    if (/cancel|ruin|mess up|change|plan|trip|terrible|awful|bad/i.test(lowerInput)) {
      result.isFrustration = true;
      result.frustrationType = 'weather_frustration';
      return result;
    }
  }
  
  // Check for household problems
  if (/sink|toilet|pipe|leak|power|electricity|heat|AC|appliance|broken/i.test(lowerInput)) {
    result.isFrustration = true;
    result.frustrationType = 'household_problem';
    return result;
  }
  
  // Check for minor health annoyances
  if (/headache|tired|exhausted|sore|cold|flu|sick|not feeling well/i.test(lowerInput)) {
    result.isFrustration = true;
    result.frustrationType = 'minor_health';
    return result;
  }
  
  // Check for sports frustrations (especially for Cleveland)
  if (/browns|cavs|guardians|indians|sports|game|match|team|lose|lost|win|score/i.test(lowerInput)) {
    if (/upset|sad|disappointed|frustrat(ing|ed)|mad|angry/i.test(lowerInput)) {
      result.isFrustration = true;
      result.frustrationType = 'sports_frustration';
      return result;
    }
  }
  
  return result;
};

/**
 * Generate a response for everyday frustration
 */
export const generateEverydayFrustrationResponse = (
  frustration: { isFrustration: boolean; frustrationType: string },
  userInput: string
): string => {
  if (!frustration.isFrustration) {
    return '';
  }
  
  // Check for Cleveland-specific context
  const isClevelandContext = /cleveland|ohio|cavs|browns|guardians|indians|cle/i.test(userInput);
  
  switch (frustration.frustrationType) {
    case 'social_embarrassment': {
      if (/spill(ed)?/i.test(userInput) && /drink|beer|coffee/i.test(userInput)) {
        if (/date|girl|guy|romantic/i.test(userInput)) {
          return "Oh man, spilling a drink on a date is definitely awkward! Those moments can feel so mortifying in the moment. Did they handle it okay? Sometimes these embarrassing moments can actually become funny stories later.";
        }
        return "Spilling drinks is one of those universally awkward moments we all have. It's frustrating in the moment for sure. What happened after you spilled it?";
      }
      
      if (/trip(ped)?|fall|fell/i.test(userInput)) {
        return "Tripping in public can feel so embarrassing in the moment. I've definitely been there - that split second feels like it's happening in slow motion, right? Did anyone help you out?";
      }
      
      return "Those socially awkward moments can really stick with us, even though everyone has them. What's bothering you most about what happened?";
    }
    
    case 'work_stress': {
      return "Work stress can really follow you around even after hours. Sounds like this has been weighing on you. What aspect of the situation is creating the most pressure right now?";
    }
    
    case 'tech_problem': {
      return "Tech issues can be incredibly frustrating, especially when you're trying to get something done. Those moments when technology doesn't cooperate can really test our patience. What have you tried so far?";
    }
    
    case 'lost_item': {
      return "Losing something important is so stressful. That moment of panic when you realize it's missing is awful. Have you been able to retrace your steps at all?";
    }
    
    case 'weather_frustration': {
      if (isClevelandContext) {
        return "Cleveland weather can be especially unpredictable! One minute it's sunny, the next you need an umbrella. How has the weather affected your plans?";
      }
      return "Weather changing plans is always frustrating, especially when you were looking forward to something. What were you planning to do?";
    }
    
    case 'household_problem': {
      return "House problems always seem to happen at the worst times. Those unexpected issues can really throw off your day. Is it something you need to get fixed right away?";
    }
    
    case 'minor_health': {
      return "Not feeling well can affect everything else in your day. Even small health issues can be really draining. How long have you been feeling this way?";
    }
    
    case 'sports_frustration': {
      if (isClevelandContext) {
        return "Being a Cleveland sports fan definitely has its ups and downs. Those games can really affect your mood, especially when they're close ones. What happened during the game that was most disappointing?";
      }
      return "Sports can really connect to our emotions - the highs when they win and the lows when they lose. What about this particular game affected you?";
    }
    
    default: {
      return "That sounds frustrating. Those small daily challenges can sometimes hit harder than we expect. What about this situation is bothering you the most?";
    }
  }
};
