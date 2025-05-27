
/**
 * Patient-Optimized Response Hook
 * 
 * Simplified hook that prioritizes patient care and response speed
 */

import { useState, useCallback } from 'react';
import { MessageType } from '../components/Message';
import { createMessage } from '../utils/messageUtils';
import { patientRouter } from '../core/PatientRouter';

export const usePatientOptimizedResponse = () => {
  const [isTyping, setIsTyping] = useState(false);
  const [processingStats, setProcessingStats] = useState({
    averageResponseTime: 0,
    totalMessages: 0,
    crisisDetections: 0
  });

  /**
   * Process user message through patient-optimized pipeline
   */
  const processUserMessage = useCallback(async (userInput: string): Promise<MessageType> => {
    setIsTyping(true);
    
    try {
      const startTime = Date.now();
      const result = await patientRouter.route(userInput);
      
      // Update processing statistics
      setProcessingStats(prev => ({
        averageResponseTime: (prev.averageResponseTime * prev.totalMessages + result.processingTimeMs) / (prev.totalMessages + 1),
        totalMessages: prev.totalMessages + 1,
        crisisDetections: prev.crisisDetections + (result.crisisDetected ? 1 : 0)
      }));
      
      // Create response message
      const response = createMessage(
        result.response,
        'roger',
        result.crisisDetected ? 'crisis' : null
      );
      
      console.log(`PATIENT RESPONSE: ${result.systemsUsed.join('+')} (${result.processingTimeMs}ms, Q:${result.therapeuticQuality.toFixed(2)})`);
      
      return response;
      
    } catch (error) {
      console.error('Patient response error:', error);
      
      return createMessage(
        "I'm here to listen and support you. What would you like to share?",
        'roger'
      );
    } finally {
      setIsTyping(false);
    }
  }, []);

  /**
   * Get current processing statistics
   */
  const getProcessingStats = useCallback(() => processingStats, [processingStats]);

  return {
    isTyping,
    processUserMessage,
    getProcessingStats
  };
};
