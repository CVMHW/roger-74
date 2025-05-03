
/**
 * Chat Log Reviewer Module
 * 
 * TERTIARY SAFEGUARD: Reviews the entire conversation history before 
 * generating a response to ensure continuity and proper understanding
 * of the patient's concerns.
 */

import { getContextualMemory } from '../nlpProcessor';
import { getFiveResponseMemory } from '../memory/fiveResponseMemory';

/**
 * Represents a conversation analysis result
 */
interface ConversationAnalysis {
  mainTopics: string[];
  recentTopics: string[];
  repeatedConcerns: string[];
  possibleMisunderstandings: string[];
  patientFeelings: string[];
  unaddressedPoints: string[];
  continuityScore: number; // 0-100 measure of conversation continuity
}

/**
 * Review the entire chat log before responding
 * Acts as a tertiary safeguard to ensure patient concerns are addressed
 */
export const reviewChatLog = (
  userInput: string,
  conversationHistory: string[]
): ConversationAnalysis => {
  console.log("TERTIARY SAFEGUARD: Reviewing entire chat log before responding");
  
  // Initialize analysis object
  const analysis: ConversationAnalysis = {
    mainTopics: [],
    recentTopics: [],
    repeatedConcerns: [],
    possibleMisunderstandings: [],
    patientFeelings: [],
    unaddressedPoints: [],
    continuityScore: 100 // Start with perfect score and reduce as needed
  };
  
  try {
    // Skip if no conversation history
    if (!conversationHistory || conversationHistory.length === 0) {
      return analysis;
    }
    
    // Get context from primary memory system
    const primaryMemory = getContextualMemory(userInput);
    
    // Get context from 5ResponseMemory backup system
    const fiveResponseMemory = getFiveResponseMemory();
    
    // Extract main topics from conversation (from primary memory)
    if (primaryMemory && primaryMemory.dominantTopics) {
      analysis.mainTopics = [...primaryMemory.dominantTopics];
    }
    
    // Extract recent topics from the last few messages
    const recentMessages = conversationHistory.slice(-5);
    const topicPatterns = [
      { regex: /anxious|anxiety|nervous|worried|stress|concern/i, topic: "anxiety" },
      { regex: /sad|unhappy|down|depress|blue|low|upset/i, topic: "sadness" },
      { regex: /angry|mad|furious|annoyed|irritated|frustrated/i, topic: "anger" },
      { regex: /family|parent|child|spouse|relationship|marriage|partner/i, topic: "relationships" },
      { regex: /work|job|career|boss|coworker|colleague/i, topic: "work" },
      { regex: /money|finance|debt|bill|cost|afford/i, topic: "finances" },
      { regex: /health|sick|illness|pain|doctor|symptom|diagnos/i, topic: "health" },
      { regex: /sleep|tired|insomnia|rest|exhaust|fatigue/i, topic: "sleep" },
      { regex: /trauma|abuse|assault|accident|ptsd|attack/i, topic: "trauma" },
      { regex: /loss|grief|death|died|passed away|bereavement/i, topic: "grief" }
    ];
    
    // Find topics in recent messages
    recentMessages.forEach(message => {
      topicPatterns.forEach(pattern => {
        if (pattern.regex.test(message) && !analysis.recentTopics.includes(pattern.topic)) {
          analysis.recentTopics.push(pattern.topic);
        }
      });
    });
    
    // Detect repeated concerns (mentioned 2+ times)
    const concernCounts: {[key: string]: number} = {};
    conversationHistory.forEach(message => {
      // Skip Roger's responses (usually start with "I" or contain typical Roger phrases)
      if (message.startsWith("I ") && 
          (message.includes("hear") || 
           message.includes("understand") || 
           message.includes("appreciate") ||
           message.includes("notice"))) {
        return;
      }
      
      topicPatterns.forEach(pattern => {
        if (pattern.regex.test(message)) {
          concernCounts[pattern.topic] = (concernCounts[pattern.topic] || 0) + 1;
        }
      });
    });
    
    // Add any concern mentioned 2+ times to repeated concerns
    Object.entries(concernCounts).forEach(([concern, count]) => {
      if (count >= 2) {
        analysis.repeatedConcerns.push(concern);
      }
    });
    
    // Detect possible misunderstandings
    // Look for phrases indicating Roger misunderstood something
    const misunderstandingIndicators = [
      "that's not what I meant",
      "you misunderstood",
      "that's not what I said",
      "you're not listening",
      "you didn't understand",
      "that's not right",
      "no, I meant",
      "you're not getting it"
    ];
    
    conversationHistory.forEach(message => {
      misunderstandingIndicators.forEach(indicator => {
        if (message.toLowerCase().includes(indicator.toLowerCase()) &&
            !analysis.possibleMisunderstandings.includes(message)) {
          analysis.possibleMisunderstandings.push(message);
          // Reduce continuity score for each misunderstanding
          analysis.continuityScore -= 15;
        }
      });
    });
    
    // Extract patient feelings
    // Use primary memory system first
    if (primaryMemory && primaryMemory.dominantEmotion) {
      analysis.patientFeelings.push(primaryMemory.dominantEmotion);
    }
    
    // Also check for explicitly stated feelings in recent messages
    const feelingPatterns = [
      { regex: /feel(?:ing)? anxious|feel(?:ing)? nervous|feel(?:ing)? worried/i, feeling: "anxious" },
      { regex: /feel(?:ing)? sad|feel(?:ing)? down|feel(?:ing)? depressed/i, feeling: "sad" },
      { regex: /feel(?:ing)? angry|feel(?:ing)? mad|feel(?:ing)? frustrated/i, feeling: "angry" },
      { regex: /feel(?:ing)? happy|feel(?:ing)? good|feel(?:ing)? great/i, feeling: "happy" },
      { regex: /feel(?:ing)? confused|feel(?:ing)? uncertain|feel(?:ing)? unsure/i, feeling: "confused" },
      { regex: /feel(?:ing)? overwhelmed|feel(?:ing)? stressed|feel(?:ing)? pressure/i, feeling: "overwhelmed" },
      { regex: /feel(?:ing)? hopeless|feel(?:ing)? despair/i, feeling: "hopeless" },
      { regex: /feel(?:ing)? lonely|feel(?:ing)? isolated|feel(?:ing)? alone/i, feeling: "lonely" }
    ];
    
    const recentUserMessages = fiveResponseMemory
      .filter(entry => entry.role === 'patient')
      .map(entry => entry.content);
    
    recentUserMessages.forEach(message => {
      feelingPatterns.forEach(pattern => {
        if (pattern.regex.test(message) && !analysis.patientFeelings.includes(pattern.feeling)) {
          analysis.patientFeelings.push(pattern.feeling);
        }
      });
    });
    
    // Identify potentially unaddressed points
    // Look for questions or important statements that weren't addressed in subsequent responses
    const questionPatterns = [
      { regex: /\?$|what|how|why|when|where|who|which/i, type: "question" },
      { regex: /important|critical|crucial|serious|urgent|need to|must/i, type: "important statement" }
    ];
    
    // Check for unanswered questions or unaddressed important statements
    for (let i = 0; i < conversationHistory.length; i++) {
      const message = conversationHistory[i];
      
      // Skip Roger's responses for this analysis
      if (message.startsWith("I ") && 
          (message.includes("hear") || 
           message.includes("understand") || 
           message.includes("appreciate") ||
           message.includes("notice"))) {
        continue;
      }
      
      // Check if this message contains a question or important statement
      let containsImportantPoint = false;
      let pointType = "";
      
      questionPatterns.forEach(pattern => {
        if (pattern.regex.test(message)) {
          containsImportantPoint = true;
          pointType = pattern.type;
        }
      });
      
      if (containsImportantPoint) {
        // Check if next response addresses this point
        let pointAddressed = false;
        
        // Get the next response (if any)
        if (i + 1 < conversationHistory.length) {
          const nextResponse = conversationHistory[i + 1];
          
          // Extract key terms from the message
          const messageWords = message.toLowerCase().split(/\s+/).filter(word => 
            word.length > 3 && !["what", "when", "where", "which", "that", "this", "these", "those", "with"].includes(word)
          );
          
          // Check if any key terms appear in the next response
          messageWords.forEach(word => {
            if (nextResponse.toLowerCase().includes(word)) {
              pointAddressed = true;
            }
          });
          
          // If response contains a question mark, likely addressed the question
          if (nextResponse.includes("?")) {
            pointAddressed = true;
          }
          
          // If not addressed, add to unaddressed points
          if (!pointAddressed && message.trim().length > 10) {
            analysis.unaddressedPoints.push(message);
            // Reduce continuity score for unaddressed points
            analysis.continuityScore -= 10;
          }
        }
      }
    }
    
    // Limit the continuity score to a minimum of 0
    analysis.continuityScore = Math.max(0, analysis.continuityScore);
    
    return analysis;
  } catch (error) {
    console.error("Error in chat log review:", error);
    return analysis;
  }
};

