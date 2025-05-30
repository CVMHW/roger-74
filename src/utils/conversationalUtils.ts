/**
 * Utilities for generating conversational responses
 */
import { detectEmotion } from './nlpProcessor'; // Add this on line 3
import { generateRogerianResponse } from './rogerianPrinciples';
import { generateCVMHWInfoResponse } from './conversation/cvmhwResponseGenerator';
import { generateCollaborativeResponse } from './conversation/collaborativeResponseGenerator';
import { appropriateResponses } from './conversation/generalResponses';
import { adaptToneForClientPreference } from './safetySupport';
import { ConcernType } from './reflection/reflectionTypes';
import { 
  cleanFillerWords, 
  detectFillerPatterns, 
  generateCasualSpeechResponse,
  generateMinimalInputResponse
} from './conversationEnhancement/fillerWordProcessor';
import { 
  detectOhioReferences,
  generateOhioContextResponse,
  mapReferenceToMentalHealthTopic
} from './conversationEnhancement/ohioContextManager';
import { 
  detectEmotionalPatterns,
  detectRhetoricalPatterns,
  detectSarcasm,
  generateEmotionalResponse,
  generateRhetoricalResponse,
  generateSarcasmResponse
} from './conversationEnhancement/emotionalInputHandler';
import { detectContentConcerns } from './conversationEnhancement/emotionalInputHandler';

// Export all the imported functionality
export * from './conversation/cvmhwInfo';
export * from './conversation/collaborativeSupportPrinciples';
export * from './conversation/clientCenteredApproach';
export * from './conversation/cvmhwResponseGenerator';
export * from './conversation/collaborativeResponseGenerator';
export * from './conversation/generalResponses';
export * from './safetySupport';

// Enhanced client preference detection
export const detectClientPreferences = (
  currentInput: string,
  history: string[]
): {
  prefersFormalLanguage: boolean;
  prefersDirectApproach: boolean;
  isFirstTimeWithMentalHealth: boolean;
} => {
  const combinedText = [currentInput, ...history].join(" ").toLowerCase();
  
  const formalLanguageIndicators = [
    'formal', 'professional', 'business', 'proper', 'corporate',
    'respectful', 'sir', 'madam', 'mr.', 'ms.', 'mrs.', 'dr.'
  ];
  
  const directApproachIndicators = [
    'straight to the point', 'direct', 'concrete', 'specifically',
    'exactly', 'precisely', 'no nonsense', 'bottom line', 'get to the point'
  ];
  
  const firstTimeIndicators = [
    'first time', 'never before', 'new to this', 'never tried', 
    'finally decided', 'took the step', 'never spoken', 'never talked'
  ];
  
  return {
    prefersFormalLanguage: formalLanguageIndicators.some(word => combinedText.includes(word)),
    prefersDirectApproach: directApproachIndicators.some(word => combinedText.includes(word)),
    isFirstTimeWithMentalHealth: firstTimeIndicators.some(phrase => combinedText.includes(phrase))
  };
};

/**
 * Detect mild somatic complaints that don't require medical attention
 * @param userInput User's message
 * @returns Whether the complaint is likely a mild issue from fatigue/stress
 */
