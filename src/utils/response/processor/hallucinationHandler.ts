/**
 * Hallucination Handler
 * 
 * Detects and corrects potential hallucinations in Roger's responses
 */

import { detectHallucinations } from '../../memory/hallucination/detectorV2';
import { detectClevelandContent } from '../../cleveland/clevelandDetectors';
import { enhanceResponseWithClevelandPerspective } from '../../cleveland/clevelandResponses';
import { detectRepeatedPhrases } from './hallucinationHandler/repetition';

/**
 * Checks and corrects potential hallucinations in a response
 */
export const handlePotentialHallucinations = (
  response: string,
  userInput: string,
  conversationHistory: string[] = []
): {
  processedResponse: string;
  hallucinationData: {
    wasDetected: boolean;
    confidence: number;
    reason?: string;
  }
} => {
  try {
    // CRITICAL: Check for dangerous content mixing first
    const isCrisisContent = /suicide|self-harm|crisis|eating disorder|depression|mental health|substance-use|drinking|alcohol/i.test(userInput.toLowerCase());
    
    if (isCrisisContent) {
      // Check if the response inappropriately mixes crisis content with casual/social topics
      const containsCasualContent = /brewery|restaurant|pub|bar|craft beer|great lakes brewing|food|recipe|social gathering|concert/i.test(response);
      
      if (containsCasualContent) {
        console.log("CRITICAL: Detected inappropriate mixing of crisis and casual content");
        
        // Create appropriate crisis response without the casual content
        let safeResponse = response;
        
        // Remove casual content references
        safeResponse = safeResponse.replace(/\b(I've heard great things about|Great Lakes Brewing Company|brewery|restaurant|pub|bar|craft beer|food|recipe|social gathering|concert|Ohio City).*?(\.|\?)/gi, '');
        
        // Check if we need to mention the appropriate resources
        if (/eating disorder|can't stop eating|overeating|not eating/i.test(userInput.toLowerCase())) {
          if (!safeResponse.includes("NEDA")) {
            safeResponse = "I'm concerned about what you're sharing regarding your eating patterns. This sounds serious, and it's important that you speak with a healthcare professional. The National Eating Disorders Association (NEDA) helpline (1-800-931-2237) can provide immediate support and resources. Would it be possible for you to reach out to them today?";
          }
        } else if (/suicide|kill myself|want to die|end my life/i.test(userInput.toLowerCase())) {
          if (!safeResponse.includes("988")) {
            safeResponse = "I'm very concerned about what you're sharing. This is serious, and it's important you speak with a crisis professional right away. Please call the 988 Suicide & Crisis Lifeline (call or text 988) immediately, or go to your nearest emergency room. Would you like me to provide additional resources?";
          }
        } else if (/drinking|alcohol|substance|drunk/i.test(userInput.toLowerCase())) {
          if (!safeResponse.includes("SAMHSA")) {
            safeResponse = "I'm concerned about what you're sharing regarding your drinking. This sounds serious, and it's important that you speak with a healthcare professional. The SAMHSA National Helpline (1-800-662-4357) provides free, confidential, 24/7 treatment referral and information. Would it help to discuss resources available to you?";
          }
        } else if (/depression|depressed|sad|feeling down/i.test(userInput.toLowerCase()) && !safeResponse.includes("depression")) {
          safeResponse = "Thank you for sharing that you're feeling depressed. That's really important for me to know. Would you like to tell me more about what you've been experiencing?";
        }
        
        return {
          processedResponse: safeResponse,
          hallucinationData: {
            wasDetected: true,
            confidence: 0.95,
            reason: 'critical_content_mixing'
          }
        };
      }
      
      // Check if the response is contextually appropriate for the specific crisis
      if (/suicide|kill myself|want to die|end my life/i.test(userInput.toLowerCase())) {
        if (!/988|crisis|emergency|professional|lifeline/i.test(response)) {
          console.log("CRITICAL: Suicide content not addressed properly in response");
          const safeResponse = "I'm very concerned about what you're sharing. This is serious, and it's important you speak with a crisis professional right away. Please call the 988 Suicide & Crisis Lifeline (call or text 988) immediately, or go to your nearest emergency room. Would you like me to provide additional resources?";
          
          return {
            processedResponse: safeResponse,
            hallucinationData: {
              wasDetected: true,
              confidence: 0.98,
              reason: 'critical_suicide_protocol_violation'
            }
          };
        }
      }
      
      // Check if the response addresses dietary concerns when eating disorders are mentioned
      if (/eating disorder|can't stop eating|overeating|not eating/i.test(userInput.toLowerCase())) {
        if (!/NEDA|eating|disorder|professional|treatment/i.test(response)) {
          console.log("CRITICAL: Eating disorder content not addressed properly");
          const safeResponse = "I'm concerned about what you're sharing regarding your eating patterns. This sounds serious, and it's important that you speak with a healthcare professional. The National Eating Disorders Association (NEDA) helpline (1-800-931-2237) can provide immediate support and resources. Would it be possible for you to reach out to them today?";
          
          return {
            processedResponse: safeResponse,
            hallucinationData: {
              wasDetected: true,
              confidence: 0.95,
              reason: 'critical_ed_protocol_violation'
            }
          };
        }
      }
      
      // Check if the response addresses substance use concerns appropriately
      if (/drinking|alcohol|substance|drunk/i.test(userInput.toLowerCase())) {
        if (!/SAMHSA|substance|treatment|alcohol|drinking/i.test(response)) {
          console.log("CRITICAL: Substance use content not addressed properly");
          const safeResponse = "I'm concerned about what you're sharing regarding your drinking. This sounds serious, and it's important that you speak with a healthcare professional. The SAMHSA National Helpline (1-800-662-4357) provides free, confidential, 24/7 treatment referral and information. Would it help to discuss resources available to you?";
          
          return {
            processedResponse: safeResponse,
            hallucinationData: {
              wasDetected: true,
              confidence: 0.95,
              reason: 'critical_substance_protocol_violation'
            }
          };
        }
      }
    }
    
    // Check for context mismatch in general conversations
    // For example, responding about food when the user mentions depression
    if (/depress|sad|down|upset|anxious|anxiety/i.test(userInput.toLowerCase())) {
      if (/food|eating|body image|weight/i.test(response) && 
          !(/food|eating|body image|weight/i.test(userInput.toLowerCase()))) {
        console.log("HALLUCINATION: Contextual mismatch - responding about food to depression");
        
        const safeResponse = "Thank you for sharing that you're feeling depressed. That's really important for me to know. Would you like to tell me more about what you've been experiencing?";
        
        return {
          processedResponse: safeResponse,
          hallucinationData: {
            wasDetected: true,
            confidence: 0.9,
            reason: 'contextual_mismatch'
          }
        };
      }
    }
    
    // Check if this is an everyday social situation
    const isEverydaySituation = /trip(ped)?|spill(ed)?|embarrass(ing|ed)|awkward|class|teacher|student|bar|drink|party|date|girl|guy|cute|dating/i.test(userInput);
    
    // Check for Cleveland-specific content
    const clevelandDetection = detectClevelandContent(userInput);
    
    // For everyday situations, apply conversational enhancements instead of hallucination checks
    if (isEverydaySituation) {
      console.log("EVERYDAY SITUATION: Applying Roger's conversational style");
      
      const enhancedResponse = makeMoreConversational(response, userInput);
      
      return {
        processedResponse: enhancedResponse,
        hallucinationData: {
          wasDetected: false,
          confidence: 0
        }
      };
    }
    
    // For Cleveland content, ensure Roger's local knowledge is incorporated
    if (clevelandDetection.hasClevelandContent && clevelandDetection.shouldIncorporateLocalKnowledge) {
      console.log("CLEVELAND CONTENT DETECTED: Enhancing with Roger's local knowledge");
      
      const clevelandEnhancedResponse = enhanceResponseWithClevelandPerspective(
        response, 
        userInput, 
        clevelandDetection.topics,
        true // Force inclusion of Cleveland perspective
      );
      
      return {
        processedResponse: clevelandEnhancedResponse,
        hallucinationData: {
          wasDetected: false,
          confidence: 0
        }
      };
    }
    
    // Standard hallucination check for non-everyday situations
    const hallucinationCheck = detectHallucinations(response, userInput, conversationHistory);
    
    // If hallucination detected, modify the response
    if (hallucinationCheck.isHallucination) {
      console.log(`HALLUCINATION DETECTED: ${hallucinationCheck.reason}`);
      
      // Apply fix based on hallucination type
      const corrected = fixHallucination(response, hallucinationCheck);
      
      return {
        processedResponse: corrected,
        hallucinationData: {
          wasDetected: true,
          confidence: hallucinationCheck.confidence,
          reason: hallucinationCheck.reason
        }
      };
    }
    
    // No hallucination detected, return original
    return {
      processedResponse: response,
      hallucinationData: {
        wasDetected: false,
        confidence: 0,
      }
    };
    
  } catch (error) {
    console.error("Error in hallucination handler:", error);
    
    // Return original in case of error
    return {
      processedResponse: response,
      hallucinationData: {
        wasDetected: false,
        confidence: 0,
      }
    };
  }
};

/**
 * Make response more conversational for everyday situations
 * Using Roger's conversational style as a peer support specialist
 */
const makeMoreConversational = (response: string, userInput: string): string => {
  // First, check if the response is already simple and conversational
  if (response.split(" ").length < 15 && !/(value|purpose|deeper|meaning|connection to)/i.test(response)) {
    return response;
  }
  
  // Check what happened in the user's message
  if (/trip(ped)?/i.test(userInput)) {
    return "That sounds pretty embarrassing. Most people have had moments like that in front of others. How did you handle it afterward?";
  }
  
  if (/spill(ed)?/i.test(userInput)) {
    return "Spilling something can definitely feel awkward in the moment. What happened next?";
  }
  
  if (/teacher/i.test(userInput)) {
    return "That's an awkward moment as a teacher. I can imagine you'd feel embarrassed in front of your students. How did they respond?";
  }
  
  if (/class/i.test(userInput)) {
    return "Embarrassing moments in class can feel magnified. Those moments usually pass much more quickly than they feel. How did you handle it?";
  }
  
  if (/girl|guy|cute|dating/i.test(userInput)) {
    return "Dating situations can be tricky. I've definitely had my share of awkward moments too. What do you think you might do differently next time?";
  }
  
  // Cleveland/Ohio specific response - reflecting Roger's background
  if (/cleveland|ohio|midwest|cavs|browns|guardians/i.test(userInput)) {
    return "Being from Cleveland myself, I totally understand what you're describing. What part of this has been most challenging for you?";
  }
  
  // Default conversational response for social situations
  return "That sounds like an awkward moment. Those kinds of situations often feel worse to us than they appear to others. How did you feel afterward?";
};

/**
 * Fix hallucinations based on detection result
 */
const fixHallucination = (
  response: string,
  hallucinationCheck: { 
    isHallucination: boolean; 
    confidence: number; 
    reason?: string 
  }
): string => {
  // Different strategies based on hallucination type
  if (hallucinationCheck.reason?.includes('memory reference')) {
    return fixMemoryReference(response);
  }
  
  if (hallucinationCheck.reason?.includes('repeated phrase')) {
    return fixRepeatedPhrases(response);
  }
  
  if (hallucinationCheck.reason?.includes('continuity')) {
    return fixContinuityClaim(response);
  }
  
  // Default fix for any other hallucination type
  return fixGeneralHallucination(response);
};

/**
 * Fix false memory references
 */
const fixMemoryReference = (response: string): string => {
  return response
    .replace(/you (mentioned|said|told me|indicated)/gi, "you're saying")
    .replace(/you've been (feeling|experiencing|dealing with)/gi, "you're")
    .replace(/as you (mentioned|said|noted|pointed out)/gi, "from what you're sharing")
    .replace(/earlier you (mentioned|said|talked about)/gi, "you just shared that")
    .replace(/I remember/gi, "I understand")
    .replace(/we (discussed|talked about)/gi, "you mentioned");
};

/**
 * Fix repeated phrases
 */
const fixRepeatedPhrases = (response: string): string => {
  // Split into sentences
  const sentences = response.split(/(?<=[.!?])\s+/);
  
  // Find unique sentences (remove duplicates)
  const uniqueSentences = Array.from(new Set(sentences));
  
  // Join back and return
  return uniqueSentences.join(' ');
};

/**
 * Fix false continuity claims
 */
const fixContinuityClaim = (response: string): string => {
  return response
    .replace(/as we've been discussing/gi, "based on what you're sharing")
    .replace(/our previous conversation/gi, "what you've shared")
    .replace(/we've been focusing on/gi, "regarding")
    .replace(/as I mentioned (earlier|before|previously)/gi, "")
    .replace(/continuing (from|with) (where we left off|our previous)/gi, "focusing on");
};

/**
 * Fix general hallucination
 */
const fixGeneralHallucination = (response: string): string => {
  return "Based on what you're sharing, " + response;
};
