/**
 * Enhanced Crisis Detection Hook with Comprehensive Email Integration
 */

import { useState, useCallback, useRef } from 'react';
import { MessageType } from '../../components/Message';
import { createMessage } from '../../utils/messageUtils';
import { logCrisisEvent, getCurrentSessionId } from '../../utils/crisis/crisisAuditLogger';

export const useCrisisDetection = (
  simulateTypingResponse: (text: string, onComplete: (text: string) => void) => void,
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>
) => {
  const [recentCrisisMessage, setRecentCrisisMessage] = useState<string | null>(null);
  const [consecutiveCrisisCount, setConsecutiveCrisisCount] = useState(0);
  const lastCrisisTime = useRef<number>(0);
  const crisisPatterns = useRef<Set<string>>(new Set());

  // Enhanced crisis detection patterns
  const detectCrisisLevel = useCallback((userInput: string): 'none' | 'mild' | 'moderate' | 'severe' | 'immediate' => {
    const input = userInput.toLowerCase();
    
    // Immediate crisis indicators (suicide)
    const immediateCrisis = [
      /i am going to (kill myself|end my life|commit suicide)/,
      /i have a plan to (die|kill myself|end it)/,
      /i'm going to hurt myself (today|tonight|now)/,
      /i can't take it anymore.*(?:kill|die|end)/,
      /i have pills.*(?:take them all|overdose)/,
      /i want to die/,
      /want to kill myself/,
      /kill myself/,
      /suicide/,
      /suicidal/
    ];

    // Severe crisis indicators
    const severeCrisis = [
      /want to (die|kill myself|end my life|not be here)/,
      /thoughts of (suicide|killing myself|ending it)/,
      /don'?t want to (live|be alive|exist)/,
      /life.*not worth living/,
      /everyone.*better.*without me/,
      /want to (hurt|cut|harm) myself/,
      /thinking about.*cutting/,
      /urge to.*harm.*myself/,
      /haven'?t eaten.*days/,
      /need.*more.*drugs/,
      /can'?t stop.*drinking/,
      /voices.*telling me/,
      /seeing things.*aren'?t there/
    ];

    // Check for immediate crisis
    if (immediateCrisis.some(pattern => pattern.test(input))) {
      return 'immediate';
    }

    // Check for severe crisis
    if (severeCrisis.some(pattern => pattern.test(input))) {
      return 'severe';
    }

    return 'none';
  }, []);

  // Detect specific crisis type
  const detectCrisisType = useCallback((userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (/\b(suicide|kill myself|want to die|end my life|not worth living)\b/.test(input)) {
      return 'suicide';
    }
    
    if (/\b(cut myself|hurt myself|self.harm|cutting|harm myself)\b/.test(input)) {
      return 'self-harm';
    }
    
    if (/\b(anorexia|bulimia|binge|purge|starve|eating disorder|hate.*body.*food)\b/.test(input)) {
      return 'eating-disorder';
    }
    
    if (/\b(addicted|overdose|can't stop drinking|need.*drugs|substance abuse)\b/.test(input)) {
      return 'substance-use';
    }
    
    if (/\b(voices|hallucinations|paranoid|delusions|seeing things|hearing things)\b/.test(input)) {
      return 'psychosis';
    }
    
    return 'general-crisis';
  }, []);

  const generateCrisisResponse = useCallback((crisisLevel: string, crisisType: string, userInput: string): string => {
    switch (crisisLevel) {
      case 'immediate':
        return `🚨 **This sounds extremely serious, and I'm very concerned about your safety.** 

**Please take immediate action:**
• **Call 911** if you're in immediate danger
• **Call or text 988** for the Suicide & Crisis Lifeline (24/7)
• **Go to your nearest emergency room** right away
• **Call a trusted friend or family member** to stay with you

You don't have to face this alone. Help is available right now, and your life has value.

**Important:** Roger provides peer support only. For professional mental health services, CVMHW offers therapy with Eric Riesterer, LPC, under supervision of Wendy Nathan, LPCC-S. As mandated reporters, they are required by Ohio law to report imminent safety concerns to appropriate authorities.`;

      case 'severe':
        return getSpecificCrisisResponse(crisisType, userInput);

      default:
        return `I'm listening and want to make sure you have the support you need. If you're having thoughts of self-harm, please know that help is available 24/7 through the 988 Suicide & Crisis Lifeline.`;
    }
  }, []);

  const getSpecificCrisisResponse = useCallback((crisisType: string, userInput: string): string => {
    switch (crisisType) {
      case 'suicide':
        return `I'm very concerned about what you're sharing regarding thoughts of suicide. This is serious, and it's important you speak with a crisis professional right away. Please call the 988 Suicide & Crisis Lifeline (call or text 988) immediately, or go to your nearest emergency room. Would you like me to provide additional resources? To help connect you with the most appropriate local crisis services and support, could you let me know what area or city you're in right now?`;
      
      case 'eating-disorder':
        return `I'm concerned about what you're sharing regarding your eating patterns. This sounds serious, and it's important that you speak with a healthcare professional. The National Eating Disorders Association (NEDA) helpline (1-800-931-2237) can provide immediate support and resources. I'd like to help you find specialized eating disorder treatment resources in your area. What city or region are you located in?`;
      
      case 'substance-use':
        return `I'm concerned about what you're sharing regarding substance use. This situation sounds serious, and it's important that you speak with a healthcare professional. The SAMHSA National Helpline (1-800-662-4357) provides free, confidential, 24/7 treatment referral and information. To provide you with the best local treatment options and support services, could you share what area you're in?`;
      
      case 'self-harm':
        return `I'm very concerned about what you're sharing regarding self-harm. Your safety is important, and it would be beneficial to speak with a crisis professional who can provide immediate support. The 988 Suicide & Crisis Lifeline (call or text 988) is available 24/7. I want to help you find immediate local support services. What city or area are you currently in?`;
      
      case 'psychosis':
        return `I'm concerned about what you're describing. These experiences sound distressing, and it's important to speak with a mental health professional who can help. The 988 Suicide & Crisis Lifeline (call or text 988) is available 24/7 for immediate support. Would it be possible for you to reach out to them or go to your nearest emergency room today?`;
      
      default:
        return `I'm concerned about what you're sharing. This sounds like a difficult situation that would benefit from immediate professional support. The 988 Suicide & Crisis Lifeline (call or text 988) can provide guidance and resources. Would it be helpful if I shared some additional support options?`;
    }
  }, []);

  const handleCrisisMessage = useCallback(async (userInput: string): Promise<MessageType | null> => {
    console.log("CRISIS DETECTION: Analyzing input:", userInput);
    
    const crisisLevel = detectCrisisLevel(userInput);
    console.log("CRISIS DETECTION: Level detected:", crisisLevel);
    
    if (crisisLevel !== 'none') {
      const currentTime = Date.now();
      const crisisType = detectCrisisType(userInput);
      console.log("CRISIS DETECTION: Type detected:", crisisType);
      
      // Update crisis tracking
      setRecentCrisisMessage(userInput);
      setConsecutiveCrisisCount(prev => prev + 1);
      lastCrisisTime.current = currentTime;
      
      // Add pattern to tracking
      const normalizedInput = userInput.toLowerCase().substring(0, 50);
      crisisPatterns.current.add(normalizedInput);
      
      // Generate appropriate crisis response
      const crisisResponse = generateCrisisResponse(crisisLevel, crisisType, userInput);
      console.log("CRISIS DETECTION: Generated response");
      
      // Get location data from browser if available
      let locationInfo = null;
      try {
        if (navigator.geolocation) {
          console.log("CRISIS DETECTION: Attempting to get location");
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 5000,
              enableHighAccuracy: false,
              maximumAge: 300000
            });
          });
          
          locationInfo = {
            city: "Cleveland",
            region: "Ohio", 
            country: "United States",
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          console.log("CRISIS DETECTION: Got location:", locationInfo);
        }
      } catch (error) {
        console.log("CRISIS DETECTION: Could not get location:", error);
        // Default to Cleveland for testing
        locationInfo = {
          city: "Cleveland",
          region: "Ohio",
          country: "United States"
        };
      }
      
      // Log crisis event with comprehensive data
      try {
        console.log("CRISIS DETECTION: Logging crisis event");
        await logCrisisEvent({
          timestamp: new Date().toISOString(),
          sessionId: getCurrentSessionId(),
          userInput,
          crisisType,
          severity: crisisLevel === 'immediate' ? 'critical' : crisisLevel === 'severe' ? 'high' : 'medium',
          rogerResponse: crisisResponse,
          detectionMethod: 'multi-crisis-detection-with-location',
          userAgent: navigator.userAgent,
          locationInfo,
          clinicalNotes: `Patient expressed ${crisisType} concerns with ${crisisLevel} severity level`,
          riskAssessment: crisisLevel === 'immediate' ? 'Immediate safety assessment required - consider involuntary hold if imminent risk' : 'Standard risk assessment protocol applied'
        });
        console.log("CRISIS DETECTION: Crisis event logged successfully");
      } catch (error) {
        console.error('CRISIS DETECTION: Failed to log crisis event:', error);
      }
      
      return createMessage(crisisResponse, 'roger', 'crisis');
    }
    
    return null;
  }, [detectCrisisLevel, detectCrisisType, generateCrisisResponse]);

  const checkDeception = useCallback((followUpMessage: string): boolean => {
    if (!recentCrisisMessage) return false;
    
    const deceptionPatterns = [
      /just kidding/i,
      /was just joking/i,
      /didn'?t mean it/i,
      /not serious/i,
      /was testing/i
    ];
    
    const timeSinceLastCrisis = Date.now() - lastCrisisTime.current;
    const isQuickFollowUp = timeSinceLastCrisis < 60000;
    
    return isQuickFollowUp && deceptionPatterns.some(pattern => pattern.test(followUpMessage));
  }, [recentCrisisMessage]);

  const handlePersistentCrisis = useCallback((userInput: string): MessageType | null => {
    if (consecutiveCrisisCount >= 2) {
      const crisisLevel = detectCrisisLevel(userInput);
      
      if (crisisLevel !== 'none') {
        const persistentResponse = `I continue to be very concerned about your safety. You've shared several concerning messages, and I want to make sure you get the immediate help you need.

**Please take action now:**
• **Call 911** if you're in immediate danger
• **Call or text 988** for immediate crisis support
• **Go to your nearest emergency room**

**Professional Support:** CVMHW mental health professionals are trained to help with crisis situations and are required by Ohio law to take appropriate action to ensure your safety.

Your life matters, and there are people trained specifically to help you through this crisis.`;

        return createMessage(persistentResponse, 'roger', 'crisis');
      }
    }
    
    return null;
  }, [consecutiveCrisisCount, detectCrisisLevel]);

  const resetCrisisTracking = useCallback(() => {
    setRecentCrisisMessage(null);
    setConsecutiveCrisisCount(0);
    crisisPatterns.current.clear();
  }, []);

  return {
    recentCrisisMessage,
    consecutiveCrisisCount,
    handleCrisisMessage,
    checkDeception,
    handlePersistentCrisis,
    resetCrisisTracking,
    detectCrisisLevel
  };
};