export const detectMildSomaticComplaints = (userInput: string): { 
  isMildSomatic: boolean; 
  somaticType: string | null;
  likelyFromOverwork: boolean;
} => {
  const lowerInput = userInput.toLowerCase();
  
  // Check for mentions of work pressure, lack of sleep, or overworking
  const overworkPatterns = [
    /work(ing|ed)?\s+(late|overtime|all night)/i,
    /stay(ing|ed)? up\s+(late|all night)/i,
    /(haven'?t|not)\s+sleep/i,
    /tired|exhausted|fatigue/i,
    /busy|overwork(ed)?|stress(ed)?|burn(ed|ing|t)?\s+out/i,
    /no\s+break/i,
    /long\s+day/i
  ];
  
  const likelyFromOverwork = overworkPatterns.some(pattern => pattern.test(userInput));
  
  // Common mild somatic complaints
  const mildComplaints = {
    stomach: /stomach (hurts|ache|pain|upset)|tummy|nauseous|queasy/i,
    headache: /headache|head (hurts|ache|pain)|migraine/i,
    fatigue: /tired|exhausted|no energy|drained/i,
    bodyache: /body ache|sore|stiff/i,
    mild: /feeling off|not feeling (good|great)|under the weather/i
  };
  
  // Check for severe qualifiers that might indicate a more serious condition
  const severeQualifiers = [
    /severe|extreme|worst|unbearable|terrible|excruciating/i,
    /vomit(ing)?|throw(ing)? up|blood/i,
    /can'?t (stand|walk|move|eat|drink)/i,
    /emergency|urgent|hospital|doctor|need help|911/i,
    /days|weeks|months/i // Duration indicating chronic issue
  ];
  
  // Check if any mild complaint is present
  let somaticType: string | null = null;
  let hasMildComplaint = false;
  
  for (const [type, pattern] of Object.entries(mildComplaints)) {
    if (pattern.test(lowerInput)) {
      somaticType = type;
      hasMildComplaint = true;
      break;
    }
  }
  
  // If no mild complaint or severe qualifier present, it's not a medical concern
  if (!hasMildComplaint) {
    return { 
      isMildSomatic: false, 
      somaticType: null,
      likelyFromOverwork: likelyFromOverwork
    };
  }
  
  // Check if any severe qualifier is present, making it potentially more serious
  const hasSevereQualifier = severeQualifiers.some(pattern => pattern.test(lowerInput));
  
  return {
    isMildSomatic: hasMildComplaint && !hasSevereQualifier,
    somaticType,
    likelyFromOverwork
  };
};

/**
 * Generate appropriate response for mild somatic complaints
 * @param userInput User's message
 * @param somaticInfo Analysis of the somatic complaint
 * @returns Empathetic, conversational response
 */
export const generateMildSomaticResponse = (
  userInput: string, 
  somaticInfo: ReturnType<typeof detectMildSomaticComplaints>
): string => {
  // Get the appropriate opening based on the type of somatic complaint
  let responseOpening = "";
  
  switch (somaticInfo.somaticType) {
    case 'stomach':
      responseOpening = somaticInfo.likelyFromOverwork 
        ? "Working late and not getting enough rest can definitely affect your stomach. " 
        : "I hear your stomach isn't feeling great today. ";
      break;
    case 'headache':
      responseOpening = somaticInfo.likelyFromOverwork 
        ? "Those late nights can bring on headaches for sure. " 
        : "Having a headache can make everything harder. ";
      break;
    case 'fatigue':
      responseOpening = "Working through the night will definitely leave you feeling drained. ";
      break;
    case 'bodyache':
      responseOpening = somaticInfo.likelyFromOverwork 
        ? "Working long hours can really take a physical toll. " 
        : "Being physically uncomfortable makes everything harder. ";
      break;
    default:
      responseOpening = somaticInfo.likelyFromOverwork 
        ? "Working late nights can definitely leave you feeling off. " 
        : "Not feeling your best today? ";
  }
  
  // Add a conversational follow-up
  const followUps = [
    "How are you managing to take care of yourself today?",
    "What do you think might help you feel better?",
    "Have you been able to take any breaks?",
    "What's been going on that's kept you working so late?",
    "What's been on your mind through all of this?"
  ];
  
  // Select a follow-up based on the context
  let followUpIndex = 0;
  if (somaticInfo.likelyFromOverwork) {
    // For overwork, prioritize questions about breaks or work situation
    followUpIndex = Math.floor(Math.random() * 3) + 2; // indices 2-4
  } else {
    // For general complaints, prioritize self-care questions
    followUpIndex = Math.floor(Math.random() * 2); // indices 0-1
  }
  
  return responseOpening + followUps[followUpIndex];
};

/**
 * Detects if the user's message contains explicit statements of negative emotional states
 */
export function detectSimpleNegativeState(userInput: string): {
  isNegativeState: boolean;
  stateType: 'anxious' | 'angry' | 'sad' | 'frustrated' | 'overwhelmed';
  intensity: 'low' | 'medium' | 'high';
  explicitStatement: boolean;
  explicitFeelings?: string[];
} {
  if (!userInput) {
    return {
      isNegativeState: false,
      stateType: 'sad',
      intensity: 'low',
      explicitStatement: false
    };
  }
  
  const lowerInput = userInput.toLowerCase();
  
  // Check for explicit statements about emotional states
  const explicitPatterns = {
    anxious: [
      /i('m| am) (feeling |really |so |just |kind of |a bit |extremely |very )?anxious/i,
      /i('m| am) (feeling |really |so |just |kind of |a bit |extremely |very )?nervous/i,
      /i('m| am) (feeling |really |so |just |kind of |a bit |extremely |very )?worried/i,
      /i have (some |a lot of |serious |terrible |bad |really bad )?anxiety/i,
    ],
    angry: [
      /i('m| am) (feeling |really |so |just |kind of |a bit |extremely |very )?angry/i,
      /i('m| am) (feeling |really |so |just |kind of |a bit |extremely |very )?mad/i,
      /i('m| am) (feeling |really |so |just |kind of |a bit |extremely |very )?furious/i,
      /i('m| am) (feeling |really |so |just |kind of |a bit |extremely |very )?pissed off/i,
    ],
    sad: [
      /i('m| am) (feeling |really |so |just |kind of |a bit |extremely |very )?sad/i,
      /i('m| am) (feeling |really |so |just |kind of |a bit |extremely |very )?depressed/i,
      /i('m| am) (feeling |really |so |just |kind of |a bit |extremely |very )?down/i,
      /i('m| am) (feeling |really |so |just |kind of |a bit |extremely |very )?low/i,
      /i('m| am) (feeling |really |so |just |kind of |a bit |extremely |very )?blue/i,
      /i('m| am) (feeling |really |so |just |kind of |a bit |extremely |very )?unhappy/i,
    ],
    frustrated: [
      /i('m| am) (feeling |really |so |just |kind of |a bit |extremely |very )?frustrated/i,
      /i('m| am) (feeling |really |so |just |kind of |a bit |extremely |very )?annoyed/i,
      /i('m| am) (feeling |really |so |just |kind of |a bit |extremely |very )?irritated/i,
    ],
    overwhelmed: [
      /i('m| am) (feeling |really |so |just |kind of |a bit |extremely |very )?overwhelmed/i,
      /i('m| am) (feeling |really |so |just |kind of |a bit |extremely |very )?exhausted/i,
      /i('m| am) (feeling |really |so |just |kind of |a bit |extremely |very )?drained/i,
      /i('m| am) (feeling |really |so |just |kind of |a bit |extremely |very )?burned out/i,
    ]
  };
  
  // Check for explicit statements
  let foundStateType: 'anxious' | 'angry' | 'sad' | 'frustrated' | 'overwhelmed' = 'sad';
  let explicitStatement = false;
  let explicitFeelings: string[] = [];
  
  for (const [stateType, patterns] of Object.entries(explicitPatterns)) {
    for (const pattern of patterns) {
      const match = lowerInput.match(pattern);
      if (match) {
        foundStateType = stateType as any;
        explicitStatement = true;
        
        // Extract the actual feeling word
        const fullMatch = match[0].toLowerCase();
        const feelingWords = [
          'anxious', 'nervous', 'worried', 'anxiety',
          'angry', 'mad', 'furious', 'pissed',
          'sad', 'depress', 'down', 'low', 'blue', 'unhappy',
          'frustrated', 'annoyed', 'irritated',
          'overwhelmed', 'exhausted', 'drained', 'burned out'
        ];
        
        for (const word of feelingWords) {
          if (fullMatch.includes(word)) {
            explicitFeelings.push(word);
            break;
          }
        }
      }
    }
  }
  
  // Check for intensity modifiers
  let intensity: 'low' | 'medium' | 'high' = 'medium';
  if (/really|very|extremely|so|terrible|serious/i.test(lowerInput)) {
    intensity = 'high';
  } else if (/kind of|a bit|some|a little|slightly/i.test(lowerInput)) {
    intensity = 'low';
  }
  
  // If not an explicit statement, check for general negative tone
  // and determine the most likely state type
  if (!explicitStatement) {
    const wordIndicators = {
      anxious: ['worry', 'afraid', 'scared', 'fear', 'panic', 'stress', 'anxious'],
      angry: ['hate', 'anger', 'mad', 'furious', 'rage', 'pissed'],
      sad: ['sad', 'depress', 'unhappy', 'miserable', 'down', 'blue', 'grief'],
      frustrated: ['frustrat', 'annoy', 'irritat', 'bother', 'upset'],
      overwhelmed: ['overwhelm', 'exhaust', 'tired', 'drain', 'burn out', 'too much']
    };
    
    let maxCount = 0;
    for (const [stateType, words] of Object.entries(wordIndicators)) {
      let count = 0;
      for (const word of words) {
        if (lowerInput.includes(word)) {
          count++;
          // Also add to explicit feelings for reference
          if (!explicitFeelings.includes(word)) {
            explicitFeelings.push(word);
          }
        }
      }
      
      if (count > maxCount) {
        maxCount = count;
        foundStateType = stateType as any;
      }
    }
    
    if (maxCount > 0) {
      return {
        isNegativeState: true,
        stateType: foundStateType,
        intensity,
        explicitStatement: false,
        explicitFeelings
      };
    }
  }
  
  return {
    isNegativeState: explicitStatement || explicitFeelings.length > 0,
    stateType: foundStateType,
    intensity,
    explicitStatement,
    explicitFeelings
  };
}

/**
 * Generates content-aware responses to explicit emotional states
 * @param userInput User's message
 * @param stateInfo Detected emotional state
 * @param contentInfo Optional detected content/concerns
 * @returns Appropriate response acknowledging both emotion and specific content
 */
export const generateSimpleNegativeStateResponse = (
  userInput: string, 
  stateInfo: ReturnType<typeof detectSimpleNegativeState>,
  contentInfo?: ReturnType<typeof detectContentConcerns>
): string => {
  if (!stateInfo.isNegativeState) {
    return "I hear you. What's been going on?";
  }
  
  const contentAcknowledgment = contentInfo?.hasConcern 
    ? ` about ${contentInfo.specificConcern || contentInfo.category}`
    : '';
  
  const { stateType, intensity } = stateInfo;
  
  // Enhanced responses that acknowledge BOTH the emotional state AND specific content
  switch (stateType) {
    case 'angry':
      if (intensity === 'high') {
        if (contentInfo?.hasConcern && contentInfo.category === 'financial') {
          return `I hear how angry you are about ${contentInfo.specificConcern || 'the payment issues'}. That's completely understandable - payment problems can be incredibly frustrating. What's your next step to address this?`;
        }
        if (contentInfo?.hasConcern && contentInfo.category === 'work') {
          return `I understand you're feeling really angry about ${contentInfo.specificConcern || 'your work situation'}. That's a completely valid reaction. What aspect of this situation is most infuriating right now?`;
        }
        return `I understand you're feeling really angry${contentAcknowledgment}. That's a completely valid reaction. What's been happening that's triggered these feelings?`;
      } else if (intensity === 'low') {
        return `I hear that you're feeling a bit annoyed${contentAcknowledgment}. What specifically has been bothering you?`;
      } else {
        if (contentInfo?.hasConcern && contentInfo.category === 'financial') {
          return `I hear that you're feeling angry about ${contentInfo.specificConcern || 'the payment issues'}. That makes complete sense - financial concerns can be really frustrating. What's been most difficult about this situation?`;
        }
        if (contentInfo?.hasConcern && contentInfo.category === 'work') {
          return `I understand you're angry about ${contentInfo.specificConcern || 'your work situation'}. That's completely valid. Work challenges can be really frustrating. What's been most difficult to deal with?`;
        }
        return `I understand you're feeling angry${contentAcknowledgment}. That's completely valid. What's been happening that's led to these feelings?`;
      }
    
    case 'sad':
      if (intensity === 'high') {
        return `I'm really sorry to hear you're feeling so deeply sad${contentAcknowledgment}. That sounds really difficult. Would it help to talk more about what's going on?`;
      } else if (intensity === 'low') {
        return `I hear that you're feeling a bit down${contentAcknowledgment}. Would you like to talk about what's contributing to that?`;
      } else {
        if (contentInfo?.hasConcern) {
          return `I hear that you're feeling sad about ${contentInfo.specificConcern || contentInfo.category}. That's completely understandable. What aspect of this has been most difficult for you?`;
        }
        return `I hear that you're feeling sad${contentAcknowledgment}. That's completely valid. Would it help to talk more about what's going on?`;
      }
    
    case 'anxious':
      if (intensity === 'high') {
        return `It sounds like you're feeling really anxious${contentAcknowledgment}. That can be really overwhelming. What's been most concerning for you?`;
      } else if (intensity === 'low') {
        return `I hear that you're feeling a bit anxious${contentAcknowledgment}. What's been on your mind about that?`;
      } else {
        if (contentInfo?.hasConcern) {
          return `I understand you're feeling anxious about ${contentInfo.specificConcern || contentInfo.category}. That makes sense. What specific concerns do you have about this?`;
        }
        return `I understand you're feeling anxious${contentAcknowledgment}. That's completely understandable. What specific worries have been coming up?`;
      }
    
    case 'frustrated':
      if (intensity === 'high') {
        if (contentInfo?.hasConcern && contentInfo.category === 'financial') {
          return `I hear how frustrated you are with ${contentInfo.specificConcern || 'the payment issues'}. That makes complete sense - it's infuriating when financial matters aren't handled properly. What impact is this having on you right now?`;
        }
        if (contentInfo?.hasConcern && contentInfo.category === 'work') {
          return `I understand you're really frustrated with ${contentInfo.specificConcern || 'your work situation'}. Work issues can be extremely aggravating. What's been most difficult to deal with?`;
        }
        return `I hear that you're really frustrated${contentAcknowledgment}. That's completely understandable. What's been most aggravating about this situation?`;
      } else if (intensity === 'low') {
        return `I understand you're somewhat annoyed${contentAcknowledgment}. What specifically has been bothering you?`;
      } else {
        if (contentInfo?.hasConcern) {
          return `I hear that you're frustrated about ${contentInfo.specificConcern || contentInfo.category}. That makes sense. What's been most challenging about this?`;
        }
        return `I hear that you're frustrated${contentAcknowledgment}. That's completely valid. What's been happening?`;
      }
    
    case 'overwhelmed':
      if (intensity === 'high') {
        return `It sounds like you're feeling completely overwhelmed${contentAcknowledgment}. That must be really difficult. What's been most challenging to manage?`;
      } else if (intensity === 'low') {
        return `I hear that you're feeling a bit overwhelmed${contentAcknowledgment}. What's been contributing to that?`;
      } else {
        if (contentInfo?.hasConcern) {
          return `I understand you're feeling overwhelmed by ${contentInfo.specificConcern || contentInfo.category}. That's completely understandable. What aspect has been most difficult to handle?`;
        }
        return `I understand you're feeling overwhelmed${contentAcknowledgment}. That's completely valid. What's been the most challenging part?`;
      }
    
    default:
      if (contentInfo?.hasConcern) {
        return `Thank you for sharing how you're feeling about ${contentInfo.specificConcern || contentInfo.category}. Would you like to tell me more about what's going on?`;
      }
      return "Thank you for sharing how you're feeling. Would you like to tell me more about what's going on?";
  }
};

/**
 * Detect political or news-related topics that have emotional content
 * @param userInput The user's message
 * @returns Whether political content was detected and its specific nature
 */
export const detectPoliticalEmotions = (userInput: string): {
  isPolitical: boolean;
  politicalTopic?: string;
  emotionType?: string;
  emotionExpressed?: string;
} => {
  if (!userInput) {
    return { isPolitical: false };
  }
  
  const lowerInput = userInput.toLowerCase();
  
  // Define political keywords and topics
  const politicalTopics = [
    { keyword: 'election', topic: 'elections' },
    { keyword: 'vote', topic: 'elections' },
    { keyword: 'democrat', topic: 'political parties' },
    { keyword: 'republican', topic: 'political parties' },
    { keyword: 'liberal', topic: 'political ideology' },
    { keyword: 'conservative', topic: 'political ideology' },
    { keyword: 'biden', topic: 'political figures' },
    { keyword: 'trump', topic: 'political figures' },
    { keyword: 'congress', topic: 'government' },
    { keyword: 'senate', topic: 'government' },
    { keyword: 'house of representatives', topic: 'government' },
    { keyword: 'supreme court', topic: 'judiciary' },
    { keyword: 'justice', topic: 'judiciary' },
    { keyword: 'law', topic: 'policy' },
    { keyword: 'policy', topic: 'policy' },
    { keyword: 'tax', topic: 'economic policy' },
    { keyword: 'healthcare', topic: 'healthcare policy' },
    { keyword: 'abortion', topic: 'reproductive rights' },
    { keyword: 'gun', topic: 'gun policy' },
    { keyword: 'climate', topic: 'climate policy' },
    { keyword: 'immigration', topic: 'immigration policy' },
    { keyword: 'protest', topic: 'civic action' },
    { keyword: 'riot', topic: 'civil unrest' },
    { keyword: 'media', topic: 'media coverage' }
  ];
  
  // Define emotion categories
  const emotions = [
    { keywords: ['angry', 'mad', 'furious', 'outraged', 'pissed'], category: 'anger' },
    { keywords: ['worried', 'anxious', 'concerned', 'fearful', 'scared', 'afraid'], category: 'anxiety' },
    { keywords: ['sad', 'disappointed', 'disheartened', 'hopeless', 'depressed'], category: 'sadness' },
    { keywords: ['happy', 'hopeful', 'excited', 'optimistic', 'pleased'], category: 'happiness' },
    { keywords: ['confused', 'uncertain', 'unsure', 'bewildered', 'perplexed'], category: 'confusion' },
    { keywords: ['frustrated', 'annoyed', 'irritated', 'exasperated', 'aggravated'], category: 'frustration' }
  ];
  
  // Check if the input contains political topics
  const foundTopic = politicalTopics.find(item => lowerInput.includes(item.keyword));
  if (!foundTopic) {
    return { isPolitical: false };
  }
  
  // Check for emotional content
  let emotionFound = null;
  let emotionExpressed = null;
  
  for (const emotion of emotions) {
    for (const keyword of emotion.keywords) {
      if (lowerInput.includes(keyword)) {
        emotionFound = emotion.category;
        emotionExpressed = keyword;
        break;
      }
      
      // Also check explicit statements
      const explicitPattern = new RegExp(`i('m| am) (feeling |really |so |just |kind of |a bit |extremely |very )?${keyword}`, 'i');
      if (explicitPattern.test(lowerInput)) {
        emotionFound = emotion.category;
        emotionExpressed = keyword;
        break;
      }
    }
    
    if (emotionFound) break;
  }
  
  return {
    isPolitical: true,
    politicalTopic: foundTopic.topic,
    emotionType: emotionFound,
    emotionExpressed: emotionExpressed
  };
};

/**
 * Generate an appropriate response to political emotions
 * Focuses on the emotional experience rather than the political content
 */
export const generatePoliticalEmotionResponse = (
  userInput: string,
  politicalInfo: ReturnType<typeof detectPoliticalEmotions>
): string => {
  if (!politicalInfo.isPolitical) {
    return "";
  }
  
  // Focus on the emotion rather than the political topic
  switch (politicalInfo.emotionType) {
    case 'upset':
      return "I hear that you're feeling upset about this. Politics can definitely bring up strong emotions for many of us. Would you like to talk more about how it's affecting you?";
    case 'angry':
      return "I can hear the frustration in what you're sharing. It sounds like this has really stirred up some strong feelings for you. What about this situation is most upsetting?";
    case 'concerned':
      return "It sounds like you have some concerns about what's happening. Many people find the political climate anxiety-provoking these days. How has it been affecting you?";
    case 'supportive':
      return "I hear you have some positive feelings about this. It can be helpful to identify what matters to us in our civic life. What values are most important to you?";
    case 'neutral':
    default:
      return "Thanks for sharing your thoughts on this political topic. I'm curious about what aspects of this matter most to you personally?";
  }
};

/**
 * Enhanced function to generate appropriate conversational responses based on user input context
 * Incorporates Ohio context, filler word processing, and emotional/rhetorical handling
 * @param userInput User's message
 * @param conversationHistory Previous messages for context
 * @param concernType Any detected safety concerns
 * @returns Appropriate response
 */
export const generateConversationalResponse = (
  userInput: string, 
  conversationHistory: string[] = [],
  concernType?: ConcernType | null
): string => {
  // Detect client preferences from conversation
  const clientPreferences = detectClientPreferences(userInput, conversationHistory);
  
  // First check if the input is very minimal (3 words or less)
  const words = userInput.trim().split(/\s+/);
  if (words.length <= 3 && !userInput.includes('?')) {
    return generateMinimalInputResponse(userInput);
  }
  
  // HIGHEST PRIORITY: Check for explicitly stated feelings in the current message
  const negativeStateInfo = detectSimpleNegativeState(userInput);
  if (negativeStateInfo.isNegativeState) {
    return adaptToneForClientPreference(generateSimpleNegativeStateResponse(userInput, negativeStateInfo), clientPreferences);
  }
  
  // Check for political emotional content
  const politicalInfo = detectPoliticalEmotions(userInput);
  if (politicalInfo.isPolitical) {
    return adaptToneForClientPreference(generatePoliticalEmotionResponse(userInput, politicalInfo), clientPreferences);
  }
  
  // Check for mild somatic complaints before handling more serious medical concerns
  const somaticInfo = detectMildSomaticComplaints(userInput);
  if (somaticInfo.isMildSomatic) {
    return adaptToneForClientPreference(generateMildSomaticResponse(userInput, somaticInfo), clientPreferences);
  }
  
  // Check if the user is asking about CVMHW specifically
  const cvmhwResponse = generateCVMHWInfoResponse(userInput);
  if (cvmhwResponse) {
    return adaptToneForClientPreference(cvmhwResponse, clientPreferences);
  }
  
  // Process filler words and detect patterns
  const cleanedInput = cleanFillerWords(userInput);
  const fillerPatterns = detectFillerPatterns(userInput);
  
  // Detect Ohio-specific references
  const ohioReferences = detectOhioReferences(userInput);
  
  // Detect emotional and rhetorical patterns
  const emotionalPatterns = detectEmotionalPatterns(userInput);
  const rhetoricalPatterns = detectRhetoricalPatterns(userInput);
  const isSarcastic = detectSarcasm(userInput);
  
  // Next check if the user is asking about the collaborative approach
  const collaborativeResponse = generateCollaborativeResponse(userInput);
  if (collaborativeResponse) {
    return adaptToneForClientPreference(collaborativeResponse, clientPreferences);
  }
  
  // Check if a Rogerian-specific response is appropriate
  const rogerianResponse = generateRogerianResponse(userInput);
  if (rogerianResponse) {
    return adaptToneForClientPreference(rogerianResponse, clientPreferences);
  }
  
  // For safety concerns, always ensure deescalation approach
  if (concernType && ['crisis', 'tentative-harm', 'substance-use'].includes(concernType)) {
    // Get an appropriate response from the general responses
    const baseResponse = appropriateResponses[Math.floor(Math.random() * appropriateResponses.length)];
    
    // Always adapt tone for safety concerns based on client preferences
    return adaptToneForClientPreference(baseResponse, {
      ...clientPreferences,
      // For safety concerns, always add extra care for first-time mental health engagement
      isFirstTimeWithMentalHealth: true
    });
  }
  
  // Generate response strategies for different input types
  const casualSpeechStrategy = generateCasualSpeechResponse(
    userInput, 
    cleanedInput, 
    fillerPatterns
  );
  
  const ohioContextStrategy = generateOhioContextResponse(ohioReferences);
  
  // Prioritize response types based on intensity and relevance
  
  // 0. Minimal responses (highest priority)
  if (fillerPatterns.isMinimalResponse) {
    return generateMinimalInputResponse(userInput);
  }
  
  // 1. High intensity emotional content takes high priority
  if (emotionalPatterns.hasEmotionalContent && emotionalPatterns.intensity === 'high') {
    const emotionalResponse = generateEmotionalResponse(emotionalPatterns);
    return adaptToneForClientPreference(emotionalResponse, clientPreferences);
  }
  
  // 2. Sarcasm detection and handling
  if (isSarcastic) {
    const sarcasmResponse = generateSarcasmResponse();
    return adaptToneForClientPreference(sarcasmResponse, clientPreferences);
  }
  
  // 3. Subtle emotional expressions need gentle, conversational responses
  if (emotionalPatterns.hasEmotionalContent && emotionalPatterns.subtleEmotion) {
    const emotionalResponse = generateEmotionalResponse(emotionalPatterns);
    return adaptToneForClientPreference(emotionalResponse, clientPreferences);
  }
  
  // 4. Rhetorical questions
  if (rhetoricalPatterns.isRhetorical) {
    const rhetoricalResponse = generateRhetoricalResponse(rhetoricalPatterns);
    return adaptToneForClientPreference(rhetoricalResponse, clientPreferences);
  }
  
  // 5. Medium intensity emotional content
  if (emotionalPatterns.hasEmotionalContent) {
    const emotionalResponse = generateEmotionalResponse(emotionalPatterns);
    return adaptToneForClientPreference(emotionalResponse, clientPreferences);
  }
  
  // 6. Ohio-specific context if present
  if (ohioContextStrategy.shouldIncludeLocalReference) {
    // Create a response that bridges Ohio reference to mental health
    const ohioReference = ohioReferences.detectedLocations[0] || 
                         ohioReferences.detectedCulturalReferences[0];
    
    if (ohioReference) {
      const mentalHealthConnection = mapReferenceToMentalHealthTopic(ohioReference);
      const response = `${ohioContextStrategy.opener}${mentalHealthConnection}`;
      return adaptToneForClientPreference(response, clientPreferences);
    }
  }
  
  // 7. Handle casual speech and hesitation patterns
  if (casualSpeechStrategy.isSubtle || fillerPatterns.hasHighFillerDensity || fillerPatterns.potentialHesitation) {
    // Use the opener from casual speech strategy
    const baseResponse = appropriateResponses[Math.floor(Math.random() * appropriateResponses.length)];
    const response = `${casualSpeechStrategy.suggestedOpener}${baseResponse}`;
    return adaptToneForClientPreference(response, clientPreferences);
  }
  
  // If no specific pattern is matched, use more conversational general responses
  const conversationalResponses = [
    "What's been going on with you lately?",
    "How have things been for you?",
    "I'm here to chat. What's on your mind?",
    "What would be most helpful to talk about today?",
    "What's been happening in your world?",
    "How are you feeling about things right now?",
    "What's been on your mind lately?",
    "Is there something specific you'd like to talk about?"
  ];
  
  const baseResponse = conversationalResponses[Math.floor(Math.random() * conversationalResponses.length)];
  return adaptToneForClientPreference(baseResponse, clientPreferences);
};
