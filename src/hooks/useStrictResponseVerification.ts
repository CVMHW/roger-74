/**
 * Hook for strict mathematical response verification
 * 
 * Provides logarithmic prediction and verification of responses
 * with integrated specialized topic detection
 * Now with 25% easier rollback thresholds and stronger prevention
 */

import { useState, useCallback } from 'react';
import { verifyResponseMathematically, calculateResponseDelay, VerificationResult } from '../utils/response/processor/strictVerification';
import { MessageType } from '../components/Message';

/**
 * Hook for strict mathematical verification of responses
 */
export const useStrictResponseVerification = () => {
  const [lastVerificationResult, setLastVerificationResult] = useState<VerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRollingBack, setIsRollingBack] = useState(false);
  const [rollbackLevel, setRollbackLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [rollbackMessage, setRollbackMessage] = useState<string>('');
  
  /**
   * Verify response with strict mathematical models
   * Now with enhanced verification, easier rollbacks, and visual indicators
   */
  const verifyResponse = useCallback((
    responseText: string,
    userInput: string,
    conversationHistory: string[] = []
  ): Promise<VerificationResult> => {
    setIsVerifying(true);
    
    return new Promise((resolve) => {
      // Extract previous responses for verification
      const previousResponses = conversationHistory.filter((_, i) => i % 2 === 1);
      
      // Use setTimeout with increased delay for more thorough processing
      setTimeout(() => {
        // Perform verification - updated to match function signature from strictVerification
        const result = verifyResponseMathematically(
          responseText,
          userInput,
          conversationHistory
        );
        
        // Store result for later access
        setLastVerificationResult(result);
        setIsVerifying(false);
        
        // Set rollback visualization state based on confidence score
        if (result.shouldRollback) {
          setIsRollingBack(true);
          
          // Determine rollback severity level
          if (result.confidenceScore < 0.5) {
            setRollbackLevel('high');
            setRollbackMessage('I need to carefully verify this response as it touches on important concerns.');
          } else if (result.confidenceScore < 0.7) {
            setRollbackLevel('medium');
            setRollbackMessage('I\'m reviewing this response to ensure it addresses your situation accurately.');
          } else {
            setRollbackLevel('low');
            setRollbackMessage('Taking a moment to refine this response for clarity.');
          }
        } else {
          setIsRollingBack(false);
        }
        
        console.log("VERIFICATION RESULT:", {
          confidence: result.confidenceScore.toFixed(2),
          rollback: result.shouldRollback,
          issues: result.detectedIssues,
          action: result.suggestedAction,
          timing: result.responseTiming,
          rollbackLevel: rollbackLevel
        });
        
        resolve(result);
      }, 20); // Slightly increased delay for more thorough processing
    });
  }, []);
  
  /**
   * Calculate appropriate response delay based on verification
   */
  const getResponseDelay = useCallback((
    verificationResult: VerificationResult | null = lastVerificationResult
  ): number => {
    if (!verificationResult) return 625; // Default delay increased by 25%
    return calculateResponseDelay(verificationResult.confidenceScore);
  }, [lastVerificationResult]);
  
  /**
   * Get verification status information with enhanced detail
   */
  const getVerificationStatus = useCallback(() => {
    if (!lastVerificationResult) {
      return {
        status: 'unknown',
        confidence: 1.0,
        issues: [] as string[],
        shouldDelay: false,
        shouldRollback: false,
        recommendedAction: 'proceed',
        isRollingBack: false,
        rollbackLevel: 'low' as const,
        rollbackMessage: ''
      };
    }
    
    return {
      status: lastVerificationResult.isVerified ? 'verified' : 'failed',
      confidence: lastVerificationResult.confidenceScore,
      issues: lastVerificationResult.detectedIssues,
      shouldDelay: lastVerificationResult.responseTiming > 625,
      shouldRollback: lastVerificationResult.shouldRollback,
      recommendedAction: lastVerificationResult.suggestedAction,
      isRollingBack,
      rollbackLevel,
      rollbackMessage
    };
  }, [lastVerificationResult, isRollingBack, rollbackLevel, rollbackMessage]);
  
  /**
   * Determine if response should be rolled back
   * Now 25% easier to trigger rollbacks
   */
  const shouldRollbackResponse = useCallback((): boolean => {
    if (!lastVerificationResult) return false;
    return lastVerificationResult.shouldRollback;
  }, [lastVerificationResult]);
  
  /**
   * Apply rollback states to a message
   */
  const applyRollbackState = useCallback((message: MessageType): MessageType => {
    if (!isRollingBack || message.sender !== 'roger') return message;
    
    return {
      ...message,
      isRollingBack,
      rollbackLevel,
      rollbackMessage
    };
  }, [isRollingBack, rollbackLevel, rollbackMessage]);
  
  /**
   * Get a simpler version of the response if needed
   */
  const getSimplifiedResponse = useCallback((originalResponse: string): string => {
    // Split into sentences
    const sentences = originalResponse.split(/(?<=[.!?])\s+/);
    
    // Keep only the first 1-2 sentences if response is long
    if (sentences.length > 3) {
      return sentences.slice(0, 2).join(' ') + 
        " I'd like to understand more about what you're experiencing. Could you share more about that?";
    }
    
    // For shorter responses, just add a clarifying question
    return originalResponse + " Would you mind sharing more about your experience so I can better understand?";
  }, []);
  
  return {
    verifyResponse,
    isVerifying,
    getResponseDelay,
    getVerificationStatus,
    shouldRollbackResponse,
    getSimplifiedResponse,
    lastVerificationResult,
    isRollingBack,
    rollbackLevel,
    rollbackMessage,
    applyRollbackState
  };
};
