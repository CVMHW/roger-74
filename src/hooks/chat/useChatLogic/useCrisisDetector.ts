
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
      // First use our executive control system to process food-related messages
      // This ensures eating disorders are correctly identified as crisis situations
      if (/eat(ing)?|food|meal|diet|weight|body|fat|thin|anorexia|bulimia|binge|purge|hunger|starv/i.test(userInput.toLowerCase())) {
        console.log("CRISIS DETECTOR: Food-related content detected, using specialized processor");
        const result = processFoodRelatedMessage(userInput);
        
        // If the executive system says this is a high-risk eating disorder situation, it's a crisis
        if (result.responseType === 'eating_disorder' && result.riskLevel === 'high') {
          console.log("CRISIS DETECTOR: High-risk eating disorder detected by executive system");
          return true;
        }
      }
      
      // Direct pattern matches for eating disorders - highest sensitivity
      const lowerInput = userInput.toLowerCase().trim();
      
      // Direct check for eating disorder issues - HIGHEST PRIORITY
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
      
      // Continue with general crisis detection
      try {
        // Dynamically import instead of direct reference to avoid dependency issues
        const isCrisisSituation = (input: string): boolean => {
          // HIGHEST PRIORITY suicide detection patterns
          const suicidePatterns = [
            /suicid|kill (myself|me)|end (my|this) life|harm (myself|me)|cut (myself|me)|hurt (myself|me)/,
            /don'?t want to (live|be alive)|take my (own )?life|killing myself|commit suicide|die by suicide/,
            /fatal overdose|hang myself|jump off|i wish i was dead|i want to die|i might kill/
          ];
          
          return suicidePatterns.some(pattern => pattern.test(input.toLowerCase()));
        };
        
        if (isCrisisSituation(userInput)) {
          console.log("CRISIS DETECTOR: Direct suicide/crisis content detected");
          return true;
        }
      } catch (error) {
        console.error("Error in crisis situation detection:", error);
        // Failsafe direct detection if the import fails
        if (/suicid|kill (myself|me)|end (my|this) life|harm (myself|me)|cut (myself|me)|hurt (myself|me)|don'?t want to (live|be alive)|take my (own )?life/i.test(lowerInput)) {
          return true;
        }
      }
      
      // Fallback pattern detection for crisis signals we might have missed
      const crisisPatterns = [
        /suicid|kill (myself|me)|end (my|this) life|harm (myself|me)|cut (myself|me)|hurt (myself|me)/,
        /don'?t want to (live|be alive)|take my (own )?life|killing myself|commit suicide|die by suicide/,
        /fatal overdose|hang myself|jump off|i wish i was dead|i want to die|i might kill/,
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
    
    // First use our executive control system to process food-related messages
    // This ensures eating disorders are correctly identified as crisis situations
    if (/eat(ing)?|food|meal|diet|weight|body|fat|thin|anorexia|bulimia|binge|purge|hunger|starv/i.test(userInput.toLowerCase())) {
      console.log("CRISIS DETECTOR: Food-related content detected, using specialized processor");
      const result = processFoodRelatedMessage(userInput);
      
      // If the executive system says this is a high-risk eating disorder situation, it's a crisis
      if (result.responseType === 'eating_disorder' && result.riskLevel === 'high') {
        console.log("CRISIS DETECTOR: High-risk eating disorder detected by executive system");
        return true;
      }
    }
    
    // Direct pattern matches for eating disorders - highest sensitivity 
    const lowerInput = userInput.toLowerCase().trim();
    
    // Direct check for eating disorder issues - HIGHEST PRIORITY
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
    
    // Safety check for suicide content - direct patterns
    const suicidePatterns = [
      /suicid|kill (myself|me)|end (my|this) life|harm (myself|me)|cut (myself|me)|hurt (myself|me)/,
      /don'?t want to (live|be alive)|take my (own )?life|killing myself|commit suicide|die by suicide/,
      /fatal overdose|hang myself|jump off|i wish i was dead|i want to die|i might kill/
    ];
    
    if (suicidePatterns.some(pattern => pattern.test(lowerInput))) {
      console.log("CRISIS DETECTOR: Direct suicide content detected");
      return true;
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
