/**
 * The Small Stuff - Non-Clinical Conversation Handling
 * 
 * This module helps Roger respond appropriately to everyday frustrations,
 * complaints, and small talk that aren't clinical concerns but are important
 * for building rapport in the first 5 minutes of conversation.
 * 
 * UNCONDITIONAL RULE: Follow the patient's concerns and stories completely in early conversation
 * UNCONDITIONAL RULE: Prioritize deep engagement with non-clinical concerns to build rapport
 * UNCONDITIONAL RULE: Only crisis concerns take precedence over following the patient's narrative
 */

export * from './everydayFrustrations';
export * from './smallTalkTopics';
export * from './rapportBuilding';

/**
 * Detects everyday communication styles to adapt responses appropriately
 */
export const detectCommunicationStyle = (userInput: string): string => {
  const lowerInput = userInput.toLowerCase();
  
  // Detect various communication preferences
  if (/\b(direct|straight|blunt|honest|candid|straightforward|no bs)\b/i.test(lowerInput)) {
    return "direct";
  }
  
  if (/\b(detail|specific|precise|exact|thorough|comprehensive)\b/i.test(lowerInput)) {
    return "detailed";
  }
  
  if (/\b(simple|plain|easy|clear|basic|straightforward)\b/i.test(lowerInput)) {
    return "simple";
  }
  
  if (/\b(story|tale|narrative|experience|anecdote)\b/i.test(lowerInput)) {
    return "narrative";
  }
  
  if (/\b(fact|evidence|study|research|data|statistics)\b/i.test(lowerInput)) {
    return "factual";
  }
  
  // Default style
  return "balanced";
};

/**
 * Detects demographic patterns to adapt responses appropriately
 */
export const detectDemographicPatterns = (userInput: string): Record<string, boolean> => {
  return {
    isLikelyYoung: /\b(college|university|class|school|dorm|roommate|professor|campus|major|exam|homework)\b/i.test(userInput),
    isLikelyParent: /\b(my (kid|child|son|daughter|children|baby)|parent|mom|dad|family|bedtime|daycare|school)\b/i.test(userInput),
    isLikelyWorking: /\b(work|job|career|boss|coworker|office|company|business|client|customer|shift)\b/i.test(userInput),
    isLikelyOlder: /\b(retire|pension|grandchild|AARP|senior|aging|older|elder|arthritis|Medicare)\b/i.test(userInput)
  };
};

/**
 * Adapts response style based on detected communication preferences
 */
