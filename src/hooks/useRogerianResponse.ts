import { useState, useEffect } from 'react';
import { MessageType } from '../components/Message';
import useTypingEffect from './useTypingEffect';
import useAdaptiveResponse from './useAdaptiveResponse';
import { useConcernDetection } from './response/concernDetection';
import { useConversationStage } from './response/conversationStageManager';
import { useResponseCompliance } from './response/responseCompliance';
import { useResponseGenerator } from './response/responseGenerator';
import { useResponseProcessing } from './response/responseProcessing';
import { detectGriefThemes } from '../utils/response/griefSupport';
import { 
  detectClientPreferences,
  detectSimpleNegativeState,
  generateSimpleNegativeStateResponse,
  detectPoliticalEmotions
} from '../utils/conversationalUtils';
import { generateSafetyConcernResponse, explainInpatientProcess } from '../utils/safetyConcernManager';
import { ConcernType } from '../utils/reflection/reflectionTypes';
import { DeceptionAnalysis } from '../utils/detectionUtils/deceptionDetection';
import {
  detectContentConcerns,
  detectSarcasm,
  detectRepetition,
  generateSarcasmResponse
} from '../utils/conversationEnhancement/emotionalInputHandler';
import {
  isUserIndicatingFeedbackLoop,
  extractConversationContext,
  generateFeedbackLoopRecoveryResponse
} from '../utils/conversationEnhancement/repetitionDetector';

// Import generateSmallTalkResponse directly from smallTalkUtils
import { generateSmallTalkResponse } from '../utils/conversation/smallTalkUtils';

interface UseRogerianResponseReturn {
  isTyping: boolean;
  processUserMessage: (userInput: string) => Promise<MessageType>;
  simulateTypingResponse: (response: string, callback: (text: string) => void) => void;
  currentApproach: 'rogerian' | 'mi' | 'existential' | 'conversational' | 'socratic';
  handlePotentialDeception?: (originalMessage: string, followUpMessage: string) => Promise<MessageType | null>;
}

const createMessage = (text: string, sender: 'user' | 'roger', concernType?: ConcernType) => {
  const id = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
  return {
    id,
    text,
    sender,
    timestamp: new Date(),
    concernType,
    feedback: null as 'positive' | 'negative' | null
  };
};

