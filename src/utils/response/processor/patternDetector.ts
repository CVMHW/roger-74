
/**
 * Enhanced pattern detector for detecting repeated phrases and hallucination risks
 */

/**
 * Detects patterns of repeated phrases that may indicate hallucination
 * 
 * @param responseText The current response text
 * @param userInput The user's input that triggered this response
 * @param previousResponses Previous responses to compare against
 * @returns Detection result with matched patterns
 */
export const detectPatternedResponses = (
  responseText: string,
  userInput?: string,
  previousResponses?: string[]
): {
  hasProblematicPattern: boolean;
  problematicPhrases: string[];
  repetitionCount: number;
} => {
  const result = {
    hasProblematicPattern: false,
    problematicPhrases: [],
    repetitionCount: 0
  };

  // Check for literal repetition of user input
  if (userInput && userInput.length > 10) {
    // Convert both to lowercase for case-insensitive comparison
    const responseLower = responseText.toLowerCase();
    const userInputLower = userInput.toLowerCase();
    
    // Check if user input appears verbatim in response (longer than 10 chars)
    if (userInputLower.length > 10) {
      const words = userInputLower.split(' ');
      
      // Look for sequences of 3+ words from user input in the response
      for (let i = 0; i <= words.length - 3; i++) {
        const phrase = words.slice(i, i + 3).join(' ');
        if (phrase.length > 10 && responseLower.includes(phrase)) {
          result.hasProblematicPattern = true;
          result.problematicPhrases.push(phrase);
        }
      }
    }
  }

  // Check for "I hear you're saying..." + user's exact words  
  const hearYouSayingPattern = /I hear you('re| are) (saying|sharing) that ([^.]+)/gi;
  let match;
  while ((match = hearYouSayingPattern.exec(responseText)) !== null) {
    const allegedQuote = match[3];
    // If user input exists, check if this is actually in their message
    if (userInput && !userInput.toLowerCase().includes(allegedQuote.toLowerCase())) {
      result.hasProblematicPattern = true;
      result.problematicPhrases.push(`"I hear you're saying that ${allegedQuote}"`);
    }
  }
  
  // Check for sequential repeated sentences in the same response
  const sentences = responseText.split(/(?<=[.!?])\s+/);
  for (let i = 0; i < sentences.length - 1; i++) {
    const currentSentence = sentences[i].toLowerCase().trim();
    const nextSentence = sentences[i+1].toLowerCase().trim();
    
    // If sentences are similar (first 10 chars match)
    if (currentSentence.length > 10 && 
        nextSentence.length > 10 &&
        currentSentence.substring(0, 10) === nextSentence.substring(0, 10)) {
      result.hasProblematicPattern = true;
      result.problematicPhrases.push(currentSentence);
      result.repetitionCount++;
    }
  }
  
  // Check for repeated phrases across multiple previous responses
  if (previousResponses && previousResponses.length > 0) {
    for (const prevResponse of previousResponses) {
      // Skip if the previous response is too short
      if (prevResponse.length < 20) continue;
      
      // Check for distinctive phrases being repeated (20+ char phrases)
      const prevSentences = prevResponse.split(/(?<=[.!?])\s+/);
      for (const prevSentence of prevSentences) {
        if (prevSentence.length >= 20 && responseText.includes(prevSentence)) {
          result.hasProblematicPattern = true;
          result.problematicPhrases.push(prevSentence);
          result.repetitionCount++;
        }
      }
    }
  }
  
  // Check specifically for the hallucination pattern seen in eating disorder responses
  const eatingDisorderHallucinationPattern = /You mentioned eat before when we talked about/i;
  if (eatingDisorderHallucinationPattern.test(responseText)) {
    result.hasProblematicPattern = true;
    result.problematicPhrases.push("False memory of previous conversation");
    result.repetitionCount++;
  }

  return result;
};

/**
 * Fixes problematic patterns in responses
 * 
 * @param responseText The current response text
 * @param patterns Detected problematic patterns
 * @returns Fixed response text
 */
export const fixProblematicPatterns = (
  responseText: string,
  patterns: string[]
): string => {
  let fixedResponse = responseText;
  
  // If we detected the eating disorder hallucination pattern, replace with safe response
  if (patterns.includes("False memory of previous conversation") || 
      /You mentioned eat before when we talked about/i.test(responseText)) {
    return "I notice you're sharing about an eating disorder. These struggles can be really difficult. The National Eating Disorders Association (NEDA) offers support through their helpline at 1-800-931-2237. Would it help to talk about what you're experiencing?";
  }
  
  // Replace each problematic pattern
  for (const pattern of patterns) {
    if (pattern.length > 10) {
      // Replace the pattern with a more general acknowledgment
      fixedResponse = fixedResponse.replace(pattern, "what you're sharing");
    }
  }
  
  // If we made changes but the response now has awkward phrasing
  if (fixedResponse !== responseText) {
    // Clean up any duplicated acknowledgments that might result from replacements
    fixedResponse = fixedResponse.replace(/I (hear|understand) what you're sharing what you're sharing/gi, "I hear what you're sharing");
    
    // Clean up any awkward transitions
    fixedResponse = fixedResponse.replace(/\. I (notice|hear) what you're sharing\./gi, ". ");
  }
  
  return fixedResponse;
};
