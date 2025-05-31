
/**
 * Enhanced Crisis Detection Hook - Updated with CVMHW Legal Integration
 * 
 * Includes awareness of CVMHW mandated reporting requirements
 */

import { useState, useCallback, useRef } from 'react';
import { MessageType } from '../../components/Message';
import { createMessage } from '../../utils/messageUtils';
import { shouldUseCVMHWKnowledge, generateCVMHWResponse } from '../../utils/cvmhw/rogerCVMHWIntegration';

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
    
    // Immediate crisis indicators
    const immediateCrisis = [
      /i am going to (kill myself|end my life|commit suicide)/,
      /i have a plan to (die|kill myself|end it)/,
      /i'm going to hurt myself (today|tonight|now)/,
      /i can't take it anymore.*(?:kill|die|end)/,
      /i have pills.*(?:take them all|overdose)/
    ];

    // Severe crisis indicators  
    const severeCrisis = [
      /want to (die|kill myself|end my life|not be here)/,
      /thoughts of (suicide|killing myself|ending it)/,
      /don'?t want to (live|be alive|exist)/,
      /life.*not worth living/,
      /everyone.*better.*without me/,
      /thinking about.*ending.*all/
    ];

    // Moderate crisis indicators
    const moderateCrisis = [
      /can'?t go on/,
      /feel.*hopeless/,
      /nothing.*matters/,
      /what'?s the point/,
      /tired of.*living/,
      /wish.*never.*born/
    ];

    // Check for immediate crisis
    if (immediateCrisis.some(pattern => pattern.test(input))) {
      return 'immediate';
    }

    // Check for severe crisis
    if (severeCrisis.some(pattern => pattern.test(input))) {
      return 'severe';
    }

    // Check for moderate crisis
    if (moderateCrisis.some(pattern => pattern.test(input))) {
      return 'moderate';
    }

    return 'none';
  }, []);

  const generateCrisisResponse = useCallback((crisisLevel: string, userInput: string): string => {
    const currentTime = Date.now();
    
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
        return `I'm very concerned about what you're sharing. These feelings are serious, and it's important to get professional help right away.

**Immediate Resources:**
• **988 Suicide & Crisis Lifeline** (call or text) - 24/7 support
• **Crisis Text Line** - Text 741741
• **National Alliance on Mental Illness** - 1-800-950-NAMI

**Local Professional Support:**
CVMHW provides professional mental health counseling with Eric Riesterer, LPC, supervised by Wendy Nathan, LPCC-S. They accept most major insurance and offer sliding scale fees. Contact: (440) 294-8068.

**Important:** As mandated reporters under Ohio law, mental health professionals must report imminent safety threats to protect you and ensure you get appropriate help.

Would it be possible for you to reach out to one of these resources today?`;

      case 'moderate':
        return `I hear that you're going through a really difficult time, and I'm concerned about you. These feelings of hopelessness are important to address with professional support.

**Support Resources:**
• **988 Suicide & Crisis Lifeline** - Call or text anytime
• **Crisis Text Line** - Text 741741
• **NAMI Helpline** - 1-800-950-NAMI

**Professional Mental Health Services:**
CVMHW offers therapy services with sliding scale fees and insurance acceptance. Contact (440) 294-8068 to schedule with Eric Riesterer, LPC.

**Remember:** These feelings can change with proper support. You don't have to navigate this alone.

Have you been able to talk to a mental health professional about these feelings?`;

      default:
        return `I'm listening and want to make sure you have the support you need. If you're having thoughts of self-harm, please know that help is available 24/7 through the 988 Suicide & Crisis Lifeline.`;
    }
  }, []);

  const handleCrisisMessage = useCallback((userInput: string): MessageType | null => {
    const crisisLevel = detectCrisisLevel(userInput);
    
    if (crisisLevel !== 'none') {
      const currentTime = Date.now();
      
      // Update crisis tracking
      setRecentCrisisMessage(userInput);
      setConsecutiveCrisisCount(prev => prev + 1);
      lastCrisisTime.current = currentTime;
      
      // Add pattern to tracking
      const normalizedInput = userInput.toLowerCase().substring(0, 50);
      crisisPatterns.current.add(normalizedInput);
      
      // Generate appropriate crisis response
      const crisisResponse = generateCrisisResponse(crisisLevel, userInput);
      
      return createMessage(crisisResponse, 'roger', crisisLevel as any);
    }
    
    return null;
  }, [detectCrisisLevel, generateCrisisResponse]);

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
    const isQuickFollowUp = timeSinceLastCrisis < 60000; // Within 1 minute
    
    return isQuickFollowUp && deceptionPatterns.some(pattern => pattern.test(followUpMessage));
  }, [recentCrisisMessage]);

  const handlePersistentCrisis = useCallback((userInput: string): MessageType | null => {
    // Handle cases where user continues to express crisis after initial response
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

        return createMessage(persistentResponse, 'roger', 'immediate');
      }
    }
    
    return null;
  }, [consecutiveCrisisCount, detectCrisisLevel]);

  // Reset crisis tracking when user shows improvement
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
