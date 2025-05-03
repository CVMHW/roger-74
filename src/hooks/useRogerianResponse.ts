
/**
 * This file serves as a configuration entry point for the Rogerian response system.
 * It now incorporates QUAD MEMORY PROTECTION with:
 * 1. Primary NLP memory system
 * 2. 5ResponseMemory backup system
 * 3. Comprehensive chat log review (tertiary safeguard)
 * 4. Advanced MemoryBank with multi-head attention (LM2-inspired)
 */

import useRogerianResponse from './rogerianResponse';
import { initializeMemoryBank } from '../utils/memory/memoryBank';
import { verifyFiveResponseMemorySystem } from '../utils/memory/fiveResponseMemory';
import { checkAllRules } from '../utils/rulesEnforcement/rulesEnforcer';

// Activate all memory protection systems on initialization
const activateMemoryProtectionSystems = (): boolean => {
  try {
    console.log("QUAD MEMORY PROTECTION: Initializing all systems");
    
    // Initialize the advanced MemoryBank system
    const memoryBankInitialized = initializeMemoryBank();
    console.log(`MemoryBank initialized: ${memoryBankInitialized}`);
    
    // Verify 5ResponseMemory system is operational
    const fiveResponseMemoryOperational = verifyFiveResponseMemorySystem();
    console.log(`5ResponseMemory operational: ${fiveResponseMemoryOperational}`);
    
    // Verify all rules are enforced
    const rulesEnforced = checkAllRules();
    console.log(`All rules enforced: ${rulesEnforced}`);
    
    // Check if all systems are operational
    const allSystemsOperational = memoryBankInitialized && 
                                 fiveResponseMemoryOperational && 
                                 rulesEnforced;
    
    console.log(`QUAD MEMORY PROTECTION: All systems operational: ${allSystemsOperational}`);
    return allSystemsOperational;
    
  } catch (error) {
    console.error("CRITICAL: Failed to initialize memory protection systems", error);
    return false;
  }
};

// Activate all memory systems
activateMemoryProtectionSystems();

// Export the hook with all memory safeguards
export default useRogerianResponse;
