
/**
 * Response validation functionality
 * Provides validation and verification of response content
 */

import { checkAllRules } from '../../rulesEnforcement/rulesEnforcer';
import { verifyFiveResponseMemorySystem } from '../../memory/fiveResponseMemory';

/**
 * Verify all systems are operational before response processing
 */
export const verifySystemsOperational = (): boolean => {
  // CRITICAL: First verify that all memory systems are operational
  const fiveResponseMemoryOperational = verifyFiveResponseMemorySystem();
  if (!fiveResponseMemoryOperational) {
    console.error("CRITICAL: 5ResponseMemory system failure detected");
    return false;
  }
  
  // MANDATORY: Check all system rules first
  checkAllRules();
  
  return true;
};
