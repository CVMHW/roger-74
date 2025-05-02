
/**
 * Utility for processing filler words and informal speech
 * Helps Roger respond more effectively to casual language
 */

// Common filler words to detect and clean
const fillerWords = [
  'umm', 'uh', 'like', 'you know', 'err', 'I guess',
  'whatever', 'kinda', 'sorta', 'basically', 'literally',
  'totally', 'actually', 'so', 'just', 'I mean'
];

// Ohio-specific slang and casual speech patterns
const ohioSlang = [
  'cbus', 'the 614', 'o-h', 'i-o', 'the land', 
  '4-1-9', 'the buck', 'buckeye', 'cincy',
  'the nasty nati', 'cle', 'the 216'
];

// Common subtle phrases that indicate understated emotions
const subtleExpressions = [
  'a bit', 'a little', 'kind of', 'sort of',
  'somewhat', 'slightly', 'just', 'only',
  'not really', 'i guess', 'maybe'
];

/**
 * Cleans filler words from user input while preserving the core message
 * @param input The user's message with potential filler words
 * @returns Cleaned input with reduced fillers
 */
export const cleanFillerWords = (input: string): string => {
  let cleanedInput = input.toLowerCase();
  
  // Remove or reduce common filler words
  fillerWords.forEach(filler => {
    const fillerRegex = new RegExp(`\\b${filler}\\b`, 'gi');
    cleanedInput = cleanedInput.replace(fillerRegex, '');
  });
  
  // Clean up extra spaces and punctuation
  cleanedInput = cleanedInput
    .replace(/\s+/g, ' ')
    .replace(/\s+([.,?!])/g, '$1')
    .trim();
  
  return cleanedInput || input; // Return original if cleaned version is empty
};

/**
 * Detects filler word usage patterns to identify potential anxiety or hesitation
 * @param input The user's message
 * @returns Object with detected patterns
 */
export const detectFillerPatterns = (input: string): {
  hasHighFillerDensity: boolean;
  potentialHesitation: boolean;
  fillerCount: number;
  ohioSlangDetected: string[];
  subtleExpression: string | null;
  isMinimalResponse: boolean;
} => {
  const lowerInput = input.toLowerCase();
  const words = lowerInput.split(/\s+/);
  const totalWords = words.length;
  
  // Count filler words
  let fillerCount = 0;
  fillerWords.forEach(filler => {
    const fillerRegex = new RegExp(`\\b${filler}\\b`, 'gi');
    const matches = lowerInput.match(fillerRegex);
    if (matches) fillerCount += matches.length;
  });
  
  // Detect Ohio slang
  const detectedSlang = ohioSlang.filter(slang => 
    lowerInput.includes(slang)
  );
  
  // Detect subtle expressions
  const detectedSubtleExpression = subtleExpressions.find(expression => 
    new RegExp(`\\b${expression}\\b`, 'i').test(lowerInput)
  ) || null;
  
  // Calculate filler density
  const fillerDensity = totalWords > 0 ? fillerCount / totalWords : 0;
  
  // Look for hesitation patterns (multiple fillers at the start)
  const startsWithFillers = fillerWords.some(filler => 
    new RegExp(`^\\s*(${filler})\\b`, 'i').test(lowerInput)
  );
  
  // Multiple consecutive fillers indicate stronger hesitation
  const hasMultipleConsecutiveFillers = /\b(umm|uh|err)\b.*\b(like|you know|I guess)\b/i.test(lowerInput);
  
  // Detect minimal responses (very short answers that might indicate disengagement or reluctance)
  const isMinimalResponse = totalWords <= 3 && !lowerInput.includes('?');
  
  return {
    hasHighFillerDensity: fillerDensity > 0.15, // More than 15% fillers
    potentialHesitation: startsWithFillers || hasMultipleConsecutiveFillers,
    fillerCount,
    ohioSlangDetected: detectedSlang,
    subtleExpression: detectedSubtleExpression,
    isMinimalResponse
  };
};

/**
 * Generates an appropriate response to casual or filler-heavy speech
 * @param input Original user input
 * @param cleanedInput Processed input with fillers removed
 * @param patternAnalysis Analysis of filler patterns
 * @returns Appropriate response strategy
 */