export const adaptResponseStyle = (
  baseResponse: string,
  communicationStyle: string
): string => {
  let result = baseResponse;
  
  switch (communicationStyle) {
    case "direct":
      // Make response more direct and concise
      result = result
        .replace(/I think perhaps |It seems like maybe |It's possible that /g, '')
        .replace(/might be |could be |may be /g, 'is ');
      break;
      
    case "detailed":
      // No changes needed if already detailed
      break;
      
    case "simple":
      // Simplify language
      result = result
        .replace(/nevertheless|furthermore|additionally|consequently/gi, 'also')
        .replace(/utilize|employ/gi, 'use')
        .replace(/sufficient/gi, 'enough')
        .replace(/inquire/gi, 'ask')
        .replace(/attempt/gi, 'try');
      break;
      
    case "narrative":
      // Add more personal touches
      if (!result.includes('reminds me')) {
        result += " This reminds me of conversations I've had with others who've shared similar experiences.";
      }
      break;
      
    case "factual":
      // Add fact-oriented language
      if (!result.includes('research') && !result.includes('studies') && !result.includes('data')) {
        result += " Many people report similar experiences when facing these situations.";
      }
      break;
      
    default:
      // Balanced approach, no changes needed
      break;
  }
  
  return result;
};

/**
 * Generates a first message response that is welcoming and engaging
 */
export const generateFirstMessageResponse = (): string => {
  const firstResponses = [
    "Hello! I'm Roger, a Peer Support Companion. I'm here to chat with you while you wait to see Dr. Eric. How are you doing today?",
    "Welcome! I'm Roger. I help out here by talking with people before they see Dr. Eric. How's your day been going so far?",
    "Hi there! I'm Roger, and I'm here to make your wait a bit more comfortable before you see Dr. Eric. How are you feeling today?",
    "Hello and welcome! I'm Roger, a Peer Support Companion. While you wait for Dr. Eric, I'm here to talk about whatever's on your mind. How are you doing?",
    "Hi! I'm Roger, and I'm here to chat with you before your time with Dr. Eric. How has your day been going?"
  ];
  
  return firstResponses[Math.floor(Math.random() * firstResponses.length)];
};

/**
 * Enhances rapport in early conversation by adding personalization
 * and following up on the patient's immediate concerns
 */
export const enhanceRapportInEarlyConversation = (
  baseResponse: string,
  userInput: string,
  messageCount: number
): string => {
  // For very early messages, ensure we're encouraging detailed sharing
  if (messageCount <= 3) {
    if (!baseResponse.includes('?')) {
      return baseResponse + " I'd really like to hear more about what's been going on with you. Could you share a bit more?";
    }
  }
  
  // For messages 4-7, ensure we're acknowledging their specific concerns
  if (messageCount <= 7) {
    const immediateConcern = identifyImmediateConcern(userInput);
    if (immediateConcern) {
      switch(immediateConcern) {
        case 'physical_mishap':
          return baseResponse + " By the way, I hope you didn't hurt yourself when you slipped earlier. Those kinds of accidents can be both physically and emotionally jarring.";
        case 'clothing_issue':
          return baseResponse + " And about your clothes from earlier - sometimes club soda can help with fresh stains if you're still dealing with that.";
        case 'commuting_problem':
          return baseResponse + " I hope the rest of your day goes more smoothly than your commute here did.";
        case 'weather_issue':
          return baseResponse + " This Cleveland weather can really throw a wrench in our plans sometimes, can't it?";
        default:
          // No additional enhancement needed
          break;
      }
    }
  }
  
  // For messages 8-10, ensure we're building continuity
  if (messageCount <= 10 && messageCount > 7) {
    if (!baseResponse.includes('mentioned earlier') && !baseResponse.includes('you said')) {
      // Look for themes to callback to
      if (/stress|worry|anxiety|concern/i.test(userInput)) {
        return baseResponse + " And circling back to what you were sharing earlier - how have you been managing those stressful situations?";
      }
      
      if (/sad|down|blue|depress/i.test(userInput)) {
        return baseResponse + " I also wanted to check back about those feelings of sadness you mentioned. How long have you been experiencing that?";
      }
    }
  }
  
  return baseResponse;
};

/**
 * Import from everydayFrustrations to fix reference error
 */
import { detectEverydayFrustration } from './everydayFrustrations';

/**
 * Identifies immediate concerns in user's message that should be addressed directly
 * before any redirection to clinical topics
 */
export const identifyImmediateConcern = (userInput: string): string | null => {
  // Check for everyday frustrations first
  const frustrationInfo = detectEverydayFrustration(userInput);
  if (frustrationInfo.isFrustration) {
    return frustrationInfo.category || 'general_frustration';
  }
  
  // Check for specific scenarios
  const patterns = [
    { regex: /(slip(ped)?|fell|trip(ped)?|stumble(d)?)\s.*(puddle|mud|wet|floor|ground|ice|snow)/i, category: 'physical_mishap' },
    { regex: /(dirty|stain(ed)?|mess(y|ed)?|wet)\s.*(cloth(es|ing)|outfit|shirt|pants|dress|shoes)/i, category: 'clothing_issue' },
    { regex: /(traffic|jam|late|rush hour|bus|train|subway|car|drive|driving|commut)/i, category: 'commuting_problem' },
    { regex: /(rain(ing|ed)?|snow(ing|ed)?|weather|storm|cold|hot|humid|freez(e|ing))/i, category: 'weather_issue' },
    { regex: /(miss(ed)?|cancel(led)?|reschedule(d)?)\s.*(appointment|meeting|class|event)/i, category: 'missed_appointment' },
    { regex: /(lost|can'?t find|misplaced|forget)\s.*(keys|phone|wallet|purse|bag|item)/i, category: 'lost_item' },
    { regex: /(spill(ed)?|drop(ped)?|knock(ed)?|broke)\s.*(coffee|drink|food|cup|glass|plate|mug)/i, category: 'spill_accident' },
    { regex: /(headache|migraine|tired|exhaust(ed)?|sleep|insomnia|rest)/i, category: 'physical_discomfort' },
    { regex: /(forgot|remember|deadline|due|assign(ed|ment)|project)/i, category: 'work_stress' }
  ];
  
  for (const pattern of patterns) {
    if (pattern.regex.test(userInput)) {
      return pattern.category;
    }
  }
  
  return null;
};

/**
 * Generates an empathetic response to immediate concerns
 */
export const generateImmediateConcernResponse = (userInput: string, concernType: string): string => {
  switch(concernType) {
    case 'physical_mishap':
      return `That sounds frustrating. Slipping in public can be both physically painful and embarrassing. Are you feeling okay physically? And don't worry about appearances - we've all been there at some point.`;
      
    case 'clothing_issue':
      return `Oh no, that stinks! I hope it wasn't your favorite outfit. Stains can be really hard to get out once they dry. Do you think it's something that will come out in the wash, or might it need special cleaning?`;
      
    case 'commuting_problem':
      return `Traffic can really start the day off on the wrong foot. Was your commute particularly bad today? It seems like the roads around Cleveland have been extra congested lately.`;
      
    case 'weather_issue':
      return `The weather in Cleveland can be so unpredictable! It sounds like it affected your day. Did you get caught without the right gear for today's conditions?`;
      
    case 'missed_appointment':
      return `Missing appointments can throw off your whole schedule. Was this something important, or were you able to reschedule easily?`;
      
    case 'lost_item':
      return `Losing something important is so stressful. Have you had any luck finding it? Sometimes retracing steps helps, but I know that can be frustrating too.`;
      
    case 'spill_accident':
      return `Spills always seem to happen at the worst times, don't they? Did it cause much of a mess or damage anything important?`;
      
    case 'physical_discomfort':
      return `I'm sorry you're not feeling well physically. That can make everything else harder to deal with. Has this been going on for a while, or is it something that just started today?`;
      
    case 'work_stress':
      return `Work stress can really follow you everywhere. Is this about a specific project or deadline that's been weighing on you?`;
      
    case 'general_frustration':
      return `That sounds really frustrating. Those kinds of day-to-day annoyances can really add up and affect your mood. Would it help to tell me more about what happened?`;
      
    default:
      return `That sounds like it was challenging to deal with. Would you like to tell me more about what happened? I'm here to listen.`;
  }
};

/**
 * Generates small talk transition that maintains focus on the user's concerns
 * rather than redirecting to clinical topics too quickly
 */
export const generateSmallTalkTransition = (userInput: string): string => {
  // Only generate transitions after establishing sufficient rapport
  const transitionPhrases = [
    "That's really interesting. Thanks for sharing that with me. Is there anything else on your mind today?",
    "I appreciate you telling me about that. What else has been going on for you lately?",
    "Thanks for sharing that with me. Is there anything else you'd like to talk about while we wait?",
    "That gives me a better sense of what you've been experiencing. Is there anything else you'd like to discuss?",
    "I'm glad you shared that with me. What else has been on your mind recently?"
  ];
  
  return transitionPhrases[Math.floor(Math.random() * transitionPhrases.length)];
};
