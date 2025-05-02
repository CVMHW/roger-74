
/**
 * Conversation Rules
 * 
 * Core rules governing Roger's conversation behaviors
 */

/**
 * Checks if user input is likely an introduction
 * @param input User message
 * @returns Whether the message appears to be an introduction
 */
export const isIntroduction = (input: string): boolean => {
  const introPatterns = [
    /^(hi|hello|hey|greetings)/i,
    /^(good|g'day) (morning|afternoon|evening)/i,
    /my name is/i,
    /^i('m| am) [a-z]+/i,
    /^(nice to|pleased to) meet you/i
  ];
  
  return introPatterns.some(pattern => pattern.test(input));
};

/**
 * Generates an appropriate introduction response
 * @returns Welcoming introduction response
 */
export const generateIntroductionResponse = (): string => {
  const responses = [
    "Hello! I'm Roger, a Peer Support Companion. I'm here to chat while you wait to see Dr. Eric. How are you doing today?",
    "Hi there! I'm Roger. I help out by talking with people before they see Dr. Eric. What's been going on with you?",
    "Welcome! I'm Roger, and I'm here to make your wait more comfortable before you see Dr. Eric. How are you feeling today?",
    "Hello! I'm Roger, a Peer Support Companion. While you wait for Dr. Eric, I'm here to talk about whatever's on your mind. How's your day been?"
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};

/**
 * Checks if the input is likely small talk
 * @param input User message
 * @returns Whether the message appears to be small talk
 */
export const isSmallTalk = (input: string): boolean => {
  const smallTalkPatterns = [
    /weather|rain|snow|sunny|hot|cold|warm|chilly|humid/i,
    /traffic|drive|commute|parking/i,
    /weekend|holiday|vacation|trip|travel/i,
    /sports|game|team|play|watch|score/i,
    /how are you|how's it going|how've you been/i,
    /busy day|long day|rough day|good day/i
  ];
  
  // Check if message is short (likely small talk)
  const isShortMessage = input.split(' ').length <= 10;
  
  // Check if contains small talk patterns
  const containsSmallTalkPattern = smallTalkPatterns.some(pattern => pattern.test(input));
  
  return (isShortMessage && !containsClinicalContent(input)) || containsSmallTalkPattern;
};

/**
 * Checks if the input contains clinical mental health content
 * @param input User message
 * @returns Whether the message contains clinical content
 */
const containsClinicalContent = (input: string): boolean => {
  const clinicalPatterns = [
    /depress|anxiet|panic|suicide|self-harm|trauma|ptsd|bipolar|schizo|ocd|adhd|add|autism|medication|therapy|therapist|psychiatrist|hospitalization/i
  ];
  
  return clinicalPatterns.some(pattern => pattern.test(input));
};

/**
 * Checks if input contains personal sharing with emotional content
 * @param input User message
 * @returns Whether the message contains personal sharing
 */
export const isPersonalSharing = (input: string): boolean => {
  const personalSharingPatterns = [
    /i feel|feeling|felt/i,
    /makes me|made me/i,
    /i('m| am) (sad|happy|upset|angry|frustrated|worried|concerned|scared|anxious)/i,
    /my (partner|spouse|husband|wife|boyfriend|girlfriend|family|parent|child|friend)/i,
    /happened to me/i,
    /i('ve| have) been/i,
    /i went through|i experienced|in my life/i
  ];
  
  return personalSharingPatterns.some(pattern => pattern.test(input))
    && input.split(' ').length > 8; // More than 8 words suggests substantive sharing
};

/**
 * Generates a response to personal sharing that emphasizes empathy
 * @param input User message containing personal sharing
 * @returns Empathetic response to personal sharing
 */
export const generatePersonalSharingResponse = (input: string): string => {
  // Detect emotion in the sharing
  const emotions = {
    sadness: /(sad|down|blue|depress|upset|hurt|disappoint|tearful|crying|cried)/i,
    anxiety: /(nervous|anxious|worry|stress|overwhelm|panic|afraid|scared|fear)/i,
    anger: /(angry|mad|furious|irritate|annoy|frustrat|upset)/i,
    happiness: /(happy|glad|excite|thrilled|pleased|joy|delighted|content)/i,
    confusion: /(confus|uncertain|unsure|don't understand|lost|bewildered)/i
  };
  
  // Find the emotion expressed
  let detectedEmotion = "concern";
  for (const [emotion, pattern] of Object.entries(emotions)) {
    if (pattern.test(input)) {
      detectedEmotion = emotion;
      break;
    }
  }
  
  // Generate response based on emotion
  const responses = {
    sadness: [
      "I hear the sadness in what you're sharing. That sounds really difficult. Would you like to tell me more about what's been happening?",
      "It sounds like you've been feeling down about this. That's completely understandable. What's been the hardest part of this for you?"
    ],
    anxiety: [
      "I can tell this has been causing you some worry. That makes a lot of sense given what you've shared. What's been on your mind the most about this?",
      "Feeling anxious about something like that is really normal. What aspects of this situation have been most concerning for you?"
    ],
    anger: [
      "I can hear your frustration coming through. That would be upsetting for many people. What about this situation has been most irritating?",
      "It makes sense you'd feel angry about that. Those kinds of situations can really get under your skin. How have you been handling these feelings?"
    ],
    happiness: [
      "That sounds like a really positive experience! I'm glad to hear things are going well. What's been the best part of this for you?",
      "It's great to hear you're feeling good about this. Those moments are worth celebrating. What made this particularly meaningful for you?"
    ],
    confusion: [
      "It sounds like you're trying to make sense of this situation. That kind of uncertainty can be challenging. What parts feel most unclear?",
      "When things are confusing like this, it can be hard to know which way to turn. What would help you gain some clarity right now?"
    ],
    concern: [
      "Thank you for sharing that with me. What you're describing sounds important. Can you tell me more about how this has been affecting you?",
      "I appreciate you opening up about that. It helps me understand what you're going through. How have you been feeling about all this?"
    ]
  };
  
  const emotionResponses = responses[detectedEmotion as keyof typeof responses];
  return emotionResponses[Math.floor(Math.random() * emotionResponses.length)];
};