export const useRogerianResponse = (): UseRogerianResponseReturn => {
  // Hook for conversation stage management
  const { 
    conversationStage, 
    messageCount, 
    introductionMade,
    updateStage, 
    setIntroductionMade 
  } = useConversationStage();
  
  // Store conversation history for context awareness
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  
  // Track detected client preferences
  const [clientPreferences, setClientPreferences] = useState({
    prefersFormalLanguage: false,
    prefersDirectApproach: false,
    isFirstTimeWithMentalHealth: false
  });
  
  // Track repeated responses to prevent repetition loop
  const [recentResponses, setRecentResponses] = useState<string[]>([]);
  
  // Track if we're in recovery mode after a feedback loop
  const [feedbackLoopRecoveryMode, setFeedbackLoopRecoveryMode] = useState(false);
  
  // Hook for adaptive response generation strategy
  const { generateAdaptiveResponse, currentApproach } = useAdaptiveResponse();
  
  // Hook for concern detection
  const { detectConcerns } = useConcernDetection();
  
  // Hook for response compliance with master rules
  const { 
    previousResponses, 
    ensureResponseCompliance, 
    addToResponseHistory,
    setPreviousResponses 
  } = useResponseCompliance();
  
  // Hook for typing effect simulation
  const { calculateResponseTime, simulateTypingResponse } = useTypingEffect();
  
  // Hook for response generation - pass messageCount to respect the 30-minute rule
  // Now also passing conversation history for context awareness
  const { generateResponse } = useResponseGenerator({
    conversationStage,
    messageCount,
    introductionMade,
    adaptiveResponseFn: generateAdaptiveResponse,
    conversationHistory
  });
  
  // Hook for response processing
  const { isTyping, processUserMessage: baseProcessUserMessage } = useResponseProcessing({
    ensureResponseCompliance,
    addToResponseHistory,
    calculateResponseTime,
    simulateTypingResponse
  });
  
  // Effect to prevent response repetition
  useEffect(() => {
    // Keep only the last 5 responses to compare against
    if (recentResponses.length > 5) {
      setRecentResponses(prev => prev.slice(-5));
    }
  }, [recentResponses]);
  
  // Check if a response is too similar to recent responses
  const isResponseRepetitive = (response: string): boolean => {
    // Skip very short responses
    if (response.length < 20) return false;
    
    for (const prevResponse of recentResponses) {
      // Calculate similarity (very basic implementation)
      const similarity = calculateResponseSimilarity(response, prevResponse);
      if (similarity > 0.7) {
        return true;
      }
    }
    return false;
  };
  
  // Calculate similarity between two responses (basic implementation)
  const calculateResponseSimilarity = (a: string, b: string): number => {
    // Convert to lowercase and remove punctuation
    const cleanA = a.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
    const cleanB = b.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
    
    // Split into words
    const wordsA = cleanA.split(/\s+/);
    const wordsB = cleanB.split(/\s+/);
    
    // Count shared words
    let sharedWords = 0;
    for (const word of wordsA) {
      if (wordsB.includes(word)) {
        sharedWords++;
      }
    }
    
    // Calculate Jaccard similarity
    return sharedWords / (wordsA.length + wordsB.length - sharedWords);
  };
  
  // Alternative response generation when default is too repetitive
  const generateAlternativeResponse = (userInput: string): string => {
    // Detect if there's a specific content to focus on
    const contentInfo = detectContentConcerns(userInput);
    
    if (contentInfo.hasConcern) {
      return `Let's focus on what you said about ${contentInfo.specificConcern || contentInfo.category}. Can you tell me more about what's most important about this for you right now?`;
    }
    
    // If no specific content, use one of these varied responses
    const alternatives = [
      "I want to make sure I understand what's most important to you right now. What would be most helpful for us to discuss?",
      "Let's take a step back. What aspect of what you've shared would be most useful to explore?",
      "I'd like to shift our focus to what matters most to you right now. What's your priority?",
      "Let's make sure I'm focusing on what's most important. What specifically are you hoping to get from our conversation today?",
      "I want to be sure I'm addressing what matters to you. What's the main concern you'd like us to focus on?"
    ];
    
    return alternatives[Math.floor(Math.random() * alternatives.length)];
  };
  
  // Update conversation history when user messages are received
  const updateConversationHistory = (userInput: string) => {
    setConversationHistory(prev => {
      const newHistory = [...prev, userInput];
      // Keep last 10 messages for context
      return newHistory.length > 10 ? newHistory.slice(-10) : newHistory;
    });
    
    // Update detected client preferences
    const newPreferences = detectClientPreferences(userInput, conversationHistory);
    setClientPreferences(prev => ({
      prefersFormalLanguage: prev.prefersFormalLanguage || newPreferences.prefersFormalLanguage,
      prefersDirectApproach: prev.prefersDirectApproach || newPreferences.prefersDirectApproach,
      isFirstTimeWithMentalHealth: prev.isFirstTimeWithMentalHealth || newPreferences.isFirstTimeWithMentalHealth
    }));
  };
  
  // Handle potential deception in crisis communication
  const handlePotentialDeception = async (
    originalMessage: string,
    followUpMessage: string
  ): Promise<MessageType | null> => {
    try {
      // Dynamically import the deception detection module
      const deceptionModule = await import('../utils/detectionUtils/deceptionDetection');
      
      // Analyze for potential deception
      const deceptionAnalysis = deceptionModule.detectPotentialDeception(
        originalMessage, 
        followUpMessage
      );
      
      // If we detect deception with medium-high confidence, handle according to the unconditional law
      if (deceptionAnalysis.isPotentialDeception && deceptionAnalysis.confidence !== 'low') {
        // Generate appropriate response that explains inpatient stays
        const responseText = deceptionModule.generateDeceptionResponseMessage(deceptionAnalysis);
        
        // Create the message object
        const concernType = mapDeceptionConcernType(deceptionAnalysis);
        const responseMessage = createMessage(responseText, 'roger', concernType);
        
        // Add to response history
        addToResponseHistory(responseText);
        
        return responseMessage;
      }
    } catch (error) {
      console.error("Error in deception detection:", error);
    }
    
    return null;
  };
  
  // Map deception concern types to valid ConcernType values
  const mapDeceptionConcernType = (analysis: DeceptionAnalysis): ConcernType => {
    switch (analysis.originalConcern) {
      case 'suicide':
      case 'self-harm':
        return 'tentative-harm';
      case 'harm-to-others':
        return 'crisis';
      default:
        return 'crisis';
    }
  };
  
  // Function to check if the user is indicating Roger isn't listening
  const checkForFeedbackLoopComplaints = (userInput: string): boolean => {
    return isUserIndicatingFeedbackLoop(userInput);
  };

  // Generate a response that specifically acknowledges what the user has mentioned
  // to show that Roger is listening and understanding their situation
  const generateContextAcknowledgmentResponse = (userInput: string): string => {
    const context = extractConversationContext(userInput, conversationHistory);
    
    if (context.hasContext) {
      // If we have specific contextual information (locations, emotions, topics)
      // generate a response that acknowledges these specific details
      let response = "";
      
      // Acknowledge locations
      if (context.locations.length > 0) {
        if (context.locations.includes("Pakistan") && context.locations.includes("Cleveland")) {
          response = "I understand your move from Pakistan to Cleveland has been challenging. ";
        } else if (context.locations.includes("Pakistan")) {
          response = "I hear that Pakistan is important to you. ";
        } else if (context.locations.includes("Cleveland")) {
          response = "I understand you're in Cleveland now. ";
        }
      }
      
      // Acknowledge specific emotions
      if (context.emotions.length > 0) {
        if (!response) {
          response = `I can hear that you're feeling ${context.emotions[0]} right now. `;
        } else {
          response += `It makes sense you'd feel ${context.emotions[0]} about this. `;
        }
      }
      
      // Acknowledge specific topics
      if (context.topics.includes("language") && context.topics.includes("food") && context.topics.includes("weather")) {
        response += "The combination of language barriers, food differences, and weather changes is a lot to adjust to all at once. ";
      } else {
        if (context.topics.includes("language")) {
          response += "Language barriers can be especially isolating. ";
        }
        if (context.topics.includes("food")) {
          response += "Food is such an important part of feeling at home somewhere. ";
        }
        if (context.topics.includes("weather")) {
          response += "Adjusting to different weather can affect our daily comfort and mood. ";
        }
      }
      
      // Add a relevant follow-up question
      const followUpQuestions = [
        "Which of these changes has been hardest for you?",
        "What have you found helps you feel more connected despite these challenges?",
        "How have these adjustments been affecting your daily life?",
        "What do you miss most about home?",
        "Is there anything that's been easier than expected about this transition?"
      ];
      
      response += followUpQuestions[Math.floor(Math.random() * followUpQuestions.length)];
      
      return response;
    }
    
    // If no specific context was extracted, fall back to a generic but empathetic response
    return "I hear you're going through some difficult adjustments right now. Could you tell me more about what's been most challenging for you?";
  };
  
  // Detect wealth indicators to customize responses
  const detectWealthIndicators = (userInput: string, history: string[]): 'low' | 'medium' | 'high' | 'unknown' => {
    // Simple implementation - would be expanded in a real system
    const combinedText = [userInput, ...history.slice(-3)].join(' ').toLowerCase();
    
    // Check for low wealth indicators
    if (/\b(can'?t afford|expensive|cost too much|budget|money trouble|financial difficulty|poor|poverty|assistance|welfare|food stamps|medicaid|public housing)\b/i.test(combinedText)) {
      return 'low';
    }
    
    // Check for high wealth indicators
    if (/\b(investment|portfolio|stocks|broker|luxury|premium|private insurance|vacation home|second home|yacht|private school)\b/i.test(combinedText)) {
      return 'high';
    }
    
    return 'unknown';
  };
  
  // Specialized response generator for safety concerns that incorporates
  // customer-centric deescalation
  const generateSafetyResponse = (
    userInput: string, 
    concernType: ConcernType
  ): string => {
    return generateSafetyConcernResponse(userInput, concernType, {
      ...clientPreferences,
      wealthIndicators: detectWealthIndicators(userInput, conversationHistory),
      previousMentalHealthExperience: !clientPreferences.isFirstTimeWithMentalHealth
    });
  };
  
  // Generate a response for cultural adjustment concerns
  const generateCulturalAdjustmentResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    const context = extractConversationContext(userInput, conversationHistory);
    
    // Check for specific cultural adjustment themes
    const hasLanguageBarrier = /\b(language|speak|arabic|urdu|hindi|english)\b/i.test(lowerInput);
    const hasWeatherAdjustment = /\b(cold|weather|temperature|climate|winter|snow)\b/i.test(lowerInput);
    const hasFoodChallenges = /\b(food|eat|cuisine|meal|restaurant|cooking)\b/i.test(lowerInput);
    const hasSocialIsolation = /\b(alone|lonely|isolated|don'?t know anyone|no friends|miss|homesick)\b/i.test(lowerInput);
    const hasReligiousIdentity = /\b(muslim|islam|religion|faith|prayer|mosque|church|temple)\b/i.test(lowerInput);
    
    let response = "Moving to a new country involves so many adjustments all at once. ";
    
    // Add specific acknowledgments based on mentioned challenges
    if (context.locations.length > 0) {
      const fromLocation = context.locations.find(loc => loc.toLowerCase() !== "cleveland");
      if (fromLocation) {
        response += `The transition from ${fromLocation} to Cleveland brings its own unique challenges. `;
      }
    }
    
    if (hasLanguageBarrier) {
      response += "Language barriers can be especially isolating when you're trying to build a new life. ";
    }
    
    if (hasWeatherAdjustment) {
      response += "Adapting to Cleveland's cold climate can be physically and emotionally draining, especially if you're from a warmer region. ";
    }
    
    if (hasFoodChallenges) {
      response += "Food is deeply connected to our sense of home and comfort. Finding familiar foods or adapting to new cuisines is a significant adjustment. ";
    }
    
    if (hasReligiousIdentity) {
      response += "Practicing your faith in a new cultural context can present its own set of challenges and opportunities. ";
    }
    
    if (hasSocialIsolation) {
      response += "The feeling of disconnection when you don't have your community around you is one of the hardest parts of relocation. ";
    }
    
    // Add a thoughtful question to continue the conversation
    const followUpQuestions = [
      "What has been the most difficult adjustment for you so far?",
      "Have you found any resources or communities that have helped with this transition?",
      "What aspects of your home do you miss the most right now?",
      "How have you been taking care of yourself through these changes?",
      "Have there been any unexpected positive discoveries in your new environment?"
    ];
    
    response += followUpQuestions[Math.floor(Math.random() * followUpQuestions.length)];
    
    return response;
  };
  
  // Generate a response for weather-related situations
  const generateWeatherRelatedResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    const context = extractConversationContext(userInput, conversationHistory);
    
    // Check for specific weather-related themes
    const hasSnow = /\b(snow|blizzard|storm|hurricane|tornado|flood|ice|weather|power outage|electricity)\b/i.test(lowerInput);
    const hasPowerIssues = /\b(power outage|electricity|power|no heat|cold|freezing|internet down)\b/i.test(lowerInput);
    const hasIsolation = /\b(stuck|trapped|can'?t leave|unable to leave|days|inside|home|house|isolated|cabin fever|bored)\b/i.test(lowerInput);
    const hasFrustration = /\b(frustrat|annoy|bore|tired of|sick of|fed up|can'?t stand|stir-crazy)\b/i.test(lowerInput);
    const hasWork = /\b(work|job|remote|working from home|can'?t work)\b/i.test(lowerInput);
    const hasPet = /\b(dog|cat|pet|walk|doggie|kitty|puppy|kitten|animal)\b/i.test(lowerInput);
    
    let response = "I hear you're dealing with challenging weather that's really affecting your daily life. ";
    
    // Add specific acknowledgments based on mentioned challenges
    if (context.locations.length > 0) {
      response += `Being stuck at home in ${context.locations[0]} during severe weather can definitely be difficult. `;
    }
    
    if (hasSnow) {
      response += "Four feet of snow is extreme - most cities aren't equipped to handle that much accumulation quickly. ";
    }
    
    if (hasPowerIssues) {
      response += "The rolling power and internet outages must be making this situation even more challenging, especially when you're trying to maintain some normalcy. ";
    }
    
    if (hasIsolation && hasWork) {
      response += "Being unable to leave home while also struggling to work remotely due to infrastructure issues creates a frustrating double bind. ";
    } else if (hasIsolation) {
      response += "Being confined indoors for days can really take a toll on your mood and energy. ";
    }
    
    if (hasPet) {
      response += "It must be tough for both you and your pet to be cooped up, especially when your dog needs exercise and outdoor time. ";
    }
    
    if (hasFrustration) {
      response += "Your frustration is completely understandable given these circumstances. ";
    }
    
    // Add a thoughtful question to continue the conversation
    const followUpQuestions = [
      "How have you been coping with the isolation so far?",
      "Have you found any activities that help pass the time when the power is working?",
      "What's been the most challenging part of this weather situation for you?",
      "How have you been taking care of your wellbeing during this difficult time?",
      "Is there anything that's been helping you get through these difficult days?"
    ];
    
    response += followUpQuestions[Math.floor(Math.random() * followUpQuestions.length)];
    
    return response;
  };
  
  // Process user message with stage update and special cases
  const processUserMessage = async (userInput: string): Promise<MessageType> => {
    // Update conversation history and client preferences
    updateConversationHistory(userInput);
    
    // First check if the user is indicating Roger isn't listening or is stuck in a loop
    if (checkForFeedbackLoopComplaints(userInput)) {
      const context = extractConversationContext(userInput, conversationHistory);
      const recoveryResponse = generateFeedbackLoopRecoveryResponse(context);
      
      // Update conversation stage
      updateStage();
      
      // Create a message with the recovery response
      return Promise.resolve(createMessage(recoveryResponse, 'roger'));
    }
    
    // HIGHEST PRIORITY: Check for sarcasm or frustration directed at Roger
    if (detectSarcasm(userInput) && userInput.toLowerCase().includes("robot") || 
        userInput.toLowerCase().includes("stupid") ||
        userInput.toUpperCase() === userInput) {
      const contentInfo = detectContentConcerns(userInput);
      const sarcasmResponse = generateSarcasmResponse(contentInfo);
      
      // Update conversation stage
      updateStage();
      
      // Process with sarcasm response
      return baseProcessUserMessage(
        userInput,
        () => sarcasmResponse,
        () => null
      );
    }
    
    // Check for weather-related concerns - add this before other checks
    if (/\b(snow|blizzard|storm|hurricane|tornado|flood|ice|weather|power outage|electricity)\b/i.test(userInput.toLowerCase()) &&
        /\b(stuck|trapped|can'?t leave|unable to leave|days|inside|home|house|isolated|cabin fever|bored|frustrat)\b/i.test(userInput.toLowerCase())) {
      
      const weatherResponse = generateWeatherRelatedResponse(userInput);
      
      // Update conversation stage
      updateStage();
      
      // Return a weather-specific response
      return Promise.resolve(createMessage(weatherResponse, 'roger', 'weather-related'));
    }
    
    // Check for cultural adjustment concerns
    if (/\b(moved|came) from|pakistan|immigrant|refugee|language barrier|don'?t speak|different culture|adjustment|homesick|miss (home|my country)/i.test(userInput.toLowerCase())) {
      // Check if we have explicit location mentions
      const context = extractConversationContext(userInput, conversationHistory);
      
      if (context.hasContext) {
        const culturalResponse = generateCulturalAdjustmentResponse(userInput);
        
        // Update conversation stage
        updateStage();
        
        // Return a culturally sensitive response
        return Promise.resolve(createMessage(culturalResponse, 'roger', 'cultural-adjustment'));
      }
    }
    
    // After any feedback loop detection, check if we have specific context to acknowledge
    // This helps make Roger's responses feel more connected to what the user has shared
    if (conversationHistory.length >= 2) {
      const context = extractConversationContext(userInput, conversationHistory);
      
      if (context.hasContext && 
          (context.locations.length > 0 || context.topics.length >= 2 || context.keyPhrases.length > 0) &&
          Math.random() < 0.7) { // 70% chance to use context-aware response when applicable
        
        const contextResponse = generateContextAcknowledgmentResponse(userInput);
        
        // Update conversation stage
        updateStage();
        
        // Return a context-specific response
        return Promise.resolve(createMessage(contextResponse, 'roger'));
      }
    }
    
    // Check for repeated user concerns that aren't being addressed
    if (conversationHistory.length >= 2) {
      const repetitionInfo = detectRepetition(userInput, conversationHistory.slice(-3));
      const contentInfo = detectContentConcerns(userInput);
      
      // If user has repeated the same concern multiple times, acknowledge it directly
      if (repetitionInfo.isRepeating && repetitionInfo.repetitionCount >= 2 &&
          (userInput.toUpperCase() === userInput || userInput.includes('!') || 
          userInput.toLowerCase().includes("listen") || 
          userInput.toLowerCase().includes("not hearing"))) {
        
        // Update conversation stage
        updateStage();
        
        // Generate a response that directly acknowledges what they've been repeating
        const acknowledgeResponse = contentInfo.hasConcern
          ? `I apologize for not properly addressing your concern about ${contentInfo.specificConcern || contentInfo.category}. I'm listening now. What specific aspect of this is most important for us to focus on?`
          : `I'm sorry for not properly addressing what you've been trying to tell me. I'd like to make sure I understand correctly. Could you help me focus on what's most important?`;
        
        // Process with acknowledgment response
        return baseProcessUserMessage(
          userInput,
          () => acknowledgeResponse,
          detectConcerns
        );
      }
    }
    
    // NEXT PRIORITY: Check for explicitly stated feelings first
    const negativeStateInfo = detectSimpleNegativeState(userInput);
    if (negativeStateInfo.isNegativeState) {
      // User has explicitly stated how they feel or is in a negative state - always acknowledge this first
      updateStage();
      
      // Also detect any specific content/concerns mentioned
      const contentInfo = detectContentConcerns(userInput);
      
      // Generate response that acknowledges their stated feelings AND the specific concern
      return baseProcessUserMessage(
        userInput,
        (input) => generateSimpleNegativeStateResponse(input, negativeStateInfo, contentInfo),
        () => null // No concern needed here as we're handling the emotional state directly
      );
    }
    
    // Check for political emotions as second highest priority
    const politicalInfo = detectPoliticalEmotions(userInput);
    if (politicalInfo.isPolitical) {
      updateStage();
      
      // Process with political emotion response
      const { generatePoliticalEmotionResponse } = await import('../utils/conversationalUtils');
      return baseProcessUserMessage(
        userInput,
        (input) => generatePoliticalEmotionResponse(input, politicalInfo),
        () => null
      );
    }
    
    // Check for asking if Roger is Drew (unconditional rule)
    if (
      userInput.toLowerCase().includes("are you drew") || 
      userInput.toLowerCase().includes("is your name drew") ||
      userInput.toLowerCase().includes("your name is drew") ||
      userInput.toLowerCase().includes("you're drew") ||
      userInput.toLowerCase().includes("youre drew") ||
      userInput.toLowerCase().includes("you are drew")
    ) {
      // Direct response to redirect focus
      const redirectResponse = "I'm Roger, your peer support companion. My role is to be here for you and focus on your needs and experiences. What would be most helpful for us to explore together today?";
      
      // Update conversation stage before processing
      updateStage();
      
      // Process the usual way but with our specific response
      return baseProcessUserMessage(
        userInput,
        () => redirectResponse,
        detectConcerns
      );
    }
    
    // Check for statements about wanting to understand inpatient stays
    const inpatientQuestionPatterns = [
      /how long (is|are) inpatient/i,
      /what (is|are|happens in) inpatient/i,
      /(will|would) I be locked up/i,
      /how long (would|will) they keep me/i,
      /(don't|do not) want to (be|get) committed/i,
      /stay in (hospital|psych ward|mental hospital)/i,
      /(worried|concerned|scared) about (inpatient|hospitalization)/i
    ];
    
    if (inpatientQuestionPatterns.some(pattern => pattern.test(userInput))) {
      // If the user is asking about inpatient stays, provide accurate information
      // Get location data if available
      const locationData = extractUserLocation(userInput, conversationHistory);
      
      const inpatientInfoResponse = explainInpatientProcess(locationData);
      
      // Update conversation stage before processing
      updateStage();
      
      // Process the usual way but with our specific response
      return baseProcessUserMessage(
        userInput,
        () => inpatientInfoResponse,
        detectConcerns
      );
    }
    
    // NEW: Check for pet illness or cancer mentions
    try {
      const detectionUtils = await import('../utils/detectionUtils');
      
      // Check for pet illness concerns
      if (detectionUtils.detectPetIllnessConcerns(userInput)) {
        // Get specific illness details
        const illnessDetails = detectionUtils.detectSpecificIllness(userInput);
        
        // Generate appropriate response for pet illness
        const petIllnessResponse = detectionUtils.generatePetIllnessResponse({
          petType: extractPetType(userInput),
          illnessType: illnessDetails.illnessType,
          severity: illnessDetails.severity
        });
        
        // Update conversation stage
        updateStage();
        
        // Process with our specific response
        return baseProcessUserMessage(
          userInput,
          () => petIllnessResponse,
          () => 'pet-illness' as ConcernType // Special concern type for pet illness
        );
      }
      
      // Check for specific illness mentions that aren't pet-related
      const illnessDetails = detectionUtils.detectSpecificIllness(userInput);
      if (illnessDetails.detected && illnessDetails.context !== 'pet') {
        // This will be handled by the regular processing but with enhanced concern detection
        // The detectConcerns function will pick this up
      }
    } catch (error) {
      console.error("Error checking for illness mentions:", error);
    }
    
    // Check for grief themes to adjust response time and approach
    const griefThemes = detectGriefThemes(userInput);
    let responseGenerator = generateResponse;
    let responseTimeMultiplier = 1.0;
    
    // Check for safety concerns to prioritize deescalation and customer service
    const concernType = detectConcerns(userInput);
    
    // For weather-related concerns, use our specialized response generator
    if (concernType === 'weather-related') {
      responseGenerator = generateWeatherRelatedResponse;
    }
    // For other specific concerns, use appropriate response generators
    else if (concernType && 
        ['crisis', 'tentative-harm', 'mental-health', 'ptsd', 'trauma-response', 'pet-illness'].includes(concernType)) {
      // For safety concerns, use our enhanced safety response generator
      responseGenerator = generateSafetyResponse;
      // Increase response time for safety concerns to suggest careful consideration
      responseTimeMultiplier = 1.3;
    }
    
    // If grief themes are detected, adjust response time based on severity and metaphor
    else if (griefThemes.themeIntensity >= 2) {
      // For all grief messages, ensure proper response time
      
      // Adjust response time based on grief severity
      responseTimeMultiplier = 
        griefThemes.griefSeverity === 'existential' ? 1.5 :
        griefThemes.griefSeverity === 'severe' ? 1.5 :
        griefThemes.griefSeverity === 'moderate' ? 1.3 :
        griefThemes.griefSeverity === 'mild' ? 1.2 : 1.0;
      
      // Further adjust for metaphor complexity - roller coaster metaphors need more time
      if (griefThemes.griefMetaphorModel === 'roller-coaster') {
        responseTimeMultiplier += 0.2;
      }
      
      // If many grief stages are mentioned, add more time for a thoughtful response
      if (griefThemes.detectedGriefStages.length >= 3) {
        responseTimeMultiplier += 0.1;
      }
    }
    
    // Check for trauma response patterns to adjust response time
    let traumaResponsePatterns = null;
    try {
      // Use dynamic import instead of require
      const traumaModule = await import('../utils/response/traumaResponsePatterns').catch(() => null);
      if (traumaModule && traumaModule.detectTraumaResponsePatterns) {
        traumaResponsePatterns = traumaModule.detectTraumaResponsePatterns(userInput);
      }
    } catch (e) {
      console.log("Trauma module not available for response timing:", e);
    }
    
    // Adjust response time for trauma responses
    if (traumaResponsePatterns && traumaResponsePatterns.dominant4F) {
      const intensityMap = {
        'mild': 1.1,
        'moderate': 1.3,
        'severe': 1.4,
        'extreme': 1.5
      };
      
      // Base multiplier on intensity
      const intensityMultiplier = intensityMap[traumaResponsePatterns.dominant4F.intensity] || 1.0;
      
      // If the current multiplier from grief is lower, use the trauma multiplier
      if (intensityMultiplier > responseTimeMultiplier) {
        responseTimeMultiplier = intensityMultiplier;
      }
      
      // Add extra time for hybrid responses (multiple strong patterns)
      if (traumaResponsePatterns.secondary4F) {
        responseTimeMultiplier += 0.1;
      }
    }
    
    // For all other cases, use the regular processing pipeline
    updateStage();
    return baseProcessUserMessage(
      userInput,
      responseGenerator,
      detectConcerns,
      responseTimeMultiplier // Pass the multiplier to adjust response time
    );
  };
  
  // Helper function to extract pet type from user message
  const extractPetType = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('dog')) return 'dog';
    if (lowerMessage.includes('puppy')) return 'puppy';
    if (lowerMessage.includes('cat')) return 'cat';
    if (lowerMessage.includes('kitten')) return 'kitten';
    if (lowerMessage.includes('bird')) return 'bird';
    if (lowerMessage.includes('fish')) return 'fish';
    if (lowerMessage.includes('hamster')) return 'hamster';
    if (lowerMessage.includes('guinea pig')) return 'guinea pig';
    if (lowerMessage.includes('rabbit')) return 'rabbit';
    if (lowerMessage.includes('horse')) return 'horse';
    
    return 'pet'; // Default if no specific pet type is mentioned
  };
  
  // Helper function to extract location information from user messages
  const extractUserLocation = (currentInput: string, history: string[]): { city?: string; state?: string } | undefined => {
    // Check the current message for location data
    let locationData = extractPossibleLocation(currentInput);
    
    // If no location found in current message, check history
    if (!locationData && history.length > 0) {
      for (let i = history.length - 1; i >= 0; i--) {
        locationData = extractPossibleLocation(history[i]);
        if (locationData) break;
      }
    }
    
    return locationData;
  };
  
  // Helper function to extract location from text (simplified version)
  const extractPossibleLocation = (text: string): { state?: string; city?: string } | undefined => {
    if (!text) return undefined;
    
    try {
      // Try to use the existing function from messageUtils
      const messageUtils = require('../utils/messageUtils');
      if (messageUtils.extractPossibleLocation) {
        return messageUtils.extractPossibleLocation(text);
      }
    } catch (e) {
      console.log("Error using messageUtils for location extraction:", e);
    }
    
    // Fallback implementation
    const lowerText = text.toLowerCase();
    
    // Simple check for Cleveland specifically
    if (lowerText.includes('cleveland')) {
      return { city: 'Cleveland', state: 'Ohio' };
    }
    
    return undefined;
  };
  
  // Helper function to detect potential wealth indicators in conversation
  const detectWealthIndicators = (currentInput: string, history: string[]): boolean => {
    const wealthKeywords = [
      'executive', 'ceo', 'cfo', 'board', 'investor', 'investment', 
      'portfolio', 'stocks', 'broker', 'luxury', 'private', 'exclusive', 'high-end', 
      'premium', 'estate', 'mansion', 'yacht', 'jet', 'assistant', 
      'secretary', 'staff', 'wealth manager', 'family office'
    ];
    
    const combinedText = [currentInput, ...history].join(' ').toLowerCase();
    
    return wealthKeywords.some(keyword => combinedText.includes(keyword));
  };
  
  return {
    isTyping,
    processUserMessage,
    simulateTypingResponse,
    currentApproach,
    handlePotentialDeception
  };
};

export default useRogerianResponse;
