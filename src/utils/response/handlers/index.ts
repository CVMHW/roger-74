
/**
 * Response Handlers - Main export file
 * Re-exports all handler functions from their respective modules
 */

// Emotional handlers
export { createSadnessResponse, createDefensiveReactionResponse } from './emotional';

// Situational handlers
export { createWeatherRelatedResponse, createMildGamblingResponse } from './situational';

// Trauma handlers
export { createTraumaResponseMessage } from './trauma';

// Ohio context handlers
export { createOhioContextResponse } from './ohio';
