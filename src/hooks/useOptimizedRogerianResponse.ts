
/**
 * Optimized Rogerian Response Hook
 * 
 * Uses the new optimized pipeline for better patient care
 */

import { useState, useCallback } from 'react';
import { MessageType } from '../components/Message';
import { createMessage } from '../utils/messageUtils';
import { pipelineRouter } from '../core/PipelineRouter';
import { OptimizedPipelineContext } from '../core/OptimizedPatientPipeline';

/**
 * Optimized hook for generating Rogerian responses
 */
export const useOptimizedRogerianResponse = () => {
  const [isTyping, setIsTyping] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);

  /**
   * Process user message through optimized pipeline
   */
  const processUserMessage = useCallback(async (userInput: string): Promise<MessageType> => {
    setIsTyping(true);
    
    try {
      // Update conversation state
      setMessageCount(prev => prev + 1);
      setConversationHistory(prev => [...prev.slice(-9), userInput]); // Keep last 10 messages
      
      // Create pipeline context
      const context: OptimizedPipelineContext = {
        userInput,
        conversationHistory,
        sessionId: `session_${Date.now()}`,
        messageCount: messageCount + 1,
        timestamp: Date.now()
      };
      
      // Process through optimized pipeline
      const result = await pipelineRouter.route(context);
      
      // Create response message
      const response = createMessage(
        result.response,
        'roger',
        result.crisisDetected ? 'crisis' : null
      );
      
      // Update conversation history with response
      setConversationHistory(prev => [...prev.slice(-9), result.response]);
      
      console.log(`OPTIMIZED PIPELINE: ${result.systemsEngaged.join(', ')} (${result.processingTime}ms, quality: ${result.therapeuticQuality})`);
      
      return response;
      
    } catch (error) {
      console.error('Optimized processing error:', error);
      
      // Fallback response
      return createMessage(
        "I'm here to listen and support you. What would you like to share?",
        'roger'
      );
    } finally {
      setIsTyping(false);
    }
  }, [messageCount, conversationHistory]);

  /**
   * Simulate typing effect
   */
  const simulateTypingResponse = useCallback((
    response: string,
    callback: (text: string) => void
  ): void => {
    setIsTyping(true);
    
    // Simulate typing with realistic speed
    const words = response.split(' ');
    let currentText = '';
    let wordIndex = 0;
    
    const typeWord = () => {
      if (wordIndex < words.length) {
        currentText += (wordIndex > 0 ? ' ' : '') + words[wordIndex];
        callback(currentText);
        wordIndex++;
        
        // Variable delay based on word length and punctuation
        const delay = words[wordIndex - 1].includes('.') ? 200 : 80;
        setTimeout(typeWord, delay);
      } else {
        setIsTyping(false);
      }
    };
    
    typeWord();
  }, []);

  return {
    isTyping,
    processUserMessage,
    simulateTypingResponse,
    messageCount,
    conversationHistory
  };
};
