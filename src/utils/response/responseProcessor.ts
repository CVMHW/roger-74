
/**
 * Response Processor
 * 
 * Processes responses through the MasterRules system before final delivery
 * UNCONDITIONAL: Ensures memory usage in all responses
 * 
 * This file is a re-export from the modular response processor system.
 * It maintains backward compatibility while allowing for a more
 * maintainable code structure.
 */

export { 
  processResponseThroughMasterRules,
  enhanceResponseWithMemory
} from './processor';
