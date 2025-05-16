
/**
 * Response generators for eating patterns detection
 */

import { detectEatingDisorderConcerns, isFoodSmallTalk, FoodSmallTalkResult } from './detectors';
import { EatingDisorderConcernResult, RiskLevel } from './types';

/**
 * Generate an appropriate response for an eating disorder concern
 * based on the detected risk level, with Emily Program referrals when appropriate
 */
export const generateEatingDisorderResponse = (
  userInput: string,
  detectionResult: EatingDisorderConcernResult | any
): string => {
  const { riskLevel, matchedPhrases, isLikelySmallTalk } = detectionResult;
  
  // Don't provide ED responses for what's likely just Cleveland food talk
  const smallTalkResult = isFoodSmallTalk(userInput);
  if (smallTalkResult.isClevelandSpecific && isLikelySmallTalk) {
    return generateFoodSmallTalkResponse(userInput, smallTalkResult);
  }
  
  // For higher risk cases, include Emily Program referral
  if (riskLevel === 'high') {
    return "I notice you're talking about food and body image in a way that sounds distressing. These feelings can be really difficult to navigate alone. The Emily Program (1-888-364-5977) specializes in supporting people with complex feelings about food and body image. Would it help to talk about what support might be helpful for you right now?";
  } else if (riskLevel === 'moderate') {
    return "It sounds like you might be having some complicated feelings about food or body image. Those feelings are common, but they can also be challenging. Some people find specialized support, like what The Emily Program offers, to be helpful. What kind of support would be most helpful for you right now?";
  } else if (riskLevel === 'low') {
    return "I hear you mentioning some thoughts about food and eating. How have these thoughts been affecting you lately?";
  }
  
  // Fallback for unexpected cases
  return "I'm here to listen about whatever is on your mind, including thoughts about food and eating. What would be most helpful to focus on right now?";
};

/**
 * Generate a food small talk response that's appropriate and supportive
 * with special handling for Cleveland food contexts
 */
export const generateFoodSmallTalkResponse = (
  userInput: string,
  smallTalkResult: FoodSmallTalkResult
): string => {
  const { topics, isClevelandSpecific } = smallTalkResult;
  
  // Special responses for Cleveland food contexts
  if (isClevelandSpecific) {
    const clevelandFoodMentions = topics.filter(topic => {
      // We know these are strings from our patterns
      return true;
    });
    
    if (clevelandFoodMentions.length > 0) {
      if (/west side market|market/i.test(userInput)) {
        return "The West Side Market is such a Cleveland institution! Many people find joy in exploring all the different food vendors there. What other Cleveland spots do you enjoy?";
      } else if (/little italy|italian/i.test(userInput)) {
        return "Little Italy has such a rich food heritage in Cleveland. The restaurants and bakeries there have been bringing people together for generations. Do you have favorite spots there?";
      } else if (/pierogi|polish/i.test(userInput)) {
        return "Pierogies are definitely part of Cleveland's food identity! They're a comfort food that brings back memories for many people here. Do you have other Cleveland comfort foods you enjoy?";
      } else if (/corned beef|slyman/i.test(userInput)) {
        return "Cleveland's corned beef sandwiches are legendary! Places like Slyman's have been serving them up for decades. What other Cleveland food traditions do you enjoy?";
      }
      
      return "Cleveland has such a rich and diverse food scene that brings people together. These shared food experiences are an important part of community and connection. What other aspects of Cleveland life do you enjoy?";
    }
  }
  
  // General food small talk responses
  if (topics.length > 0) {
    // Check for specific food topics to personalize response
    if (/cook(ing|ed)|recipe|bak(ing|ed)/i.test(topics.join(' '))) {
      return "Cooking and sharing food can be such a meaningful way to connect. What kinds of things do you enjoy preparing?";
    } else if (/restaurant|eat out|dining/i.test(topics.join(' '))) {
      return "Going to restaurants can be a nice break and chance to try different foods. What types of places do you enjoy visiting?";
    } else if (/favorite|best|love/i.test(topics.join(' '))) {
      return "Food preferences can tell us a lot about ourselves and what we enjoy in life. What else brings you that kind of enjoyment?";
    }
  }
  
  // Default food small talk response
  return "Food is something we all share in common, though we each have our own relationship with it. What other everyday things have been on your mind lately?";
};
