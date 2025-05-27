
/**
 * Unified Patient Response Hook
 * 
 * Single hook that integrates all legacy and modern response generation
 * Uses the unified pipeline for consistent, sophisticated responses
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
    sophisticationLevel: 'expert' as const
  });

  /**
   * Process user message through unified pipeline
   */
  const processUserMessage = useCallback(async (userInput: string): Promise<MessageType> => {
    setIsTyping(true);
    
    try {
      // Process through unified pipeline
      const result = await unifiedPipelineRouter.route(userInput, conversationHistory);
      
      // Update conversation history
      setConversationHistory(prev => [...prev, userInput, result.response]);
      
      // Update session statistics
      setSessionStats(prev => ({
        totalMessages: prev.totalMessages + 1,
        averageResponseTime: (prev.averageResponseTime * prev.totalMessages + result.processingTimeMs) / (prev.totalMessages + 1),
        crisisDetections: prev.crisisDetections + (result.crisisDetected ? 1 : 0),
        therapeuticQuality: (prev.therapeuticQuality * prev.totalMessages + result.therapeuticQuality) / (prev.totalMessages + 1),
        sophisticationLevel: 'expert'
      }));
      
      // Create response message
      const response = createMessage(
        result.response,
        'roger',
        result.crisisDetected ? 'crisis' : null
      );
      
      console.log(`UNIFIED RESPONSE: ${result.systemsEngaged.join('+')} (${result.processingTimeMs}ms, Q:${result.therapeuticQuality.toFixed(2)}, Route:${result.pipelineRoute})`);
      
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
    resetConversation,
    getSessionStats,
    getConversationMetrics,
    conversationHistory
  };
};
