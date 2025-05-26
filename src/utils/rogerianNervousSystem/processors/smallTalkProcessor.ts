
/**
 * Unified Small Talk Processor
 * 
 * Processes small talk detection using standardized types and interfaces
 */

import { SmallTalkContext } from '../core/types';

/**
 * Process small talk detection with unified types
 */
export const processSmallTalk = async (
  userInput: string,
  conversationHistory: string[]
): Promise<SmallTalkContext> => {
  console.log("SMALL TALK PROCESSOR: Analyzing for small talk patterns");
  
  try {
    const result = detectSmallTalk(userInput, conversationHistory);
    
    console.log("SMALL TALK PROCESSOR: Analysis complete", result);
    return result;
    
  } catch (error) {
    console.error("SMALL TALK PROCESSOR: Error processing small talk:", error);
    return {
      isSmallTalk: false,
      confidence: 0.1
    };
  }
};

/**
 * Detect small talk with sophisticated pattern matching
 */
const detectSmallTalk = (userInput: string, conversationHistory: string[]): SmallTalkContext => {
  const input = userInput.toLowerCase().trim();
  
  // Greeting patterns
  const greetingPatterns = [
    /^(hi|hello|hey|good morning|good afternoon|good evening)[\s!.]*$/,
    /^(how are you|how's it going|what's up)[\s?!.]*$/,
    /^(nice to meet you|pleasure to meet you)[\s!.]*$/
  ];
  
  // Weather patterns
  const weatherPatterns = [
    /\b(weather|rain|sunny|cloudy|hot|cold|temperature)\b/,
    /\b(nice day|beautiful day|lovely weather)\b/
  ];
  
  // Entertainment patterns
  const entertainmentPatterns = [
    /\b(movie|film|tv show|music|book|game|sports)\b/,
    /\b(watched|listening|reading|playing)\b/
  ];
  
  // Food patterns
  const foodPatterns = [
    /\b(food|eat|lunch|dinner|breakfast|hungry|restaurant)\b/,
    /\b(cooking|recipe|delicious|tasty)\b/
  ];
  
  // General casual patterns
  const generalPatterns = [
    /^(thanks|thank you|ok|okay|sure|yeah|yes|no)[\s!.]*$/,
    /^(bye|goodbye|see you|talk soon)[\s!.]*$/,
    /\b(weekend|vacation|holiday|work|job)\b/
  ];
  
  let category: SmallTalkContext['category'] = 'general';
  let confidence = 0;
  let isSmallTalk = false;
  
  // Check each category
  if (greetingPatterns.some(pattern => pattern.test(input))) {
    isSmallTalk = true;
    category = 'greeting';
    confidence = 0.9;
  } else if (weatherPatterns.some(pattern => pattern.test(input))) {
    isSmallTalk = true;
    category = 'weather';
    confidence = 0.8;
  } else if (entertainmentPatterns.some(pattern => pattern.test(input))) {
    isSmallTalk = true;
    category = 'entertainment';
    confidence = 0.7;
  } else if (foodPatterns.some(pattern => pattern.test(input))) {
    isSmallTalk = true;
    category = 'food';
    confidence = 0.7;
  } else if (generalPatterns.some(pattern => pattern.test(input))) {
    isSmallTalk = true;
    category = 'general';
    confidence = 0.6;
  }
  
  // Reduce confidence for longer messages (likely more substantive)
  if (input.length > 50) {
    confidence *= 0.7;
  }
  
  // Reduce confidence if emotional words are present
  const emotionalWords = /\b(feel|sad|happy|angry|worried|anxious|depressed|excited|frustrated)\b/;
  if (emotionalWords.test(input)) {
    confidence *= 0.5;
    isSmallTalk = false; // Emotional content is not small talk
  }
  
  // Check if we should transition from small talk to therapeutic conversation
  const shouldTransition = determineShouldTransition(userInput, conversationHistory, isSmallTalk);
  
  return {
    isSmallTalk,
    category,
    confidence,
    shouldTransition
  };
};

/**
 * Determine if we should transition from small talk to therapeutic conversation
 */
const determineShouldTransition = (
  userInput: string,
  conversationHistory: string[],
  isSmallTalk: boolean
): boolean => {
  // Don't transition if not small talk
  if (!isSmallTalk) return false;
  
  // Transition after several small talk exchanges
  if (conversationHistory.length >= 4) {
    const recentSmallTalk = conversationHistory.slice(-4).every(msg => 
      msg.length < 30 && !/\b(feel|problem|issue|help|difficult)\b/i.test(msg)
    );
    
    if (recentSmallTalk) {
      return true;
    }
  }
  
  // Transition if user mentions being ready to talk
  if (/\b(ready to talk|want to discuss|need to share|have something|like to talk about)\b/i.test(userInput)) {
    return true;
  }
  
  return false;
};
