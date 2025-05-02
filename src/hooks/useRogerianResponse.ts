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

// Import generateSmallTalkResponse directly from smallTalkUtils
import { generateSmallTalkResponse } from '../utils/conversation/smallTalkUtils';

interface UseRogerianResponseReturn {
  isTyping: boolean;
  processUserMessage: (userInput: string) => Promise<MessageType>;
  simulateTypingResponse: (response: string, callback: (text: string) => void) => void;
  currentApproach: 'rogerian' | 'mi' | 'existential' | 'conversational' | 'socratic';
  handlePotentialDeception?: (originalMessage: string, followUpMessage: string) => Promise<MessageType | null>;
}

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
  
  // Process user message with stage update and special cases
  const processUserMessage = async (userInput: string): Promise<MessageType> => {
    // Update conversation history and client preferences
    updateConversationHistory(userInput);
    
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
          () => 'pet-illness' // Special concern type for pet illness
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
    if (concernType && 
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
    
    // Update conversation stage before processing
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
      'portfolio', 'luxury', 'private', 'exclusive', 'high-end', 
      'premium', 'estate', 'mansion', 'yacht', 'jet', 'assistant', 
      'secretary', 'staff', 'wealth manager', 'family office'
    ];
    
    const combinedText = [currentInput, ...history].join(' ').toLowerCase();
    
    return wealthKeywords.some(keyword => combinedText.includes(keyword));
  };
  
  // Helper function to create a message (duplicated from messageUtils to avoid circular imports)
  const createMessage = (
    text: string, 
    sender: 'user' | 'roger', 
    concernType: any = null
  ): MessageType => {
    return {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
      concernType,
      locationData: null
    };
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
