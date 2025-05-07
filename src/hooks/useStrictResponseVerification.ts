
/**
 * Hook for strict mathematical response verification
 * 
 * Provides logarithmic prediction and verification of responses
 * with integrated specialized topic detection
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
      
      // Use setTimeout to simulate processing time
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
        resolve(result);
      }, 10); // Minimal delay for state updates
    });
  }, []);
  
  /**
   * Calculate appropriate response delay based on verification
   */
  const getResponseDelay = useCallback((
    verificationResult: VerificationResult | null = lastVerificationResult
  ): number => {
    if (!verificationResult) return 500; // Default delay
    return calculateResponseDelay(verificationResult.confidenceScore);
  }, [lastVerificationResult]);
  
  /**
   * Get verification status information
   */
  const getVerificationStatus = useCallback(() => {
    if (!lastVerificationResult) {
      return {
        status: 'unknown',
        confidence: 1.0,
        issues: [] as string[]
      };
    }
    
    return {
      status: lastVerificationResult.isVerified ? 'verified' : 'failed',
      confidence: lastVerificationResult.confidenceScore,
      issues: lastVerificationResult.detectedIssues
    };
  }, [lastVerificationResult]);
  
  return {
    verifyResponse,
    isVerifying,
    getResponseDelay,
    getVerificationStatus,
    lastVerificationResult
  };
};
