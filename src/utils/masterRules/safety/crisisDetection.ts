
/**
 * Enhanced crisis detection system with RAG integration
 * Detects serious mental health conditions requiring immediate intervention
 */

import { CrisisDetectionResult, CrisisType, CrisisProtocol } from '../emotionalAttunement/types';
import { retrieveFactualGrounding, retrieveSimilarResponses } from '../../hallucinationPrevention/retrieval';

// Crisis detection patterns with high specificity to avoid false positives
const suicidalIdeationPatterns = [
  /suicid(e|al)|kill (myself|me)|end (my|this) life|take my (own )?life/i,
  /don'?t want to (live|be alive)|wish I was dead|rather be dead/i,
  /plan(ning)? (to|for) (end|suicide|kill)/i,
  /(thinking|thought) about (killing|hurting|harming) myself/i,
  /no (point|reason) (in|to) (living|life)|better off dead/i,
];

const homicidalIdeationPatterns = [
  /kill (them|him|her|someone)|hurt (others|them|someone)/i,
  /(thinking|thought) about (killing|hurting|harming) (someone|others|people)/i,
  /want (them|him|her|someone) (dead|to die|to suffer)/i,
  /plan(ning)? to (harm|hurt|attack|kill) (someone|others|people)/i,
  /urge to (harm|hurt|kill) (someone|others|people)/i,
];

