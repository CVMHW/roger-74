
/**
 * Rapport Building Strategies
 * 
 * Tools for building connection in the first 5 minutes of conversation
 * based on patient background and communication style.
 */

/**
 * Detects the likely communication style of the patient based on their input
 */
export const detectCommunicationStyle = (userInput: string): {
  style: 'direct' | 'expressive' | 'analytical' | 'reserved' | 'mixed';
  confidence: number;
} => {
  const lowerInput = userInput.toLowerCase();
  let styleCounts = {
    direct: 0,
    expressive: 0, 
    analytical: 0,
    reserved: 0
  };
  
  // Check for direct communication patterns
  if (/^(yes|no|maybe)\b/i.test(lowerInput)) styleCounts.direct++;
  if (/\b(want|need|don't want|don't need|won't)\b/i.test(lowerInput)) styleCounts.direct++;
  if (lowerInput.split(' ').length < 15 && lowerInput.length > 5) styleCounts.direct++;
  if (/\b(just|exactly|specifically|clearly)\b/i.test(lowerInput)) styleCounts.direct++;
  
  // Check for expressive communication patterns
  if (/[!]{1,}/g.test(lowerInput)) styleCounts.expressive++;
  if (/\b(feel|feeling|felt|exciting|excited|amazing|terrible|awful|love|hate|really)\b/i.test(lowerInput)) styleCounts.expressive++;
  if (/[?!]{2,}/g.test(lowerInput)) styleCounts.expressive += 2;
  if (/\b(so|such|very|really|honestly|literally|absolutely)\b/i.test(lowerInput)) styleCounts.expressive++;
  
  // Check for analytical communication patterns
  if (/\b(think|consider|analyze|evaluate|reason|logical|specifically|detail|understand|perspective|viewpoint)\b/i.test(lowerInput)) styleCounts.analytical++;
  if (/\b(because|therefore|however|if|then|cause|effect|result|consequently)\b/i.test(lowerInput)) styleCounts.analytical++;
  if (/\b(data|evidence|research|study|statistics|numbers|percentage|fact|accurate|precise)\b/i.test(lowerInput)) styleCounts.analytical += 2;
  if (lowerInput.split(' ').length > 25) styleCounts.analytical++;
  
  // Check for reserved communication patterns
  if (lowerInput.length < 10) styleCounts.reserved++;
  if (/^(ok|sure|fine|maybe|i guess)\b/i.test(lowerInput)) styleCounts.reserved++;
  if (lowerInput.split(' ').length < 8 && lowerInput.length > 2) styleCounts.reserved++;
  if (/\b(not sure|don't know|maybe|possibly|sort of|kind of)\b/i.test(lowerInput)) styleCounts.reserved++;
  
  // Determine dominant style
  const styles = Object.entries(styleCounts) as [keyof typeof styleCounts, number][];
  styles.sort((a, b) => b[1] - a[1]);
  
  // If there's a clear winner
  if (styles[0][1] > styles[1][1]) {
    const confidence = Math.min(0.9, 0.5 + (styles[0][1] - styles[1][1]) * 0.1);
    return { style: styles[0][0], confidence };
  }
  
  // If it's a tie or close
  return { style: 'mixed', confidence: 0.5 };
};

/**
 * Detects likely demographic characteristics to adapt communication style
 * This focuses on communication patterns, not personal assumptions
 */
export const detectDemographicPatterns = (userInput: string): {
  likelyTeen: boolean;
  likelyBlueCollar: boolean;
  preferSimpleLanguage: boolean;
} => {
  const lowerInput = userInput.toLowerCase();
  
  // Check for teen communication patterns
  const likelyTeen = /\b(school|class|teacher|homework|parent|mom|dad|bro|sis|like|literally|tbh|idk|cool|whatever)\b/i.test(lowerInput) ||
                    /gonna|wanna|ya|u|r|ur|dunno/i.test(lowerInput);
  
  // Check for blue-collar communication patterns
  const likelyBlueCollar = /\b(work|job|boss|shift|overtime|factory|construction|tool|build|fix|machine|site|union|contractor)\b/i.test(lowerInput) &&
                          !/\b(office|meeting|email|presentation|client|marketing|report|analysis|strategy)\b/i.test(lowerInput);
  
  // Check for preference for simpler language
  const preferSimpleLanguage = lowerInput.split(' ').length < 10 || 
                              (lowerInput.split(/[.!?]/).length < 3 && lowerInput.length > 15) ||
                              /\bnot sure\b|\bdon't understand\b|\bwhat do you mean\b|\bconfused\b/i.test(lowerInput);
  
  return { likelyTeen, likelyBlueCollar, preferSimpleLanguage };
};

/**
 * Adapts response style based on detected communication patterns
 */
export const adaptResponseStyle = (
  baseResponse: string,
  communicationStyle: 'direct' | 'expressive' | 'analytical' | 'reserved' | 'mixed',
  demographics: { likelyTeen: boolean; likelyBlueCollar: boolean; preferSimpleLanguage: boolean; }
): string => {
  let adaptedResponse = baseResponse;
  
  // Adapt to communication style
  switch (communicationStyle) {
    case 'direct':
      adaptedResponse = makeMoreDirect(adaptedResponse);
      break;
    case 'expressive':
      adaptedResponse = makeMoreEngaging(adaptedResponse);
      break;
    case 'analytical':
      adaptedResponse = makeMoreStructured(adaptedResponse);
      break;
    case 'reserved':
      adaptedResponse = makeMoreGentle(adaptedResponse);
      break;
    // 'mixed' requires no specific adaptation
  }
  
  // Further adapt based on demographic patterns
  if (demographics.likelyTeen) {
    adaptedResponse = adaptForTeen(adaptedResponse);
  }
  
  if (demographics.likelyBlueCollar) {
    adaptedResponse = adaptForBlueCollar(adaptedResponse);
  }
  
  if (demographics.preferSimpleLanguage) {
    adaptedResponse = simplifyLanguage(adaptedResponse);
  }
  
  return adaptedResponse;
};

/**
 * Makes response more direct and concise
 */
const makeMoreDirect = (response: string): string => {
  // Remove hedging language
  let result = response
    .replace(/perhaps|maybe|possibly|I think that|It seems like|It appears that/gi, '')
    .replace(/in my opinion|from my perspective|I believe that/gi, '')
    .replace(/somewhat|a little bit|rather|quite|fairly/gi, '');
  
  // Break into shorter sentences if needed
  if (result.length > 100) {
    result = result.replace(/\. Furthermore/g, '. ')
                  .replace(/\. Additionally/g, '. ')
                  .replace(/\. Moreover/g, '. ');
  }
  
  return result;
};

/**
 * Makes response more engaging for expressive communicators
 */
const makeMoreEngaging = (response: string): string => {
  // Add emphasis and engagement
  let result = response;
  
  // Add personalization and warmth where appropriate
  if (!result.includes('I understand')) {
    result = result.replace(/That's/g, "I understand that's");
  }
  
  // Add acknowledgment and validation
  if (!result.includes('valid') && !result.includes('makes sense')) {
    if (result.includes('feeling')) {
      result = result.replace(/feeling/g, 'feeling is completely valid and');
    } else if (result.includes('frustrating')) {
      result = result.replace(/frustrating/g, 'really frustrating');
    }
  }
  
  return result;
};

/**
 * Makes response more structured for analytical communicators
 */
const makeMoreStructured = (response: string): string => {
  // Add more logical flow and clarity
  let result = response;
  
  // Add specific organizing language if not already present
  if (!result.includes('First') && !result.includes('Second') && result.length > 100) {
    const sentences = result.split('. ');
    if (sentences.length >= 3) {
      sentences[0] = "First, " + sentences[0].charAt(0).toLowerCase() + sentences[0].slice(1);
      sentences[1] = "Second, " + sentences[1].charAt(0).toLowerCase() + sentences[1].slice(1);
      result = sentences.join('. ');
    }
  }
  
  return result;
};

/**
 * Makes response more gentle and less direct for reserved communicators
 */
const makeMoreGentle = (response: string): string => {
  // Add more space and tentative language
  let result = response;
  
  // Avoid direct questions if they're present
  result = result.replace(/What brought you/g, "If you'd like to share what brought you")
               .replace(/Why did you/g, "If you're comfortable sharing why you")
               .replace(/How do you/g, "You might consider how you");
  
  // Add permission statements
  if (!result.includes("if you'd like") && !result.includes("if you want")) {
    result = result.replace(/\?/g, ", if you'd like to share?");
  }
  
  return result;
};

/**
 * Adapts language for teen communication style
 */
const adaptForTeen = (response: string): string => {
  // Use more relatable language for teens
  return response
    .replace(/difficult situation/g, 'tough situation')
    .replace(/I understand/g, 'I get it')
    .replace(/discouraging/g, 'frustrating')
    .replace(/communicate/g, 'talk')
    .replace(/assistance/g, 'help')
    .replace(/experiencing/g, 'going through');
};

/**
 * Adapts language for blue-collar communication style
 */
const adaptForBlueCollar = (response: string): string => {
  // Use more straightforward, practical language
  return response
    .replace(/I understand that/g, 'I see that')
    .replace(/would you like to elaborate/g, 'want to tell me more')
    .replace(/however/g, 'but')
    .replace(/nevertheless/g, 'still')
    .replace(/assist you/g, 'help you')
    .replace(/regarding/g, 'about');
};

/**
 * Simplifies language for clearer communication
 */
const simplifyLanguage = (response: string): string => {
  // Simplify vocabulary and sentence structure
  return response
    .replace(/utilize/g, 'use')
    .replace(/implement/g, 'use')
    .replace(/facilitate/g, 'help')
    .replace(/initiative/g, 'plan')
    .replace(/demonstrate/g, 'show')
    .replace(/subsequently/g, 'then')
    .replace(/approximately/g, 'about')
    .replace(/sufficient/g, 'enough')
    .replace(/require/g, 'need')
    .replace(/inquire/g, 'ask')
    .replace(/commence/g, 'start');
};

/**
 * Applies the small talk handling to enhance rapport in early conversation
 */
export const enhanceRapportInEarlyConversation = (
  baseResponse: string,
  userInput: string,
  messageCount: number
): string => {
  // Only enhance for early conversation (first 5 messages)
  if (messageCount > 5) return baseResponse;
  
  // Detect communication style
  const communicationStyle = detectCommunicationStyle(userInput);
  const demographicPatterns = detectDemographicPatterns(userInput);
  
  // Adapt response based on detected patterns
  const adaptedResponse = adaptResponseStyle(baseResponse, communicationStyle.style, demographicPatterns);
  
  // For first 2 messages, add extra welcoming elements if not already present
  if (messageCount <= 2 && !adaptedResponse.includes("welcome") && !adaptedResponse.includes("glad you're here")) {
    const welcomeAdditions = [
      "I'm glad you're here today. ",
      "Thanks for coming in today. ",
      "I appreciate you taking the time to be here. "
    ];
    
    const selectedAddition = welcomeAdditions[Math.floor(Math.random() * welcomeAdditions.length)];
    return selectedAddition + adaptedResponse;
  }
  
  return adaptedResponse;
};

/**
 * Generates a rapport-building response for the very first message
 */
export const generateFirstMessageResponse = (): string => {
  const firstMessages = [
    "Welcome to Cuyahoga Valley Mindful Health and Wellness. I'm Roger, and I'm here to chat with you while you wait for Dr. Eric. How are you feeling today?",
    "Hi there! I'm Roger, and I'm here to make your wait a bit more comfortable. Dr. Eric will be with you shortly. How's your day going so far?",
    "Welcome! I'm Roger. While you're waiting for Dr. Eric, I'm here to chat. How are you feeling about being here today?",
    "Hello and welcome. I'm Roger, and I'm here to talk with you while Dr. Eric finishes up with another patient. How are you doing today?"
  ];
  
  return firstMessages[Math.floor(Math.random() * firstMessages.length)];
};

