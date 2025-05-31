
/**
 * Enhanced Crisis Detection Hook with GUARANTEED EmailJS Integration
 * COMPREHENSIVE CLINICAL DOCUMENTATION FOR ALL SEVERITY LEVELS
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { MessageType } from '../../components/Message';
import { createMessage } from '../../utils/messageUtils';
import { logCrisisEvent, getCurrentSessionId } from '../../utils/crisis/crisisAuditLogger';
import { sendCrisisEmailAlert } from '../../utils/crisis/emailNotificationService';

export const useCrisisDetection = (
  simulateTypingResponse: (text: string, onComplete: (text: string) => void) => void,
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>
) => {
  const [recentCrisisMessage, setRecentCrisisMessage] = useState<string | null>(null);
  const [consecutiveCrisisCount, setConsecutiveCrisisCount] = useState(0);
  const [refusalHistory, setRefusalHistory] = useState<string[]>([]);
  const lastCrisisTime = useRef<number>(0);

  // COMPREHENSIVE crisis detection for ALL severity levels
  const detectCrisisLevel = useCallback((userInput: string): 'low' | 'medium' | 'high' | 'critical' => {
    const input = userInput.toLowerCase();
    
    // CRITICAL level indicators - IMMEDIATE INTERVENTION
    const criticalIndicators = [
      /\b(kill myself|suicide|suicidal|want to die|end my life|take my life|wana kill|gonna kill)\b/i,
      /\b(better off dead|no reason to live|can't go on|end it all)\b/i,
      /\b(plan to die|going to die|ready to die|tonight|today)\b/i,
      /\b(overdose|pills to die|hanging myself|jumping off|gun|razor)\b/i
    ];

    // HIGH level indicators - SERIOUS CONCERN
    const highIndicators = [
      /\b(hurt myself|harm myself|cut myself|cutting|self.harm)\b/i,
      /\b(don't want to live|life isn't worth|hopeless|worthless)\b/i,
      /\b(can't take it anymore|breaking down|falling apart)\b/i,
      /\b(thoughts of death|thinking about dying|death thoughts)\b/i
    ];

    // MEDIUM level indicators - MODERATE CONCERN  
    const mediumIndicators = [
      /\b(depressed|depression|anxious|anxiety|overwhelmed)\b/i,
      /\b(struggling|difficult|hard time|tough time)\b/i,
      /\b(sad|upset|down|low|empty)\b/i
    ];

    // Check in order of severity
    for (const pattern of criticalIndicators) {
      if (pattern.test(input)) {
        console.log("🚨 CRISIS DETECTION: CRITICAL level detected");
        return 'critical';
      }
    }
    
    for (const pattern of highIndicators) {
      if (pattern.test(input)) {
        console.log("🚨 CRISIS DETECTION: HIGH level detected");
        return 'high';
      }
    }

    for (const pattern of mediumIndicators) {
      if (pattern.test(input)) {
        console.log("🚨 CRISIS DETECTION: MEDIUM level detected");
        return 'medium';
      }
    }
    
    return 'low';
  }, []);

  // Detect specific crisis type
  const detectCrisisType = useCallback((userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (/\b(suicide|kill myself|want to die|end my life|take my life|wana kill|gonna kill)\b/.test(input)) {
      return 'suicide';
    }
    if (/\b(cut myself|hurt myself|self.harm|cutting|harm myself)\b/.test(input)) {
      return 'self-harm';
    }
    if (/\b(eating|food|binge|purge|vomit|starv)\b/.test(input)) {
      return 'eating-disorder';
    }
    if (/\b(drink|alcohol|drug|substance|high|overdose)\b/.test(input)) {
      return 'substance-use';
    }
    
    return 'general-crisis';
  }, []);

  // Get comprehensive geolocation data
  const getLocationData = useCallback(async () => {
    let locationInfo = {
      city: "Cleveland",
      region: "Ohio", 
      country: "United States",
      coordinates: { latitude: 41.45226, longitude: -81.70314 }
    };
    
    try {
      if (navigator.geolocation) {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            resolve, 
            reject, 
            { timeout: 5000, enableHighAccuracy: true }
          );
        });
        
        locationInfo.coordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        
        console.log("🚨 CRISIS DETECTION: Got accurate geolocation:", locationInfo.coordinates);
      }
    } catch (error) {
      console.log("🚨 CRISIS DETECTION: Using default Cleveland location");
    }
    
    return locationInfo;
  }, []);

  // Generate appropriate crisis response based on severity
  const generateCrisisResponse = useCallback((crisisType: string, severity: string, userInput: string): string => {
    console.log(`🚨 CRISIS RESPONSE: Generating for ${crisisType} at ${severity} level`);
    
    if (severity === 'critical' || crisisType === 'suicide') {
      return `🚨 **This sounds extremely serious, and I'm very concerned about your safety.**

**Please take immediate action:**
• **Call 911** if you're in immediate danger
• **Call or text 988** for the Suicide & Crisis Lifeline (24/7)  
• **Go to your nearest emergency room** right away
• **Call a trusted friend or family member** to stay with you

For immediate local support in your area, Cuyahoga County Mobile Crisis is available at 1-216-623-6555.

You don't have to face this alone. Help is available right now, and your life has value.`;
    }
    
    if (severity === 'high') {
      return `I'm very concerned about what you're sharing. This sounds serious, and it's important you speak with a crisis professional right away.

**Please consider these resources:**
• **Call or text 988** for the Suicide & Crisis Lifeline
• **Cuyahoga County Mobile Crisis: 1-216-623-6555**
• **Go to your nearest emergency room** if you feel unsafe

Would you like me to provide additional local resources?`;
    }
    
    if (severity === 'medium') {
      return `I hear that you're going through a difficult time. It's important to have support when you're struggling.

**Resources available to you:**
• **Call or text 988** if you need immediate support
• **Cuyahoga County Mobile Crisis: 1-216-623-6555**
• Consider reaching out to a counselor or therapist

How long have you been feeling this way?`;
    }
    
    return `Thank you for sharing that with me. It sounds like you're dealing with some challenges. Would you like to talk more about what's been going on?`;
  }, []);

  // Generate risk assessment
  const generateRiskAssessment = (severity: string, userInput: string): string => {
    if (severity === 'critical') {
      return 'CRITICAL RISK - IMMEDIATE intervention required - Emergency services may be needed';
    }
    if (severity === 'high') {
      return 'HIGH RISK - Professional assessment required within 24 hours';
    }
    if (severity === 'medium') {
      return 'MODERATE RISK - Professional follow-up recommended within 72 hours';
    }
    return 'LOW RISK - Monitoring recommended';
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

  // MAIN CRISIS HANDLER - This handles ALL severity levels and SENDS EMAILS
  const handleCrisisMessage = useCallback(async (userInput: string): Promise<MessageType | null> => {
    console.log("🚨 CRISIS DETECTION: Analyzing input for crisis content:", userInput);
    
    // Detect crisis level and type
    const crisisLevel = detectCrisisLevel(userInput);
    const crisisType = detectCrisisType(userInput);
    
    console.log(`🚨 CRISIS DETECTION: Level=${crisisLevel}, Type=${crisisType}`);
    
    // ALL levels (medium, high, critical) trigger crisis handling and email alerts
    if (crisisLevel === 'medium' || crisisLevel === 'high' || crisisLevel === 'critical') {
      const currentTime = Date.now();
      
      // Update crisis tracking
      setRecentCrisisMessage(userInput);
      setConsecutiveCrisisCount(prev => prev + 1);
      lastCrisisTime.current = currentTime;
      
      // Get comprehensive location data
      const locationInfo = await getLocationData();
      
      // Generate crisis response
      const crisisResponse = generateCrisisResponse(crisisType, crisisLevel, userInput);
      console.log("🚨 CRISIS DETECTION: Generated response, now sending email");
      
      // Comprehensive crisis data for email and audit
      const crisisData = {
        timestamp: new Date().toISOString(),
        sessionId: getCurrentSessionId(),
        crisisType,
        severity: crisisLevel,
        userMessage: userInput,
        rogerResponse: crisisResponse,
        locationInfo,
        clinicalNotes: `${crisisLevel.toUpperCase()} severity ${crisisType} presentation - Professional review required`,
        riskAssessment: generateRiskAssessment(crisisLevel, userInput),
        userAgent: navigator.userAgent,
        detectionMethod: 'comprehensive-crisis-detection-all-levels',
        sessionDuration: calculateSessionDuration()
      };
      
      console.log("🚨 CRISIS EMAIL: Sending crisis alert with data:", crisisData);
      
      // Send email immediately - THIS IS THE CRITICAL FIX
      try {
        const emailSent = await sendCrisisEmailAlert(crisisData);
        
        if (emailSent) {
          console.log("✅ CRISIS EMAIL: Successfully sent crisis alert!");
        } else {
          console.error("❌ CRISIS EMAIL: Failed to send crisis alert!");
        }
      } catch (error) {
        console.error("❌ CRISIS EMAIL: Error sending crisis alert:", error);
      }
      
      // Log to audit system
      try {
        await logCrisisEvent({
          timestamp: crisisData.timestamp,
          sessionId: crisisData.sessionId,
          userInput: crisisData.userMessage,
          crisisType: crisisData.crisisType,
          severity: crisisData.severity,
          rogerResponse: crisisData.rogerResponse,
          detectionMethod: crisisData.detectionMethod,
          userAgent: crisisData.userAgent,
          ipAddress: 'client-side',
          locationInfo: crisisData.locationInfo,
          clinicalNotes: crisisData.clinicalNotes,
          riskAssessment: crisisData.riskAssessment,
          sessionDuration: crisisData.sessionDuration,
          messageCount: consecutiveCrisisCount
        });
      } catch (error) {
        console.error('🚨 CRISIS DETECTION: Failed to log crisis event:', error);
      }
      
      return createMessage(crisisResponse, 'roger', 'crisis');
    }

    return null;
  }, [detectCrisisLevel, detectCrisisType, generateCrisisResponse, consecutiveCrisisCount, getLocationData]);

  // Handle deception detection
  const checkDeception = useCallback((followUpMessage: string): boolean => {
    if (!recentCrisisMessage) return false;
    
    const deceptionPatterns = [
      /just kidding/i,
      /was just joking/i,
      /didn'?t mean it/i,
      /not serious/i,
      /was testing/i,
      /lol/i,
      /jk/i,
      /joke/i
    ];
    
    const timeSinceLastCrisis = Date.now() - lastCrisisTime.current;
    const isQuickFollowUp = timeSinceLastCrisis < 60000;
    
    const isDeception = isQuickFollowUp && deceptionPatterns.some(pattern => pattern.test(followUpMessage));
    
    if (isDeception) {
      console.log("🚨 CRISIS DECEPTION: Deception detected after crisis message");
      setRefusalHistory(prev => [...prev, `DECEPTION DETECTED: "${followUpMessage}" after crisis message "${recentCrisisMessage}"`]);
    }
    
    return isDeception;
  }, [recentCrisisMessage]);

  // Handle persistent crisis
  const handlePersistentCrisis = useCallback((userInput: string): MessageType | null => {
    if (consecutiveCrisisCount >= 2) {
      const persistentResponse = `I continue to be very concerned about your safety. You've shared several concerning messages, and I want to make sure you get the immediate help you need.

**Please take action now:**
• **Call 911** if you're in immediate danger
• **Call or text 988** for immediate crisis support
• **Go to your nearest emergency room**

**Cuyahoga County Mobile Crisis: 1-216-623-6555**

Your life matters, and there are people trained specifically to help you through this crisis.`;

      return createMessage(persistentResponse, 'roger', 'crisis');
    }
    
    return null;
  }, [consecutiveCrisisCount]);

  return {
    recentCrisisMessage,
    consecutiveCrisisCount,
    handleCrisisMessage,
    checkDeception,
    handlePersistentCrisis,
    detectCrisisLevel
  };
};
