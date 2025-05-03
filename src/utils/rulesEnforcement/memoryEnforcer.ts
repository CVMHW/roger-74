
/**
 * Memory Enforcer
 * 
 * Applies rules to enhance memory utilization in responses.
 * This ensures Roger demonstrates understanding of the patient's concerns
 * and integrates past conversation details into new responses.
 * 
 * This file now serves as the public API for the memory enforcement system,
 * with implementation details moved to specialized modules.
 */

import { applyMemoryRules } from './memory/enforcer';
import { addToMemoryStorage, getFromMemoryStorage } from './memory/storage';

export {
  applyMemoryRules,
  addToMemoryStorage,
  getFromMemoryStorage
};

export default {
  applyMemoryRules,
  addToMemoryStorage,
  getFromMemoryStorage
};
