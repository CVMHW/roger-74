
/**
 * This file serves as a configuration entry point for the Rogerian response system.
 * It now incorporates TRIPLE MEMORY PROTECTION with:
 * 1. Primary NLP memory system
 * 2. 5ResponseMemory backup system
 * 3. Comprehensive chat log review (tertiary safeguard)
 */

import useRogerianResponse from './rogerianResponse';

// Export the hook with the new tertiary safeguard that ensures complete chat log review
export default useRogerianResponse;
