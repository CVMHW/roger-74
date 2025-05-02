import { useState, useEffect, useCallback } from 'react';
import { MessageType } from '../components/Message';
import useTypingEffect from './useTypingEffect';
import useAdaptiveResponse from './useAdaptiveResponse';
import { useConcernDetection } from './response/concernDetection';
import { useConversationStage } from './response/conversationStageManager';
import { useResponseCompliance } from './response/responseCompliance';
import { useResponseGenerator } from './response/responseGenerator';
import { useResponseProcessing } from './response/responseProcessing';
import { createMessage } from '../utils/messageUtils';
import { explainInpatientProcess } from '../utils/safetyConcernManager';
import { useAlternativeResponseGenerator } from './response/alternativeResponseGenerator';
import { useFeedbackLoopHandler } from './response/feedbackLoopHandler';
import { ConcernType } from '../utils/reflection/reflectionTypes';
import { DeceptionAnalysis } from '../utils/detectionUtils/deceptionDetection';
import { detectWealthIndicators, extractPetType } from '../utils/helpers/userInfoUtils';
import { extractUserLocation } from '../utils/context/conversationContext';
import { generateContextAcknowledgmentResponse } from '../utils/context/conversationContext';
import { 
  generateWeatherRelatedResponse, 
  generateCulturalAdjustmentResponse,
  createMildGamblingResponse,
  createTraumaResponseMessage,
  createSadnessResponse,
  generateSafetyConcernResponse
} from '../utils/response/specialConcernResponses';

interface UseRogerianResponseReturn {
  isTyping: boolean;
  processUserMessage: (userInput: string) => Promise<MessageType>;
  simulateTypingResponse: (response: string, callback: (text: string) => void) => void;
  currentApproach: 'rogerian' | 'mi' | 'existential' | 'conversational' | 'socratic';
  handlePotentialDeception?: (originalMessage: string, followUpMessage: string) => Promise<MessageType | null>;
}

const useRogerianResponse = (): UseRogerianResponseReturn => {
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
  
  // Import all necessary hooks
  const { generateAdaptiveResponse, currentApproach } = useAdaptiveResponse();
  const { detectConcerns } = useConcernDetection();
  const { 
    previousResponses, 
    ensureResponseCompliance, 
    addToResponseHistory,
    setPreviousResponses 
  } = useResponseCompliance();
  const { calculateResponseTime, simulateTypingResponse } = useTypingEffect();
  const { generateAlternativeResponse, isResponseRepetitive } = useAlternativeResponseGenerator();
  const { checkForFeedbackLoopComplaints, handleFeedbackLoop } = useFeedbackLoopHandler();
  
  // Hook for response generation
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
  
  // Update conversation history when user messages are received
  const updateConversationHistory = (userInput: string) => {
    setConversationHistory(prev => {
      const newHistory = [...prev, userInput];
      // Keep last 10 messages for context
      return newHistory.length > 10 ? newHistory.slice(-10) : newHistory;
    });
    
    // Update detected client preferences
    const { detectClientPreferences } = require('../utils/conversationalUtils');
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
  
  // Specialized response generator for safety concerns
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
  
  // Process user message with stage update and special cases
  const processUserMessage = async (userInput: string): Promise<MessageType> => {
    // Update conversation history and client preferences
    updateConversationHistory(userInput);
    
    // Check if the user is indicating Roger isn't listening or is stuck in a loop
    const feedbackLoopResponse = handleFeedbackLoop(userInput, conversationHistory);
    if (feedbackLoopResponse) {
      // Update conversation stage
      updateStage();
      
      // Create a message with the recovery response
      return Promise.resolve(createMessage(feedbackLoopResponse, 'roger'));
    }
    
    // HIGHEST PRIORITY: Check for sarcasm or frustration directed at Roger
    const { detectSarcasm, generateSarcasmResponse, detectContentConcerns } = require('../utils/conversationEnhancement/emotionalInputHandler');
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
    
    // Check for weather-related concerns
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
      const context = require('../utils/conversationEnhancement/repetitionDetector').extractConversationContext(userInput, conversationHistory);
      
      if (context.hasContext) {
        const culturalResponse = generateCulturalAdjustmentResponse(userInput);
        
        // Update conversation stage
        updateStage();
        
        // Return a culturally sensitive response
        return Promise.resolve(createMessage(culturalResponse, 'roger', 'cultural-adjustment'));
      }
    }
    
    // After any feedback loop detection, check if we have specific context to acknowledge
    if (conversationHistory.length >= 2) {
      const context = require('../utils/conversationEnhancement/repetitionDetector').extractConversationContext(userInput, conversationHistory);
      
      if (context.hasContext && 
          (context.locations.length > 0 || context.topics.length >= 2 || context.keyPhrases.length > 0) &&
          Math.random() < 0.7) { // 70% chance to use context-aware response when applicable
        
        const contextResponse = generateContextAcknowledgmentResponse(userInput, conversationHistory);
        
        // Update conversation stage
        updateStage();
        
        // Return a context-specific response
        return Promise.resolve(createMessage(contextResponse, 'roger'));
      }
    }
    
    // Check for repeated user concerns that aren't being addressed
    if (conversationHistory.length >= 2) {
      const { detectRepetition, generateRepetitionAcknowledgment } = require('../utils/conversationEnhancement/emotionalInputHandler');
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
    const { detectSimpleNegativeState, generateSimpleNegativeStateResponse } = require('../utils/conversationalUtils');
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
    const { detectPoliticalEmotions, generatePoliticalEmotionResponse } = require('../utils/conversationalUtils');
    const politicalInfo = detectPoliticalEmotions(userInput);
    if (politicalInfo.isPolitical) {
      updateStage();
      
      // Process with political emotion response
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
    const { detectGriefThemes } = require('../utils/response/griefSupport');
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
  
  return {
    isTyping,
    processUserMessage,
    simulateTypingResponse,
    currentApproach,
    handlePotentialDeception
  };
};

export default useRogerianResponse;
