
import { useCallback } from 'react';
import { detectEatingDisorderConcerns } from '../../../utils/conversation/specializedDetection/eatingPatterns/detectors';
import { processFoodRelatedMessage } from '../../../utils/conversation/specializedDetection/eatingPatterns/processor';

/**
 * Enhanced hook for detecting crisis content in user messages
 * with integration to multiple specialized detection systems and executive control
 */
export const useCrisisDetector = () => {
  // Function to check for crisis-related content in user input
  const checkForCrisisContent = useCallback((userInput: string): boolean => {
    console.log("CRISIS DETECTOR: Checking user input for crisis content");
    
    // Skip processing if userInput is not a string or is empty
    if (!userInput || typeof userInput !== 'string') {
      console.error("CRISIS DETECTOR: Invalid input received", userInput);
      return false;
    }
    
    try {
      // CRITICAL PRIORITY - Check for suicide/self-harm mentions first
      // These take absolute precedence over all other crisis types
      const suicidePatterns = [
        /suicid|kill (myself|me)|end (my|this) life|harm (myself|me)|cut (myself|me)|hurt (myself|me)/,
        /don'?t want to (live|be alive)|take my (own )?life|killing myself|commit suicide|die by suicide/,
        /fatal overdose|hang myself|jump off|i wish i was dead|i want to die|i might kill/,
        /shoot myself|gun|bullet|jump|overdose|pills/
      ];
      
      for (const pattern of suicidePatterns) {
        if (pattern.test(userInput.toLowerCase())) {
          console.log("CRISIS DETECTOR: Immediate suicide risk detected - HIGHEST PRIORITY");
          return true;
        }
      }
      
      // Next priority - Check for eating disorder content
      if (/eat(ing)?|food|meal|diet|weight|body|fat|thin|anorexia|bulimia|binge|purge|hunger|starv/i.test(userInput.toLowerCase())) {
        console.log("CRISIS DETECTOR: Food-related content detected, using specialized processor");
        const result = processFoodRelatedMessage(userInput);
        
        // If the executive system says this is a high-risk eating disorder situation, it's a crisis
        if (result.responseType === 'eating_disorder' && result.riskLevel === 'high') {
          console.log("CRISIS DETECTOR: High-risk eating disorder detected by executive system");
          return true;
        }
      }
      
      // Direct pattern matches for eating disorders 
      const lowerInput = userInput.toLowerCase().trim();
      
      // Direct check for eating disorder issues
      if (/can't stop eating|binge eating|overeating|eating too much|compulsive eating|eaten [0-9]+ .+ in a row|not eating|haven't been eating|struggling not eating|can't eat|don't eat/i.test(lowerInput)) {
        console.log("CRISIS DETECTOR: Direct eating disorder pattern match");
        return true;
      }
      
      // Check with our eating disorder detection system for high-risk cases
      const edResult = detectEatingDisorderConcerns(userInput);
      if (edResult.isEatingDisorderConcern && (edResult.riskLevel === 'high' || edResult.needsImmediate)) {
        console.log("CRISIS DETECTOR: Eating disorder detection system identified high risk");
        return true;
      }
      
      // Check for substance abuse signals
      const substancePatterns = [
        /drinking|alcohol|drunk|intoxicated|can't stop drinking|addicted|substance/,
        /(\d+)\s+(beers|drinks|shots|bottles)/,
        /high|wasted|hammered|plastered|blacked out/,
        /withdrawal|DTs|shakes|alcohol poisoning/
      ];
      
      for (const pattern of substancePatterns) {
        if (pattern.test(lowerInput)) {
          // Check for quantity indicators that suggest crisis
          const quantityMatch = lowerInput.match(/(\d+)\s+(beers|drinks|shots|bottles)/);
          if (quantityMatch) {
            const quantity = parseInt(quantityMatch[1], 10);
            if (quantity > 10) {
              console.log("CRISIS DETECTOR: High quantity alcohol consumption detected");
              return true;
            }
          }
          
          // Check for severe language
          if (/withdrawal|DTs|shakes|alcohol poisoning|can't stop|addicted/i.test(lowerInput)) {
            console.log("CRISIS DETECTOR: Severe substance use language detected");
            return true;
          }
        }
      }
      
      // Fallback pattern detection for crisis signals we might have missed
      const crisisPatterns = [
        /crisis|emergency|urgent|need help now|immediate danger|severe (depression|anxiety|panic)/,
        /voices telling me|hearing voices|seeing things|government watching|paranoid|psychotic/,
        /homicid|kill (them|him|her|someone)|shoot|stab|attack|murder/
      ];
      
      return crisisPatterns.some(pattern => pattern.test(lowerInput));
    } catch (error) {
      console.error("CRISIS DETECTOR: Error in crisis detection", error);
      // Safety fallback - if there's any error, better to assume it might be a crisis
      return /suicid|kill|harm|hurt|die|dead/i.test(userInput.toLowerCase());
    }
  }, []);
  
  return { checkForCrisisContent };
};

