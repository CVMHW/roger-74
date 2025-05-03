
/**
 * Generators for emotionally attuned responses
 */

import { EmotionInfo, EverydaySituationInfo } from './types';

/**
 * Generates emotionally attuned response based on detected emotion
 * @param emotionInfo Detected emotion information
 * @param userInput Original user input
 * @returns Emotionally attuned response
 */
export const generateEmotionallyAttunedResponse = (
  emotionInfo: EmotionInfo,
  userInput: string
): string => {
  if (!emotionInfo.hasEmotion) {
    return "";
  }
  
  const { primaryEmotion, intensity, isImplicit } = emotionInfo;
  
  // Template for responses
  const responseTemplates = {
    sadness: {
      high: "I hear how deeply upset you are. That sounds really painful. Would you like to tell me more about what's happened?",
      medium: "I can tell you're feeling sad about this. That's completely understandable. What's been the hardest part for you?",
      low: "It sounds like you're feeling a bit down about that. These things can definitely affect our mood. Would you like to talk more about it?"
    },
    anxiety: {
      high: "I can hear how intense your worry is right now. That must be really overwhelming. What's feeling most pressing in this moment?",
      medium: "I notice you're feeling anxious about this situation. That makes a lot of sense. What's your biggest concern right now?",
      low: "Sounds like there's a bit of worry there. It's natural to feel concerned about these things. What are you thinking might happen?"
    },
    anger: {
      high: "I can tell you're really upset about this. That level of frustration is completely understandable given what you're describing. What's been most infuriating about the situation?",
      medium: "I hear your frustration coming through. That would be irritating for most people. What aspect of this has been most bothersome?",
      low: "It seems like this has been a bit annoying for you. Little things can definitely add up. What part of it has been bothering you most?"
    },
    joy: {
      high: "That's wonderful news! I can tell you're really thrilled about this. What's been the best part of this experience?",
      medium: "I'm happy to hear that! Sounds like things are going well. What about this has made you feel good?",
      low: "That's nice to hear. It's good when things work out. What's made this a positive experience for you?"
    },
    shame: {
      high: "What you're describing sounds really difficult to talk about. Many people would feel the same way in that situation. Would it help to share more about what happened?",
      medium: "I can understand feeling embarrassed about something like that. We all have moments we wish had gone differently. How have you been processing this?",
      low: "Those awkward moments happen to everyone. It's completely normal to feel a bit self-conscious. Has this been on your mind a lot?"
    }
  };
  
  // Get the appropriate template
  const emotionTemplates = responseTemplates[primaryEmotion as keyof typeof responseTemplates];
  let response = emotionTemplates[intensity as keyof typeof emotionTemplates];
  
  // For implicit emotions, modify the response slightly
  if (isImplicit) {
    response = response.replace("I can tell you're feeling", "It sounds like you might be feeling");
    response = response.replace("I notice you're feeling", "You might be feeling");
    response = response.replace("I hear how", "It sounds like");
  }
  
  return response;
};

/**
 * Generates practical everyday support responses
 * @param situationInfo Information about the everyday situation
 * @returns Practical support response
 */
export const generatePracticalSupportResponse = (
  situationInfo: EverydaySituationInfo
): string => {
  if (!situationInfo.isEverydaySituation || !situationInfo.practicalSupportNeeded) {
    return "";
  }
  
  const practicalResponses = {
    spill_or_stain: "Oh no, that stinks! For fresh stains, club soda can really work wonders. For coffee or tea stains, a bit of vinegar and water might help. Did it get on anything important?",
    weather_issue: "The weather in Cleveland can be so unpredictable! Did you get caught without the right gear for today's conditions?",
    minor_injury: "Those small injuries can be surprisingly painful and annoying. Do you have what you need to take care of it?",
    lost_item: "Losing things is so frustrating. Sometimes retracing your steps mentally can help. Where do you remember having it last?",
    minor_conflict: "Those kinds of conflicts can really put a damper on your day. What do you think led to the disagreement?",
    tired_sleep: "Being tired makes everything else harder to deal with. Have you been having trouble sleeping lately or is it just been an extra busy time?"
  };
  
  return practicalResponses[situationInfo.situationType as keyof typeof practicalResponses] || 
    "That kind of everyday challenge can be really frustrating. How has it been affecting your day?";
};

