
/**
 * Enhanced Crisis Detection Hook with Comprehensive Email Integration
 * ALL SEVERITY LEVELS NOW TRIGGER EMAIL NOTIFICATIONS
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

  // ALL levels now trigger email notifications - no more "none" filtering
  const detectCrisisLevel = useCallback((userInput: string): 'low' | 'medium' | 'high' | 'critical' => {
    const input = userInput.toLowerCase();
    
    // Critical level indicators
    const criticalIndicators = [
      /i am going to (kill myself|end my life|commit suicide)/,
      /i have a plan to (die|kill myself|end it)/,
      /i'm going to hurt myself (today|tonight|now)/,
      /i have pills.*(?:take them all|overdose)/,
      /kill myself|suicide|suicidal/,
      /want to die/,
      /end my life/,
      /better off dead/
    ];

    // High level indicators
    const highIndicators = [
      /want to (hurt|cut|harm) myself/,
      /thinking about.*cutting/,
      /urge to.*harm.*myself/,
      /can't take it anymore/,
      /don'?t want to (live|be alive|exist)/,
      /life.*not worth living/,
      /everyone.*better.*without me/
    ];

    // Medium level indicators
    const mediumIndicators = [
      /haven'?t eaten.*days/,
      /need.*more.*drugs/,
      /can'?t stop.*drinking/,
      /voices.*telling me/,
      /seeing things.*aren'?t there/,
      /hopeless|worthless|empty|numb/,
      /thoughts of death/,
      /feeling terrible|awful|horrible/
    ];

    // Low level indicators
    const lowIndicators = [
      /struggling|difficult|hard time/,
      /overwhelmed|stressed/,
      /sad|down|depressed/,
      /anxious|worried/,
      /can't cope/
    ];

    // Check in order of severity
    if (criticalIndicators.some(pattern => pattern.test(input))) {
      return 'critical';
    }
    if (highIndicators.some(pattern => pattern.test(input))) {
      return 'high';
    }
    if (mediumIndicators.some(pattern => pattern.test(input))) {
      return 'medium';
    }
    if (lowIndicators.some(pattern => pattern.test(input))) {
      return 'low';
    }

    return 'low'; // Default to low for any concerning content
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
    
    return 'general-crisis'; // Default crisis type
  }, []);

  const generateCrisisResponse = useCallback((crisisType: string, severity: string, userInput: string, locationInfo: any): string => {
    // Generate severity-appropriate responses with location-specific referrals
    switch (severity) {
      case 'critical':
        let response = `🚨 **This sounds extremely serious, and I'm very concerned about your safety.** **Please take immediate action:** • **Call 911** if you're in immediate danger • **Call or text 988** for the Suicide & Crisis Lifeline (24/7) • **Go to your nearest emergency room** right away • **Call a trusted friend or family member** to stay with you`;
        
        if (locationInfo && (locationInfo.region === 'Ohio' || locationInfo.city === 'Cleveland')) {
          response += ` • **Cuyahoga County Mobile Crisis: 1-216-623-6555** (immediate local support)`;
          if (crisisType === 'eating-disorder') {
            response += ` • **Cleveland Emily Program: 1-888-272-0836** (eating disorder crisis support)`;
          }
        }
        
        response += ` You don't have to face this alone. Help is available right now, and your life has value.`;
        return response;

      case 'high':
        let highResponse = `I'm very concerned about what you're sharing. This sounds serious, and it's important you speak with a crisis professional right away. Please call the 988 Suicide & Crisis Lifeline (call or text 988) immediately, or go to your nearest emergency room.`;
        
        if (locationInfo && (locationInfo.region === 'Ohio' || locationInfo.city === 'Cleveland')) {
          highResponse += ` For immediate local support in your area, Cuyahoga County Mobile Crisis is available at 1-216-623-6555.`;
        }
        
        return highResponse;

      case 'medium':
        let mediumResponse = `I'm concerned about what you're sharing. It sounds like you're going through a really difficult time. While I want to support you, it's important that you also have access to professional crisis support. The 988 Suicide & Crisis Lifeline is available 24/7 if you need someone to talk to immediately.`;
        
        if (locationInfo && (locationInfo.region === 'Ohio' || locationInfo.city === 'Cleveland')) {
          mediumResponse += ` For local support, you can also reach Cuyahoga County Mobile Crisis at 1-216-623-6555.`;
        }
        
        return mediumResponse;

      case 'low':
        return `I hear that you're struggling right now. That takes courage to share. While I'm here to support you, it's important to know that professional help is always available. The 988 Suicide & Crisis Lifeline is there 24/7 if you need someone to talk to. You don't have to go through this alone.`;

      default:
        return `I want to make sure you have access to professional support. The 988 Suicide & Crisis Lifeline is available 24/7 for immediate help.`;
    }
  }, []);

  const handleCrisisMessage = useCallback(async (userInput: string): Promise<MessageType | null> => {
    console.log("CRISIS DETECTION: Analyzing input for ALL severity levels:", userInput);
    
    const crisisLevel = detectCrisisLevel(userInput);
    console.log("CRISIS DETECTION: Level detected:", crisisLevel);
    
    // ALL levels now get crisis handling and email notifications
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
    
    // Generate appropriate crisis response with severity and location awareness
    const crisisResponse = generateCrisisResponse(crisisType, crisisLevel, userInput, locationInfo);
    console.log("CRISIS DETECTION: Generated response");
    
    // Log crisis event with comprehensive data - ALL LEVELS GET LOGGED AND EMAILED
    try {
      console.log("CRISIS DETECTION: Logging crisis event for level:", crisisLevel);
      await logCrisisEvent({
        timestamp: new Date().toISOString(),
        sessionId: getCurrentSessionId(),
        userInput,
        crisisType,
        severity: crisisLevel, // Use actual detected level
        rogerResponse: crisisResponse,
        detectionMethod: 'comprehensive-multi-level-crisis-detection-with-location',
        userAgent: navigator.userAgent,
        locationInfo,
        clinicalNotes: `Patient expressed ${crisisType} concerns at ${crisisLevel} severity level - professional review required`,
        riskAssessment: generateRiskAssessment(crisisLevel, userInput),
        sessionDuration: calculateSessionDuration(),
        messageCount: consecutiveCrisisCount
      });
      console.log("CRISIS DETECTION: Crisis event logged and emailed successfully");
    } catch (error) {
      console.error('CRISIS DETECTION: Failed to log crisis event:', error);
    }
    
    return createMessage(crisisResponse, 'roger', 'crisis');
  }, [detectCrisisLevel, detectCrisisType, generateCrisisResponse, consecutiveCrisisCount]);

  // Generate risk assessment based on severity
  const generateRiskAssessment = (severity: string, userInput: string): string => {
    switch (severity) {
      case 'critical':
        return 'CRITICAL RISK - Immediate intervention required - consider involuntary hold if imminent risk';
      case 'high':
        return 'HIGH RISK - Urgent professional assessment needed - close monitoring required';
      case 'medium':
        return 'MODERATE RISK - Professional evaluation recommended - safety planning needed';
      case 'low':
        return 'ELEVATED CONCERN - Follow-up recommended - monitoring and support indicated';
      default:
        return 'BASELINE CONCERN - Standard crisis protocols apply';
    }
  };

  // Calculate session duration
  const calculateSessionDuration = (): string => {
    const sessionStart = sessionStorage.getItem('session_start_time');
    if (sessionStart) {
      const duration = Date.now() - parseInt(sessionStart);
      const minutes = Math.floor(duration / 60000);
      const seconds = Math.floor((duration % 60000) / 1000);
      return `${minutes}m ${seconds}s`;
    }
    return 'Unknown';
  };

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
      
      const persistentResponse = `I continue to be very concerned about your safety. You've shared several concerning messages, and I want to make sure you get the immediate help you need.

**Please take action now:**
• **Call 911** if you're in immediate danger
• **Call or text 988** for immediate crisis support
• **Go to your nearest emergency room**

**Professional Support:** CVMHW mental health professionals are trained to help with crisis situations and are required by Ohio law to take appropriate action to ensure your safety.

Your life matters, and there are people trained specifically to help you through this crisis.`;

      return createMessage(persistentResponse, 'roger', 'crisis');
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