export const generateCasualSpeechResponse = (
  input: string,
  cleanedInput: string,
  patternAnalysis: ReturnType<typeof detectFillerPatterns>
): {
  shouldMirrorCasualTone: boolean;
  shouldAddressAnxiety: boolean;
  suggestedOpener: string;
  isSubtle: boolean;
} => {
  // Default response strategy
  let responseStrategy = {
    shouldMirrorCasualTone: false,
    shouldAddressAnxiety: false,
    suggestedOpener: "",
    isSubtle: false
  };
  
  // Handle minimal responses first (they take priority)
  if (patternAnalysis.isMinimalResponse) {
    responseStrategy.shouldMirrorCasualTone = true;
    
    // Choose appropriate opener for minimal response
    const minimalOpeners = [
      "I hear you. ",
      "Yeah. ",
      "I see. ",
      "Got it. ",
    ];
    
    responseStrategy.suggestedOpener = minimalOpeners[Math.floor(Math.random() * minimalOpeners.length)];
    responseStrategy.isSubtle = true;
    
    return responseStrategy;
  }
  
  // Check for subtle expressions
  if (patternAnalysis.subtleExpression) {
    responseStrategy.shouldMirrorCasualTone = true;
    responseStrategy.isSubtle = true;
    
    // Match subtlety with gentle response
    const subtleOpeners = [
      "I hear that. ",
      "Yeah, I get that. ",
      "I understand. ",
      "That makes sense. "
    ];
    
    responseStrategy.suggestedOpener = subtleOpeners[Math.floor(Math.random() * subtleOpeners.length)];
    
    return responseStrategy;
  }
  
  // Mirror casual tone for high Ohio slang or moderate filler use
  if (patternAnalysis.ohioSlangDetected.length > 0) {
    responseStrategy.shouldMirrorCasualTone = true;
    
    // Use Ohio reference if detected
    if (patternAnalysis.ohioSlangDetected.includes('o-h')) {
      responseStrategy.suggestedOpener = "O-H! I-O! ";
    } else if (patternAnalysis.ohioSlangDetected.includes('the buck') || 
               patternAnalysis.ohioSlangDetected.includes('buckeye')) {
      responseStrategy.suggestedOpener = "Go Bucks! ";
    } else if (patternAnalysis.ohioSlangDetected.includes('cbus')) {
      responseStrategy.suggestedOpener = "Hello from Cbus! ";
    }
  } else if (patternAnalysis.fillerCount > 0 && patternAnalysis.fillerCount <= 3) {
    // Moderate filler use - mirror casual but clear tone
    responseStrategy.shouldMirrorCasualTone = true;
  }
  
  // For high anxiety/hesitation patterns, address directly
  if (patternAnalysis.hasHighFillerDensity && patternAnalysis.potentialHesitation) {
    responseStrategy.shouldAddressAnxiety = true;
    
    // Choose an appropriate opener for anxiety
    const anxietyOpeners = [
      "Take your time. ",
      "No rush at all. ",
      "I'm here to listen. "
    ];
    
    responseStrategy.suggestedOpener = anxietyOpeners[Math.floor(Math.random() * anxietyOpeners.length)];
  }
  
  // Default opener if none selected
  if (!responseStrategy.suggestedOpener) {
    if (responseStrategy.shouldMirrorCasualTone) {
      const casualOpeners = [
        "Hey there! ",
        "What's up? ",
        "Hi! "
      ];
      responseStrategy.suggestedOpener = casualOpeners[Math.floor(Math.random() * casualOpeners.length)];
    } else {
      responseStrategy.suggestedOpener = "I'm listening. ";
    }
  }
  
  return responseStrategy;
};

// New function to generate conversational responses for minimal inputs
export const generateMinimalInputResponse = (input: string): string => {
  const lowerInput = input.toLowerCase().trim();
  
  // Dictionary of common minimal inputs and appropriate conversational responses
  const minimalResponses: {[key: string]: string[]} = {
    "tired": [
      "Yeah, those tired days are tough. What's been going on?",
      "Being tired can really affect everything. What's been happening with your sleep?",
      "I hear you. Being exhausted makes everything harder. What's been keeping you up?"
    ],
    "sad": [
      "I get that. Want to talk about what's going on?",
      "Those down days happen. Anything in particular bringing you down?",
      "Yeah, that can be tough. What's been happening?"
    ],
    "stressed": [
      "Stress can be a lot to handle. What's been on your mind?",
      "I hear you. What's been adding to your stress lately?",
      "Yeah, stress is tough. What's been the biggest pressure point?"
    ],
    "fine": [
      "Just fine? I'm here if there's anything specific you'd like to talk about.",
      "Alright. How's your day been going otherwise?",
      "I hear you. Anything in particular you want to chat about today?"
    ],
    "ok": [
      "Just okay? What's been going on?",
      "I hear you. Anything specific you want to talk about?",
      "Sometimes 'okay' is the best we can do. What's been happening lately?"
    ],
    "good": [
      "That's good to hear. Anything in particular making things good?",
      "I'm glad to hear that. What's been going well?",
      "That's great. Anything you want to talk about today?"
    ]
  };
  
  // Check for exact matches first
  if (minimalResponses[lowerInput]) {
    const responses = minimalResponses[lowerInput];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Check for partial matches if no exact match
  for (const [key, responses] of Object.entries(minimalResponses)) {
    if (lowerInput.includes(key)) {
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }
  
  // Default responses for any minimal input not specifically matched
  const defaultResponses = [
    "I hear you. What's been on your mind lately?",
    "I'm here to listen. What would be helpful to talk about today?",
    "What's been going on with you?"
  ];
  
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
};

