
/**
 * Enhanced Crisis Detection Hook with Working EmailJS Integration
 * ALL SEVERITY LEVELS NOW TRIGGER EMAIL NOTIFICATIONS
 */

import { useState, useCallback, useRef } from 'react';
import { MessageType } from '../../components/Message';
import { createMessage } from '../../utils/messageUtils';
import { logCrisisEvent, getCurrentSessionId } from '../../utils/crisis/crisisAuditLogger';

// Import the email service directly
import { sendCrisisEmailAlert, initializeEmailService } from '../../utils/crisis/emailNotificationService';

export const useCrisisDetection = (
  simulateTypingResponse: (text: string, onComplete: (text: string) => void) => void,
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>
) => {
  const [recentCrisisMessage, setRecentCrisisMessage] = useState<string | null>(null);
  const [consecutiveCrisisCount, setConsecutiveCrisisCount] = useState(0);
  const lastCrisisTime = useRef<number>(0);

  // Initialize EmailJS on hook creation
  useState(() => {
    console.log("🚨 CRISIS DETECTION: Initializing EmailJS service");
    initializeEmailService();
  });

  // Enhanced crisis detection that catches ALL concerning content
  const detectCrisisLevel = useCallback((userInput: string): 'low' | 'medium' | 'high' | 'critical' => {
    const input = userInput.toLowerCase();
    
    // Critical level indicators - IMMEDIATE CRISIS
    const criticalIndicators = [
      /\b(kill myself|suicide|suicidal|want to die|end my life|take my life)\b/i,
      /\b(better off dead|no reason to live|can't go on|end it all)\b/i,
      /\b(plan to die|going to die|ready to die)\b/i,
      /\b(overdose|pills to die|hanging myself|jumping off)\b/i
    ];

    // High level indicators - SERIOUS CONCERN
    const highIndicators = [
      /\b(hurt myself|harm myself|cut myself|cutting)\b/i,
      /\b(don't want to live|life isn't worth|hopeless|worthless)\b/i,
      /\b(can't take it anymore|breaking down|falling apart)\b/i,
      /\b(thoughts of death|thinking about dying)\b/i
    ];

    // Check in order of severity - ANY match triggers crisis response
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
    
    // If we got here, it's still concerning enough to treat as critical for safety
    return 'critical';
  }, []);

  // Detect specific crisis type
  const detectCrisisType = useCallback((userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (/\b(suicide|kill myself|want to die|end my life|take my life)\b/.test(input)) {
      return 'suicide';
    }
    
    if (/\b(cut myself|hurt myself|self.harm|cutting|harm myself)\b/.test(input)) {
      return 'self-harm';
    }
    
    return 'suicide'; // Default for safety
  }, []);

  const generateCrisisResponse = useCallback((crisisType: string, severity: string, userInput: string): string => {
    console.log(`🚨 CRISIS RESPONSE: Generating for ${crisisType} at ${severity} level`);
    
    // Always return critical response for safety
    return `🚨 **This sounds extremely serious, and I'm very concerned about your safety.**

**Please take immediate action:**
• **Call 911** if you're in immediate danger
• **Call or text 988** for the Suicide & Crisis Lifeline (24/7)  
• **Go to your nearest emergency room** right away
• **Call a trusted friend or family member** to stay with you

For immediate local support in your area, Cuyahoga County Mobile Crisis is available at 1-216-623-6555.

You don't have to face this alone. Help is available right now, and your life has value.`;
  }, []);

  // MAIN CRISIS HANDLER - This is called from chat logic
  const handleCrisisMessage = useCallback(async (userInput: string): Promise<MessageType | null> => {
    console.log("🚨 CRISIS DETECTION: Analyzing input for crisis content:", userInput);
    
    // Check if this contains ANY crisis indicators
    const crisisLevel = detectCrisisLevel(userInput);
    const crisisType = detectCrisisType(userInput);
    
    console.log(`🚨 CRISIS DETECTION: Level=${crisisLevel}, Type=${crisisType}`);
    
    // ALL levels trigger crisis handling now
    const currentTime = Date.now();
    
    // Update crisis tracking
    setRecentCrisisMessage(userInput);
    setConsecutiveCrisisCount(prev => prev + 1);
    lastCrisisTime.current = currentTime;
    
    // Default location to Cleveland for testing
    const locationInfo = {
      city: "Cleveland",
      region: "Ohio", 
      country: "United States"
    };
    
    let coordinates = { latitude: 0, longitude: 0 };
    
    // Try to get actual location if available
    try {
      if (navigator.geolocation) {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            resolve, 
            reject, 
            { timeout: 3000, enableHighAccuracy: false }
          );
        });
        
        coordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        console.log("🚨 CRISIS DETECTION: Got geolocation:", coordinates);
      }
    } catch (error) {
      console.log("🚨 CRISIS DETECTION: Using default Cleveland location");
    }
    
    // Generate crisis response
    const crisisResponse = generateCrisisResponse(crisisType, crisisLevel, userInput);
    console.log("🚨 CRISIS DETECTION: Generated response, now sending email");
    
    // CRITICAL: Send email notification IMMEDIATELY
    const crisisData = {
      timestamp: new Date().toISOString(),
      sessionId: getCurrentSessionId(),
      crisisType,
      severity: crisisLevel,
      userMessage: userInput,
      rogerResponse: crisisResponse,
      locationInfo: {
        ...locationInfo,
        coordinates
      },
      clinicalNotes: `Patient expressed ${crisisType} concerns at ${crisisLevel} severity level - IMMEDIATE PROFESSIONAL REVIEW REQUIRED`,
      riskAssessment: generateRiskAssessment(crisisLevel, userInput),
      userAgent: navigator.userAgent,
      detectionMethod: 'comprehensive-crisis-detection-all-levels'
    };
    
    console.log("🚨 CRISIS EMAIL: Sending crisis alert with data:", crisisData);
    
    // Send email immediately using the service
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
    
    // Also log to audit system
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
        sessionDuration: calculateSessionDuration(),
        messageCount: consecutiveCrisisCount
      });
    } catch (error) {
      console.error('🚨 CRISIS DETECTION: Failed to log crisis event:', error);
    }
    
    return createMessage(crisisResponse, 'roger', 'crisis');
  }, [detectCrisisLevel, detectCrisisType, generateCrisisResponse, consecutiveCrisisCount]);

  // Generate risk assessment
  const generateRiskAssessment = (severity: string, userInput: string): string => {
    return 'CRITICAL RISK - IMMEDIATE intervention required - Emergency services may be needed';
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
