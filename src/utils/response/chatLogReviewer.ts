
/**
 * Chat Log Review System
 * 
 * An additional safeguard that reviews Roger's responses in the context of
 * the full conversation history to ensure consistency and appropriate responses.
 */

/**
 * Reviews a response in the context of conversation history to ensure
 * Roger isn't contradicting himself, repeating questions unnecessarily,
 * or creating confusion for the user.
 */
export const processThroughChatLogReview = (
  responseText: string,
  userInput: string,
  conversationHistory: string[]
): string => {
  try {
    // Don't process empty responses or when we lack context
    if (!responseText || conversationHistory.length === 0) {
      return responseText;
    }
    
    let result = responseText;
    
    // Check if Roger is asking a question they've asked before
    result = preventRepeatedQuestions(result, conversationHistory);
    
    // Check if Roger is contradicting his previous statements
    result = preventContradictions(result, conversationHistory);
    
    // Check for overuse of reflection (too many "It sounds like..." statements)
    result = preventReflectionOveruse(result, conversationHistory);
    
    // Ensure Roger isn't ignoring user's direct questions
    result = ensureQuestionAddressing(result, userInput);
    
    return result;
  } catch (error) {
    console.error("Error in chat log review:", error);
    return responseText;
  }
};

/**
 * Prevent Roger from asking the same questions repeatedly
 */
const preventRepeatedQuestions = (response: string, history: string[]): string => {
  // Extract questions from response
  const questionMatches = response.match(/\b(what|how|when|where|why|who|can you|could you|would you|do you|did you|have you|are you|is there)[^.?!]*\?/gi);
  
  if (!questionMatches || questionMatches.length === 0) {
    return response;
  }
  
  let result = response;
  const recentHistory = history.slice(-5).join(' ').toLowerCase();
  
  // Check each question against recent history
  for (const question of questionMatches) {
    // Create simplified versions for comparison
    const simplifiedQuestion = question.toLowerCase()
      .replace(/\byou\b/g, '')
      .replace(/\byour\b/g, '')
      .replace(/\bmy\b/g, '')
      .replace(/\bme\b/g, '')
      .replace(/\s+/g, ' ')
      .trim();
      
    // If very similar question exists in history, replace it in the response
    if (simplifiedQuestion.length > 15) { // Only check substantial questions
      const pattern = new RegExp(
        simplifiedQuestion
          .replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // escape regex special chars
          .replace(/\s+/g, '\\s+') // allow for different whitespace
          .slice(0, 30), // use beginning of question for fuzzy matching
        'i'
      );
      
      if (pattern.test(recentHistory)) {
        // Replace with a statement that acknowledges and moves forward
        const replacements = [
          "I'd like to understand more about what you've shared.",
          "Can you tell me more about how you've been feeling about this?",
          "I'm interested in hearing more about your perspective."
        ];
        
        result = result.replace(question, replacements[Math.floor(Math.random() * replacements.length)]);
      }
    }
  }
  
  return result;
};

/**
 * Prevent Roger from contradicting previous statements
 */
const preventContradictions = (response: string, history: string[]): string => {
  // This would be a more complex implementation in practice
  // For this demo, just check for some common contradictions
  let result = response;
  const recentHistory = history.slice(-3).join(' ');
  
  // Example check: If Roger previously said he's not a doctor but now gives medical advice
  if (/not (a|your) (doctor|medical professional|therapist)/i.test(recentHistory) && 
      /you should (take|try|use|consider)/i.test(response)) {
    result = result.replace(
      /you should (take|try|use|consider)/i,
      "it might be worth discussing with a professional whether to $1"
    );
  }
  
  return result;
};

/**
 * Prevent overuse of reflection techniques
 */
const preventReflectionOveruse = (response: string, history: string[]): string => {
  const reflectionPatterns = [
    /it sounds like/i,
    /I hear that/i,
    /you seem to be/i,
    /you're feeling/i,
    /you feel/i
  ];
  
  // Count reflections in recent history
  let recentReflectionCount = 0;
  const recentMessages = history.slice(-3);
  
  for (const message of recentMessages) {
    for (const pattern of reflectionPatterns) {
      if (pattern.test(message)) {
        recentReflectionCount++;
      }
    }
  }
  
  // If many reflections recently, try to vary the response style
  if (recentReflectionCount >= 2) {
    let result = response;
    
    // Replace reflection phrases with more direct engagement
    for (const pattern of reflectionPatterns) {
      if (pattern.test(result)) {
        const alternatives = [
          "", // Simply remove the reflection phrase
          "I'm wondering about ",
          "Let's explore how ",
          "Tell me more about how "
        ];
        
        result = result.replace(pattern, alternatives[Math.floor(Math.random() * alternatives.length)]);
        break; // Only replace one instance to avoid mangling the response
      }
    }
    
    return result;
  }
  
  return response;
};

/**
 * Ensure Roger addresses user questions appropriately
 */
const ensureQuestionAddressing = (response: string, userInput: string): string => {
  // Check if user asked a direct question
  const userQuestionMatch = userInput.match(/\b(what|how|when|where|why|who|can|could)[^.?!]*\?/i);
  
  if (userQuestionMatch) {
    // If user asked a question but Roger didn't acknowledge it
    if (!response.includes('?') && !(/I don't|can't|not able|not qualified/i.test(response))) {
      // Add acknowledgment to the response
      return `I understand you're asking about ${userQuestionMatch[0].replace('?', '')}. ${response}`;
    }
  }
  
  return response;
};
