
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
  
  // Calculate filler density
  const fillerDensity = totalWords > 0 ? fillerCount / totalWords : 0;
  
  // Look for hesitation patterns (multiple fillers at the start)
  const startsWithFillers = fillerWords.some(filler => 
    new RegExp(`^\\s*(${filler})\\b`, 'i').test(lowerInput)
  );
  
  // Multiple consecutive fillers indicate stronger hesitation
  const hasMultipleConsecutiveFillers = /\b(umm|uh|err)\b.*\b(like|you know|I guess)\b/i.test(lowerInput);
  
  return {
    hasHighFillerDensity: fillerDensity > 0.15, // More than 15% fillers
    potentialHesitation: startsWithFillers || hasMultipleConsecutiveFillers,
    fillerCount,
    ohioSlangDetected: detectedSlang
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
} => {
  // Default response strategy
  let responseStrategy = {
    shouldMirrorCasualTone: false,
    shouldAddressAnxiety: false,
    suggestedOpener: ""
  };
  
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
      "No rush at all. Take your time. ",
      "I notice you might be feeling a bit unsure. That's completely okay. ",
      "It's okay to feel hesitant when sharing. I'm here to listen. "
    ];
    
    responseStrategy.suggestedOpener = anxietyOpeners[Math.floor(Math.random() * anxietyOpeners.length)];
  }
  
  // Default opener if none selected
  if (!responseStrategy.suggestedOpener) {
    if (responseStrategy.shouldMirrorCasualTone) {
      const casualOpeners = [
        "Hey there! ",
        "What's up? ",
        "Great to chat with you! "
      ];
      responseStrategy.suggestedOpener = casualOpeners[Math.floor(Math.random() * casualOpeners.length)];
    } else {
      responseStrategy.suggestedOpener = "I'm listening. ";
    }
  }
  
  return responseStrategy;
};
