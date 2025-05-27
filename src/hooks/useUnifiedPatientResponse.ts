
/**
 * Unified Patient Response Hook
 * 
 * Updated to use the new unified integration coordinator
 */

import { useState, useCallback } from 'react';
import { MessageType } from '../components/Message';
import { createMessage } from '../utils/messageUtils';
import { unifiedPipelineRouter } from '../core/UnifiedPipelineRouter';

export const useUnifiedPatientResponse = () => {
  const [isTyping, setIsTyping] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  const [sessionStats, setSessionStats] = useState({
    totalMessages: 0,
    averageResponseTime: 0,
    crisisDetections: 0,
    therapeuticQuality: 0,
    sophisticationLevel: 'expert' as const,
    pipelineEfficiency: 0,
    hallucinationsPrevented: 0
  });

  /**
   * Process user message through unified pipeline
   */
  const processUserMessage = useCallback(async (userInput: string): Promise<MessageType> => {
    setIsTyping(true);
    
    try {
      // Process through unified pipeline router
      const result = await unifiedPipelineRouter.route(userInput, conversationHistory);
      
      // Update conversation history
      setConversationHistory(prev => [...prev, userInput, result.text]);
      
      // Update session statistics with new metrics
      setSessionStats(prev => ({
        totalMessages: prev.totalMessages + 1,
        averageResponseTime: (prev.averageResponseTime * prev.totalMessages + result.processingTimeMs) / (prev.totalMessages + 1),
        crisisDetections: prev.crisisDetections + (result.emotionDetected && result.text.includes('crisis') ? 1 : 0),
        therapeuticQuality: (prev.therapeuticQuality * prev.totalMessages + result.confidence) / (prev.totalMessages + 1),
        sophisticationLevel: 'expert',
        pipelineEfficiency: (prev.pipelineEfficiency * prev.totalMessages + result.pipelineEfficiency) / (prev.totalMessages + 1),
        hallucinationsPrevented: prev.hallucinationsPrevented + (result.hallucinationPrevented ? 1 : 0)
      }));
      
      // Create response message
      const response = createMessage(
        result.text,
        'roger',
        result.emotionDetected && result.text.includes('crisis') ? 'crisis' : null
      );
      
      console.log(`UNIFIED RESPONSE: [${result.systemsUsed.join('+')}] ${result.processingTimeMs}ms | Efficiency: ${result.pipelineEfficiency.toFixed(2)} | Emotion: ${result.emotionDetected} | Prevention: ${result.hallucinationPrevented}`);
      
      return response;
      
    } catch (error) {
      console.error('Unified response error:', error);
      
      // Fallback response
      return createMessage(
        "I'm here to listen and support you. What would you like to share?",
        'roger'
      );
    } finally {
      setIsTyping(false);
    }
  }, [conversationHistory]);

  /**
   * Reset conversation for new session
   */
  const resetConversation = useCallback(() => {
    setConversationHistory([]);
    unifiedPipelineRouter.resetSession();
    setSessionStats({
      totalMessages: 0,
      averageResponseTime: 0,
      crisisDetections: 0,
      therapeuticQuality: 0,
      sophisticationLevel: 'expert'
    });
  }, []);

  /**
   * Get current session statistics
   */
  const getSessionStats = useCallback(() => sessionStats, [sessionStats]);

  /**
   * Get conversation metrics
   */
  const getConversationMetrics = useCallback(() => ({
    messageCount: conversationHistory.length / 2, // Divide by 2 since we store both user and roger messages
    lastMessage: conversationHistory[conversationHistory.length - 1] || '',
    averageResponseTime: sessionStats.averageResponseTime,
    therapeuticQuality: sessionStats.therapeuticQuality,
    sophisticationLevel: sessionStats.sophisticationLevel
  }), [conversationHistory, sessionStats]);

  return {
    isTyping,
    processUserMessage,
    resetConversation: useCallback(() => {
      setConversationHistory([]);
      unifiedPipelineRouter.resetSession();
      setSessionStats({
        totalMessages: 0,
        averageResponseTime: 0,
        crisisDetections: 0,
        therapeuticQuality: 0,
        sophisticationLevel: 'expert',
        pipelineEfficiency: 0,
        hallucinationsPrevented: 0
      });
    }, []),
    getSessionStats: useCallback(() => sessionStats, [sessionStats]),
    getConversationMetrics: useCallback(() => ({
      messageCount: conversationHistory.length / 2,
      lastMessage: conversationHistory[conversationHistory.length - 1] || '',
      averageResponseTime: sessionStats.averageResponseTime,
      therapeuticQuality: sessionStats.therapeuticQuality,
      sophisticationLevel: sessionStats.sophisticationLevel,
      pipelineEfficiency: sessionStats.pipelineEfficiency,
      hallucinationsPrevented: sessionStats.hallucinationsPrevented
    }), [conversationHistory, sessionStats]),
    conversationHistory
  };
};