// Export the function directly for use in non-hook contexts
export const checkForCrisisContent = (userInput: string): boolean => {
  if (!userInput || typeof userInput !== 'string') {
    console.error("CRISIS DETECTOR: Invalid input received", userInput);
    return false;
  }
  
  try {
    console.log("CRISIS DETECTOR: Checking user input for crisis content (direct function)");
    
    // CRITICAL PRIORITY - Check for suicide/self-harm mentions first
    // These take absolute precedence over all other crisis types
    const suicidePatterns = [
      /suicid|kill (myself|me)|end (my|this) life|harm (myself|me)|cut (myself|me)|hurt (myself|me)/,
      /don'?t want to (live|be alive)|take my (own )?life|killing myself|commit suicide|die by suicide/,
      /fatal overdose|hang myself|jump off|i wish i was dead|i want to die|i might kill/,
      /shoot myself|gun|bullet|jump|overdose|pills/
    ];
    
    for (const pattern of suicidePatterns) {
      if (pattern.test(userInput.toLowerCase())) {
        console.log("CRISIS DETECTOR: Immediate suicide risk detected - HIGHEST PRIORITY");
        return true;
      }
    }
    
    // Next priority - Check for eating disorder content
    if (/eat(ing)?|food|meal|diet|weight|body|fat|thin|anorexia|bulimia|binge|purge|hunger|starv/i.test(userInput.toLowerCase())) {
      console.log("CRISIS DETECTOR: Food-related content detected, using specialized processor");
      const result = processFoodRelatedMessage(userInput);
      
      // If the executive system says this is a high-risk eating disorder situation, it's a crisis
      if (result.responseType === 'eating_disorder' && result.riskLevel === 'high') {
        console.log("CRISIS DETECTOR: High-risk eating disorder detected by executive system");
        return true;
      }
    }
    
    // Direct pattern matches for eating disorders
    const lowerInput = userInput.toLowerCase().trim();
    
    // Direct check for eating disorder issues
    if (/can't stop eating|binge eating|overeating|eating too much|compulsive eating|eaten [0-9]+ .+ in a row|not eating|haven't been eating|struggling not eating|can't eat|don't eat/i.test(lowerInput)) {
      console.log("CRISIS DETECTOR: Direct eating disorder pattern match");
      return true;
    }
    
    // Check with our eating disorder detection system for high-risk cases
    const edResult = detectEatingDisorderConcerns(userInput);
    if (edResult.isEatingDisorderConcern && (edResult.riskLevel === 'high' || edResult.needsImmediate)) {
      console.log("CRISIS DETECTOR: Eating disorder detection system identified high risk");
      return true;
    }
    
    // Check for substance abuse signals
    const substancePatterns = [
      /drinking|alcohol|drunk|intoxicated|can't stop drinking|addicted|substance/,
      /(\d+)\s+(beers|drinks|shots|bottles)/,
      /high|wasted|hammered|plastered|blacked out/,
      /withdrawal|DTs|shakes|alcohol poisoning/
    ];
    
    for (const pattern of substancePatterns) {
      if (pattern.test(lowerInput)) {
        // Check for quantity indicators that suggest crisis
        const quantityMatch = lowerInput.match(/(\d+)\s+(beers|drinks|shots|bottles)/);
        if (quantityMatch) {
          const quantity = parseInt(quantityMatch[1], 10);
          if (quantity > 10) {
            console.log("CRISIS DETECTOR: High quantity alcohol consumption detected");
            return true;
          }
        }
        
        // Check for severe language
        if (/withdrawal|DTs|shakes|alcohol poisoning|can't stop|addicted/i.test(lowerInput)) {
          console.log("CRISIS DETECTOR: Severe substance use language detected");
          return true;
        }
      }
    }
    
    // Fallback pattern detection for crisis signals we might have missed
    const crisisPatterns = [
      /crisis|emergency|urgent|need help now|immediate danger|severe (depression|anxiety|panic)/,
      /voices telling me|hearing voices|seeing things|government watching|paranoid|psychotic/,
      /homicid|kill (them|him|her|someone)|shoot|stab|attack|murder/
    ];
    
    return crisisPatterns.some(pattern => pattern.test(lowerInput));
  } catch (error) {
    console.error("CRISIS DETECTOR: Error in crisis detection", error);
    // Safety fallback - if there's any error, better to assume it might be a crisis
    return /suicid|kill|harm|hurt|die|dead/i.test(userInput.toLowerCase());
  }
};
