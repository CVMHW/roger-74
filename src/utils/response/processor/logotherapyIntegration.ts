
/**
 * Logotherapy Integration for Response Processor
 * 
 * Ensures that logotherapy principles are incorporated into all responses
 * UNIVERSAL LAW: All responses must incorporate meaning-centered perspective
 */

import { handleLogotherapyIntegration } from './logotherapy/integrationHandler';

// Re-export the handler function as the main integration point
export { handleLogotherapyIntegration };

// Import and re-export other utilities for backward compatibility
export { 
  determineLogotherapyPathway,
  detectExistentialThemes,
  detectMeaningQuestions
} from './logotherapy/detectionUtils';

export { verifyLogotherapyMemoryUtilization } from './logotherapy/memoryUtils';
