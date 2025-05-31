
/**
 * Simplified Crisis Detection with GUARANTEED Email Alerts
 * Removes complexity and focuses on reliable detection and notification
 */

import { useState, useCallback } from 'react';
import { MessageType } from '../../components/Message';
import { createMessage } from '../../utils/messageUtils';
import { sendCrisisEmail } from '../../utils/crisis/emailService';

export const useSimplifiedCrisisDetection = () => {
  const [lastCrisisTime, setLastCrisisTime] = useState<number>(0);

  /**
   * Detect crisis content with clear, simple patterns
   */
  const detectCrisis = useCallback((userInput: string): { isCrisis: boolean; severity: string; type: string } => {
    const input = userInput.toLowerCase();
    
    // Critical level - immediate danger
    const criticalPatterns = [
      /\b(kill myself|suicide|suicidal|want to die|end my life|take my life)\b/i,
      /\b(better off dead|no reason to live|end it all)\b/i,
      /\b(plan to die|going to die|tonight|today)\b/i,
      /\b(wana kill|gonna kill|wanna die)\b/i
    ];

    // High level - serious concern
    const highPatterns = [
      /\b(hurt myself|harm myself|cut myself|cutting)\b/i,
      /\b(can't take it|breaking down|falling apart)\b/i,
      /\b(hopeless|worthless|can't go on)\b/i
    ];

    // Check patterns in order of severity
    for (const pattern of criticalPatterns) {
      if (pattern.test(input)) {
        return { isCrisis: true, severity: 'CRITICAL', type: 'suicide' };
      }
    }

    for (const pattern of highPatterns) {
      if (pattern.test(input)) {
        return { isCrisis: true, severity: 'HIGH', type: 'self-harm' };
      }
    }

    return { isCrisis: false, severity: 'NONE', type: 'none' };
  }, []);

  /**
   * Handle crisis with immediate email notification
   */
  const handleCrisis = useCallback(async (userInput: string): Promise<MessageType | null> => {
    const crisisResult = detectCrisis(userInput);
    
    if (!crisisResult.isCrisis) {
      return null;
    }

    console.log("🚨 CRISIS DETECTED:", crisisResult);
    
    const currentTime = Date.now();
    setLastCrisisTime(currentTime);

    // Generate crisis response
    const crisisResponse = getCrisisResponse(crisisResult.severity, crisisResult.type);
    
    // Send email immediately - NO COMPLEX ERROR HANDLING, JUST SEND
    const emailData = {
      userMessage: userInput,
      severity: crisisResult.severity,
      crisisType: crisisResult.type,
      timestamp: new Date().toISOString(),
      sessionId: `session_${Date.now()}`
    };

    console.log("📧 Sending crisis email NOW...");
    
    // Send email without waiting for response to avoid blocking
    sendCrisisEmail(emailData).then(result => {
      if (result.success) {
        console.log("✅ Crisis email sent successfully");
      } else {
        console.error("❌ Crisis email failed:", result.error);
      }
    }).catch(error => {
      console.error("❌ Crisis email error:", error);
    });

    return createMessage(crisisResponse, 'roger', 'crisis');
  }, [detectCrisis]);

  return {
    handleCrisis,
    detectCrisis
  };
};

/**
 * Get appropriate crisis response based on severity
 */
const getCrisisResponse = (severity: string, type: string): string => {
  if (severity === 'CRITICAL') {
    return `🚨 **I'm extremely concerned about your safety right now.**

**Please take immediate action:**
• **Call 911** if you're in immediate danger
• **Call or text 988** for the Suicide & Crisis Lifeline (24/7)
• **Go to your nearest emergency room** immediately
• **Call Cuyahoga County Mobile Crisis: 1-216-623-6555**

You don't have to face this alone. Help is available right now, and your life has value.`;
  }

  if (severity === 'HIGH') {
    return `I'm very concerned about what you're sharing. This sounds serious.

**Please reach out for help:**
• **Call or text 988** for the Suicide & Crisis Lifeline
• **Cuyahoga County Mobile Crisis: 1-216-623-6555**
• **Go to your nearest emergency room** if you feel unsafe

Your safety is important. Please don't wait to get help.`;
  }

  return `I'm here to listen and support you. If you're having thoughts of hurting yourself, please call 988 for immediate help.`;
};
