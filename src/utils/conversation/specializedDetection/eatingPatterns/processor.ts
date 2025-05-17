
/**
 * Main processor for food-related messages with executive control system
 */

import { detectEatingDisorderConcerns, isFoodSmallTalk, FoodSmallTalkResult } from './detectors';
import { 
  generateEatingDisorderResponse, 
  generateFoodSmallTalkResponse 
} from './responseGenerators';
import { FoodRelatedMessageResult } from './types';

/**
 * Main function to process food-related messages with strict executive control
 * to prevent hallucinations and mixing of protocols
 */
export const processFoodRelatedMessage = (userInput: string): FoodRelatedMessageResult => {
  // EXECUTIVE CONTROL SYSTEM - Highest priority checks first
  // These pattern checks take absolute precedence and cannot be overridden
  
  // 1. CRITICAL CHECK: Binge eating or can't stop eating - HIGHEST PRIORITY
  if (/can't stop eating|binge eating|overeating|eating too much|compulsive eating|eaten [0-9]+ .+ in a row/i.test(userInput.toLowerCase())) {
    console.log("EXECUTIVE CONTROL: Critical binge eating pattern detected - Crisis response required");
    return {
      responseType: 'eating_disorder',
      riskLevel: 'high',
      protocolSource: 'executive',
      suggestedResponse: "I'm concerned about what you're sharing about your eating patterns. These feelings can be overwhelming and deserve professional support. The National Eating Disorders Association (NEDA) helpline at 1-800-931-2237 can provide guidance. Would you like to talk more about what you're experiencing right now?"
    };
  }
  
  // 2. CRITICAL CHECK: "not eating" concerns - HIGHEST PRIORITY
  if (/not eating|haven'?t (been )?eat(ing|en)|struggling not eating|can't eat|don't eat/i.test(userInput.toLowerCase())) {
    console.log("EXECUTIVE CONTROL: Critical restriction pattern detected - Crisis response required");
    return {
      responseType: 'eating_disorder',
      riskLevel: 'high',
      protocolSource: 'executive',
      suggestedResponse: "I'm concerned about what you're sharing about not eating. This is something that needs professional support. The National Eating Disorders Association (NEDA) helpline at 1-800-931-2237 can provide guidance. Would it be possible for you to reach out to them today?"
    };
  }
  
  // 3. CRITICAL CHECK: Direct mentions of eating disorders - HIGH PRIORITY
  if (/eating disorder|anorexia|bulimia|binge eating|eating issues|eating problems|purging|food restriction|body image/i.test(userInput.toLowerCase())) {
    console.log("EXECUTIVE CONTROL: Direct eating disorder mention detected - Crisis response required");
    
    // Run the specialized detector for more detailed information
    const edResult = detectEatingDisorderConcerns(userInput);
    
    return {
      responseType: 'eating_disorder',
      riskLevel: 'high',
      protocolSource: 'executive',
      suggestedResponse: generateEatingDisorderResponse(userInput, edResult)
    };
  }
  
  // 4. Only if no critical patterns were matched, perform more detailed analysis
  const edResult = detectEatingDisorderConcerns(userInput);
  
  // If any eating disorder concern is detected, prioritize that regardless of what the small talk detector says
  if (edResult.isEatingDisorderConcern) {
    console.log("EXECUTIVE CONTROL: Eating disorder concern detected by specialized detector");
    return {
      responseType: 'eating_disorder',
      riskLevel: edResult.riskLevel,
      protocolSource: 'specialized',
      suggestedResponse: generateEatingDisorderResponse(userInput, edResult)
    };
  }
  
  // 5. At this point, we're confident it's not an eating disorder concern
  // Now we can safely check for food small talk without risk of misclassification
  const smallTalkResult = isFoodSmallTalk(userInput);
  
  // One final safety check - never classify as small talk if there's any match with critical terms
  // This is a redundant safety mechanism
  if (/eating disorder|anorexia|bulimia|binge|can't stop eating|not eating/i.test(userInput.toLowerCase())) {
    console.log("EXECUTIVE CONTROL: Safety override - potential eating disorder terms detected in what was classified as small talk");
    return {
      responseType: 'eating_disorder',
      riskLevel: 'moderate',
      protocolSource: 'safety_override',
      suggestedResponse: "I notice you're mentioning some terms related to eating patterns that I want to take seriously. Would you like to talk more about what you're experiencing with food and eating right now?"
    };
  }
  
  // If it passes all these checks AND is classified as small talk, then it's safe to respond as small talk
  if (smallTalkResult.isSmallTalk) {
    console.log("EXECUTIVE CONTROL: Confirmed safe food small talk");
    return {
      responseType: 'food_small_talk',
      riskLevel: 'none',
      protocolSource: 'small_talk',
      suggestedResponse: generateFoodSmallTalkResponse(userInput, smallTalkResult)
    };
  }
  
  // Default case - not primarily food-related
  return {
    responseType: 'not_food_related',
    riskLevel: 'none',
    protocolSource: 'default',
    suggestedResponse: ''
  };
};
