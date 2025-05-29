/**
 * Unified Roger Hook
 * 
 * Master hook that integrates all legacy and new systems
 * Replaces fragmented hooks with a single, coherent interface
 */

import { useState, useCallback, useEffect } from 'react';
import { unifiedRogerArchitecture, UnifiedArchitectureContext, UnifiedArchitectureResult } from '../core/UnifiedRogerArchitecture';
import { MessageType } from '../components/Message';
import { createMessage } from '../utils/messageUtils';

export interface UnifiedRogerHook {
  processMessage: (userInput: string) => Promise<MessageType>;
  isProcessing: boolean;
  getSystemStatus: () => Promise<any>;
  resetConversation: () => Promise<void>;
  getConversationHistory: () => string[];
  getSessionMetrics: () => {
    totalMessages: number;
    averageConfidence: number;
    systemsUsed: string[];
    processingTime: number;
  };
}

export const useUnifiedRoger = (
  initialSessionId?: string,
  userId?: string
): UnifiedRogerHook => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  const [sessionId] = useState(initialSessionId || `unified_session_${Date.now()}`);
  const [messageCount, setMessageCount] = useState(0);
  const [sessionMetrics, setSessionMetrics] = useState({
    totalMessages: 0,
    averageConfidence: 0,
    systemsUsed: [] as string[],
    totalProcessingTime: 0
  });

  /**
   * Main message processing function
   */
  const processMessage = useCallback(async (userInput: string): Promise<MessageType> => {
    setIsProcessing(true);
    
    try {
      console.log(`🎯 UNIFIED ROGER: Processing message "${userInput.substring(0, 50)}..."`);
      
      // Create unified context
      const context: UnifiedArchitectureContext = {
        userInput,
        userId,
        sessionId,
        conversationHistory,
        messageCount: messageCount + 1,
        isNewSession: messageCount === 0,
        timestamp: Date.now()
      };
      
      // Process through unified architecture
      const result: UnifiedArchitectureResult = await unifiedRogerArchitecture.processUnified(context);
      
      // Update conversation history
      const newHistory = [...conversationHistory, userInput, result.response];
      setConversationHistory(newHistory);
      setMessageCount(prev => prev + 1);
      
      // Update session metrics
      setSessionMetrics(prev => ({
        totalMessages: prev.totalMessages + 1,
        averageConfidence: (prev.averageConfidence * prev.totalMessages + result.confidence) / (prev.totalMessages + 1),
        systemsUsed: [...new Set([...prev.systemsUsed, ...result.systemsEngaged])],
        totalProcessingTime: prev.totalProcessingTime + result.processingTime
      }));
      
      // Create message response with proper argument structure
      const message = createMessage(
        result.response,
        'roger',
        null // No concernType for normal responses
      );
      
      // Add metadata to the message after creation
      message.metadata = {
        confidence: result.confidence,
        processingTime: result.processingTime,
        systemsEngaged: result.systemsEngaged,
        memoryLayers: result.memoryLayers,
        ragEnhanced: result.ragEnhanced,
        crisisDetected: result.crisisDetected,
        evaluationScore: result.evaluationScore,
        auditTrail: result.auditTrail,
        metadata: result.metadata
      };
      
      console.log(`🎯 UNIFIED ROGER: Response generated with confidence ${result.confidence} in ${result.processingTime}ms`);
      console.log(`🎯 Systems engaged: ${result.systemsEngaged.join(', ')}`);
      
      return message;
      
    } catch (error) {
      console.error('🎯 UNIFIED ROGER: Processing error:', error);
      
      // Fallback response with proper argument structure
      const fallbackMessage = createMessage(
        "I'm here to listen and support you. Could you tell me more about what's on your mind?",
        'roger',
        null // No concernType for fallback responses
      );
      
      // Add metadata to the fallback message after creation
      fallbackMessage.metadata = {
        confidence: 0.7,
        errorMessage: error.message,
        fallback: true,
        systemsEngaged: ['error-fallback']
      };
      
      return fallbackMessage;
      
    } finally {
      setIsProcessing(false);
    }
  }, [userId, sessionId, conversationHistory, messageCount]);

  /**
   * Get comprehensive system status
   */
  const getSystemStatus = useCallback(async () => {
    return await unifiedRogerArchitecture.getSystemStatus();
  }, []);

  /**
   * Reset conversation
   */
  const resetConversation = useCallback(async () => {
    console.log('🎯 UNIFIED ROGER: Resetting conversation');
    
    await unifiedRogerArchitecture.resetForNewConversation();
    setConversationHistory([]);
    setMessageCount(0);
    setSessionMetrics({
      totalMessages: 0,
      averageConfidence: 0,
      systemsUsed: [],
      totalProcessingTime: 0
    });
    
    console.log('🎯 UNIFIED ROGER: Conversation reset complete');
  }, []);

  /**
   * Get conversation history
   */
  const getConversationHistory = useCallback(() => {
    return conversationHistory;
  }, [conversationHistory]);

  /**
   * Get session metrics
   */
  const getSessionMetrics = useCallback(() => {
    return {
      totalMessages: sessionMetrics.totalMessages,
      averageConfidence: sessionMetrics.averageConfidence,
      systemsUsed: sessionMetrics.systemsUsed,
      processingTime: sessionMetrics.totalProcessingTime
    };
  }, [sessionMetrics]);

  // Initialize session on mount
  useEffect(() => {
    console.log(`🎯 UNIFIED ROGER: Initialized session ${sessionId}`);
    
    return () => {
      console.log(`🎯 UNIFIED ROGER: Session ${sessionId} cleanup`);
    };
  }, [sessionId]);

  return {
    processMessage,
    isProcessing,
    getSystemStatus,
    resetConversation,
    getConversationHistory,
    getSessionMetrics
  };
};

export default useUnifiedRoger;
