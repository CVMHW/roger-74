
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

    // Medium level indicators - ELEVATED CONCERN  
    const mediumIndicators = [
      /\b(overwhelmed|can't cope|struggling badly)\b/i,
      /\b(severely depressed|deeply sad|empty inside)\b/i,
      /\b(everything is falling apart|nothing matters)\b/i,
      /\b(no hope|no future|no point)\b/i
    ];

    // Low level indicators - CONCERN
    const lowIndicators = [
      /\b(sad|down|depressed|anxious|worried|stressed)\b/i,
      /\b(difficult time|hard time|struggling)\b/i,
      /\b(feeling terrible|feeling awful|feeling bad)\b/i
    ];

    // Check in order of severity - ANY match triggers crisis response
    for (const pattern of criticalIndicators) {
      if (pattern.test(input)) {
        console.log("CRISIS DETECTION: CRITICAL level detected");
        return 'critical';
      }
    }
    
    for (const pattern of highIndicators) {
      if (pattern.test(input)) {
        console.log("CRISIS DETECTION: HIGH level detected");
        return 'high';
      }
    }
    
    for (const pattern of mediumIndicators) {
      if (pattern.test(input)) {
        console.log("CRISIS DETECTION: MEDIUM level detected");
        return 'medium';
      }
    }
    
    for (const pattern of lowIndicators) {
      if (pattern.test(input)) {
        console.log("CRISIS DETECTION: LOW level detected");
        return 'low';
      }
    }

    return 'low'; // Default for safety
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
    
    if (/\b(anorexia|bulimia|binge|purge|starve|eating disorder)\b/.test(input)) {
      return 'eating-disorder';
    }
    
    if (/\b(addicted|overdose|can't stop drinking|need.*drugs)\b/.test(input)) {
      return 'substance-use';
    }
    
    if (/\b(voices|hallucinations|paranoid|delusions)\b/.test(input)) {
      return 'psychosis';
    }
    
    return 'general-crisis';
  }, []);

  const generateCrisisResponse = useCallback((crisisType: string, severity: string, userInput: string, locationInfo: any): string => {
    console.log(`CRISIS RESPONSE: Generating for ${crisisType} at ${severity} level`);
    
    // Base response for all levels
    let response = "I'm very concerned about what you're sharing";
    
    if (severity === 'critical') {
      response = `🚨 **This sounds extremely serious, and I'm very concerned about your safety.**

**Please take immediate action:**
• **Call 911** if you're in immediate danger
• **Call or text 988** for the Suicide & Crisis Lifeline (24/7)  
• **Go to your nearest emergency room** right away
• **Call a trusted friend or family member** to stay with you`;
    } else if (severity === 'high') {
      response = "I'm very concerned about what you're sharing. This sounds serious, and it's important you speak with a crisis professional right away. Please call the 988 Suicide & Crisis Lifeline (call or text 988) immediately, or go to your nearest emergency room.";
    } else {
      response = "I'm concerned about what you're sharing. It sounds like you're going through a really difficult time. While I want to support you, it's important that you also have access to professional crisis support. The 988 Suicide & Crisis Lifeline is available 24/7 if you need someone to talk to immediately.";
    }
    
    // Add Cleveland/Ohio specific resources
    if (locationInfo && (locationInfo.region === 'Ohio' || locationInfo.city === 'Cleveland')) {
      response += `

For immediate local support in your area, Cuyahoga County Mobile Crisis is available at 1-216-623-6555.`;
      
      if (crisisType === 'eating-disorder') {
        response += `

**Cleveland Emily Program: 1-888-272-0836** (eating disorder crisis support)`;
      }
    }
    
    response += `

You don't have to face this alone. Help is available right now, and your life has value.`;
    
    return response;
  }, []);

  // MAIN CRISIS HANDLER - This is called from chat logic
  const handleCrisisMessage = useCallback(async (userInput: string): Promise<MessageType | null> => {
    console.log("CRISIS DETECTION: Analyzing input for crisis content:", userInput);
    
    // Check if this contains ANY crisis indicators
    const crisisLevel = detectCrisisLevel(userInput);
    const crisisType = detectCrisisType(userInput);
    
    console.log(`CRISIS DETECTION: Level=${crisisLevel}, Type=${crisisType}`);
    
    // ALL levels trigger crisis handling now
    const currentTime = Date.now();
    
    // Update crisis tracking
    setRecentCrisisMessage(userInput);
    setConsecutiveCrisisCount(prev => prev + 1);
    lastCrisisTime.current = currentTime;
    
    // Get location data - default to Cleveland for testing
    let locationInfo = {
      city: "Cleveland",
      region: "Ohio", 
      country: "United States"
    };
    
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
        
        locationInfo = {
          ...locationInfo,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        console.log("CRISIS DETECTION: Got geolocation:", locationInfo);
      }
    } catch (error) {
      console.log("CRISIS DETECTION: Using default Cleveland location");
    }
    
    // Generate crisis response
    const crisisResponse = generateCrisisResponse(crisisType, crisisLevel, userInput, locationInfo);
    console.log("CRISIS DETECTION: Generated response, now logging crisis event");
    
    // CRITICAL: Log crisis event - THIS TRIGGERS EMAIL
    try {
      await logCrisisEvent({
        timestamp: new Date().toISOString(),
        sessionId: getCurrentSessionId(),
        userInput,
        crisisType,
        severity: crisisLevel,
        rogerResponse: crisisResponse,
        detectionMethod: 'comprehensive-crisis-detection-all-levels',
        userAgent: navigator.userAgent,
        ipAddress: 'client-side',
        locationInfo,
        clinicalNotes: `Patient expressed ${crisisType} concerns at ${crisisLevel} severity level - IMMEDIATE PROFESSIONAL REVIEW REQUIRED`,
        riskAssessment: generateRiskAssessment(crisisLevel, userInput),
        sessionDuration: calculateSessionDuration(),
        messageCount: consecutiveCrisisCount
      });
      console.log("CRISIS DETECTION: Crisis event logged and email sent successfully");
    } catch (error) {
      console.error('CRISIS DETECTION: Failed to log crisis event:', error);
    }
    
    return createMessage(crisisResponse, 'roger', 'crisis');
  }, [detectCrisisLevel, detectCrisisType, generateCrisisResponse, consecutiveCrisisCount]);

  // Generate risk assessment
  const generateRiskAssessment = (severity: string, userInput: string): string => {
    switch (severity) {
      case 'critical':
        return 'CRITICAL RISK - IMMEDIATE intervention required - Emergency services may be needed';
      case 'high':
        return 'HIGH RISK - URGENT professional assessment needed - Same day intervention required';
      case 'medium':
        return 'MODERATE RISK - Professional evaluation needed within 24 hours';
      case 'low':
        return 'ELEVATED CONCERN - Follow-up recommended within 48 hours';
      default:
        return 'CRISIS DETECTED - Professional review required';
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

**Cuyahoga County Mobile Crisis: 1-216-623-6555**

Your life matters, and there are people trained specifically to help you through this crisis.`;

      return createMessage(persistentResponse, 'roger', 'crisis');
    }
    
    return null;
  }, [consecutiveCrisisCount, detectCrisisLevel]);

  return {
    recentCrisisMessage,
    consecutiveCrisisCount,
    handleCrisisMessage,
    checkDeception,
    handlePersistentCrisis,
    detectCrisisLevel
  };
};
