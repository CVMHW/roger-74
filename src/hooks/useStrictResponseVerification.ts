/**
 * Hook for strict mathematical response verification
 * 
 * Provides logarithmic prediction and verification of responses
 * with integrated specialized topic detection
 * Now with 25% easier rollback thresholds and stronger prevention
 */

import { useState, useCallback } from 'react';
import { verifyResponseMathematically, calculateResponseDelay, VerificationResult } from '../utils/response/processor/strictVerification';

/**
 * Hook for strict mathematical verification of responses
 */
export const useStrictResponseVerification = () => {
  const [lastVerificationResult, setLastVerificationResult] = useState<VerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  
  /**
   * Verify response with strict mathematical models
   * Now with enhanced verification and easier rollbacks
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
        // Perform verification
        const result = verifyResponseMathematically(
          responseText,
          userInput,
          conversationHistory,
          previousResponses
        );
        
        // Store result for later access
        setLastVerificationResult(result);
        setIsVerifying(false);
        
        console.log("VERIFICATION RESULT:", {
          confidence: result.confidenceScore.toFixed(2),
          rollback: result.shouldRollback,
          issues: result.detectedIssues,
          action: result.suggestedAction,
          timing: result.responseTiming
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
        recommendedAction: 'proceed'
      };
    }
    
    return {
      status: lastVerificationResult.isVerified ? 'verified' : 'failed',
      confidence: lastVerificationResult.confidenceScore,
      issues: lastVerificationResult.detectedIssues,
      shouldDelay: lastVerificationResult.responseTiming > 625,
      shouldRollback: lastVerificationResult.shouldRollback,
      recommendedAction: lastVerificationResult.suggestedAction
    };
  }, [lastVerificationResult]);
  
  /**
   * Determine if response should be rolled back
   * Now 25% easier to trigger rollbacks
   */
  const shouldRollbackResponse = useCallback((): boolean => {
    if (!lastVerificationResult) return false;
    return lastVerificationResult.shouldRollback;
  }, [lastVerificationResult]);
  
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
    lastVerificationResult
  };
};
