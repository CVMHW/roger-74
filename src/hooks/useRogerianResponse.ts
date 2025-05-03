
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

// Initialize the advanced MemoryBank system
initializeMemoryBank();

// Export the hook with all memory safeguards
export default useRogerianResponse;