const psychosisPatterns = [
  /hearing voices|seeing things|hallucination/i,
  /people (watching|following|monitoring|tracking) me/i,
  /government (tracking|monitoring|watching|following|controlling|targeting) me/i,
  /thoughts (being|are) (controlled|inserted|broadcast|not mine)/i,
  /paranoid|delusion|psychotic|schizophreni/i,
  /everyone (is|wants to|trying to) (harm|hurt|kill|get) me/i,
  /reality (isn't real|is fake|is simulated)/i,
];

const acuteDissociationPatterns = [
  /not (in|feeling|connected to) (my body|reality|myself)/i,
  /feeling detached|depersonalization|derealization/i,
  /nothing (feels|seems) real|world (feels|seems) unreal/i,
  /out of (my body|touch with reality|myself)/i,
];

const acuteTraumaPatterns = [
  /(just|recently) (assaulted|attacked|raped|abused|traumatized)/i,
  /flashback|reliving trauma|triggered/i,
  /panic attack right now|can't breathe|heart racing/i,
];

/**
 * Crisis protocols with appropriate responses and resources
 */
const crisisProtocols: Record<CrisisType, CrisisProtocol> = {
  'suicide': {
    type: 'suicide',
    responseTemplate: "I'm very concerned about what you're sharing regarding thoughts of suicide. This is serious, and it's important you speak with a crisis professional right away. Please call the 988 Suicide & Crisis Lifeline (call or text 988) immediately, or go to your nearest emergency room. Would you like me to provide additional resources?",
    resourceLinks: [
      "988 Suicide & Crisis Lifeline: Call or text 988",
      "Crisis Text Line: Text HOME to 741741"
    ],
    immediateAction: true
  },
  'homicide': {
    type: 'homicide',
    responseTemplate: "I'm concerned about the thoughts you're describing about harming others. These thoughts require immediate professional support. Please call a crisis line like 988 (call or text) or go to your nearest emergency room. If you feel you might act on these thoughts imminently, please call 911 right away.",
    resourceLinks: [
      "988 Suicide & Crisis Lifeline: Call or text 988",
      "Emergency services: 911"
    ],
    immediateAction: true
  },
  'self-harm': {
    type: 'self-harm',
    responseTemplate: "I'm concerned about your thoughts of harming yourself. While these thoughts are distressing, help is available. Please reach out to the 988 Suicide & Crisis Lifeline (call or text 988) to speak with a trained counselor who can provide immediate support.",
    resourceLinks: [
      "988 Suicide & Crisis Lifeline: Call or text 988",
      "Crisis Text Line: Text HOME to 741741"
    ],
    immediateAction: true
  },
  'psychosis': {
    type: 'psychosis',
    responseTemplate: "What you're describing sounds like it may be symptoms of psychosis, which requires professional evaluation. These experiences can be frightening, but treatment is available and effective. Please reach out to a mental health crisis line or emergency services for immediate support.",
    resourceLinks: [
      "988 Suicide & Crisis Lifeline: Call or text 988",
      "SAMHSA Treatment Locator: 1-800-662-4357"
    ],
    immediateAction: true
  },
  'schizophrenia': {
    type: 'schizophrenia',
    responseTemplate: "The experiences you're describing may be related to schizophrenia or a similar condition. These symptoms require professional evaluation and treatment, which can be very effective. Please contact a mental health crisis line or your doctor immediately for support.",
    resourceLinks: [
      "988 Suicide & Crisis Lifeline: Call or text 988",
      "SAMHSA Treatment Locator: 1-800-662-4357"
    ],
    immediateAction: true
  },
  'delusion': {
    type: 'delusion',
    responseTemplate: "The beliefs you're describing may be what healthcare professionals call delusions. These can feel very real and distressing, but professional help is available. Please reach out to a mental health crisis line or emergency services for immediate support.",
    resourceLinks: [
      "988 Suicide & Crisis Lifeline: Call or text 988",
      "Emergency services: 911"
    ],
    immediateAction: true
  },
  'hallucination': {
    type: 'hallucination',
    responseTemplate: "The experiences you're describing - seeing or hearing things others don't - may be hallucinations. This is a medical symptom that requires professional evaluation. Please contact a mental health crisis line or emergency services for immediate support.",
    resourceLinks: [
      "988 Suicide & Crisis Lifeline: Call or text 988",
      "Emergency services: 911"
    ],
    immediateAction: true
  },
  'mania': {
    type: 'mania',
    responseTemplate: "What you're describing sounds like it may be symptoms of mania, which is a serious condition that requires professional evaluation. Please reach out to a mental health crisis line or emergency services for immediate support.",
    resourceLinks: [
      "988 Suicide & Crisis Lifeline: Call or text 988",
      "SAMHSA Treatment Locator: 1-800-662-4357"
    ],
    immediateAction: true
  },
  'dissociation': {
    type: 'dissociation',
    responseTemplate: "The disconnected feelings you're describing may be dissociation, which often occurs during high stress or after trauma. Please reach out to a crisis line for immediate support in grounding yourself and processing these feelings.",
    resourceLinks: [
      "988 Suicide & Crisis Lifeline: Call or text 988",
      "Crisis Text Line: Text HOME to 741741"
    ],
    immediateAction: false
  },
  'acute_trauma': {
    type: 'acute_trauma',
    responseTemplate: "I'm very sorry about what you've experienced. This sounds like an acute traumatic situation that requires immediate support. Please contact a crisis line or emergency services right away to help you process this experience safely.",
    resourceLinks: [
      "988 Suicide & Crisis Lifeline: Call or text 988",
      "RAINN (if sexual assault): 1-800-656-HOPE (4673)"
    ],
    immediateAction: true
  },
  'general_crisis': {
    type: 'general_crisis',
    responseTemplate: "I can tell you're going through an extremely difficult time right now. It's important to connect with professional support who can help you navigate this crisis. Please reach out to a crisis line for immediate support.",
    resourceLinks: [
      "988 Suicide & Crisis Lifeline: Call or text 988",
      "Crisis Text Line: Text HOME to 741741"
    ],
    immediateAction: false
  }
};

/**
 * Enhanced crisis detection with RAG integration
 * @param userInput User's message
 * @param conversationHistory Previous messages in conversation for context
 * @returns Crisis detection result with type and severity
 */
export const detectCrisis = (
  userInput: string,
  conversationHistory: string[] = []
): CrisisDetectionResult => {
  // Initialize default response
  const result: CrisisDetectionResult = {
    isCrisis: false,
    type: null,
    severity: 'low',
    requiresImmediate: false,
    matchedPhrases: []
  };

  // Normalize input
  const lowerInput = userInput.toLowerCase();
  const matchedPhrases: string[] = [];
  
  // Start with most severe conditions - check suicidal ideation
  if (suicidalIdeationPatterns.some(pattern => {
    const match = lowerInput.match(pattern);
    if (match) {
      matchedPhrases.push(match[0]);
      return true;
    }
    return false;
  })) {
    result.isCrisis = true;
    result.type = 'suicide';
    result.severity = 'severe';
    result.requiresImmediate = true;
  }
  // Check homicidal ideation
  else if (homicidalIdeationPatterns.some(pattern => {
    const match = lowerInput.match(pattern);
    if (match) {
      matchedPhrases.push(match[0]);
      return true;
    }
    return false;
  })) {
    result.isCrisis = true;
    result.type = 'homicide';
    result.severity = 'severe';
    result.requiresImmediate = true;
  }
  // Check psychosis/schizophrenia
  else if (psychosisPatterns.some(pattern => {
    const match = lowerInput.match(pattern);
    if (match) {
      matchedPhrases.push(match[0]);
      return true;
    }
    return false;
  })) {
    result.isCrisis = true;
    
    // Determine specific psychosis type
    if (/schizophreni/i.test(lowerInput)) {
      result.type = 'schizophrenia';
    } else if (/hallucination/i.test(lowerInput)) {
      result.type = 'hallucination';
    } else if (/delusion/i.test(lowerInput)) {
      result.type = 'delusion';
    } else {
      result.type = 'psychosis';
    }
    
    result.severity = 'high';
    result.requiresImmediate = true;
  }
  // Check acute dissociation
  else if (acuteDissociationPatterns.some(pattern => {
    const match = lowerInput.match(pattern);
    if (match) {
      matchedPhrases.push(match[0]);
      return true;
    }
    return false;
  })) {
    result.isCrisis = true;
    result.type = 'dissociation';
    result.severity = 'moderate';
    result.requiresImmediate = false;
  }
  // Check acute trauma
  else if (acuteTraumaPatterns.some(pattern => {
    const match = lowerInput.match(pattern);
    if (match) {
      matchedPhrases.push(match[0]);
      return true;
    }
    return false;
  })) {
    result.isCrisis = true;
    result.type = 'acute_trauma';
    result.severity = 'high';
    result.requiresImmediate = true;
  }
  
  // Store matched phrases
  if (matchedPhrases.length > 0) {
    result.matchedPhrases = matchedPhrases;
  }
  
  // If crisis detected, leverage RAG for better response generation
  if (result.isCrisis && result.type) {
    // Use RAG to ground the response in factual information
    try {
      const relevantTopics = [result.type, 'crisis', 'mental health', 'emergency'];
      // This function is imported from hallucinationPrevention/retrieval.ts
      retrieveFactualGrounding(relevantTopics);
    } catch (error) {
      console.error("Error using RAG for crisis detection:", error);
    }
  }
  
  return result;
};

/**
 * Generate appropriate response for crisis situations
 * @param detectionResult Crisis detection results
 * @returns Appropriate crisis response with resources
 */
export const generateCrisisResponse = (detectionResult: CrisisDetectionResult): string => {
  if (!detectionResult.isCrisis || !detectionResult.type) {
    return "";
  }
  
  const protocol = crisisProtocols[detectionResult.type];
  
  if (!protocol) {
    // Fallback for unspecified crisis types
    return crisisProtocols.general_crisis.responseTemplate;
  }
  
  // Build response with resources
  let response = protocol.responseTemplate;
  
  // Add resources if available
  if (protocol.resourceLinks && protocol.resourceLinks.length > 0) {
    response += "\n\nHere are resources that may help:";
    protocol.resourceLinks.forEach(resource => {
      response += `\n- ${resource}`;
    });
  }
  
  return response;
};

export const isCrisisSituation = (userInput: string): boolean => {
  const result = detectCrisis(userInput);
  return result.isCrisis;
};