/**
 * Enhance a response based on chat log review
 * Makes sure the response addresses previously unaddressed points
 */
export const enhanceResponseBasedOnReview = (
  originalResponse: string,
  analysis: ConversationAnalysis,
  userInput: string
): string => {
  try {
    // If continuity score is high and no unaddressed points, return original
    if (analysis.continuityScore > 85 && analysis.unaddressedPoints.length === 0) {
      return originalResponse;
    }
    
    let enhancedResponse = originalResponse;
    
    // Address continuity problems
    if (analysis.continuityScore < 85) {
      // Add acknowledgment to beginning of response
      const continuityAcknowledgment = "I want to make sure I'm understanding what you're sharing. ";
      enhancedResponse = continuityAcknowledgment + enhancedResponse;
    }
    
    // Address possible misunderstandings
    if (analysis.possibleMisunderstandings.length > 0) {
      enhancedResponse = "I apologize for any misunderstanding. Let me try to better understand what you're saying. " + enhancedResponse;
    }
    
    // Address unaddressed points
    if (analysis.unaddressedPoints.length > 0) {
      // Take the most recent unaddressed point
      const unaddressedPoint = analysis.unaddressedPoints[analysis.unaddressedPoints.length - 1];
      
      // Create a summary of the unaddressed point (first 40 chars)
      const pointSummary = unaddressedPoint.substring(0, 40) + (unaddressedPoint.length > 40 ? "..." : "");
      
      // Add to the end of the response
      enhancedResponse += ` I also want to circle back to something you mentioned earlier: "${pointSummary}" Can you tell me more about that?`;
    }
    
    // Address repeated concerns
    if (analysis.repeatedConcerns.length > 0 && !enhancedResponse.includes(analysis.repeatedConcerns[0])) {
      const repeatedConcern = analysis.repeatedConcerns[0];
      
      // Check if original response addresses the repeated concern
      if (!originalResponse.toLowerCase().includes(repeatedConcern.toLowerCase())) {
        // Add acknowledgment of the repeated concern
        enhancedResponse += ` I've noticed you've mentioned ${repeatedConcern} several times. How central is this to what you're experiencing right now?`;
      }
    }
    
    return enhancedResponse;
  } catch (error) {
    console.error("Error enhancing response based on review:", error);
    return originalResponse;
  }
};

/**
 * Main function to review chat log and enhance response
 * This is the primary entry point for the tertiary safeguard
 */
export const processThroughChatLogReview = (
  response: string,
  userInput: string,
  conversationHistory: string[]
): string => {
  console.log("TERTIARY SAFEGUARD: Processing response through chat log review");
  
  try {
    // Perform comprehensive review of the chat log
    const analysis = reviewChatLog(userInput, conversationHistory);
    
    // Log analysis for debugging
    console.log("Chat log analysis:", analysis);
    
    // Enhance response based on review findings
    const enhancedResponse = enhanceResponseBasedOnReview(response, analysis, userInput);
    
    return enhancedResponse;
  } catch (error) {
    console.error("Error in chat log review process:", error);
    return response; // Return original response if there's an error
  }
};
